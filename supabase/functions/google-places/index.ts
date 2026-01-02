import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Your specific business Place ID - Orbi City Sea View Aparthotel in Batumi (60 apartments)
// NOT the entire Orbi City complex (15,000 apartments)
const YOUR_BUSINESS_PLACE_ID = 'ChIJxf79LQmHZ0ARpmv2Eih-1WE';
const BUSINESS_NAME = 'Orbi City Sea View Aparthotel in Batumi';
const BUSINESS_ADDRESS = '7b Sherif Khimshiashvili St, Batumi 6010, Georgia';
const BUSINESS_PHONE = '555 19 90 90';

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

    if (action === 'getPlaceDetails') {
      // Use your specific business Place ID directly
      const targetPlaceId = placeId || YOUR_BUSINESS_PLACE_ID;
      
      console.log('Fetching place details for Place ID:', targetPlaceId);
      
      // Fetch place details including reviews
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${targetPlaceId}&fields=name,rating,user_ratings_total,reviews,formatted_address,geometry,photos,opening_hours,website,formatted_phone_number&key=${GOOGLE_MAPS_API_KEY}`
      );
      
      const data = await response.json();
      console.log('Place details response status:', data.status);
      
      if (data.status !== 'OK') {
        console.error('Google Places API error:', data);
        // Return fallback data with correct coordinates
        return new Response(JSON.stringify({
          success: true,
          data: {
            name: BUSINESS_NAME,
            rating: 4.5,
            user_ratings_total: 100,
            formatted_address: BUSINESS_ADDRESS,
            formatted_phone_number: BUSINESS_PHONE,
            geometry: {
              location: {
                lat: 41.6399416,
                lng: 41.6141119
              }
            },
            reviews: []
          },
          fallback: true
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
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
