import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Users, Bed, Bath, Maximize2, Video } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { trackPageView, trackViewItem } from '@/lib/tracking';

const apartmentData = {
  suite: {
    titleKey: 'apartments.suite.title',
    descKey: 'apartments.suite.desc',
    guests: 3,
    beds: 1,
    sofaBeds: 1,
    baths: 1,
    size: '30',
    bidet: false,
    featuresKeys: [
      'apartments.suite.feature1',
      'apartments.suite.feature2',
      'apartments.suite.feature3',
      'apartments.suite.feature4',
      'apartments.suite.feature5',
      'apartments.suite.feature6',
    ],
    images: [
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/e4578176040cf98304ee3ae0477a108f.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/47fe838e886d9afa24f54f2c292a93c3.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/78f6531862f26bbcdf6bca5ec8d7305c.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/0922f2b1b13af96b0d24272d32439996.jpg',
      'https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/1.jpg',
      'https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/a0d87736a9a433465e412befdeca2b5d.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/e4578176040cf98304ee3ae0477a108f.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/47fe838e886d9afa24f54f2c292a93c3.jpg',
    ]
  },
  deluxe: {
    titleKey: 'apartments.deluxe.title',
    descKey: 'apartments.deluxe.desc',
    guests: 3,
    beds: 1,
    sofaBeds: 1,
    baths: 1,
    size: '33',
    bidet: false,
    featuresKeys: [
      'apartments.deluxe.feature1',
      'apartments.deluxe.feature2',
      'apartments.deluxe.feature3',
      'apartments.deluxe.feature4',
      'apartments.deluxe.feature5',
      'apartments.deluxe.feature6',
    ],
    images: [
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/47fe838e886d9afa24f54f2c292a93c3.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/78f6531862f26bbcdf6bca5ec8d7305c.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/e4578176040cf98304ee3ae0477a108f.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/0922f2b1b13af96b0d24272d32439996.jpg',
      'https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/1.jpg',
      'https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/a0d87736a9a433465e412befdeca2b5d.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/47fe838e886d9afa24f54f2c292a93c3.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/78f6531862f26bbcdf6bca5ec8d7305c.jpg',
    ]
  },
  superior: {
    titleKey: 'apartments.superior.title',
    descKey: 'apartments.superior.desc',
    guests: 3,
    beds: 1,
    sofaBeds: 1,
    baths: 1,
    size: '33',
    bidet: false,
    featuresKeys: [
      'apartments.superior.feature1',
      'apartments.superior.feature2',
      'apartments.superior.feature3',
      'apartments.superior.feature4',
      'apartments.superior.feature5',
      'apartments.superior.feature6',
      'apartments.superior.feature7',
    ],
    images: [
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/78f6531862f26bbcdf6bca5ec8d7305c.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/47fe838e886d9afa24f54f2c292a93c3.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/e4578176040cf98304ee3ae0477a108f.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/0922f2b1b13af96b0d24272d32439996.jpg',
      'https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/1.jpg',
      'https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/a0d87736a9a433465e412befdeca2b5d.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/78f6531862f26bbcdf6bca5ec8d7305c.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/47fe838e886d9afa24f54f2c292a93c3.jpg',
    ]
  },
  family: {
    titleKey: 'apartments.family.title',
    descKey: 'apartments.family.desc',
    guests: 6,
    beds: 2,
    sofaBeds: 2,
    baths: 2,
    bidet: true,
    size: '67',
    featuresKeys: [
      'apartments.family.feature1',
      'apartments.family.feature2',
      'apartments.family.feature3',
      'apartments.family.feature4',
      'apartments.family.feature5',
      'apartments.family.feature6',
      'apartments.family.feature7',
    ],
    images: [
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/0922f2b1b13af96b0d24272d32439996.jpg',
      'https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/1.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/e4578176040cf98304ee3ae0477a108f.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/47fe838e886d9afa24f54f2c292a93c3.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/78f6531862f26bbcdf6bca5ec8d7305c.jpg',
      'https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/a0d87736a9a433465e412befdeca2b5d.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/0922f2b1b13af96b0d24272d32439996.jpg',
      'https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/1.jpg',
    ]
  },
  twobed: {
    titleKey: 'apartments.twobed.title',
    descKey: 'apartments.twobed.desc',
    guests: 6,
    beds: 3,
    sofaBeds: 0,
    baths: 3,
    size: '120',
    bidet: false,
    featuresKeys: [
      'apartments.twobed.feature1',
      'apartments.twobed.feature2',
      'apartments.twobed.feature3',
      'apartments.twobed.feature4',
      'apartments.twobed.feature5',
      'apartments.twobed.feature6',
      'apartments.twobed.feature7',
    ],
    images: [
      'https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/1.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/0922f2b1b13af96b0d24272d32439996.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/e4578176040cf98304ee3ae0477a108f.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/47fe838e886d9afa24f54f2c292a93c3.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/78f6531862f26bbcdf6bca5ec8d7305c.jpg',
      'https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/a0d87736a9a433465e412befdeca2b5d.jpg',
      'https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/1.jpg',
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/0922f2b1b13af96b0d24272d32439996.jpg',
    ]
  }
};

const ApartmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const apartment = id ? apartmentData[id as keyof typeof apartmentData] : null;

  useEffect(() => {
    trackPageView();
    if (apartment) {
      trackViewItem({
        item_id: id || '',
        item_name: t(apartment.titleKey),
        item_category: 'apartment-detail',
      });
    }
  }, [id, apartment, t]);

  if (!apartment) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">{t('apartmentDetail.notFound')}</h1>
          <Button onClick={() => navigate('/apartments')}>{t('apartmentDetail.backToList')}</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Breadcrumbs items={[
        { label: t('nav.apartments') },
        { label: t(apartment.titleKey) }
      ]} />

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t(apartment.titleKey)}</h1>
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-5 h-5" />
                  <span>{apartment.size} {t('apartments.sqm')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{apartment.guests} {t('apartments.guests')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5" />
                  <span>{apartment.beds} {t('apartments.bed')}</span>
                </div>
                {apartment.sofaBeds && (
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5" />
                    <span>{apartment.sofaBeds} {t('apartments.sofaBed')}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5" />
                  <span>{apartment.baths} {t('apartments.bath')}</span>
                </div>
                {apartment.bidet && (
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5" />
                    <span>{t('apartments.bidet')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Image Carousel */}
            <Card className="mb-8 overflow-hidden">
              <Carousel className="w-full">
                <CarouselContent>
                  {apartment.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-video md:aspect-[21/9]">
                        <img
                          src={image}
                          alt={`${t(apartment.titleKey)} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </Card>

            {/* Description and Features */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-foreground mb-4">{t('apartmentDetail.description')}</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-6">{t(apartment.descKey)}</p>
                    
                    <h3 className="text-xl font-semibold text-foreground mb-4">{t('apartments.keyFeatures')}</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {apartment.featuresKeys.map((featureKey, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary mt-1">✓</span>
                          <span>{t(featureKey)}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">{t('apartmentDetail.booking')}</h3>
                    <div className="space-y-3">
                      <Button 
                        className="w-full bg-gradient-gold hover:bg-secondary-dark text-secondary-foreground font-semibold"
                        onClick={() => window.open('https://orbicitybatumi.com/booking', '_blank')}
                      >
                        {t('apartments.bookNow')}
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full"
                      >
                        <a href="https://wa.me/995555199090" target="_blank" rel="noopener noreferrer">
                          {t('apartments.checkAvailability')}
                        </a>
                      </Button>
                      <Link to="/youtube-videos">
                        <Button 
                          variant="secondary"
                          className="w-full"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          {t('apartmentDetail.watchVideos')}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ApartmentDetail;
