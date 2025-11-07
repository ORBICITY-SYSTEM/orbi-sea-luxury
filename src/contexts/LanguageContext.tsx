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
