import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to find Place ID by searching for the hotel name
async function findPlaceId(apiKey: string): Promise<string | null> {
  const searchQuery = 'Orbi City Batumi';
  const location = '41.6431,41.6347'; // Batumi coordinates
  
  try {
    // Use Find Place API to get Place ID
    const findPlaceUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(searchQuery)}&inputtype=textquery&locationbias=point:${location}&fields=place_id,name,formatted_address&key=${apiKey}`;
    
    console.log('Searching for place:', searchQuery);
    const response = await fetch(findPlaceUrl);
    const data = await response.json();
    
    console.log('Find Place response:', JSON.stringify(data));
    
    if (data.status === 'OK' && data.candidates && data.candidates.length > 0) {
      console.log('Found place:', data.candidates[0].name, 'Place ID:', data.candidates[0].place_id);
      return data.candidates[0].place_id;
    }
    
    // Fallback: try text search
    const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent('Orbi City Aparthotel Batumi Georgia')}&key=${apiKey}`;
    console.log('Trying text search...');
    const textResponse = await fetch(textSearchUrl);
    const textData = await textResponse.json();
    
    console.log('Text Search response:', JSON.stringify(textData));
    
    if (textData.status === 'OK' && textData.results && textData.results.length > 0) {
      console.log('Found via text search:', textData.results[0].name, 'Place ID:', textData.results[0].place_id);
      return textData.results[0].place_id;
    }
    
    return null;
  } catch (error) {
    console.error('Error finding place ID:', error);
    return null;
  }
}

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
      // First, try to find the place ID dynamically
      let targetPlaceId = placeId;
      
      if (!targetPlaceId) {
        console.log('No Place ID provided, searching for Orbi City...');
        targetPlaceId = await findPlaceId(GOOGLE_MAPS_API_KEY);
        
        if (!targetPlaceId) {
          console.log('Could not find Place ID, returning fallback data');
          // Return fallback data if we can't find the place
          return new Response(JSON.stringify({
            success: true,
            data: {
              name: 'Orbi City Sea View Aparthotel',
              rating: 4.5,
              user_ratings_total: 150,
              formatted_address: '7 Sheriff Khimshiashvili Street, Batumi 6010, Georgia',
              reviews: []
            },
            fallback: true
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      console.log('Fetching place details for Place ID:', targetPlaceId);
      
      // Fetch place details including reviews
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${targetPlaceId}&fields=name,rating,user_ratings_total,reviews,formatted_address,geometry,photos,opening_hours,website,formatted_phone_number&key=${GOOGLE_MAPS_API_KEY}`
      );
      
      const data = await response.json();
      console.log('Place details response status:', data.status);
      
      if (data.status !== 'OK') {
        console.error('Google Places API error:', data);
        // Return fallback data instead of throwing error
        return new Response(JSON.stringify({
          success: true,
          data: {
            name: 'Orbi City Sea View Aparthotel',
            rating: 4.5,
            user_ratings_total: 150,
            formatted_address: '7 Sheriff Khimshiashvili Street, Batumi 6010, Georgia',
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
