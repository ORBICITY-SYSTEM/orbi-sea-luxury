import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ImageSource {
  src: string;
  width: number;
}

interface ResponsiveImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string;
  alt: string;
  sources?: ImageSource[];
  webpSrc?: string;
  avifSrc?: string;
  priority?: boolean;
  fallback?: string;
  aspectRatio?: number;
  sizes?: string;
  onImageLoad?: () => void;
}

/**
 * ResponsiveImage Component
 * 
 * Optimized image component with:
 * - WebP/AVIF format support via <picture> element
 * - Responsive srcset for different screen sizes
 * - Lazy loading with IntersectionObserver
 * - Priority loading for LCP images
 * - Aspect ratio to prevent CLS
 * - Blur placeholder support
 */
export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  sources = [],
  webpSrc,
  avifSrc,
  priority = false,
  fallback = '/placeholder.svg',
  aspectRatio,
  sizes = '100vw',
  className,
  style,
  onImageLoad,
  width,
  height,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px',
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onImageLoad?.();
  };

  const handleError = () => {
    setHasError(true);
  };

  // Generate srcset from sources
  const generateSrcSet = (imageSources: ImageSource[]): string => {
    if (imageSources.length === 0) return '';
    return imageSources.map(({ src, width }) => `${src} ${width}w`).join(', ');
  };

  // Generate WebP srcset if webpSrc provided
  const generateWebPSrcSet = (): string => {
    if (!webpSrc || sources.length === 0) return webpSrc || '';
    // Assume webpSrc follows same naming pattern
    return sources
      .map(({ src, width }) => {
        const webpVersion = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        return `${webpVersion} ${width}w`;
      })
      .join(', ');
  };

  // Generate AVIF srcset if avifSrc provided
  const generateAVIFSrcSet = (): string => {
    if (!avifSrc || sources.length === 0) return avifSrc || '';
    return sources
      .map(({ src, width }) => {
        const avifVersion = src.replace(/\.(jpg|jpeg|png)$/i, '.avif');
        return `${avifVersion} ${width}w`;
      })
      .join(', ');
  };

  const srcSet = generateSrcSet(sources);
  const computedAspectRatio = aspectRatio || (width && height ? Number(width) / Number(height) : undefined);

  const imageStyle: React.CSSProperties = {
    ...style,
    aspectRatio: computedAspectRatio,
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    backgroundColor: 'hsl(var(--muted))',
    aspectRatio: computedAspectRatio,
    overflow: 'hidden',
  };

  return (
    <div style={containerStyle} className={cn('responsive-image-container', className)}>
      {/* Blur placeholder */}
      {!isLoaded && (
        <div
          className="absolute inset-0 animate-pulse bg-muted"
          style={{ aspectRatio: computedAspectRatio }}
        />
      )}
      
      <picture>
        {/* AVIF source - best compression, modern browsers */}
        {avifSrc && isInView && (
          <source
            type="image/avif"
            srcSet={sources.length > 0 ? generateAVIFSrcSet() : avifSrc}
            sizes={sizes}
          />
        )}
        
        {/* WebP source - good compression, wide support */}
        {webpSrc && isInView && (
          <source
            type="image/webp"
            srcSet={sources.length > 0 ? generateWebPSrcSet() : webpSrc}
            sizes={sizes}
          />
        )}
        
        {/* Original format with srcset */}
        {srcSet && isInView && (
          <source
            srcSet={srcSet}
            sizes={sizes}
          />
        )}
        
        {/* Fallback img element */}
        <img
          ref={imgRef}
          src={hasError ? fallback : (isInView ? src : fallback)}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          style={imageStyle}
          className={cn(
            'w-full h-full object-cover',
            !isLoaded && 'invisible'
          )}
          {...props}
        />
      </picture>
    </div>
  );
};

export default ResponsiveImage;
