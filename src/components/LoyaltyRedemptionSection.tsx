import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Coins, Gift, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLoyaltyRedemption } from '@/hooks/useLoyaltyRedemption';

interface LoyaltyRedemptionSectionProps {
  totalPrice: number;
  onDiscountChange: (discount: number, pointsUsed: number) => void;
}

const LoyaltyRedemptionSection = ({ totalPrice, onDiscountChange }: LoyaltyRedemptionSectionProps) => {
  const { t, language } = useLanguage();
  const { 
    availablePoints, 
    tier, 
    isLoading, 
    calculateDiscount, 
    getMaxRedeemablePoints,
    loyaltyData 
  } = useLoyaltyRedemption();
  
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);

  const maxRedeemable = getMaxRedeemablePoints(totalPrice);
  const discountAmount = calculateDiscount(pointsToUse);

  useEffect(() => {
    if (usePoints && pointsToUse > 0) {
      onDiscountChange(discountAmount, pointsToUse);
    } else {
      onDiscountChange(0, 0);
    }
  }, [usePoints, pointsToUse, discountAmount, onDiscountChange]);

  useEffect(() => {
    // Reset when total price changes
    if (pointsToUse > maxRedeemable) {
      setPointsToUse(maxRedeemable);
    }
  }, [totalPrice, maxRedeemable]);

  if (isLoading || !loyaltyData || availablePoints <= 0) {
    return null;
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'gold': return 'bg-gradient-gold text-secondary-foreground';
      case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
      case 'platinum': return 'bg-gradient-to-r from-purple-400 to-indigo-500 text-white';
      default: return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white';
    }
  };

  return (
    <Card className="border-secondary/30 bg-gradient-to-br from-secondary/5 to-secondary/10">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-secondary" />
            <span className="font-medium text-foreground">
              {language === 'ka' ? 'ლოიალობის ქულები' : 'Loyalty Points'}
            </span>
          </div>
          <Badge className={getTierColor(tier)}>
            <Star className="w-3 h-3 mr-1" />
            {tier.charAt(0).toUpperCase() + tier.slice(1)}
          </Badge>
        </div>

        <div className="flex items-center justify-between bg-background/50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {language === 'ka' ? 'ხელმისაწვდომი ქულები:' : 'Available points:'}
            </span>
            <span className="font-bold text-primary">{availablePoints}</span>
          </div>
          <Switch
            checked={usePoints}
            onCheckedChange={(checked) => {
              setUsePoints(checked);
              if (!checked) setPointsToUse(0);
            }}
          />
        </div>

        {usePoints && maxRedeemable > 0 && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {language === 'ka' ? 'გამოსაყენებელი ქულები:' : 'Points to use:'}
              </span>
              <span className="font-semibold text-primary">{pointsToUse}</span>
            </div>
            
            <Slider
              value={[pointsToUse]}
              onValueChange={(value) => setPointsToUse(value[0])}
              max={maxRedeemable}
              step={10}
              className="py-2"
            />
            
            <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <span className="text-sm text-green-700 dark:text-green-400">
                {language === 'ka' ? 'ფასდაკლება:' : 'Discount:'}
              </span>
              <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                -{discountAmount.toFixed(2)} ₾
              </span>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              {language === 'ka' 
                ? '10 ქულა = 1 ლარი • მაქსიმუმ 50% ფასის'
                : '10 points = 1 GEL • Max 50% of price'}
            </p>
          </div>
        )}

        {usePoints && maxRedeemable === 0 && (
          <p className="text-sm text-amber-600 text-center">
            {language === 'ka' 
              ? 'ფასი ძალიან მცირეა ქულების გამოსაყენებლად'
              : 'Price is too low to use points'}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default LoyaltyRedemptionSection;
