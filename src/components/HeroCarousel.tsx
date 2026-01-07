import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

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
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax effect
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

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

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-[100vh] lg:min-h-[110vh] w-full overflow-hidden">
      {/* Video Background with Parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{ y, scale }}
      >
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
      </motion.div>

      {/* Gradient Overlay - Enhanced */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      {/* Content with Parallax fade */}
      <motion.div 
        className="relative z-10 container mx-auto px-4 h-full min-h-[100vh] flex flex-col justify-center items-center text-center pt-20"
        style={{ opacity }}
      >
        {/* Welcome Text */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs md:text-sm tracking-[0.3em] uppercase text-white/90 mb-6 font-light"
        >
          WELCOME TO ORBI CITY BATUMI
        </motion.p>
        
        {/* Title - Large serif with staggered animation */}
        <motion.h1 
          className="font-serif font-normal text-white mb-6 drop-shadow-2xl leading-[1.1]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="block text-5xl md:text-7xl lg:text-8xl">Your Perfect</span>
          <motion.span 
            className="block text-5xl md:text-7xl lg:text-8xl mt-2 italic text-gold-400"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Seaside Escape
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-base md:text-lg text-white/80 mb-10 max-w-xl font-light tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Experience unparalleled luxury on the shores of the Black Sea
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Button
            size="lg"
            onClick={() => document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-black hover:bg-black/90 text-white font-semibold text-sm tracking-wider px-10 py-6 rounded-sm shadow-lg uppercase hover:scale-105 transition-transform"
          >
            BOOK NOW/<em className="not-italic font-light">Pay Later</em>
          </Button>
        </motion.div>
      </motion.div>

      {/* Enhanced Scroll Down Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        onClick={scrollToNext}
      >
        <div className="flex flex-col items-center gap-3 group">
          {/* Mouse Icon with animation */}
          <motion.div
            className="w-7 h-11 border-2 border-white/50 rounded-full flex justify-center pt-2 group-hover:border-gold-400 transition-colors"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div 
              className="w-1.5 h-3 bg-white/70 rounded-full group-hover:bg-gold-400 transition-colors"
              animate={{ opacity: [1, 0.3, 1], y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
          
          {/* Scroll Text */}
          <motion.span 
            className="text-[10px] tracking-[0.3em] uppercase text-white/50 group-hover:text-gold-400 transition-colors hidden sm:block"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Scroll
          </motion.span>
          
          {/* Animated Chevrons */}
          <motion.div className="flex flex-col -space-y-2">
            <motion.div
              animate={{ y: [0, 4, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-5 h-5 text-white/40 group-hover:text-gold-400 transition-colors" strokeWidth={1.5} />
            </motion.div>
            <motion.div
              animate={{ y: [0, 4, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
            >
              <ChevronDown className="w-5 h-5 text-white/60 group-hover:text-gold-400 transition-colors" strokeWidth={1.5} />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
