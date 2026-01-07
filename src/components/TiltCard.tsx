import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef, MouseEvent } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  glareEffect?: boolean;
}

export const TiltCard = ({ 
  children, 
  className = '',
  maxTilt = 15,
  perspective = 1000,
  scale = 1.02,
  glareEffect = true,
}: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig);
  
  const glareX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), springConfig);
  const glareY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), springConfig);
  
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;
    
    x.set(normalizedX);
    y.set(normalizedY);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective,
      }}
      whileHover={{ scale }}
      transition={{ duration: 0.2 }}
      className={`relative ${className}`}
    >
      {children}
      
      {glareEffect && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)`,
          }}
        />
      )}
    </motion.div>
  );
};

// Hover lift card effect
interface HoverLiftCardProps {
  children: ReactNode;
  className?: string;
}

export const HoverLiftCard = ({ children, className = '' }: HoverLiftCardProps) => {
  return (
    <motion.div
      className={`transition-shadow ${className}`}
      whileHover={{
        y: -8,
        boxShadow: '0 20px 40px -15px rgba(212, 175, 55, 0.3)',
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};
