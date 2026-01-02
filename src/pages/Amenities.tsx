import { Layout } from '@/components/Layout';
import { Wifi, Shield, Clock, Car, Wind, ConciergeBell } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import apartmentsHero from '@/assets/apartments-hero.png';

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

      {/* Amenities Grid - Modern Icon Cards */}
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
                  {/* Modern Card with Icon */}
                  <div className="bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-border/30 p-8 text-center hover:-translate-y-2">
                    {/* Icon Circle */}
                    <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 transition-transform duration-500">
                      <Icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-[#1e3a5f] transition-colors">
                      {language === 'ka' ? amenity.titleKa : amenity.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {language === 'ka' ? amenity.descKa : amenity.desc}
                    </p>
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