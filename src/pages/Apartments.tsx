import { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Bed, Bath, Maximize2 } from 'lucide-react';
import { trackViewItem, trackPageView } from '@/lib/tracking';

const apartments = [
  {
    id: 'suite',
    title: 'Suite with Sea View',
    image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/e4578176040cf98304ee3ae0477a108f.jpg',
    guests: 3,
    beds: 1,
    baths: 1,
    description: 'An elegant suite offering breathtaking views of the sea, perfect for couples or solo travelers seeking a tranquil escape.',
    features: [
      'Sea View Balcony',
      'Fully equipped kitchen',
      'Free WiFi',
      'Air Conditioning',
      'Smart TV',
      'King Size Bed with Ceiling Mirrors',
      'SOFA BED'
    ]
  },
  {
    id: 'deluxe',
    title: 'Delux Suite with Sea View',
    image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/47fe838e886d9afa24f54f2c292a93c3.jpg',
    guests: 3,
    beds: 1,
    baths: 1,
    description: 'A more spacious and luxurious suite with enhanced amenities and a prime sea view, designed for an indulgent stay.',
    features: [
      'Large Sea View Balcony',
      'Separate Living Area',
      'Fully equipped kitchen',
      'Free WiFi',
      'Air Conditioning',
      'Smart TV'
    ]
  },
  {
    id: 'superior',
    title: 'Superior Suite with Sea View',
    image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/78f6531862f26bbcdf6bca5ec8d7305c.jpg',
    guests: 3,
    beds: 2,
    baths: 1,
    description: 'Our premium suite featuring a separate living area, top-tier amenities, and the best panoramic views of the sea.',
    features: [
      'Corner Sea Views',
      'One Bedroom',
      'Dining Area',
      'One Bathroom',
      'Fully equipped kitchen',
      'Premium Toiletries',
      'King Size Bed with Ceiling Mirrors',
      'SOFA BED'
    ]
  },
  {
    id: 'family',
    title: 'Superior Family Suite with Sea View',
    image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/0922f2b1b13af96b0d24272d32439996.jpg',
    guests: 6,
    beds: 2,
    baths: 2,
    description: 'A generously sized suite with multiple rooms, perfect for families or groups, ensuring comfort and privacy for everyone.',
    features: [
      'Expansive Balcony',
      'Two Bedrooms',
      'Fully equipped kitchen',
      'Kids\' Entertainment',
      'Washing Machine',
      'Priority Services',
      'King Size Bed with Ceiling Mirrors',
      'SOFA BED'
    ]
  },
  {
    id: 'twobed',
    title: 'Two Bedroom Panoramic Suite',
    image: 'https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/1.jpg',
    guests: 6,
    beds: 3,
    baths: 3,
    description: 'The pinnacle of luxury. This expansive suite features two bedrooms and a stunning panoramic terrace for an unforgettable experience.',
    features: [
      '270° Panoramic Terrace',
      '2 Bedrooms',
      '2 SOFA BED',
      '2 King Size Bed with Ceiling Mirrors',
      'Premium Kitchen',
      'Luxury Furnishings',
      'Ultimate Sea Views'
    ]
  }
];

const Apartments = () => {
  useEffect(() => {
    trackPageView();
  }, []);

  const handleApartmentView = (apartment: typeof apartments[0]) => {
    trackViewItem({
      item_id: apartment.id,
      item_name: apartment.title,
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
          <h1 className="text-5xl font-bold text-white mb-4">Our Apartments</h1>
          <p className="text-xl text-white/90 max-w-3xl mb-6">
            Indulge in our beautifully designed apartments, each offering a unique blend of comfort and style. 
            From intimate suites to spacious family rooms, find your perfect sanctuary by the sea.
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
            <h2 className="text-4xl font-bold text-foreground mb-4">Find Your Perfect Space</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each of our apartments is thoughtfully designed to provide an unparalleled experience. 
              Explore our offerings and find the one that speaks to you.
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
                      alt={apt.title}
                      className="w-full h-full object-cover min-h-[300px]"
                    />
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center">
                    <h3 className="text-3xl font-bold text-foreground mb-4">{apt.title}</h3>
                    
                    <div className="flex gap-6 mb-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        <span>{apt.guests} Guests</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bed className="w-5 h-5" />
                        <span>{apt.beds} Bed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath className="w-5 h-5" />
                        <span>{apt.baths} Bath</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6">{apt.description}</p>

                    <div className="mb-6">
                      <h4 className="font-semibold text-foreground mb-3">Key Features</h4>
                      <ul className="grid grid-cols-2 gap-2">
                        {apt.features.map((feature, i) => (
                          <li key={i} className="text-sm text-muted-foreground">• {feature}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        onClick={() => window.open('https://orbicitybatumi.com/booking', '_blank')}
                        className="bg-gradient-gold hover:bg-secondary-dark text-secondary-foreground font-semibold"
                      >
                        Book Now / Pay Later
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => window.open('https://wa.me/+995555199090', '_blank')}
                      >
                        Check Availability
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
