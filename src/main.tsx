import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App.tsx";
import "./index.css";
import { initializeMetaPixel } from "./lib/tracking";

// Initialize Meta Pixel - deferred for FID optimization
requestIdleCallback(() => {
  initializeMetaPixel();
}, { timeout: 2000 });

// Preload critical fonts for LCP optimization
const preloadFonts = () => {
  const fontLinks = [
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
  ];
  
  fontLinks.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });
};

preloadFonts();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
