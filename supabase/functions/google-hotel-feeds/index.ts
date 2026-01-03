import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const HOTEL_ID = 'orbi-city-batumi';
const HOTEL_NAME = 'Orbi City Batumi';
const PARTNER_ID = 'orbicitybatumi';
const WEBSITE_URL = 'https://orbicitybatumi.com';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const feedType = url.searchParams.get('type') || 'landing';

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch apartment prices
    const { data: apartments, error: apartmentsError } = await supabase
      .from('apartment_prices')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (apartmentsError) {
      console.error('Error fetching apartments:', apartmentsError);
      throw apartmentsError;
    }

    // Fetch seasonal prices
    const { data: seasonalPrices, error: seasonalError } = await supabase
      .from('seasonal_prices')
      .select('*')
      .eq('is_active', true);

    if (seasonalError) {
      console.error('Error fetching seasonal prices:', seasonalError);
    }

    if (feedType === 'landing') {
      // Landing Page Feed (PointOfSale Feed)
      const xml = generateLandingPageFeed(apartments || []);
      return new Response(xml, {
        headers: { ...corsHeaders, 'Content-Type': 'application/xml' },
      });
    } else if (feedType === 'price') {
      // Price Feed (Transaction/OTA_HotelRateAmountNotifRQ)
      const xml = generatePriceFeed(apartments || [], seasonalPrices || []);
      return new Response(xml, {
        headers: { ...corsHeaders, 'Content-Type': 'application/xml' },
      });
    } else if (feedType === 'hotel') {
      // Hotel List Feed
      const xml = generateHotelListFeed();
      return new Response(xml, {
        headers: { ...corsHeaders, 'Content-Type': 'application/xml' },
      });
    } else if (feedType === 'room') {
      // Room Bundle Feed
      const xml = generateRoomBundleFeed(apartments || []);
      return new Response(xml, {
        headers: { ...corsHeaders, 'Content-Type': 'application/xml' },
      });
    } else {
      return new Response(JSON.stringify({ 
        error: 'Invalid feed type',
        available: ['landing', 'price', 'hotel', 'room']
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error generating feed:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateLandingPageFeed(apartments: any[]): string {
  const timestamp = new Date().toISOString();
  
  let landingPages = apartments.map(apt => `
    <PointOfSale id="${apt.apartment_type}">
      <DisplayNames display_text="${apt.name_en}" display_language="en"/>
      <DisplayNames display_text="${apt.name_ka}" display_language="ka"/>
      <URL>https://orbicitybatumi.com/apartments/${apt.apartment_type}</URL>
      <Match>
        <Country code="GE"/>
        <Language code="en"/>
        <Language code="ka"/>
        <Language code="ru"/>
        <Currency code="USD"/>
        <Currency code="GEL"/>
        <Device type="desktop"/>
        <Device type="mobile"/>
        <Device type="tablet"/>
      </Match>
    </PointOfSale>`).join('\n');

  // Add main booking page
  landingPages += `
    <PointOfSale id="main-booking">
      <DisplayNames display_text="Book Direct - Best Rate Guaranteed" display_language="en"/>
      <DisplayNames display_text="პირდაპირი დაჯავშნა - საუკეთესო ფასი" display_language="ka"/>
      <URL>https://orbicitybatumi.com/apartments</URL>
      <Match>
        <Country code="GE"/>
        <Country code="US"/>
        <Country code="GB"/>
        <Country code="DE"/>
        <Country code="RU"/>
        <Country code="TR"/>
        <Language code="en"/>
        <Language code="ka"/>
        <Language code="ru"/>
        <Currency code="USD"/>
        <Currency code="GEL"/>
        <Currency code="EUR"/>
        <Device type="desktop"/>
        <Device type="mobile"/>
        <Device type="tablet"/>
      </Match>
    </PointOfSale>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<PointsOfSale partner="${PARTNER_ID}" id="${HOTEL_ID}" timestamp="${timestamp}">
  ${landingPages}
</PointsOfSale>`;
}

function generatePriceFeed(apartments: any[], seasonalPrices: any[]): string {
  const timestamp = new Date().toISOString();
  const today = new Date();
  
  // Generate prices for next 365 days
  const priceItems: string[] = [];
  
  for (const apt of apartments) {
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      
      // Check for seasonal price
      const seasonal = seasonalPrices.find(
        sp => sp.apartment_type === apt.apartment_type && 
              sp.month === month && 
              sp.year === year
      );
      
      const price = seasonal?.price_per_night || apt.price_per_night;
      
      priceItems.push(`
        <Result>
          <Property>${HOTEL_ID}</Property>
          <RoomID>${apt.apartment_type}</RoomID>
          <Checkin>${dateStr}</Checkin>
          <Nights>1</Nights>
          <Baserate currency="USD">${price.toFixed(2)}</Baserate>
          <Tax currency="USD">0.00</Tax>
          <OtherFees currency="USD">0.00</OtherFees>
          <AllowablePointsOfSale>
            <PointOfSale id="${apt.apartment_type}"/>
            <PointOfSale id="main-booking"/>
          </AllowablePointsOfSale>
        </Result>`);
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<Transaction partner="${PARTNER_ID}" id="price-${Date.now()}" timestamp="${timestamp}">
  <PropertyDataSet>
    <Property>${HOTEL_ID}</Property>
    ${priceItems.join('\n')}
  </PropertyDataSet>
</Transaction>`;
}

function generateHotelListFeed(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<listings>
  <language>en</language>
  <listing>
    <id>${HOTEL_ID}</id>
    <name>${HOTEL_NAME}</name>
    <address format="simple">
      <component name="addr1">Sherif Khimshiashvili Street 15</component>
      <component name="city">Batumi</component>
      <component name="province">Adjara</component>
      <component name="postal_code">6010</component>
    </address>
    <country>GE</country>
    <latitude>41.6458</latitude>
    <longitude>41.6369</longitude>
    <phone type="main">+995 555 123456</phone>
    <category>aparthotel</category>
    <content>
      <text type="description">
        <link>https://orbicitybatumi.com/about</link>
        <title>Orbi City Batumi - Premium Apartments</title>
        <body>Luxury apartments in the heart of Batumi with stunning sea views, modern amenities, and exceptional service.</body>
      </text>
      <review type="editorial" url="https://orbicitybatumi.com">
        <author>Orbi City</author>
        <body>Experience the best of Batumi with our premium apartments featuring panoramic views, infinity pool, and 24/7 concierge service.</body>
      </review>
      <attributes>
        <attr name="has_wifi">yes</attr>
        <attr name="has_pool">yes</attr>
        <attr name="has_fitness_center">yes</attr>
        <attr name="has_spa">yes</attr>
        <attr name="has_parking">yes</attr>
        <attr name="has_restaurant">yes</attr>
        <attr name="has_bar">yes</attr>
        <attr name="has_air_conditioning">yes</attr>
        <attr name="has_kitchen">yes</attr>
        <attr name="is_wheelchair_accessible">yes</attr>
      </attributes>
      <image type="photo" url="https://orbicitybatumi.com/og-image.jpg" width="1200" height="630">
        <link>https://orbicitybatumi.com</link>
        <title>Orbi City Batumi</title>
      </image>
    </content>
  </listing>
</listings>`;
}

function generateRoomBundleFeed(apartments: any[]): string {
  const timestamp = new Date().toISOString();
  
  const roomBundles = apartments.map(apt => `
    <RoomBundle>
      <RoomID>${apt.apartment_type}</RoomID>
      <RoomName>
        <Text text="${apt.name_en}" language="en"/>
        <Text text="${apt.name_ka}" language="ka"/>
      </RoomName>
      <RoomDescription>
        <Text text="${apt.description_en || apt.name_en}" language="en"/>
        <Text text="${apt.description_ka || apt.name_ka}" language="ka"/>
      </RoomDescription>
      <Capacity>${apt.max_guests}</Capacity>
      <Occupancy min="1" max="${apt.max_guests}"/>
      <RoomSize unit="sqm">${apt.size_sqm || 45}</RoomSize>
      <PhotoURL>
        <URL>${apt.image_url || 'https://orbicitybatumi.com/og-image.jpg'}</URL>
      </PhotoURL>
      <RatePlan id="direct">
        <RatePlanName>
          <Text text="Best Available Rate" language="en"/>
          <Text text="საუკეთესო ფასი" language="ka"/>
        </RatePlanName>
        <RatePlanDescription>
          <Text text="Book direct for the best rate guarantee" language="en"/>
          <Text text="დაჯავშნეთ პირდაპირ საუკეთესო ფასით" language="ka"/>
        </RatePlanDescription>
        <Refundable available="true" refundable_until_days="1"/>
        <BreakfastIncluded>false</BreakfastIncluded>
        <InternetIncluded>true</InternetIncluded>
        <ParkingIncluded>true</ParkingIncluded>
      </RatePlan>
    </RoomBundle>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<RoomData partner="${PARTNER_ID}" timestamp="${timestamp}">
  <Property>
    <PropertyID>${HOTEL_ID}</PropertyID>
    ${roomBundles}
  </Property>
</RoomData>`;
}
