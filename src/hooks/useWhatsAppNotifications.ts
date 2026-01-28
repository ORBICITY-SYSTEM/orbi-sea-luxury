import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from './useSiteSettings';
import {
  BookingNotificationData,
  sendBookingConfirmation,
  sendCheckinReminder,
  sendThankYouMessage,
  calculateNotificationDates,
  WHATSAPP_TEMPLATES,
  formatPhoneForWhatsApp,
} from '@/lib/whatsappNotifications';
import { toast } from 'sonner';

export interface ScheduledNotification {
  id: string;
  booking_id: string;
  notification_type: string;
  scheduled_at: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
  sent_at?: string;
  error_message?: string;
}

export const useWhatsAppNotifications = () => {
  const queryClient = useQueryClient();
  const { settings } = useSiteSettings();
  const webhookUrl = settings?.whatsapp_webhook_url || '';

  // Send immediate notification
  const sendNotification = useMutation({
    mutationFn: async ({
      type,
      data,
    }: {
      type: 'confirmation' | 'checkin_reminder' | 'thank_you';
      data: BookingNotificationData;
    }) => {
      if (!webhookUrl) {
        throw new Error('WhatsApp webhook URL not configured');
      }

      let success = false;
      switch (type) {
        case 'confirmation':
          success = await sendBookingConfirmation(webhookUrl, data);
          break;
        case 'checkin_reminder':
          success = await sendCheckinReminder(webhookUrl, data);
          break;
        case 'thank_you':
          success = await sendThankYouMessage(webhookUrl, data);
          break;
      }

      if (!success) {
        throw new Error('Failed to send WhatsApp notification');
      }

      return success;
    },
    onSuccess: () => {
      toast.success('WhatsApp შეტყობინება გაიგზავნა');
    },
    onError: (error: Error) => {
      toast.error(`შეცდომა: ${error.message}`);
    },
  });

  // Schedule notifications for a booking
  const scheduleBookingNotifications = useMutation({
    mutationFn: async ({
      bookingId,
      data,
    }: {
      bookingId: string;
      data: BookingNotificationData;
    }) => {
      const dates = calculateNotificationDates(data.checkIn, data.checkOut);
      const lang = data.language || 'ka';

      const notifications = [
        {
          booking_id: bookingId,
          notification_type: 'checkin_reminder',
          scheduled_at: dates.checkinReminder,
          phone: formatPhoneForWhatsApp(data.guestPhone),
          message: WHATSAPP_TEMPLATES.CHECKIN_REMINDER[lang](data),
          status: 'pending',
        },
        {
          booking_id: bookingId,
          notification_type: 'thank_you',
          scheduled_at: dates.thankYou,
          phone: formatPhoneForWhatsApp(data.guestPhone),
          message: WHATSAPP_TEMPLATES.THANK_YOU[lang](data),
          status: 'pending',
        },
      ];

      const { data: inserted, error } = await supabase
        .from('scheduled_notifications')
        .insert(notifications)
        .select();

      if (error) throw error;
      return inserted;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-notifications'] });
    },
  });

  // Get scheduled notifications
  const { data: scheduledNotifications } = useQuery({
    queryKey: ['scheduled-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_notifications')
        .select('*')
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      return data as ScheduledNotification[];
    },
  });

  // Cancel scheduled notification
  const cancelNotification = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('scheduled_notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-notifications'] });
      toast.success('შეტყობინება გაუქმდა');
    },
  });

  // Send manual WhatsApp message
  const sendManualMessage = useMutation({
    mutationFn: async ({ phone, message }: { phone: string; message: string }) => {
      if (!webhookUrl) {
        // If no webhook, open WhatsApp directly
        const formattedPhone = formatPhoneForWhatsApp(phone);
        window.open(
          `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`,
          '_blank'
        );
        return true;
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formatPhoneForWhatsApp(phone),
          message,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      return true;
    },
    onSuccess: () => {
      toast.success('შეტყობინება გაიგზავნა');
    },
    onError: () => {
      toast.error('შეტყობინების გაგზავნა ვერ მოხერხდა');
    },
  });

  return {
    sendNotification,
    scheduleBookingNotifications,
    scheduledNotifications,
    cancelNotification,
    sendManualMessage,
    isConfigured: !!webhookUrl,
  };
};
