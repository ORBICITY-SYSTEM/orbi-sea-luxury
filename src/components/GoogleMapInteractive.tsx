import { useEffect, useRef, useState, useMemo } from 'react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { usePlaceId } from '@/hooks/usePlaceId';
import { Skeleton } from '@/components/ui/skeleton';
import { Navigation, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GoogleMapInteractiveProps {
  className?: string;
}

// Fallback coordinates - Batumi (will be overridden by Place details when available)
const FALLBACK_LOCATION = {
  lat: 41.6399416,
  lng: 41.6141119
};

// Default Place ID if not set in database
const DEFAULT_PLACE_ID = 'ChIJxf79LQmHZ0ARpmv2Eih-1WE';

// Create custom marker content element
const createMarkerContent = () => {
  const container = document.createElement('div');
  container.className = 'custom-marker-container';
  container.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
    ">
      <div style="
        background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
        color: white;
        padding: 8px 12px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 12px;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 6px;
        box-shadow: 0 4px 12px rgba(13, 148, 136, 0.4);
        animation: pulse-marker 2s infinite;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        Orbi City
      </div>
      <div style="
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid #14b8a6;
        margin-top: -1px;
      "></div>
      <div style="
        width: 8px;
        height: 8px;
        background: #0d9488;
        border-radius: 50%;
        margin-top: 4px;
        animation: bounce-dot 1s infinite;
      "></div>
    </div>
  `;
  
  // Add keyframe animations
  if (!document.getElementById('marker-animations')) {
    const style = document.createElement('style');
    style.id = 'marker-animations';
    style.textContent = `
      @keyframes pulse-marker {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      @keyframes bounce-dot {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
      }
    `;
    document.head.appendChild(style);
  }
  
  return container;
};

export const GoogleMapInteractive = ({ className }: GoogleMapInteractiveProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | google.maps.Marker | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const { apiKey, placeDetails, loading } = useGoogleMaps();
  const { placeId } = usePlaceId();

  // Use API coordinates if available, otherwise fallback
  const location = useMemo(() => {
    if (placeDetails?.geometry?.location) {
      return {
        lat: placeDetails.geometry.location.lat,
        lng: placeDetails.geometry.location.lng
      };
    }
    return FALLBACK_LOCATION;
  }, [placeDetails]);

  // Load Google Maps script with marker library
  useEffect(() => {
    if (!apiKey || scriptLoaded || scriptError) return;

    let pollId: number | undefined;
    let timeoutId: number | undefined;

    const startPoll = () => {
      // Poll for google.maps presence (covers cases where script tag exists but load event already fired)
      pollId = window.setInterval(() => {
        if (window.google?.maps) {
          if (pollId) window.clearInterval(pollId);
          if (timeoutId) window.clearTimeout(timeoutId);
          setScriptLoaded(true);
        }
      }, 200);

      timeoutId = window.setTimeout(() => {
        if (pollId) window.clearInterval(pollId);
        if (!window.google?.maps) setScriptError(true);
      }, 6000);
    };

    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (window.google?.maps) {
        setScriptLoaded(true);
        return;
      }

      const onLoad = () => setScriptLoaded(true);
      const onError = () => setScriptError(true);

      existingScript.addEventListener('load', onLoad, { once: true });
      existingScript.addEventListener('error', onError, { once: true });
      startPoll();

      return () => {
        existingScript.removeEventListener('load', onLoad);
        existingScript.removeEventListener('error', onError);
        if (pollId) window.clearInterval(pollId);
        if (timeoutId) window.clearTimeout(timeoutId);
      };
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setScriptError(true);
    document.head.appendChild(script);
    startPoll();

    return () => {
      if (pollId) window.clearInterval(pollId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [apiKey, scriptLoaded, scriptError]);

  // Initialize map after script loads
  useEffect(() => {
    if (!scriptLoaded || !mapRef.current || mapLoaded || !window.google) return;

    const initMap = async () => {
      try {
        // Create map with mapId for AdvancedMarkerElement support
        const mapInstance = new window.google.maps.Map(mapRef.current!, {
          center: location,
          zoom: 16,
          mapId: 'ORBI_CITY_MAP', // Required for AdvancedMarkerElement
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
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ lightness: 50 }]
            }
          ],
          mapTypeControl: false,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: 'cooperative'
        });

        mapInstanceRef.current = mapInstance;

        // Wait for the map to be idle before adding marker
        await new Promise<void>((resolve) => {
          google.maps.event.addListenerOnce(mapInstance, 'idle', () => resolve());
        });

        // Create info window with business name and address (no rating, no coordinates)
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; max-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
              <h3 style="margin: 0 0 10px; font-weight: 700; color: #1a1a1a; font-size: 16px;">
                🏨 Orbi City Sea View Aparthotel
              </h3>
              <p style="margin: 0 0 12px; color: #555; font-size: 13px; line-height: 1.5;">
                ${placeDetails?.formatted_address || '7B Sherif Khimshiashvili St, Batumi 6010, Georgia'}
              </p>
              ${placeDetails?.formatted_phone_number ? `
                <p style="margin: 0 0 12px; color: #555; font-size: 13px;">
                  📞 ${placeDetails.formatted_phone_number}
                </p>
              ` : ''}
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <a href="https://maps.google.com/maps?daddr=${location.lat},${location.lng}" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   style="
                     display: inline-flex;
                     align-items: center;
                     gap: 6px;
                     color: white;
                     background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                     text-decoration: none;
                     font-weight: 600;
                     padding: 8px 14px;
                     border-radius: 8px;
                     font-size: 12px;
                   ">
                  🧭 Directions
                </a>
                <a href="https://www.google.com/maps/place/?q=place_id:${placeId}" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   style="
                     display: inline-flex;
                     align-items: center;
                     gap: 6px;
                     color: #0d9488;
                     background: white;
                     border: 1.5px solid #0d9488;
                     text-decoration: none;
                     font-weight: 600;
                     padding: 8px 14px;
                     border-radius: 8px;
                     font-size: 12px;
                   ">
                  📍 View on Google
                </a>
              </div>
            </div>
          `,
          maxWidth: 320
        });

        infoWindowRef.current = infoWindow;

        // Try to use AdvancedMarkerElement (modern), fallback to Marker (legacy)
        if (window.google.maps.marker?.AdvancedMarkerElement) {
          const markerContent = createMarkerContent();
          
          const advancedMarker = new window.google.maps.marker.AdvancedMarkerElement({
            map: mapInstance,
            position: location,
            content: markerContent,
            title: 'Orbi City Sea View Aparthotel',
            gmpClickable: true
          });

          advancedMarker.addListener('click', () => {
            infoWindow.close();
            infoWindow.open({
              anchor: advancedMarker,
              map: mapInstance
            });
          });

          markerRef.current = advancedMarker;

          // Open info window by default after a short delay
          setTimeout(() => {
            infoWindow.open({
              anchor: advancedMarker,
              map: mapInstance
            });
          }, 500);

        } else {
          // Fallback to legacy Marker
          const legacyMarker = new window.google.maps.Marker({
            position: location,
            map: mapInstance,
            title: 'Orbi City Sea View Aparthotel',
            animation: window.google.maps.Animation.DROP,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: '#0d9488',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3
            }
          });

          legacyMarker.addListener('click', () => {
            infoWindow.open(mapInstance, legacyMarker);
          });

          markerRef.current = legacyMarker;

          // Open info window by default
          setTimeout(() => {
            infoWindow.open(mapInstance, legacyMarker);
          }, 500);
        }

        setMapLoaded(true);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    // Small delay to ensure Google Maps API is fully loaded
    setTimeout(initMap, 100);
  }, [scriptLoaded, placeDetails, mapLoaded, location]);

  const openDirections = () => {
    const url = `https://maps.google.com/maps?daddr=${location.lat},${location.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openInGoogleMaps = () => {
    // Open your specific Google Business page via Place ID
    const url = `https://www.google.com/maps/place/?q=place_id:${placeId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!apiKey || scriptError) {
    // No API key available or Maps JS failed to load (often due to key restrictions) → fallback to embed
    return (
      <div className={className}>
        <iframe
          className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden"
          src={`https://www.google.com/maps?q=${FALLBACK_LOCATION.lat},${FALLBACK_LOCATION.lng}&z=16&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Orbi City Sea View Aparthotel in Batumi Map"
        />
      </div>
    );
  }

  if (loading || !scriptLoaded) {
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
          className="flex-1 bg-teal-500 hover:bg-teal-600 text-white gap-2 shadow-lg"
        >
          <Navigation className="w-4 h-4" />
          Get Directions
        </Button>
        <Button 
          onClick={openInGoogleMaps}
          variant="outline"
          className="bg-white/95 hover:bg-white gap-2 shadow-lg border-teal-200"
        >
          <ExternalLink className="w-4 h-4" />
          View Larger Map
        </Button>
      </div>
    </div>
  );
};
