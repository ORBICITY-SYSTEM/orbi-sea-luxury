import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Quote, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Best reviews from multiple sources - only 5-star reviews
const bestReviews = [
  {
    id: 1,
    name: 'Sarah Johnson',
    country: 'United Kingdom',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    source: 'Google',
    sourceIcon: 'https://www.google.com/favicon.ico',
    sourceColor: 'from-blue-500 to-green-500',
    date: '2026-01-15',
    textEn: 'Absolutely stunning views of the Black Sea! The apartment was luxurious and the staff incredibly welcoming. The balcony breakfast with that view was unforgettable. Will definitely return!',
    textKa: 'შავი ზღვის წარმოუდგენელი ხედი! აპარტამენტი ძალიან ლამაზი იყო და პერსონალი ძალიან თბილი. აუზილებლად დავბრუნდები!',
    verified: true,
  },
  {
    id: 2,
    name: 'Marco Rossi',
    country: 'Italy',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    source: 'Booking.com',
    sourceIcon: 'https://cf.bstatic.com/static/img/favicon/9ca83ba2a5a3293ff07452cb24949a5843af4592.svg',
    sourceColor: 'from-blue-600 to-blue-800',
    date: '2026-01-10',
    textEn: 'Best hotel in Batumi! Perfect location near the beach and amazing amenities. The infinity pool with sea view is breathtaking. Highly recommend for anyone visiting Georgia!',
    textKa: 'საუკეთესო სასტუმრო ბათუმში! იდეალური ლოკაცია პლაჟთან და საოცარი კეთილმოწყობა. აუზი ზღვის ხედით თვალწარმტაცია!',
    verified: true,
  },
  {
    id: 3,
    name: 'Anna Petrova',
    country: 'Russia',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    source: 'Google',
    sourceIcon: 'https://www.google.com/favicon.ico',
    sourceColor: 'from-blue-500 to-green-500',
    date: '2026-01-05',
    textEn: 'The sea view from the balcony is breathtaking. Modern apartment with everything you need. The location is perfect - just steps from the beach and walking distance to restaurants.',
    textKa: 'ზღვის ხედი აივნიდან თვალწარმტაცია. თანამედროვე აპარტამენტი ყველაფრით რაც გჭირდება. ლოკაცია იდეალურია - პლაჟთან ახლოს.',
    verified: true,
  },
  {
    id: 4,
    name: 'Michael Chen',
    country: 'Singapore',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    source: 'TripAdvisor',
    sourceIcon: 'https://static.tacdn.com/img2/brand_refresh/Tripadvisor_logoset_solid_green.svg',
    sourceColor: 'from-green-500 to-green-700',
    date: '2025-12-28',
    textEn: 'Outstanding experience! From check-in to check-out, everything was perfect. The staff went above and beyond to make our stay memorable. The sunrise from our room was spectacular!',
    textKa: 'განსაკუთრებული გამოცდილება! ჩასახლებიდან გასვლამდე ყველაფერი იდეალური იყო. პერსონალმა ყველაფერი გააკეთა რომ დასამახსოვრებელი გვყოფილიყო!',
    verified: true,
  },
  {
    id: 5,
    name: 'Elena Popescu',
    country: 'Romania',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    source: 'Booking.com',
    sourceIcon: 'https://cf.bstatic.com/static/img/favicon/9ca83ba2a5a3293ff07452cb24949a5843af4592.svg',
    sourceColor: 'from-blue-600 to-blue-800',
    date: '2025-12-20',
    textEn: 'We loved everything about our stay! The apartment was spotless, modern, and had the most amazing view. The kids loved the pool and we loved the restaurants nearby. Perfect family vacation!',
    textKa: 'ყველაფერი მოგვეწონა! აპარტამენტი სუფთა, თანამედროვე და საუკეთესო ხედით. ბავშვებს აუზი მოეწონათ. იდეალური საოჯახო შვებულება!',
    verified: true,
  },
  {
    id: 6,
    name: 'David Miller',
    country: 'USA',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    source: 'Google',
    sourceIcon: 'https://www.google.com/favicon.ico',
    sourceColor: 'from-blue-500 to-green-500',
    date: '2025-12-15',
    textEn: 'Exceeded all expectations! The apartment felt like a 5-star hotel with the comfort of home. The Black Sea views, the modern amenities, and the friendly staff made this trip unforgettable.',
    textKa: 'ყველა მოლოდინს გადააჭარბა! აპარტამენტი 5-ვარსკვლავიანი სასტუმროს იყო და სახლის კომფორტით. შავი ზღვის ხედი, თანამედროვე კეთილმოწყობა დაუვიწყარი იყო!',
    verified: true,
  },
];

