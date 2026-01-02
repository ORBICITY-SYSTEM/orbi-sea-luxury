import { useState, useEffect } from 'react';
import { X, Copy, Check, Gift } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { trackConversion } from '@/lib/tracking';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export const DiscountPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { language } = useLanguage();
  const { settings } = useSiteSettings();

  const voucherCode = settings?.discount_popup_code || 'ORBI20';
  const discountPercentage = settings?.discount_popup_percentage || '20';

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('hasSeenDiscountPopup');
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('hasSeenDiscountPopup', 'true');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const copyVoucher = async () => {
    try {
      await navigator.clipboard.writeText(voucherCode);
      setIsCopied(true);
      
      // Track conversion
      trackConversion('DiscountVoucherCopy', {
        content_name: 'Discount Voucher',
        value: parseInt(discountPercentage),
        currency: 'USD'
      } as any);

      toast.success(
        language === 'ka' 
          ? 'ვაუჩერი დაკოპირდა!' 
          : 'Voucher copied!'
      );

      setTimeout(() => setIsCopied(false), 3000);
    } catch {
      toast.error(language === 'ka' ? 'კოპირება ვერ მოხერხდა' : 'Failed to copy');
    }
  };

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
                  className="w-20 h-20 rounded-full bg-gradient-gold flex items-center justify-center"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12 }}
                >
                  <Gift className="w-10 h-10 text-secondary-foreground" />
                </motion.div>
                
                <motion.h2 
                  className="text-2xl font-bold text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {language === 'ka' 
                    ? `მიიღე ${discountPercentage}% ფასდაკლება!` 
                    : `Get ${discountPercentage}% Off!`
                  }
                </motion.h2>
                
                <p className="text-center text-muted-foreground">
                  {language === 'ka' 
                    ? 'გამოიყენე ვაუჩერი პირველი ჯავშნისთვის' 
                    : 'Use this voucher for your first booking'
                  }
                </p>
                
                <motion.div 
                  className="bg-primary/10 px-6 py-4 rounded-lg w-full text-center cursor-pointer hover:bg-primary/20 transition-colors"
                  onClick={copyVoucher}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <p className="text-3xl font-mono font-bold text-primary tracking-wider">
                    {voucherCode}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === 'ka' ? 'დააკლიკე კოპირებისთვის' : 'Click to copy'}
                  </p>
                </motion.div>
                
                <div className="flex gap-2 w-full">
                  <Button 
                    onClick={copyVoucher}
                    className="flex-1 gap-2"
                    variant={isCopied ? 'secondary' : 'default'}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-4 w-4" />
                        {language === 'ka' ? 'დაკოპირდა!' : 'Copied!'}
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        {language === 'ka' ? 'კოპირება' : 'Copy'}
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={() => setIsOpen(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    {language === 'ka' ? 'დახურვა' : 'Close'}
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground text-center">
                  {language === 'ka' 
                    ? '* ფასდაკლება მოქმედებს 3 ღამე ან მეტი ხნით დაჯავშნაზე' 
                    : '* Discount valid for bookings of 3 nights or more'
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
