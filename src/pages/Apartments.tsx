import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Bed, Bath, Maximize2 } from 'lucide-react';
import { trackViewItem, trackPageView } from '@/lib/tracking';
import { useLanguage } from '@/contexts/LanguageContext';

const apartments = [
  {
    id: 'suite',
    titleKey: 'apartments.suite.title',
    image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/e4578176040cf98304ee3ae0477a108f.jpg',
    guests: 3,
    beds: 1,
    sofaBeds: 1,
    baths: 1,
    size: '30',
    descKey: 'apartments.suite.desc',
    featuresKeys: [
      'apartments.suite.feature1',
      'apartments.suite.feature2',
      'apartments.suite.feature3',
      'apartments.suite.feature4',
      'apartments.suite.feature5',
      'apartments.suite.feature6',
    ]
  },
  {
    id: 'deluxe',
    titleKey: 'apartments.deluxe.title',
    image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/47fe838e886d9afa24f54f2c292a93c3.jpg',
    guests: 3,
    beds: 1,
    sofaBeds: 1,
    baths: 1,
    size: '33',
    descKey: 'apartments.deluxe.desc',
    featuresKeys: [
      'apartments.deluxe.feature1',
      'apartments.deluxe.feature2',
      'apartments.deluxe.feature3',
      'apartments.deluxe.feature4',
      'apartments.deluxe.feature5',
      'apartments.deluxe.feature6',
    ]
  },
  {
    id: 'superior',
    titleKey: 'apartments.superior.title',
    image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/78f6531862f26bbcdf6bca5ec8d7305c.jpg',
    guests: 3,
    beds: 1,
    sofaBeds: 1,
    baths: 1,
    size: '33',
    descKey: 'apartments.superior.desc',
    featuresKeys: [
      'apartments.superior.feature1',
      'apartments.superior.feature2',
      'apartments.superior.feature3',
      'apartments.superior.feature4',
      'apartments.superior.feature5',
      'apartments.superior.feature6',
      'apartments.superior.feature7',
    ]
  },
  {
    id: 'family',
    titleKey: 'apartments.family.title',
    image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/0922f2b1b13af96b0d24272d32439996.jpg',
    guests: 6,
    beds: 2,
    sofaBeds: 2,
    baths: 2,
    bidet: true,
    size: '67',
    descKey: 'apartments.family.desc',
    featuresKeys: [
      'apartments.family.feature1',
      'apartments.family.feature2',
      'apartments.family.feature3',
      'apartments.family.feature4',
      'apartments.family.feature5',
      'apartments.family.feature6',
      'apartments.family.feature7',
    ]
  },
  {
    id: 'twobed',
    titleKey: 'apartments.twobed.title',
    image: 'https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/1.jpg',
    guests: 6,
    beds: 3,
    baths: 3,
    size: '120',
    descKey: 'apartments.twobed.desc',
    featuresKeys: [
      'apartments.twobed.feature1',
      'apartments.twobed.feature2',
      'apartments.twobed.feature3',
      'apartments.twobed.feature4',
      'apartments.twobed.feature5',
      'apartments.twobed.feature6',
      'apartments.twobed.feature7',
    ]
  }
];

const Apartments = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  useEffect(() => {
    trackPageView();
  }, []);

  const handleApartmentView = (apartment: typeof apartments[0]) => {
    trackViewItem({
      item_id: apartment.id,
      item_name: t(apartment.titleKey),
      item_category: 'apartment',
    });
  };

  return (
    <Layout>
      {/* Hero */}
      <div 
        className="relative h-[400px] bg-cover bg-center"
        style={{ backgroundImage: 'url(https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/a0d87736a9a433465e412befdeca2b5d.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold text-white mb-4">{t('apartments.hero.title')}</h1>
          <p className="text-xl text-white/90 max-w-3xl mb-6">
            {t('apartments.hero.subtitle')}
          </p>
          <Button 
            size="lg"
            onClick={() => window.open('https://orbicitybatumi.com/booking', '_blank')}
            className="bg-gradient-gold hover:bg-secondary-dark text-secondary-foreground font-bold shadow-gold"
          >
            Book Now / Pay Later
          </Button>
        </div>
      </div>

      <Breadcrumbs items={[{ label: 'Apartments' }]} />

      {/* Apartments Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">{t('apartments.section.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('apartments.section.subtitle')}
            </p>
          </div>

          <div className="space-y-16">
            {apartments.map((apt, index) => (
              <Card 
                key={apt.id} 
                className="overflow-hidden"
                onClick={() => handleApartmentView(apt)}
              >
                <div className={`grid md:grid-cols-2 gap-0 ${index % 2 === 1 ? 'md:grid-flow-col-dense' : ''}`}>
                  <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                    <img 
                      src={apt.image} 
                      alt={t(apt.titleKey)}
                      className="w-full h-full object-cover min-h-[300px]"
                    />
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center">
                    <h3 className="text-3xl font-bold text-foreground mb-4">{t(apt.titleKey)}</h3>
                    
                    <div className="flex flex-wrap gap-4 mb-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Maximize2 className="w-5 h-5" />
                        <span>{apt.size} {t('apartments.sqm')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        <span>{apt.guests} {t('apartments.guests')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bed className="w-5 h-5" />
                        <span>{apt.beds} {t('apartments.bed')}</span>
                      </div>
                      {apt.sofaBeds && (
                        <div className="flex items-center gap-2">
                          <Bed className="w-5 h-5" />
                          <span>{apt.sofaBeds} {t('apartments.sofaBed')}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Bath className="w-5 h-5" />
                        <span>{apt.baths} {t('apartments.bath')}</span>
                      </div>
                      {apt.bidet && (
                        <div className="flex items-center gap-2">
                          <Bath className="w-5 h-5" />
                          <span>{t('apartments.bidet')}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{t(apt.descKey)}</p>

                    <div className="mb-6">
                      <h4 className="font-semibold text-foreground mb-3">{t('apartments.keyFeatures')}</h4>
                      <ul className="grid grid-cols-2 gap-2">
                        {apt.featuresKeys.map((featureKey, i) => (
                          <li key={i} className="text-sm text-muted-foreground">• {t(featureKey)}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        onClick={() => window.open('https://orbicitybatumi.com/booking', '_blank')}
                        className="bg-gradient-gold hover:bg-secondary-dark text-secondary-foreground font-semibold"
                      >
                        {t('apartments.bookNow')}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => navigate(`/apartments/${apt.id}`)}
                      >
                        {t('apartments.checkAvailability')}
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Apartments;
