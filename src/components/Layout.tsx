import { ReactNode, useEffect, useState } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SEO } from './SEO';
import { GoldCursor } from './GoldCursor';
import { ScrollProgressIndicator } from './ScrollAnimations';
import { PageTransition } from './PageTransition';

interface LayoutProps {
  children: ReactNode;
}

// Check if device is mobile/tablet
const getIsMobile = () => {
  if (typeof window === 'undefined') return true;
  return window.innerWidth < 1024 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

export const Layout = ({ children }: LayoutProps) => {
  const [isMobile, setIsMobile] = useState(true); // Default to mobile for SSR safety

  useEffect(() => {
    const checkMobile = () => setIsMobile(getIsMobile());
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO />
      {/* GoldCursor ONLY on desktop - causes issues on mobile */}
      {!isMobile && <GoldCursor />}
      {/* ScrollProgress ONLY on desktop for performance */}
      {!isMobile && <ScrollProgressIndicator />}
      <Navigation />
      <main className="flex-1">
        {/* Skip PageTransition on mobile for performance */}
        {isMobile ? children : (
          <PageTransition>
            {children}
          </PageTransition>
        )}
      </main>
      <Footer />
    </div>
  );
};
