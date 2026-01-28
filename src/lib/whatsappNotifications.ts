import { format } from 'date-fns';
import { ka } from 'date-fns/locale';

export interface WhatsAppMessage {
  to: string; // Phone number with country code (e.g., 995555199090)
  templateName: string;
  templateParams: Record<string, string>;
  language?: 'ka' | 'en';
}

export interface BookingNotificationData {
  guestName: string;
  guestPhone: string;
  apartmentType: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  bookingId: string;
  promoCode?: string;
  language?: 'ka' | 'en';
}

// WhatsApp message templates
export const WHATSAPP_TEMPLATES = {
  // Booking Confirmation
  BOOKING_CONFIRMATION: {
    ka: (data: BookingNotificationData) => `🏨 *Orbi City Batumi*

გამარჯობა ${data.guestName}!

თქვენი ჯავშანი დადასტურებულია ✅

📅 შესვლა: ${format(new Date(data.checkIn), 'd MMMM, yyyy', { locale: ka })}
📅 გასვლა: ${format(new Date(data.checkOut), 'd MMMM, yyyy', { locale: ka })}
🏠 აპარტამენტი: ${data.apartmentType}
💰 ჯამი: ₾${data.totalPrice}

📍 მისამართი: შერიფ ხიმშიაშვილის 7B, ბათუმი

გაქვთ შეკითხვები? მოგვწერეთ აქ!

გმადლობთ, რომ აირჩიეთ Orbi City! 🌊`,

    en: (data: BookingNotificationData) => `🏨 *Orbi City Batumi*

Hello ${data.guestName}!

Your booking is confirmed ✅

📅 Check-in: ${format(new Date(data.checkIn), 'MMMM d, yyyy')}
📅 Check-out: ${format(new Date(data.checkOut), 'MMMM d, yyyy')}
🏠 Apartment: ${data.apartmentType}
💰 Total: $${data.totalPrice}

📍 Address: 7B Sherif Khimshiashvili St, Batumi

Have questions? Message us here!

Thank you for choosing Orbi City! 🌊`,
  },

  // Check-in Reminder (1 day before)
  CHECKIN_REMINDER: {
    ka: (data: BookingNotificationData) => `🏨 *Orbi City Batumi*

გამარჯობა ${data.guestName}!

შეგახსენებთ, რომ ხვალ გელოდებით! 🎉

📅 შესვლა: ${format(new Date(data.checkIn), 'd MMMM, yyyy', { locale: ka })}
⏰ შესვლის დრო: 14:00-დან
🏠 აპარტამენტი: ${data.apartmentType}

📍 მისამართი: შერიფ ხიმშიაშვილის 7B, ბათუმი
🗺 Google Maps: https://maps.app.goo.gl/orbi

გაქვთ შეკითხვები? მოგვწერეთ!

გელოდებით! 🌊`,

    en: (data: BookingNotificationData) => `🏨 *Orbi City Batumi*

Hello ${data.guestName}!

This is a reminder that we're expecting you tomorrow! 🎉

📅 Check-in: ${format(new Date(data.checkIn), 'MMMM d, yyyy')}
⏰ Check-in time: From 2:00 PM
🏠 Apartment: ${data.apartmentType}

📍 Address: 7B Sherif Khimshiashvili St, Batumi
🗺 Google Maps: https://maps.app.goo.gl/orbi

Have questions? Message us!

See you soon! 🌊`,
  },

  // Thank You / Review Request (1 day after checkout)
  THANK_YOU: {
    ka: (data: BookingNotificationData) => `🏨 *Orbi City Batumi*

გამარჯობა ${data.guestName}!

გმადლობთ, რომ დარჩით ჩვენთან! 🙏

იმედი გვაქვს, რომ ისიამოვნეთ ყოფნით Orbi City-ში.

⭐ თუ მოგეწონათ, გთხოვთ დაგვიტოვეთ შეფასება:
https://g.page/r/orbicity/review

🎁 შემდეგ ვიზიტზე მიიღებთ 10% ფასდაკლებას კოდით: COMEBACK10

მალე გელოდებით! 🌊`,

    en: (data: BookingNotificationData) => `🏨 *Orbi City Batumi*

Hello ${data.guestName}!

Thank you for staying with us! 🙏

We hope you enjoyed your time at Orbi City.

⭐ If you liked your stay, please leave us a review:
https://g.page/r/orbicity/review

🎁 Get 10% off your next visit with code: COMEBACK10

See you again soon! 🌊`,
  },

  // Special Offer
  SPECIAL_OFFER: {
    ka: (data: { guestName: string; offerText: string; promoCode: string; validUntil: string }) =>
      `🏨 *Orbi City Batumi*

გამარჯობა ${data.guestName}!

🎉 სპეციალური შეთავაზება თქვენთვის!

${data.offerText}

🏷 პრომო კოდი: *${data.promoCode}*
⏰ მოქმედებს: ${data.validUntil}-მდე

დაჯავშნეთ ახლავე: orbicitybatumi.com

🌊 Orbi City Batumi`,

    en: (data: { guestName: string; offerText: string; promoCode: string; validUntil: string }) =>
      `🏨 *Orbi City Batumi*

Hello ${data.guestName}!

🎉 Special offer just for you!

${data.offerText}

🏷 Promo code: *${data.promoCode}*
⏰ Valid until: ${data.validUntil}

Book now: orbicitybatumi.com

🌊 Orbi City Batumi`,
  },
};

