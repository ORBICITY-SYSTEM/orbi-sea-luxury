import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// 1 point = 0.1 GEL (10 points = 1 GEL)
const POINTS_TO_GEL_RATIO = 0.1;

interface LoyaltyData {
  id: string;
  points: number;
  tier: string;
  total_earned: number;
  total_redeemed: number;
}

export const useLoyaltyRedemption = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  const { data: loyaltyData, isLoading } = useQuery({
    queryKey: ['loyalty-points', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as LoyaltyData | null;
    },
    enabled: !!user?.id,
  });

  const redeemPointsMutation = useMutation({
    mutationFn: async (points: number) => {
      if (!user?.id || !loyaltyData) throw new Error('No user or loyalty data');
      
      const newPoints = loyaltyData.points - points;
      const newTotalRedeemed = loyaltyData.total_redeemed + points;

      const { error } = await supabase
        .from('loyalty_points')
        .update({
          points: newPoints,
          total_redeemed: newTotalRedeemed,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;
      return { pointsRedeemed: points, discountAmount: points * POINTS_TO_GEL_RATIO };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-points', user?.id] });
    },
  });

  const calculateDiscount = (points: number): number => {
    return points * POINTS_TO_GEL_RATIO;
  };

  const getMaxRedeemablePoints = (totalPrice: number): number => {
    if (!loyaltyData) return 0;
    // Max 50% of total price can be paid with points
    const maxPointsForPrice = Math.floor((totalPrice * 0.5) / POINTS_TO_GEL_RATIO);
    return Math.min(loyaltyData.points, maxPointsForPrice);
  };

  const resetRedemption = () => {
    setPointsToRedeem(0);
  };

  return {
    loyaltyData,
    isLoading,
    pointsToRedeem,
    setPointsToRedeem,
    calculateDiscount,
    getMaxRedeemablePoints,
    redeemPoints: redeemPointsMutation.mutateAsync,
    isRedeeming: redeemPointsMutation.isPending,
    resetRedemption,
    availablePoints: loyaltyData?.points || 0,
    tier: loyaltyData?.tier || 'bronze',
  };
};

export default useLoyaltyRedemption;
