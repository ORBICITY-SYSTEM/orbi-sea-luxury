import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SEO } from './SEO';
import { GoldCursor } from './GoldCursor';
import { ScrollProgressIndicator } from './ScrollAnimations';
import { PageTransition } from './PageTransition';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO />
      <GoldCursor />
      <ScrollProgressIndicator />
      <Navigation />
      <main className="flex-1">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
};
