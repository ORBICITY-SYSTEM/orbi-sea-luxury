import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { 
  UtensilsCrossed, Wifi, Shield, Clock, Car, Waves, Dumbbell, 
  Sparkles, Wind, Coffee, Wine, ConciergeBell, Flower2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Amenities = () => {
  const { t } = useLanguage();

  const amenities = [
    {
      icon: Waves,
      titleKey: 'amenities.pool.title',
      descKey: 'amenities.pool.desc',
      image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/8dbfb8081b4518e8adafc46f428e41a3.jpg'
    },
    {
      icon: Dumbbell,
      titleKey: 'amenities.fitness.title',
      descKey: 'amenities.fitness.desc',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'
    },
    {
      icon: Sparkles,
      titleKey: 'amenities.spa.title',
      descKey: 'amenities.spa.desc',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800'
    },
    {
      icon: UtensilsCrossed,
      titleKey: 'amenities.restaurant.title',
      descKey: 'amenities.restaurant.desc',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
    },
    {
      icon: Coffee,
      titleKey: 'amenities.cafe.title',
      descKey: 'amenities.cafe.desc',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800'
    },
    {
      icon: Wine,
      titleKey: 'amenities.bar.title',
      descKey: 'amenities.bar.desc',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800'
    },
    {
      icon: Wifi,
      titleKey: 'amenities.wifi.title',
      descKey: 'amenities.wifi.desc',
    },
    {
      icon: Shield,
      titleKey: 'amenities.security.title',
      descKey: 'amenities.security.desc',
    },
    {
      icon: Clock,
      titleKey: 'amenities.reception.title',
      descKey: 'amenities.reception.desc',
    },
    {
      icon: Car,
      titleKey: 'amenities.parking.title',
      descKey: 'amenities.parking.desc',
    },
    {
      icon: Wind,
      titleKey: 'amenities.ac.title',
      descKey: 'amenities.ac.desc',
    },
    {
      icon: ConciergeBell,
      titleKey: 'amenities.concierge.title',
      descKey: 'amenities.concierge.desc',
    },
  ];

  const premiumAmenities = amenities.filter(a => a.image);
  const standardAmenities = amenities.filter(a => !a.image);

  return (
    <Layout>
      {/* Hero */}
      <div 
        className="relative h-[400px] bg-cover bg-center"
        style={{ backgroundImage: 'url(https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/0fb5cc89a4aac27b06f6b9f29a6dd439.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <Flower2 className="w-16 h-16 text-secondary mb-4" />
          <h1 className="text-5xl font-bold text-white mb-4">{t('amenities.hero.title')}</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            {t('amenities.hero.subtitle')}
          </p>
        </div>
      </div>

      <Breadcrumbs items={[{ label: t('nav.amenities') }]} />

      {/* Premium Amenities with Images */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">{t('amenities.premium.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('amenities.premium.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {premiumAmenities.map((amenity, index) => {
              const Icon = amenity.icon;
              return (
                <Card key={index} className="overflow-hidden group hover:shadow-luxury transition-all">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={amenity.image} 
                      alt={t(amenity.titleKey)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center mb-2">
                        <Icon className="w-6 h-6 text-secondary-foreground" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-3">{t(amenity.titleKey)}</h3>
                    <p className="text-muted-foreground">{t(amenity.descKey)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Standard Amenities */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">{t('amenities.standard.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('amenities.standard.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {standardAmenities.map((amenity, index) => {
              const Icon = amenity.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{t(amenity.titleKey)}</h3>
                      <p className="text-sm text-muted-foreground">{t(amenity.descKey)}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Amenities;
