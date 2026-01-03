import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "booking_confirmation" | "contact_reply" | "welcome" | "comment_moderation" | "custom";
  to: string;
  subject?: string;
  data: Record<string, any>;
}

// Four Seasons-inspired Email Templates
const templates = {
  booking_confirmation: (data: Record<string, any>) => {
    const isGeorgian = data.language === 'ka';
    
    const content = {
      subject: isGeorgian 
        ? '✨ თქვენი დაჯავშნა დადასტურებულია | Orbi City Batumi'
        : '✨ Your Reservation is Confirmed | Orbi City Batumi',
      
      greeting: isGeorgian 
        ? `პატივცემულო ${data.guestName || 'სტუმარო'}` 
        : `Dear ${data.guestName || 'Guest'}`,
      
      welcomeText: isGeorgian
        ? 'გმადლობთ, რომ აირჩიეთ Orbi City Batumi. ჩვენთვის პატივია მოგესალმოთ ჩვენს ექსკლუზიურ სასტუმროში შავი ზღვის სანაპიროზე.'
        : 'Thank you for choosing Orbi City Batumi. We are honored to welcome you to our exclusive residence on the shores of the Black Sea.',
      
      reservationTitle: isGeorgian ? 'თქვენი ჯავშანი' : 'Your Reservation',
      apartmentLabel: isGeorgian ? 'აპარტამენტი' : 'Apartment',
      checkInLabel: isGeorgian ? 'ჩასვლა' : 'Check-in',
      checkOutLabel: isGeorgian ? 'გასვლა' : 'Check-out',
      nightsLabel: isGeorgian ? 'ღამეები' : 'Nights',
      guestsLabel: isGeorgian ? 'სტუმრები' : 'Guests',
      
      expectTitle: isGeorgian ? 'რას უნდა ელოდეთ' : 'What to Expect',
      expectItems: isGeorgian 
        ? [
            '14:00 — ჩასვლა (ადრეული ჩასვლა მოთხოვნით)',
            '12:00 — გასვლა (გვიანი გასვლა მოთხოვნით)',
            'უფასო მაღალსიჩქარიანი WiFi',
            'აუზი და ფიტნეს ცენტრი',
            '24/7 კონსიერჟ სერვისი',
            'პანორამული ხედი ზღვაზე'
          ]
        : [
            '14:00 — Check-in (early arrival upon request)',
            '12:00 — Check-out (late departure upon request)',
            'Complimentary high-speed WiFi',
            'Pool & Fitness Center access',
            '24/7 Concierge service',
            'Panoramic sea views'
          ],
      
      paymentTitle: isGeorgian ? 'გადახდა' : 'Payment',
      paymentText: isGeorgian 
        ? 'გადახდა მოხდება სასტუმროში მოსვლისას. მიიღება როგორც ნაღდი, ასევე საბანკო ბარათი.'
        : 'Payment upon arrival at the hotel. We accept both cash and card payments.',
      
      conciergeTitle: isGeorgian ? 'კონსიერჟი' : 'Concierge',
      conciergeText: isGeorgian
        ? 'ნებისმიერი კითხვის ან სპეციალური მოთხოვნის შემთხვევაში, გთხოვთ დაგვიკავშირდეთ:'
        : 'For any questions or special requests, please contact us:',
      
      closingText: isGeorgian
        ? 'გელოდებით თქვენს სტუმრობას.'
        : 'We look forward to welcoming you.',
      
      warmRegards: isGeorgian ? 'პატივისცემით' : 'With warm regards',
      teamName: 'The Orbi City Team',
      
      cancellationNote: isGeorgian
        ? 'უფასო გაუქმება ჩასვლამდე 24 საათით ადრე'
        : 'Free cancellation up to 24 hours before check-in'
    };

    return {
      subject: content.subject,
      html: `
<!DOCTYPE html>
<html lang="${isGeorgian ? 'ka' : 'en'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.subject}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap');
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8f7f4; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f7f4; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; background-color: #ffffff; border-radius: 2px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%); padding: 50px 40px; text-align: center;">
              <p style="color: #c9a962; font-size: 11px; letter-spacing: 4px; margin: 0 0 15px; font-weight: 500;">★ ★ ★ ★ ★</p>
              <h1 style="font-family: 'Playfair Display', Georgia, serif; color: #ffffff; font-size: 36px; margin: 0; font-weight: 400; letter-spacing: 2px;">ORBI CITY</h1>
              <p style="color: #c9a962; font-size: 12px; margin: 10px 0 0; letter-spacing: 3px; font-weight: 500;">BATUMI</p>
            </td>
          </tr>

          <!-- Confirmation Badge -->
          <tr>
            <td style="padding: 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #c9a962 0%, #dfc283 100%);">
                <tr>
                  <td style="padding: 20px 40px; text-align: center;">
                    <p style="color: #1a1a1a; font-size: 14px; margin: 0; font-weight: 600; letter-spacing: 1px;">
                      ✓ ${isGeorgian ? 'ჯავშანი დადასტურებულია' : 'RESERVATION CONFIRMED'}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Welcome Message -->
          <tr>
            <td style="padding: 50px 50px 30px;">
              <h2 style="font-family: 'Playfair Display', Georgia, serif; color: #1a1a1a; font-size: 26px; margin: 0 0 20px; font-weight: 400;">${content.greeting},</h2>
              <p style="color: #666666; font-size: 15px; line-height: 1.8; margin: 0;">
                ${content.welcomeText}
              </p>
            </td>
          </tr>

          <!-- Elegant Divider -->
          <tr>
            <td style="padding: 0 50px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-bottom: 1px solid #e8e5e0;"></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Reservation Details -->
          <tr>
            <td style="padding: 40px 50px;">
              <h3 style="font-family: 'Playfair Display', Georgia, serif; color: #1a1a1a; font-size: 18px; margin: 0 0 25px; font-weight: 500; letter-spacing: 1px;">${content.reservationTitle}</h3>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafaf8; border: 1px solid #e8e5e0; border-radius: 4px;">
                <tr>
                  <td style="padding: 25px 30px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e8e5e0;">
                          <span style="color: #999999; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">${content.apartmentLabel}</span>
                          <p style="color: #1a1a1a; font-size: 16px; margin: 6px 0 0; font-weight: 500;">${data.apartmentName || 'Premium Suite'}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 20px 0;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="50%" style="padding-right: 15px; border-right: 1px solid #e8e5e0;">
                                <span style="color: #999999; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">${content.checkInLabel}</span>
                                <p style="color: #1a1a1a; font-size: 15px; margin: 6px 0 0; font-weight: 500;">${data.checkIn || 'TBD'}</p>
                                <p style="color: #c9a962; font-size: 12px; margin: 4px 0 0;">14:00</p>
                              </td>
                              <td width="50%" style="padding-left: 15px;">
                                <span style="color: #999999; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">${content.checkOutLabel}</span>
                                <p style="color: #1a1a1a; font-size: 15px; margin: 6px 0 0; font-weight: 500;">${data.checkOut || 'TBD'}</p>
                                <p style="color: #c9a962; font-size: 12px; margin: 4px 0 0;">12:00</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 15px; border-top: 1px solid #e8e5e0;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="50%">
                                <span style="color: #999999; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">${content.nightsLabel}</span>
                                <p style="color: #1a1a1a; font-size: 15px; margin: 6px 0 0; font-weight: 500;">${data.nights || '1'}</p>
                              </td>
                              <td width="50%">
                                <span style="color: #999999; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">${content.guestsLabel}</span>
                                <p style="color: #1a1a1a; font-size: 15px; margin: 6px 0 0; font-weight: 500;">${data.guests || '2'}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Payment Box -->
          <tr>
            <td style="padding: 0 50px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 4px;">
                <tr>
                  <td style="padding: 30px; text-align: center;">
                    <span style="color: #c9a962; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">${content.paymentTitle}</span>
                    <p style="color: #ffffff; font-size: 32px; margin: 12px 0; font-family: 'Playfair Display', Georgia, serif; font-weight: 500;">${data.totalPrice || '0 GEL'}</p>
                    <p style="color: #888888; font-size: 13px; margin: 0; line-height: 1.6;">${content.paymentText}</p>
                    <p style="color: #c9a962; font-size: 11px; margin: 15px 0 0; letter-spacing: 1px;">✓ ${content.cancellationNote}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What to Expect -->
          <tr>
            <td style="padding: 0 50px 40px;">
              <h3 style="font-family: 'Playfair Display', Georgia, serif; color: #1a1a1a; font-size: 18px; margin: 0 0 20px; font-weight: 500; letter-spacing: 1px;">${content.expectTitle}</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${content.expectItems.map((item: string) => `
                <tr>
                  <td style="padding: 10px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                    <span style="color: #c9a962; margin-right: 10px;">•</span>${item}
                  </td>
                </tr>
                `).join('')}
              </table>
            </td>
          </tr>

          <!-- Concierge -->
          <tr>
            <td style="padding: 0 50px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafaf8; border: 1px solid #e8e5e0; border-radius: 4px;">
                <tr>
                  <td style="padding: 30px; text-align: center;">
                    <h4 style="color: #1a1a1a; font-size: 14px; margin: 0 0 10px; letter-spacing: 1px; font-weight: 600;">${content.conciergeTitle}</h4>
                    <p style="color: #666666; font-size: 13px; margin: 0 0 20px;">${content.conciergeText}</p>
                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                      <tr>
                        <td style="padding: 0 8px;">
                          <a href="https://wa.me/995555199090" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 25px; font-size: 13px; font-weight: 500;">WhatsApp</a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="tel:+995555199090" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 25px; font-size: 13px; font-weight: 500;">+995 555 19 90 90</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Closing -->
          <tr>
            <td style="padding: 0 50px 50px; text-align: center;">
              <p style="color: #666666; font-size: 15px; line-height: 1.8; margin: 0 0 20px; font-style: italic;">
                ${content.closingText}
              </p>
              <p style="color: #1a1a1a; font-size: 14px; margin: 0;">
                ${content.warmRegards},<br>
                <strong style="font-family: 'Playfair Display', Georgia, serif; font-size: 16px;">${content.teamName}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 40px 50px; text-align: center;">
              <p style="color: #c9a962; font-size: 12px; letter-spacing: 3px; margin: 0 0 15px;">★ ★ ★ ★ ★</p>
              <p style="color: #ffffff; font-size: 12px; margin: 0 0 5px; opacity: 0.8;">Orbi City, Block C, Khimshiashvili St, Batumi</p>
              <p style="color: #ffffff; font-size: 12px; margin: 0 0 20px; opacity: 0.6;">+995 555 19 90 90 | info@orbicitybatumi.com</p>
              <a href="https://orbicitybatumi.com" style="color: #c9a962; font-size: 12px; text-decoration: none; letter-spacing: 1px;">www.orbicitybatumi.com</a>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 25px;">
                <tr>
                  <td style="text-align: center;">
                    <a href="https://www.instagram.com/orbicity.batumi/" style="display: inline-block; margin: 0 8px; color: #888888; text-decoration: none;">
                      <img src="https://cdn4.iconfinder.com/data/icons/social-media-flat-7/64/Social-media_Instagram-64.png" width="24" height="24" alt="Instagram" style="opacity: 0.7;" />
                    </a>
                    <a href="https://www.facebook.com/orbicity.batumi" style="display: inline-block; margin: 0 8px; color: #888888; text-decoration: none;">
                      <img src="https://cdn4.iconfinder.com/data/icons/social-media-flat-7/64/Social-media_Facebook-64.png" width="24" height="24" alt="Facebook" style="opacity: 0.7;" />
                    </a>
                    <a href="https://wa.me/995555199090" style="display: inline-block; margin: 0 8px; color: #888888; text-decoration: none;">
                      <img src="https://cdn4.iconfinder.com/data/icons/social-media-flat-7/64/Social-media_Whatsapp-64.png" width="24" height="24" alt="WhatsApp" style="opacity: 0.7;" />
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color: #666666; font-size: 10px; margin: 20px 0 0;">
                © ${new Date().getFullYear()} Orbi City Batumi. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    };
  },

  contact_reply: (data: Record<string, any>) => ({
    subject: "Thank you for contacting Orbi City Batumi",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f8f7f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%); padding: 50px 40px; text-align: center;">
        <p style="color: #c9a962; font-size: 11px; letter-spacing: 4px; margin: 0 0 15px; font-weight: 500;">★ ★ ★ ★ ★</p>
        <h1 style="font-family: Georgia, serif; color: #ffffff; font-size: 32px; margin: 0; font-weight: 400; letter-spacing: 2px;">ORBI CITY</h1>
        <p style="color: #c9a962; font-size: 12px; margin: 10px 0 0; letter-spacing: 3px;">BATUMI</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 50px 40px;">
        <h2 style="font-family: Georgia, serif; color: #1a1a1a; font-size: 24px; margin: 0 0 20px; font-weight: 400;">Thank You for Reaching Out</h2>
        <p style="color: #666; font-size: 15px; line-height: 1.8; margin: 0 0 25px;">
          Dear ${data.name || 'Guest'},<br><br>
          We have received your message and will get back to you within 24 hours.
        </p>
        <div style="background-color: #fafaf8; border-left: 3px solid #c9a962; padding: 20px 25px; margin: 25px 0;">
          <p style="color: #666; font-size: 14px; margin: 0; font-style: italic; line-height: 1.6;">"${data.message || 'Your message'}"</p>
        </div>
        <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 25px 0;">
          For immediate assistance, please contact our concierge via WhatsApp.
        </p>
        <a href="https://wa.me/+995555199090" style="display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 25px; font-weight: 500; font-size: 14px;">WhatsApp Us</a>
      </td>
    </tr>
    <tr>
      <td style="background-color: #1a1a1a; padding: 30px; text-align: center;">
        <p style="color: #c9a962; font-size: 12px; letter-spacing: 3px; margin: 0 0 10px;">★ ★ ★ ★ ★</p>
        <p style="color: #ffffff; font-size: 11px; margin: 0; opacity: 0.6;">
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
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f8f7f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%); padding: 60px 40px; text-align: center;">
        <p style="color: #c9a962; font-size: 11px; letter-spacing: 4px; margin: 0 0 15px; font-weight: 500;">★ ★ ★ ★ ★</p>
        <h1 style="font-family: Georgia, serif; color: #ffffff; font-size: 36px; margin: 0; font-weight: 400; letter-spacing: 2px;">ORBI CITY</h1>
        <p style="color: #c9a962; font-size: 12px; margin: 10px 0 0; letter-spacing: 3px;">BATUMI</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 50px 40px; text-align: center;">
        <h2 style="font-family: Georgia, serif; color: #1a1a1a; font-size: 28px; margin: 0 0 20px; font-weight: 400;">Welcome, ${data.name || 'Guest'}</h2>
        <p style="color: #666; font-size: 15px; line-height: 1.8; margin: 0 0 35px;">
          Thank you for joining our exclusive community. As a member, you will enjoy special benefits and personalized offers.
        </p>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 35px; background-color: #fafaf8; border: 1px solid #e8e5e0; border-radius: 4px;">
          <tr>
            <td style="padding: 30px; text-align: center;">
              <h3 style="color: #c9a962; font-size: 12px; margin: 0 0 20px; letter-spacing: 2px;">YOUR EXCLUSIVE BENEFITS</h3>
              <p style="color: #666; font-size: 14px; margin: 0; line-height: 2;">
                ✓ Member-only discounts<br>
                ✓ Early access to promotions<br>
                ✓ Loyalty points on every stay<br>
                ✓ Priority booking privileges
              </p>
            </td>
          </tr>
        </table>
        
        <a href="https://orbicitybatumi.com/apartments" style="display: inline-block; background: linear-gradient(135deg, #c9a962 0%, #dfc283 100%); color: #1a1a1a; text-decoration: none; padding: 16px 45px; border-radius: 25px; font-weight: 600; font-size: 14px; letter-spacing: 1px;">EXPLORE APARTMENTS</a>
      </td>
    </tr>
    <tr>
      <td style="background-color: #1a1a1a; padding: 35px; text-align: center;">
        <p style="color: #c9a962; font-size: 12px; letter-spacing: 3px; margin: 0 0 10px;">★ ★ ★ ★ ★</p>
        <p style="color: #ffffff; font-size: 11px; margin: 0; opacity: 0.6;">
          © ${new Date().getFullYear()} Orbi City Batumi. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }),

  comment_moderation: (data: Record<string, any>) => ({
    subject: "🔔 ახალი კომენტარი მოელის მოდერაციას - Orbi City Batumi",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f8f7f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 30px; text-align: center;">
        <h1 style="font-family: Georgia, serif; color: #ffffff; font-size: 28px; margin: 0; font-weight: 400; letter-spacing: 2px;">ORBI CITY</h1>
        <p style="color: #c9a962; font-size: 11px; margin: 8px 0 0; letter-spacing: 2px;">ADMIN PANEL</p>
      </td>
    </tr>
    <tr>
      <td style="background: linear-gradient(135deg, #c9a962 0%, #dfc283 100%); padding: 15px 30px; text-align: center;">
        <p style="color: #1a1a1a; font-size: 14px; margin: 0; font-weight: 600; letter-spacing: 1px;">⏳ NEW COMMENT AWAITING MODERATION</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="font-family: Georgia, serif; color: #1a1a1a; font-size: 20px; margin: 0 0 20px; font-weight: 500;">New Blog Comment</h2>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafaf8; border: 1px solid #e8e5e0; border-radius: 4px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 20px;">
              <p style="color: #666; font-size: 13px; margin: 0 0 8px;"><strong>Article:</strong> ${data.postSlug || 'Unknown'}</p>
              <p style="color: #666; font-size: 13px; margin: 0 0 8px;"><strong>Author:</strong> ${data.authorName || 'Guest'}</p>
              <p style="color: #666; font-size: 13px; margin: 0 0 8px;"><strong>Email:</strong> ${data.authorEmail || 'N/A'}</p>
              <p style="color: #666; font-size: 13px; margin: 0;"><strong>Date:</strong> ${data.createdAt || new Date().toLocaleString()}</p>
            </td>
          </tr>
        </table>

        <div style="background-color: #fff9e6; border-left: 3px solid #c9a962; padding: 20px; margin: 20px 0; border-radius: 0 4px 4px 0;">
          <h4 style="color: #92400e; font-size: 12px; margin: 0 0 10px; letter-spacing: 1px;">💬 COMMENT:</h4>
          <p style="color: #78350f; font-size: 14px; margin: 0; line-height: 1.6;">"${data.content || 'No content'}"</p>
        </div>
        
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding-top: 20px;">
              <a href="https://orbicitybatumi.com/admin/comments" style="display: inline-block; background: linear-gradient(135deg, #c9a962 0%, #dfc283 100%); color: #1a1a1a; text-decoration: none; padding: 14px 35px; border-radius: 25px; font-weight: 600; font-size: 13px;">Go to Moderation</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background-color: #1a1a1a; padding: 25px; text-align: center;">
        <p style="color: #888; font-size: 11px; margin: 0;">
          This is an automated notification for administrators<br>
          © ${new Date().getFullYear()} Orbi City Batumi
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

    console.log(`Sending ${type} email to ${to}`);

    // Get template
    let emailContent: { subject: string; html: string };
    if (type === "custom" && subject) {
      emailContent = { subject, html: data.html || "" };
    } else if (type in templates && type !== "custom") {
      const templateFn = templates[type as keyof typeof templates];
      emailContent = templateFn(data);
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
        from: "Orbi City Batumi <booking@orbicitybatumi.com>",
        to: [to],
        subject: emailContent.subject,
        html: emailContent.html,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Resend API error:", result);
      throw new Error(result.message || "Failed to send email");
    }

    console.log("Email sent successfully:", result);

    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
