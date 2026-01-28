import { format } from 'date-fns';
import { ka } from 'date-fns/locale';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface BookingEmailData {
  guestName: string;
  guestEmail: string;
  apartmentType: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  bookingId: string;
  nights: number;
  guests: number;
  promoCode?: string;
  discountAmount?: number;
  language?: 'ka' | 'en';
}

// Company info for emails
const COMPANY = {
  name: 'Orbi City Batumi',
  email: 'orbi.apartments1@gmail.com',
  phone: '+995 555 19 90 90',
  address: 'Sherif Khimshiashvili Street 7B, Batumi, Georgia',
  website: 'https://orbicitybatumi.com',
  logo: 'https://orbicitybatumi.com/logo.png',
};

// Email template wrapper
const emailWrapper = (content: string, language: 'ka' | 'en' = 'en') => `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Orbi City Batumi</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%); padding: 30px; text-align: center; }
    .header h1 { color: #d4af37; margin: 0; font-size: 28px; letter-spacing: 2px; }
    .header p { color: #ffffff; margin: 5px 0 0; font-size: 12px; letter-spacing: 3px; }
    .content { padding: 30px; }
    .booking-box { background-color: #f8f9fa; border-left: 4px solid #d4af37; padding: 20px; margin: 20px 0; }
    .booking-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .booking-row:last-child { border-bottom: none; }
    .label { color: #666; }
    .value { font-weight: bold; color: #1a365d; }
    .total-row { background-color: #1a365d; color: #ffffff; padding: 15px; margin-top: 20px; }
    .total-row .value { color: #d4af37; font-size: 24px; }
    .button { display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #c9a227 100%); color: #1a365d !important; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    .footer { background-color: #1a365d; color: #ffffff; padding: 30px; text-align: center; font-size: 14px; }
    .footer a { color: #d4af37; }
    .social-links { margin: 15px 0; }
    .social-links a { margin: 0 10px; color: #d4af37; text-decoration: none; }
    .highlight { color: #d4af37; font-weight: bold; }
    .discount { color: #22c55e; }
    @media only screen and (max-width: 600px) {
      .content { padding: 20px; }
      .booking-row { flex-direction: column; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ORBI CITY</h1>
      <p>BATUMI</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>${COMPANY.name}</strong></p>
      <p>${COMPANY.address}</p>
      <p>📞 ${COMPANY.phone} | ✉️ ${COMPANY.email}</p>
      <div class="social-links">
        <a href="https://facebook.com/orbicity">Facebook</a> |
        <a href="https://instagram.com/orbicity">Instagram</a> |
        <a href="${COMPANY.website}">Website</a>
      </div>
      <p style="font-size: 12px; margin-top: 20px; color: #999;">
        © ${new Date().getFullYear()} Orbi City Batumi. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;

// Email Templates
export const EMAIL_TEMPLATES = {
  // Booking Confirmation
  BOOKING_CONFIRMATION: {
    ka: (data: BookingEmailData): EmailData => ({
      to: data.guestEmail,
      subject: `✅ ჯავშანი დადასტურებულია - Orbi City Batumi`,
      html: emailWrapper(`
        <h2 style="color: #1a365d;">გამარჯობა ${data.guestName}!</h2>
        <p>თქვენი ჯავშანი <strong>დადასტურებულია</strong>! გმადლობთ, რომ აირჩიეთ Orbi City Batumi.</p>

        <div class="booking-box">
          <h3 style="margin-top: 0; color: #1a365d;">ჯავშნის დეტალები</h3>
          <div class="booking-row">
            <span class="label">ჯავშნის ID:</span>
            <span class="value">#${data.bookingId.slice(0, 8).toUpperCase()}</span>
          </div>
          <div class="booking-row">
            <span class="label">აპარტამენტი:</span>
            <span class="value">${data.apartmentType}</span>
          </div>
          <div class="booking-row">
            <span class="label">შესვლა:</span>
            <span class="value">${format(new Date(data.checkIn), 'd MMMM, yyyy', { locale: ka })}</span>
          </div>
          <div class="booking-row">
            <span class="label">გასვლა:</span>
            <span class="value">${format(new Date(data.checkOut), 'd MMMM, yyyy', { locale: ka })}</span>
          </div>
          <div class="booking-row">
            <span class="label">ღამეები:</span>
            <span class="value">${data.nights}</span>
          </div>
          <div class="booking-row">
            <span class="label">სტუმრები:</span>
            <span class="value">${data.guests}</span>
          </div>
          ${data.promoCode ? `
          <div class="booking-row">
            <span class="label">პრომო კოდი:</span>
            <span class="value discount">${data.promoCode} (-₾${data.discountAmount})</span>
          </div>
          ` : ''}
        </div>

        <div class="total-row" style="display: flex; justify-content: space-between; align-items: center;">
          <span>ჯამური თანხა:</span>
          <span class="value">₾${data.totalPrice.toFixed(2)}</span>
        </div>

        <h3 style="color: #1a365d; margin-top: 30px;">📍 მისამართი და შესვლის ინფორმაცია</h3>
        <p><strong>მისამართი:</strong> შერიფ ხიმშიაშვილის 7B, ბათუმი</p>
        <p><strong>შესვლის დრო:</strong> 14:00-დან</p>
        <p><strong>გასვლის დრო:</strong> 12:00-მდე</p>

        <center>
          <a href="https://maps.app.goo.gl/orbi" class="button">📍 რუკაზე ნახვა</a>
        </center>

        <p>გაქვთ შეკითხვები? დაგვიკავშირდით:</p>
        <p>📞 ${COMPANY.phone}</p>
        <p>✉️ ${COMPANY.email}</p>
      `, 'ka'),
    }),

    en: (data: BookingEmailData): EmailData => ({
      to: data.guestEmail,
      subject: `✅ Booking Confirmed - Orbi City Batumi`,
      html: emailWrapper(`
        <h2 style="color: #1a365d;">Hello ${data.guestName}!</h2>
        <p>Your booking is <strong>confirmed</strong>! Thank you for choosing Orbi City Batumi.</p>

        <div class="booking-box">
          <h3 style="margin-top: 0; color: #1a365d;">Booking Details</h3>
          <div class="booking-row">
            <span class="label">Booking ID:</span>
            <span class="value">#${data.bookingId.slice(0, 8).toUpperCase()}</span>
          </div>
          <div class="booking-row">
            <span class="label">Apartment:</span>
            <span class="value">${data.apartmentType}</span>
          </div>
          <div class="booking-row">
            <span class="label">Check-in:</span>
            <span class="value">${format(new Date(data.checkIn), 'MMMM d, yyyy')}</span>
          </div>
          <div class="booking-row">
            <span class="label">Check-out:</span>
            <span class="value">${format(new Date(data.checkOut), 'MMMM d, yyyy')}</span>
          </div>
          <div class="booking-row">
            <span class="label">Nights:</span>
            <span class="value">${data.nights}</span>
          </div>
          <div class="booking-row">
            <span class="label">Guests:</span>
            <span class="value">${data.guests}</span>
          </div>
          ${data.promoCode ? `
          <div class="booking-row">
            <span class="label">Promo Code:</span>
            <span class="value discount">${data.promoCode} (-$${data.discountAmount})</span>
          </div>
          ` : ''}
        </div>

        <div class="total-row" style="display: flex; justify-content: space-between; align-items: center;">
          <span>Total Amount:</span>
          <span class="value">$${data.totalPrice.toFixed(2)}</span>
        </div>

        <h3 style="color: #1a365d; margin-top: 30px;">📍 Address & Check-in Information</h3>
        <p><strong>Address:</strong> 7B Sherif Khimshiashvili St, Batumi, Georgia</p>
        <p><strong>Check-in time:</strong> From 2:00 PM</p>
        <p><strong>Check-out time:</strong> By 12:00 PM</p>

        <center>
          <a href="https://maps.app.goo.gl/orbi" class="button">📍 View on Map</a>
        </center>

        <p>Have questions? Contact us:</p>
        <p>📞 ${COMPANY.phone}</p>
        <p>✉️ ${COMPANY.email}</p>
      `, 'en'),
    }),
  },

  // Check-in Reminder (1 day before)
  CHECKIN_REMINDER: {
    ka: (data: BookingEmailData): EmailData => ({
      to: data.guestEmail,
      subject: `🔔 ხვალ გელოდებით! - Orbi City Batumi`,
      html: emailWrapper(`
        <h2 style="color: #1a365d;">გამარჯობა ${data.guestName}!</h2>
        <p>შეგახსენებთ, რომ <strong class="highlight">ხვალ</strong> გელოდებით Orbi City Batumi-ში!</p>

        <div class="booking-box">
          <div class="booking-row">
            <span class="label">შესვლის თარიღი:</span>
            <span class="value">${format(new Date(data.checkIn), 'd MMMM, yyyy', { locale: ka })}</span>
          </div>
          <div class="booking-row">
            <span class="label">შესვლის დრო:</span>
            <span class="value">14:00-დან</span>
          </div>
          <div class="booking-row">
            <span class="label">აპარტამენტი:</span>
            <span class="value">${data.apartmentType}</span>
          </div>
        </div>

        <h3 style="color: #1a365d;">📋 არ დაგავიწყდეთ:</h3>
        <ul>
          <li>პირადობის დამადასტურებელი დოკუმენტი</li>
          <li>ჯავშნის ნომერი: #${data.bookingId.slice(0, 8).toUpperCase()}</li>
        </ul>

        <h3 style="color: #1a365d;">📍 როგორ მოხვიდეთ:</h3>
        <p><strong>მისამართი:</strong> შერიფ ხიმშიაშვილის 7B, ბათუმი</p>

        <center>
          <a href="https://maps.app.goo.gl/orbi" class="button">📍 რუკაზე ნახვა</a>
        </center>

        <p>დაგვირეკეთ თუ დაგვჭირდებით: <strong>${COMPANY.phone}</strong></p>

        <p style="font-size: 18px; text-align: center; margin-top: 30px;">გელოდებით! 🌊</p>
      `, 'ka'),
    }),

    en: (data: BookingEmailData): EmailData => ({
      to: data.guestEmail,
      subject: `🔔 See you tomorrow! - Orbi City Batumi`,
      html: emailWrapper(`
        <h2 style="color: #1a365d;">Hello ${data.guestName}!</h2>
        <p>This is a friendly reminder that we're expecting you <strong class="highlight">tomorrow</strong> at Orbi City Batumi!</p>

        <div class="booking-box">
          <div class="booking-row">
            <span class="label">Check-in Date:</span>
            <span class="value">${format(new Date(data.checkIn), 'MMMM d, yyyy')}</span>
          </div>
          <div class="booking-row">
            <span class="label">Check-in Time:</span>
            <span class="value">From 2:00 PM</span>
          </div>
          <div class="booking-row">
            <span class="label">Apartment:</span>
            <span class="value">${data.apartmentType}</span>
          </div>
        </div>

        <h3 style="color: #1a365d;">📋 Don't forget:</h3>
        <ul>
          <li>Valid ID document</li>
          <li>Booking number: #${data.bookingId.slice(0, 8).toUpperCase()}</li>
        </ul>

        <h3 style="color: #1a365d;">📍 How to get here:</h3>
        <p><strong>Address:</strong> 7B Sherif Khimshiashvili St, Batumi, Georgia</p>

        <center>
          <a href="https://maps.app.goo.gl/orbi" class="button">📍 View on Map</a>
        </center>

        <p>Call us if you need anything: <strong>${COMPANY.phone}</strong></p>

        <p style="font-size: 18px; text-align: center; margin-top: 30px;">See you soon! 🌊</p>
      `, 'en'),
    }),
  },

  // Thank You / Review Request
  THANK_YOU: {
    ka: (data: BookingEmailData): EmailData => ({
      to: data.guestEmail,
      subject: `🙏 გმადლობთ ვიზიტისთვის! - Orbi City Batumi`,
      html: emailWrapper(`
        <h2 style="color: #1a365d;">გამარჯობა ${data.guestName}!</h2>
        <p>გმადლობთ, რომ დარჩით <strong>Orbi City Batumi</strong>-ში!</p>
        <p>იმედი გვაქვს, რომ ისიამოვნეთ ყოფნით და კარგი შთაბეჭდილებები დაგრჩათ.</p>

        <div style="background: linear-gradient(135deg, #d4af37 0%, #c9a227 100%); padding: 25px; border-radius: 10px; text-align: center; margin: 30px 0;">
          <h3 style="color: #1a365d; margin-top: 0;">⭐ დაგვიტოვეთ შეფასება</h3>
          <p style="color: #1a365d;">თქვენი აზრი ძალიან მნიშვნელოვანია ჩვენთვის!</p>
          <a href="https://g.page/r/orbicity/review" style="display: inline-block; background-color: #1a365d; color: #d4af37 !important; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Google-ზე შეფასება</a>
        </div>

        <div class="booking-box" style="background-color: #f0fdf4; border-left-color: #22c55e;">
          <h3 style="margin-top: 0; color: #166534;">🎁 სპეციალური შეთავაზება!</h3>
          <p>შემდეგ ვიზიტზე მიიღებთ <strong>10% ფასდაკლებას</strong>!</p>
          <p style="font-size: 24px; font-weight: bold; color: #1a365d; text-align: center;">COMEBACK10</p>
          <p style="font-size: 12px; color: #666;">* მოქმედებს 1 წლის განმავლობაში</p>
        </div>

        <p>მალე გელოდებით! 🌊</p>
      `, 'ka'),
    }),

    en: (data: BookingEmailData): EmailData => ({
      to: data.guestEmail,
      subject: `🙏 Thank you for your stay! - Orbi City Batumi`,
      html: emailWrapper(`
        <h2 style="color: #1a365d;">Hello ${data.guestName}!</h2>
        <p>Thank you for staying at <strong>Orbi City Batumi</strong>!</p>
        <p>We hope you enjoyed your time with us and had a wonderful experience.</p>

        <div style="background: linear-gradient(135deg, #d4af37 0%, #c9a227 100%); padding: 25px; border-radius: 10px; text-align: center; margin: 30px 0;">
          <h3 style="color: #1a365d; margin-top: 0;">⭐ Leave us a review</h3>
          <p style="color: #1a365d;">Your feedback means the world to us!</p>
          <a href="https://g.page/r/orbicity/review" style="display: inline-block; background-color: #1a365d; color: #d4af37 !important; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Review on Google</a>
        </div>

        <div class="booking-box" style="background-color: #f0fdf4; border-left-color: #22c55e;">
          <h3 style="margin-top: 0; color: #166534;">🎁 Special Offer!</h3>
          <p>Get <strong>10% off</strong> your next stay!</p>
          <p style="font-size: 24px; font-weight: bold; color: #1a365d; text-align: center;">COMEBACK10</p>
          <p style="font-size: 12px; color: #666;">* Valid for 1 year</p>
        </div>

        <p>We hope to see you again soon! 🌊</p>
      `, 'en'),
    }),
  },

  // Welcome Email (after registration)
  WELCOME: {
    ka: (data: { name: string; email: string }): EmailData => ({
      to: data.email,
      subject: `🎉 კეთილი იყოს თქვენი მობრძანება! - Orbi City Batumi`,
      html: emailWrapper(`
        <h2 style="color: #1a365d;">გამარჯობა ${data.name}!</h2>
        <p>კეთილი იყოს თქვენი მობრძანება <strong>Orbi City Batumi</strong>-ის ოჯახში!</p>

        <div style="background: linear-gradient(135deg, #d4af37 0%, #c9a227 100%); padding: 25px; border-radius: 10px; text-align: center; margin: 30px 0;">
          <h3 style="color: #1a365d; margin-top: 0;">🎁 სასწავულო საჩუქარი!</h3>
          <p style="color: #1a365d; font-size: 18px;">მიიღეთ <strong>15% ფასდაკლება</strong> პირველ ჯავშანზე!</p>
          <p style="font-size: 28px; font-weight: bold; color: #1a365d;">WELCOME15</p>
        </div>

        <h3 style="color: #1a365d;">რას მიიღებთ Orbi City-ში:</h3>
        <ul>
          <li>🌊 შავი ზღვის პანორამული ხედი</li>
          <li>🏊 უსასრულო აუზი</li>
          <li>🏋️ ფიტნეს ცენტრი</li>
          <li>☕ რესტორანი და ბარი</li>
          <li>🎰 გასართობი ზონა</li>
          <li>🅿️ უფასო პარკინგი</li>
        </ul>

        <center>
          <a href="${COMPANY.website}/apartments" class="button">აპარტამენტების ნახვა</a>
        </center>

        <p>გაქვთ შეკითხვები? დაგვიკავშირდით ნებისმიერ დროს!</p>
      `, 'ka'),
    }),

    en: (data: { name: string; email: string }): EmailData => ({
      to: data.email,
      subject: `🎉 Welcome to Orbi City Batumi!`,
      html: emailWrapper(`
        <h2 style="color: #1a365d;">Hello ${data.name}!</h2>
        <p>Welcome to the <strong>Orbi City Batumi</strong> family!</p>

        <div style="background: linear-gradient(135deg, #d4af37 0%, #c9a227 100%); padding: 25px; border-radius: 10px; text-align: center; margin: 30px 0;">
          <h3 style="color: #1a365d; margin-top: 0;">🎁 Welcome Gift!</h3>
          <p style="color: #1a365d; font-size: 18px;">Get <strong>15% off</strong> your first booking!</p>
          <p style="font-size: 28px; font-weight: bold; color: #1a365d;">WELCOME15</p>
        </div>

        <h3 style="color: #1a365d;">What you'll experience at Orbi City:</h3>
        <ul>
          <li>🌊 Panoramic Black Sea views</li>
          <li>🏊 Infinity pool</li>
          <li>🏋️ Fitness center</li>
          <li>☕ Restaurant & bar</li>
          <li>🎰 Entertainment area</li>
          <li>🅿️ Free parking</li>
        </ul>

        <center>
          <a href="${COMPANY.website}/apartments" class="button">View Apartments</a>
        </center>

        <p>Have questions? Contact us anytime!</p>
      `, 'en'),
    }),
  },
};

// Calculate email schedule dates
export const calculateEmailSchedule = (checkIn: string, checkOut: string) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  // Reminder: 1 day before at 10:00 AM
  const reminderDate = new Date(checkInDate);
  reminderDate.setDate(reminderDate.getDate() - 1);
  reminderDate.setHours(10, 0, 0, 0);

  // Thank you: 1 day after checkout at 14:00
  const thankYouDate = new Date(checkOutDate);
  thankYouDate.setDate(thankYouDate.getDate() + 1);
  thankYouDate.setHours(14, 0, 0, 0);

  return {
    checkinReminder: reminderDate.toISOString(),
    thankYou: thankYouDate.toISOString(),
  };
};

// Send email via Edge Function
export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
