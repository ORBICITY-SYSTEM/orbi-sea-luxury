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

// Rate limiting: Simple in-memory store (resets on function restart)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute per IP
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

function validateInput(data: any): { valid: boolean; error?: string } {
  if (!data.event_name || typeof data.event_name !== 'string') {
    return { valid: false, error: 'event_name is required and must be a string' };
  }

  if (data.event_name.length > 100) {
    return { valid: false, error: 'event_name must be less than 100 characters' };
  }

  const validEventNames = ['PageView', 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase', 'Lead', 'CompleteRegistration'];
  if (!validEventNames.includes(data.event_name)) {
    return { valid: false, error: `event_name must be one of: ${validEventNames.join(', ')}` };
  }

  if (data.user_data?.email && typeof data.user_data.email !== 'string') {
    return { valid: false, error: 'user_data.email must be a string' };
  }

  if (data.event_data?.custom_data?.value && typeof data.event_data.custom_data.value !== 'number') {
    return { valid: false, error: 'custom_data.value must be a number' };
  }

  return { valid: true };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(clientIp)) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429 
        }
      );
    }

    const requestData = await req.json();
    
    // Input validation
    const validation = validateInput(requestData);
    if (!validation.valid) {
      console.error('Invalid input:', validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    const { event_name, event_data, user_data } = requestData;

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