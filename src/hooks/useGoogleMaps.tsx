import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PlaceDetails {
  name: string;
  rating: number;
  user_ratings_total: number;
  reviews: GoogleReview[];
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  formatted_phone_number?: string;
  website?: string;
}

interface GoogleReview {
  author_name: string;
  author_url: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export const useGoogleMaps = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApiKey = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('google-places', {
        body: { action: 'getApiKey' }
      });

      if (error) throw error;
      if (data.success) {
        setApiKey(data.apiKey);
      }
    } catch (err: any) {
      console.error('Failed to fetch API key:', err);
      setError(err.message);
    }
  };

  const fetchPlaceDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('google-places', {
        body: { action: 'getPlaceDetails' }
      });

      if (error) throw error;
      if (data.success) {
        setPlaceDetails(data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch place details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKey();
    fetchPlaceDetails();
  }, []);

  return { apiKey, placeDetails, loading, error, refetch: fetchPlaceDetails };
};

export type { PlaceDetails, GoogleReview };
