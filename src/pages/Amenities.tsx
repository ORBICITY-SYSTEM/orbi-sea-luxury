import { Layout } from '@/components/Layout';
import { Wifi, Shield, Clock, Car, Wind, ConciergeBell } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const Amenities = () => {
  const { language } = useLanguage();

  const amenities = [
    {
      icon: Wifi,
      title: 'High-Speed WiFi',
      titleKa: 'მაღალსიჩქარიანი WiFi',
      desc: 'Free high-speed internet throughout the property',
      descKa: 'უფასო მაღალსიჩქარიანი ინტერნეტი მთელ ტერიტორიაზე'
    },
    {
      icon: Shield,
      title: '24/7 Security',
      titleKa: '24/7 დაცვა',
      desc: 'Round-the-clock security for your peace of mind',
      descKa: 'მთელი დღე-ღამის დაცვა თქვენი სიმშვიდისთვის'
    },
    {
      icon: Clock,
      title: '24/7 Reception',
      titleKa: '24/7 რეცეფცია',
      desc: 'Our front desk team is always ready to assist you',
      descKa: 'ჩვენი გუნდი ყოველთვის მზადაა დაგეხმაროთ'
    },
    {
      icon: Car,
      title: 'Parking',
      titleKa: 'პარკინგი',
      desc: 'Secure underground parking available for guests',
      descKa: 'დაცული მიწისქვეშა პარკინგი სტუმრებისთვის'
    },
    {
      icon: Wind,
      title: 'Air Conditioning',
      titleKa: 'კონდიცირება',
      desc: 'Climate control in all rooms and common areas',
      descKa: 'კლიმატ-კონტროლი ყველა ოთახსა და საერთო სივრცეში'
    },
    {
      icon: ConciergeBell,
      title: 'Concierge Service',
      titleKa: 'კონსიერჟ სერვისი',
      desc: 'Personalized assistance for all your needs',
      descKa: 'პერსონალიზებული დახმარება ყველა თქვენი საჭიროებისთვის'
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
                        {language === 'ka' ? amenity.titleKa : amenity.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {language === 'ka' ? amenity.descKa : amenity.desc}
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