// Format phone number for WhatsApp
export const formatPhoneForWhatsApp = (phone: string): string => {
  // Remove all non-numeric characters
  let cleaned = phone.replace(/[^0-9]/g, '');

  // If starts with 0, remove it and add Georgia code
  if (cleaned.startsWith('0')) {
    cleaned = '995' + cleaned.substring(1);
  }

  // If doesn't start with country code, add Georgia code
  if (!cleaned.startsWith('995') && cleaned.length === 9) {
    cleaned = '995' + cleaned;
  }

  return cleaned;
};

// Generate WhatsApp URL for direct message
export const generateWhatsAppUrl = (phone: string, message: string): string => {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
};

// Send notification via webhook (for n8n or similar)
export const sendWhatsAppNotification = async (
  webhookUrl: string,
  phone: string,
  message: string,
  metadata?: Record<string, any>
): Promise<boolean> => {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: formatPhoneForWhatsApp(phone),
        message,
        timestamp: new Date().toISOString(),
        ...metadata,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return false;
  }
};

// Send booking confirmation
export const sendBookingConfirmation = async (
  webhookUrl: string,
  data: BookingNotificationData
): Promise<boolean> => {
  const lang = data.language || 'ka';
  const message = WHATSAPP_TEMPLATES.BOOKING_CONFIRMATION[lang](data);

  return sendWhatsAppNotification(webhookUrl, data.guestPhone, message, {
    type: 'booking_confirmation',
    bookingId: data.bookingId,
  });
};

// Send check-in reminder
export const sendCheckinReminder = async (
  webhookUrl: string,
  data: BookingNotificationData
): Promise<boolean> => {
  const lang = data.language || 'ka';
  const message = WHATSAPP_TEMPLATES.CHECKIN_REMINDER[lang](data);

  return sendWhatsAppNotification(webhookUrl, data.guestPhone, message, {
    type: 'checkin_reminder',
    bookingId: data.bookingId,
  });
};

// Send thank you message
export const sendThankYouMessage = async (
  webhookUrl: string,
  data: BookingNotificationData
): Promise<boolean> => {
  const lang = data.language || 'ka';
  const message = WHATSAPP_TEMPLATES.THANK_YOU[lang](data);

  return sendWhatsAppNotification(webhookUrl, data.guestPhone, message, {
    type: 'thank_you',
    bookingId: data.bookingId,
  });
};

// Queue notification for scheduled sending (stores in database)
export interface ScheduledNotification {
  id?: string;
  booking_id: string;
  notification_type: 'confirmation' | 'checkin_reminder' | 'thank_you' | 'special_offer';
  scheduled_at: string;
  phone: string;
  message: string;
  status: 'pending' | 'sent' | 'failed';
  created_at?: string;
}

// Helper to calculate reminder dates
export const calculateNotificationDates = (checkIn: string, checkOut: string) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  // Check-in reminder: 1 day before check-in at 10:00 AM
  const reminderDate = new Date(checkInDate);
  reminderDate.setDate(reminderDate.getDate() - 1);
  reminderDate.setHours(10, 0, 0, 0);

  // Thank you: 1 day after check-out at 12:00 PM
  const thankYouDate = new Date(checkOutDate);
  thankYouDate.setDate(thankYouDate.getDate() + 1);
  thankYouDate.setHours(12, 0, 0, 0);

  return {
    checkinReminder: reminderDate.toISOString(),
    thankYou: thankYouDate.toISOString(),
  };
};
