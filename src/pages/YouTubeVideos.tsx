import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useYouTubeVideos } from '@/hooks/useYouTubeVideos';
import { useLanguage } from '@/contexts/LanguageContext';
import { Play } from 'lucide-react';
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="group">
                    <Skeleton className="w-full aspect-[4/3] rounded-3xl mb-5" />
                    <Skeleton className="h-7 w-3/4 mb-3" />
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
                    className="group cursor-pointer"
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-5 bg-muted shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl">
                          <Play className="w-10 h-10 text-primary-foreground fill-primary-foreground ml-1" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
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
