import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SeasonalPrice {
  id: string;
  apartment_type: string;
  month: number;
  year: number;
  price_per_night: number;
  is_active: boolean;
}

interface ApartmentPrice {
  id: string;
  apartment_type: string;
  name_en: string;
  name_ka: string;
  price_per_night: number;
  max_guests: number;
}

export const useSeasonalPricing = () => {
  // Fetch base apartment prices
  const { data: apartments } = useQuery({
    queryKey: ['apartment-prices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apartment_prices')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      if (error) throw error;
      return data as ApartmentPrice[];
    },
  });

  // Fetch seasonal prices for current and next year
  const currentYear = new Date().getFullYear();
  const { data: seasonalPrices } = useQuery({
    queryKey: ['seasonal-prices-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seasonal_prices')
        .select('*')
        .eq('is_active', true)
        .gte('year', currentYear)
        .lte('year', currentYear + 2);
      if (error) throw error;
      return data as SeasonalPrice[];
    },
  });

  // Get price for a specific apartment on a specific date
  const getPriceForDate = (apartmentType: string, date: Date): number => {
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    const year = date.getFullYear();

    // First check seasonal price
    const seasonalPrice = seasonalPrices?.find(
      p => p.apartment_type === apartmentType && p.month === month && p.year === year
    );

    if (seasonalPrice) {
      return seasonalPrice.price_per_night;
    }

    // Fall back to base price
    const apartment = apartments?.find(a => a.apartment_type === apartmentType);
    return apartment?.price_per_night || 0;
  };

  // Calculate total price for a date range
  const calculateTotalPrice = (
    apartmentType: string,
    checkIn: Date,
    checkOut: Date
  ): { total: number; nights: number; breakdown: { date: Date; price: number }[] } => {
    const breakdown: { date: Date; price: number }[] = [];
    let total = 0;
    let currentDate = new Date(checkIn);
    
    while (currentDate < checkOut) {
      const price = getPriceForDate(apartmentType, currentDate);
      breakdown.push({ date: new Date(currentDate), price });
      total += price;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      total,
      nights: breakdown.length,
      breakdown,
    };
  };

  return {
    apartments,
    seasonalPrices,
    getPriceForDate,
    calculateTotalPrice,
  };
};
