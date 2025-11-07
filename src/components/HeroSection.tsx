import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { BookingWidget } from './BookingWidget';

export const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero-video.mov" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-overlay" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {t('hero.title')}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          {t('hero.subtitle')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <Button
            size="lg"
            onClick={() => document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-gold hover:bg-secondary-dark text-secondary-foreground font-bold text-lg px-8 shadow-gold"
          >
            {t('nav.bookNow')}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.open('https://wa.me/+995555199090', '_blank')}
            className="border-2 border-white text-white hover:bg-white hover:text-foreground font-bold text-lg px-8"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            {t('hero.whatsapp')}
          </Button>
        </div>

        {/* Booking Widget */}
        <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <BookingWidget />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};
