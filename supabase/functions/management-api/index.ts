import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get API key from request header
    const apiKey = req.headers.get('x-api-key');
    const expectedApiKey = Deno.env.get('BOOKINGS_API_KEY');
    
    if (!apiKey || apiKey !== expectedApiKey) {
      console.log('Unauthorized request - invalid API key');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid API key' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Fetching management data...');

    // Fetch all data in parallel
    const [
      bookingsResult,
      profilesResult,
      loyaltyResult,
      contactsResult,
      promoCodesResult,
      blockedDatesResult,
      apartmentPricesResult,
      seasonalPricesResult
    ] = await Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*'),
      supabase.from('loyalty_points').select('*'),
      supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
      supabase.from('promo_codes').select('*'),
      supabase.from('blocked_dates').select('*'),
      supabase.from('apartment_prices').select('*').order('display_order'),
      supabase.from('seasonal_prices').select('*')
    ]);

    // Check for errors
    if (bookingsResult.error) throw new Error(`Bookings error: ${bookingsResult.error.message}`);
    if (profilesResult.error) throw new Error(`Profiles error: ${profilesResult.error.message}`);
    if (loyaltyResult.error) throw new Error(`Loyalty error: ${loyaltyResult.error.message}`);
    if (contactsResult.error) throw new Error(`Contacts error: ${contactsResult.error.message}`);
    if (promoCodesResult.error) throw new Error(`Promo codes error: ${promoCodesResult.error.message}`);
    if (blockedDatesResult.error) throw new Error(`Blocked dates error: ${blockedDatesResult.error.message}`);
    if (apartmentPricesResult.error) throw new Error(`Apartment prices error: ${apartmentPricesResult.error.message}`);
    if (seasonalPricesResult.error) throw new Error(`Seasonal prices error: ${seasonalPricesResult.error.message}`);

    const bookings = bookingsResult.data || [];
    const profiles = profilesResult.data || [];
    const loyaltyPoints = loyaltyResult.data || [];
    const contacts = contactsResult.data || [];
    const promoCodes = promoCodesResult.data || [];
    const blockedDates = blockedDatesResult.data || [];
    const apartmentPrices = apartmentPricesResult.data || [];
    const seasonalPrices = seasonalPricesResult.data || [];

    // Get user emails from auth
    const usersWithEmails = await Promise.all(
      profiles.map(async (profile) => {
        try {
          const { data: authUser } = await supabase.auth.admin.getUserById(profile.user_id);
          return {
            ...profile,
            email: authUser?.user?.email || null,
            last_sign_in: authUser?.user?.last_sign_in_at || null,
            created_at_auth: authUser?.user?.created_at || null
          };
        } catch {
          return { ...profile, email: null, last_sign_in: null, created_at_auth: null };
        }
      })
    );

    // Calculate statistics
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString().split('T')[0];

    const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
    const pendingBookings = bookings.filter(b => b.status === 'pending');
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled');
    
    const todayCheckIns = bookings.filter(b => b.check_in === today && b.status === 'confirmed');
    const todayCheckOuts = bookings.filter(b => b.check_out === today && b.status === 'confirmed');
    
    const monthlyBookings = bookings.filter(b => b.created_at >= startOfMonth);
    const weeklyBookings = bookings.filter(b => b.created_at >= startOfWeek);
    
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
    const monthlyRevenue = monthlyBookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + (b.total_price || 0), 0);
    const weeklyRevenue = weeklyBookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + (b.total_price || 0), 0);

    const totalLoyaltyPoints = loyaltyPoints.reduce((sum, l) => sum + (l.points || 0), 0);
    const activePromoCodes = promoCodes.filter(p => p.is_active).length;

    const stats = {
      // Booking stats
      totalBookings: bookings.length,
      confirmedBookings: confirmedBookings.length,
      pendingBookings: pendingBookings.length,
      cancelledBookings: cancelledBookings.length,
      todayCheckIns: todayCheckIns.length,
      todayCheckOuts: todayCheckOuts.length,
      weeklyBookings: weeklyBookings.length,
      monthlyBookings: monthlyBookings.length,
      
      // Revenue stats
      totalRevenue,
      monthlyRevenue,
      weeklyRevenue,
      averageBookingValue: confirmedBookings.length > 0 ? totalRevenue / confirmedBookings.length : 0,
      
      // User stats
      totalUsers: profiles.length,
      totalLoyaltyPoints,
      
      // Other stats
      totalContacts: contacts.length,
      newContacts: contacts.filter(c => c.status === 'new').length,
      activePromoCodes,
      totalApartments: apartmentPrices.length,
      
      // Generated at
      generatedAt: new Date().toISOString()
    };

    console.log('Management data fetched successfully');

    const responseData = {
      success: true,
      data: {
        bookings,
        users: usersWithEmails,
        loyaltyPoints,
        contacts,
        promoCodes,
        blockedDates,
        apartmentPrices,
        seasonalPrices,
        stats
      }
    };

    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in management-api:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
