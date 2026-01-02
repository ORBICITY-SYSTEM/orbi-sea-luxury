export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  title_ka: string;
  excerpt: string;
  excerpt_ka: string;
  content: string;
  content_ka: string;
  image: string;
  category: string;
  category_ka: string;
  author: string;
  date: string;
  readTime: number;
  featured: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'why-choose-orbi-city-batumi',
    title: 'Why Choose Orbi City for Your Batumi Stay',
    title_ka: 'რატომ უნდა აირჩიოთ Orbi City ბათუმში დასასვენებლად',
    excerpt: 'Discover why Orbi City Aparthotel is the perfect choice for travelers seeking luxury, comfort, and the best sea views in Batumi.',
    excerpt_ka: 'გაიგეთ, რატომ არის Orbi City Aparthotel იდეალური არჩევანი მოგზაურებისთვის, რომლებიც ეძებენ ფუფუნებას, კომფორტს და საუკეთესო ზღვის ხედებს ბათუმში.',
    content: `
## The Perfect Location

Orbi City Aparthotel is strategically located on Sheriff Khimshiashvili Street, offering direct access to Batumi's stunning Black Sea coastline. Just steps from the beach, our guests enjoy the perfect balance of beachfront relaxation and urban convenience.

## Luxurious Amenities

Our aparthotel features world-class amenities including:

- **Infinity Pool** - Swim with panoramic sea views
- **24/7 Gym** - Stay fit during your vacation
- **Spa & Wellness Center** - Rejuvenate after a day of exploration
- **Multiple Restaurants** - Diverse culinary experiences
- **Private Beach Access** - Exclusive beachfront comfort

## Modern Apartments

Each apartment at Orbi City is designed with modern travelers in mind:

- Fully equipped kitchens for home-cooked meals
- High-speed WiFi throughout
- Smart TV with international channels
- Premium bedding for restful sleep
- Private balconies with sea views

## Why Guests Love Us

With a 4.5-star rating on Google and hundreds of positive reviews, our guests consistently praise:

1. The breathtaking views from every floor
2. Exceptional cleanliness and maintenance
3. Friendly and responsive staff
4. Value for money compared to traditional hotels
5. The freedom of apartment-style living

Book your stay at Orbi City and experience Batumi like never before!
    `,
    content_ka: `
## იდეალური ლოკაცია

Orbi City Aparthotel სტრატეგიულად მდებარეობს შერიფ ხიმშიაშვილის ქუჩაზე და სთავაზობს პირდაპირ გასასვლელს ბათუმის თვალწარმტაცი შავი ზღვის სანაპიროზე. სანაპიროდან რამდენიმე ნაბიჯით, ჩვენი სტუმრები სარგებლობენ სანაპიროზე დასვენებისა და ურბანული კომფორტის იდეალური ბალანსით.

## ფუფუნების კეთილმოწყობა

ჩვენს აპარტოტელში წარმოდგენილია მსოფლიო დონის კეთილმოწყობა:

- **Infinity აუზი** - იცურეთ ზღვის პანორამული ხედებით
- **24/7 სპორტდარბაზი** - შეინარჩუნეთ ფორმა შვებულების დროს
- **SPA & Wellness ცენტრი** - აღიდგინეთ ძალები ექსკურსიის შემდეგ
- **მრავალი რესტორანი** - მრავალფეროვანი კულინარიული გამოცდილება
- **კერძო პლაჟზე წვდომა** - ექსკლუზიური სანაპირო კომფორტი

## თანამედროვე აპარტამენტები

Orbi City-ში თითოეული აპარტამენტი შექმნილია თანამედროვე მოგზაურების გათვალისწინებით:

- სრულად აღჭურვილი სამზარეულოები სახლში საჭმლის მოსამზადებლად
- მაღალსიჩქარიანი WiFi ყველგან
- Smart TV საერთაშორისო არხებით
- პრემიუმ თეთრეული მყუდრო ძილისთვის
- კერძო აივნები ზღვის ხედებით

## რატომ გვიყვართ სტუმრებს

4.5 ვარსკვლავის რეიტინგით Google-ზე და ასობით დადებითი მიმოხილვით, ჩვენი სტუმრები მუდმივად აფასებენ:

1. თვალწარმტაც ხედებს ყოველი სართულიდან
2. განსაკუთრებულ სისუფთავეს და მოვლას
3. მეგობრულ და ოპერატიულ პერსონალს
4. ფასისა და ხარისხის თანაფარდობას
5. აპარტამენტის სტილის ცხოვრების თავისუფლებას

დაჯავშნეთ თქვენი ყოფნა Orbi City-ში და გაიცანით ბათუმი, როგორც არასოდეს!
    `,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
    category: 'Travel Tips',
    category_ka: 'მოგზაურობის რჩევები',
    author: 'Orbi City Team',
    date: '2025-12-15',
    readTime: 5,
    featured: true
  },
  {
    id: '2',
    slug: 'top-10-things-to-do-in-batumi',
    title: 'Top 10 Things to Do in Batumi',
    title_ka: 'ბათუმის 10 საუკეთესო ღირსშესანიშნაობა',
    excerpt: 'From the stunning Boulevard to the Alphabet Tower, explore the must-see attractions that make Batumi a unique destination.',
    excerpt_ka: 'თვალწარმტაცი ბულვარიდან ანბანის კოშკამდე, გაეცანით ღირსშესანიშნაობებს, რომლებიც ბათუმს უნიკალურ მიმართულებად აქცევს.',
    content: `
## 1. Batumi Boulevard

The crown jewel of Batumi, this 7-kilometer promenade stretches along the Black Sea coast. Perfect for morning jogs, evening strolls, or simply watching the sunset.

**Pro Tip:** Rent a bicycle from one of the many stations along the boulevard for the best experience!

## 2. Alphabet Tower

Standing at 130 meters, this architectural marvel represents the unique Georgian alphabet. The tower features a rotating restaurant with 360-degree views of the city.

## 3. Batumi Botanical Garden

One of the largest botanical gardens in the former Soviet Union, featuring plants from 9 different phytogeographic zones. The garden offers stunning views of both the sea and the Caucasus Mountains.

## 4. Ali and Nino Statue

This moving sculpture by Tamara Kvesitadze depicts two lovers coming together and passing through each other, symbolizing the intersection of Eastern and Western cultures.

## 5. Piazza Square

An Italian-style square featuring beautiful mosaics, outdoor cafes, and live music. The perfect spot for an evening aperitif!

## 6. Batumi Cable Car (Argo)

Take a scenic 2.5-kilometer ride up to Anuria Mountain for breathtaking panoramic views of the city and coastline.

## 7. Dolphinarium

One of the best in the region, featuring dolphin shows and interactive experiences. Great for families with children.

## 8. Europe Square

A beautiful plaza surrounded by restored historical buildings, featuring the Medea statue and the Astronomical Clock.

## 9. Gonio Fortress

Just 15 kilometers from Batumi, this ancient Roman fortress dates back to the 1st century AD and offers fascinating insights into the region's history.

## 10. Batumi Night Life

Experience the vibrant nightlife with beachfront clubs, rooftop bars, and casinos that operate 24/7.

---

Stay at Orbi City Aparthotel for easy access to all these attractions!
    `,
    content_ka: `
## 1. ბათუმის ბულვარი

ბათუმის გვირგვინი, ეს 7 კილომეტრიანი პრომენადი გაწელილია შავი ზღვის სანაპიროს გასწვრივ. იდეალურია დილის სირბილისთვის, საღამოს გასეირნებისთვის ან უბრალოდ მზის ჩასვლის სანახავად.

**რჩევა:** გაიცვალეთ ველოსიპედი ბულვარზე არსებული მრავალი სადგურიდან საუკეთესო გამოცდილებისთვის!

## 2. ანბანის კოშკი

130 მეტრის სიმაღლეზე მდგომი ეს არქიტექტურული საოცრება წარმოადგენს უნიკალურ ქართულ ანბანს. კოშკში მოთავსებულია მბრუნავი რესტორანი ქალაქის 360 გრადუსიანი ხედით.

## 3. ბათუმის ბოტანიკური ბაღი

ყოფილი საბჭოთა კავშირის ერთ-ერთი უდიდესი ბოტანიკური ბაღი, რომელშიც წარმოდგენილია მცენარეები 9 სხვადასხვა ფიტოგეოგრაფიული ზონიდან. ბაღი გთავაზობთ თვალწარმტაც ხედებს როგორც ზღვაზე, ასევე კავკასიონის მთებზე.

## 4. ალი და ნინოს ქანდაკება

თამარა კვესიტაძის ეს მოძრავი სკულპტურა ასახავს ორ შეყვარებულს, რომლებიც ერთმანეთს ერწყმიან და გაივლიან, რაც სიმბოლურად გამოხატავს აღმოსავლური და დასავლური კულტურების გადაკვეთას.

## 5. პიაცა მოედანი

იტალიური სტილის მოედანი მშვენიერი მოზაიკებით, ღია კაფეებით და ცოცხალი მუსიკით. იდეალური ადგილი საღამოს აპერიტივისთვის!

## 6. ბათუმის საბაგირო (არგო)

მიიღეთ 2.5 კილომეტრიანი ფერადი მგზავრობა ანურიას მთაზე ქალაქისა და სანაპიროს თვალწარმტაცი პანორამული ხედებისთვის.

## 7. დელფინარიუმი

რეგიონში ერთ-ერთი საუკეთესო, დელფინების შოუებით და ინტერაქტიული გამოცდილებით. შესანიშნავია ბავშვიანი ოჯახებისთვის.

## 8. ევროპის მოედანი

ლამაზი მოედანი, გარშემორტყმული რესტავრირებული ისტორიული შენობებით, მედეას ქანდაკებით და ასტრონომიული საათით.

## 9. გონიოს ციხე

ბათუმიდან მხოლოდ 15 კილომეტრში მდებარე ეს უძველესი რომაული ციხესიმაგრე ახ. წ. I საუკუნით თარიღდება და გთავაზობთ მომხიბვლელ შეხედულებებს რეგიონის ისტორიაზე.

## 10. ბათუმის ღამის ცხოვრება

გაიცანით ცხოვრებით სავსე ღამის ცხოვრება სანაპიროს კლუბებით, სახურავის ბარებით და 24/7 მომუშავე კაზინოებით.

---

დასვენება Orbi City Aparthotel-ში მოგცემთ ამ ყველა ღირსშესანიშნაობაზე მარტივ წვდომას!
    `,
    image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&q=80',
    category: 'Destinations',
    category_ka: 'მიმართულებები',
    author: 'Orbi City Team',
    date: '2025-12-10',
    readTime: 8,
    featured: true
  },
  {
    id: '3',
    slug: 'best-restaurants-near-orbi-city',
    title: 'Best Restaurants Near Orbi City Batumi',
    title_ka: 'საუკეთესო რესტორნები Orbi City-ს მახლობლად ბათუმში',
    excerpt: 'A foodie\'s guide to the best dining experiences within walking distance of Orbi City Aparthotel.',
    excerpt_ka: 'გურმანის გზამკვლევი საუკეთესო სასადილო გამოცდილებისთვის Orbi City Aparthotel-იდან ფეხით მისაღწევ მანძილზე.',
    content: `
## Georgian Cuisine Must-Tries

### 1. Khachapuri House
**Distance:** 5 minutes walk
**Specialty:** Adjarian Khachapuri (boat-shaped cheese bread with egg)

The Adjarian version of khachapuri is a MUST-TRY in Batumi. The combination of gooey cheese, butter, and runny egg is simply divine.

### 2. Sakhli #11
**Distance:** 10 minutes walk
**Specialty:** Traditional Georgian dishes

A cozy restaurant offering authentic Georgian cuisine in a warm, homely atmosphere. Try their khinkali (Georgian dumplings) and lobio (bean stew).

### 3. Old Boulevard Restaurant
**Distance:** 3 minutes walk
**Specialty:** Seafood and Georgian fusion

Located right on the boulevard, this restaurant offers fresh Black Sea fish with stunning sea views.

## International Cuisine

### 4. Sanapiro Restaurant
**Distance:** 7 minutes walk
**Specialty:** Mediterranean and European cuisine

Perfect for those craving Italian pasta, Greek salads, or European-style grilled meats.

### 5. La Brioche
**Distance:** 5 minutes walk
**Specialty:** French-style bakery and café

Start your morning with fresh croissants, artisan coffee, and French pastries.

## Budget-Friendly Options

### 6. Machakhela
**Distance:** 8 minutes walk
**Specialty:** Traditional Georgian fast-casual

Great quality Georgian food at affordable prices. Perfect for a quick, satisfying meal.

### 7. Black Sea Fish Market
**Distance:** 15 minutes walk
**Specialty:** Fresh seafood

Pick your fish, and they'll grill it for you on the spot. Authentic and incredibly fresh!

## Fine Dining

### 8. Saamo
**Distance:** 10 minutes walk
**Specialty:** Modern Georgian cuisine

Elevated Georgian dishes with creative presentation. Reservations recommended.

---

**Pro Tip:** Don't forget to try the local Adjarian wine - it pairs perfectly with Georgian cuisine!

Need recommendations? Our concierge at Orbi City is always happy to help with reservations!
    `,
    content_ka: `
## ქართული სამზარეულოს აუცილებელი გასინჯვები

### 1. ხაჭაპურის სახლი
**მანძილი:** 5 წუთის სავალი
**სპეციალობა:** აჭარული ხაჭაპური (ნავისებრი ყველის პური კვერცხით)

ხაჭაპურის აჭარული ვერსია ბათუმში აუცილებლად უნდა გასინჯოთ. წებოვანი ყველის, კარაქისა და თხევადი კვერცხის კომბინაცია უბრალოდ ღვთაებრივია.

### 2. სახლი #11
**მანძილი:** 10 წუთის სავალი
**სპეციალობა:** ტრადიციული ქართული კერძები

მყუდრო რესტორანი, რომელიც გთავაზობთ ავთენტურ ქართულ სამზარეულოს თბილ, ოჯახურ ატმოსფეროში. გასინჯეთ მათი ხინკალი და ლობიო.

### 3. ძველი ბულვარის რესტორანი
**მანძილი:** 3 წუთის სავალი
**სპეციალობა:** ზღვის პროდუქტები და ქართული ფიუჟენი

ბულვარზე მდებარე ეს რესტორანი გთავაზობთ ახალი შავი ზღვის თევზს თვალწარმტაცი ზღვის ხედებით.

## საერთაშორისო სამზარეულო

### 4. სანაპირო რესტორანი
**მანძილი:** 7 წუთის სავალი
**სპეციალობა:** ხმელთაშუა ზღვის და ევროპული სამზარეულო

იდეალურია მათთვის, ვისაც სურს იტალიური პასტა, ბერძნული სალათები ან ევროპული სტილის შემწვარი ხორცი.

### 5. ლა ბრიოში
**მანძილი:** 5 წუთის სავალი
**სპეციალობა:** ფრანგული სტილის საცხობი და კაფე

დაიწყეთ დილა ახალი კრუასანებით, ხელოსნური ყავით და ფრანგული ნამცხვრებით.

## ბიუჯეტური ვარიანტები

### 6. მაჭახელა
**მანძილი:** 8 წუთის სავალი
**სპეციალობა:** ტრადიციული ქართული ფასტ-კაზუალი

დიდი ხარისხის ქართული საკვები ხელმისაწვდომ ფასებში. იდეალურია სწრაფი, დამაკმაყოფილებელი კერძისთვის.

### 7. შავი ზღვის თევზის ბაზარი
**მანძილი:** 15 წუთის სავალი
**სპეციალობა:** ახალი ზღვის პროდუქტები

აირჩიეთ თევზი და ისინი ადგილზევე შემოგწვავენ. ავთენტური და წარმოუდგენლად ახალი!

## ფაინ დაინინგი

### 8. საამო
**მანძილი:** 10 წუთის სავალი
**სპეციალობა:** თანამედროვე ქართული სამზარეულო

აწეული ქართული კერძები კრეატიული პრეზენტაციით. რეზერვაცია რეკომენდებულია.

---

**რჩევა:** არ დაგავიწყდეთ ადგილობრივი აჭარული ღვინის გასინჯვა - ის იდეალურად ერწყმის ქართულ სამზარეულოს!

გჭირდებათ რეკომენდაციები? Orbi City-ს კონსიერჟი ყოველთვის მზად არის დაგეხმაროთ რეზერვაციებში!
    `,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    category: 'Food & Dining',
    category_ka: 'საკვები და სასადილო',
    author: 'Orbi City Team',
    date: '2025-12-05',
    readTime: 6,
    featured: false
  },
  {
    id: '4',
    slug: 'batumi-seasons-best-time-to-visit',
    title: 'When to Visit Batumi: A Season-by-Season Guide',
    title_ka: 'როდის ეწვიოთ ბათუმს: სეზონური გზამკვლევი',
    excerpt: 'Plan your perfect trip to Batumi by understanding what each season offers for travelers.',
    excerpt_ka: 'დაგეგმეთ თქვენი იდეალური მოგზაურობა ბათუმში და გაიგეთ, რას სთავაზობს თითოეული სეზონი მოგზაურებს.',
    content: `
## Summer (June - August)
**Weather:** 25-32°C, warm and sunny
**Best For:** Beach lovers, swimmers, nightlife enthusiasts

Summer is Batumi's peak season! The Black Sea reaches comfortable swimming temperatures (24-26°C), and the city comes alive with festivals, concerts, and events.

### What to Expect:
- Crowded beaches and higher prices
- Vibrant nightlife and outdoor dining
- Water sports and beach activities
- International tourists and lively atmosphere

### Pro Tips:
- Book accommodation early (like Orbi City!)
- Visit beaches early morning to avoid crowds
- Try water activities: jet skiing, parasailing, banana boats

---

## Autumn (September - November)
**Weather:** 15-25°C, mild with occasional rain
**Best For:** Budget travelers, couples, food enthusiasts

September is arguably the BEST time to visit! The weather is still warm, beaches are less crowded, and you'll find better hotel rates.

### What to Expect:
- Perfect swimming weather in September
- Wine harvest season in nearby Adjara region
- Beautiful autumn colors in the Botanical Garden
- Fewer tourists, more authentic experiences

### Pro Tips:
- Visit local wineries for harvest celebrations
- Perfect weather for hiking in nearby mountains
- Enjoy outdoor cafes without summer heat

---

## Winter (December - February)
**Weather:** 5-12°C, mild and rainy
**Best For:** Casino lovers, spa seekers, budget travelers

Batumi has remarkably mild winters compared to other Black Sea destinations. While it's not beach weather, there's plenty to enjoy!

### What to Expect:
- Lowest hotel prices of the year
- Festive New Year celebrations
- Indoor attractions: casinos, malls, aquarium
- Spa and wellness experiences

### Pro Tips:
- Try the thermal spas and wellness centers
- Perfect time for foodie tours and cooking classes
- Day trips to nearby ski resorts in Goderdzi

---

## Spring (March - May)
**Weather:** 12-22°C, sunny with occasional showers
**Best For:** Nature lovers, photographers, active travelers

Spring brings Batumi back to life! Flowers bloom, the Botanical Garden is spectacular, and outdoor activities resume.

### What to Expect:
- Botanical Garden in full bloom
- Comfortable temperatures for sightseeing
- Fewer crowds than summer
- Perfect for hiking and outdoor activities

### Pro Tips:
- May is ideal for beach + sightseeing combo
- Great weather for cable car rides
- Photography paradise with blooming landscapes

---

## Our Recommendation

**Best Overall:** Late May to mid-June, or September
- Perfect weather for all activities
- Reasonable prices
- Fewer crowds than peak summer

Book your stay at Orbi City Aparthotel for any season - we're ready to welcome you year-round!
    `,
    content_ka: `
## ზაფხული (ივნისი - აგვისტო)
**ამინდი:** 25-32°C, თბილი და მზიანი
**საუკეთესოა:** პლაჟის მოყვარულებისთვის, მოცურავეებისთვის, ღამის ცხოვრების მოყვარულებისთვის

ზაფხული ბათუმის პიკის სეზონია! შავი ზღვა აღწევს კომფორტულ ბანაობის ტემპერატურას (24-26°C) და ქალაქი ცოცხლდება ფესტივალებით, კონცერტებით და ღონისძიებებით.

### რას უნდა მოელოდეთ:
- გადატვირთული პლაჟები და მაღალი ფასები
- ცოცხალი ღამის ცხოვრება და ღია სასადილო
- წყლის სპორტი და პლაჟის აქტივობები
- საერთაშორისო ტურისტები და ცოცხალი ატმოსფერო

### რჩევები:
- ადრე დაჯავშნეთ საცხოვრებელი (როგორც Orbi City!)
- დილით ადრე ეწვიეთ პლაჟებს ხალხმრავლობის თავიდან ასაცილებლად
- გასინჯეთ წყლის აქტივობები: ჯეტ სკი, პარასეილინგი, ბანანის ნავები

---

## შემოდგომა (სექტემბერი - ნოემბერი)
**ამინდი:** 15-25°C, რბილი ხანდახან წვიმით
**საუკეთესოა:** ბიუჯეტური მოგზაურებისთვის, წყვილებისთვის, საკვების მოყვარულებისთვის

სექტემბერი სავარაუდოდ საუკეთესო დროა სტუმრობისთვის! ამინდი ჯერ კიდევ თბილია, პლაჟები ნაკლებად გადატვირთულია და უკეთეს ფასებს ნახავთ.

### რას უნდა მოელოდეთ:
- იდეალური ბანაობის ამინდი სექტემბერში
- ყურძნის კრების სეზონი ახლომდებარე აჭარის რეგიონში
- მშვენიერი შემოდგომის ფერები ბოტანიკურ ბაღში
- ნაკლები ტურისტი, უფრო ავთენტური გამოცდილება

### რჩევები:
- ეწვიეთ ადგილობრივ მარნებს რთველის ზეიმებზე
- იდეალური ამინდი ახლომდებარე მთებში ლაშქრობისთვის
- ისიამოვნეთ ღია კაფეებით ზაფხულის სიცხის გარეშე

---

## ზამთარი (დეკემბერი - თებერვალი)
**ამინდი:** 5-12°C, რბილი და წვიმიანი
**საუკეთესოა:** კაზინოს მოყვარულებისთვის, სპა მაძიებლებისთვის, ბიუჯეტური მოგზაურებისთვის

ბათუმს აქვს საგრძნობლად რბილი ზამთარი სხვა შავი ზღვის მიმართულებებთან შედარებით. მიუხედავად იმისა, რომ პლაჟის ამინდი არაა, ბევრი რამით შეგიძლიათ დატკბეთ!

### რას უნდა მოელოდეთ:
- წლის ყველაზე დაბალი სასტუმროს ფასები
- სადღესასწაულო საახალწლო ზეიმები
- შიდა ატრაქციონები: კაზინოები, მოლები, აკვარიუმი
- სპა და ველნესის გამოცდილება

### რჩევები:
- გასინჯეთ თერმული სპა და ველნეს ცენტრები
- იდეალური დრო საკვების ტურებისა და კულინარიული კურსებისთვის
- დღიური ექსკურსიები გოდერძის ახლომდებარე სათხილამურო კურორტებზე

---

## გაზაფხული (მარტი - მაისი)
**ამინდი:** 12-22°C, მზიანი ხანდახანდელი შხაპით
**საუკეთესოა:** ბუნების მოყვარულებისთვის, ფოტოგრაფებისთვის, აქტიური მოგზაურებისთვის

გაზაფხული ბათუმს ცხოვრებას უბრუნებს! ყვავილები ყვავის, ბოტანიკური ბაღი არაჩვეულებრივია და ღია აქტივობები განახლდება.

### რას უნდა მოელოდეთ:
- ბოტანიკური ბაღი სრულ ყვავილობაში
- კომფორტული ტემპერატურა ღირსშესანიშნაობების დასათვალიერებლად
- ნაკლები ხალხი ზაფხულთან შედარებით
- იდეალური ლაშქრობისა და ღია აქტივობებისთვის

### რჩევები:
- მაისი იდეალურია პლაჟ + ღირსშესანიშნაობების კომბინაციისთვის
- შესანიშნავი ამინდი საბაგიროთი სიარულისთვის
- ფოტოგრაფიის სამოთხე ყვავილოვანი ლანდშაფტებით

---

## ჩვენი რეკომენდაცია

**საუკეთესო ჯამში:** მაისის ბოლო ივნისის შუამდე, ან სექტემბერი
- იდეალური ამინდი ყველა აქტივობისთვის
- გონივრული ფასები
- ნაკლები ხალხი პიკ ზაფხულთან შედარებით

დაჯავშნეთ თქვენი ყოფნა Orbi City Aparthotel-ში ნებისმიერი სეზონისთვის - მზად ვართ მივიღოთ თქვენ მთელი წლის განმავლობაში!
    `,
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
    category: 'Travel Tips',
    category_ka: 'მოგზაურობის რჩევები',
    author: 'Orbi City Team',
    date: '2025-11-28',
    readTime: 7,
    featured: false
  },
  {
    id: '5',
    slug: 'family-vacation-batumi-kids-activities',
    title: 'Family Vacation in Batumi: Best Activities for Kids',
    title_ka: 'საოჯახო შვებულება ბათუმში: საუკეთესო აქტივობები ბავშვებისთვის',
    excerpt: 'Make your family trip to Batumi unforgettable with these kid-friendly attractions and activities.',
    excerpt_ka: 'გახადეთ თქვენი საოჯახო მოგზაურობა ბათუმში დაუვიწყარი ამ ბავშვებისთვის შესაფერისი ატრაქციონებითა და აქტივობებით.',
    content: `
## Why Batumi is Perfect for Families

Batumi offers an incredible mix of beach fun, educational attractions, and adventure activities that kids of all ages will love. Plus, Georgian hospitality makes traveling with children incredibly easy!

## Top Kid-Friendly Attractions

### 1. Batumi Dolphinarium
**Ages:** All ages
**Duration:** 2-3 hours

Watch amazing dolphin shows and even swim with dolphins (for older children). The dolphins are well-trained, and the shows are educational and entertaining.

**Pro Tip:** Book the early show to avoid crowds!

### 2. Batumi Aquarium
**Ages:** All ages
**Duration:** 1-2 hours

Explore the underwater world of the Black Sea and beyond. Kids love the touch tanks where they can interact with sea creatures.

### 3. Batumi Cable Car (Argo)
**Ages:** 4+
**Duration:** 1 hour

An exciting ride with spectacular views! Kids love the adventure, and parents appreciate the stunning photos.

**Safety Note:** The cable car is very safe, but hold onto little ones during the ride.

### 4. Batumi Boulevard
**Ages:** All ages
**Duration:** 2-4 hours

Rent bicycles, roller skates, or electric scooters for the whole family. The boulevard has:
- Playgrounds
- Bicycle paths
- Ice cream vendors
- Fountains to splash in

### 5. Batumi Beach
**Ages:** All ages
**Duration:** Half day

The pebble beaches are clean and safe for children. Many areas have:
- Shallow swimming zones
- Beach toys for rent
- Inflatable water parks
- Trained lifeguards

### 6. Batumi Boulevard Ferris Wheel
**Ages:** 3+
**Duration:** 30 minutes

A gentle ride with beautiful views. Perfect for a family photo opportunity!

## Adventure Activities

### 7. Aquapark Batumi
**Ages:** 4+
**Duration:** Full day

Multiple slides, pools, and water attractions for all ages. The park has separate areas for smaller children.

### 8. Zip-lining at Mtirala National Park
**Ages:** 8+
**Duration:** Half day

For adventurous families, the nearby national park offers zip-lining through beautiful forests.

## Evening Entertainment

### 9. Musical Fountains
**Ages:** All ages
**Duration:** 1 hour

Every evening, the dancing fountains on Batumi Boulevard put on a spectacular light and music show. Kids are mesmerized!

**Show Time:** Usually 9 PM in summer

### 10. Piazza Square
**Ages:** All ages
**Duration:** 1-2 hours

Safe for kids to run around while parents enjoy a coffee or gelato. Street performers often entertain the crowds.

## Family-Friendly Dining Tips

- **Kid-friendly Georgian dishes:** Khachapuri (cheese bread), lobiani (bean bread), churchkhela (sweet treat)
- **Pizza and pasta:** Available everywhere
- **High chairs:** Most restaurants have them
- **Kids' menus:** Increasingly common

## Staying at Orbi City with Kids

Our apartments are perfect for families:
- **Full kitchens** for preparing children's meals
- **Washing machines** for dirty vacation clothes
- **Multiple bedrooms** for privacy
- **Pool access** for daily swimming
- **Safe, family-friendly environment**

Book a family apartment at Orbi City for your next Batumi adventure!
    `,
    content_ka: `
## რატომ არის ბათუმი იდეალური ოჯახებისთვის

ბათუმი გთავაზობთ წარმოუდგენელ ნაზავს პლაჟზე გართობის, საგანმანათლებლო ატრაქციონებისა და სათავგადასავლო აქტივობების, რაც ყველა ასაკის ბავშვებს მოეწონებათ. გარდა ამისა, ქართული სტუმართმოყვარეობა ბავშვებთან ერთად მოგზაურობას წარმოუდგენლად ადვილს ხდის!

## ბავშვებისთვის საუკეთესო ატრაქციონები

### 1. ბათუმის დელფინარიუმი
**ასაკი:** ყველა ასაკი
**ხანგრძლივობა:** 2-3 საათი

უყურეთ საოცარ დელფინების შოუებს და თუნდაც იცურეთ დელფინებთან ერთად (უფროსი ბავშვებისთვის). დელფინები კარგად გაწვრთნილები არიან და შოუები საგანმანათლებლო და გასართობია.

**რჩევა:** დაჯავშნეთ ადრეული შოუ ხალხმრავლობის თავიდან ასაცილებლად!

### 2. ბათუმის აკვარიუმი
**ასაკი:** ყველა ასაკი
**ხანგრძლივობა:** 1-2 საათი

გაეცანით შავი ზღვისა და მის მიღმა წყალქვეშა სამყაროს. ბავშვებს უყვართ შეხების აუზები, სადაც შეუძლიათ ურთიერთობა ზღვის არსებებთან.

### 3. ბათუმის საბაგირო (არგო)
**ასაკი:** 4+
**ხანგრძლივობა:** 1 საათი

საინტერესო მგზავრობა თვალწარმტაცი ხედებით! ბავშვებს უყვართ თავგადასავალი და მშობლები აფასებენ არაჩვეულებრივ ფოტოებს.

**უსაფრთხოების შენიშვნა:** საბაგირო ძალიან უსაფრთხოა, მაგრამ დაიჭირეთ პატარები მგზავრობისას.

### 4. ბათუმის ბულვარი
**ასაკი:** ყველა ასაკი
**ხანგრძლივობა:** 2-4 საათი

იქირავეთ ველოსიპედები, როლიკები ან ელექტრო სკუტერები მთელი ოჯახისთვის. ბულვარზე არის:
- სათამაშო მოედნები
- ველოსიპედის ბილიკები
- ნაყინის გამყიდველები
- შადრევნები ასხურებისთვის

### 5. ბათუმის პლაჟი
**ასაკი:** ყველა ასაკი
**ხანგრძლივობა:** ნახევარი დღე

კენჭიანი პლაჟები სუფთა და უსაფრთხოა ბავშვებისთვის. ბევრ ზონაში არის:
- არაღრმა საცურაო ზონები
- პლაჟის სათამაშოები გასაქირავებლად
- გასაბერი წყლის პარკები
- გაწვრთნილი მაშველები

### 6. ბათუმის ბულვარის გიგანტური ბორბალი
**ასაკი:** 3+
**ხანგრძლივობა:** 30 წუთი

ნაზი მგზავრობა ლამაზი ხედებით. იდეალურია საოჯახო ფოტოებისთვის!

## სათავგადასავლო აქტივობები

### 7. აკვაპარკი ბათუმი
**ასაკი:** 4+
**ხანგრძლივობა:** სრული დღე

მრავალი სლაიდი, აუზი და წყლის ატრაქციონი ყველა ასაკისთვის. პარკს აქვს ცალკე ზონები მცირეწლოვანი ბავშვებისთვის.

### 8. ზიპ-ლაინი მტირალას ეროვნულ პარკში
**ასაკი:** 8+
**ხანგრძლივობა:** ნახევარი დღე

სათავგადასავლო ოჯახებისთვის, ახლომდებარე ეროვნული პარკი გთავაზობთ ზიპ-ლაინს მშვენიერ ტყეებში.

## საღამოს გართობა

### 9. მუსიკალური შადრევნები
**ასაკი:** ყველა ასაკი
**ხანგრძლივობა:** 1 საათი

ყოველ საღამოს ბათუმის ბულვარზე მოცეკვავე შადრევნები აწყობენ თვალწარმტაც სინათლისა და მუსიკის შოუს. ბავშვები მოხიბლულები არიან!

**შოუს დრო:** ჩვეულებრივ 21:00 ზაფხულში

### 10. პიაცა მოედანი
**ასაკი:** ყველა ასაკი
**ხანგრძლივობა:** 1-2 საათი

უსაფრთხოა ბავშვებისთვის გარბენისთვის, სანამ მშობლები ყავით ან ჯელატოთი ტკბებიან. ქუჩის მხატვრები ხშირად ართობენ ხალხს.

## საოჯახო სასადილოს რჩევები

- **ბავშვებისთვის შესაფერისი ქართული კერძები:** ხაჭაპური, ლობიანი, ჩურჩხელა
- **პიცა და პასტა:** ყველგან ხელმისაწვდომია
- **საბავშვო სკამები:** უმეტეს რესტორნებს აქვს
- **საბავშვო მენიუ:** სულ უფრო გავრცელებულია

## Orbi City-ში ყოფნა ბავშვებთან ერთად

ჩვენი აპარტამენტები იდეალურია ოჯახებისთვის:
- **სრული სამზარეულოები** ბავშვების კერძების მოსამზადებლად
- **სარეცხი მანქანები** ბინძური შვებულების ტანსაცმლისთვის
- **მრავალი საძინებელი** კონფიდენციალურობისთვის
- **აუზზე წვდომა** ყოველდღიური ცურვისთვის
- **უსაფრთხო, საოჯახო გარემო**

დაჯავშნეთ საოჯახო აპარტამენტი Orbi City-ში თქვენი მომდევნო ბათუმის თავგადასავლისთვის!
    `,
    image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&q=80',
    category: 'Family Travel',
    category_ka: 'საოჯახო მოგზაურობა',
    author: 'Orbi City Team',
    date: '2025-11-20',
    readTime: 9,
    featured: true
  },
  {
    id: '6',
    slug: 'georgian-wine-batumi-guide',
    title: 'Georgian Wine Guide: Exploring Wine Culture Near Batumi',
    title_ka: 'ქართული ღვინის გზამკვლევი: ღვინის კულტურის შესწავლა ბათუმის მახლობლად',
    excerpt: 'Discover the ancient wine traditions of Georgia, the birthplace of wine, during your stay in Batumi.',
    excerpt_ka: 'აღმოაჩინეთ საქართველოს უძველესი ღვინის ტრადიციები, ღვინის სამშობლო, ბათუმში ყოფნის დროს.',
    content: `
## Georgia: The Birthplace of Wine

Georgia has an 8,000-year history of winemaking, making it the world's oldest wine-producing region. When you visit Batumi, you're just a short trip away from some of the country's most fascinating wine experiences.

## Understanding Georgian Wine

### Qvevri: The Ancient Method
Georgian wines are traditionally fermented in clay vessels called "qvevri" buried underground. This UNESCO-protected method creates unique flavors found nowhere else in the world.

### Unique Grape Varieties
Georgia has over 500 indigenous grape varieties:
- **Saperavi** - Bold, tannic red wine
- **Rkatsiteli** - Aromatic white wine
- **Tsolikouri** - Adjarian specialty, crisp white
- **Chkhaveri** - Light rosé from Adjara

## Wine Regions Near Batumi

### Adjara Wine Region
**Distance:** 0-100 km from Batumi
**Specialties:** Tsolikouri, Chkhaveri

The local Adjarian wines are often overlooked but offer unique character:
- **Salibauri** - Traditional winery in the hills
- **Batumi Wine House** - Urban wine bar and shop
- **Qvevri Wine Bar** - Excellent selection in the city

### Guria Region
**Distance:** 50-80 km from Batumi
**Specialties:** Chkhaveri rosé

The Guria region is known for:
- Light, refreshing rosé wines
- Traditional supra (Georgian feast) culture
- Beautiful countryside vineyards

## Wine Experiences from Batumi

### 1. Day Trip to Kakheti
**Duration:** Full day (12+ hours)
**Distance:** 450 km

While far, Kakheti is Georgia's premier wine region. Many tour operators offer:
- Multiple winery visits
- Wine tastings and lunch
- Scenic mountain routes
- UNESCO site visits

### 2. Adjara Wine Tour
**Duration:** Half day
**Distance:** 20-50 km

Explore local wineries in the Adjarian hills:
- Visit family-run wineries
- Learn about qvevri winemaking
- Taste unique Adjarian varieties
- Enjoy rural Georgian hospitality

### 3. Wine Tasting in Batumi
**Duration:** 2-3 hours

Stay in the city and experience:
- **Batumi Wine House** - Over 100 Georgian wines
- **Wine Bar 8000 Vintages** - Rare wines by the glass
- **Enoteca Batumi** - Wine shop with tastings

## Wine Pairing with Georgian Food

### Classic Pairings:
- **Saperavi** + Mtsvadi (grilled meat)
- **Tsolikouri** + Black Sea fish
- **Rkatsiteli** + Khachapuri
- **Chkhaveri** + Adjarian cuisine

### Pro Tips:
1. Georgian amber (orange) wines pair excellently with cheese
2. Never refuse wine at a supra - it's culturally important!
3. The toastmaster (tamada) leads the drinking - follow their lead

## Bringing Wine Home

Georgian wine makes an excellent souvenir:
- **Wine shops in Batumi** offer vacuum packing for flights
- **Unique bottles** make memorable gifts
- **Prices** are very reasonable compared to export prices

### Recommended Shops:
- Wine Gallery - Seaside Boulevard
- Georgian Wine House - Piazza Square
- Airport Duty Free - Good selection

## Book a Wine Experience

Many Batumi hotels and tour operators offer wine experiences:
- Private car with driver
- English-speaking wine guides
- Flexible itineraries

Ask our Orbi City concierge to arrange your perfect wine adventure!

---

*Pro Tip: After a day of wine tasting, return to your Orbi City apartment to rest and enjoy the sea views. Perfect end to a perfect day!*
    `,
    content_ka: `
## საქართველო: ღვინის სამშობლო

საქართველოს 8,000 წლიანი მეღვინეობის ისტორია აქვს, რაც მას მსოფლიოში უძველეს ღვინის მწარმოებელ რეგიონად აქცევს. ბათუმში ვიზიტისას, თქვენ მხოლოდ მოკლე მოგზაურობით დაშორებული ხართ ქვეყნის ყველაზე მომხიბვლელი ღვინის გამოცდილებისგან.

## ქართული ღვინის გაგება

### ქვევრი: უძველესი მეთოდი
ქართული ღვინოები ტრადიციულად დუღებენ მიწაში ჩაფლულ თიხის ჭურჭელში, რომელსაც "ქვევრი" ეწოდება. ეს UNESCO-ს მიერ დაცული მეთოდი ქმნის უნიკალურ არომატებს, რომლებიც მსოფლიოში სხვაგან ვერსად იპოვება.

### უნიკალური ყურძნის ჯიშები
საქართველოში 500-ზე მეტი ადგილობრივი ყურძნის ჯიში არსებობს:
- **საფერავი** - მძლავრი, ტანინიანი წითელი ღვინო
- **რქაწითელი** - არომატული თეთრი ღვინო
- **წოლიკოური** - აჭარული სპეციალობა, მკაფიო თეთრი
- **ჩხავერი** - მსუბუქი ვარდისფერი აჭარიდან

## ღვინის რეგიონები ბათუმის მახლობლად

### აჭარის ღვინის რეგიონი
**მანძილი:** 0-100 კმ ბათუმიდან
**სპეციალობები:** წოლიკოური, ჩხავერი

ადგილობრივი აჭარული ღვინოები ხშირად უგულებელყოფილია, მაგრამ უნიკალურ ხასიათს გვთავაზობენ:
- **სალიბაური** - ტრადიციული მარანი მთებში
- **ბათუმის ღვინის სახლი** - ურბანული ღვინის ბარი და მაღაზია
- **ქვევრი ღვინის ბარი** - შესანიშნავი არჩევანი ქალაქში

### გურიის რეგიონი
**მანძილი:** 50-80 კმ ბათუმიდან
**სპეციალობები:** ჩხავერი ვარდისფერი

გურიის რეგიონი ცნობილია:
- მსუბუქი, გამაგრილებელი ვარდისფერი ღვინოებით
- ტრადიციული სუფრის (ქართული ნადიმის) კულტურით
- მშვენიერი სოფლის ვენახებით

## ღვინის გამოცდილება ბათუმიდან

### 1. დღიური ექსკურსია კახეთში
**ხანგრძლივობა:** სრული დღე (12+ საათი)
**მანძილი:** 450 კმ

მიუხედავად იმისა, რომ შორსაა, კახეთი საქართველოს პრემიერ ღვინის რეგიონია. ბევრი ტურ-ოპერატორი გთავაზობთ:
- მრავალ მარანში ვიზიტს
- ღვინის დეგუსტაციას და ლანჩს
- მთების ფერად მარშრუტებს
- UNESCO-ს ძეგლების მონახულებას

### 2. აჭარის ღვინის ტური
**ხანგრძლივობა:** ნახევარი დღე
**მანძილი:** 20-50 კმ

გაეცანით ადგილობრივ მარნებს აჭარის მთებში:
- ეწვიეთ ოჯახურ მარნებს
- ისწავლეთ ქვევრში მეღვინეობა
- გასინჯეთ უნიკალური აჭარული ჯიშები
- ისიამოვნეთ სოფლის ქართული სტუმართმოყვარეობით

### 3. ღვინის დეგუსტაცია ბათუმში
**ხანგრძლივობა:** 2-3 საათი

დარჩით ქალაქში და გაიცანით:
- **ბათუმის ღვინის სახლი** - 100-ზე მეტი ქართული ღვინო
- **ღვინის ბარი 8000 ვინტაჟი** - იშვიათი ღვინოები ჭიქით
- **ენოთეკა ბათუმი** - ღვინის მაღაზია დეგუსტაციით

## ღვინის წყვილება ქართულ საკვებთან

### კლასიკური წყვილებები:
- **საფერავი** + მწვადი (შემწვარი ხორცი)
- **წოლიკოური** + შავი ზღვის თევზი
- **რქაწითელი** + ხაჭაპური
- **ჩხავერი** + აჭარული სამზარეულო

### რჩევები:
1. ქართული ქარვისფერი (ნარინჯისფერი) ღვინოები შესანიშნავად წყვილდება ყველთან
2. არასოდეს უარყოთ ღვინო სუფრაზე - ეს კულტურულად მნიშვნელოვანია!
3. თამადა ხელმძღვანელობს სასმელს - მიჰყევით მას

## ღვინის სახლში წაყვანა

ქართული ღვინო შესანიშნავი სუვენირია:
- **ღვინის მაღაზიები ბათუმში** გთავაზობთ ვაკუუმ შეფუთვას ფრენებისთვის
- **უნიკალური ბოთლები** დასამახსოვრებელი საჩუქრებია
- **ფასები** ძალიან გონივრულია ექსპორტის ფასებთან შედარებით

### რეკომენდებული მაღაზიები:
- ღვინის გალერეა - სანაპირო ბულვარი
- ქართული ღვინის სახლი - პიაცა მოედანი
- აეროპორტის დიუთი ფრი - კარგი არჩევანი

## ღვინის გამოცდილების დაჯავშნა

ბევრი ბათუმის სასტუმრო და ტურ-ოპერატორი გთავაზობთ ღვინის გამოცდილებას:
- კერძო მანქანა მძღოლით
- ინგლისურენოვანი ღვინის გიდები
- მოქნილი მარშრუტები

სთხოვეთ Orbi City-ს კონსიერჟს მოაწყოს თქვენი იდეალური ღვინის თავგადასავალი!

---

*რჩევა: ღვინის დეგუსტაციის დღის შემდეგ, დაბრუნდით თქვენს Orbi City აპარტამენტში დასასვენებლად და ისიამოვნეთ ზღვის ხედებით. იდეალური დასასრული იდეალური დღისთვის!*
    `,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
    category: 'Culture',
    category_ka: 'კულტურა',
    author: 'Orbi City Team',
    date: '2025-11-15',
    readTime: 10,
    featured: false
  }
];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

export const getFeaturedPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.featured);
};

export const getPostsByCategory = (category: string): BlogPost[] => {
  return blogPosts.filter(post => post.category === category || post.category_ka === category);
};
