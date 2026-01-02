import { Layout } from '@/components/Layout';
import { 
  UtensilsCrossed, Wifi, Shield, Clock, Car, Waves, Dumbbell, 
  Sparkles, Wind, Coffee, Wine, ConciergeBell
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import apartmentsHero from '@/assets/apartments-hero.png';

const Amenities = () => {
  const { t, language } = useLanguage();

  const amenities = [
    {
      icon: Waves,
      titleKey: 'amenities.pool.title',
      title: 'Swimming Pool & Spa',
      descKey: 'amenities.pool.desc',
      desc: 'Relax in our stunning infinity pool with panoramic sea views',
      image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/8dbfb8081b4518e8adafc46f428e41a3.jpg'
    },
    {
      icon: Dumbbell,
      titleKey: 'amenities.fitness.title',
      title: 'Fitness Center',
      descKey: 'amenities.fitness.desc',
      desc: 'State-of-the-art gym equipment for your workout routine',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'
    },
    {
      icon: Sparkles,
      titleKey: 'amenities.spa.title',
      title: 'Wellness & Spa',
      descKey: 'amenities.spa.desc',
      desc: 'Rejuvenate with our professional spa treatments',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800'
    },
    {
      icon: UtensilsCrossed,
      titleKey: 'amenities.restaurant.title',
      title: 'Restaurant',
      descKey: 'amenities.restaurant.desc',
      desc: 'Fine dining with local and international cuisine',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
    },
    {
      icon: Coffee,
      titleKey: 'amenities.cafe.title',
      title: 'Café & Lounge',
      descKey: 'amenities.cafe.desc',
      desc: 'Cozy atmosphere for coffee and light snacks',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800'
    },
    {
      icon: Wine,
      titleKey: 'amenities.bar.title',
      title: 'Bar & Lounge',
      descKey: 'amenities.bar.desc',
      desc: 'Premium cocktails and drinks with stunning views',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800'
    },
    {
      icon: Wifi,
      titleKey: 'amenities.wifi.title',
      title: 'High-Speed WiFi',
      descKey: 'amenities.wifi.desc',
      desc: 'Free high-speed internet throughout the property',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'
    },
    {
      icon: Shield,
      titleKey: 'amenities.security.title',
      title: '24/7 Security',
      descKey: 'amenities.security.desc',
      desc: 'Round-the-clock security for your peace of mind',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
    },
    {
      icon: Clock,
      titleKey: 'amenities.reception.title',
      title: '24/7 Reception',
      descKey: 'amenities.reception.desc',
      desc: 'Our front desk team is always ready to assist you',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
    },
    {
      icon: Car,
      titleKey: 'amenities.parking.title',
      title: 'Parking',
      descKey: 'amenities.parking.desc',
      desc: 'Secure underground parking available for guests',
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800'
    },
    {
      icon: Wind,
      titleKey: 'amenities.ac.title',
      title: 'Air Conditioning',
      descKey: 'amenities.ac.desc',
      desc: 'Climate control in all rooms and common areas',
      image: 'https://images.unsplash.com/photo-1631545806609-12c2eae66b10?w=800'
    },
    {
      icon: ConciergeBell,
      titleKey: 'amenities.concierge.title',
      title: 'Concierge Service',
      descKey: 'amenities.concierge.desc',
      desc: 'Personalized assistance for all your needs',
      image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800'
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[350px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${apartmentsHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e3a5f]/70 via-[#1e3a5f]/50 to-[#1e3a5f]/70" />
        
        <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-amber-400 tracking-[0.3em] uppercase text-sm font-medium mb-4"
          >
            {language === 'ka' ? 'პრემიუმ სერვისები' : 'Premium Services'}
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            {language === 'ka' ? 'ჩვენი კეთილმოწყობა' : 'Our Amenities'}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl"
          >
            {language === 'ka' ? 'აღმოაჩინეთ მსოფლიო დონის კეთილმოწყობა და სერვისები' : 'Discover world-class facilities and services'}
          </motion.p>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60V0C240 40 480 60 720 60C960 60 1200 40 1440 0V60H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Amenities Grid - Manus.space Style */}
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
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group"
                >
                  {/* Card with Image */}
                  <div className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-border/50">
                    {/* Image Container */}
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={amenity.image} 
                        alt={language === 'ka' ? t(amenity.titleKey) : amenity.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      
                      {/* Icon Badge - Bottom Left */}
                      <div className="absolute bottom-4 left-4">
                        <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-[#1e3a5f] transition-colors">
                        {language === 'ka' ? t(amenity.titleKey) : amenity.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {language === 'ka' ? t(amenity.descKey) : amenity.desc}
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