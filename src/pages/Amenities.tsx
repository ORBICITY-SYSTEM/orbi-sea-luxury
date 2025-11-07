import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { UtensilsCrossed, Wifi, Shield, Clock, Car } from 'lucide-react';

const amenities = [
  {
    icon: UtensilsCrossed,
    title: 'Gourmet Restaurant',
    description: 'Savor exquisite dishes prepared by our world-class chefs.',
  },
  {
    icon: Wifi,
    title: 'High-Speed WiFi',
    description: 'Stay connected with complimentary high-speed internet access throughout the hotel.',
  },
  {
    icon: Shield,
    title: '24/7 Security',
    description: 'Your safety is our priority with round-the-clock security and surveillance.',
  },
  {
    icon: Clock,
    title: '24/7 Room Service',
    description: 'Our dedicated concierge team is at your service for any request.',
  },
  {
    icon: Car,
    title: 'Secure Parking',
    description: 'Hassle-free and secure parking available for all our guests.',
  },
];

const Amenities = () => {
  return (
    <Layout>
      {/* Hero */}
      <div 
        className="relative h-[400px] bg-cover bg-center"
        style={{ backgroundImage: 'url(https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/0fb5cc89a4aac27b06f6b9f29a6dd439.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold text-white mb-4">World-Class Amenities</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Everything you need for a perfect stay.
          </p>
        </div>
      </div>

      <Breadcrumbs items={[{ label: 'Amenities' }]} />

      {/* Amenities Section */}
      <section className="py-20 bg-[#2C3E50]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary mb-4">Designed for Your Comfort</h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              We've curated a selection of premium amenities to ensure your time with us is nothing short of exceptional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {amenities.map((amenity, index) => {
              const Icon = amenity.icon;
              return (
                <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-gold flex items-center justify-center">
                      <Icon className="w-8 h-8 text-secondary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{amenity.title}</h3>
                    <p className="text-white/70">{amenity.description}</p>
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
