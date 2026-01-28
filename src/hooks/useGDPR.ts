import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

export interface UserDataExport {
  profile: {
    email: string | undefined;
    fullName: string | null;
    phone: string | null;
    createdAt: string | undefined;
  };
  bookings: Array<{
    id: string;
    apartmentType: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number | null;
    status: string;
    createdAt: string;
  }>;
  loyaltyPoints: {
    points: number;
    tier: string;
  } | null;
  newsletterSubscription: boolean;
  consentHistory: Array<{
    type: string;
    timestamp: string;
    status: string;
  }>;
}

export const useGDPR = () => {
  const { user, signOut } = useAuth();

  // Export all user data
  const exportUserData = useMutation({
    mutationFn: async (): Promise<UserDataExport> => {
      if (!user?.id) throw new Error('User not authenticated');

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Fetch bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch loyalty points
      const { data: loyaltyPoints } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Fetch newsletter subscription
      const { data: newsletter } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('email', user.email)
        .single();

      // Compile export data
      const exportData: UserDataExport = {
        profile: {
          email: user.email,
          fullName: profile?.full_name || null,
          phone: profile?.phone || null,
          createdAt: user.created_at,
        },
        bookings: (bookings || []).map((b) => ({
          id: b.id,
          apartmentType: b.apartment_type,
          checkIn: b.check_in,
          checkOut: b.check_out,
          guests: b.guests,
          totalPrice: b.total_price,
          status: b.status,
          createdAt: b.created_at,
        })),
        loyaltyPoints: loyaltyPoints
          ? {
              points: loyaltyPoints.points,
              tier: loyaltyPoints.tier,
            }
          : null,
        newsletterSubscription: !!newsletter?.is_active,
        consentHistory: [
          {
            type: 'terms_accepted',
            timestamp: user.created_at || '',
            status: 'accepted',
          },
          {
            type: 'privacy_policy',
            timestamp: user.created_at || '',
            status: 'accepted',
          },
        ],
      };

      return exportData;
    },
    onSuccess: (data) => {
      // Download as JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orbi-city-data-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('მონაცემები გადმოწერილია');
    },
    onError: (error: Error) => {
      toast.error(`შეცდომა: ${error.message}`);
    },
  });

  // Delete user account and all data
  const deleteAccount = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // Delete in order to respect foreign key constraints

      // 1. Delete booking notes
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id')
        .eq('user_id', user.id);

      if (bookings && bookings.length > 0) {
        const bookingIds = bookings.map((b) => b.id);
        await supabase
          .from('booking_notes')
          .delete()
          .in('booking_id', bookingIds);
      }

      // 2. Delete scheduled notifications
      if (bookings && bookings.length > 0) {
        const bookingIds = bookings.map((b) => b.id);
        await supabase
          .from('scheduled_notifications')
          .delete()
          .in('booking_id', bookingIds);

        await supabase
          .from('scheduled_emails')
          .delete()
          .in('booking_id', bookingIds);
      }

      // 3. Delete bookings
      await supabase.from('bookings').delete().eq('user_id', user.id);

      // 4. Delete loyalty points
      await supabase.from('loyalty_points').delete().eq('user_id', user.id);

      // 5. Delete profile
      await supabase.from('profiles').delete().eq('user_id', user.id);

      // 6. Delete newsletter subscription
      if (user.email) {
        await supabase
          .from('newsletter_subscribers')
          .delete()
          .eq('email', user.email);
      }

      // 7. Delete blog comments by this user
      await supabase.from('blog_comments').delete().eq('user_id', user.id);

      // 8. Delete user roles
      await supabase.from('user_roles').delete().eq('user_id', user.id);

      // 9. Finally, delete the user auth record via Edge Function
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId: user.id },
      });

      if (error) throw error;

      // Sign out after deletion
      await signOut();
    },
    onSuccess: () => {
      toast.success('ანგარიში წაიშალა');
    },
    onError: (error: Error) => {
      toast.error(`შეცდომა: ${error.message}`);
    },
  });

  // Unsubscribe from newsletter
  const unsubscribeNewsletter = useMutation({
    mutationFn: async () => {
      if (!user?.email) throw new Error('User email not found');

      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ is_active: false })
        .eq('email', user.email);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('სიახლეების გამოწერა გაუქმდა');
    },
  });

  // Withdraw marketing consent
  const withdrawMarketingConsent = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // Update profile to mark marketing consent as withdrawn
      const { error } = await supabase
        .from('profiles')
        .update({ marketing_consent: false })
        .eq('user_id', user.id);

      if (error) throw error;

      // Also unsubscribe from newsletter
      if (user.email) {
        await supabase
          .from('newsletter_subscribers')
          .update({ is_active: false })
          .eq('email', user.email);
      }
    },
    onSuccess: () => {
      toast.success('მარკეტინგული თანხმობა გაუქმდა');
    },
  });

  return {
    exportUserData,
    deleteAccount,
    unsubscribeNewsletter,
    withdrawMarketingConsent,
    isLoading:
      exportUserData.isPending ||
      deleteAccount.isPending ||
      unsubscribeNewsletter.isPending ||
      withdrawMarketingConsent.isPending,
  };
};
