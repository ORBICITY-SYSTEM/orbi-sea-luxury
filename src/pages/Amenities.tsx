import { Layout } from '@/components/Layout';
import { Wifi, Shield, Clock, Car, Wind, ConciergeBell } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const Amenities = () => {
  const { t } = useLanguage();

  const amenities = [
    {
      icon: Wifi,
      titleKey: 'amenities.page.wifi.title',
      descKey: 'amenities.page.wifi.desc'
    },
    {
      icon: Shield,
      titleKey: 'amenities.page.security.title',
      descKey: 'amenities.page.security.desc'
    },
    {
      icon: Clock,
      titleKey: 'amenities.page.reception.title',
      descKey: 'amenities.page.reception.desc'
    },
    {
      icon: Car,
      titleKey: 'amenities.page.parking.title',
      descKey: 'amenities.page.parking.desc'
    },
    {
      icon: Wind,
      titleKey: 'amenities.page.ac.title',
      descKey: 'amenities.page.ac.desc'
    },
    {
      icon: ConciergeBell,
      titleKey: 'amenities.page.concierge.title',
      descKey: 'amenities.page.concierge.desc'
    },
  ];

  return (
    <Layout>
      {/* Hero Section with Video */}
      <section className="relative min-h-96 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/amenities-hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/70" />
        
        <div className="relative z-10 container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 tracking-[0.3em] uppercase text-sm font-medium mb-4 drop-shadow-[0_2px_4px_rgba(212,175,55,0.5)]"
          >
            {t('amenities.page.badge')}
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 drop-shadow-[0_4px_8px_rgba(212,175,55,0.4)] [text-shadow:_0_1px_0_rgb(255_255_255_/_40%),_0_4px_12px_rgba(212,175,55,0.5)]"
          >
            {t('amenities.page.title')}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl"
          >
            {t('amenities.page.subtitle')}
          </motion.p>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60V0C240 40 480 60 720 60C960 60 1200 40 1440 0V60H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Amenities Grid with Gradient Border & Glow */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {amenities.map((amenity, index) => {
              const Icon = amenity.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group"
                >
                  {/* Gradient Border Wrapper */}
                  <div className="relative p-0.5 rounded-3xl bg-gradient-to-br from-secondary/60 via-secondary/30 to-secondary-dark/60 hover:from-secondary hover:via-secondary hover:to-secondary-dark transition-all duration-500">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-secondary/0 via-secondary/0 to-secondary-dark/0 group-hover:from-secondary/20 group-hover:via-secondary/30 group-hover:to-secondary-dark/20 blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
                    
                    {/* Card Content */}
                    <div className="relative bg-card rounded-3xl overflow-hidden p-8 text-center group-hover:shadow-2xl transition-all duration-500">
                      {/* Icon Circle */}
                      <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 group-hover:shadow-gold transition-all duration-500">
                        <Icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-amber-500 transition-colors duration-300">
                        {t(amenity.titleKey)}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {t(amenity.descKey)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Amenities;