import { Helmet } from 'react-helmet-async';
import { useSEO } from '@/hooks/useSEO';

export const StructuredData = () => {
  const { globalSettings } = useSEO('/');

  const companyName = globalSettings?.company_legal_name || 'Orbi City Batumi LLC';
  const siteName = globalSettings?.site_name || 'Orbi City Batumi';
  const address = globalSettings?.contact_address || 'Sheriff Khimshiashvili Street 7B, Batumi, Georgia';
  const phone = globalSettings?.contact_phone || '+995555199090';
  const email = globalSettings?.contact_email || 'info@orbicitybatumi.com';

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": companyName,
    "alternateName": siteName,
    "url": "https://orbicitybatumi.com",
    "logo": "https://orbicitybatumi.com/logo.jpg",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": phone,
      "contactType": "customer service",
      "email": email,
      "availableLanguage": ["en", "ka", "ru"]
    },
    "sameAs": [
      globalSettings?.facebook_url || "https://facebook.com/orbicitybatumi",
      globalSettings?.instagram_url || "https://instagram.com/orbicitybatumi",
      globalSettings?.youtube_url || "https://youtube.com/@orbicitybatumi"
    ]
  };

  // LocalBusiness / Hotel Schema
  const hotelSchema = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": siteName,
    "image": "https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/a0d87736a9a433465e412befdeca2b5d.jpg",
    "description": "Luxury apartments with stunning sea views in Orbi City Batumi. Modern amenities, prime seafront location, and exceptional hospitality.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sheriff Khimshiashvili Street 7B",
      "addressLocality": "Batumi",
      "addressRegion": "Adjara",
      "postalCode": "6010",
      "addressCountry": "GE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 41.642883,
      "longitude": 41.644944
    },
    "telephone": phone,
    "email": email,
    "url": "https://orbicitybatumi.com",
    "priceRange": "$$",
    "starRating": {
      "@type": "Rating",
      "ratingValue": "5",
      "bestRating": "5"
    },
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": "Sea View", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "WiFi", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Pool", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Spa", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Fitness Center", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Restaurant", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Parking", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Air Conditioning", "value": true }
    ],
    "checkinTime": "14:00",
    "checkoutTime": "12:00",
    "petsAllowed": false,
    "smokingAllowed": false
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://orbicitybatumi.com"
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(hotelSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};
