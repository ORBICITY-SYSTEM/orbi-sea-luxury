import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Google Analytics 4 integration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GoogleAnalytics = () => {
  const location = useLocation();
  const [measurementId, setMeasurementId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch GA4 Measurement ID from site_settings
  useEffect(() => {
    const fetchMeasurementId = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'google_analytics_id')
          .single();

        if (error) {
          console.error('Error fetching GA4 ID:', error);
          return;
        }

        if (data?.value) {
          setMeasurementId(data.value);
        }
      } catch (err) {
        console.error('Failed to fetch GA4 measurement ID:', err);
      }
    };

    fetchMeasurementId();
  }, []);

  // Load GA4 script when measurement ID is available
  useEffect(() => {
    if (!measurementId || isLoaded) return;

    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script1.async = true;
    document.head.appendChild(script1);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_path: location.pathname + location.search,
    });

    setIsLoaded(true);

    return () => {
      // Cleanup
      if (script1.parentNode) {
        document.head.removeChild(script1);
      }
    };
  }, [measurementId, location.pathname, location.search, isLoaded]);

  // Track page views on route change
  useEffect(() => {
    if (window.gtag && measurementId) {
      window.gtag('config', measurementId, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location, measurementId]);

  return null;
};

// Helper functions for tracking events
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Pre-defined event trackers for hotel website
export const trackBookingStart = (apartmentType: string) => {
  trackEvent('begin_checkout', {
    currency: 'USD',
    items: [{ item_name: apartmentType }],
  });
};

export const trackBookingComplete = (
  apartmentType: string,
  value: number,
  transactionId: string
) => {
  trackEvent('purchase', {
    transaction_id: transactionId,
    value,
    currency: 'USD',
    items: [{ item_name: apartmentType }],
  });
};

export const trackContactForm = () => {
  trackEvent('generate_lead', {
    currency: 'USD',
  });
};

export const trackPhoneClick = () => {
  trackEvent('contact', {
    method: 'phone',
  });
};

export const trackWhatsAppClick = () => {
  trackEvent('contact', {
    method: 'whatsapp',
  });
};

export const trackViewApartment = (apartmentType: string) => {
  trackEvent('view_item', {
    items: [{ item_name: apartmentType }],
  });
};
