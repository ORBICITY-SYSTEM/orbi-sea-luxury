import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    Tawk_API?: {
      toggle: () => void;
      maximize: () => void;
      minimize: () => void;
      showWidget: () => void;
      hideWidget: () => void;
      popup: () => void;
      onLoad?: () => void;
    };
    Tawk_LoadStart?: Date;
  }
}

export const TawkTo = () => {
  const [tawkId, setTawkId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch Tawk.to ID from site_settings
  useEffect(() => {
    const fetchTawkId = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'tawk_to_id')
          .single();

        if (error) {
          console.log('Tawk.to ID not found in settings');
          return;
        }

        if (data?.value) {
          setTawkId(data.value);
        }
      } catch (error) {
        console.error('Error fetching Tawk.to ID:', error);
      }
    };

    fetchTawkId();
  }, []);

  // Load Tawk.to script when ID is available
  useEffect(() => {
    if (!tawkId || isLoaded) return;

    // Initialize Tawk.to
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Load the script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://embed.tawk.to/${tawkId}/default`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    script.onload = () => {
      setIsLoaded(true);
      console.log('Tawk.to initialized:', tawkId);
    };

    document.head.appendChild(script);

    // Cleanup
    return () => {
      const existingScript = document.querySelector(`script[src*="embed.tawk.to"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [tawkId, isLoaded]);

  return null;
};

// Helper functions for controlling Tawk.to widget
export const showTawkChat = () => {
  if (window.Tawk_API?.showWidget) {
    window.Tawk_API.showWidget();
  }
};

export const hideTawkChat = () => {
  if (window.Tawk_API?.hideWidget) {
    window.Tawk_API.hideWidget();
  }
};

export const toggleTawkChat = () => {
  if (window.Tawk_API?.toggle) {
    window.Tawk_API.toggle();
  }
};

export const maximizeTawkChat = () => {
  if (window.Tawk_API?.maximize) {
    window.Tawk_API.maximize();
  }
};

export default TawkTo;
