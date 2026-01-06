/**
 * Image Optimization Utilities
 * 
 * Provides utilities for generating optimized image URLs,
 * srcsets, and format detection.
 */

export interface ImageBreakpoint {
  width: number;
  suffix?: string;
}

// Standard breakpoints for responsive images
export const DEFAULT_BREAKPOINTS: ImageBreakpoint[] = [
  { width: 320, suffix: '-sm' },
  { width: 640, suffix: '-md' },
  { width: 768, suffix: '-lg' },
  { width: 1024, suffix: '-xl' },
  { width: 1280, suffix: '-2xl' },
  { width: 1920, suffix: '-full' },
];

// Check browser support for modern image formats
export const supportsWebP = (): boolean => {
  if (typeof document === 'undefined') return false;
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

export const supportsAVIF = (): boolean => {
  if (typeof document === 'undefined') return false;
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
};

// Generate srcset string from base URL
export const generateSrcSet = (
  baseUrl: string,
  breakpoints: ImageBreakpoint[] = DEFAULT_BREAKPOINTS
): string => {
  return breakpoints
    .map(({ width, suffix }) => {
      const url = suffix
        ? baseUrl.replace(/(\.[^.]+)$/, `${suffix}$1`)
        : `${baseUrl}?w=${width}`;
      return `${url} ${width}w`;
    })
    .join(', ');
};

// Generate WebP version URL
export const toWebP = (url: string): string => {
  return url.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
};

// Generate AVIF version URL
export const toAVIF = (url: string): string => {
  return url.replace(/\.(jpg|jpeg|png|gif)$/i, '.avif');
};

// Get optimal image format based on browser support
export const getOptimalFormat = (): 'avif' | 'webp' | 'original' => {
  if (supportsAVIF()) return 'avif';
  if (supportsWebP()) return 'webp';
  return 'original';
};

// Generate sizes attribute based on layout
export const generateSizes = (layout: 'full' | 'half' | 'third' | 'quarter' | 'hero'): string => {
  switch (layout) {
    case 'full':
      return '100vw';
    case 'half':
      return '(max-width: 768px) 100vw, 50vw';
    case 'third':
      return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
    case 'quarter':
      return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw';
    case 'hero':
      return '100vw';
    default:
      return '100vw';
  }
};

// Preload critical images
export const preloadImage = (src: string, options?: { as?: string; type?: string }): void => {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = options?.as || 'image';
  link.href = src;
  
  if (options?.type) {
    link.type = options.type;
  }
  
  document.head.appendChild(link);
};

// Preload multiple images
export const preloadImages = (srcs: string[]): void => {
  srcs.forEach(src => preloadImage(src));
};

// Calculate aspect ratio from dimensions
export const calculateAspectRatio = (width: number, height: number): number => {
  return width / height;
};

// Get blur data URL placeholder
export const getBlurDataURL = (width = 10, height = 10): string => {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <filter id="b" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="20"/>
      </filter>
      <rect width="100%" height="100%" fill="#e5e5e5" filter="url(#b)"/>
    </svg>`
  )}`;
};

// Image loader for Supabase Storage
export const supabaseImageLoader = (
  bucketUrl: string,
  path: string,
  options?: { width?: number; quality?: number }
): string => {
  const params = new URLSearchParams();
  if (options?.width) params.set('width', String(options.width));
  if (options?.quality) params.set('quality', String(options.quality));
  
  const queryString = params.toString();
  return `${bucketUrl}/${path}${queryString ? `?${queryString}` : ''}`;
};

// Check if image is in viewport
export const isImageInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

export default {
  generateSrcSet,
  toWebP,
  toAVIF,
  getOptimalFormat,
  generateSizes,
  preloadImage,
  preloadImages,
  calculateAspectRatio,
  getBlurDataURL,
  supabaseImageLoader,
  isImageInViewport,
  supportsWebP,
  supportsAVIF,
  DEFAULT_BREAKPOINTS,
};
