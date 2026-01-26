import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Star, Wifi, Car, Waves, Utensils, Building, Clock } from 'lucide-react';

// Local SEO page data for different keywords
const localSEOPages: Record<string, {
  title: string;
  description: string;
  keywords: string;
  h1: string;
  intro: string;
  features: string[];
  nearbyAttractions: { name: string; distance: string }[];
}> = {
  'apartments-near-batumi-boulevard': {
    title: 'Apartments Near Batumi Boulevard | Orbi City - Best Location',
    description: 'Luxury apartments just 50 meters from Batumi Boulevard. Walk to Dancing Fountains, beach, restaurants. Sea view apartments with pool, spa. Book direct & save!',
    keywords: 'apartments near batumi boulevard, batumi boulevard hotel, accommodation batumi promenade, sea view apartments boulevard batumi',
    h1: 'Apartments Near Batumi Boulevard',
    intro: 'Looking for the perfect location in Batumi? Orbi City is located directly on Batumi Boulevard, just 50 meters from the famous promenade. Walk to all attractions, enjoy stunning sea views, and experience the best of Batumi at your doorstep.',
    features: [
      '50 meters from Batumi Boulevard',
      'Direct beach access',
      '2-minute walk to Dancing Fountains',
      'Surrounded by restaurants & cafes',
      'Evening entertainment nearby',
      'Safe, well-lit neighborhood'
    ],
    nearbyAttractions: [
      { name: 'Batumi Boulevard', distance: '50m' },
      { name: 'Beach', distance: '50m' },
      { name: 'Dancing Fountains', distance: '200m' },
      { name: 'Alphabet Tower', distance: '500m' },
      { name: 'Piazza Square', distance: '800m' },
      { name: 'Europe Square', distance: '1km' }
    ]
  },
  'beach-apartments-batumi': {
    title: 'Beach Apartments Batumi | Beachfront Accommodation at Orbi City',
    description: 'Beachfront apartments in Batumi just 50m from Black Sea. Wake up to sea views, walk to beach in 1 minute. Infinity pool, spa, full amenities. Book now!',
    keywords: 'beach apartments batumi, beachfront accommodation batumi, batumi seaside apartments, black sea apartments georgia',
    h1: 'Beach Apartments in Batumi',
    intro: 'Dream of waking up to the sound of waves and walking to the beach in your slippers? Orbi City offers the closest beachfront apartments in Batumi. Just 50 meters from the Black Sea, our luxury apartments combine beach access with 5-star amenities.',
    features: [
      '50 meters from the beach',
      'Panoramic sea views from every apartment',
      'Private balconies facing the sea',
      'Infinity pool with beach views',
      'Beach equipment available',
      'Beachfront restaurants nearby'
    ],
    nearbyAttractions: [
      { name: 'Black Sea Beach', distance: '50m' },
      { name: 'Beach Clubs', distance: '100m' },
      { name: 'Water Sports Center', distance: '200m' },
      { name: 'Batumi Boulevard', distance: '50m' },
      { name: 'Beach Restaurants', distance: '50m' },
      { name: 'Sunset Viewing Point', distance: '100m' }
    ]
  },
  'sea-view-hotel-batumi': {
    title: 'Sea View Hotel Batumi | Orbi City Aparthotel - Every Room Has Views',
    description: 'Best sea view hotel in Batumi. 100% of apartments have Black Sea views. Luxury aparthotel with pool, spa, gym. Better than hotels - apartment comfort!',
    keywords: 'sea view hotel batumi, batumi hotel sea view, black sea view accommodation, panoramic sea view batumi',
    h1: 'Sea View Hotel in Batumi',
    intro: 'Unlike traditional hotels where sea views cost extra, EVERY apartment at Orbi City has stunning Black Sea panoramas. Experience breathtaking sunrises from your private balcony, watch ships pass by, and enjoy the ever-changing colors of the sea.',
    features: [
      '100% of apartments have sea views',
      'Floor-to-ceiling windows',
      'Private balconies with seating',
      'Views from floors 10-35+',
      'Sunrise & sunset views',
      'Night sea views with city lights'
    ],
    nearbyAttractions: [
      { name: 'Black Sea Coastline', distance: 'View' },
      { name: 'Batumi Port', distance: 'View' },
      { name: 'Mountain Backdrop', distance: 'View' },
      { name: 'City Skyline', distance: 'View' },
      { name: 'Alphabet Tower', distance: 'View' },
      { name: 'Dancing Fountains', distance: 'View' }
    ]
  },
  'luxury-apartments-batumi-georgia': {
    title: 'Luxury Apartments Batumi Georgia | 5-Star Orbi City Aparthotel',
    description: 'Experience true luxury in Batumi, Georgia. 5-star apartments with infinity pool, spa, gym. Sea views, modern design, premium amenities. Book direct!',
    keywords: 'luxury apartments batumi georgia, 5 star apartments batumi, premium accommodation georgia, high-end batumi hotel',
    h1: 'Luxury Apartments in Batumi, Georgia',
    intro: 'Discover world-class luxury at Orbi City Batumi. Our 5-star apartments offer premium amenities, stunning design, and unmatched service in Georgia\'s premier Black Sea resort. Experience the best of Georgian hospitality combined with international standards.',
    features: [
      '5-star luxury amenities',
      'Designer apartment interiors',
      'Premium bedding & linens',
      'Infinity pool with bar',
      'Full-service spa & wellness',
      'Michelin-quality restaurants'
    ],
    nearbyAttractions: [
      { name: 'Fine Dining Restaurants', distance: '200m' },
      { name: 'High-End Shopping', distance: '500m' },
      { name: 'Wine Bars', distance: '300m' },
      { name: 'Casinos', distance: '400m' },
      { name: 'Yacht Club', distance: '1km' },
      { name: 'Golf Club', distance: '5km' }
    ]
  },
  'family-apartments-batumi': {
    title: 'Family Apartments Batumi | Kid-Friendly Accommodation at Orbi City',
    description: 'Perfect family apartments in Batumi with 2 bedrooms, full kitchen, washing machine. Safe, spacious, near beach & attractions. Kids love our pool!',
    keywords: 'family apartments batumi, kid friendly batumi hotel, batumi accommodation families, 2 bedroom apartment batumi',
    h1: 'Family Apartments in Batumi',
    intro: 'Traveling with kids? Orbi City offers spacious 2-bedroom apartments perfect for families. With full kitchens for picky eaters, washing machines for dirty vacation clothes, and a kid-friendly pool, we make family travel easy and enjoyable.',
    features: [
      'Spacious 2-bedroom apartments',
      'Full kitchens for family meals',
      'In-room washing machines',
      'Kid-friendly swimming pool',
      'Safe, secure building',
      'Near playgrounds & attractions'
    ],
    nearbyAttractions: [
      { name: 'Boulevard Playground', distance: '100m' },
      { name: 'Batumi Dolphinarium', distance: '3km' },
      { name: 'Batumi Aquarium', distance: '2km' },
      { name: 'Ferris Wheel', distance: '500m' },
      { name: 'Beach (shallow areas)', distance: '50m' },
      { name: 'Ice Cream Shops', distance: '50m' }
    ]
  }
};

