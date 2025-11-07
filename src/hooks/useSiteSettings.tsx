import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
  description: string | null;
}

export const useSiteSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key');

      if (error) throw error;
      return data as SiteSetting[];
    },
  });

  const updateSetting = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: string }) => {
      const { error } = await supabase
        .from('site_settings')
        .update({ value })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({
        title: 'განახლებულია',
        description: 'პარამეტრი წარმატებით განახლდა',
      });
    },
    onError: (error) => {
      toast({
        title: 'შეცდომა',
        description: 'პარამეტრის განახლება ვერ მოხერხდა',
        variant: 'destructive',
      });
      console.error('Error updating setting:', error);
    },
  });

  const getSetting = (key: string): string => {
    const setting = settings?.find((s) => s.key === key);
    return setting?.value || '';
  };

  return {
    settings,
    isLoading,
    updateSetting,
    getSetting,
  };
};
