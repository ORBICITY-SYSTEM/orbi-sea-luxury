import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { MessageCircle, ChevronLeft, ChevronRight, ChevronDown, Play, Pause } from 'lucide-react';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import { trackLead } from '@/lib/tracking';

const heroVideos = [
  '/videos/hero-1.mp4',
  '/videos/hero-2.mp4',
  '/videos/hero-3.mp4',
  '/videos/hero-4.mp4',
  '/videos/hero-5.mp4',
  '/videos/hero-6.mp4',
];

const VIDEO_DURATION = 3; // 3 seconds per video

export const HeroCarousel = () => {
  const { t } = useLanguage();
  const { whatsappUrl } = useWhatsApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Set video ref
  const setVideoRef = useCallback((el: HTMLVideoElement | null, index: number) => {
    videoRefs.current[index] = el;
  }, []);

  // Handle video time update - switch to next video after 3 seconds
  const handleTimeUpdate = useCallback((index: number) => {
    const video = videoRefs.current[index];
    if (video && video.currentTime >= VIDEO_DURATION) {
      const nextIndex = (index + 1) % heroVideos.length;
      setCurrentIndex(nextIndex);
    }
  }, []);

  // Play current video and reset others
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentIndex && isPlaying) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentIndex, isPlaying]);

  const scrollPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + heroVideos.length) % heroVideos.length);
  }, []);

  const scrollNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroVideos.length);
  }, []);

  const scrollTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handleWhatsAppClick = () => {
    trackLead({
      content_name: 'WhatsApp Click - Hero',
      form_name: 'WhatsApp Button',
    });
  };

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        {heroVideos.map((src, index) => (
          <video
            key={src}
            ref={(el) => setVideoRef(el, index)}
            muted
            playsInline
            onTimeUpdate={() => handleTimeUpdate(index)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <source src={src} type="video/mp4" />
          </video>
        ))}
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
        {heroVideos.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'w-8 bg-white' 
                : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to video ${index + 1}`}
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