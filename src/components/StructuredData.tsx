import { Helmet } from 'react-helmet-async';
import { useSEO } from '@/hooks/useSEO';

export const StructuredData = () => {
  const { globalSettings } = useSEO('/');

  const companyName = globalSettings?.company_legal_name || 'Orbi City Batumi LLC';
  const siteName = globalSettings?.site_name || 'Orbi City Batumi';
  const address = globalSettings?.contact_address || '7B Sherif Khimshiashvili Str, Orbi City, Batumi, Georgia';
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
      "streetAddress": "7B Sherif Khimshiashvili Str, Orbi City",
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
    "hasMap": "https://maps.google.com/?q=41.642883,41.644944",
    "numberOfRooms": 50,
    "availableLanguage": ["English", "Georgian", "Russian"]
  };

  // Review Schema (Google Rich Snippets)
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Hotel",
      "@id": "https://orbicitybatumi.com/#hotel"
    },
    "author": {
      "@type": "Person",
      "name": "Sarah Johnson"
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "5",
      "bestRating": "5"
    },
    "reviewBody": "Absolutely stunning views of the Black Sea! The apartment was luxurious and the staff incredibly welcoming. The balcony breakfast was unforgettable.",
    "datePublished": "2024-12-15"
  };

  // Offer Schema (for special deals)
  const offerSchema = {
    "@context": "https://schema.org",
    "@type": "Offer",
    "name": "Early Bird Discount - 20% Off",
    "description": "Book 30 days in advance and save 20% on your stay at Orbi City Batumi",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "validFrom": "2024-01-01",
    "validThrough": "2025-12-31",
    "seller": {
      "@type": "Organization",
      "name": siteName
    }
  };

  // Event Schema (for local events promotion)
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Batumi Summer Season 2025",
    "description": "Experience the vibrant summer season at Orbi City Batumi with special events and activities.",
    "startDate": "2025-06-01",
    "endDate": "2025-09-30",
    "location": {
      "@type": "Place",
      "name": siteName,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "7B Sherif Khimshiashvili Str, Orbi City",
        "addressLocality": "Batumi",
        "addressCountry": "GE"
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": siteName
    }
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
      },
      {
        "@type": "Question",
        "name": "What payment methods are accepted?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We accept cash (GEL, USD, EUR), all major credit cards (Visa, Mastercard, American Express), and bank transfers. Payment is secure and flexible."
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

  // Accommodation (Room Types) with Pricing
  const accommodationSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Available Apartments at Orbi City Batumi",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "HotelRoom",
          "@id": "https://orbicitybatumi.com/apartments/suite-sea-view",
          "name": "Suite with Sea View",
          "description": "Elegant 30m² suite with breathtaking Black Sea views, modern kitchenette, and private balcony. Perfect for couples or solo travelers.",
          "url": "https://orbicitybatumi.com/apartments/suite-sea-view",
          "image": "https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/e4578176040cf98304ee3ae0477a108f.jpg",
          "occupancy": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 3
          },
          "bed": {
            "@type": "BedDetails",
            "numberOfBeds": 1,
            "typeOfBed": "King"
          },
          "floorSize": {
            "@type": "QuantitativeValue",
            "value": 30,
            "unitCode": "MTK"
          },
          "amenityFeature": [
            { "@type": "LocationFeatureSpecification", "name": "Sea View" },
            { "@type": "LocationFeatureSpecification", "name": "Kitchenette" },
            { "@type": "LocationFeatureSpecification", "name": "Balcony" },
            { "@type": "LocationFeatureSpecification", "name": "Free WiFi" },
            { "@type": "LocationFeatureSpecification", "name": "Air Conditioning" }
          ],
          "offers": {
            "@type": "Offer",
            "priceCurrency": "GEL",
            "price": "60",
            "priceValidUntil": "2026-12-31",
            "availability": "https://schema.org/InStock",
            "url": "https://orbicitybatumi.com/apartments/suite-sea-view"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "HotelRoom",
          "@id": "https://orbicitybatumi.com/apartments/deluxe-suite",
          "name": "Deluxe Suite with Sea View",
          "description": "Spacious 40m² deluxe suite with panoramic sea views, full kitchen, separate living area, and premium amenities.",
          "url": "https://orbicitybatumi.com/apartments/deluxe-suite",
          "image": "https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/47fe838e886d9afa24f54f2c292a93c3.jpg",
          "occupancy": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 4
          },
          "bed": {
            "@type": "BedDetails",
            "numberOfBeds": 1,
            "typeOfBed": "King"
          },
          "floorSize": {
            "@type": "QuantitativeValue",
            "value": 40,
            "unitCode": "MTK"
          },
          "offers": {
            "@type": "Offer",
            "priceCurrency": "GEL",
            "price": "80",
            "priceValidUntil": "2026-12-31",
            "availability": "https://schema.org/InStock"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@type": "HotelRoom",
          "@id": "https://orbicitybatumi.com/apartments/superior-suite",
          "name": "Superior Suite with Sea View",
          "description": "Premium 50m² suite featuring separate bedroom, spacious living room, full kitchen, and the best panoramic Black Sea views.",
          "url": "https://orbicitybatumi.com/apartments/superior-suite",
          "image": "https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/78f6531862f26bbcdf6bca5ec8d7305c.jpg",
          "occupancy": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 5
          },
          "bed": {
            "@type": "BedDetails",
            "numberOfBeds": 2,
            "typeOfBed": "King"
          },
          "floorSize": {
            "@type": "QuantitativeValue",
            "value": 50,
            "unitCode": "MTK"
          },
          "offers": {
            "@type": "Offer",
            "priceCurrency": "GEL",
            "price": "100",
            "priceValidUntil": "2026-12-31",
            "availability": "https://schema.org/InStock"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 4,
        "item": {
          "@type": "HotelRoom",
          "@id": "https://orbicitybatumi.com/apartments/family-suite",
          "name": "Superior Family Suite",
          "description": "Generously sized 65m² family suite with multiple bedrooms, full kitchen, and stunning sea views. Perfect for families or groups.",
          "url": "https://orbicitybatumi.com/apartments/family-suite",
          "image": "https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/a8e056679876a0ec81cba5bb82a37322.jpg",
          "occupancy": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 6
          },
          "bed": {
            "@type": "BedDetails",
            "numberOfBeds": 3,
            "typeOfBed": "King"
          },
          "floorSize": {
            "@type": "QuantitativeValue",
            "value": 65,
            "unitCode": "MTK"
          },
          "offers": {
            "@type": "Offer",
            "priceCurrency": "GEL",
            "price": "150",
            "priceValidUntil": "2026-12-31",
            "availability": "https://schema.org/InStock"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 5,
        "item": {
          "@type": "HotelRoom",
          "@id": "https://orbicitybatumi.com/apartments/two-bedroom-panoramic",
          "name": "Two Bedroom Panoramic Suite",
          "description": "The pinnacle of luxury - expansive 85m² suite with two bedrooms, large living room, full kitchen, and stunning 180° panoramic sea views.",
          "url": "https://orbicitybatumi.com/apartments/two-bedroom-panoramic",
          "image": "https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/bddec56c6ef5d23a4f593adcd512b633.jpg",
          "occupancy": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 8
          },
          "bed": {
            "@type": "BedDetails",
            "numberOfBeds": 4,
            "typeOfBed": "King"
          },
          "floorSize": {
            "@type": "QuantitativeValue",
            "value": 85,
            "unitCode": "MTK"
          },
          "offers": {
            "@type": "Offer",
            "priceCurrency": "GEL",
            "price": "200",
            "priceValidUntil": "2026-12-31",
            "availability": "https://schema.org/InStock"
          }
        }
      }
    ]
  };

  // LocalBusiness Schema (for local search dominance)
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": "Orbi City Batumi - Luxury Sea View Apartments",
    "alternateName": ["Orbi City Batumi", "Orbi City Hotel", "Orbi City Aparthotel"],
    "description": "Best luxury apartments in Batumi with stunning Black Sea views. 5-star serviced apartments 50m from beach, near Dancing Fountains. Book direct for best rates!",
    "url": "https://orbicitybatumi.com",
    "telephone": phone,
    "email": email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "7B Sherif Khimshiashvili Street",
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
    "hasMap": "https://www.google.com/maps/place/?q=place_id:ChIJxf79LQmHZ0ARpmv2Eih-1WE",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    },
    "priceRange": "$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "156",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Sarah Johnson" },
        "datePublished": "2025-12-15",
        "reviewRating": { "@type": "Rating", "ratingValue": "5" },
        "reviewBody": "Absolutely stunning views of the Black Sea! The apartment was luxurious and the staff incredibly welcoming."
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Marco Rossi" },
        "datePublished": "2025-11-20",
        "reviewRating": { "@type": "Rating", "ratingValue": "5" },
        "reviewBody": "Best hotel in Batumi! Perfect location near the beach and amazing amenities. Will definitely return."
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Anna Petrova" },
        "datePublished": "2025-10-05",
        "reviewRating": { "@type": "Rating", "ratingValue": "5" },
        "reviewBody": "The sea view from the balcony is breathtaking. Modern apartment with everything you need. Highly recommend!"
      }
    ],
    "sameAs": [
      "https://www.booking.com/hotel/ge/orbi-city-batumi.html",
      "https://www.facebook.com/orbicitybatumi",
      "https://www.instagram.com/orbicitybatumi",
      "https://www.tripadvisor.com/Hotel_Review-Orbi_City_Batumi"
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
        {JSON.stringify(reviewSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(offerSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(eventSchema)}
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
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  );
};
