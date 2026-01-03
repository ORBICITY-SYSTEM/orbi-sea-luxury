import { Star, ExternalLink, CheckCircle, Heart, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePlaceId } from '@/hooks/usePlaceId';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import { trackConversion } from '@/lib/tracking';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

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
  const { openWhatsApp } = useWhatsApp();

  // Trigger confetti when popup opens
  const fireConfetti = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Confetti from both sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FFA500', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FFA500', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'],
      });
    }, 250);

    // Cleanup
    setTimeout(() => clearInterval(interval), duration);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Fire confetti with a slight delay for better effect
      const timer = setTimeout(fireConfetti, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, fireConfetti]);

  const handleWriteReview = () => {
    trackConversion('GoogleReviewClick', {
      content_name: 'Post-Booking Review Click'
    });
    
    const reviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;
    window.open(reviewUrl, '_blank');
  };

  const handleWhatsAppClick = () => {
    trackConversion('WhatsAppClick', {
      content_name: 'Post-Booking WhatsApp Click'
    });
    
    const message = language === 'ka'
      ? `გამარჯობა! ახლახან დავჯავშნე ოთახი. მინდა დავადასტურო ჩემი ჯავშანი. სახელი: ${guestName}`
      : `Hello! I just booked a room. I'd like to confirm my reservation. Name: ${guestName}`;
    
    openWhatsApp(message);
  };

  const firstName = guestName.split(' ')[0] || guestName;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md overflow-hidden border-none bg-gradient-to-b from-background to-muted/30">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="text-center py-6 relative"
            >
              {/* Floating sparkles background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: [0, (i % 2 ? 20 : -20)],
                      y: [0, -30]
                    }}
                    transition={{
                      duration: 2,
                      delay: 0.5 + i * 0.2,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                    className="absolute"
                    style={{
                      left: `${15 + i * 15}%`,
                      top: `${20 + (i % 3) * 20}%`
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-gold-400" />
                  </motion.div>
                ))}
              </div>

              {/* Success Animation - Enhanced */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                className="relative mx-auto mb-6"
              >
                {/* Glow effect */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 w-28 h-28 mx-auto bg-gradient-to-br from-green-400/30 to-emerald-500/30 rounded-full blur-xl -top-2 -left-2"
                />
                
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                  >
                    <CheckCircle className="w-14 h-14 text-white drop-shadow-lg" />
                  </motion.div>
                  
                  {/* Pulse rings */}
                  <motion.div
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border-2 border-green-400"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                    className="absolute inset-0 rounded-full border-2 border-emerald-400"
                  />
                </div>
                
                {/* Heart badge */}
                <motion.div
                  initial={{ scale: 0, x: 20, y: 20, opacity: 0 }}
                  animate={{ scale: 1, x: 0, y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
                  className="absolute -top-2 -right-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full p-2 shadow-lg"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    <Heart className="w-5 h-5 text-white fill-white" />
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Thank You Message */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="text-2xl font-bold text-foreground mb-2"
              >
                {language === 'ka' 
                  ? `მადლობა, ${firstName}!` 
                  : `Thank you, ${firstName}!`}
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.5, delay: 0.8, repeat: 2 }}
                  className="inline-block ml-2"
                >
                  🎉
                </motion.span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mb-6"
              >
                {language === 'ka' 
                  ? 'თქვენი ჯავშანი წარმატებით შეიქმნა. დადასტურება გამოგზავნილია თქვენს ელ.ფოსტაზე.'
                  : 'Your booking has been confirmed. A confirmation email has been sent to you.'}
              </motion.p>

              {/* Stars Animation - Enhanced */}
              <motion.div 
                className="flex justify-center gap-1.5 mb-5"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30, rotate: -30 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ 
                      delay: 0.6 + i * 0.1,
                      type: 'spring',
                      stiffness: 200
                    }}
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        delay: 1 + i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    >
                      <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 drop-shadow-md" />
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Review Request - Enhanced */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.0, type: 'spring' }}
                className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl p-4 mb-6 border border-primary/10"
              >
                <p className="text-sm text-foreground font-medium mb-1">
                  {language === 'ka' 
                    ? '✨ გაგვიზიარეთ თქვენი გამოცდილება!'
                    : '✨ Share your experience with us!'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === 'ka' 
                    ? 'თქვენი შეფასება დაგვეხმარება სერვისის გაუმჯობესებაში'
                    : 'Your review helps us improve our service'}
                </p>
              </motion.div>

              {/* Action Buttons - Enhanced */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={handleWriteReview}
                      className="w-full gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-lg"
                      size="lg"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {language === 'ka' ? 'შეფასება' : 'Review'}
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={handleWhatsAppClick}
                      className="w-full gap-2 bg-success hover:bg-success/90 shadow-lg"
                      size="lg"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </Button>
                  </motion.div>
                </div>
                
                <Button 
                  onClick={onClose}
                  variant="ghost"
                  className="w-full hover:bg-muted"
                >
                  {language === 'ka' ? 'დახურვა' : 'Close'}
                </Button>
              </motion.div>

              {/* Payment Note - Enhanced */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground"
              >
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💳
                </motion.span>
                <span>
                  {language === 'ka' 
                    ? 'გადახდა: სასტუმროში მოსვლისას' 
                    : 'Payment: Upon arrival at hotel'}
                </span>
              </motion.div>

              {/* Free cancellation badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20"
              >
                <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium text-green-600">
                  {language === 'ka' ? 'უფასო გაუქმება' : 'Free Cancellation'}
                </span>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
