import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/Layout';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ka } from 'date-fns/locale';
import { 
  Calendar, 
  Star, 
  Gift, 
  Clock, 
  CheckCircle, 
  XCircle,
  Loader2,
  User,
  CreditCard,
  History,
  Trophy
} from 'lucide-react';

const tierColors: Record<string, string> = {
  bronze: 'bg-amber-700/20 text-amber-600 border-amber-700/30',
  silver: 'bg-gray-400/20 text-gray-300 border-gray-400/30',
  gold: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  platinum: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

const tierLabels: Record<string, { en: string; ka: string }> = {
  bronze: { en: 'Bronze', ka: 'ბრინჯაო' },
  silver: { en: 'Silver', ka: 'ვერცხლი' },
  gold: { en: 'Gold', ka: 'ოქრო' },
  platinum: { en: 'Platinum', ka: 'პლატინა' },
};

const statusLabels: Record<string, { en: string; ka: string; color: string }> = {
  pending: { en: 'Pending', ka: 'მოლოდინში', color: 'bg-yellow-500/20 text-yellow-400' },
  confirmed: { en: 'Confirmed', ka: 'დადასტურებული', color: 'bg-green-500/20 text-green-400' },
  cancelled: { en: 'Cancelled', ka: 'გაუქმებული', color: 'bg-red-500/20 text-red-400' },
  completed: { en: 'Completed', ka: 'დასრულებული', color: 'bg-blue-500/20 text-blue-400' },
};

const GuestDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Fetch user profile
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch bookings
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['user-bookings', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Fetch loyalty points
  const { data: loyaltyPoints } = useQuery({
    queryKey: ['loyalty-points', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  const upcomingBookings = bookings.filter(b => 
    new Date(b.check_in) >= new Date() && b.status !== 'cancelled'
  );
  const pastBookings = bookings.filter(b => 
    new Date(b.check_out) < new Date() || b.status === 'completed'
  );
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

  const tier = loyaltyPoints?.tier || 'bronze';
  const points = loyaltyPoints?.points || 0;
  const totalEarned = loyaltyPoints?.total_earned || 0;
  const totalRedeemed = loyaltyPoints?.total_redeemed || 0;

  const nextTierPoints: Record<string, number> = {
    bronze: 1000,
    silver: 5000,
    gold: 15000,
    platinum: Infinity,
  };

  const progressToNextTier = tier === 'platinum' 
    ? 100 
    : Math.min(100, (totalEarned / nextTierPoints[tier]) * 100);

  const tierLabel = t(`dashboard.tier.${tier}`);
  const getText = (key: string) => t(`dashboard.${key}`);

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground">
              {t('dashboard.welcome')}, {profile?.full_name || user.email}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Loyalty Points Card */}
            <Card className="lg:col-span-1 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                {t('dashboard.loyaltyPoints')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <Badge variant="outline" className={`${tierColors[tier]} text-lg px-4 py-1 mb-4`}>
                    {tierLabel}
                  </Badge>
                  <div className="text-5xl font-bold text-primary mb-2">{points}</div>
                  <p className="text-sm text-muted-foreground">{t('dashboard.currentPoints')}</p>
                </div>

                {tier !== 'platinum' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('dashboard.progressToNext')}</span>
                      <span className="text-foreground">{Math.round(progressToNextTier)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${progressToNextTier}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="text-xl font-semibold text-green-400">{totalEarned}</div>
                    <p className="text-xs text-muted-foreground">{t('dashboard.totalEarned')}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-orange-400">{totalRedeemed}</div>
                    <p className="text-xs text-muted-foreground">{t('dashboard.totalRedeemed')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bookings Section */}
            <Card className="lg:col-span-2">
              <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {t('dashboard.myBookings')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upcoming" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="upcoming" className="gap-2">
                      <Clock className="w-4 h-4" />
                      {t('dashboard.upcoming')} ({upcomingBookings.length})
                    </TabsTrigger>
                    <TabsTrigger value="past" className="gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {t('dashboard.past')} ({pastBookings.length})
                    </TabsTrigger>
                    <TabsTrigger value="cancelled" className="gap-2">
                      <XCircle className="w-4 h-4" />
                      {t('dashboard.cancelled')} ({cancelledBookings.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming">
                    <BookingsList 
                      bookings={upcomingBookings} 
                      emptyMessage={t('dashboard.noBookings')}
                      language={language}
                      t={t}
                    />
                  </TabsContent>

                  <TabsContent value="past">
                    <BookingsList 
                      bookings={pastBookings} 
                      emptyMessage={t('dashboard.noBookings')}
                      language={language}
                      t={t}
                    />
                  </TabsContent>

                  <TabsContent value="cancelled">
                    <BookingsList 
                      bookings={cancelledBookings} 
                      emptyMessage={t('dashboard.noBookings')}
                      language={language}
                      t={t}
                    />
                  </TabsContent>
                </Tabs>

                {bookings.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">{t('dashboard.noBookings')}</p>
                    <Button onClick={() => navigate('/apartments')}>
                      {t('dashboard.bookNow')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface BookingsListProps {
  bookings: any[];
  emptyMessage: string;
  language: string;
  t: (key: string) => string;
}

const BookingsList = ({ bookings, emptyMessage, language, t }: BookingsListProps) => {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const statusKey = `dashboard.status.${booking.status}`;
        const statusColor = booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                           booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                           booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                           'bg-blue-500/20 text-blue-400';
        const checkIn = new Date(booking.check_in);
        const checkOut = new Date(booking.check_out);
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

        return (
          <Card key={booking.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={statusColor}>
                      {t(statusKey)}
                    </Badge>
                    <span className="font-medium text-foreground">{booking.apartment_type}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(checkIn, 'd MMM', { locale: ka })} - {format(checkOut, 'd MMM, yyyy', { locale: ka })}
                    </span>
                    <span>{nights} {t('dashboard.nights')}</span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {booking.guests} {t('dashboard.guests')}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold text-primary">
                    ₾{booking.total_price?.toFixed(2) || '0.00'}
                  </div>
                  {booking.discount_amount > 0 && (
                    <p className="text-xs text-green-400">
                      -{booking.discount_amount} ₾ {t('dashboard.discount')}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default GuestDashboard;
