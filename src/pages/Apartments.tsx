import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Users, Bed, Bath, Maximize2, ChevronRight } from 'lucide-react';
import { trackViewItem, trackPageView } from '@/lib/tracking';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const apartments = [
  {
    id: 'suite',
    titleKey: 'apartments.suite.title',
    title: 'Suite with Sea View',
    image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/e4578176040cf98304ee3ae0477a108f.jpg',
    guests: 3,
    beds: 1,
    baths: 1,
    size: '30',
    price: 30,
    category: 'suites',
    descKey: 'apartments.suite.desc',
    desc: 'An elegant suite offering breathtaking views of the sea, perfect for couples or solo travelers seeking a tranquil escape.'
  },
  {
    id: 'deluxe',
    titleKey: 'apartments.deluxe.title',
    title: 'Delux Suite with Sea View',
    image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/47fe838e886d9afa24f54f2c292a93c3.jpg',
    guests: 3,
    beds: 1,
    baths: 1,
    size: '33',
    price: 35,
    category: 'deluxe',
    descKey: 'apartments.deluxe.desc',
    desc: 'A more spacious and luxurious suite with enhanced amenities and a prime sea view, designed for an indulgent stay.'
  },
  {
    id: 'superior',
    titleKey: 'apartments.superior.title',
    title: 'Superior Suite with Sea View',
    image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/78f6531862f26bbcdf6bca5ec8d7305c.jpg',
    guests: 3,
    beds: 2,
    baths: 1,
    size: '33',
    price: 40,
    category: 'suites',
    descKey: 'apartments.superior.desc',
    desc: 'Our premium suite featuring a separate living area, top-tier amenities, and the best panoramic views of the sea.'
  },
  {
    id: 'family',
    titleKey: 'apartments.family.title',
    title: 'Superior Family Suite with Sea View',
    image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/0922f2b1b13af96b0d24272d32439996.jpg',
    guests: 6,
    beds: 2,
    baths: 2,
    size: '68',
    price: 70,
    category: 'family',
    descKey: 'apartments.family.desc',
    desc: 'A generously sized suite with multiple rooms, perfect for families or groups, ensuring comfort and privacy for everyone.'
  },
  {
    id: 'twobed',
    titleKey: 'apartments.twobed.title',
    title: 'Panoramic Two-Bedroom Suite',
    image: 'https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/1.jpg',
    guests: 6,
    beds: 3,
    baths: 3,
    size: '120',
    price: 100,
    category: 'panoramic',
    descKey: 'apartments.twobed.desc',
    desc: 'An expansive two-bedroom suite with wrap-around panoramic windows, offering unparalleled views and ultimate luxury.'
  }
];

const categories = [
  { id: 'all', label: 'All Apartments', labelKa: 'ყველა აპარტამენტი' },
  { id: 'suites', label: 'Suites', labelKa: 'სუიტები' },
  { id: 'deluxe', label: 'Deluxe', labelKa: 'დელუქსი' },
  { id: 'family', label: 'Family', labelKa: 'საოჯახო' },
  { id: 'panoramic', label: 'Panoramic', labelKa: 'პანორამული' }
];

const Apartments = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  
  useEffect(() => {
    trackPageView();
  }, []);

  const filteredApartments = activeCategory === 'all' 
    ? apartments 
    : apartments.filter(apt => apt.category === activeCategory);

  const handleApartmentView = (apartment: typeof apartments[0]) => {
    trackViewItem({
      item_id: apartment.id,
      item_name: t(apartment.titleKey),
      item_category: 'apartment',
    });
  };

  return (
    <Layout>
      {/* Hero Section - Blue Gradient */}
      <section className="relative min-h-[400px] bg-gradient-to-br from-[#1e3a5f] via-[#2d5a87] to-[#1e3a5f] overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-amber-400 tracking-[0.3em] uppercase text-sm font-medium mb-4"
          >
            {language === 'ka' ? 'ფუფუნებით ცხოვრება' : 'Luxury Living'}
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            {language === 'ka' ? 'ჩვენი აპარტამენტები' : 'Our Apartments'}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl mb-12"
          >
            {language === 'ka' ? 'აღმოაჩინეთ თქვენი სრულყოფილი თავშესაფარი შავი ზღვის პირას' : 'Discover your perfect sanctuary by the Black Sea'}
          </motion.p>

          {/* Category Filter Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-white text-[#1e3a5f] shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                {language === 'ka' ? cat.labelKa : cat.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Bottom Wave/Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60V0C240 40 480 60 720 60C960 60 1200 40 1440 0V60H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Apartments Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredApartments.map((apt, index) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => handleApartmentView(apt)}
                  className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={apt.image} 
                      alt={language === 'ka' ? t(apt.titleKey) : apt.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-[#1e3a5f]/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                      <span className="text-xl font-bold">${apt.price}</span>
                      <span className="text-sm opacity-80">/night</span>
                    </div>
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {language === 'ka' ? t(apt.titleKey) : apt.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {language === 'ka' ? t(apt.descKey) : apt.desc}
                    </p>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{apt.guests} {language === 'ka' ? 'სტუმარი' : 'Guests'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Bed className="w-4 h-4 text-primary" />
                        <span>{apt.beds} {language === 'ka' ? 'საძინებელი' : 'Bedroom'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Bath className="w-4 h-4 text-primary" />
                        <span>{apt.baths} {language === 'ka' ? 'აბაზანა' : 'Bathroom'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Maximize2 className="w-4 h-4 text-primary" />
                        <span>{apt.size} {language === 'ka' ? 'კვ.მ' : 'm²'}</span>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/apartments/${apt.id}`);
                      }}
                      variant="outline"
                      className="w-full group/btn border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      <span>{language === 'ka' ? 'დეტალების ნახვა' : 'View Details'}</span>
                      <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredApartments.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                {language === 'ka' ? 'ამ კატეგორიაში აპარტამენტი ვერ მოიძებნა' : 'No apartments found in this category'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a87]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {language === 'ka' ? 'მზად ხართ დასაჯავშნად?' : 'Ready to Book?'}
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            {language === 'ka' 
              ? 'დაჯავშნეთ თქვენი სრულყოფილი დასვენება ბათუმში ახლავე' 
              : 'Reserve your perfect getaway in Batumi today'}
          </p>
          <Button 
            size="lg"
            onClick={() => window.open('https://orbicitybatumi.com/booking', '_blank')}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {language === 'ka' ? 'დაჯავშნე ახლა / გადაიხადე მოგვიანებით' : 'Book Now / Pay Later'}
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Apartments;