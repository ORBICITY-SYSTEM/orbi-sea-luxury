import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

export const MetaPixel = () => {
  const [pixelId, setPixelId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();

  // Fetch Meta Pixel ID from site_settings
  useEffect(() => {
    const fetchPixelId = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'meta_pixel_id')
          .single();
        
        if (error) {
          console.log('Meta Pixel ID not found in settings');
          return;
        }
        
        if (data?.value) {
          setPixelId(data.value);
        }
      } catch (error) {
        console.error('Error fetching Meta Pixel ID:', error);
      }
    };

    fetchPixelId();
  }, []);

  // Load Meta Pixel script when pixelId is available
  useEffect(() => {
    if (!pixelId || isLoaded) return;

    // Initialize fbq
    const initFbq = () => {
      if ((window as any).fbq) return;

      const n: any = ((window as any).fbq = function (...args: any[]) {
        n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
      });
      
      if (!(window as any)._fbq) (window as any)._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
    };

    initFbq();

    // Load the script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);

    script.onload = () => {
      (window as any).fbq('init', pixelId);
      (window as any).fbq('track', 'PageView');
      setIsLoaded(true);
      console.log('Meta Pixel initialized:', pixelId);
    };

    // Cleanup
    return () => {
      const existingScript = document.querySelector('script[src="https://connect.facebook.net/en_US/fbevents.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [pixelId, isLoaded]);

  // Track page views on route change
  useEffect(() => {
    if (isLoaded && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
  }, [location.pathname, isLoaded]);

  return null;
};

// Helper functions for tracking events
export const trackMetaEvent = (eventName: string, parameters?: Record<string, any>) => {
  if ((window as any).fbq) {
    (window as any).fbq('track', eventName, parameters);
  }
};

export const trackMetaCustomEvent = (eventName: string, parameters?: Record<string, any>) => {
  if ((window as any).fbq) {
    (window as any).fbq('trackCustom', eventName, parameters);
  }
};

// Standard Meta Pixel events
export const trackMetaLead = () => {
  trackMetaEvent('Lead');
};

export const trackMetaContact = () => {
  trackMetaEvent('Contact');
};

export const trackMetaViewContent = (contentName: string, contentId: string) => {
  trackMetaEvent('ViewContent', {
    content_name: contentName,
    content_ids: [contentId],
    content_type: 'apartment'
  });
};

export const trackMetaInitiateCheckout = (value: number, currency: string = 'USD') => {
  trackMetaEvent('InitiateCheckout', {
    value,
    currency
  });
};

export const trackMetaPurchase = (value: number, currency: string = 'USD', transactionId?: string) => {
  trackMetaEvent('Purchase', {
    value,
    currency,
    ...(transactionId && { transaction_id: transactionId })
  });
};

export default MetaPixel;
