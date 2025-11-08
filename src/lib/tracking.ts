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

// Track view item (apartment/room view)
export const trackViewItem = (item: {
  item_id: string;
  item_name: string;
  item_category?: string;
  price?: number;
  currency?: string;
}) => {
  trackConversion('ViewContent', {
    content_name: item.item_name,
    content_type: 'product',
    value: item.price,
    currency: item.currency || 'USD',
  });
  
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'view_item',
      ecommerce: {
        items: [{
          item_id: item.item_id,
          item_name: item.item_name,
          item_category: item.item_category || 'apartment',
          price: item.price,
          currency: item.currency || 'USD',
        }]
      }
    });
  }
};

// Track initiate checkout
export const trackInitiateCheckout = (
  value?: number, 
  currency = 'USD',
  items?: Array<{
    item_id: string;
    item_name: string;
    item_category?: string;
    price?: number;
    quantity?: number;
  }>
) => {
  trackConversion('InitiateCheckout', {
    value,
    currency,
    content_type: 'product',
  });
  
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'begin_checkout',
      ecommerce: {
        value,
        currency,
        items: items || []
      }
    });
  }
};

// Track purchase
export const trackPurchase = (
  transactionId: string,
  value: number,
  currency = 'USD',
  items?: Array<{
    item_id: string;
    item_name: string;
    item_category?: string;
    price?: number;
    quantity?: number;
  }>
) => {
  trackConversion('Purchase', {
    value,
    currency,
    num_items: items?.length || 1,
  });
  
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'purchase',
      ecommerce: {
        transaction_id: transactionId,
        value,
        currency,
        items: items || []
      }
    });
  }
};

// Track lead
export const trackLead = (leadData?: {
  content_name?: string;
  form_id?: string;
  form_name?: string;
  value?: number;
  currency?: string;
}) => {
  trackConversion('Lead', {
    content_name: leadData?.content_name,
    value: leadData?.value,
    currency: leadData?.currency,
  });
  
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'generate_lead',
      form_id: leadData?.form_id || 'contact_form',
      form_name: leadData?.form_name || 'Contact Form',
      content_name: leadData?.content_name,
      value: leadData?.value,
      currency: leadData?.currency || 'USD',
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