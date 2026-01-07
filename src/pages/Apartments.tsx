import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Users, Bed, Bath, Maximize2, CreditCard } from 'lucide-react';
import { trackViewItem, trackPageView } from '@/lib/tracking';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBooking } from '@/contexts/BookingContext';
import { motion, AnimatePresence } from 'framer-motion';
import apartmentsHero from '@/assets/apartments-hero-optimized.webp';
import { LazyImage } from '@/components/ui/lazy-image';

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
  const { openBookingModal } = useBooking();
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
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[450px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${apartmentsHero})` }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e3a5f]/70 via-[#1e3a5f]/50 to-[#1e3a5f]/70" />
        
        <div className="relative z-10 container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 tracking-[0.3em] uppercase text-sm font-medium mb-4 drop-shadow-[0_2px_4px_rgba(212,175,55,0.5)]"
          >
            {t('apartments.page.badge')}
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 drop-shadow-[0_4px_8px_rgba(212,175,55,0.4)] [text-shadow:_0_1px_0_rgb(255_255_255_/_40%),_0_4px_12px_rgba(212,175,55,0.5)]"
          >
            {t('apartments.page.title')}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl mb-12"
          >
            {t('apartments.page.subtitle')}
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
                {t(`apartments.category.${cat.id}`)}
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
                  className="group bg-card rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-500 hover:scale-[1.02] border-2 border-transparent hover:border-gold-400/60 hover:shadow-[0_0_30px_rgba(212,175,55,0.4),_0_0_60px_rgba(212,175,55,0.2),_inset_0_0_20px_rgba(212,175,55,0.1)] relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-gold-400/0 before:via-gold-400/10 before:to-gold-400/0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none before:z-10"
                >
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <LazyImage 
                      src={apt.image} 
                      alt={t(apt.titleKey)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {t(apt.titleKey)}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {t(apt.descKey)}
                    </p>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{apt.guests} {t('apartments.guests')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Bed className="w-4 h-4 text-primary" />
                        <span>{apt.beds} {t('apartments.bedroom')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Bath className="w-4 h-4 text-primary" />
                        <span>{apt.baths} {t('apartments.bathroom')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Maximize2 className="w-4 h-4 text-primary" />
                        <span>{apt.size} {t('apartments.sqm')}</span>
                      </div>
                    </div>

                    {/* Book Now Button */}
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openBookingModal(apt.id);
                      }}
                      className="w-full group/btn bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      <span>{t('apartments.bookNow')}</span>
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
                {t('apartments.noApartments')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a87]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 drop-shadow-[0_4px_8px_rgba(212,175,55,0.4)] [text-shadow:_0_1px_0_rgb(255_255_255_/_40%),_0_4px_12px_rgba(212,175,55,0.5)]">
            {t('apartments.cta.title')}
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            {t('apartments.cta.subtitle')}
          </p>
          <Button 
            size="lg"
            onClick={() => openBookingModal()}
            className="bg-white hover:bg-white/90 text-[#1e3a5f] font-bold px-8 py-6 text-lg transition-all duration-300"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            {t('apartments.cta.button')}
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Apartments;