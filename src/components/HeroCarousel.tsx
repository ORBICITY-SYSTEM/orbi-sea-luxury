import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

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
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <source src={src} type="video/mp4" />
          </video>
        ))}
      </div>

      {/* Gradient Overlay - Manus Style */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />

      {/* Content - Manus Style: Clean, centered */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        {/* Welcome Text - Manus Style */}
        <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-white/90 mb-6 animate-fade-in-up font-light">
          WELCOME TO ORBI CITY BATUMI
        </p>
        
        {/* Title - Manus Style: Large serif */}
        <h1 className="font-serif font-normal text-white mb-6 animate-fade-in-up drop-shadow-2xl leading-[1.1]" style={{ animationDelay: '100ms' }}>
          <span className="block text-5xl md:text-7xl lg:text-8xl">Your Perfect</span>
          <span className="block text-5xl md:text-7xl lg:text-8xl mt-2 italic text-gold-400">Seaside Escape</span>
        </h1>

        {/* Subtitle - Manus Style */}
        <p className="text-base md:text-lg text-white/80 mb-8 max-w-xl animate-fade-in-up font-light tracking-wide" style={{ animationDelay: '200ms' }}>
          Experience unparalleled luxury on the shores of the Black Sea
        </p>

        {/* Scroll Down Arrow - Manus Style */}
        <div className="mb-8 animate-bounce-subtle">
          <ChevronDown className="w-6 h-6 text-white/60" strokeWidth={1.5} />
        </div>

        {/* CTA - Manus Style: Black button only */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <Button
            size="lg"
            onClick={() => document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-black hover:bg-black/90 text-white font-semibold text-sm tracking-wider px-10 py-6 rounded-sm shadow-lg uppercase"
          >
            BOOK NOW/<em className="not-italic font-light">Pay Later</em>
          </Button>
        </div>
      </div>
    </section>
  );
};