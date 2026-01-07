import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
}

export const RevealOnScroll = ({ 
  children, 
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.6,
}: RevealOnScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  const directions = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { x: 60, y: 0 },
    right: { x: -60, y: 0 },
  };
  
  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        ...directions[direction],
      }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        x: 0,
      } : {}}
      transition={{ 
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Parallax scroll effect
interface ParallaxScrollProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export const ParallaxScroll = ({ 
  children, 
  className = '',
  speed = 0.5,
}: ParallaxScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);
  
  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scale on scroll effect
interface ScaleOnScrollProps {
  children: ReactNode;
  className?: string;
}

export const ScaleOnScroll = ({ children, className = '' }: ScaleOnScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });
  
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);
  
  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scroll progress indicator
export const ScrollProgressIndicator = () => {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.div
      className="fixed right-4 top-1/2 z-50 h-32 w-1 -translate-y-1/2 overflow-hidden rounded-full bg-muted/30 backdrop-blur-sm"
    >
      <motion.div
        className="w-full origin-top rounded-full bg-gradient-to-b from-primary to-primary/60"
        style={{ scaleY: scrollYProgress }}
      />
    </motion.div>
  );
};

// Text blur reveal on scroll
interface BlurRevealProps {
  children: ReactNode;
  className?: string;
}

export const BlurReveal = ({ children, className = '' }: BlurRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={isInView ? { opacity: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
