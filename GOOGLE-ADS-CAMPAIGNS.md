# Google Ads Campaigns - Orbi City Batumi
**Created:** 2026-01-27
**Target:** #1 რანკინგი ბათუმის აპარტამენტებში

---

## 🎯 კამპანიის სტრატეგია

### მიზანი
- **Primary:** Direct bookings ზრდა 50%-ით
- **Secondary:** Brand awareness ბათუმში #1
- **Budget:** $500-1000/month recommended

---

## 📊 კამპანია #1: Search - Brand Keywords

### Settings
```
Campaign Name: Orbi City Brand - Search
Type: Search
Budget: $10/day
Bidding: Maximize conversions
Location: Worldwide
Languages: English, Russian, Georgian, German
```

### Ad Group 1: Brand Terms
**Keywords:**
```
orbi city batumi [exact]
orbi city apartments [exact]
orbi city hotel [exact]
"orbi city batumi booking" [phrase]
"orbi city sea view" [phrase]
```

**Ad Copy 1:**
```
Headline 1: Orbi City Batumi - Official Site
Headline 2: Book Direct & Save 20% Today
Headline 3: Sea View Apartments from $50/night
Description 1: Premium Sea View Apartments in Batumi. Infinity Pool, Spa, 50m from Beach. Best Price Guaranteed!
Description 2: ✓ Free Cancellation ✓ No Hidden Fees ✓ 24/7 Support. Book Your Perfect Batumi Escape Now!
Final URL: https://orbicitybatumi.com/apartments
```

**Ad Copy 2:**
```
Headline 1: Orbi City Batumi - Book Direct
Headline 2: Luxury Sea View from $50/Night
Headline 3: Skip OTAs - Save 20% Here
Description 1: 5-Star Apartments on Black Sea. Every Room Has Sea View. Infinity Pool, Spa, Free WiFi & Parking.
Description 2: Why Pay Booking.com Prices? Book Direct at OrbicityBatumi.com for Best Rates. Free Cancellation!
Final URL: https://orbicitybatumi.com
```

---

## 📊 კამპანია #2: Search - Generic Keywords

### Settings
```
Campaign Name: Batumi Apartments - Generic Search
Type: Search
Budget: $20/day
Bidding: Target CPA $15
Location: USA, UK, Germany, Russia, Israel, UAE, Turkey
Languages: English, Russian
```

### Ad Group 1: Sea View Apartments
**Keywords:**
```
batumi sea view apartments [phrase]
apartments in batumi with sea view [phrase]
batumi black sea apartments [phrase]
best sea view hotel batumi [phrase]
luxury apartments batumi georgia [phrase]
```

**Ad Copy:**
```
Headline 1: Sea View Apartments Batumi
Headline 2: From $50/Night - Book Direct
Headline 3: 5-Star Luxury at Orbi City
Description 1: Wake Up to Black Sea Views Every Morning. Infinity Pool, Spa, Gym. 50m from Beach. Book Now!
Description 2: Premium Serviced Apartments in Batumi. Full Kitchen, WiFi, Parking. Save 20% vs Booking Sites!
Final URL: https://orbicitybatumi.com/apartments
```

### Ad Group 2: Hotel Batumi
**Keywords:**
```
hotel batumi [phrase]
best hotel batumi [phrase]
batumi hotel sea view [phrase]
batumi accommodation [phrase]
where to stay batumi [phrase]
```

**Ad Copy:**
```
Headline 1: Best Hotel Alternative Batumi
Headline 2: Apartment > Hotel Room
Headline 3: 2x Space, Half the Price
Description 1: Why Book a Tiny Hotel Room? Get a Full Apartment with Kitchen at Orbi City. Sea Views Guaranteed!
Description 2: Orbi City: Hotel Amenities + Apartment Space. Pool, Spa, Gym, 24/7 Reception. From $50/Night.
Final URL: https://orbicitybatumi.com
```

### Ad Group 3: Booking/Vacation
**Keywords:**
```
batumi vacation rental [phrase]
batumi holiday apartment [phrase]
batumi trip accommodation [phrase]
batumi beach apartment [phrase]
book apartment batumi [phrase]
```

**Ad Copy:**
```
Headline 1: Batumi Beach Apartments
Headline 2: 50 Meters from Black Sea
Headline 3: Book Direct - Save 20%
Description 1: Your Perfect Batumi Vacation Starts at Orbi City. Sea View Apartments with Pool, Spa & More!
Description 2: Skip the Crowds, Book Premium. Luxury Apartments at Budget Prices. Free Cancellation Available.
Final URL: https://orbicitybatumi.com/apartments
```

---

## 📊 კამპანია #3: Display - Remarketing

### Settings
```
Campaign Name: Orbi City - Remarketing
Type: Display
Budget: $5/day
Bidding: Maximize conversions
Audience: Website visitors (last 30 days)
```

