import { Layout } from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Waves, Trees, Building2, Plane, ShoppingBag, Landmark } from 'lucide-react';
import { GoogleMapInteractive } from '@/components/GoogleMapInteractive';

const Location = () => {
  const { t } = useLanguage();

  const contactInfo = [
    {
      icon: MapPin,
      title: t('location.addressLabel'),
      content: t('location.addressStreet'),
      subtitle: t('location.addressCity')
    },
    {
      icon: Phone,
      title: t('contact.phone'),
      content: '+995 555 19 90 90',
      link: 'tel:+995555199090'
    },
    {
      icon: Mail,
      title: t('contact.email'),
      content: 'info@orbicitybatumi.com',
      link: 'mailto:info@orbicitybatumi.com'
    },
    {
      icon: Clock,
      title: t('location.receptionLabel'),
      content: '24/7',
      subtitle: t('location.alwaysAvailable')
    }
  ];

  const nearbyAttractions = [
    {
      icon: Waves,
      title: t('location.batumiBeach'),
      distance: t('location.beachDistance'),
      description: t('location.beachDesc')
    },
    {
      icon: Trees,
      title: t('location.boulevard'),
      distance: t('location.boulevardDistance'),
      description: t('location.boulevardDesc')
    },
    {
      icon: Landmark,
      title: t('location.alphabetTower'),
      distance: t('location.alphabetTowerDistance'),
      description: t('location.alphabetTowerDesc')
    },
    {
      icon: Trees,
      title: t('location.botanicalGarden'),
      distance: t('location.botanicalGardenDistance'),
      description: t('location.botanicalGardenDesc')
    },
    {
      icon: Plane,
      title: t('location.airportNearby'),
      distance: t('location.airportNearbyDistance'),
      description: t('location.airportNearbyDesc')
    },
    {
      icon: ShoppingBag,
      title: t('location.cityCenter'),
      distance: t('location.cityCenterDistance'),
      description: t('location.cityCenterDesc')
    }
  ];

  return (
    <Layout>
      {/* Hero Section with Video */}
      <section className="relative h-[60vh] lg:h-[70vh] overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/location-hero.mp4" type="video/mp4" />
        </video>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 tracking-[0.3em] uppercase text-sm font-medium mb-4 block drop-shadow-[0_2px_4px_rgba(212,175,55,0.5)]"
            >
              {t('location.findUs')}
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 drop-shadow-[0_4px_8px_rgba(212,175,55,0.4)] [text-shadow:_0_1px_0_rgb(255_255_255_/_40%),_0_4px_12px_rgba(212,175,55,0.5)]"
            >
              {t('location.ourLocation')}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto"
            >
              {t('location.heroSubtitle')}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Map Section - Full Width Like Manus */}
      <section className="bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl overflow-hidden shadow-xl border border-gray-200"
          >
            <GoogleMapInteractive className="h-[500px] lg:h-[560px]" />
          </motion.div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)]"
          >
            {t('location.getInTouch')}
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              const content = (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-2">{info.title}</h3>
                  <p className="text-lg font-semibold text-gray-900">{info.content}</p>
                  {info.subtitle && (
                    <p className="text-sm text-gray-500 mt-1">{info.subtitle}</p>
                  )}
                </motion.div>
              );

              return info.link ? (
                <a key={index} href={info.link} className="block">
                  {content}
                </a>
              ) : (
                content
              );
            })}
          </div>
        </div>
      </section>

      {/* Nearby Attractions */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)]"
          >
            {t('location.nearbyAttractions')}
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyAttractions.map((attraction, index) => {
              const Icon = attraction.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg hover:border-amber-200 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{attraction.title}</h3>
                      <p className="text-amber-600 text-sm font-medium mb-2">{attraction.distance}</p>
                      <p className="text-gray-500 text-sm leading-relaxed">{attraction.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)]"
          >
            {t('location.visitUsToday')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-lg mb-8 max-w-xl mx-auto"
          >
            {t('location.experiencePerfect')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a 
              href="/apartments" 
              className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              {t('location.viewApartments')}
            </a>
            <a 
              href="/contact" 
              className="px-8 py-4 bg-background text-primary border-2 border-primary rounded-full font-medium hover:bg-muted transition-colors"
            >
              {t('location.contactUs')}
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Location;