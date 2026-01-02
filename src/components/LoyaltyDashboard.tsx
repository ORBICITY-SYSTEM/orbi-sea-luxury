import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Gift, TrendingUp, Award, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

interface LoyaltyData {
  points: number;
  total_earned: number;
  total_redeemed: number;
  tier: string;
}

const TIER_CONFIG = {
  bronze: { min: 0, max: 500, color: 'bg-amber-600', icon: Star, discount: 5 },
  silver: { min: 500, max: 1500, color: 'bg-gray-400', icon: Award, discount: 10 },
  gold: { min: 1500, max: 3000, color: 'bg-yellow-500', icon: Crown, discount: 15 },
  platinum: { min: 3000, max: Infinity, color: 'bg-purple-500', icon: Sparkles, discount: 20 },
};

export const LoyaltyDashboard = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoyaltyData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching loyalty data:', error);
      } else if (data) {
        setLoyaltyData(data);
      }
      setLoading(false);
    };

    fetchLoyaltyData();
  }, [user]);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="h-48" />
      </Card>
    );
  }

  if (!user || !loyaltyData) {
    return null;
  }

  const currentTier = (loyaltyData.tier as keyof typeof TIER_CONFIG) || 'bronze';
  const tierConfig = TIER_CONFIG[currentTier];
  const TierIcon = tierConfig.icon;
  
  const nextTier = currentTier === 'bronze' ? 'silver' : currentTier === 'silver' ? 'gold' : currentTier === 'gold' ? 'platinum' : null;
  const nextTierConfig = nextTier ? TIER_CONFIG[nextTier] : null;
  const progressToNext = nextTierConfig 
    ? Math.min(100, ((loyaltyData.total_earned - tierConfig.min) / (nextTierConfig.min - tierConfig.min)) * 100)
    : 100;

  const tierNames = {
    bronze: language === 'ka' ? 'ბრინჯაო' : 'Bronze',
    silver: language === 'ka' ? 'ვერცხლი' : 'Silver',
    gold: language === 'ka' ? 'ოქრო' : 'Gold',
    platinum: language === 'ka' ? 'პლატინა' : 'Platinum',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <div className={`${tierConfig.color} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TierIcon className="w-10 h-10" />
              <div>
                <p className="text-sm opacity-90">
                  {language === 'ka' ? 'თქვენი სტატუსი' : 'Your Status'}
                </p>
                <h3 className="text-2xl font-bold">{tierNames[currentTier]}</h3>
              </div>
            </div>
            <Badge className="bg-white/20 text-white hover:bg-white/30 text-lg px-4 py-2">
              {loyaltyData.points} {language === 'ka' ? 'ქულა' : 'pts'}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-6 space-y-6">
          {/* Progress to next tier */}
          {nextTier && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {language === 'ka' ? 'შემდეგი დონე:' : 'Next tier:'} {tierNames[nextTier]}
                </span>
                <span className="font-medium">
                  {nextTierConfig!.min - loyaltyData.total_earned} {language === 'ka' ? 'ქულა დარჩა' : 'pts to go'}
                </span>
              </div>
              <Progress value={progressToNext} className="h-2" />
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{loyaltyData.total_earned}</p>
              <p className="text-xs text-muted-foreground">
                {language === 'ka' ? 'სულ დაგროვილი' : 'Total Earned'}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Gift className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{loyaltyData.total_redeemed}</p>
              <p className="text-xs text-muted-foreground">
                {language === 'ka' ? 'გამოყენებული' : 'Redeemed'}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Star className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{tierConfig.discount}%</p>
              <p className="text-xs text-muted-foreground">
                {language === 'ka' ? 'ფასდაკლება' : 'Discount'}
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              {language === 'ka' ? 'თქვენი უპირატესობები' : 'Your Benefits'}
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• {tierConfig.discount}% {language === 'ka' ? 'ფასდაკლება ყველა ჯავშანზე' : 'discount on all bookings'}</li>
              <li>• {language === 'ka' ? 'უფასო ადრეული ჩექ-ინი (მოთხოვნით)' : 'Free early check-in (on request)'}</li>
              {currentTier !== 'bronze' && (
                <li>• {language === 'ka' ? 'პრიორიტეტული მხარდაჭერა' : 'Priority support'}</li>
              )}
              {(currentTier === 'gold' || currentTier === 'platinum') && (
                <li>• {language === 'ka' ? 'უფასო აეროპორტის ტრანსფერი' : 'Free airport transfer'}</li>
              )}
            </ul>
          </div>

          {/* How to earn */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              {language === 'ka' 
                ? '💡 ყოველ 10 GEL-ზე იღებთ 1 ქულას. ქულები ავტომატურად იხარჯება ჯავშანზე.'
                : '💡 Earn 1 point for every 10 GEL spent. Points are automatically applied to bookings.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Hook for using loyalty discount in booking
export const useLoyaltyDiscount = () => {
  const { user } = useAuth();
  const [discount, setDiscount] = useState(0);
  const [tier, setTier] = useState<string>('bronze');
  const [availablePoints, setAvailablePoints] = useState(0);

  useEffect(() => {
    const fetchDiscount = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('loyalty_points')
        .select('points, tier')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        const tierKey = (data.tier as keyof typeof TIER_CONFIG) || 'bronze';
        setTier(data.tier);
        setDiscount(TIER_CONFIG[tierKey].discount);
        setAvailablePoints(data.points);
      }
    };

    fetchDiscount();
  }, [user]);

  return { discount, tier, availablePoints, isLoggedIn: !!user };
};

// Function to add points after booking
export const addLoyaltyPoints = async (userId: string, amount: number) => {
  const pointsToAdd = Math.floor(amount / 10); // 1 point per 10 GEL
  
  const { data: currentData } = await supabase
    .from('loyalty_points')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (!currentData) return;

  const newTotalEarned = currentData.total_earned + pointsToAdd;
  const newPoints = currentData.points + pointsToAdd;
  
  // Calculate new tier
  let newTier = 'bronze';
  if (newTotalEarned >= 3000) newTier = 'platinum';
  else if (newTotalEarned >= 1500) newTier = 'gold';
  else if (newTotalEarned >= 500) newTier = 'silver';

  await supabase
    .from('loyalty_points')
    .update({
      points: newPoints,
      total_earned: newTotalEarned,
      tier: newTier,
    })
    .eq('user_id', userId);

  return { pointsAdded: pointsToAdd, newTotal: newPoints, newTier };
};
