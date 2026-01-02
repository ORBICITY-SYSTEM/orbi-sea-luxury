import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    const { action, placeId } = await req.json();

    // Orbi City Sea View Aparthotel Place ID
    const targetPlaceId = placeId || 'ChIJG7qLlBWGREARaAJZj86rqeI';

    if (action === 'getPlaceDetails') {
      // Fetch place details including reviews
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${targetPlaceId}&fields=name,rating,user_ratings_total,reviews,formatted_address,geometry,photos,opening_hours,website,formatted_phone_number&key=${GOOGLE_MAPS_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status !== 'OK') {
        console.error('Google Places API error:', data);
        throw new Error(`Google Places API error: ${data.status}`);
      }

      return new Response(JSON.stringify({
        success: true,
        data: data.result
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'getApiKey') {
      // Return API key for client-side maps (public key is safe to expose)
      return new Response(JSON.stringify({
        success: true,
        apiKey: GOOGLE_MAPS_API_KEY
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error in google-places function:', err);
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
