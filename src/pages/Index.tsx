import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { RoomsSection } from '@/components/RoomsSection';
import { AmenitiesSection } from '@/components/AmenitiesSection';
import { LocationSection } from '@/components/LocationSection';
import { ReviewsSection } from '@/components/ReviewsSection';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <RoomsSection />
      <AmenitiesSection />
      <LocationSection />
      <ReviewsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
