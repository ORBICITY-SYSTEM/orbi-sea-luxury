import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { MessageCircle, ChevronLeft, ChevronRight, ChevronDown, Play, Pause } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import { trackLead } from '@/lib/tracking';

interface HeroSlide {
  type: 'video' | 'image';
  src: string;
}

const heroSlides: HeroSlide[] = [
  {
    type: 'video',
    src: '/videos/hero-video.mov',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=80',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80',
  },
];

export const HeroCarousel = () => {
  const { t } = useLanguage();
  const { whatsappUrl } = useWhatsApp();
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

  const handleWhatsAppClick = () => {
    trackLead({
      content_name: 'WhatsApp Click - Hero',
      form_name: 'WhatsApp Button',
    });
  };

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

      {/* Gradient Overlay - Manus Style: Subtle, elegant */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />

      {/* Navigation Arrows - Manus Style: Subtle gold circles */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-gold-500/20 backdrop-blur-sm border border-gold-400/30 text-white/80 hover:bg-gold-500/30 hover:text-white transition-all duration-300 flex items-center justify-center group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-gold-500/20 backdrop-blur-sm border border-gold-400/30 text-white/80 hover:bg-gold-500/30 hover:text-white transition-all duration-300 flex items-center justify-center group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      {/* Play/Pause Button - Positioned subtly */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute top-24 right-4 md:right-8 z-20 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300"
        aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>

      {/* Dots Indicator - Bottom center, subtle */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex 
                ? 'w-8 bg-white' 
                : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content - Manus Style: Clean, centered, elegant */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        {/* Welcome Text - Manus Style: Wide letter spacing */}
        <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-white/80 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-light">
          W E L C O M E &nbsp; T O &nbsp; O R B I &nbsp; C I T Y &nbsp; B A T U M I
        </p>
        
        {/* Title - Manus Style: Elegant serif italic */}
        <h1 className="font-playfair italic font-normal text-white mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100 drop-shadow-2xl leading-[1.1]">
          <span className="block text-5xl md:text-7xl lg:text-8xl">Your Perfect</span>
          <span className="block text-5xl md:text-7xl lg:text-8xl mt-2">Seaside Escape</span>
        </h1>

        {/* Subtitle - Manus Style */}
        <p className="text-base md:text-lg text-white/75 mb-8 max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 drop-shadow-lg font-light tracking-wide">
          Experience unparalleled luxury on the shores of the Black Sea
        </p>

        {/* Scroll Down Arrow - Manus Style: Animated chevron */}
        <div className="mb-10 animate-bounce-subtle">
          <ChevronDown className="w-7 h-7 text-white/60" strokeWidth={1.5} />
        </div>

        {/* CTAs - Manus Style: Black & Green buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <Button
            size="lg"
            onClick={() => document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-black hover:bg-black/90 text-white font-semibold text-sm tracking-wider px-10 py-6 rounded-sm shadow-lg uppercase"
          >
            Check Rates
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-success hover:bg-success/90 text-white font-semibold text-sm tracking-wide px-10 py-6 rounded-sm shadow-lg"
          >
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
