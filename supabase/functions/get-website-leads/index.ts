import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Received request to get-website-leads');

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the user from the auth header
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User authenticated:', user.id);

    // Check if user is admin
    const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (roleError) {
      console.error('Role check error:', roleError);
      throw roleError;
    }

    if (!isAdmin) {
      console.error('User is not admin:', user.id);
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Admin access verified. Fetching data...');

    // Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('Profiles error:', profilesError);
      throw profilesError;
    }

    console.log(`Found ${profiles?.length || 0} profiles`);

    // Get user emails and details from auth.users
    const userIds = profiles?.map(p => p.user_id) || [];
    const usersWithEmails = [];
    
    for (const userId of userIds) {
      const { data: { user: authUser }, error: userError } = await supabase.auth.admin.getUserById(userId);
      if (authUser && !userError) {
        const profile = profiles?.find(p => p.user_id === userId);
        usersWithEmails.push({
          ...profile,
          email: authUser.email,
          email_confirmed: authUser.email_confirmed_at ? true : false,
          last_sign_in: authUser.last_sign_in_at,
          created_at_auth: authUser.created_at
        });
      }
    }

    console.log(`Enriched ${usersWithEmails.length} users with email data`);

    // Get all bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (bookingsError) {
      console.error('Bookings error:', bookingsError);
      throw bookingsError;
    }

    console.log(`Found ${bookings?.length || 0} bookings`);

    // Get loyalty points
    const { data: loyaltyPoints, error: loyaltyError } = await supabase
      .from('loyalty_points')
      .select('*')
      .order('points', { ascending: false });

    if (loyaltyError) {
      console.error('Loyalty error:', loyaltyError);
      throw loyaltyError;
    }

    console.log(`Found ${loyaltyPoints?.length || 0} loyalty point records`);

    // Calculate statistics
    const confirmedBookings = bookings?.filter(b => b.status === 'confirmed') || [];
    const pendingBookings = bookings?.filter(b => b.status === 'pending') || [];
    const cancelledBookings = bookings?.filter(b => b.status === 'cancelled') || [];
    
    const stats = {
      total_users: usersWithEmails.length,
      confirmed_users: usersWithEmails.filter(u => u.email_confirmed).length,
      total_bookings: bookings?.length || 0,
      confirmed_bookings: confirmedBookings.length,
      pending_bookings: pendingBookings.length,
      cancelled_bookings: cancelledBookings.length,
      total_revenue: bookings?.reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0) || 0,
      confirmed_revenue: confirmedBookings.reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0),
      users_with_bookings: new Set(bookings?.map(b => b.user_id)).size || 0,
      total_loyalty_points: loyaltyPoints?.reduce((sum, lp) => sum + (lp.points || 0), 0) || 0,
      users_with_loyalty_points: loyaltyPoints?.filter(lp => lp.points > 0).length || 0
    };

    console.log('Statistics calculated:', stats);
    console.log('Successfully fetched all website leads data');

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          users: usersWithEmails,
          bookings: bookings || [],
          loyalty_points: loyaltyPoints || [],
          stats
        },
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in get-website-leads:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
