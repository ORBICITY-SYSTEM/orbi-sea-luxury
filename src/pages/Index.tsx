import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const apartments = [
    {
      image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/e4578176040cf98304ee3ae0477a108f.jpg',
      title: 'Suite with Sea View',
      description: 'An elegant suite offering breathtaking views of the sea, perfect for couples or solo travelers seeking a tranquil escape.'
    },
    {
      image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/47fe838e886d9afa24f54f2c292a93c3.jpg',
      title: 'Delux Suite with Sea View',
      description: 'A more spacious and luxurious suite with enhanced amenities and a prime sea view, designed for an indulgent stay.'
    },
    {
      image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/78f6531862f26bbcdf6bca5ec8d7305c.jpg',
      title: 'Superior Suite with Sea View',
      description: 'Our premium suite featuring a separate living area, top-tier amenities, and the best panoramic views of the sea.'
    },
    {
      image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/0922f2b1b13af96b0d24272d32439996.jpg',
      title: 'Superior Family Suite',
      description: 'A generously sized suite with multiple rooms, perfect for families or groups, ensuring comfort and privacy for everyone.'
    },
    {
      image: 'https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/80787ed88713055ace717fd00ec62ca7.jpg',
      title: 'Two Bedroom Panoramic Suite',
      description: 'The pinnacle of luxury. This expansive suite features two bedrooms and a stunning panoramic terrace for an unforgettable experience.'
    }
  ];

  const galleryImages = [
    'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/29683ca4a5e5c522d3bca348fa0eabb1.jpg',
    'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/e04fa4f0c83b330812e44e5772ffc3c6.jpg',
    'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/e4578176040cf98304ee3ae0477a108f.jpg',
    'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/12b2972bcb9994f6e350284f65f6d745.jpg',
    'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/8dbfb8081b4518e8adafc46f428e41a3.jpg',
    'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/e8dd36eb06f1b16db207830bdd785f19.jpg',
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />

      {/* Apartments Preview */}
      <section id="rooms" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Find Your Perfect Space</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each of our apartments is thoughtfully designed to provide an unparalleled experience. Explore our offerings and find the one that speaks to you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {apartments.slice(0, 3).map((apt, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-luxury transition-all">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={apt.image} 
                    alt={apt.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-foreground mb-3">{apt.title}</h3>
                  <p className="text-muted-foreground mb-4">{apt.description}</p>
                  <Link to="/apartments">
                    <Button variant="outline" className="w-full">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/apartments">
              <Button size="lg" className="bg-gradient-gold hover:bg-secondary-dark text-secondary-foreground font-bold shadow-gold">
                View All Apartments
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section id="gallery" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">A Glimpse into Our World of Luxury</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {galleryImages.map((image, index) => (
              <div key={index} className="relative h-64 overflow-hidden rounded-lg group">
                <img 
                  src={image} 
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/gallery">
              <Button size="lg" variant="outline">
                View Full Gallery
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Loyalty Program Preview */}
      <section className="py-20 bg-gradient-sea">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-12 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-secondary" />
            <h2 className="text-4xl font-bold text-white mb-6">Loyalty Program</h2>
            <p className="text-xl text-white/90 mb-8">
              Earn points with every stay and enjoy exclusive rewards.
            </p>
            <Link to="/loyalty-program">
              <Button size="lg" className="bg-gradient-gold hover:bg-secondary-dark text-secondary-foreground font-bold shadow-gold">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section with Image */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">5 Star Aparthotel Orbi City</h2>
              <p className="text-muted-foreground mb-4">
                Discover unparalleled luxury at Orbi City, where every apartment offers breathtaking Black Sea views and five-star comfort.
              </p>
              <p className="text-muted-foreground mb-6">
                Our modern apartments feature fully equipped kitchenettes, spacious living areas, and stunning sea views. 
                Whether you're traveling for business or pleasure, solo or with family, we have the perfect accommodation for your needs.
              </p>
              <div className="flex gap-4">
                <Link to="/amenities">
                  <Button>Explore Amenities</Button>
                </Link>
                <Link to="/location">
                  <Button variant="outline">View Location</Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/755d262231af5921623772da76ea56c7.jpg"
                alt="Orbi City Lobby"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-gradient-gold text-secondary-foreground rounded-xl p-6 shadow-gold">
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-3xl font-bold">4.9</p>
                <p className="text-sm">Guest Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">What Our Guests Say</h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="p-8 shadow-luxury">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-lg text-muted-foreground mb-6 italic">
                "Absolutely stunning views of the Black Sea! The apartment was luxurious and the staff incredibly welcoming. The balcony breakfast was unforgettable."
              </p>
              <div className="flex items-center gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
                  alt="Sarah Johnson"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-foreground">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">United Kingdom</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link to="/apartments">
              <Button size="lg" className="bg-gradient-gold hover:bg-secondary-dark text-secondary-foreground font-bold shadow-gold">
                Book Your Stay
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA with Background Image */}
      <section 
        className="relative py-32 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1685031214576-c2c045eff368)' }}
      >
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">Ready for Your Seaside Escape?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Experience the perfect blend of luxury and comfort at Orbi City Batumi
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-gradient-gold hover:bg-secondary-dark text-secondary-foreground font-bold text-lg px-12 py-6 shadow-gold">
              Contact Us Today
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
