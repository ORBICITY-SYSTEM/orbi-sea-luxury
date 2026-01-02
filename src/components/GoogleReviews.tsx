import { useGoogleMaps, GoogleReview } from '@/hooks/useGoogleMaps';
import { usePlaceId } from '@/hooks/usePlaceId';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GoogleReviewsProps {
  maxReviews?: number;
  minRating?: number;
  className?: string;
}

export const GoogleReviews = ({ maxReviews = 5, minRating = 4, className }: GoogleReviewsProps) => {
  const { placeDetails, loading, error } = useGoogleMaps();
  const { placeId } = usePlaceId();

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error || !placeDetails?.reviews) {
    return null;
  }

  // Filter reviews with minRating or higher, then take maxReviews
  const reviews = placeDetails.reviews
    .filter(review => review.rating >= minRating)
    .slice(0, maxReviews);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
      />
    ));
  };

  const openGoogleReviews = () => {
    window.open(
      `https://www.google.com/maps/place/?q=place_id:${placeId}`,
      '_blank'
    );
  };

  return (
    <div className={className}>
      {/* Header with rating summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img 
              src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
              alt="Google" 
              className="h-6"
            />
            <span className="text-muted-foreground">Reviews</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">{placeDetails.rating}</span>
            <div className="flex">{renderStars(Math.round(placeDetails.rating))}</div>
            <span className="text-muted-foreground">
              ({placeDetails.user_ratings_total} reviews)
            </span>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={openGoogleReviews}
          className="gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          See All Reviews
        </Button>
      </div>

      {/* Reviews grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((review, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={review.profile_photo_url}
                  alt={review.author_name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <a 
                    href={review.author_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground hover:text-primary truncate block"
                  >
                    {review.author_name}
                  </a>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-xs text-muted-foreground">
                      {review.relative_time_description}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-4">
                {review.text}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Write review CTA */}
      <div className="mt-6 text-center">
        <Button
          onClick={() => window.open(`https://search.google.com/local/writereview?placeid=${placeId}`, '_blank')}
          className="bg-teal-500 hover:bg-teal-600 text-white"
        >
          Write a Review on Google
        </Button>
      </div>
    </div>
  );
};
