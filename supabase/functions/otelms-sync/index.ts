import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-sync-key',
};

interface OtelMSBooking {
  guest_name: string;
  guest_email?: string;
  guest_phone?: string;
  check_in: string;
  check_out: string;
  apartment_type: string;
  room_number?: string;
  guests?: number;
  total_price?: number;
  balance?: number;
  payment_status?: string;
  source?: string;
  status?: string;
  notes?: string;
  external_id?: string;
}

interface SyncPayload {
  bookings: OtelMSBooking[];
  sync_source?: string;
  email_date?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const syncKey = Deno.env.get('OTELMS_SYNC_KEY');

  // Validate sync key if configured
  const requestSyncKey = req.headers.get('x-sync-key');
  if (syncKey && requestSyncKey !== syncKey) {
    console.error('Invalid sync key provided');
    return new Response(
      JSON.stringify({ error: 'Unauthorized - Invalid sync key' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Create sync log entry
  const { data: syncLog, error: logError } = await supabase
    .from('otelms_sync_logs')
    .insert({
      sync_type: 'email_parse',
      source: 'n8n',
      status: 'processing',
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (logError) {
    console.error('Failed to create sync log:', logError);
  }

  const syncLogId = syncLog?.id;

  try {
    const payload: SyncPayload = await req.json();
    console.log('Received sync payload:', JSON.stringify(payload, null, 2));

    if (!payload.bookings || !Array.isArray(payload.bookings)) {
      throw new Error('Invalid payload: bookings array is required');
    }

    // Update sync log with raw data
    if (syncLogId) {
      await supabase
        .from('otelms_sync_logs')
        .update({ raw_data: payload })
        .eq('id', syncLogId);
    }

    let recordsCreated = 0;
    let recordsUpdated = 0;
    let recordsFailed = 0;
    const errors: string[] = [];

    for (const booking of payload.bookings) {
      try {
        // Validate required fields
        if (!booking.guest_name || !booking.check_in || !booking.check_out || !booking.apartment_type) {
          throw new Error(`Missing required fields for booking: ${JSON.stringify(booking)}`);
        }

        // Parse dates
        const checkIn = new Date(booking.check_in);
        const checkOut = new Date(booking.check_out);

        if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
          throw new Error(`Invalid dates for booking: ${booking.check_in} - ${booking.check_out}`);
        }

        // Check if booking already exists (by external_id or matching criteria)
        let existingBooking = null;

        if (booking.external_id) {
          const { data } = await supabase
            .from('bookings')
            .select('id')
            .eq('notes', `OtelMS ID: ${booking.external_id}`)
            .maybeSingle();
          existingBooking = data;
        }

        // Also check by guest name + dates + apartment
        if (!existingBooking) {
          const { data } = await supabase
            .from('bookings')
            .select('id')
            .eq('guest_name', booking.guest_name)
            .eq('check_in', checkIn.toISOString().split('T')[0])
            .eq('check_out', checkOut.toISOString().split('T')[0])
            .eq('apartment_type', booking.apartment_type)
            .maybeSingle();
          existingBooking = data;
        }

        // Determine payment status
        let paymentStatus = 'unpaid';
        if (booking.payment_status) {
          paymentStatus = booking.payment_status.toLowerCase().includes('paid') ? 'paid' : 'unpaid';
        } else if (booking.balance !== undefined) {
          paymentStatus = booking.balance <= 0 ? 'paid' : 'unpaid';
        }

        // Determine booking status
        let status = 'confirmed';
        if (booking.status) {
          const statusLower = booking.status.toLowerCase();
          if (statusLower.includes('cancel')) status = 'cancelled';
          else if (statusLower.includes('pending')) status = 'pending';
          else if (statusLower.includes('confirm')) status = 'confirmed';
        }

        const bookingData = {
          guest_name: booking.guest_name,
          guest_email: booking.guest_email || null,
          guest_phone: booking.guest_phone || null,
          check_in: checkIn.toISOString().split('T')[0],
          check_out: checkOut.toISOString().split('T')[0],
          apartment_type: booking.apartment_type,
          guests: booking.guests || 2,
          total_price: booking.total_price || null,
          payment_status: paymentStatus,
          status: status,
          notes: booking.external_id 
            ? `OtelMS ID: ${booking.external_id}${booking.notes ? '\n' + booking.notes : ''}` 
            : `OtelMS Sync: ${payload.sync_source || 'n8n'}${booking.notes ? '\n' + booking.notes : ''}`,
          updated_at: new Date().toISOString(),
        };

        if (existingBooking) {
          // Update existing booking
          const { error: updateError } = await supabase
            .from('bookings')
            .update(bookingData)
            .eq('id', existingBooking.id);

          if (updateError) throw updateError;
          recordsUpdated++;
          console.log(`Updated booking: ${existingBooking.id}`);
        } else {
          // Create new booking - need a user_id, use a system user or the first admin
          const { data: adminUser } = await supabase
            .from('user_roles')
            .select('user_id')
            .eq('role', 'admin')
            .limit(1)
            .maybeSingle();

          const { error: insertError } = await supabase
            .from('bookings')
            .insert({
              ...bookingData,
              user_id: adminUser?.user_id || '00000000-0000-0000-0000-000000000000',
              payment_method: 'channel',
            });

          if (insertError) throw insertError;
          recordsCreated++;
          console.log(`Created new booking for: ${booking.guest_name}`);
        }
      } catch (bookingError) {
        recordsFailed++;
        const errorMsg = bookingError instanceof Error ? bookingError.message : String(bookingError);
        errors.push(`Booking "${booking.guest_name}": ${errorMsg}`);
        console.error('Booking processing error:', errorMsg);
      }
    }

    // Update sync log with results
    if (syncLogId) {
      await supabase
        .from('otelms_sync_logs')
        .update({
          status: recordsFailed > 0 ? 'partial' : 'success',
          records_processed: payload.bookings.length,
          records_created: recordsCreated,
          records_updated: recordsUpdated,
          records_failed: recordsFailed,
          error_message: errors.length > 0 ? errors.join('; ') : null,
          completed_at: new Date().toISOString(),
        })
        .eq('id', syncLogId);
    }

    const response = {
      success: true,
      sync_id: syncLogId,
      summary: {
        total: payload.bookings.length,
        created: recordsCreated,
        updated: recordsUpdated,
        failed: recordsFailed,
      },
      errors: errors.length > 0 ? errors : undefined,
    };

    console.log('Sync completed:', response);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Sync error:', errorMessage);

    // Update sync log with error
    if (syncLogId) {
      await supabase
        .from('otelms_sync_logs')
        .update({
          status: 'error',
          error_message: errorMessage,
          completed_at: new Date().toISOString(),
        })
        .eq('id', syncLogId);
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        sync_id: syncLogId 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
