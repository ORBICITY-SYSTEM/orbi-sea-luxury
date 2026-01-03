import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const apiKey = Deno.env.get('BOOKINGS_API_KEY')

    // Check API key authentication
    const providedApiKey = req.headers.get('x-api-key')
    
    if (!apiKey || providedApiKey !== apiKey) {
      console.error('Invalid or missing API key')
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid API key' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse query parameters
    const url = new URL(req.url)
    const status = url.searchParams.get('status')
    const fromDate = url.searchParams.get('from_date')
    const toDate = url.searchParams.get('to_date')
    const apartmentType = url.searchParams.get('apartment_type')
    const limit = parseInt(url.searchParams.get('limit') || '100')
    const offset = parseInt(url.searchParams.get('offset') || '0')
    const format = url.searchParams.get('format') || 'json' // json or csv

    console.log('Fetching bookings with filters:', { status, fromDate, toDate, apartmentType, limit, offset })

    // Build query
    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }
    if (fromDate) {
      query = query.gte('check_in', fromDate)
    }
    if (toDate) {
      query = query.lte('check_out', toDate)
    }
    if (apartmentType) {
      query = query.eq('apartment_type', apartmentType)
    }

    const { data: bookings, error, count } = await query

    if (error) {
      console.error('Error fetching bookings:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch bookings', details: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Successfully fetched ${bookings?.length || 0} bookings`)

    // Return CSV format if requested
    if (format === 'csv') {
      const headers = [
        'id', 'guest_name', 'guest_email', 'guest_phone', 'guest_id_number', 'guest_address',
        'apartment_type', 'check_in', 'check_out', 'guests', 'total_price', 'discount_amount',
        'promo_code', 'status', 'payment_status', 'payment_method', 'special_requests', 'notes',
        'created_at', 'updated_at'
      ]

      const csvRows = [headers.join(',')]
      
      for (const booking of bookings || []) {
        const row = headers.map(header => {
          const value = booking[header as keyof typeof booking]
          if (value === null || value === undefined) return ''
          // Escape quotes and wrap in quotes if contains comma
          const stringValue = String(value)
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        })
        csvRows.push(row.join(','))
      }

      return new Response(csvRows.join('\n'), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="bookings_${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    // Return JSON format
    return new Response(
      JSON.stringify({
        success: true,
        data: bookings,
        meta: {
          count: bookings?.length || 0,
          offset,
          limit,
          filters: { status, fromDate, toDate, apartmentType }
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(error) }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
