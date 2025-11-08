import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ka' | 'ru' | 'tr' | 'uk';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.rooms': 'Rooms',
    'nav.amenities': 'Amenities',
    'nav.location': 'Location',
    'nav.reviews': 'Reviews',
    'nav.contact': 'Contact',
    'nav.bookNow': 'Book Now',
    
    // Hero
    'hero.title': 'Your Perfect Seaside Escape',
    'hero.subtitle': 'Luxury Sea View Apartments in the Heart of Batumi',
    'hero.whatsapp': 'WhatsApp',
    
    // Booking Widget
    'booking.checkIn': 'Check In',
    'booking.checkOut': 'Check Out',
    'booking.guests': 'Guests',
    'booking.checkAvailability': 'Check Availability',
    
    // Rooms
    'rooms.title': 'Find Your Perfect Space',
    'rooms.subtitle': 'Each apartment is thoughtfully designed to provide an unparalleled experience',
    'rooms.suite': 'Suite with Sea View',
    'rooms.suiteDesc': 'An elegant suite offering breathtaking views of the sea, perfect for couples or solo travelers',
    'rooms.deluxe': 'Deluxe Suite with Sea View',
    'rooms.deluxeDesc': 'A more spacious and luxurious suite with enhanced amenities and a prime sea view',
    'rooms.superior': 'Superior Suite with Sea View',
    'rooms.superiorDesc': 'Premium suite featuring a separate living area and best panoramic views of the sea',
    'rooms.family': 'Superior Family Suite',
    'rooms.familyDesc': 'Generously sized suite with multiple rooms, perfect for families or groups',
    'rooms.twobed': 'Two Bedroom Panoramic Suite',
    'rooms.twobedDesc': 'The pinnacle of luxury. Expansive suite with two bedrooms and stunning panoramic terrace',
    'rooms.viewDetails': 'View Details',
    'rooms.bookNow': 'Book Now',
    'rooms.from': 'From',
    'rooms.night': '/night',
    'rooms.size': 'Size',
    'rooms.guests': 'Guests',
    
    // Amenities
    'amenities.title': 'World-Class Amenities',
    'amenities.subtitle': 'Everything you need for a perfect stay',
    'amenities.seaView': 'Sea View',
    'amenities.fountains': 'Near Fountains',
    'amenities.kitchen': 'Full Kitchenette',
    'amenities.reception': '24/7 Reception',
    'amenities.pool': 'Swimming Pool',
    'amenities.parking': 'Parking',
    'amenities.wifi': 'High-Speed WiFi',
    'amenities.ac': 'Air Conditioning',
    'amenities.housekeeping': 'Housekeeping',
    'amenities.security': '24/7 Security',
    'amenities.concierge': 'Concierge Service',
    'amenities.restaurant': 'Restaurant',
    
    // Location
    'location.title': 'Prime Location in Batumi',
    'location.subtitle': 'Steps away from the Black Sea and major attractions',
    'location.beach': 'Black Sea Beach',
    'location.beachDist': '50 meters',
    'location.fountains': 'Dancing Fountains',
    'location.fountainsDist': '100 meters',
    'location.airport': 'Batumi Airport',
    'location.airportDist': '5 kilometers',
    
    // Reviews
    'reviews.title': 'Guest Reviews',
    'reviews.subtitle': 'What our guests say about us',
    'reviews.rating': 'Guest Rating',
    'reviews.review1': 'Absolutely stunning views of the Black Sea! The apartment was luxurious and the staff incredibly welcoming.',
    'reviews.review2': 'Perfect location near the beach and fountains. The apartment was spotless and well-equipped.',
    'reviews.review3': 'Amazing experience! The sea view from our balcony was breathtaking. Highly recommend!',
    
    // CTA
    'cta.title': 'Ready to Experience Luxury by the Sea?',
    'cta.subtitle': 'Book your perfect apartment today',
    'cta.button': 'Book Your Stay',
    
    // Footer
    'footer.description': 'Luxury serviced apartments in the heart of Batumi, Georgia. Steps from the Black Sea.',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact Us',
    'footer.phone': 'Phone',
    'footer.email': 'Email',
    'footer.address': 'Address',
    'footer.followUs': 'Follow Us',
    'footer.rights': '© 2025 Orbi City Batumi. All rights reserved.',
    
    // Apartments Page
    'apartments.hero.title': 'Luxury Apartments in Batumi',
    'apartments.hero.subtitle': 'Discover our exquisite collection of sea-view apartments, each designed to provide the ultimate comfort and sophistication. From intimate suites to spacious family accommodations.',
    'apartments.section.title': 'Find Your Perfect Space',
    'apartments.section.subtitle': 'Each apartment is thoughtfully designed to provide an unparalleled experience. Explore our offerings and find the one that speaks to you.',
    'apartments.sqm': 'm²',
    'apartments.guests': 'Guests',
    'apartments.bed': 'Bed',
    'apartments.beds': 'Beds',
    'apartments.sofaBed': 'Sofa Bed',
    'apartments.bath': 'Bath',
    'apartments.baths': 'Baths',
    'apartments.bidet': 'Bidet',
    'apartments.keyFeatures': 'Key Features',
    'apartments.bookNow': 'Book Now / Pay Later',
    'apartments.checkAvailability': 'Check Availability',
    
    // Suite
    'apartments.suite.title': 'Suite with Sea View',
    'apartments.suite.desc': 'An elegant suite offering breathtaking panoramic views of the Black Sea. Perfect for couples or solo travelers seeking a tranquil escape with modern amenities and sophisticated design. Wake up to stunning sunrises over the sea from your private balcony.',
    'apartments.suite.feature1': 'Private Sea View Balcony',
    'apartments.suite.feature2': 'Fully Equipped Kitchenette',
    'apartments.suite.feature3': 'High-Speed WiFi',
    'apartments.suite.feature4': 'Smart Climate Control',
    'apartments.suite.feature5': '55" Smart TV with Streaming',
    'apartments.suite.feature6': 'King Size Bed with Premium Linens',
    
    // Deluxe
    'apartments.deluxe.title': 'Deluxe Suite with Sea View',
    'apartments.deluxe.desc': 'A more spacious and luxurious suite featuring enhanced amenities and prime sea views. Designed for discerning guests who appreciate attention to detail and comfort. The separate living area provides additional space for relaxation and entertainment.',
    'apartments.deluxe.feature1': 'Expansive Sea View Balcony',
    'apartments.deluxe.feature2': 'Separate Living & Dining Area',
    'apartments.deluxe.feature3': 'Full Kitchen with Premium Appliances',
    'apartments.deluxe.feature4': 'Complimentary High-Speed WiFi',
    'apartments.deluxe.feature5': 'Dual-Zone Climate Control',
    'apartments.deluxe.feature6': 'Premium Entertainment System',
    
    // Superior
    'apartments.superior.title': 'Superior Suite with Sea View',
    'apartments.superior.desc': 'Our premium suite featuring a separate bedroom, luxurious living area, and the best panoramic views of the Black Sea. Ideal for guests who desire extra space and premium amenities. Corner location ensures maximum natural light and sweeping ocean vistas.',
    'apartments.superior.feature1': 'Corner Panoramic Sea Views',
    'apartments.superior.feature2': 'One Separate Bedroom',
    'apartments.superior.feature3': 'Spacious Dining Area',
    'apartments.superior.feature4': 'Modern Full Bathroom',
    'apartments.superior.feature5': 'Designer Kitchenette',
    'apartments.superior.feature6': 'Luxury Bath Amenities',
    'apartments.superior.feature7': 'King Bed with Ceiling Mirrors',
    
    // Family
    'apartments.family.title': 'Superior Family Suite with Sea View',
    'apartments.family.desc': 'A generously sized suite with two bedrooms and two bathrooms, perfect for families or groups of up to 6 guests. Enjoy comfort and privacy with separate sleeping areas while maintaining connection in the spacious living space. Ideal for creating lasting memories with loved ones.',
    'apartments.family.feature1': 'Expansive Private Balcony',
    'apartments.family.feature2': 'Two Separate Bedrooms',
    'apartments.family.feature3': 'Two Full Bathrooms with Bidet',
    'apartments.family.feature4': 'Full Kitchen & Dining Area',
    'apartments.family.feature5': 'In-Unit Washing Machine',
    'apartments.family.feature6': 'Concierge Priority Services',
    'apartments.family.feature7': 'King Beds with Premium Features',
    
    // Two Bedroom
    'apartments.twobed.title': 'Two Bedroom Panoramic Suite',
    'apartments.twobed.desc': 'The pinnacle of luxury living in Batumi. This expansive suite features two master bedrooms and a spectacular 270° panoramic terrace offering uninterrupted views of the Black Sea. Perfect for families or groups seeking the ultimate in space, comfort, and breathtaking scenery.',
    'apartments.twobed.feature1': '270° Panoramic Ocean Terrace',
    'apartments.twobed.feature2': '2 Master Bedrooms with En-suite',
    'apartments.twobed.feature3': '2 Convertible Sofa Beds',
    'apartments.twobed.feature4': '2 King Beds with Ceiling Mirrors',
    'apartments.twobed.feature5': 'Gourmet Kitchen',
    'apartments.twobed.feature6': 'Designer Luxury Furnishings',
    'apartments.twobed.feature7': 'Ultimate Sea & City Views',
    
    // Location Page
    'location.page.title': 'Prime Seafront Location',
    'location.page.subtitle': 'Perfectly positioned in the heart of Batumi, steps from the Black Sea and major attractions. Experience the best of coastal living with unparalleled convenience.',
    
    // Amenities
    'amenities.hero.title': 'World-Class Amenities',
    'amenities.hero.subtitle': 'Everything you need for an unforgettable stay',
    'amenities.premium.title': 'Premium Facilities',
    'amenities.premium.subtitle': 'Indulge in our exclusive amenities designed for your ultimate comfort',
    'amenities.standard.title': 'Essential Services',
    'amenities.standard.subtitle': 'All the conveniences you expect and more',
    'amenities.pool.title': 'Swimming Pool & Spa',
    'amenities.pool.desc': 'Relax in our stunning infinity pool with panoramic sea views',
    'amenities.fitness.title': 'Fitness Center',
    'amenities.fitness.desc': 'State-of-the-art gym equipment for your workout routine',
    'amenities.spa.title': 'Wellness & Spa',
    'amenities.spa.desc': 'Rejuvenate with our professional spa treatments',
    'amenities.restaurant.title': 'Fine Dining Restaurant',
    'amenities.restaurant.desc': 'Savor exquisite cuisine prepared by world-class chefs',
    'amenities.cafe.title': 'Seaside Café',
    'amenities.cafe.desc': 'Enjoy coffee and light bites with stunning ocean views',
    'amenities.bar.title': 'Rooftop Bar',
    'amenities.bar.desc': 'Unwind with premium cocktails and breathtaking sunset views',
    'amenities.wifi.title': 'High-Speed WiFi',
    'amenities.wifi.desc': 'Complimentary high-speed internet throughout the property',
    'amenities.security.title': '24/7 Security',
    'amenities.security.desc': 'Round-the-clock security and surveillance for your peace of mind',
    'amenities.reception.title': '24/7 Reception',
    'amenities.reception.desc': 'Our concierge team is always at your service',
    'amenities.parking.title': 'Secure Parking',
    'amenities.parking.desc': 'Complimentary parking with 24/7 security',
    'amenities.ac.title': 'Climate Control',
    'amenities.ac.desc': 'Individual air conditioning in every apartment',
    'amenities.concierge.title': 'Concierge Services',
    'amenities.concierge.desc': 'Personalized assistance for all your needs',
    
    // Purchase Conditions
    'purchase.hero.title': 'Purchase & Booking Conditions',
    'purchase.hero.subtitle': 'Clear, transparent terms for your peace of mind',
    'purchase.breadcrumb': 'Purchase Conditions',
    'purchase.payment.title': 'Payment Terms',
    'purchase.payment.content': 'We accept bank transfers, credit/debit cards, and cash. Full payment is required upon check-in unless pre-arranged. We offer flexible payment plans for extended stays. All major credit cards accepted.',
    'purchase.cancellation.title': 'Cancellation Policy',
    'purchase.cancellation.content': 'Free cancellation up to 7 days before arrival. Cancellations within 7 days incur a 50% charge. No-shows result in full charge. We understand plans change - contact us for special circumstances.',
    'purchase.deposit.title': 'Security Deposit',
    'purchase.deposit.content': 'A refundable security deposit may be required upon check-in. The amount varies by apartment type. Deposits are fully refunded after inspection, typically within 3-5 business days.',
    'purchase.refund.title': 'Refund Policy',
    'purchase.refund.content': 'Refunds are processed within 14 business days to your original payment method. Processing fees are non-refundable. For cancellations beyond the free period, partial refunds apply as per our cancellation policy.',
    'purchase.important.title': 'Important Information',
    'purchase.important.point1': 'Valid ID or passport required at check-in',
    'purchase.important.point2': 'Minimum age requirement: 18 years',
    'purchase.important.point3': 'Pets allowed with prior approval (additional fee may apply)',
    'purchase.updated': 'Last updated',
    'purchase.updateDate': 'January 2025',
    
    // Loyalty Program
    'nav.loyalty': 'Loyalty Program',
    'loyalty.hero.title': 'Orbi Rewards Program',
    'loyalty.hero.subtitle': 'Earn points with every stay and unlock exclusive benefits',
    'loyalty.hero.cta': 'Join Now - It\'s Free',
    'loyalty.howItWorks.title': 'How It Works',
    'loyalty.howItWorks.subtitle': 'Start earning rewards in three simple steps',
    'loyalty.step1.title': 'Create Account',
    'loyalty.step1.desc': 'Sign up for free and start earning immediately',
    'loyalty.step2.title': 'Earn Points',
    'loyalty.step2.desc': 'Get 10 points for every GEL spent on bookings',
    'loyalty.step3.title': 'Redeem Rewards',
    'loyalty.step3.desc': 'Use your points for discounts and exclusive perks',
    'loyalty.benefits.title': 'Member Benefits',
    'loyalty.benefits.subtitle': 'Exclusive advantages for our valued members',
    'loyalty.benefit1': 'Early check-in and late checkout when available',
    'loyalty.benefit2': 'Complimentary room upgrades (subject to availability)',
    'loyalty.benefit3': 'Priority booking during peak season',
    'loyalty.benefit4': 'Exclusive member-only rates and promotions',
    'loyalty.benefit5': 'Birthday surprises and anniversary gifts',
    'loyalty.testimonials.title': 'What Our Members Say',
    'loyalty.testimonial1': 'The loyalty program is amazing! I saved over 200 GEL on my last booking and got a free room upgrade!',
    'loyalty.testimonial2': 'Being a member has made my regular trips to Batumi so much better. The perks are real!',
    'loyalty.cta.title': 'Ready to Start Earning?',
    'loyalty.cta.subtitle': 'Join thousands of satisfied members today',
    'loyalty.cta.button': 'Create Free Account',
    
    // About Us
    'nav.about': 'About Us',
    'about.hero.title': 'About Orbi City Batumi',
    'about.hero.subtitle': 'Your gateway to unforgettable experiences on the Black Sea coast',
    'about.story.title': 'Our Story',
    'about.story.p1': 'Orbi City Batumi represents the pinnacle of modern aparthotel living on Georgia\'s stunning Black Sea coast. Since our inception, we have been dedicated to providing guests with an unparalleled blend of luxury, comfort, and authentic Georgian hospitality.',
    'about.story.p2': 'Strategically located in the heart of Batumi, just 50 meters from the pristine beach and walking distance to the city\'s main attractions, we offer the perfect base for both leisure and business travelers.',
    'about.story.p3': 'Our commitment to excellence is reflected in every detail - from our meticulously designed apartments featuring breathtaking sea views to our world-class amenities and personalized concierge services.',
    'about.mission.title': 'Our Mission',
    'about.mission.desc': 'To provide every guest with an extraordinary experience that exceeds expectations, combining the comfort of home with five-star luxury and authentic Georgian warmth.',
    'about.vision.title': 'Our Vision',
    'about.vision.desc': 'To be recognized as the premier aparthotel destination on the Black Sea coast, setting the standard for hospitality excellence and creating lasting memories for our guests.',
    'about.values.title': 'Our Core Values',
    'about.values.subtitle': 'The principles that guide everything we do',
    'about.value1.title': 'Guest-Centric Excellence',
    'about.value1.desc': 'Every decision we make puts our guests\' satisfaction and comfort first',
    'about.value2.title': 'Quality Without Compromise',
    'about.value2.desc': 'We maintain the highest standards in every aspect of our service',
    'about.value3.title': 'Innovation & Growth',
    'about.value3.desc': 'Continuously evolving to meet and exceed modern travelers\' needs',
    'about.stat1': 'Luxury Apartments',
    'about.stat2': 'Happy Guests',
    'about.stat3': 'Guest Rating',
    'about.stat4': 'Service',
    'about.gallery.title': 'Experience Orbi City',
    
    // Apartment Detail
    'apartmentDetail.notFound': 'Apartment not found',
    'apartmentDetail.backToList': 'Back to Apartments',
    'apartmentDetail.description': 'Description',
    'apartmentDetail.booking': 'Booking',
    'apartmentDetail.watchVideos': 'Watch Videos',
    
    // YouTube Videos
    'youtubeVideos.title': 'Video Gallery',
    'youtubeVideos.subtitle': 'Discover Orbi City Batumi through our videos',
    'youtubeVideos.breadcrumb': 'Videos',
    'youtubeVideos.error': 'Unable to load videos at this moment. Please try again later.',
    'youtubeVideos.noVideos': 'No videos available',
    
    // Apartments page additions
    'nav.apartments': 'Apartments',
  },
  ka: {
    // Navigation
    'nav.home': 'მთავარი',
    'nav.rooms': 'ოთახები',
    'nav.amenities': 'სერვისები',
    'nav.location': 'ლოკაცია',
    'nav.reviews': 'მიმოხილვები',
    'nav.contact': 'კონტაქტი',
    'nav.bookNow': 'დაჯავშნე ახლავე',
    
    // Hero
    'hero.title': 'თქვენი იდეალური სანაპირო დასვენება',
    'hero.subtitle': 'ლუქს აპარტამენტები ზღვის ხედით ბათუმის გულში',
    'hero.whatsapp': 'WhatsApp',
    
    // Booking Widget
    'booking.checkIn': 'დაბინავება',
    'booking.checkOut': 'დატოვება',
    'booking.guests': 'სტუმრები',
    'booking.checkAvailability': 'შეამოწმე ხელმისაწვდომობა',
    
    // Rooms
    'rooms.title': 'იპოვე შენი იდეალური სივრცე',
    'rooms.subtitle': 'თითოეული აპარტამენტი შექმნილია განსაკუთრებული გამოცდილებისთვის',
    'rooms.suite': 'სუიტი ზღვის ხედით',
    'rooms.suiteDesc': 'ელეგანტური სუიტი ზღვის თვალწარმტაცი ხედებით, იდეალური წყვილებისთვის',
    'rooms.deluxe': 'დელუქს სუიტი ზღვის ხედით',
    'rooms.deluxeDesc': 'უფრო ვრცელი და ლუქს სუიტი გაუმჯობესებული სერვისებით',
    'rooms.superior': 'სუპერიორ სუიტი ზღვის ხედით',
    'rooms.superiorDesc': 'პრემიუმ სუიტი ცალკე საცხოვრებელი სივრცით და საუკეთესო პანორამული ხედებით',
    'rooms.family': 'სუპერიორ ოჯახური სუიტი',
    'rooms.familyDesc': 'ვრცელი სუიტი რამდენიმე ოთახით, იდეალური ოჯახებისა და ჯგუფებისთვის',
    'rooms.twobed': 'ორ საძინებლიანი პანორამული სუიტი',
    'rooms.twobedDesc': 'ლუქსის მწვერვალი. ვრცელი სუიტი ორი საძინებლითა და შესანიშნავი პანორამული ტერასით',
    'rooms.viewDetails': 'იხილე დეტალები',
    'rooms.bookNow': 'დაჯავშნე ახლა',
    'rooms.from': 'დან',
    'rooms.night': '/ღამე',
    'rooms.size': 'ზომა',
    'rooms.guests': 'სტუმრები',
    
    // Amenities
    'amenities.title': 'მსოფლიო დონის სერვისები',
    'amenities.subtitle': 'ყველაფერი რაც გჭირდებათ შესანიშნავი დასვენებისთვის',
    'amenities.seaView': 'ზღვის ხედი',
    'amenities.fountains': 'ახლოს შადრევნებთან',
    'amenities.kitchen': 'სრული სამზარეულო',
    'amenities.reception': '24/7 რეცეფცია',
    'amenities.pool': 'საცურაო აუზი',
    'amenities.parking': 'პარკინგი',
    'amenities.wifi': 'უსადენო ინტერნეტი',
    'amenities.ac': 'კონდიციონერი',
    'amenities.housekeeping': 'დასუფთავება',
    'amenities.security': '24/7 უსაფრთხოება',
    'amenities.concierge': 'კონსიერჟ სერვისი',
    'amenities.restaurant': 'რესტორანი',
    
    // Location
    'location.title': 'პრიმიუმ ლოკაცია ბათუმში',
    'location.subtitle': 'რამდენიმე ნაბიჯით შავი ზღვისა და ძირითადი ღირსშესანიშნაობებიდან',
    'location.beach': 'შავი ზღვის პლაჟი',
    'location.beachDist': '50 მეტრი',
    'location.fountains': 'მომღერალი შადრევნები',
    'location.fountainsDist': '100 მეტრი',
    'location.airport': 'ბათუმის აეროპორტი',
    'location.airportDist': '5 კილომეტრი',
    
    // Reviews
    'reviews.title': 'სტუმრების მიმოხილვები',
    'reviews.subtitle': 'რას ამბობენ ჩვენი სტუმრები',
    'reviews.rating': 'სტუმრების შეფასება',
    'reviews.review1': 'შესანიშნავი ხედები შავ ზღვაზე! აპარტამენტი იყო ლუქსუსური და პერსონალი უზომოდ თბილი.',
    'reviews.review2': 'სრულყოფილი ლოკაცია პლაჟთან და შადრევნებთან ახლოს. აპარტამენტი სუფთა და კარგად აღჭურვილი.',
    'reviews.review3': 'საოცარი გამოცდილება! ზღვის ხედი ბალკონიდან თვალწარმტაცი იყო. ძალიან გირჩევთ!',
    
    // CTA
    'cta.title': 'მზად ხართ განსაკუთრებული გამოცდილებისთვის?',
    'cta.subtitle': 'დაჯავშნეთ თქვენი იდეალური აპარტამენტი დღეს',
    'cta.button': 'დაჯავშნე ახლა',
    
    // Footer
    'footer.description': 'ლუქს სერვისული აპარტამენტები ბათუმის გულში, საქართველო. შავი ზღვის პირას.',
    'footer.quickLinks': 'სწრაფი ბმულები',
    'footer.contact': 'დაგვიკავშირდით',
    'footer.phone': 'ტელეფონი',
    'footer.email': 'ელ-ფოსტა',
    'footer.address': 'მისამართი',
    'footer.followUs': 'გამოგვყევით',
    'footer.rights': '© 2025 ორბი სითი ბათუმი. ყველა უფლება დაცულია.',
    
    // Apartments Page
    'apartments.hero.title': 'ლუქს აპარტამენტები ბათუმში',
    'apartments.hero.subtitle': 'აღმოაჩინეთ ზღვის ხედით აპარტამენტების განსაკუთრებული კოლექცია, თითოეული შექმნილია მაქსიმალური კომფორტისა და განსაკუთრებულობისთვის. ინტიმური სუიტებიდან ვრცელ ოჯახურ საცხოვრებლებამდე.',
    'apartments.section.title': 'იპოვეთ თქვენი იდეალური სივრცე',
    'apartments.section.subtitle': 'თითოეული აპარტამენტი შექმნილია განსაკუთრებული გამოცდილებისთვის. იკვლიეთ ჩვენი შეთავაზებები და იპოვეთ ის, რაც თქვენთვის შესაფერისია.',
    'apartments.sqm': 'კვ.მ.',
    'apartments.guests': 'სტუმარი',
    'apartments.bed': 'საწოლი',
    'apartments.beds': 'საწოლი',
    'apartments.sofaBed': 'დივანი',
    'apartments.bath': 'აბაზანა',
    'apartments.baths': 'აბაზანა',
    'apartments.bidet': 'ბიდე',
    'apartments.keyFeatures': 'ძირითადი მახასიათებლები',
    'apartments.bookNow': 'დაჯავშნე ახლა / გადაიხადე მოგვიანებით',
    'apartments.checkAvailability': 'შეამოწმე ხელმისაწვდომობა',
    
    // Suite
    'apartments.suite.title': 'სუიტი ზღვის ხედით',
    'apartments.suite.desc': 'ელეგანტური სუიტი შავი ზღვის თვალწარმტაცი პანორამული ხედებით. იდეალურია წყვილებისთვის ან მოგზაურებისთვის, რომლებიც ეძებენ მშვიდ თავშესაფარს თანამედროვე სიახლეებით. გამოეღვიძეთ შემაგდებელი განთიადისგან თქვენი პირადი აივნიდან.',
    'apartments.suite.feature1': 'პირადი აივანი ზღვის ხედით',
    'apartments.suite.feature2': 'სრულად აღჭურვილი მინი სამზარეულო',
    'apartments.suite.feature3': 'მაღალსიჩქარიანი WiFi',
    'apartments.suite.feature4': 'ჭკვიანი კლიმატკონტროლი',
    'apartments.suite.feature5': '55" Smart TV სტრიმინგით',
    'apartments.suite.feature6': 'King Size საწოლი პრემიუმ თეთრეულით',
    
    // Deluxe
    'apartments.deluxe.title': 'დელუქს სუიტი ზღვის ხედით',
    'apartments.deluxe.desc': 'უფრო ვრცელი და ლუქსუზური სუიტი გაუმჯობესებული სერვისებით და პრიმიუმ ზღვის ხედებით. შექმნილია მომთხოვნი სტუმრებისთვის, რომლებიც აფასებენ დეტალებზე ყურადღებას და კომფორტს. ცალკე სამ სივრცე უზრუნველყოფს დამატებით ადგილს დასასვენებლად.',
    'apartments.deluxe.feature1': 'ვრცელი აივანი ზღვის ხედით',
    'apartments.deluxe.feature2': 'ცალკე საცხოვრებელი და სასადილო',
    'apartments.deluxe.feature3': 'სრული სამზარეულო პრემიუმ ტექნიკით',
    'apartments.deluxe.feature4': 'უფასო მაღალსიჩქარიანი WiFi',
    'apartments.deluxe.feature5': 'ორზონიანი კლიმატკონტროლი',
    'apartments.deluxe.feature6': 'პრემიუმ გასართობი სისტემა',
    
    // Superior
    'apartments.superior.title': 'სუპერიორ სუიტი ზღვის ხედით',
    'apartments.superior.desc': 'ჩვენი პრემიუმ სუიტი ცალკე საძინებლით, ლუქსუზური საცხოვრებელი სივრცით და შავი ზღვის საუკეთესო პანორამული ხედებით. იდეალურია სტუმრებისთვის, რომლებსაც სურთ დამატებითი სივრცე და პრემიუმ სერვისები. კუთხური მდებარეობა უზრუნველყოფს მაქსიმალურ ბუნებრივ სინათლეს.',
    'apartments.superior.feature1': 'კუთხური პანორამული ზღვის ხედები',
    'apartments.superior.feature2': 'ერთი ცალკე საძინებელი',
    'apartments.superior.feature3': 'ვრცელი სასადილო ზონა',
    'apartments.superior.feature4': 'თანამედროვე სრული აბაზანა',
    'apartments.superior.feature5': 'დიზაინერული მინი სამზარეულო',
    'apartments.superior.feature6': 'ლუქს აბაზანის აქსესუარები',
    'apartments.superior.feature7': 'King Size საწოლი ჭერის სარკეებით',
    
    // Family
    'apartments.family.title': 'სუპერიორ ოჯახური სუიტი ზღვის ხედით',
    'apartments.family.desc': 'ვრცელი სუიტი ორი საძინებლით და ორი აბაზანით, იდეალურია ოჯახებისთვის ან 6 სტუმრამდე ჯგუფებისთვის. ისიამოვნეთ კომფორტით და კონფიდენციალურობით ცალკე საძინებლებით, ვრცელ საცხოვრებელ სივრცეში კავშირის შენარჩუნებით. იდეალურია საყვარელებთან დაუვიწყარი მოგონებების შესაქმნელად.',
    'apartments.family.feature1': 'ვრცელი პირადი აივანი',
    'apartments.family.feature2': 'ორი ცალკე საძინებელი',
    'apartments.family.feature3': 'ორი სრული აბაზანა ბიდეთით',
    'apartments.family.feature4': 'სრული სამზარეულო და სასადილო ზონა',
    'apartments.family.feature5': 'სარეცხი მანქანა',
    'apartments.family.feature6': 'კონსიერჟის პრიორიტეტული სერვისები',
    'apartments.family.feature7': 'King Size საწოლები პრემიუმ ფუნქციებით',
    
    // Two Bedroom
    'apartments.twobed.title': 'ორ საძინებლიანი პანორამული სუიტი',
    'apartments.twobed.desc': 'ლუქსის მწვერვალი ბათუმში. ეს ვრცელი სუიტი შეიცავს ორ მასტერ საძინებელს და სანახაობრივ 270° პანორამულ ტერასას შავი ზღვის შეუფერხებელი ხედებით. იდეალურია ოჯახებისთვის ან ჯგუფებისთვის, რომლებიც ეძებენ სივრცის, კომფორტისა და თვალწარმტაცი პეიზაჟის ულტიმატს.',
    'apartments.twobed.feature1': '270° პანორამული ოკეანის ტერასა',
    'apartments.twobed.feature2': '2 მასტერ საძინებელი ინდივიდუალური აბაზანებით',
    'apartments.twobed.feature3': '2 გარდასაქმნელი დივანი',
    'apartments.twobed.feature4': '2 King Size საწოლი ჭერის სარკეებით',
    'apartments.twobed.feature5': 'გურმანული სამზარეულო',
    'apartments.twobed.feature6': 'დიზაინერული ლუქს მებელი',
    'apartments.twobed.feature7': 'ულტიმატური ზღვისა და ქალაქის ხედები',
    
    // Location Page
    'location.page.title': 'პრიმიუმ ლოკაცია სანაპიროზე',
    'location.page.subtitle': 'შესანიშნავად მოთავსებული ბათუმის გულში, რამდენიმე ნაბიჯით შავი ზღვისა და ძირითადი ღირსშესანიშნაობებიდან. გამოცადეთ სანაპირო ცხოვრების საუკეთესო შეუდარებელი მოხერხებულობით.',
    
    // Amenities (კარგი)
    'amenities.hero.title': 'მსოფლიო კლასის სერვისები',
    'amenities.hero.subtitle': 'ყველაფერი რაც გჭირდებათ დაუვიწყარი დასვენებისთვის',
    'amenities.premium.title': 'პრემიუმ ობიექტები',
    'amenities.premium.subtitle': 'ისიამოვნეთ ჩვენი ექსკლუზიური სერვისებით',
    'amenities.standard.title': 'ძირითადი სერვისები',
    'amenities.standard.subtitle': 'ყველა მოხერხებულობა რაც მოელით და მეტი',
    'amenities.pool.title': 'აუზი და SPA',
    'amenities.pool.desc': 'დაისვენეთ ჩვენს განსაცვიფრებელ აუზში ზღვის პანორამული ხედებით',
    'amenities.fitness.title': 'ფიტნეს ცენტრი',
    'amenities.fitness.desc': 'თანამედროვე ვარჯიშის მოწყობილობები თქვენი ტრენინგისთვის',
    'amenities.spa.title': 'SPA და ველნესი',
    'amenities.spa.desc': 'განახლდით ჩვენი პროფესიონალური SPA პროცედურებით',
    'amenities.restaurant.title': 'ფაინ დაინინგ რესტორანი',
    'amenities.restaurant.desc': 'ისიამოვნეთ განსაკუთრებული კერძებით',
    'amenities.cafe.title': 'სანაპირო კაფე',
    'amenities.cafe.desc': 'დატკბით ყავითა და საჭმლით ოკეანის ხედებით',
    'amenities.bar.title': 'სახურავის ბარი',
    'amenities.bar.desc': 'დაისვენეთ პრემიუმ კოქტეილებით და მზის ჩასვლის ხედებით',
    'amenities.wifi.title': 'მაღალსიჩქარიანი WiFi',
    'amenities.wifi.desc': 'უფასო მაღალსიჩქარიანი ინტერნეტი მთელ ტერიტორიაზე',
    'amenities.security.title': '24/7 უსაფრთხოება',
    'amenities.security.desc': 'მუდმივი უსაფრთხოება და ზედამხედველობა',
    'amenities.reception.title': '24/7 რეცეფცია',
    'amenities.reception.desc': 'ჩვენი კონსიერჟის გუნდი ყოველთვის თქვენს სერვისშია',
    'amenities.parking.title': 'დაცული პარკინგი',
    'amenities.parking.desc': 'უფასო პარკინგი 24/7 უსაფრთხოებით',
    'amenities.ac.title': 'კლიმატკონტროლი',
    'amenities.ac.desc': 'ინდივიდუალური კონდიციონერი ყველა აპარტამენტში',
    'amenities.concierge.title': 'კონსიერჟ სერვისი',
    'amenities.concierge.desc': 'პერსონალიზებული დახმარება თქვენი ყველა საჭიროებისთვის',
    
    // Purchase Conditions
    'purchase.hero.title': 'შეძენისა და ბუქინგის პირობები',
    'purchase.hero.subtitle': 'გამჭვირვალე პირობები თქვენი სიმშვიდისთვის',
    'purchase.breadcrumb': 'შეძენის პირობები',
    'purchase.payment.title': 'გადახდის პირობები',
    'purchase.payment.content': 'ჩვენ ვიღებთ საბანკო გადარიცხვებს, საკრედიტო/სადებეტო ბარათებს და ნაღდს. სრული გადახდა საჭიროა დაბინავებისას, თუ წინასწარ არ არის შეთანხმებული. ვთავაზობთ მოქნილ გადახდის გეგმებს გრძელვადიანი ყოფნისთვის.',
    'purchase.cancellation.title': 'გაუქმების პოლიტიკა',
    'purchase.cancellation.content': 'უფასო გაუქმება ჩამოსვლამდე 7 დღემდე. 7 დღეში გაუქმება იწვევს 50% საფასურს. გამოუცხადებლობა იწვევს სრულ საფასურს. ვაცნობიერებთ, რომ გეგმები იცვლება - დაგვიკავშირდით განსაკუთრებული შემთხვევებისთვის.',
    'purchase.deposit.title': 'დაზღვევის დეპოზიტი',
    'purchase.deposit.content': 'დაბინავებისას შეიძლება მოთხოვნილი იყოს დაზღვევის დეპოზიტი. თანხა განსხვავდება აპარტამენტის ტიპის მიხედვით. დეპოზიტები სრულად უბრუნდება შემოწმების შემდეგ, ჩვეულებრივ 3-5 სამუშაო დღის განმავლობაში.',
    'purchase.refund.title': 'დაბრუნების პოლიტიკა',
    'purchase.refund.content': 'თანხები უბრუნდება 14 სამუშაო დღის განმავლობაში თქვენს ორიგინალურ გადახდის მეთოდზე. დამუშავების საფასური არ უბრუნდება. უფასო პერიოდის შემდეგ გაუქმებისთვის ვრცელდება ნაწილობრივი დაბრუნება.',
    'purchase.important.title': 'მნიშვნელოვანი ინფორმაცია',
    'purchase.important.point1': 'დაბინავებისას საჭიროა მოქმედი პირადობის მოწმობა ან პასპორტი',
    'purchase.important.point2': 'მინიმალური ასაკი: 18 წელი',
    'purchase.important.point3': 'შინაური ცხოველები დაშვებულია წინასწარი თანხმობით (შესაძლოა დამატებითი საფასური)',
    'purchase.updated': 'ბოლო განახლება',
    'purchase.updateDate': 'იანვარი 2025',
    
    // Loyalty Program
    'nav.loyalty': 'ლოიალობის პროგრამა',
    'loyalty.hero.title': 'Orbi ჯილდოების პროგრამა',
    'loyalty.hero.subtitle': 'დააგროვეთ ქულები ყოველი ყოფნით და მიიღეთ ექსკლუზიური სარგებელი',
    'loyalty.hero.cta': 'შემოგვიერთდი - უფასოა',
    'loyalty.howItWorks.title': 'როგორ მუშაობს',
    'loyalty.howItWorks.subtitle': 'დაიწყეთ ჯილდოების მოპოვება სამ მარტივ ნაბიჯად',
    'loyalty.step1.title': 'შექმენით ანგარიში',
    'loyalty.step1.desc': 'დარეგისტრირდით უფასოდ და დაიწყეთ მოპოვება დაუყოვნებლივ',
    'loyalty.step2.title': 'დააგროვეთ ქულები',
    'loyalty.step2.desc': 'მიიღეთ 10 ქულა ყოველი დახარჯული ლარისთვის',
    'loyalty.step3.title': 'გამოიყენეთ ჯილდოები',
    'loyalty.step3.desc': 'გამოიყენეთ თქვენი ქულები ფასდაკლებებისა და ექსკლუზიური პრივილეგიებისთვის',
    'loyalty.benefits.title': 'წევრის სარგებელი',
    'loyalty.benefits.subtitle': 'ექსკლუზიური უპირატესობები ჩვენი ღირებული წევრებისთვის',
    'loyalty.benefit1': 'ადრეული დაბინავება და გვიანი დატოვება ხელმისაწვდომობის შემთხვევაში',
    'loyalty.benefit2': 'უფასო ნომრის გაუმჯობესება (ხელმისაწვდომობის შემთხვევაში)',
    'loyalty.benefit3': 'პრიორიტეტული დაჯავშნა პიკურ სეზონზე',
    'loyalty.benefit4': 'ექსკლუზიური წევრებისთვის განკუთვნილი ტარიფები და აქციები',
    'loyalty.benefit5': 'დაბადების დღისა და იუბილეების მოულოდნელობები',
    'loyalty.testimonials.title': 'რას ამბობენ ჩვენი წევრები',
    'loyalty.testimonial1': 'ლოიალობის პროგრამა საოცარია! ბოლო დაჯავშნაზე დავზოგე 200 ლარზე მეტი და მივიღე უფასო ნომრის გაუმჯობესება!',
    'loyalty.testimonial2': 'წევრობა ბათუმში ჩემს რეგულარულ მოგზაურობებს გაცილებით უკეთესს ხდის. პრივილეგიები რეალურია!',
    'loyalty.cta.title': 'მზად ხართ დაწყებისთვის?',
    'loyalty.cta.subtitle': 'შემოუერთდით ათასობით კმაყოფილ წევრს დღეს',
    'loyalty.cta.button': 'შექმენით უფასო ანგარიში',
    
    // About Us
    'nav.about': 'ჩვენს შესახებ',
    'about.hero.title': 'ორბი სითი ბათუმის შესახებ',
    'about.hero.subtitle': 'თქვენი კარიბჭე დაუვიწყარი გამოცდილებებისკენ შავი ზღვის სანაპიროზე',
    'about.story.title': 'ჩვენი ისტორია',
    'about.story.p1': 'ორბი სითი ბათუმი წარმოადგენს თანამედროვე აპარტოტელის ცხოვრების მწვერვალს საქართველოს შავი ზღვის სანაპიროზე. დაარსებიდან, ჩვენ ვუძღვნით თავს სტუმრებისთვის ლუქსის, კომფორტისა და ავთენტური ქართული სტუმართმოყვარეობის უბადლო ნაზავის უზრუნველყოფას.',
    'about.story.p2': 'სტრატეგიულად მდებარე ბათუმის გულში, მხოლოდ 50 მეტრში პატკარი პლაჟიდან და ქალაქის მთავარ ღირსშესანიშნაობებთან ახლოს, ჩვენ ვთავაზობთ სრულყოფილ ბაზას როგორც დასვენებისთვის, ისე ბიზნეს მოგზაურებისთვის.',
    'about.story.p3': 'ჩვენი ერთგულება ხარისხს აისახება ყოველ დეტალში - ჩვენი საგულდაგულოდ დიზაინში გაფორმებული აპარტამენტებიდან შემაგდებელი ზღვის ხედებით მსოფლიო კლასის სერვისებამდე და პერსონალიზებულ კონსიერჟ სერვისებამდე.',
    'about.mission.title': 'ჩვენი მისია',
    'about.mission.desc': 'თითოეულ სტუმარს მივაწოდოთ არაჩვეულებრივი გამოცდილება, რომელიც აღემატება მოლოდინებს, აერთიანებს სახლის კომფორტს ხუთვარსკვლავიანი ლუქსით და ავთენტური ქართული სითბით.',
    'about.vision.title': 'ჩვენი ხედვა',
    'about.vision.desc': 'ვიყოთ აღიარებული, როგორც პრემიერ აპარტოტელის დანიშნულების ადგილი შავი ზღვის სანაპიროზე, ვაყენებთ სტანდარტს სტუმართმოყვარეობის შესანიშნაობისთვის და ვქმნით დაუვიწყარ მოგონებებს ჩვენი სტუმრებისთვის.',
    'about.values.title': 'ჩვენი ძირითადი ღირებულებები',
    'about.values.subtitle': 'პრინციპები, რომლებიც წარმართავს ყველაფერს რასაც ვაკეთებთ',
    'about.value1.title': 'სტუმრის ცენტრირებული ხარისხი',
    'about.value1.desc': 'ყოველი გადაწყვეტილება, რომელსაც ვიღებთ, პირველ რიგში ითვალისწინებს ჩვენი სტუმრების კმაყოფილებას',
    'about.value2.title': 'ხარისხი კომპრომისის გარეშე',
    'about.value2.desc': 'ვინარჩუნებთ უმაღლეს სტანდარტებს ჩვენი სერვისის ყველა ასპექტში',
    'about.value3.title': 'ინოვაცია და ზრდა',
    'about.value3.desc': 'მუდმივად ვითვითარდებით თანამედროვე მოგზაურების საჭიროებების დასაკმაყოფილებლად',
    'about.stat1': 'ლუქს აპარტამენტი',
    'about.stat2': 'ბედნიერი სტუმარი',
    'about.stat3': 'სტუმრის რეიტინგი',
    'about.stat4': 'სერვისი',
    'about.gallery.title': 'გამოცადეთ ორბი სითი',
    
    // Apartment Detail
    'apartmentDetail.notFound': 'აპარტამენტი ვერ მოიძებნა',
    'apartmentDetail.backToList': 'უკან აპარტამენტებზე',
    'apartmentDetail.description': 'აღწერა',
    'apartmentDetail.booking': 'დაჯავშნა',
    'apartmentDetail.watchVideos': 'ვიდეოების ნახვა',
    
    // YouTube Videos
    'youtubeVideos.title': 'ვიდეო გალერეა',
    'youtubeVideos.subtitle': 'აღმოაჩინეთ ორბი სითი ბათუმი ჩვენი ვიდეოების მეშვეობით',
    'youtubeVideos.breadcrumb': 'ვიდეოები',
    'youtubeVideos.error': 'ვიდეოების ჩატვირთვა ამჟამად შეუძლებელია. გთხოვთ სცადოთ მოგვიანებით.',
    'youtubeVideos.noVideos': 'ვიდეოები მიუწვდომელია',
    
    // Apartments page additions
    'nav.apartments': 'აპარტამენტები',
  },
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.rooms': 'Номера',
    'nav.amenities': 'Удобства',
    'nav.location': 'Расположение',
    'nav.reviews': 'Отзывы',
    'nav.contact': 'Контакты',
    'nav.bookNow': 'Забронировать',
    
    // Hero
    'hero.title': 'Ваш Идеальный Приморский Отдых',
    'hero.subtitle': 'Роскошные Апартаменты с Видом на Море в Сердце Батуми',
    'hero.whatsapp': 'WhatsApp',
    
    // Booking Widget
    'booking.checkIn': 'Заезд',
    'booking.checkOut': 'Выезд',
    'booking.guests': 'Гости',
    'booking.checkAvailability': 'Проверить Доступность',
    
    // Rooms
    'rooms.title': 'Найдите Свое Идеальное Пространство',
    'rooms.subtitle': 'Каждый апартамент тщательно спроектирован для незабываемых впечатлений',
    'rooms.suite': 'Люкс с Видом на Море',
    'rooms.suiteDesc': 'Элегантный люкс с захватывающим видом на море, идеален для пар',
    'rooms.deluxe': 'Делюкс Люкс с Видом на Море',
    'rooms.deluxeDesc': 'Более просторный и роскошный люкс с улучшенными удобствами',
    'rooms.superior': 'Супериор Люкс с Видом на Море',
    'rooms.superiorDesc': 'Премиальный люкс с отдельной гостиной и лучшими панорамными видами',
    'rooms.family': 'Супериор Семейный Люкс',
    'rooms.familyDesc': 'Просторный люкс с несколькими комнатами, идеален для семей и групп',
    'rooms.twobed': 'Двухкомнатный Панорамный Люкс',
    'rooms.twobedDesc': 'Вершина роскоши. Просторный люкс с двумя спальнями и потрясающей панорамной террасой',
    'rooms.viewDetails': 'Подробнее',
    'rooms.bookNow': 'Забронировать',
    'rooms.from': 'От',
    'rooms.night': '/ночь',
    'rooms.size': 'Площадь',
    'rooms.guests': 'Гостей',
    
    // Amenities
    'amenities.title': 'Удобства Мирового Класса',
    'amenities.subtitle': 'Все необходимое для идеального отдыха',
    'amenities.seaView': 'Вид на Море',
    'amenities.fountains': 'Рядом с Фонтанами',
    'amenities.kitchen': 'Полная Кухня',
    'amenities.reception': 'Ресепшн 24/7',
    'amenities.pool': 'Бассейн',
    'amenities.parking': 'Парковка',
    'amenities.wifi': 'Скоростной WiFi',
    'amenities.ac': 'Кондиционер',
    'amenities.housekeeping': 'Уборка',
    'amenities.security': 'Охрана 24/7',
    'amenities.concierge': 'Консьерж',
    'amenities.restaurant': 'Ресторан',
    
    // Location
    'location.title': 'Премиальное Расположение в Батуми',
    'location.subtitle': 'В нескольких шагах от Черного моря и главных достопримечательностей',
    'location.beach': 'Пляж Черного Моря',
    'location.beachDist': '50 метров',
    'location.fountains': 'Поющие Фонтаны',
    'location.fountainsDist': '100 метров',
    'location.airport': 'Аэропорт Батуми',
    'location.airportDist': '5 километров',
    
    // Reviews
    'reviews.title': 'Отзывы Гостей',
    'reviews.subtitle': 'Что говорят о нас наши гости',
    'reviews.rating': 'Оценка Гостей',
    'reviews.review1': 'Потрясающие виды на Черное море! Апартаменты роскошные, персонал невероятно приветливый.',
    'reviews.review2': 'Идеальное расположение рядом с пляжем и фонтанами. Апартаменты чистые и хорошо оборудованные.',
    'reviews.review3': 'Восхитительный опыт! Вид на море с нашего балкона был захватывающим. Очень рекомендую!',
    
    // CTA
    'cta.title': 'Готовы Испытать Роскошь у Моря?',
    'cta.subtitle': 'Забронируйте свои идеальные апартаменты сегодня',
    'cta.button': 'Забронировать',
    
    // Footer
    'footer.description': 'Роскошные апартаменты с обслуживанием в сердце Батуми, Грузия. В шагах от Черного моря.',
    'footer.quickLinks': 'Быстрые Ссылки',
    'footer.contact': 'Свяжитесь с Нами',
    'footer.phone': 'Телефон',
    'footer.email': 'Email',
    'footer.address': 'Адрес',
    'footer.followUs': 'Подписаться',
    'footer.rights': '© 2025 Орби Сити Батуми. Все права защищены.',
    
    // Apartments Page (same structure as English, just translated)
    'apartments.hero.title': 'Роскошные Апартаменты в Батуми',
    'apartments.hero.subtitle': 'Откройте для себя изысканную коллекцию апартаментов с видом на море, каждый из которых создан для максимального комфорта и изысканности.',
    'apartments.section.title': 'Найдите Свое Идеальное Пространство',
    'apartments.section.subtitle': 'Каждый апартамент тщательно спроектирован для незабываемых впечатлений.',
    'apartments.sqm': 'кв.м.',
    'apartments.guests': 'Гостей',
    'apartments.beds': 'Кроватей',
    'apartments.baths': 'Ванных',
    'apartments.keyFeatures': 'Ключевые Особенности',
    'apartments.bookNow': 'Забронировать / Оплатить Позже',
    'apartments.checkAvailability': 'Проверить Доступность',
    'apartments.suite.title': 'Люкс с Видом на Море',
    'apartments.suite.desc': 'Элегантный люкс с захватывающими панорамными видами на Черное море.',
    'apartments.suite.feature1': 'Балкон с видом на море',
    'apartments.suite.feature2': 'Полностью оборудованная кухня',
    'apartments.suite.feature3': 'Высокоскоростной WiFi',
    'apartments.suite.feature4': 'Климат-контроль',
    'apartments.suite.feature5': '55" Smart TV',
    'apartments.suite.feature6': 'King Size кровать',
    'apartments.suite.feature7': 'Диван-кровать',
    'apartments.deluxe.title': 'Делюкс Люкс с Видом на Море',
    'apartments.deluxe.desc': 'Более просторный роскошный люкс с улучшенными удобствами.',
    'apartments.deluxe.feature1': 'Большой балкон',
    'apartments.deluxe.feature2': 'Отдельная гостиная',
    'apartments.deluxe.feature3': 'Полная кухня',
    'apartments.deluxe.feature4': 'WiFi',
    'apartments.deluxe.feature5': 'Климат-контроль',
    'apartments.deluxe.feature6': 'Smart TV',
    'apartments.superior.title': 'Супериор Люкс',
    'apartments.superior.desc': 'Премиум люкс с отдельной спальней.',
    'apartments.superior.feature1': 'Панорамные виды',
    'apartments.superior.feature2': 'Спальня',
    'apartments.superior.feature3': 'Столовая',
    'apartments.superior.feature4': 'Ванная',
    'apartments.superior.feature5': 'Кухня',
    'apartments.superior.feature6': 'Премиум удобства',
    'apartments.superior.feature7': 'King кровать',
    'apartments.superior.feature8': 'Диван',
    'apartments.family.title': 'Семейный Люкс',
    'apartments.family.desc': 'Просторный люкс для семей до 6 человек.',
    'apartments.family.feature1': 'Балкон',
    'apartments.family.feature2': '2 спальни',
    'apartments.family.feature3': 'Кухня',
    'apartments.family.feature4': 'Развлечения',
    'apartments.family.feature5': 'Стиральная машина',
    'apartments.family.feature6': 'Консьерж',
    'apartments.family.feature7': 'King кровать',
    'apartments.family.feature8': 'Диван',
    'apartments.twobed.title': 'Двухкомнатный Люкс',
    'apartments.twobed.desc': 'Вершина роскоши с панорамной террасой.',
    'apartments.twobed.feature1': '270° терраса',
    'apartments.twobed.feature2': '2 спальни',
    'apartments.twobed.feature3': '2 дивана',
    'apartments.twobed.feature4': '2 King кровати',
    'apartments.twobed.feature5': 'Кухня',
    'apartments.twobed.feature6': 'Люкс мебель',
    'apartments.twobed.feature7': 'Виды',
    'location.page.title': 'Премиум Расположение',
    'location.page.subtitle': 'В центре Батуми, у моря.',
  },
  tr: {
    // Navigation
    'nav.home': 'Ana Sayfa',
    'nav.rooms': 'Odalar',
    'nav.amenities': 'Olanaklar',
    'nav.location': 'Konum',
    'nav.reviews': 'Yorumlar',
    'nav.contact': 'İletişim',
    'nav.bookNow': 'Rezervasyon',
    
    // Hero
    'hero.title': 'Mükemmel Deniz Kenarı Kaçışınız',
    'hero.subtitle': 'Batum\'un Kalbinde Lüks Deniz Manzaralı Apartmanlar',
    'hero.whatsapp': 'WhatsApp',
    
    // Booking Widget
    'booking.checkIn': 'Giriş',
    'booking.checkOut': 'Çıkış',
    'booking.guests': 'Misafirler',
    'booking.checkAvailability': 'Müsaitlik Kontrol',
    
    // Rooms
    'rooms.title': 'Mükemmel Alanınızı Bulun',
    'rooms.subtitle': 'Her apartman eşsiz bir deneyim sunmak için özenle tasarlanmıştır',
    'rooms.suite': 'Deniz Manzaralı Suit',
    'rooms.suiteDesc': 'Çiftler için mükemmel, nefes kesici deniz manzaralı zarif suit',
    'rooms.deluxe': 'Deluxe Deniz Manzaralı Suit',
    'rooms.deluxeDesc': 'Gelişmiş olanaklar ve birinci sınıf deniz manzarası ile daha geniş lüks suit',
    'rooms.superior': 'Superior Deniz Manzaralı Suit',
    'rooms.superiorDesc': 'Ayrı oturma alanı ve en iyi panoramik deniz manzaralı premium suit',
    'rooms.family': 'Superior Aile Suiti',
    'rooms.familyDesc': 'Aileler ve gruplar için mükemmel, birden fazla odalı geniş suit',
    'rooms.twobed': 'İki Yatak Odalı Panoramik Suit',
    'rooms.twobedDesc': 'Lüksün zirvesi. İki yatak odası ve muhteşem panoramik terası olan geniş suit',
    'rooms.viewDetails': 'Detayları Gör',
    'rooms.bookNow': 'Rezervasyon Yap',
    'rooms.from': 'Dan',
    'rooms.night': '/gece',
    'rooms.size': 'Boyut',
    'rooms.guests': 'Misafir',
    
    // Amenities
    'amenities.title': 'Dünya Standartlarında Olanaklar',
    'amenities.subtitle': 'Mükemmel bir konaklama için ihtiyacınız olan her şey',
    'amenities.seaView': 'Deniz Manzarası',
    'amenities.fountains': 'Fıskiyelere Yakın',
    'amenities.kitchen': 'Tam Mutfak',
    'amenities.reception': '24/7 Resepsiyon',
    'amenities.pool': 'Yüzme Havuzu',
    'amenities.parking': 'Otopark',
    'amenities.wifi': 'Hızlı WiFi',
    'amenities.ac': 'Klima',
    'amenities.housekeeping': 'Temizlik',
    'amenities.security': '24/7 Güvenlik',
    'amenities.concierge': 'Concierge',
    'amenities.restaurant': 'Restoran',
    
    // Location
    'location.title': 'Batum\'da Premium Konum',
    'location.subtitle': 'Karadeniz ve önemli turistik noktalara adım mesafede',
    'location.beach': 'Karadeniz Plajı',
    'location.beachDist': '50 metre',
    'location.fountains': 'Dans Eden Fıskiyeler',
    'location.fountainsDist': '100 metre',
    'location.airport': 'Batum Havalimanı',
    'location.airportDist': '5 kilometre',
    
    // Reviews
    'reviews.title': 'Misafir Yorumları',
    'reviews.subtitle': 'Misafirlerimiz hakkımızda ne diyor',
    'reviews.rating': 'Misafir Puanı',
    'reviews.review1': 'Karadeniz\'in muhteşem manzaraları! Apartman lükstü ve personel inanılmaz derecede misafirpervervdi.',
    'reviews.review2': 'Plaja ve fıskiyelere yakın mükemmel konum. Apartman tertemiz ve iyi donanımlıydı.',
    'reviews.review3': 'Harika deneyim! Balkonumuzdan deniz manzarası nefes kesiciydi. Kesinlikle tavsiye ederim!',
    
    // CTA
    'cta.title': 'Deniz Kenarında Lüks Yaşamaya Hazır mısınız?',
    'cta.subtitle': 'Mükemmel apartmanınızı bugün rezerve edin',
    'cta.button': 'Rezervasyon Yap',
    
    // Footer
    'footer.description': 'Gürcistan, Batum\'un kalbinde lüks servisliFapartmanlar. Karadeniz\'e adım mesafesinde.',
    'footer.quickLinks': 'Hızlı Bağlantılar',
    'footer.contact': 'Bize Ulaşın',
    'footer.phone': 'Telefon',
    'footer.email': 'E-posta',
    'footer.address': 'Adres',
    'footer.followUs': 'Takip Edin',
    'footer.rights': '© 2025 Orbi City Batumi. Tüm hakları saklıdır.',
  },
  uk: {
    // Navigation
    'nav.home': 'Головна',
    'nav.rooms': 'Номери',
    'nav.amenities': 'Зручності',
    'nav.location': 'Розташування',
    'nav.reviews': 'Відгуки',
    'nav.contact': 'Контакти',
    'nav.bookNow': 'Забронювати',
    
    // Hero
    'hero.title': 'Ваш Ідеальний Приморський Відпочинок',
    'hero.subtitle': 'Розкішні Апартаменти з Видом на Море в Серці Батумі',
    'hero.whatsapp': 'WhatsApp',
    
    // Booking Widget
    'booking.checkIn': 'Заїзд',
    'booking.checkOut': 'Виїзд',
    'booking.guests': 'Гості',
    'booking.checkAvailability': 'Перевірити Доступність',
    
    // Rooms
    'rooms.title': 'Знайдіть Ваш Ідеальний Простір',
    'rooms.subtitle': 'Кожен апартамент ретельно спроектований для неперевершених вражень',
    'rooms.suite': 'Люкс з Видом на Море',
    'rooms.suiteDesc': 'Елегантний люкс із захоплюючим видом на море, ідеальний для пар',
    'rooms.deluxe': 'Делюкс Люкс з Видом на Море',
    'rooms.deluxeDesc': 'Більш просторий та розкішний люкс з покращеними зручностями',
    'rooms.superior': 'Суперіор Люкс з Видом на Море',
    'rooms.superiorDesc': 'Преміум люкс з окремою вітальнею та найкращими панорамними видами',
    'rooms.family': 'Суперіор Сімейний Люкс',
    'rooms.familyDesc': 'Просторий люкс з кількома кімнатами, ідеальний для сімей та груп',
    'rooms.twobed': 'Двокімнатний Панорамний Люкс',
    'rooms.twobedDesc': 'Вершина розкоші. Просторий люкс з двома спальнями та приголомшливою панорамною терасою',
    'rooms.viewDetails': 'Детальніше',
    'rooms.bookNow': 'Забронювати',
    'rooms.from': 'Від',
    'rooms.night': '/ніч',
    'rooms.size': 'Площа',
    'rooms.guests': 'Гостей',
    
    // Amenities
    'amenities.title': 'Зручності Світового Класу',
    'amenities.subtitle': 'Все необхідне для ідеального відпочинку',
    'amenities.seaView': 'Вид на Море',
    'amenities.fountains': 'Поруч з Фонтанами',
    'amenities.kitchen': 'Повна Кухня',
    'amenities.reception': 'Рецепція 24/7',
    'amenities.pool': 'Басейн',
    'amenities.parking': 'Парковка',
    'amenities.wifi': 'Швидкий WiFi',
    'amenities.ac': 'Кондиціонер',
    'amenities.housekeeping': 'Прибирання',
    'amenities.security': 'Охорона 24/7',
    'amenities.concierge': 'Консьєрж',
    'amenities.restaurant': 'Ресторан',
    
    // Location
    'location.title': 'Преміальне Розташування в Батумі',
    'location.subtitle': 'У кількох кроках від Чорного моря та головних пам\'яток',
    'location.beach': 'Пляж Чорного Моря',
    'location.beachDist': '50 метрів',
    'location.fountains': 'Співаючі Фонтани',
    'location.fountainsDist': '100 метрів',
    'location.airport': 'Аеропорт Батумі',
    'location.airportDist': '5 кілометрів',
    
    // Reviews
    'reviews.title': 'Відгуки Гостей',
    'reviews.subtitle': 'Що кажуть про нас наші гості',
    'reviews.rating': 'Оцінка Гостей',
    'reviews.review1': 'Приголомшливі види на Чорне море! Апартаменти розкішні, персонал неймовірно привітний.',
    'reviews.review2': 'Ідеальне розташування поруч з пляжем та фонтанами. Апартаменти чисті та добре обладнані.',
    'reviews.review3': 'Чудовий досвід! Вид на море з нашого балкону був захоплюючим. Дуже рекомендую!',
    
    // CTA
    'cta.title': 'Готові Відчути Розкіш біля Моря?',
    'cta.subtitle': 'Забронюйте свої ідеальні апартаменти сьогодні',
    'cta.button': 'Забронювати',
    
    // Footer
    'footer.description': 'Розкішні апартаменти з обслуговуванням у серці Батумі, Грузія. У кроках від Чорного моря.',
    'footer.quickLinks': 'Швидкі Посилання',
    'footer.contact': 'Зв\'яжіться з Нами',
    'footer.phone': 'Телефон',
    'footer.email': 'Email',
    'footer.address': 'Адреса',
    'footer.followUs': 'Підписатися',
    'footer.rights': '© 2025 Орбі Сіті Батумі. Всі права захищені.',
  },
};

const detectLanguage = (): Language => {
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('ka')) return 'ka';
  if (browserLang.startsWith('ru')) return 'ru';
  if (browserLang.startsWith('tr')) return 'tr';
  if (browserLang.startsWith('uk')) return 'uk';
  return 'en';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved || detectLanguage();
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language === 'ka' ? 'ka' : language === 'ru' ? 'ru' : language === 'tr' ? 'tr' : language === 'uk' ? 'uk' : 'en';
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
