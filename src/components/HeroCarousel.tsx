import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { MessageCircle, ChevronLeft, ChevronRight, ChevronDown, Play, Pause } from 'lucide-react';
import { BookingWidget } from './BookingWidget';
import useEmblaCarousel from 'embla-carousel-react';

interface HeroSlide {
  type: 'video' | 'image';
  src: string;
  title?: string;
  subtitle?: string;
}

const heroSlides: HeroSlide[] = [
  {
    type: 'video',
    src: '/videos/hero-video.mov',
    title: 'hero.title',
    subtitle: 'hero.subtitle',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80',
    title: 'hero.title',
    subtitle: 'hero.subtitle',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=80',
    title: 'hero.title',
    subtitle: 'hero.subtitle',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80',
    title: 'hero.title',
    subtitle: 'hero.subtitle',
  },
];

export const HeroCarousel = () => {
  const { t } = useLanguage();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-play functionality
  useEffect(() => {
    if (!emblaApi || !isPlaying) return;
    
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [emblaApi, isPlaying]);

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      {/* Carousel */}
      <div className="absolute inset-0" ref={emblaRef}>
        <div className="flex h-full">
          {heroSlides.map((slide, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 relative h-full">
              {slide.type === 'video' ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src={slide.src} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={slide.src}
                  alt={`Orbi City Batumi - Slide ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Gradient Overlay - Luxury style */}
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Navigation Arrows - Luxury Gold style */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-gold-500/20 backdrop-blur-md border border-gold-400/30 text-white hover:bg-gold-500/40 hover:border-gold-400/50 transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-gold-500/20 backdrop-blur-md border border-gold-400/30 text-white hover:bg-gold-500/40 hover:border-gold-400/50 transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute bottom-32 right-4 md:right-8 z-20 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex 
                ? 'w-8 bg-secondary' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        {/* Welcome Text - Manus Style */}
        <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-white/90 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-light">
          WELCOME TO ORBI CITY BATUMI
        </p>
        
        {/* Title - Manus Elegant Script/Italic Style */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair italic font-normal text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100 drop-shadow-2xl leading-tight">
          Your Perfect<br />
          <span className="block">Seaside Escape</span>
        </h1>
        <p className="text-base md:text-lg text-white/80 mb-6 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 drop-shadow-lg font-light">
          Experience unparalleled luxury on the shores of the Black Sea
        </p>

        {/* Scroll Down Arrow - Manus Style */}
        <div className="mb-6 animate-bounce-subtle">
          <ChevronDown className="w-8 h-8 text-white/70" />
        </div>

        {/* CTAs - Manus Style */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <Button
            size="lg"
            onClick={() => document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-navy-800 hover:bg-navy-900 text-white font-semibold text-base px-8 py-6 rounded-md shadow-lg"
          >
            CHECK RATES
          </Button>
          <Button
            size="lg"
            onClick={() => window.open('https://wa.me/+995555199090', '_blank')}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold text-base px-8 py-6 rounded-md shadow-lg"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            WhatsApp
          </Button>
        </div>

        {/* Booking Widget */}
        <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <BookingWidget />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 border-2 border-white/70 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};
