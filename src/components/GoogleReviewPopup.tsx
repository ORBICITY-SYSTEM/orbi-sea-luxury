import { useState, useEffect } from 'react';
import { Star, X, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { trackConversion } from '@/lib/tracking';
import { motion, AnimatePresence } from 'framer-motion';

export const GoogleReviewPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language } = useLanguage();
  const { settings } = useSiteSettings();

  useEffect(() => {
    const hasSeenReviewPopup = sessionStorage.getItem('hasSeenReviewPopup');
    const hasSeenDiscountPopup = sessionStorage.getItem('hasSeenDiscountPopup');
    
    if (!hasSeenReviewPopup && hasSeenDiscountPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('hasSeenReviewPopup', 'true');
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleReview = () => {
    // Track conversion
    trackConversion('GoogleReviewClick', {
      content_name: 'Google Review Click'
    });
    
    const reviewUrl = settings?.google_review_url || 'https://g.page/r/CbJqWzOE_YNAEBM/review';
    window.open(reviewUrl, '_blank');
    setIsOpen(false);
  };

  const discountPercentage = settings?.review_popup_discount || '10';

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-md overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
              
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                <motion.div 
                  className="flex gap-1 text-yellow-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </motion.div>
                  ))}
                </motion.div>
                
                <h2 className="text-2xl font-bold text-center">
                  {language === 'ka' ? 'მოგწონდა ჩვენთან ყოფნა?' : 'Enjoyed your stay?'}
                </h2>
                
                <p className="text-center text-muted-foreground">
                  {language === 'ka' 
                    ? `დაგვწერეთ შეფასება Google-ზე და მიიღეთ ${discountPercentage}% ფასდაკლება შემდეგ ჯავშანზე!`
                    : `Leave us a Google review and get ${discountPercentage}% off your next booking!`
                  }
                </p>
                
                <Button 
                  onClick={handleReview}
                  className="w-full gap-2"
                  size="lg"
                >
                  <ExternalLink className="h-4 w-4" />
                  {language === 'ka' ? 'შეფასების დატოვება' : 'Leave a Review'}
                </Button>
                
                <Button 
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  className="w-full"
                >
                  {language === 'ka' ? 'მოგვიანებით' : 'Maybe Later'}
                </Button>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
