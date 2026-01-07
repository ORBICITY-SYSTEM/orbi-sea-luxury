import { motion } from 'framer-motion';
import { Link, LinkProps } from 'react-router-dom';
import { ReactNode } from 'react';

interface AnimatedLinkProps extends Omit<LinkProps, 'className'> {
  children: ReactNode;
  className?: string;
}

export const AnimatedLink = ({ children, className = '', ...props }: AnimatedLinkProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Link className={className} {...props}>
        {children}
      </Link>
    </motion.div>
  );
};

// Shared element transition link for cards
interface SharedElementLinkProps extends Omit<LinkProps, 'className'> {
  children: ReactNode;
  className?: string;
  layoutId: string;
}

export const SharedElementLink = ({ 
  children, 
  className = '', 
  layoutId,
  ...props 
}: SharedElementLinkProps) => {
  return (
    <Link className={className} {...props}>
      <motion.div
        layoutId={layoutId}
        transition={{ 
          type: 'spring', 
          stiffness: 350, 
          damping: 30 
        }}
      >
        {children}
      </motion.div>
    </Link>
  );
};

// Text reveal animation on hover
interface TextRevealLinkProps extends Omit<LinkProps, 'className'> {
  children: string;
  className?: string;
}

export const TextRevealLink = ({ children, className = '', ...props }: TextRevealLinkProps) => {
  return (
    <Link className={`group relative overflow-hidden inline-block ${className}`} {...props}>
      <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
        {children}
      </span>
      <span className="absolute left-0 top-0 inline-block translate-y-full text-primary transition-transform duration-300 group-hover:translate-y-0">
        {children}
      </span>
    </Link>
  );
};
