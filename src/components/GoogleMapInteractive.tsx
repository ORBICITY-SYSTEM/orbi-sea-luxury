import { useEffect, useRef, useState, useCallback } from 'react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { Skeleton } from '@/components/ui/skeleton';
import { Navigation, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GoogleMapInteractiveProps {
  className?: string;
}

// Orbi City Batumi coordinates - 7B Sherif Khimshiashvili Str
const ORBI_CITY_LOCATION = {
  lat: 41.6415,
  lng: 41.6367
};

export const GoogleMapInteractive = ({ className }: GoogleMapInteractiveProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { apiKey, placeDetails, loading } = useGoogleMaps();

  // Load Google Maps script
  useEffect(() => {
    if (!apiKey || scriptLoaded) return;

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker`;
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, [apiKey, scriptLoaded]);

  // Initialize map after script loads
  useEffect(() => {
    if (!scriptLoaded || !mapRef.current || mapLoaded || !window.google) return;

    const initMap = () => {
      try {
        const mapInstance = new window.google.maps.Map(mapRef.current!, {
          center: ORBI_CITY_LOCATION,
          zoom: 16,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#a2daf2' }]
            }
          ],
          mapTypeControl: false,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true
        });

        // Add marker for Orbi City
        const marker = new window.google.maps.Marker({
          position: ORBI_CITY_LOCATION,
          map: mapInstance,
          title: 'Orbi City Sea View Aparthotel',
          animation: window.google.maps.Animation.DROP
        });

        // Info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 250px;">
              <h3 style="margin: 0 0 8px; font-weight: bold; color: #1a1a1a;">
                Orbi City Sea View Aparthotel
              </h3>
              <p style="margin: 0 0 8px; color: #666; font-size: 14px;">
                ${placeDetails?.formatted_address || '7B Sherif Khimshiashvili Str, Orbi City, Batumi'}
              </p>
              ${placeDetails?.rating ? `
                <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
                  <span style="color: #f59e0b;">★</span>
                  <span style="font-weight: bold;">${placeDetails.rating}</span>
                  <span style="color: #666; font-size: 12px;">(${placeDetails.user_ratings_total} reviews)</span>
                </div>
              ` : ''}
              <a href="https://maps.google.com/maps?daddr=${ORBI_CITY_LOCATION.lat},${ORBI_CITY_LOCATION.lng}" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 style="color: #0d9488; text-decoration: none; font-weight: 500;">
                Get Directions →
              </a>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstance, marker);
        });

        // Open info window by default
        infoWindow.open(mapInstance, marker);

        setMapLoaded(true);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    // Small delay to ensure Google Maps API is fully loaded
    setTimeout(initMap, 100);
  }, [scriptLoaded, placeDetails, mapLoaded]);

  const openDirections = () => {
    // Use maps.google.com instead of www.google.com/maps for better compatibility
    const url = `https://maps.google.com/maps?daddr=${ORBI_CITY_LOCATION.lat},${ORBI_CITY_LOCATION.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openInGoogleMaps = () => {
    // Use maps.google.com for better compatibility with iframe restrictions
    const url = `https://maps.google.com/maps?q=${ORBI_CITY_LOCATION.lat},${ORBI_CITY_LOCATION.lng}&z=17`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading || !apiKey) {
    return (
      <div className={className}>
        <Skeleton className="w-full h-full min-h-[400px] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden"
      />
      
      {/* Action buttons overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex gap-2">
        <Button 
          onClick={openDirections}
          className="flex-1 bg-teal-500 hover:bg-teal-600 text-white gap-2"
        >
          <Navigation className="w-4 h-4" />
          Get Directions
        </Button>
        <Button 
          onClick={openInGoogleMaps}
          variant="outline"
          className="bg-white/90 hover:bg-white gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          View Larger Map
        </Button>
      </div>
    </div>
  );
};
