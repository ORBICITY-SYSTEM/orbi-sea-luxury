import { supabase } from '@/integrations/supabase/client';

interface EmailData {
  type: 'booking_confirmation' | 'contact_reply' | 'welcome' | 'custom';
  to: string;
  subject?: string;
  data: Record<string, any>;
}

export const useEmail = () => {
  const sendEmail = async (emailData: EmailData): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: emailData,
      });

      if (error) {
        console.error('Email send error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Email send exception:', err);
      return { success: false, error: 'Failed to send email' };
    }
  };

  const sendBookingConfirmation = async (
    to: string,
    bookingData: {
      guestName: string;
      checkIn: string;
      checkOut: string;
      guests: number;
      apartmentName: string;
    }
  ) => {
    return sendEmail({
      type: 'booking_confirmation',
      to,
      data: bookingData,
    });
  };

  const sendContactReply = async (
    to: string,
    contactData: {
      name: string;
      message: string;
    }
  ) => {
    return sendEmail({
      type: 'contact_reply',
      to,
      data: contactData,
    });
  };

  const sendWelcomeEmail = async (
    to: string,
    userData: {
      name: string;
    }
  ) => {
    return sendEmail({
      type: 'welcome',
      to,
      data: userData,
    });
  };

  return {
    sendEmail,
    sendBookingConfirmation,
    sendContactReply,
    sendWelcomeEmail,
  };
};
