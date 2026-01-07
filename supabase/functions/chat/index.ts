import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Fetch current pricing data from database
    let pricingInfo = "";
    try {
      const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
      
      // Get base apartment prices
      const { data: apartments } = await supabase
        .from('apartment_prices')
        .select('apartment_type, name_en, name_ka, price_per_night, max_guests, size_sqm')
        .eq('is_active', true)
        .order('display_order');

      // Get seasonal prices for current and next year
      const currentYear = new Date().getFullYear();
      const { data: seasonalPrices } = await supabase
        .from('seasonal_prices')
        .select('apartment_type, month, year, price_per_night')
        .eq('is_active', true)
        .gte('year', currentYear)
        .order('apartment_type')
        .order('year')
        .order('month');

      if (apartments && apartments.length > 0) {
        pricingInfo = `\n\nCurrent Pricing Information:\n`;

        apartments.forEach(apt => {
          pricingInfo += `\n${apt.name_en} (${apt.name_ka}):\n`;
          pricingInfo += `  - Base price: ${apt.price_per_night} GEL/night\n`;
          pricingInfo += `  - Max guests: ${apt.max_guests}\n`;
          if (apt.size_sqm) {
            pricingInfo += `  - Size: ${apt.size_sqm} m²\n`;
          }

          // Add seasonal prices for this apartment
          const aptSeasonalPrices = seasonalPrices?.filter(sp => sp.apartment_type === apt.apartment_type);
          if (aptSeasonalPrices && aptSeasonalPrices.length > 0) {
            pricingInfo += `  - Seasonal prices:\n`;
            aptSeasonalPrices.forEach(sp => {
              pricingInfo += `      Month ${sp.month}/${sp.year}: ${sp.price_per_night} GEL\n`;
            });
          }
        });
      }
    } catch (dbError) {
      console.error("Error fetching pricing data:", dbError);
    }

    // Universal multilingual system prompt with auto-detection
    const systemPrompt = `You are the virtual concierge and AI assistant for Orbi City Batumi, a luxury 5-star aparthotel in Batumi, Georgia.

🌍 CRITICAL LANGUAGE RULE:
- AUTOMATICALLY DETECT the language the user is writing in
- ALWAYS respond in THE SAME LANGUAGE as the user's message
- You speak ALL languages fluently: Georgian (ქართული), English, Russian (Русский), Turkish (Türkçe), Arabic (العربية), Chinese (中文), German (Deutsch), French (Français), Spanish (Español), Italian (Italiano), Japanese (日本語), Korean (한국어), Hebrew (עברית), Persian (فارسی), Hindi (हिन्दी), and ANY other language
- If a user writes in Georgian, respond in Georgian
- If a user writes in Russian, respond in Russian
- If a user writes in Arabic, respond in Arabic
- And so on for ANY language

Your responsibilities:
- Help guests with information about apartments, pricing, and availability
- Provide recommendations for Batumi attractions, restaurants, and entertainment
- Assist with the booking process
- Answer questions about amenities (infinity pool, spa, fitness center, restaurant, sauna)
- Provide information about transportation and airport transfers

Important details about Orbi City:
- Address: Sheriff Khimshiashvili Street 7B, Batumi, Georgia
- Phone: +995555199090
- Check-in: 14:00, Check-out: 12:00
- All apartments have stunning Black Sea views
- 5-star luxury aparthotel with premium amenities
- Located in the heart of Batumi's new boulevard
${pricingInfo}

Booking policies:
- We ALWAYS have availability! Never say "sorry, we are fully booked"
- When a guest asks about booking, availability, or reserving a room, encourage them to book
- No prepayment required - pay at the property
- Free cancellation up to 24 hours before check-in
- Special offers: New users get 20 GEL voucher with code WELCOME20

When a guest asks about prices, consider the month they are interested in and use seasonal prices if available, otherwise use the base price.

Be friendly, professional, warm, and helpful. Keep responses concise and informative. Use emojis occasionally to be more engaging 🏨✨🌊`;

    console.log("Sending request to Lovable AI Gateway");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Successfully connected to AI gateway, streaming response");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
