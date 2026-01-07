import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef, MouseEvent } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
}

export const MagneticButton = ({ 
  children, 
  className = '', 
  strength = 0.3,
  onClick 
}: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    
    x.set(deltaX);
    y.set(deltaY);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`cursor-pointer ${className}`}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
};

// Ripple effect button
interface RippleButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const RippleButton = ({ children, className = '', onClick }: RippleButtonProps) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      background: radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, transparent 70%);
      border-radius: 50%;
      width: 100px;
      height: 100px;
      left: ${x - 50}px;
      top: ${y - 50}px;
      transform: scale(0);
      animation: ripple-effect 0.6s ease-out forwards;
      pointer-events: none;
    `;
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
    
    onClick?.();
  };
  
  return (
    <button
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      style={{ position: 'relative' }}
    >
      {children}
      <style>{`
        @keyframes ripple-effect {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
};