interface BestReviewsWidgetProps {
  maxReviews?: number;
  showSourceFilter?: boolean;
  className?: string;
  variant?: 'carousel' | 'grid';
}

export const BestReviewsWidget = ({
  maxReviews = 6,
  showSourceFilter = true,
  className,
  variant = 'carousel'
}: BestReviewsWidgetProps) => {
  const { t, language } = useLanguage();
  const [activeSource, setActiveSource] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  const sources = ['all', 'Google', 'Booking.com', 'TripAdvisor'];

  const filteredReviews = activeSource === 'all'
    ? bestReviews.slice(0, maxReviews)
    : bestReviews.filter(r => r.source === activeSource).slice(0, maxReviews);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredReviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredReviews.length) % filteredReviews.length);
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'ka' ? 'ka-GE' : 'en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const ReviewCard = ({ review, featured = false }: { review: typeof bestReviews[0], featured?: boolean }) => (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-500 bg-white border-0",
      featured ? "shadow-luxury" : "shadow-card hover:shadow-luxury",
      featured && "ring-2 ring-gold-400/50"
    )}>
      {/* Gradient accent */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
        review.sourceColor
      )} />

      <CardContent className={cn("p-6", featured && "p-8")}>
        {/* Quote Icon */}
        <Quote className="w-8 h-8 text-gold-300 mb-4 opacity-60" />

        {/* Review Text */}
        <p className={cn(
          "text-foreground/80 mb-6 italic leading-relaxed",
          featured ? "text-lg" : "text-sm line-clamp-4"
        )}>
          "{language === 'ka' ? review.textKa : review.textEn}"
        </p>

        {/* Reviewer Info */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-gold-200"
              />
              {review.verified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-foreground">{review.name}</p>
              <p className="text-xs text-muted-foreground">{review.country}</p>
            </div>
          </div>

          <div className="text-right">
            {renderStars(review.rating)}
            <div className="flex items-center gap-2 mt-1">
              <img src={review.sourceIcon} alt={review.source} className="w-4 h-4" />
              <span className="text-xs text-muted-foreground">{formatDate(review.date)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={cn("relative", className)}>
      {/* Source Filter */}
      {showSourceFilter && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {sources.map(source => (
            <Button
              key={source}
              variant={activeSource === source ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setActiveSource(source);
                setCurrentIndex(0);
              }}
              className={cn(
                "rounded-full transition-all",
                activeSource === source
                  ? "bg-gold-500 hover:bg-gold-600 text-white"
                  : "border-gold-300 hover:bg-gold-50"
              )}
            >
              {source === 'all' ? (language === 'ka' ? 'ყველა' : 'All Sources') : source}
            </Button>
          ))}
        </div>
      )}

      {variant === 'carousel' ? (
        /* Carousel View */
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gold-50 transition-colors"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gold-50 transition-colors"
            aria-label="Next review"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/* Carousel Content */}
          <div className="overflow-hidden px-8">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {filteredReviews.map((review) => (
                <div key={review.id} className="w-full flex-shrink-0 px-4">
                  <ReviewCard review={review} featured />
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {filteredReviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  idx === currentIndex
                    ? "w-8 bg-gold-500"
                    : "bg-gold-200 hover:bg-gold-300"
                )}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* Trust Badge */}
      <div className="mt-10 text-center">
        <div className="inline-flex items-center gap-4 bg-gradient-to-r from-gold-50 to-gold-100 rounded-full px-8 py-4 shadow-sm">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-gold-500 text-gold-500" />
            ))}
          </div>
          <div className="h-8 w-px bg-gold-300" />
          <div className="text-left">
            <p className="text-2xl font-bold text-foreground">4.9</p>
            <p className="text-xs text-muted-foreground">
              {language === 'ka' ? '150+ დადასტურებული მიმოხილვა' : '150+ Verified Reviews'}
            </p>
          </div>
          <div className="h-8 w-px bg-gold-300" />
          <div className="flex items-center gap-2">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            <img src="https://cf.bstatic.com/static/img/favicon/9ca83ba2a5a3293ff07452cb24949a5843af4592.svg" alt="Booking.com" className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Write Review CTA */}
      <div className="mt-6 text-center">
        <Button
          variant="outline"
          onClick={() => window.open('https://search.google.com/local/writereview?placeid=ChIJxf79LQmHZ0ARpmv2Eih-1WE', '_blank')}
          className="gap-2 border-gold-400 hover:bg-gold-50"
        >
          <ExternalLink className="w-4 h-4" />
          {language === 'ka' ? 'დაწერეთ მიმოხილვა' : 'Write a Review'}
        </Button>
      </div>
    </div>
  );
};
