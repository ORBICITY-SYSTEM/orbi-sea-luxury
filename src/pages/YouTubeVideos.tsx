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
      title: 'Orbi City Batumi - Full Tour',
      description: 'Explore the entire Orbi City complex, including apartments, amenities, and stunning sea views.'
    },
    {
      videoSrc: '/videos/bedroom-luxury.mp4',
      title: 'Luxury Apartment Interior',
      description: 'Step inside our beautifully designed apartments with modern furnishings and panoramic views.'
    },
    {
      videoSrc: '/videos/hotel-room.mp4',
      title: 'Modern Hotel Room',
      description: 'Experience our elegantly designed rooms with contemporary furnishings and stunning sea views.'
    },
    {
      videoSrc: '/videos/pool-amenities.mp4',
      title: 'Amenities & Facilities',
      description: 'Tour our world-class amenities including pools, gym, restaurant, and entertainment areas.'
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
            Immersive Experience
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-foreground mb-6"
          >
            Virtual Tours
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed"
          >
            Take a virtual tour of Orbi City Batumi and explore our stunning apartments and facilities from the comfort of your home.
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
                title={tour.title}
                description={tour.description}
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
