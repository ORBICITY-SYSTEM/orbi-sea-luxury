import { supabase } from '@/integrations/supabase/client';

// Initialize Meta Pixel dynamically
export const initializeMetaPixel = async () => {
  try {
    const { data: settings } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['meta_pixel_id']);
    
    const pixelId = settings?.find(s => s.key === 'meta_pixel_id')?.value;
    
    if (!pixelId) {
      console.warn('Meta Pixel ID not configured');
      return;
    }

    // Load Meta Pixel script
    if (!window.fbq) {
      const script = document.createElement('script');
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);

      // Add noscript fallback
      const noscript = document.createElement('noscript');
      noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />`;
      document.body.appendChild(noscript);
    }
  } catch (error) {
    console.error('Failed to initialize Meta Pixel:', error);
  }
};

// Get Facebook browser cookies
const getFacebookCookies = () => {
  const cookies = document.cookie.split(';');
  let fbp = '';
  let fbc = '';
  
  cookies.forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name === '_fbp') fbp = value;
    if (name === '_fbc') fbc = value;
  });
  
  return { fbp, fbc };
};

// Track conversion event via Meta Conversions API
export const trackConversion = async (
  eventName: string,
  customData?: {
    currency?: string;
    value?: number;
    content_name?: string;
    content_type?: string;
    num_items?: number;
  }
) => {
  try {
    const { fbp, fbc } = getFacebookCookies();
    
    const { data, error } = await supabase.functions.invoke('track-conversion', {
      body: {
        event_name: eventName,
        event_data: {
          source_url: window.location.href,
          custom_data: customData,
        },
        user_data: {
          user_agent: navigator.userAgent,
          fbp,
          fbc,
        },
      },
    });

    if (error) {
      console.error('Conversion tracking error:', error);
    }
    
    return data;
  } catch (error) {
    console.error('Failed to track conversion:', error);
  }
};

// Track page view
export const trackPageView = () => {
  trackConversion('PageView');
  
  // Also send to GTM dataLayer
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'page_view',
      page_path: window.location.pathname,
      page_title: document.title,
    });
  }
};

// Track initiate checkout
export const trackInitiateCheckout = (value?: number, currency = 'USD') => {
  trackConversion('InitiateCheckout', {
    value,
    currency,
    content_type: 'product',
  });
  
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'begin_checkout',
      value,
      currency,
    });
  }
};

// Track purchase
export const trackPurchase = (value: number, currency = 'USD', numItems = 1) => {
  trackConversion('Purchase', {
    value,
    currency,
    num_items: numItems,
  });
  
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'purchase',
      value,
      currency,
      items: numItems,
    });
  }
};

// Track lead
export const trackLead = (contentName?: string) => {
  trackConversion('Lead', {
    content_name: contentName,
  });
  
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'generate_lead',
      content_name: contentName,
    });
  }
};

// Declare global types
declare global {
  interface Window {
    dataLayer: any[];
    fbq: any;
    _fbq: any;
  }
}