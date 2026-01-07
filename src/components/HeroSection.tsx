import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { BookingWidget } from './BookingWidget';
import { useIsMobile } from '@/hooks/use-mobile';
import heroPoster from '@/assets/hero-poster.jpg';

// Hero video sources - optimized for fast loading
const heroVideos = [
  '/videos/hero-1.mp4',
  '/videos/hero-2.mp4',
  '/videos/hero-3.mp4',
  '/videos/hero-4.mp4',
  '/videos/hero-5.mp4',
  '/videos/hero-6.mp4',
];

export const HeroSection = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoErrors, setVideoErrors] = useState<Set<number>>(new Set());
  const [videosReady, setVideosReady] = useState<Set<number>>(new Set());
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Check if all videos failed - show fallback image
  const allVideosFailed = videoErrors.size === heroVideos.length;

  // Handle video error
  const handleVideoError = useCallback((index: number) => {
    setVideoErrors(prev => new Set(prev).add(index));
  }, []);

  // Handle video ready (can play)
  const handleVideoReady = useCallback((index: number) => {
    setVideosReady(prev => new Set(prev).add(index));
  }, []);

  // Delay video loading for better initial page load - especially on mobile
  useEffect(() => {
    // Show poster first, then load video after delay
    const videoDelay = isMobile ? 2000 : 500;
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, videoDelay);
    return () => clearTimeout(timer);
  }, [isMobile]);

  // Auto-rotate videos every 15 seconds (desktop only for performance)
  useEffect(() => {
    if (!isPlaying || allVideosFailed || isMobile) return;
    
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => {
        // Skip to next non-errored video
        let next = (prev + 1) % heroVideos.length;
        let attempts = 0;
        while (videoErrors.has(next) && attempts < heroVideos.length) {
          next = (next + 1) % heroVideos.length;
          attempts++;
        }
        return next;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [isPlaying, videoErrors, allVideosFailed, isMobile]);

  // Handle content load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
    }
  };

  const scrollToRooms = () => {
    document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      {/* Fallback/Poster Image - Always present as background, optimized for LCP */}
      <img 
        src={heroPoster}
        alt="Orbi City Batumi - Luxury Sea View"
        fetchPriority="high"
        loading="eager"
        decoding="sync"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          (!showVideo || allVideosFailed || !videosReady.has(currentVideoIndex)) ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Single Video - Only load one video at a time for mobile performance */}
      {showVideo && !allVideosFailed && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster={heroPoster}
          preload="auto"
          onCanPlayThrough={() => handleVideoReady(currentVideoIndex)}
          onError={() => handleVideoError(currentVideoIndex)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            videosReady.has(currentVideoIndex) ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={heroVideos[currentVideoIndex]} type="video/mp4" />
        </video>
      )}

      {/* Elegant Overlay */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Additional Vignette Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-navy-900/30" />

      {/* Content - Optimized for mobile */}
      <div className={`relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center transition-all duration-700 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}>
        {/* Luxury Badge */}
        <div className="mb-4 md:mb-8 animate-fade-in-down">
          <span className="inline-flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-1.5 md:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-gold-400/30">
            <span className="text-3d-gold text-xs md:text-sm">★★★★★</span>
            <span className="text-white/90 text-xs md:text-sm font-light tracking-wider">LUXURY APARTHOTEL</span>
          </span>
        </div>

        {/* Main Title - 3D Gold Effect */}
        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-light text-white mb-4 md:mb-6 hero-text-shadow animate-fade-in-up">
          <span className="block">{t('hero.title').split(' ').slice(0, 2).join(' ')}</span>
          <span className="block mt-1 md:mt-2 hero-title-3d text-3d-gold-float">
            <span className="text-3d-gold-glow font-normal">
              {t('hero.title').split(' ').slice(2).join(' ') || 'Seaside Escape'}
            </span>
          </span>
        </h1>

        {/* Subtitle - Hide on very small screens */}
        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-white/85 mb-6 md:mb-10 max-w-3xl font-light leading-relaxed animate-fade-in-up delay-200 px-2">
          {t('hero.subtitle')}
        </p>

        {/* Decorative Line */}
        <div className="w-16 md:w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent mb-6 md:mb-10 animate-fade-in-up delay-300" />

        {/* CTA - Book Now Button - 3D Gold Effect */}
        <div className="flex justify-center mb-8 md:mb-14 animate-fade-in-up delay-400">
          <Button
            size="lg"
            onClick={scrollToRooms}
            className="group relative bg-gradient-to-r from-gold-400 via-gold-300 to-gold-400 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-navy-900 font-bold text-sm md:text-lg px-8 md:px-14 py-5 md:py-7 rounded-full transition-all duration-500 hover:scale-105 tracking-wider uppercase overflow-hidden shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.6)]"
          >
            {/* Shine effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            {/* 3D border effect */}
            <span className="absolute inset-0 rounded-full border-2 border-gold-200/50" />
            <span className="absolute inset-[3px] rounded-full border border-gold-600/30" />
            {/* Text with shadow */}
            <span className="relative z-10 drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
              {t('hero.bookNowPayLater')}
            </span>
          </Button>
        </div>

        {/* Booking Widget - Hidden on mobile for cleaner look */}
        <div className="w-full max-w-5xl animate-fade-in-up delay-500 hidden md:block">
          <BookingWidget />
        </div>
      </div>

      {/* Video Controls - Hidden on mobile */}
      {!isMobile && (
        <div className="absolute bottom-32 left-8 z-20 flex items-center gap-4">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          {/* Video Indicators */}
          <div className="flex gap-2">
            {heroVideos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentVideoIndex(index)}
                className={`h-1 rounded-full transition-all duration-500 ${
                  index === currentVideoIndex 
                    ? 'w-8 bg-gold-400' 
                    : 'w-4 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Scroll Indicator - Simplified on mobile */}
      <button 
        onClick={scrollToNext}
        className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce-subtle"
      >
        <div className="flex flex-col items-center gap-1 md:gap-2 text-white/70 hover:text-gold-400 transition-colors cursor-pointer">
          <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase font-light hidden sm:block">Scroll</span>
          <div className="w-6 md:w-8 h-10 md:h-12 border-2 border-current rounded-full flex justify-center pt-2">
            <div className="w-1 md:w-1.5 h-2 md:h-3 bg-current rounded-full animate-pulse" />
          </div>
        </div>
      </button>

      {/* Side Social Links - Hidden on mobile */}
      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-4">
        <a 
          href="https://www.instagram.com/orbicity.batumi/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-gold-400 hover:border-gold-400 hover:text-navy-900 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
        <a 
          href="https://www.facebook.com/orbicity.batumi" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-gold-400 hover:border-gold-400 hover:text-navy-900 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
      </div>
    </section>
  );
};
