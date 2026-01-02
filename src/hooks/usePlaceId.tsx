import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const DEFAULT_PLACE_ID = 'ChIJxf79LQmHZ0ARpmv2Eih-1WE';

export const usePlaceId = () => {
  const { data: placeId, isLoading } = useQuery({
    queryKey: ['google-maps-place-id'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'google_maps_place_id')
        .single();
      
      if (error || !data?.value) {
        return DEFAULT_PLACE_ID;
      }
      
      return data.value;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return {
    placeId: placeId || DEFAULT_PLACE_ID,
    isLoading
  };
};
