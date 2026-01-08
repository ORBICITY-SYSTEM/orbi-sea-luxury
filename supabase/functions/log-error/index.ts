import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const errorData = await req.json();
    
    // Log with timestamp and structured format
    const logEntry = {
      type: "CLIENT_ERROR",
      timestamp: new Date().toISOString(),
      ...errorData,
    };

    // Log to console (will appear in edge function logs)
    console.error("[CLIENT_ERROR]", JSON.stringify(logEntry, null, 2));

    // You could also store in database for persistence
    // For now, just logging to edge function logs which can be viewed in admin

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Error logged successfully",
        id: crypto.randomUUID(),
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to process error log:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Failed to log error" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
