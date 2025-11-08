import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSEO = (pagePath: string) => {
  const { data: pageSEO, isLoading: pageLoading } = useQuery({
    queryKey: ['seo-page', pagePath],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_pages')
        .select('*')
        .eq('page_path', pagePath)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: globalSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['seo-global-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', [
          'site_name',
          'site_tagline',
          'default_og_image',
          'twitter_handle',
          'company_legal_name',
          'company_founding_year',
          'contact_email',
          'contact_phone',
          'contact_address',
        ]);
      
      if (error) throw error;
      
      return data.reduce((acc, setting) => {
        acc[setting.key] = setting.value || '';
        return acc;
      }, {} as Record<string, string>);
    },
  });

  return {
    pageSEO,
    globalSettings,
    isLoading: pageLoading || settingsLoading,
  };
};
