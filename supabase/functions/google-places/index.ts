import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Your specific business details - Orbi City Sea View Aparthotel in Batumi (60 apartments)
// NOT the entire Orbi City complex (15,000 apartments)
const BUSINESS_SEARCH_QUERY = 'Orbi City Sea view Aparthotel in Batumi';
const BUSINESS_ADDRESS = '7b Sherif Khimshiashvili St, Batumi 6010, Georgia';
const BUSINESS_PHONE = '555 19 90 90';

// Function to find your specific business Place ID
async function findPlaceId(apiKey: string): Promise<string | null> {
  try {
    // Search specifically for YOUR business: "Orbi City Sea view Aparthotel in Batumi"
    const searchQueries = [
      'Orbi City Sea view Aparthotel in Batumi',
      'Orbi City Sea View Aparthotel Batumi Georgia',
      'Orbi City Sea view Aparthotel 7b Sherif Khimshiashvili Batumi'
    ];
    
    for (const searchQuery of searchQueries) {
      console.log('Searching for:', searchQuery);
      
      // Use Find Place API
      const findPlaceUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(searchQuery)}&inputtype=textquery&fields=place_id,name,formatted_address,rating,user_ratings_total&key=${apiKey}`;
      
      const response = await fetch(findPlaceUrl);
      const data = await response.json();
      
      console.log('Find Place response:', JSON.stringify(data));
      
      if (data.status === 'OK' && data.candidates && data.candidates.length > 0) {
        // Find the one that matches YOUR business (around 100 reviews, rating ~2.9)
        // Not the large Orbi City complex (1000+ reviews)
        for (const candidate of data.candidates) {
          console.log('Candidate:', candidate.name, 'Reviews:', candidate.user_ratings_total, 'Rating:', candidate.rating);
          
          // Your business has around 100 reviews, not 1000+
          if (candidate.user_ratings_total && candidate.user_ratings_total < 500) {
            console.log('Found YOUR business:', candidate.name, 'Place ID:', candidate.place_id);
            return candidate.place_id;
          }
        }
        
        // If no match by review count, return first result
        console.log('Returning first candidate:', data.candidates[0].name);
        return data.candidates[0].place_id;
      }
    }
    
    // Fallback: try text search with more specific query
    const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent('Orbi City Sea view Aparthotel Batumi 7b Sherif Khimshiashvili')}&key=${apiKey}`;
    console.log('Trying text search...');
    const textResponse = await fetch(textSearchUrl);
    const textData = await textResponse.json();
    
    console.log('Text Search response:', JSON.stringify(textData));
    
    if (textData.status === 'OK' && textData.results && textData.results.length > 0) {
      // Find result with fewer reviews (your business, not the complex)
      for (const result of textData.results) {
        if (result.user_ratings_total && result.user_ratings_total < 500) {
          console.log('Found via text search (your business):', result.name, 'Place ID:', result.place_id);
          return result.place_id;
        }
      }
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
      // First, try to find your specific business Place ID
      let targetPlaceId = placeId;
      
      if (!targetPlaceId) {
        console.log('No Place ID provided, searching for Orbi City Sea View Aparthotel...');
        targetPlaceId = await findPlaceId(GOOGLE_MAPS_API_KEY);
        
        if (!targetPlaceId) {
          console.log('Could not find Place ID, returning your business fallback data');
          // Return YOUR business fallback data
          return new Response(JSON.stringify({
            success: true,
            data: {
              name: 'Orbi City Sea View Aparthotel in Batumi',
              rating: 2.9,
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
        // Return YOUR business fallback data instead of throwing error
        return new Response(JSON.stringify({
          success: true,
          data: {
            name: 'Orbi City Sea View Aparthotel in Batumi',
            rating: 2.9,
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
