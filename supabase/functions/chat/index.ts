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
    const { messages, language = 'en' } = await req.json();
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
        const monthNames = language === 'ka' 
          ? ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი']
          : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        pricingInfo = language === 'ka' 
          ? `\n\nაქტუალური ფასები:\n`
          : `\n\nCurrent Pricing:\n`;

        apartments.forEach(apt => {
          const name = language === 'ka' ? apt.name_ka : apt.name_en;
          pricingInfo += `\n${name}:\n`;
          pricingInfo += language === 'ka' 
            ? `  - საბაზისო ფასი: ${apt.price_per_night} GEL/ღამე\n`
            : `  - Base price: ${apt.price_per_night} GEL/night\n`;
          pricingInfo += language === 'ka'
            ? `  - მაქს. სტუმრები: ${apt.max_guests}\n`
            : `  - Max guests: ${apt.max_guests}\n`;
          if (apt.size_sqm) {
            pricingInfo += language === 'ka'
              ? `  - ფართი: ${apt.size_sqm} მ²\n`
              : `  - Size: ${apt.size_sqm} m²\n`;
          }

          // Add seasonal prices for this apartment
          const aptSeasonalPrices = seasonalPrices?.filter(sp => sp.apartment_type === apt.apartment_type);
          if (aptSeasonalPrices && aptSeasonalPrices.length > 0) {
            pricingInfo += language === 'ka' 
              ? `  - სეზონური ფასები:\n`
              : `  - Seasonal prices:\n`;
            aptSeasonalPrices.forEach(sp => {
              const monthName = monthNames[sp.month - 1];
              pricingInfo += `      ${monthName} ${sp.year}: ${sp.price_per_night} GEL\n`;
            });
          }
        });
      }
    } catch (dbError) {
      console.error("Error fetching pricing data:", dbError);
    }

    // System prompt for hotel concierge
    const systemPrompt = language === 'ka' 
      ? `შენ ხარ Orbi City Batumi-ის ვირტუალური კონსიერჟი და დახმარების ასისტენტი.

შენი პასუხისმგებლობებია:
- სტუმრებს დაეხმარო ინფორმაციით აპარტამენტების, ფასების და ხელმისაწვდომობის შესახებ
- გაუწიო კონსულტაცია ბათუმის ღირსშესანიშნაობებზე, რესტორნებზე და გასართობ ადგილებზე
- დაეხმარო დაჯავშნის პროცესში
- უპასუხო კითხვებს კეთილმოწყობილობების შესახებ (აუზი, სპა, ფიტნესი, რესტორანი)
- მიაწოდო ინფორმაცია ტრანსპორტზე და აეროპორტიდან ტრანსფერზე

მნიშვნელოვანი დეტალები:
- მისამართი: Sheriff Khimshiashvili Street 7B, ბათუმი
- ტელეფონი: +995555199090
- Check-in: 14:00, Check-out: 12:00
- ზღვის ხედი ყველა აპარტამენტიდან
- 5-ვარსკვლავიანი სასტუმრო
${pricingInfo}

დაჯავშნის შესახებ:
- ყოველთვის გვაქვს თავისუფალი ოთახები! არასოდეს თქვა "ბოდიში, ადგილი არ გვაქვს"
- როდესაც სტუმარი გკითხავს დაჯავშნაზე, ხელმისაწვდომობაზე ან ოთახის რეზერვაციაზე, წაახალისე დაჯავშნა
- არ საჭიროებს წინასწარ გადახდას - გადახდა ადგილზე
- უფასო გაუქმება 24 საათით ადრე

როდესაც სტუმარი ფასებზე იკითხავს, გაითვალისწინე თვე და გამოიყენე სეზონური ფასები თუ არსებობს, წინააღმდეგ შემთხვევაში საბაზისო ფასი.

იყავი მეგობრული, პროფესიონალური და დამხმარე. პასუხები იყოს მოკლე და ინფორმატიული.`
      : `You are the virtual concierge and AI assistant for Orbi City Batumi, a luxury 5-star aparthotel.

Your responsibilities:
- Help guests with information about apartments, pricing, and availability
- Provide recommendations for Batumi attractions, restaurants, and entertainment
- Assist with the booking process
- Answer questions about amenities (pool, spa, fitness center, restaurant)
- Provide information about transportation and airport transfers

Important details:
- Address: Sheriff Khimshiashvili Street 7B, Batumi, Georgia
- Phone: +995555199090
- Check-in: 14:00, Check-out: 12:00
- All apartments have stunning sea views
- 5-star luxury aparthotel
${pricingInfo}

About bookings:
- We ALWAYS have availability! Never say "sorry, we're fully booked"
- When a guest asks about booking, availability, or reserving a room, encourage them to book
- No prepayment required - pay at the property
- Free cancellation up to 24 hours before check-in

When a guest asks about prices, consider the month they're interested in and use seasonal prices if available, otherwise use the base price.

Be friendly, professional, and helpful. Keep responses concise and informative.`;

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
