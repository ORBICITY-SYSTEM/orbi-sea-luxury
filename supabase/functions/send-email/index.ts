import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "booking_confirmation" | "contact_reply" | "welcome" | "custom";
  to: string;
  subject?: string;
  data: Record<string, any>;
}

// Email Templates
const templates = {
  booking_confirmation: (data: Record<string, any>) => ({
    subject: "Booking Confirmation - Orbi City Batumi",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #1a2a3a 0%, #0f1a24 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: #d4af37; font-size: 28px; margin: 0; font-weight: 300; letter-spacing: 3px;">ORBI CITY</h1>
        <p style="color: #ffffff; font-size: 12px; margin: 8px 0 0; letter-spacing: 2px;">BATUMI</p>
      </td>
    </tr>
    
    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #1a2a3a; font-size: 24px; margin: 0 0 20px; font-weight: 400;">Booking Confirmed!</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
          Dear ${data.guestName || 'Guest'},<br><br>
          Thank you for choosing Orbi City Batumi. Your booking has been confirmed.
        </p>
        
        <!-- Booking Details -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin-bottom: 30px;">
          <tr>
            <td style="padding: 25px;">
              <h3 style="color: #d4af37; font-size: 14px; margin: 0 0 15px; letter-spacing: 1px;">BOOKING DETAILS</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color: #666; font-size: 14px; padding: 8px 0;">Check-in:</td>
                  <td style="color: #1a2a3a; font-size: 14px; padding: 8px 0; text-align: right; font-weight: 600;">${data.checkIn || 'TBD'}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px; padding: 8px 0;">Check-out:</td>
                  <td style="color: #1a2a3a; font-size: 14px; padding: 8px 0; text-align: right; font-weight: 600;">${data.checkOut || 'TBD'}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px; padding: 8px 0;">Guests:</td>
                  <td style="color: #1a2a3a; font-size: 14px; padding: 8px 0; text-align: right; font-weight: 600;">${data.guests || '2'}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px; padding: 8px 0;">Apartment:</td>
                  <td style="color: #1a2a3a; font-size: 14px; padding: 8px 0; text-align: right; font-weight: 600;">${data.apartmentName || 'Premium Suite'}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
          If you have any questions, please don't hesitate to contact us via WhatsApp or email.
        </p>
        
        <a href="https://wa.me/+995555199090" style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8963a 100%); color: #1a2a3a; text-decoration: none; padding: 15px 30px; border-radius: 30px; font-weight: 600; font-size: 14px; letter-spacing: 1px;">CONTACT US</a>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background-color: #1a2a3a; padding: 30px; text-align: center;">
        <p style="color: #d4af37; font-size: 16px; margin: 0 0 10px; letter-spacing: 2px;">★★★★★</p>
        <p style="color: #ffffff; font-size: 12px; margin: 0 0 15px; opacity: 0.8;">Luxury Aparthotel in Batumi</p>
        <p style="color: #ffffff; font-size: 12px; margin: 0; opacity: 0.6;">
          Orbi City, Block C, Khimshiashvili St, Batumi<br>
          +995 555 19 90 90 | info@orbicitybatumi.com
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }),

  contact_reply: (data: Record<string, any>) => ({
    subject: "Thank you for contacting Orbi City Batumi",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #1a2a3a 0%, #0f1a24 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: #d4af37; font-size: 28px; margin: 0; font-weight: 300; letter-spacing: 3px;">ORBI CITY</h1>
        <p style="color: #ffffff; font-size: 12px; margin: 8px 0 0; letter-spacing: 2px;">BATUMI</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #1a2a3a; font-size: 24px; margin: 0 0 20px; font-weight: 400;">Thank You for Reaching Out!</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
          Dear ${data.name || 'Guest'},<br><br>
          We have received your message and will get back to you within 24 hours.
        </p>
        <div style="background-color: #f8f9fa; border-left: 4px solid #d4af37; padding: 20px; margin: 20px 0;">
          <p style="color: #666; font-size: 14px; margin: 0; font-style: italic;">"${data.message || 'Your message'}"</p>
        </div>
        <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 20px 0;">
          For immediate assistance, you can reach us via WhatsApp.
        </p>
        <a href="https://wa.me/+995555199090" style="display: inline-block; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 30px; font-weight: 600; font-size: 14px;">WhatsApp Us</a>
      </td>
    </tr>
    <tr>
      <td style="background-color: #1a2a3a; padding: 30px; text-align: center;">
        <p style="color: #ffffff; font-size: 12px; margin: 0; opacity: 0.6;">
          © ${new Date().getFullYear()} Orbi City Batumi. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }),

  welcome: (data: Record<string, any>) => ({
    subject: "Welcome to Orbi City Batumi!",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #1a2a3a 0%, #0f1a24 100%); padding: 50px 30px; text-align: center;">
        <h1 style="color: #d4af37; font-size: 32px; margin: 0; font-weight: 300; letter-spacing: 3px;">ORBI CITY</h1>
        <p style="color: #ffffff; font-size: 12px; margin: 8px 0 0; letter-spacing: 2px;">BATUMI</p>
        <p style="color: #d4af37; font-size: 18px; margin: 20px 0 0;">★★★★★</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px; text-align: center;">
        <h2 style="color: #1a2a3a; font-size: 28px; margin: 0 0 20px; font-weight: 400;">Welcome, ${data.name || 'Guest'}!</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
          Thank you for joining our exclusive community. As a member, you'll enjoy special benefits and personalized offers.
        </p>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
          <tr>
            <td style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
              <h3 style="color: #d4af37; font-size: 14px; margin: 0 0 10px; letter-spacing: 1px;">YOUR BENEFITS</h3>
              <p style="color: #666; font-size: 14px; margin: 0;">✓ Exclusive member discounts</p>
              <p style="color: #666; font-size: 14px; margin: 5px 0;">✓ Early access to promotions</p>
              <p style="color: #666; font-size: 14px; margin: 5px 0;">✓ Loyalty points on every stay</p>
              <p style="color: #666; font-size: 14px; margin: 5px 0 0;">✓ Priority booking</p>
            </td>
          </tr>
        </table>
        
        <a href="https://orbicitybatumi.com/apartments" style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8963a 100%); color: #1a2a3a; text-decoration: none; padding: 15px 40px; border-radius: 30px; font-weight: 600; font-size: 14px; letter-spacing: 1px;">EXPLORE APARTMENTS</a>
      </td>
    </tr>
    <tr>
      <td style="background-color: #1a2a3a; padding: 30px; text-align: center;">
        <p style="color: #ffffff; font-size: 12px; margin: 0; opacity: 0.6;">
          © ${new Date().getFullYear()} Orbi City Batumi. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }),
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { type, to, subject, data }: EmailRequest = await req.json();

    if (!to || !type) {
      throw new Error("Missing required fields: to, type");
    }

    // Get template
    let emailContent;
    if (type === "custom" && subject) {
      emailContent = { subject, html: data.html || "" };
    } else if (templates[type]) {
      emailContent = templates[type](data);
    } else {
      throw new Error(`Unknown email type: ${type}`);
    }

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Orbi City Batumi <noreply@orbicitybatumi.com>",
        to: [to],
        subject: emailContent.subject,
        html: emailContent.html,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Resend API error: ${error}`);
    }

    const result = await res.json();

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Email send error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