### Ad Creatives

**Responsive Display Ad:**
```
Headlines:
- Come Back to Orbi City Batumi!
- Your Sea View Awaits
- Special Offer: 15% Off Return Guests
- Don't Miss Your Dream Vacation

Descriptions:
- You viewed our apartments. Complete your booking now and get 15% off!
- The Black Sea is calling. Book your Orbi City apartment today.

Images: (upload to Google Ads)
- 1200x628: Sea view from balcony
- 300x250: Pool with sea view
- 728x90: Building exterior

Final URL: https://orbicitybatumi.com/apartments?utm_source=remarketing
```

---

## 📊 კამპანია #4: Performance Max

### Settings
```
Campaign Name: Orbi City - Performance Max
Type: Performance Max
Budget: $15/day
Bidding: Maximize conversions
Location: Top source markets
```

### Asset Groups

**Asset Group 1: Luxury Experience**
```
Final URL: https://orbicitybatumi.com

Headlines:
- Luxury Sea View Apartments Batumi
- Orbi City - 5-Star Comfort
- Black Sea Views from Every Room
- Book Direct & Save 20%
- Premium Batumi Accommodation

Long Headlines:
- Experience Luxury at Orbi City Batumi - Sea Views, Pool, Spa from $50/Night
- Your Dream Batumi Vacation: Stunning Apartments with Black Sea Panorama

Descriptions:
- Premium apartments in Batumi with infinity pool, spa, and guaranteed sea views. Book direct for best prices!
- Wake up to Black Sea sunrises at Orbi City. 5-star amenities, apartment comfort. From $50/night.

Call to Action: Book Now

Images: (3-5 high quality)
- Sea view from apartment
- Infinity pool
- Modern apartment interior
- Batumi skyline
- Happy guests on balcony

Videos: (optional)
- YouTube: Orbi City tour video
```

---

## 🎯 Negative Keywords (ყველა კამპანიისთვის)

```
-free
-cheap
-hostel
-jobs
-career
-employment
-rent long term
-buy apartment
-for sale
-real estate
-airbnb host
-property management
```

---

## 📈 Conversion Tracking Setup

### Google Tag Manager Configuration

**Tag 1: Booking Start**
```javascript
// Trigger: Button click on "Book Now"
gtag('event', 'begin_checkout', {
  'currency': 'USD',
  'value': 100,
  'items': [{
    'item_name': 'Apartment Booking',
    'item_category': 'Accommodation'
  }]
});
```

**Tag 2: Booking Complete**
```javascript
// Trigger: Thank you page load
gtag('event', 'purchase', {
  'transaction_id': '{{booking_id}}',
  'value': {{booking_value}},
  'currency': 'USD'
});
```

---

## 💰 Budget Allocation Recommendation

| Campaign | Daily Budget | Monthly | Priority |
|----------|-------------|---------|----------|
| Brand Search | $10 | $300 | HIGH |
| Generic Search | $20 | $600 | HIGH |
| Remarketing | $5 | $150 | MEDIUM |
| Performance Max | $15 | $450 | MEDIUM |
| **TOTAL** | **$50** | **$1,500** | - |

---

## 🚀 Quick Setup Steps

### 1. Google Ads Account
1. Go to https://ads.google.com
2. Sign in with: orbi.apartments1@gmail.com
3. Create new campaign

### 2. For Each Campaign:
1. Click "+ New Campaign"
2. Select "Sales" or "Leads"
3. Choose campaign type
4. Copy settings from above
5. Add keywords and ads
6. Set budget
7. Launch!

### 3. Conversion Tracking:
1. Go to Tools > Conversions
2. Create "Website" conversion
3. Add tag to orbicitybatumi.com
4. Or use Google Tag Manager

---

## 📊 Performance Targets

| Metric | Target | Good | Excellent |
|--------|--------|------|-----------|
| CTR | >3% | >5% | >8% |
| Conversion Rate | >2% | >4% | >6% |
| CPA | <$20 | <$15 | <$10 |
| ROAS | >300% | >500% | >800% |

---

## 🔄 Weekly Optimization Checklist

- [ ] Review search terms report
- [ ] Add negative keywords
- [ ] Pause low-performing ads
- [ ] Increase bids on converting keywords
- [ ] Check quality scores
- [ ] Update ad copy (test new versions)
- [ ] Review device performance
- [ ] Check location performance

---

## 📞 Support

**Google Ads Help:**
- https://support.google.com/google-ads
- Phone: 1-866-246-6453

**Need Help Setting Up?**
- Use this document as reference
- Copy/paste ad copy directly
- Follow budget recommendations

---

*Document created for Orbi City Batumi*
*Last updated: 2026-01-27*
