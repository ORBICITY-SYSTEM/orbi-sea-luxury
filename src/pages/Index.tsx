import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HeroCarousel } from '@/components/HeroCarousel';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { VideoTourCard } from '@/components/VideoTourCard';
import { GoogleReviews } from '@/components/GoogleReviews';
import { LazyImage } from '@/components/ui/lazy-image';
const Index = () => {
  const { t } = useLanguage();
  
  const virtualTours = [
    {
      videoSrc: '/videos/orbi-city-tour.mp4',
      title: 'Orbi City Batumi - Full Tour',
      description: 'Explore the entire Orbi City complex, including apartments, amenities, and stunning sea views.'
    },
    {
      videoSrc: '/videos/bedroom-luxury.mp4',
      title: 'Luxury Apartment Interior',
      description: 'Step inside our beautifully designed apartments with modern furnishings and panoramic views.'
    },
    {
      videoSrc: '/videos/hotel-room.mp4',
      title: 'Modern Hotel Room',
      description: 'Experience our elegantly designed rooms with contemporary furnishings and stunning sea views.'
    },
    {
      videoSrc: '/videos/pool-amenities.mp4',
      title: 'Amenities & Facilities',
      description: 'Tour our world-class amenities including pools, gym, restaurant, and entertainment areas.'
    }
  ];
  
  const apartments = [
    {
      image: 'https://orbicitybook-4w56az3r.manus.space/apt-suite-sea-view-real.webp',
      title: 'Suite with Sea View',
      description: 'An elegant suite offering breathtaking views of the sea, perfect for couples or solo travelers seeking a tranquil escape.',
      guests: 3,
      bedrooms: 1,
      size: '30m²'
    },
    {
      image: 'https://orbicitybook-4w56az3r.manus.space/apt-delux-suite-real.webp',
      title: 'Delux Suite with Sea View',
      description: 'A more spacious and luxurious suite with enhanced amenities and a prime sea view, designed for an indulgent stay.',
      guests: 3,
      bedrooms: 1,
      size: '33m²'
    },
    {
      image: 'https://orbicitybook-4w56az3r.manus.space/apt-superior-suite-real.webp',
      title: 'Superior Suite with Sea View',
      description: 'Our premium suite featuring a separate living area, top-tier amenities, and the best panoramic views of the sea.',
      guests: 3,
      bedrooms: 2,
      size: '33m²'
    },
  ];

  const galleryImages = [
    'https://orbicitybook-4w56az3r.manus.space/gallery-1-balcony-sea.webp',
    'https://orbicitybook-4w56az3r.manus.space/gallery-2-lobby.webp',
    'https://orbicitybook-4w56az3r.manus.space/gallery-3-bedroom.webp',
    'https://orbicitybook-4w56az3r.manus.space/gallery-4-night-view.webp',
    'https://orbicitybook-4w56az3r.manus.space/gallery-5-bedroom-2.webp',
    'https://orbicitybook-4w56az3r.manus.space/gallery-6-aerial-coast.webp',
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroCarousel />
      

      {/* Apartments Preview - Manus Style */}
      <section id="rooms" className="py-24 bg-cream-50">
        <div className="container mx-auto px-4">
          {/* Section Header - 3D Gold Effect */}
          <div className="text-center mb-16">
            <p className="text-3d-gold text-sm tracking-[0.3em] uppercase mb-4 font-medium">
              Exclusive Residences
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-6">
              Discover Your <span className="italic text-3d-gold">Perfect Sanctuary</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
              Each residence is meticulously crafted to offer an unparalleled living experience, where timeless elegance meets contemporary comfort.
            </p>
          </div>

          {/* Apartment Cards - Manus Style */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {apartments.map((apt, index) => (
              <div key={index} className="group bg-white rounded-xl overflow-hidden shadow-card hover:shadow-luxury transition-all duration-500">
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <LazyImage 
                    src={apt.image} 
                    alt={apt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-serif font-medium text-foreground mb-3">{apt.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{apt.description}</p>
                  
                  {/* Specs - Manus Style */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">
                    <span>{apt.guests} Guests</span>
                    <span className="text-gold-400">•</span>
                    <span>{apt.bedrooms} Bedroom{apt.bedrooms > 1 ? 's' : ''}</span>
                    <span className="text-gold-400">•</span>
                    <span>{apt.size}</span>
                  </div>
                  
                  <Link to="/apartments">
                    <Button variant="outline" className="w-full border-gold-300 text-foreground hover:bg-gold-50 hover:border-gold-400 transition-colors">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button - Manus Style */}
          <div className="text-center">
            <Link to="/apartments">
              <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-white font-medium px-10 py-6 rounded-sm shadow-gold">
                View All Apartments
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Virtual Tours Section - 3D Gold Effect */}
      <section className="py-32 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <p className="text-3d-gold text-sm tracking-[0.3em] uppercase mb-4 font-medium">
              Immersive Experience
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-foreground mb-6">
              <span className="text-3d-gold">Virtual Tours</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              Take a virtual tour of Orbi City Batumi and explore our stunning apartments and facilities from the comfort of your home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {virtualTours.map((tour, index) => (
              <VideoTourCard
                key={index}
                videoSrc={tour.videoSrc}
                title={tour.title}
                description={tour.description}
                index={index}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/youtube-videos">
              <Button size="lg" className="bg-gradient-gold hover:bg-secondary-dark text-secondary-foreground font-bold shadow-gold">
                {t('index.videos.viewAll')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Preview - 3D Gold Effect */}
      <section id="gallery" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-3d-gold text-sm tracking-[0.3em] uppercase mb-4 font-medium">
              Visual Journey
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-6">
              A Glimpse into Our <span className="italic text-3d-gold">World of Luxury</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {galleryImages.map((image, index) => (
              <div key={index} className="relative h-64 md:h-72 overflow-hidden rounded-lg group cursor-pointer">
                <LazyImage 
                  src={image} 
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/gallery">
              <Button size="lg" variant="outline" className="border-gold-400 text-foreground hover:bg-gold-50 px-10 py-6">
                Explore Full Gallery
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Loyalty Program Preview - 3D Gold Effect */}
      <section className="py-20 bg-gradient-sea">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-12 text-center border border-gold-400/30">
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-gold-400" />
            <h2 className="text-4xl font-bold text-3d-gold-glow mb-6">Loyalty Program</h2>
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

      {/* About Section - 3D Gold Effect */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6">Discover <span className="text-3d-gold">Orbi City</span> Batumi</h2>
              <p className="text-muted-foreground mb-4 font-light leading-relaxed">
                Discover unparalleled luxury at Orbi City, where every apartment offers breathtaking Black Sea views and five-star comfort.
              </p>
              <p className="text-muted-foreground mb-8 font-light leading-relaxed">
                Located in the heart of Batumi, our serviced apartments combine modern elegance with exceptional hospitality. Whether you're here for business or leisure, experience the perfect blend of comfort, convenience, and coastal beauty.
              </p>
              <div className="flex gap-4">
                <Link to="/amenities">
                  <Button className="bg-gold-500 hover:bg-gold-600 text-white px-8">Explore Amenities</Button>
                </Link>
                <Link to="/location">
                  <Button variant="outline" className="border-gold-400 hover:bg-gold-50 px-8">View Location</Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <video 
                src="/videos/discover-orbi.mp4#t=2,5"
                autoPlay
                loop
                muted
                playsInline
                className="rounded-2xl shadow-luxury w-full object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-gold-500 text-white rounded-xl p-6 shadow-gold">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-3xl font-bold">4.9</p>
                <p className="text-sm opacity-90">Guest Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews Section - 3D Gold Effect */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-3d-gold text-sm tracking-[0.3em] uppercase mb-4 font-medium">
              GUEST EXPERIENCES
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
              What Our <span className="text-3d-gold">Guests</span> Say
            </h2>
          </div>

          <GoogleReviews maxReviews={3} minRating={4} />
        </div>
      </section>

      {/* CTA with Background Image - 3D Gold Effect */}
      <section 
        className="relative py-32 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1685031214576-c2c045eff368)' }}
      >
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-3d-gold-glow mb-6">Ready for Your Seaside Escape?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Experience the perfect blend of luxury and comfort at <span className="text-3d-gold-glow font-semibold">Orbi City Batumi</span>
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