const LocalSEO = () => {
  const { slug } = useParams<{ slug: string }>();
  const pageData = slug ? localSEOPages[slug] : null;

  if (!pageData) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO
        title={pageData.title}
        description={pageData.description}
        keywords={pageData.keywords}
        ogImage="https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/636d61089bf9b6dbdef774c6f108123e.jpg"
      />
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-r from-blue-900 to-blue-700">
        <div className="absolute inset-0 bg-black/40" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600)' }}
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-4">Orbi City Batumi</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
            {pageData.h1}
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-8 text-white/90">
            {pageData.intro}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/apartments">
              <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-white">
                View Apartments
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">
            Why Choose Orbi City?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageData.features.map((feature, index) => (
              <Card key={index} className="border-gold-200">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center">
                    <Star className="w-6 h-6 text-gold-600" />
                  </div>
                  <p className="font-medium">{feature}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Attractions */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-4">
            Nearby Attractions
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Everything you need is within walking distance from Orbi City
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {pageData.nearbyAttractions.map((attraction, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gold-500" />
                  <span>{attraction.name}</span>
                </div>
                <span className="text-gold-600 font-semibold">{attraction.distance}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">
            5-Star Amenities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Waves, label: 'Infinity Pool' },
              { icon: Wifi, label: 'Free WiFi' },
              { icon: Car, label: 'Free Parking' },
              { icon: Utensils, label: 'Restaurant' },
              { icon: Building, label: 'Spa & Wellness' },
              { icon: Clock, label: '24/7 Reception' },
              { icon: Star, label: 'Sea Views' },
              { icon: MapPin, label: 'Prime Location' },
            ].map((amenity, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gold-100 flex items-center justify-center">
                  <amenity.icon className="w-8 h-8 text-gold-600" />
                </div>
                <p className="font-medium">{amenity.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gold-500 to-gold-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Book Your Perfect Stay Today
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Experience the best of Batumi at Orbi City. Sea views, luxury amenities, and unbeatable location.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/apartments">
              <Button size="lg" className="bg-white text-gold-600 hover:bg-gray-100">
                Book Now - Best Price Guarantee
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm opacity-80">
            ✓ Free Cancellation · ✓ No Hidden Fees · ✓ Book Direct & Save 20%
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LocalSEO;
