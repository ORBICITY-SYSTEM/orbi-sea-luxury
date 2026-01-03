import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ICalEvent {
  uid: string
  summary: string
  dtstart: Date
  dtend: Date
  status?: string
}

function parseICalDate(dateStr: string): Date {
  // Handle formats like: 20250115, 20250115T100000Z, 20250115T100000
  const cleanStr = dateStr.replace(/[^0-9TZ]/g, '')
  
  if (cleanStr.length === 8) {
    // Date only: YYYYMMDD
    const year = parseInt(cleanStr.substring(0, 4))
    const month = parseInt(cleanStr.substring(4, 6)) - 1
    const day = parseInt(cleanStr.substring(6, 8))
    return new Date(year, month, day)
  } else if (cleanStr.includes('T')) {
    // DateTime: YYYYMMDDTHHMMSS or YYYYMMDDTHHMMSSZ
    const datePart = cleanStr.substring(0, 8)
    const timePart = cleanStr.substring(9, 15)
    
    const year = parseInt(datePart.substring(0, 4))
    const month = parseInt(datePart.substring(4, 6)) - 1
    const day = parseInt(datePart.substring(6, 8))
    const hour = parseInt(timePart.substring(0, 2)) || 0
    const minute = parseInt(timePart.substring(2, 4)) || 0
    const second = parseInt(timePart.substring(4, 6)) || 0
    
    if (cleanStr.endsWith('Z')) {
      return new Date(Date.UTC(year, month, day, hour, minute, second))
    }
    return new Date(year, month, day, hour, minute, second)
  }
  
  return new Date(dateStr)
}

function parseICalContent(icalContent: string): ICalEvent[] {
  const events: ICalEvent[] = []
  const lines = icalContent.replace(/\r\n /g, '').replace(/\r\n\t/g, '').split(/\r?\n/)
  
  let currentEvent: Partial<ICalEvent> | null = null
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    if (trimmedLine === 'BEGIN:VEVENT') {
      currentEvent = {}
    } else if (trimmedLine === 'END:VEVENT') {
      if (currentEvent && currentEvent.uid && currentEvent.dtstart && currentEvent.dtend) {
        events.push(currentEvent as ICalEvent)
      }
      currentEvent = null
    } else if (currentEvent) {
      const colonIndex = trimmedLine.indexOf(':')
      if (colonIndex > -1) {
        let key = trimmedLine.substring(0, colonIndex)
        const value = trimmedLine.substring(colonIndex + 1)
        
        // Handle properties with parameters like DTSTART;VALUE=DATE:20250115
        const semicolonIndex = key.indexOf(';')
        if (semicolonIndex > -1) {
          key = key.substring(0, semicolonIndex)
        }
        
        switch (key.toUpperCase()) {
          case 'UID':
            currentEvent.uid = value
            break
          case 'SUMMARY':
            currentEvent.summary = value
            break
          case 'DTSTART':
            currentEvent.dtstart = parseICalDate(value)
            break
          case 'DTEND':
            currentEvent.dtend = parseICalDate(value)
            break
          case 'STATUS':
            currentEvent.status = value
            break
        }
      }
    }
  }
  
  return events
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { integration_id } = await req.json()
    
    if (!integration_id) {
      throw new Error('integration_id is required')
    }

    console.log(`Starting iCal sync for integration: ${integration_id}`)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get integration details
    const { data: integration, error: integrationError } = await supabase
      .from('channel_integrations')
      .select('*')
      .eq('id', integration_id)
      .single()

    if (integrationError || !integration) {
      throw new Error(`Integration not found: ${integrationError?.message}`)
    }

    if (!integration.ical_url) {
      throw new Error('iCal URL is not configured for this integration')
    }

    console.log(`Fetching iCal from: ${integration.ical_url}`)

    // Fetch iCal content
    const icalResponse = await fetch(integration.ical_url, {
      headers: {
        'User-Agent': 'OrbiCity-Channel-Manager/1.0',
        'Accept': 'text/calendar, application/ics, text/plain',
      },
    })

    if (!icalResponse.ok) {
      throw new Error(`Failed to fetch iCal: ${icalResponse.status} ${icalResponse.statusText}`)
    }

    const icalContent = await icalResponse.text()
    console.log(`Received iCal content: ${icalContent.length} bytes`)

    // Parse iCal events
    const events = parseICalContent(icalContent)
    console.log(`Parsed ${events.length} events from iCal feed`)

    // Filter future events only
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const futureEvents = events.filter(event => event.dtend >= now)
    console.log(`${futureEvents.length} future events to sync`)

    // Get existing blocked dates from this channel for this apartment
    const { data: existingBlocked, error: existingError } = await supabase
      .from('blocked_dates')
      .select('*')
      .eq('apartment_type', integration.apartment_type)
      .ilike('reason', `%${integration.channel_name}%`)

    if (existingError) {
      console.error('Error fetching existing blocked dates:', existingError)
    }

    const existingSet = new Set(
      (existingBlocked || []).map(b => `${b.start_date}-${b.end_date}`)
    )

    // Prepare new blocked dates from iCal events
    const channelConfig: Record<string, string> = {
      booking_com: 'Booking.com',
      airbnb: 'Airbnb',
      expedia: 'Expedia',
      vrbo: 'VRBO',
      other: 'OTA',
    }
    
    const channelName = channelConfig[integration.channel_name] || integration.channel_name
    let addedCount = 0
    let skippedCount = 0

    for (const event of futureEvents) {
      const startDate = event.dtstart.toISOString().split('T')[0]
      const endDate = event.dtend.toISOString().split('T')[0]
      const key = `${startDate}-${endDate}`
      
      if (existingSet.has(key)) {
        skippedCount++
        continue
      }

      const reason = `${event.summary || 'დაჯავშნილი'}`
      
      const { error: insertError } = await supabase
        .from('blocked_dates')
        .insert({
          apartment_type: integration.apartment_type,
          start_date: startDate,
          end_date: endDate,
          reason: reason,
          source: integration.channel_name,
          external_id: event.uid,
          integration_id: integration.id,
        })

      if (insertError) {
        console.error(`Failed to insert blocked date: ${insertError.message}`)
      } else {
        addedCount++
        existingSet.add(key)
      }
    }

    console.log(`Sync complete: ${addedCount} added, ${skippedCount} skipped (already exist)`)

    // Update integration status
    const { error: updateError } = await supabase
      .from('channel_integrations')
      .update({
        last_synced_at: new Date().toISOString(),
        sync_errors: null,
      })
      .eq('id', integration_id)

    if (updateError) {
      console.error('Failed to update integration status:', updateError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        events_found: events.length,
        future_events: futureEvents.length,
        added: addedCount,
        skipped: skippedCount,
        channel: channelName,
        apartment_type: integration.apartment_type,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Sync error:', errorMessage)

    // Try to update integration with error
    try {
      const { integration_id } = await req.clone().json()
      if (integration_id) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const supabase = createClient(supabaseUrl, supabaseServiceKey)
        
        await supabase
          .from('channel_integrations')
          .update({ sync_errors: errorMessage })
          .eq('id', integration_id)
      }
    } catch (e) {
      console.error('Failed to update error status:', e)
    }

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
