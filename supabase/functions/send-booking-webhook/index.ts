import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface BookingData {
  id: string;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  apartment_type: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number | null;
  status: string;
  payment_status: string;
  special_requests: string | null;
  promo_code: string | null;
  created_at: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get booking data from request
    const { booking } = await req.json() as { booking: BookingData }

    if (!booking) {
      console.error('No booking data provided')
      return new Response(
        JSON.stringify({ error: 'No booking data provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Processing webhook for booking:', booking.id)

    // Get webhook URL from site_settings
    const { data: webhookSetting, error: settingError } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'booking_webhook_url')
      .single()

    if (settingError || !webhookSetting?.value) {
      console.log('No webhook URL configured, skipping webhook')
      return new Response(
        JSON.stringify({ success: true, message: 'No webhook URL configured' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const webhookUrl = webhookSetting.value.trim()
    
    if (!webhookUrl) {
      console.log('Webhook URL is empty, skipping')
      return new Response(
        JSON.stringify({ success: true, message: 'Webhook URL is empty' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Sending webhook to:', webhookUrl)

    // Prepare webhook payload
    const webhookPayload = {
      event: 'booking.created',
      timestamp: new Date().toISOString(),
      data: {
        booking_id: booking.id,
        guest: {
          name: booking.guest_name,
          email: booking.guest_email,
          phone: booking.guest_phone,
        },
        reservation: {
          apartment_type: booking.apartment_type,
          check_in: booking.check_in,
          check_out: booking.check_out,
          guests: booking.guests,
          total_price: booking.total_price,
          status: booking.status,
          payment_status: booking.payment_status,
          special_requests: booking.special_requests,
          promo_code: booking.promo_code,
        },
        created_at: booking.created_at,
      }
    }

    // Send webhook
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Source': 'orbi-city-batumi',
        'X-Webhook-Event': 'booking.created',
      },
      body: JSON.stringify(webhookPayload),
    })

    const responseStatus = webhookResponse.status
    let responseBody = ''
    
    try {
      responseBody = await webhookResponse.text()
    } catch (e) {
      responseBody = 'Could not read response body'
    }

    console.log('Webhook response status:', responseStatus)
    console.log('Webhook response body:', responseBody)

    if (!webhookResponse.ok) {
      console.error('Webhook failed with status:', responseStatus)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Webhook delivery failed',
          status: responseStatus,
          response: responseBody 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook delivered successfully',
        status: responseStatus 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
