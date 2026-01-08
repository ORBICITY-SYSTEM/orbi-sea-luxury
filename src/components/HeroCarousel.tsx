import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { CinematicIntro } from './CinematicIntro';
import { TypewriterText } from './TypewriterText';

const heroVideos = [
  '/videos/hero-1.mp4',
  '/videos/hero-2.mp4',
  '/videos/hero-3.mp4',
  '/videos/hero-4.mp4',
  '/videos/hero-5.mp4',
  '/videos/hero-6.mp4',
];

const VIDEO_DURATION = 3;

// Check if device is mobile
const getIsMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

export const HeroCarousel = () => {
  const { t } = useLanguage();
  const { openBookingModal } = useBooking();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  // Skip intro on mobile for better performance
  const [isMobile, setIsMobile] = useState(getIsMobile);
  const [introComplete, setIntroComplete] = useState(getIsMobile());
  const [showTypewriter, setShowTypewriter] = useState(getIsMobile());
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  // Check mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = getIsMobile();
      setIsMobile(mobile);
      if (mobile) {
        setIntroComplete(true);
        setShowTypewriter(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Enhanced Parallax with mouse tracking - DISABLED on mobile
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  // Scroll-based parallax - SIMPLIFIED on mobile
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, isMobile ? 50 : 200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, isMobile ? 1.05 : 1.15]);
  const blur = useTransform(scrollY, [0, 400], [0, isMobile ? 0 : 10]);

  // Mouse move handler for 3D parallax - DISABLED on mobile
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile) return; // Skip on mobile
    
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = (e.clientX - rect.left - centerX) / centerX;
    const y = (e.clientY - rect.top - centerY) / centerY;
    
    mouseX.set(x * 20);
    mouseY.set(y * 20);
  }, [mouseX, mouseY, isMobile]);

  // Set video ref
  const setVideoRef = useCallback((el: HTMLVideoElement | null, index: number) => {
    videoRefs.current[index] = el;
  }, []);

  // Handle video time update
  const handleTimeUpdate = useCallback((index: number) => {
    const video = videoRefs.current[index];
    if (video && video.currentTime >= VIDEO_DURATION) {
      const nextIndex = (index + 1) % heroVideos.length;
      setCurrentIndex(nextIndex);
    }
  }, []);

  // Play current video and reset others
  useEffect(() => {
    if (!introComplete) return;
    
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
  }, [currentIndex, isPlaying, introComplete]);

  // Start typewriter after intro (skip delay on mobile)
  useEffect(() => {
    if (introComplete && !showTypewriter) {
      const timer = setTimeout(() => setShowTypewriter(true), isMobile ? 0 : 300);
      return () => clearTimeout(timer);
    }
  }, [introComplete, isMobile, showTypewriter]);

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  // Only show 2 videos on mobile for better performance
  const videosToShow = isMobile ? heroVideos.slice(0, 2) : heroVideos;

  return (
    <>
      {/* Cinematic Intro - ONLY on desktop */}
      {!introComplete && !isMobile && (
        <CinematicIntro onComplete={() => setIntroComplete(true)} />
      )}

      <section 
        ref={sectionRef} 
        id="hero" 
        className="relative min-h-[100vh] lg:min-h-[110vh] w-full overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Video Background with Enhanced Parallax - SIMPLIFIED on mobile */}
        <motion.div 
          className="absolute inset-0"
          style={{ 
            y: isMobile ? 0 : y, 
            scale: isMobile ? 1 : scale,
            x: isMobile ? 0 : parallaxX,
          }}
        >
          {videosToShow.map((src, index) => (
            <video
              key={src}
              ref={(el) => setVideoRef(el, index)}
              muted
              playsInline
              autoPlay={index === 0}
              preload={index === 0 ? "auto" : "none"}
              onTimeUpdate={() => handleTimeUpdate(index)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <source src={src} type="video/mp4" />
            </video>
          ))}
        </motion.div>

        {/* Enhanced Gradient Overlay with depth */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/30 via-transparent to-navy-950/30" />
          {/* Vignette effect */}
          <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.5)]" />
        </div>

        {/* Content with Parallax fade */}
        <motion.div 
          className="relative z-10 container mx-auto px-4 h-full min-h-[100vh] flex flex-col justify-center items-center text-center pt-20"
          style={{ opacity }}
        >
          {/* Welcome Text with reveal animation */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ 
              opacity: introComplete ? 1 : 0, 
              y: introComplete ? 0 : 30,
              scale: introComplete ? 1 : 0.9
            }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-gold-400/20 mb-8">
              <motion.span 
                className="w-2 h-2 bg-gold-400 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-white/90 font-light">
                WELCOME TO ORBI CITY BATUMI
              </span>
            </span>
          </motion.div>
          
          {/* Title with Typewriter Effect */}
          <motion.h1 
            className="font-serif font-normal text-white mb-6 drop-shadow-2xl leading-[1.1]"
            initial={{ opacity: 0 }}
            animate={{ opacity: introComplete ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="block text-5xl md:text-7xl lg:text-8xl">
              {showTypewriter ? (
                <TypewriterText 
                  text="Your Perfect" 
                  speed={80}
                  className="inline-block"
                />
              ) : (
                <span className="opacity-0">Your Perfect</span>
              )}
            </span>
            <motion.span 
              className="block text-5xl md:text-7xl lg:text-8xl mt-2"
              initial={{ opacity: 0, x: -50, rotateY: -15 }}
              animate={{ 
                opacity: showTypewriter ? 1 : 0, 
                x: showTypewriter ? 0 : -50,
                rotateY: showTypewriter ? 0 : -15
              }}
              transition={{ duration: 1, delay: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="italic bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(212,175,55,0.5)]">
                Seaside Escape
              </span>
            </motion.span>
          </motion.h1>

          {/* Decorative Line */}
          <motion.div
            className="w-24 h-[2px] mb-6 overflow-hidden"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ 
              opacity: introComplete ? 1 : 0, 
              scaleX: introComplete ? 1 : 0 
            }}
            transition={{ duration: 0.8, delay: 2 }}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-transparent via-gold-400 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>

          {/* Subtitle */}
          <motion.p 
            className="text-base md:text-lg text-white/80 mb-10 max-w-xl font-light tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: introComplete ? 1 : 0, 
              y: introComplete ? 0 : 20 
            }}
            transition={{ duration: 0.8, delay: 2.2 }}
          >
            Experience unparalleled luxury on the shores of the Black Sea
          </motion.p>

          {/* CTA Button with enhanced animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ 
              opacity: introComplete ? 1 : 0, 
              scale: introComplete ? 1 : 0.8,
              y: introComplete ? 0 : 30
            }}
            transition={{ duration: 0.6, delay: 2.5, type: 'spring', bounce: 0.4 }}
          >
            <div className="flex flex-col items-center">
              <Button
                size="lg"
                onClick={() => openBookingModal()}
                className="group relative bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:from-gold-600 hover:via-gold-500 hover:to-gold-600 text-navy-950 font-bold text-sm tracking-wider px-10 py-6 rounded-sm shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] uppercase transition-all duration-500 hover:scale-105 overflow-hidden"
              >
                {/* Shine sweep effect */}
                <motion.span 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">BOOK NOW</span>
              </Button>

              {/* Trust badges - italic thin text with gold checkmarks */}
              <p className="mt-3 text-white/75 text-xs md:text-sm font-light italic tracking-wide">
                <span className="text-gold-400 font-semibold">✓</span> Free Cancellation ·{' '}
                <span className="text-gold-400 font-semibold">✓</span> Pay Later
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Scroll Down Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: introComplete ? 1 : 0, 
            y: introComplete ? 0 : -20 
          }}
          transition={{ duration: 0.8, delay: 3 }}
          onClick={scrollToNext}
        >
          <div className="flex flex-col items-center gap-3 group">
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
            
            <motion.span 
              className="text-[10px] tracking-[0.3em] uppercase text-white/50 group-hover:text-gold-400 transition-colors hidden sm:block"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Scroll
            </motion.span>
            
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

        {/* Video Progress Indicators */}
        <motion.div
          className="absolute bottom-8 right-8 z-20 hidden md:flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: introComplete ? 1 : 0 }}
          transition={{ delay: 3 }}
        >
          {heroVideos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 rounded-full transition-all duration-500 ${
                index === currentIndex 
                  ? 'w-8 bg-gold-400' 
                  : 'w-3 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </motion.div>
      </section>
    </>
  );
};
