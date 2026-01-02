import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
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
