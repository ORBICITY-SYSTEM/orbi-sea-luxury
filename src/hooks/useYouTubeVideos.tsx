import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
}

export const useYouTubeVideos = (channelId: string) => {
  return useQuery({
    queryKey: ['youtube-videos', channelId],
    queryFn: async () => {
      console.log('Fetching YouTube videos for channel:', channelId);
      
      const { data, error } = await supabase.functions.invoke('fetch-youtube-videos', {
        body: { channelId },
      });

      if (error) {
        console.error('Error fetching YouTube videos:', error);
        throw error;
      }

      console.log('YouTube videos fetched successfully:', data.videos.length);
      return data.videos as YouTubeVideo[];
    },
    enabled: !!channelId,
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
  });
};
