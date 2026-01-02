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

  // LocalBusiness / Hotel Schema (Enhanced)
  const hotelSchema = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": "https://orbicitybatumi.com/#hotel",
    "name": siteName,
    "image": [
      "https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/a0d87736a9a433465e412befdeca2b5d.jpg",
      "https://orbicitybatumi.com/images/lobby.jpg",
      "https://orbicitybatumi.com/images/room.jpg"
    ],
    "description": "Luxury 5-star apartments with stunning Black Sea views in Orbi City Batumi. Modern amenities, prime seafront location, infinity pool, spa, and exceptional Georgian hospitality.",
    "brand": {
      "@type": "Brand",
      "name": "Orbi City Batumi"
    },
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
    "currenciesAccepted": "GEL, USD, EUR",
    "paymentAccepted": "Cash, Credit Card, Debit Card",
    "starRating": {
      "@type": "Rating",
      "ratingValue": "5",
      "bestRating": "5"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "156",
      "bestRating": "5",
      "worstRating": "1"
    },
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": "Sea View", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Free WiFi", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Infinity Pool", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Spa & Wellness", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Fitness Center", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Restaurant", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Free Parking", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Air Conditioning", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "24-Hour Front Desk", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Airport Transfer", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Room Service", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Balcony", "value": true }
    ],
    "checkinTime": "14:00",
    "checkoutTime": "12:00",
    "petsAllowed": false,
    "smokingAllowed": false,
    "hasMap": "https://maps.google.com/?q=41.642883,41.644944"
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are the check-in and check-out times?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Check-in is from 14:00 (2 PM) and check-out is until 12:00 (noon). Early check-in and late check-out may be available upon request, subject to availability."
        }
      },
      {
        "@type": "Question",
        "name": "Do all apartments have sea views?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all our luxury apartments at Orbi City Batumi offer stunning panoramic views of the Black Sea. Enjoy breathtaking sunrises and sunsets from your private balcony."
        }
      },
      {
        "@type": "Question",
        "name": "Is airport transfer available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer airport transfer services from Batumi International Airport. Please contact us at +995555199090 to arrange your transfer in advance."
        }
      },
      {
        "@type": "Question",
        "name": "What amenities are included?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our 5-star aparthotel offers: infinity pool, spa & wellness center, fitness center, restaurant, free WiFi, free parking, 24-hour front desk, room service, and stunning sea views from every apartment."
        }
      },
      {
        "@type": "Question",
        "name": "How far is Orbi City from Batumi Boulevard?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Orbi City Batumi is located directly on the seafront, just steps away from Batumi Boulevard. You can walk to the famous promenade in under 2 minutes."
        }
      }
    ]
  };

  // WebSite Schema with SearchAction
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": "https://orbicitybatumi.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://orbicitybatumi.com/apartments?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
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

  // Accommodation (Room Types)
  const accommodationSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Available Apartments",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "HotelRoom",
          "name": "Deluxe Sea View Apartment",
          "description": "Spacious apartment with panoramic Black Sea views, modern kitchen, and private balcony.",
          "occupancy": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 4
          },
          "bed": {
            "@type": "BedDetails",
            "numberOfBeds": 2,
            "typeOfBed": "King"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "HotelRoom",
          "name": "Premium Suite",
          "description": "Luxury suite with separate living area, floor-to-ceiling windows, and premium amenities.",
          "occupancy": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 6
          },
          "bed": {
            "@type": "BedDetails",
            "numberOfBeds": 3,
            "typeOfBed": "King"
          }
        }
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
        {JSON.stringify(faqSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(accommodationSchema)}
      </script>
    </Helmet>
  );
};
