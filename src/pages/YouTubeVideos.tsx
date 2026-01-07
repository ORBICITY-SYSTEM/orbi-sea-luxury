import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useLanguage } from '@/contexts/LanguageContext';
import { VideoTourCard } from '@/components/VideoTourCard';
import { useEffect } from 'react';
import { trackPageView } from '@/lib/tracking';
import { motion } from 'framer-motion';

const YouTubeVideos = () => {
  const { t } = useLanguage();

  useEffect(() => {
    trackPageView();
  }, []);

  const virtualTours = [
    {
      videoSrc: '/videos/orbi-city-tour.mp4',
      titleKey: 'videos.tour.fullTour.title',
      descKey: 'videos.tour.fullTour.desc'
    },
    {
      videoSrc: '/videos/bedroom-luxury.mp4',
      titleKey: 'videos.tour.interior.title',
      descKey: 'videos.tour.interior.desc'
    },
    {
      videoSrc: '/videos/hotel-room.mp4',
      titleKey: 'videos.tour.room.title',
      descKey: 'videos.tour.room.desc'
    },
    {
      videoSrc: '/videos/pool-amenities.mp4',
      titleKey: 'videos.tour.amenities.title',
      descKey: 'videos.tour.amenities.desc'
    }
  ];

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
            {t('videos.badge')}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-foreground mb-6"
          >
            {t('videos.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed"
          >
            {t('videos.subtitle')}
          </motion.p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: t('youtubeVideos.breadcrumb') }]} />

      {/* Videos Grid Section */}
      <section className="py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {virtualTours.map((tour, index) => (
              <VideoTourCard
                key={index}
                videoSrc={tour.videoSrc}
                title={t(tour.titleKey)}
                description={t(tour.descKey)}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default YouTubeVideos;
