import { useState, useEffect, useCallback } from 'react';
import { X, Copy, Check, Gift, Clock, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackConversion } from '@/lib/tracking';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const VOUCHER_CODE = 'WELCOME20';
const VOUCHER_AMOUNT = 20;

export const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { language } = useLanguage();

  // Exit intent detection
  const handleMouseLeave = useCallback((e: MouseEvent) => {
    // Only trigger when mouse leaves from the top of the page
    if (e.clientY <= 0) {
      const hasSeenExitPopup = localStorage.getItem('hasSeenExitIntentPopup');
      const hasBooked = localStorage.getItem('guestBookings');

      // Don't show if already seen or already booked
      if (!hasSeenExitPopup && !hasBooked) {
        setIsOpen(true);
        localStorage.setItem('hasSeenExitIntentPopup', 'true');

        // Track the popup view
        trackConversion('ExitIntentPopupView', {
          content_name: 'Exit Intent Voucher',
          value: VOUCHER_AMOUNT,
          currency: 'GEL'
        } as any);
      }
    }
  }, []);

  useEffect(() => {
    // Add exit intent listener after a short delay (don't show immediately)
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000); // Wait 5 seconds before enabling

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseLeave]);

  // Trigger confetti when popup opens
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF6347', '#00CED1', '#9370DB']
      });
    }
  }, [isOpen]);

  const copyVoucher = async () => {
    try {
      await navigator.clipboard.writeText(VOUCHER_CODE);
      setIsCopied(true);

      // Track conversion
      trackConversion('ExitIntentVoucherCopy', {
        content_name: 'Exit Intent Voucher Copy',
        value: VOUCHER_AMOUNT,
        currency: 'GEL'
      } as any);

      toast.success(
        language === 'ka'
          ? '✓ ვაუჩერი დაკოპირდა!'
          : '✓ Voucher copied!'
      );

      setTimeout(() => setIsCopied(false), 3000);
    } catch {
      toast.error(language === 'ka' ? 'კოპირება ვერ მოხერხდა' : 'Failed to copy');
    }
  };

  const handleBookNow = () => {
    copyVoucher();
    setIsOpen(false);
    // Scroll to booking section or open booking modal
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-lg overflow-hidden border-2 border-gold-400/50 bg-gradient-to-br from-background via-background to-gold-50/20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 rounded-full p-1 opacity-70 ring-offset-background transition-all hover:opacity-100 hover:bg-muted"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>

              <div className="flex flex-col items-center justify-center gap-5 py-6 px-2">
                {/* Animated Gift Icon */}
                <motion.div
                  className="relative"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 10, delay: 0.1 }}
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-400/30">
                    <Gift className="w-12 h-12 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Sparkles className="w-6 h-6 text-gold-500" />
                  </motion.div>
                </motion.div>

                {/* Headline */}
                <motion.div
                  className="text-center space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 bg-clip-text text-transparent">
                    {language === 'ka'
                      ? '🎁 მოიცადე!'
                      : '🎁 Wait!'
                    }
                  </h2>
                  <p className="text-xl font-semibold text-foreground">
                    {language === 'ka'
                      ? `მიიღე ${VOUCHER_AMOUNT}₾ ფასდაკლება!`
                      : `Get ${VOUCHER_AMOUNT} GEL Off!`
                    }
                  </p>
                </motion.div>

                {/* Subtext */}
                <p className="text-center text-muted-foreground max-w-sm">
                  {language === 'ka'
                    ? 'სანამ წახვალ, აი შენი სპეციალური ვაუჩერი პირველი დაჯავშნისთვის!'
                    : 'Before you go, here\'s a special voucher for your first booking!'
                  }
                </p>

                {/* Voucher Code Box */}
                <motion.div
                  className="relative bg-gradient-to-r from-gold-100 via-gold-50 to-gold-100 dark:from-gold-900/30 dark:via-gold-800/20 dark:to-gold-900/30 px-8 py-5 rounded-xl w-full text-center cursor-pointer border-2 border-dashed border-gold-400 hover:border-gold-500 transition-all group"
                  onClick={copyVoucher}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Scissors decoration */}
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-background px-1">
                    <span className="text-xl">✂️</span>
                  </div>

                  <p className="text-xs text-gold-600 dark:text-gold-400 font-medium mb-1 uppercase tracking-wider">
                    {language === 'ka' ? 'შენი ვაუჩერი' : 'Your Voucher Code'}
                  </p>
                  <p className="text-4xl font-mono font-bold text-gold-700 dark:text-gold-300 tracking-widest">
                    {VOUCHER_CODE}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1 group-hover:text-gold-600 transition-colors">
                    <Copy className="w-3 h-3" />
                    {language === 'ka' ? 'დააკლიკე კოპირებისთვის' : 'Click to copy'}
                  </p>

                  {/* Value badge */}
                  <div className="absolute -top-3 -right-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                    -{VOUCHER_AMOUNT}₾
                  </div>
                </motion.div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button
                    onClick={handleBookNow}
                    className="flex-1 gap-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white shadow-lg shadow-gold-400/30 h-12 text-base"
                  >
                    <Gift className="h-5 w-5" />
                    {language === 'ka' ? 'დაჯავშნე ახლავე!' : 'Book Now!'}
                  </Button>
                  <Button
                    onClick={copyVoucher}
                    variant="outline"
                    className="flex-1 gap-2 border-gold-400 hover:bg-gold-50 dark:hover:bg-gold-900/20 h-12"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        {language === 'ka' ? 'დაკოპირდა!' : 'Copied!'}
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        {language === 'ka' ? 'კოპირება' : 'Copy Code'}
                      </>
                    )}
                  </Button>
                </div>

                {/* Urgency indicator */}
                <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span>
                    {language === 'ka'
                      ? 'მოქმედებს შეზღუდული დროით!'
                      : 'Limited time offer!'
                    }
                  </span>
                </div>

                {/* Fine print */}
                <p className="text-[10px] text-muted-foreground text-center">
                  {language === 'ka'
                    ? `* ${VOUCHER_AMOUNT}₾ ფასდაკლება პირველი ჯავშნისთვის. მოქმედებს 2026 წლის ბოლომდე.`
                    : `* ${VOUCHER_AMOUNT} GEL discount for your first booking. Valid until end of 2026.`
                  }
                </p>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
