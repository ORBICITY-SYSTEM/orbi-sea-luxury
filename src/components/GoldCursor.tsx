import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export const GoldCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  useEffect(() => {
    // Only show on desktop
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };
    
    const handleMouseLeave = () => {
      setIsVisible(false);
    };
    
    const handleMouseEnter = () => {
      setIsVisible(true);
    };
    
    const handleMouseDown = () => {
      setIsClicking(true);
    };
    
    const handleMouseUp = () => {
      setIsClicking(false);
    };
    
    // Check for hoverable elements
    const handleElementHover = () => {
      const hoveredElements = document.querySelectorAll(':hover');
      const isHoveringInteractive = Array.from(hoveredElements).some(el => {
        const tagName = el.tagName.toLowerCase();
        return ['a', 'button', 'input', 'textarea', 'select'].includes(tagName) ||
               el.getAttribute('role') === 'button' ||
               el.classList.contains('cursor-pointer');
      });
      setIsHovering(isHoveringInteractive);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousemove', handleElementHover);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', handleElementHover);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);
  
  if (!isVisible) return null;
  
  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="pointer-events-none fixed z-[9999] mix-blend-difference"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: '-50%',
          y: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        <div 
          className="rounded-full bg-primary"
          style={{
            width: isHovering ? '12px' : '8px',
            height: isHovering ? '12px' : '8px',
            boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
          }}
        />
      </motion.div>
      
      {/* Outer ring */}
      <motion.div
        className="pointer-events-none fixed z-[9998]"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: '-50%',
          y: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.8 : 1,
          opacity: isHovering ? 0.8 : 0.4,
        }}
        transition={{ duration: 0.2 }}
      >
        <div 
          className="rounded-full border-2 border-primary"
          style={{
            width: '32px',
            height: '32px',
          }}
        />
      </motion.div>
      
      {/* Trailing particles on hover */}
      {isHovering && (
        <motion.div
          className="pointer-events-none fixed z-[9997]"
          style={{
            left: cursorXSpring,
            top: cursorYSpring,
            x: '-50%',
            y: '-50%',
          }}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <div 
            className="rounded-full border border-primary/30"
            style={{
              width: '40px',
              height: '40px',
            }}
          />
        </motion.div>
      )}
    </>
  );
};
