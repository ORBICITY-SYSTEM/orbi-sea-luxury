/**
 * Critical CSS component for Core Web Vitals optimization
 * Inlines critical styles to reduce render-blocking CSS
 */
export const CriticalCSS = () => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          /* Critical CSS for LCP optimization */
          html, body, #root {
            margin: 0;
            padding: 0;
            min-height: 100vh;
          }
          
          /* Prevent CLS with font-display */
          @font-face {
            font-display: swap;
          }
          
          /* Reserve space for hero section to prevent CLS */
          .hero-section {
            min-height: 100vh;
            min-height: 100dvh;
          }
          
          /* Skeleton placeholder styles */
          .skeleton-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          /* Reduce layout shifts for images */
          img {
            max-width: 100%;
            height: auto;
          }
          
          /* Optimize text rendering */
          body {
            text-rendering: optimizeSpeed;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `,
      }}
    />
  );
};
