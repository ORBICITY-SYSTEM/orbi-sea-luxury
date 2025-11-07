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

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header');
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

    // Check if user is admin
    const { data: isAdmin } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (!isAdmin) {
      console.error('User is not admin');
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get all profiles with user emails
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('Profiles error:', profilesError);
      throw profilesError;
    }

    // Get user emails from auth.users
    const userIds = profiles?.map(p => p.user_id) || [];
    const usersWithEmails = [];
    
    for (const userId of userIds) {
      const { data: { user: authUser } } = await supabase.auth.admin.getUserById(userId);
      if (authUser) {
        const profile = profiles?.find(p => p.user_id === userId);
        usersWithEmails.push({
          ...profile,
          email: authUser.email,
          email_confirmed: authUser.email_confirmed_at ? true : false,
          last_sign_in: authUser.last_sign_in_at
        });
      }
    }

    // Get all bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (bookingsError) {
      console.error('Bookings error:', bookingsError);
      throw bookingsError;
    }

    // Get loyalty points
    const { data: loyaltyPoints, error: loyaltyError } = await supabase
      .from('loyalty_points')
      .select('*');

    if (loyaltyError) {
      console.error('Loyalty error:', loyaltyError);
      throw loyaltyError;
    }

    // Calculate statistics
    const stats = {
      total_users: usersWithEmails.length,
      total_bookings: bookings?.length || 0,
      confirmed_bookings: bookings?.filter(b => b.status === 'confirmed').length || 0,
      pending_bookings: bookings?.filter(b => b.status === 'pending').length || 0,
      cancelled_bookings: bookings?.filter(b => b.status === 'cancelled').length || 0,
      total_revenue: bookings?.reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0) || 0,
      users_with_bookings: new Set(bookings?.map(b => b.user_id)).size || 0
    };

    console.log('Successfully fetched website leads data');

    return new Response(
      JSON.stringify({
        users: usersWithEmails,
        bookings: bookings || [],
        loyalty_points: loyaltyPoints || [],
        stats
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
