import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useYouTubeVideos } from '@/hooks/useYouTubeVideos';
import { useLanguage } from '@/contexts/LanguageContext';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import { useEffect } from 'react';
import { trackPageView } from '@/lib/tracking';
import { motion } from 'framer-motion';

const YouTubeVideos = () => {
  const { t } = useLanguage();
  const channelId = 'UC3YPMVgwMBJWPvY1IjD8UFQ';
  const { data: videos, isLoading, error } = useYouTubeVideos(channelId);

  useEffect(() => {
    trackPageView();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-primary uppercase tracking-[0.25em] text-sm font-medium mb-4"
          >
            {t('youtubeVideos.breadcrumb')}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
          >
            {t('youtubeVideos.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            {t('youtubeVideos.subtitle')}
          </motion.p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: t('youtubeVideos.breadcrumb') }]} />

      {/* Videos Grid Section */}
      <section className="py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            
            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="w-full aspect-video rounded-3xl" />
                    <Skeleton className="h-7 w-3/4" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <Alert variant="destructive" className="max-w-2xl mx-auto">
                <AlertDescription>{t('youtubeVideos.error')}</AlertDescription>
              </Alert>
            )}

            {/* Videos Grid */}
            {videos && videos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {videos.map((video, index) => (
                  <motion.article
                    key={video.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="space-y-4"
                  >
                    {/* Embedded Video Player */}
                    <YouTubeEmbed
                      videoId={video.id}
                      title={video.title}
                      thumbnail={video.thumbnail}
                    />

                    {/* Content */}
                    <h3 className="text-xl md:text-2xl font-semibold text-foreground line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2 text-base">
                      {video.description || t('youtubeVideos.noDescription')}
                    </p>
                  </motion.article>
                ))}
              </div>
            )}

            {/* Empty State */}
            {videos && videos.length === 0 && !isLoading && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">{t('youtubeVideos.noVideos')}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default YouTubeVideos;
