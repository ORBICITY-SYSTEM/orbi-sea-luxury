import { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';

export const GoogleReviewPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenReviewPopup = sessionStorage.getItem('hasSeenReviewPopup');
    const hasSeenDiscountPopup = sessionStorage.getItem('hasSeenDiscountPopup');
    
    if (!hasSeenReviewPopup && hasSeenDiscountPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('hasSeenReviewPopup', 'true');
      }, 30000); // Show after 30 seconds (after discount popup)

      return () => clearTimeout(timer);
    }
  }, []);

  const handleReview = () => {
    // Track with Meta Pixel if available
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: 'Google Review Click'
      });
    }
    
    // Open Google review link (replace with actual Google place ID)
    window.open('https://g.page/r/YOUR_GOOGLE_PLACE_ID/review', '_blank');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <div className="flex gap-1 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-8 h-8 fill-current" />
            ))}
          </div>
          
          <h2 className="text-2xl font-bold text-center">
            მოგწონდა ჩვენთან ყოფნა?
          </h2>
          
          <p className="text-center text-muted-foreground">
            დაგვწერეთ შეფასება Google-ზე და მიიღეთ 10% ფასდაკლება შემდეგ ჯავშანზე!
          </p>
          
          <Button 
            onClick={handleReview}
            className="w-full"
            size="lg"
          >
            შეფასების დატოვება
          </Button>
          
          <Button 
            onClick={() => setIsOpen(false)}
            variant="ghost"
            className="w-full"
          >
            მოგვიანებით
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
