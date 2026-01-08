import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key, x-timestamp, x-signature',
};

// In-memory rate limiting (resets on function cold start, but provides basic protection)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 30; // Max requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }
  
  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

// HMAC signature verification for additional security layer
async function verifySignature(
  apiKey: string,
  timestamp: string,
  providedSignature: string
): Promise<boolean> {
  try {
    // Signature should be HMAC-SHA256 of "timestamp:apiKey"
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(apiKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const data = encoder.encode(`${timestamp}:management-api`);
    const signature = await crypto.subtle.sign('HMAC', key, data);
    const expectedSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return expectedSignature === providedSignature;
  } catch {
    return false;
  }
}

// Check if timestamp is within acceptable window (5 minutes)
function isTimestampValid(timestamp: string): boolean {
  const requestTime = parseInt(timestamp, 10);
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  
  return !isNaN(requestTime) && Math.abs(now - requestTime) < fiveMinutes;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Get client identifier for rate limiting (use IP or API key)
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                   req.headers.get('cf-connecting-ip') || 
                   'unknown';
  
  // Check rate limit
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    console.warn(`Rate limit exceeded for IP: ${clientIp}`);
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      { 
        status: 429, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Retry-After': '60',
          'X-RateLimit-Remaining': '0'
        } 
      }
    );
  }

  try {
    // Get API key from request header
    const apiKey = req.headers.get('x-api-key');
    const expectedApiKey = Deno.env.get('BOOKINGS_API_KEY');
    const timestamp = req.headers.get('x-timestamp');
    const signature = req.headers.get('x-signature');
    
    // Validate API key exists
    if (!apiKey || apiKey !== expectedApiKey) {
      console.warn(`Unauthorized request from IP: ${clientIp} - invalid API key`);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid API key' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Optional: If signature is provided, verify it for enhanced security
    // This allows backwards compatibility while encouraging signed requests
    if (signature && timestamp) {
      if (!isTimestampValid(timestamp)) {
        console.warn(`Request timestamp expired or invalid from IP: ${clientIp}`);
        return new Response(
          JSON.stringify({ error: 'Request timestamp expired or invalid' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const isValidSignature = await verifySignature(apiKey, timestamp, signature);
      if (!isValidSignature) {
        console.warn(`Invalid signature from IP: ${clientIp}`);
        return new Response(
          JSON.stringify({ error: 'Invalid request signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Audit log: Log successful authenticated access
    console.log(`[AUDIT] Management API accessed by IP: ${clientIp} at ${new Date().toISOString()}`);

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

    console.log(`[AUDIT] Management data fetched successfully for IP: ${clientIp}`);

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
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': rateLimit.remaining.toString()
        } 
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error(`[AUDIT] Error in management-api for IP ${clientIp}:`, error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
