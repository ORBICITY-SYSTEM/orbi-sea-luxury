import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Google Tag Manager integration
declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const GoogleTagManager = () => {
  const location = useLocation();
  const [containerId, setContainerId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch GTM Container ID from site_settings
  useEffect(() => {
    const fetchContainerId = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'gtm_container_id')
          .single();

        if (error) {
          console.log('GTM Container ID not found in settings');
          return;
        }

        if (data?.value) {
          setContainerId(data.value);
        }
      } catch (err) {
        console.error('Failed to fetch GTM container ID:', err);
      }
    };

    fetchContainerId();
  }, []);

  // Load GTM script when container ID is available
  useEffect(() => {
    if (!containerId || isLoaded) return;

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });

    // Load GTM script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${containerId}`;
    document.head.appendChild(script);

    // Add noscript iframe
    const noscript = document.createElement('noscript');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${containerId}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    noscript.appendChild(iframe);
    document.body.insertBefore(noscript, document.body.firstChild);

    setIsLoaded(true);
    console.log('GTM initialized:', containerId);

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, [containerId, isLoaded]);

  // Push page view event on route change
  useEffect(() => {
    if (isLoaded && window.dataLayer) {
      window.dataLayer.push({
        event: 'pageview',
        page: location.pathname + location.search,
      });
    }
  }, [location, isLoaded]);

  return null;
};

// Helper function to push events to dataLayer
export const pushToDataLayer = (event: string, data?: Record<string, any>) => {
  if (window.dataLayer) {
    window.dataLayer.push({
      event,
      ...data,
    });
  }
};

// Pre-defined GTM events
export const gtmTrackBooking = (apartmentType: string, value: number, transactionId: string) => {
  pushToDataLayer('purchase', {
    ecommerce: {
      transaction_id: transactionId,
      value,
      currency: 'GEL',
      items: [{ item_name: apartmentType }],
    },
  });
};

export const gtmTrackLead = (formName: string) => {
  pushToDataLayer('generate_lead', {
    form_name: formName,
  });
};

export const gtmTrackViewItem = (apartmentType: string, price: number) => {
  pushToDataLayer('view_item', {
    ecommerce: {
      items: [{ item_name: apartmentType, price, currency: 'GEL' }],
    },
  });
};

export default GoogleTagManager;
