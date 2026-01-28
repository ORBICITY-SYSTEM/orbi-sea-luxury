import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  EMAIL_TEMPLATES,
  BookingEmailData,
  calculateEmailSchedule,
} from '@/lib/automatedEmails';
import { toast } from 'sonner';

export interface ScheduledEmail {
  id: string;
  booking_id: string;
  email_type: string;
  scheduled_at: string;
  to_email: string;
  subject: string;
  html_content: string;
  status: string;
  created_at: string;
  sent_at?: string;
  error_message?: string;
}

export const useAutomatedEmails = () => {
  const queryClient = useQueryClient();

  // Send immediate email via Supabase Edge Function
  const sendEmail = useMutation({
    mutationFn: async ({
      type,
      data,
    }: {
      type: 'confirmation' | 'checkin_reminder' | 'thank_you' | 'welcome';
      data: BookingEmailData | { name: string; email: string };
    }) => {
      const lang = (data as BookingEmailData).language || 'en';
      let emailData;

      switch (type) {
        case 'confirmation':
          emailData = EMAIL_TEMPLATES.BOOKING_CONFIRMATION[lang](data as BookingEmailData);
          break;
        case 'checkin_reminder':
          emailData = EMAIL_TEMPLATES.CHECKIN_REMINDER[lang](data as BookingEmailData);
          break;
        case 'thank_you':
          emailData = EMAIL_TEMPLATES.THANK_YOU[lang](data as BookingEmailData);
          break;
        case 'welcome':
          emailData = EMAIL_TEMPLATES.WELCOME[lang](data as { name: string; email: string });
          break;
        default:
          throw new Error('Unknown email type');
      }

      // Call Supabase Edge Function
      const { data: result, error } = await supabase.functions.invoke('send-email', {
        body: emailData,
      });

      if (error) throw error;

      // Log the email
      await supabase.from('email_logs').insert({
        recipient: emailData.to,
        subject: emailData.subject,
        template_id: type,
        status: 'sent',
      });

      return result;
    },
    onSuccess: () => {
      toast.success('ელფოსტა გაიგზავნა');
    },
    onError: (error: Error) => {
      toast.error(`შეცდომა: ${error.message}`);
    },
  });

  // Schedule emails for a booking
  const scheduleBookingEmails = useMutation({
    mutationFn: async ({
      bookingId,
      data,
    }: {
      bookingId: string;
      data: BookingEmailData;
    }) => {
      const schedule = calculateEmailSchedule(data.checkIn, data.checkOut);
      const lang = data.language || 'en';

      const reminderEmail = EMAIL_TEMPLATES.CHECKIN_REMINDER[lang](data);
      const thankYouEmail = EMAIL_TEMPLATES.THANK_YOU[lang](data);

      const emails = [
        {
          booking_id: bookingId,
          email_type: 'checkin_reminder',
          scheduled_at: schedule.checkinReminder,
          to_email: data.guestEmail,
          subject: reminderEmail.subject,
          html_content: reminderEmail.html,
          status: 'pending',
        },
        {
          booking_id: bookingId,
          email_type: 'thank_you',
          scheduled_at: schedule.thankYou,
          to_email: data.guestEmail,
          subject: thankYouEmail.subject,
          html_content: thankYouEmail.html,
          status: 'pending',
        },
      ];

      const { data: inserted, error } = await supabase
        .from('scheduled_emails')
        .insert(emails)
        .select();

      if (error) throw error;
      return inserted;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-emails'] });
      toast.success('ავტომატური ელფოსტები დაგეგმილია');
    },
  });

  // Send booking confirmation immediately + schedule follow-ups
  const processBookingEmails = useMutation({
    mutationFn: async ({
      bookingId,
      data,
    }: {
      bookingId: string;
      data: BookingEmailData;
    }) => {
      // Send confirmation immediately
      await sendEmail.mutateAsync({ type: 'confirmation', data });

      // Schedule reminder and thank you
      await scheduleBookingEmails.mutateAsync({ bookingId, data });

      return true;
    },
  });

  // Cancel scheduled email
  const cancelScheduledEmail = useMutation({
    mutationFn: async (emailId: string) => {
      const { error } = await supabase
        .from('scheduled_emails')
        .update({ status: 'cancelled' })
        .eq('id', emailId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-emails'] });
      toast.success('ელფოსტა გაუქმდა');
    },
  });

  return {
    sendEmail,
    scheduleBookingEmails,
    processBookingEmails,
    cancelScheduledEmail,
  };
};
