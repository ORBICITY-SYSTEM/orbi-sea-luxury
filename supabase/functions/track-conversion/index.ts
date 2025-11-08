import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const FACEBOOK_API_VERSION = "v18.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConversionEvent {
  event_name: string;
  event_time: number;
  action_source: string;
  event_source_url: string;
  user_data: {
    client_ip_address?: string;
    client_user_agent?: string;
    fbc?: string;
    fbp?: string;
    em?: string;
  };
  custom_data?: {
    currency?: string;
    value?: number;
    content_name?: string;
    content_type?: string;
    num_items?: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { event_name, event_data, user_data } = await req.json();

    const pixelId = Deno.env.get('META_PIXEL_ID');
    const accessToken = Deno.env.get('META_ACCESS_TOKEN');

    // If Meta credentials are not configured, return success but skip Meta tracking
    if (!pixelId || !accessToken) {
      console.warn('Meta Pixel ID or Access Token not configured - skipping Meta Conversions API');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Meta tracking skipped - credentials not configured',
          event_name 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    const event: ConversionEvent = {
      event_name,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: event_data?.source_url || '',
      user_data: {
        client_ip_address: user_data?.ip,
        client_user_agent: user_data?.user_agent,
        fbc: user_data?.fbc,
        fbp: user_data?.fbp,
        em: user_data?.email,
      },
      custom_data: event_data?.custom_data,
    };

    const response = await fetch(
      `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [event],
        }),
      }
    );

    const result = await response.json();

    return new Response(
      JSON.stringify({ success: true, result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});