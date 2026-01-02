import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { MessageCircle, ChevronDown, Play, Pause } from 'lucide-react';
import { BookingWidget } from './BookingWidget';
import { useWhatsApp } from '@/hooks/useWhatsApp';

// Hero video sources - can be expanded
const heroVideos = [
  '/videos/hero-video.mov',
  '/videos/hero-video-2.mp4',
  '/videos/hero-video-3.mp4',
];

export const HeroSection = () => {
  const { t } = useLanguage();
  const { openWhatsApp } = useWhatsApp();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Auto-rotate videos every 15 seconds
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % heroVideos.length);
    }, 15000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Handle video load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    videoRefs.current.forEach(video => {
      if (video) {
        isPlaying ? video.pause() : video.play();
      }
    });
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
      {/* Video Background Carousel */}
      {heroVideos.map((videoSrc, index) => (
        <video
          key={index}
          ref={el => videoRefs.current[index] = el}
          autoPlay
          loop
          muted
          playsInline
          preload={index === 0 ? "auto" : "metadata"}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1500 ${
            index === currentVideoIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ))}

      {/* Elegant Overlay - Four Seasons Style */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Additional Vignette Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-navy-900/30" />

      {/* Content */}
      <div className={`relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        {/* Luxury Badge */}
        <div className="mb-8 animate-fade-in-down">
          <span className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-gold-400/30">
            <span className="text-gold-400 text-sm">★★★★★</span>
            <span className="text-white/90 text-sm font-light tracking-wider">LUXURY APARTHOTEL</span>
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-white mb-6 hero-text-shadow animate-fade-in-up">
          <span className="block">{t('hero.title').split(' ').slice(0, 2).join(' ')}</span>
          <span className="block text-gold-400 font-normal mt-2">
            {t('hero.title').split(' ').slice(2).join(' ') || 'Seaside Escape'}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl lg:text-2xl text-white/85 mb-10 max-w-3xl font-light leading-relaxed animate-fade-in-up delay-200">
          {t('hero.subtitle')}
        </p>

        {/* Decorative Line */}
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent mb-10 animate-fade-in-up delay-300" />

        {/* CTAs - Four Seasons Style */}
        <div className="flex flex-col sm:flex-row gap-5 mb-14 animate-fade-in-up delay-400">
          <Button
            size="lg"
            onClick={scrollToRooms}
            className="bg-white hover:bg-white/95 text-navy-900 font-semibold text-base px-10 py-7 rounded-full shadow-luxury hover:shadow-elegant transition-all duration-500 hover:scale-105 tracking-wider uppercase"
          >
            {t('nav.bookNow')}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => openWhatsApp('გამარჯობა! მაინტერესებს ინფორმაცია ოთახების შესახებ Orbi City Batumi-ში. გთხოვთ დამეხმაროთ.')}
            className="border-2 border-white/80 text-white hover:bg-white hover:text-navy-900 font-semibold text-base px-10 py-7 rounded-full transition-all duration-500 hover:scale-105 backdrop-blur-sm tracking-wider"
          >
            <MessageCircle className="w-5 h-5 mr-3" />
            WhatsApp
          </Button>
        </div>

        {/* Booking Widget */}
        <div className="w-full max-w-5xl animate-fade-in-up delay-500">
          <BookingWidget />
        </div>
      </div>

      {/* Video Controls */}
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

      {/* Scroll Indicator */}
      <button 
        onClick={scrollToNext}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce-subtle"
      >
        <div className="flex flex-col items-center gap-2 text-white/70 hover:text-gold-400 transition-colors cursor-pointer">
          <span className="text-xs tracking-[0.3em] uppercase font-light">Scroll</span>
          <div className="w-8 h-12 border-2 border-current rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-current rounded-full animate-pulse" />
          </div>
        </div>
      </button>

      {/* Side Social Links */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-4">
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
        <a 
          href="https://wa.me/995555199090?text=%E1%83%92%E1%83%90%E1%83%9B%E1%83%90%E1%83%A0%E1%83%AF%E1%83%9D%E1%83%91%E1%83%90!%20%E1%83%9B%E1%83%90%E1%83%98%E1%83%9C%E1%83%A2%E1%83%94%E1%83%A0%E1%83%94%E1%83%A1%E1%83%94%E1%83%91%E1%83%A1%20Orbi%20City%20Batumi." 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-green-500 hover:border-green-500 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>
    </section>
  );
};
