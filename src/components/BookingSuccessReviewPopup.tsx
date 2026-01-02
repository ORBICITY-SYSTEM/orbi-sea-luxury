import { Star, ExternalLink, CheckCircle, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePlaceId } from '@/hooks/usePlaceId';
import { trackConversion } from '@/lib/tracking';
import { motion } from 'framer-motion';

interface BookingSuccessReviewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  guestName: string;
}

export const BookingSuccessReviewPopup = ({ 
  isOpen, 
  onClose, 
  guestName 
}: BookingSuccessReviewPopupProps) => {
  const { language } = useLanguage();
  const { placeId } = usePlaceId();

  const handleWriteReview = () => {
    trackConversion('GoogleReviewClick', {
      content_name: 'Post-Booking Review Click'
    });
    
    const reviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;
    window.open(reviewUrl, '_blank');
  };

  const firstName = guestName.split(' ')[0] || guestName;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden border-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20 }}
          className="text-center py-6"
        >
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="relative mx-auto mb-6"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-2"
            >
              <Heart className="w-5 h-5 text-white fill-white" />
            </motion.div>
          </motion.div>

          {/* Thank You Message */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-foreground mb-2"
          >
            {language === 'ka' 
              ? `მადლობა, ${firstName}! 🎉` 
              : `Thank you, ${firstName}! 🎉`}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground mb-6"
          >
            {language === 'ka' 
              ? 'თქვენი ჯავშანი წარმატებით შეიქმნა. დადასტურება გამოგზავნილია თქვენს ელ.ფოსტაზე.'
              : 'Your booking has been confirmed. A confirmation email has been sent to you.'}
          </motion.p>

          {/* Stars Animation */}
          <motion.div 
            className="flex justify-center gap-1 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <Star className="w-7 h-7 text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}
          </motion.div>

          {/* Review Request */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-muted/50 rounded-xl p-4 mb-6"
          >
            <p className="text-sm text-foreground font-medium mb-1">
              {language === 'ka' 
                ? 'გაგვიზიარეთ თქვენი გამოცდილება!'
                : 'Share your experience with us!'}
            </p>
            <p className="text-xs text-muted-foreground">
              {language === 'ka' 
                ? 'თქვენი შეფასება დაგვეხმარება სერვისის გაუმჯობესებაში'
                : 'Your review helps us improve our service'}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="space-y-3"
          >
            <Button 
              onClick={handleWriteReview}
              className="w-full gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
              size="lg"
            >
              <ExternalLink className="h-4 w-4" />
              {language === 'ka' ? 'დაწერეთ შეფასება Google-ზე' : 'Write a Review on Google'}
            </Button>
            
            <Button 
              onClick={onClose}
              variant="ghost"
              className="w-full"
            >
              {language === 'ka' ? 'მოგვიანებით' : 'Maybe Later'}
            </Button>
          </motion.div>

          {/* Payment Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-xs text-muted-foreground mt-4"
          >
            {language === 'ka' 
              ? '💳 გადახდა: სასტუმროში მოსვლისას' 
              : '💳 Payment: Upon arrival at hotel'}
          </motion.p>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
