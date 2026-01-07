import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
  const [phase, setPhase] = useState<'curtain' | 'logo' | 'complete'>('curtain');

  useEffect(() => {
    // Phase 1: Curtain starts opening after 200ms
    const logoTimer = setTimeout(() => setPhase('logo'), 200);
    
    // Phase 2: Complete after curtain opens and logo shows
    const completeTimer = setTimeout(() => {
      setPhase('complete');
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'complete' && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Left Curtain */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-navy-950 to-navy-900"
            initial={{ x: 0 }}
            animate={{ x: phase === 'logo' ? '-100%' : 0 }}
            transition={{ 
              duration: 1.2, 
              ease: [0.76, 0, 0.24, 1],
              delay: phase === 'logo' ? 0.8 : 0
            }}
          >
            {/* Gold accent line */}
            <div className="absolute right-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-gold-400 to-transparent" />
          </motion.div>

          {/* Right Curtain */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-navy-950 to-navy-900"
            initial={{ x: 0 }}
            animate={{ x: phase === 'logo' ? '100%' : 0 }}
            transition={{ 
              duration: 1.2, 
              ease: [0.76, 0, 0.24, 1],
              delay: phase === 'logo' ? 0.8 : 0
            }}
          >
            {/* Gold accent line */}
            <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-gold-400 to-transparent" />
          </motion.div>

          {/* Center Logo Animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: phase === 'logo' ? [0, 1, 1, 0] : 0,
                scale: phase === 'logo' ? [0.8, 1, 1, 1.1] : 0.8
              }}
              transition={{ 
                duration: 1.8,
                times: [0, 0.3, 0.7, 1],
                ease: "easeInOut"
              }}
            >
              {/* Logo Mark */}
              <motion.div
                className="mb-4 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-gold-400 flex items-center justify-center">
                  <span className="text-3xl md:text-4xl font-serif text-gold-400">O</span>
                </div>
              </motion.div>
              
              {/* Brand Name */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <h2 className="text-2xl md:text-3xl font-serif tracking-[0.3em] text-white">
                  ORBI CITY
                </h2>
                <p className="text-xs md:text-sm tracking-[0.5em] text-gold-400 mt-2">
                  BATUMI
                </p>
              </motion.div>

              {/* Loading line */}
              <motion.div
                className="mt-6 mx-auto h-[1px] bg-gold-400/50 overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: 120 }}
                transition={{ delay: 0.7, duration: 1 }}
              >
                <motion.div
                  className="h-full bg-gold-400"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ 
                    repeat: 2,
                    duration: 0.5,
                    ease: "linear"
                  }}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Particle effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-gold-400/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [-20, -60]
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 1.5,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};