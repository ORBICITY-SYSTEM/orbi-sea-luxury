import { supabase } from '@/integrations/supabase/client';

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

// Declare global dataLayer type
declare global {
  interface Window {
    dataLayer: any[];
  }
}