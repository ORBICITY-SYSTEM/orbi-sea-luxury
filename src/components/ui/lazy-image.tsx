import { useState, useRef, useEffect, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  blurPlaceholder?: boolean;
}

export const LazyImage = ({ 
  src, 
  alt, 
  className, 
  fallback = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%23f3f4f6"%3E%3C/svg%3E',
  blurPlaceholder = true,
  ...props 
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <img
      ref={imgRef}
      src={isInView && !hasError ? src : fallback}
      alt={alt}
      onLoad={handleLoad}
      onError={handleError}
      className={cn(
        'transition-all duration-500',
        blurPlaceholder && !isLoaded && 'blur-sm scale-105',
        isLoaded && 'blur-0 scale-100',
        className
      )}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};
