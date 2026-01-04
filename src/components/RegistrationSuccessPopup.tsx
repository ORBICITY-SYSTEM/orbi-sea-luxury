import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/contexts/LanguageContext';

interface RegistrationSuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  bonusAmount?: number;
}

const RegistrationSuccessPopup = ({ 
  isOpen, 
  onClose, 
  bonusAmount = 20 
}: RegistrationSuccessPopupProps) => {
  const { language } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      // Fire confetti
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1']
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1']
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const content = {
    ka: {
      title: 'გილოცავთ!',
      subtitle: 'თქვენ წარმატებით დარეგისტრირდით',
      bonusText: 'თქვენ მიიღეთ',
      bonusLabel: 'მისასალმებელი ბონუსი',
      useInfo: 'გამოიყენეთ შემდეგ ჯავშანზე',
      continueButton: 'გაგრძელება'
    },
    en: {
      title: 'Congratulations!',
      subtitle: 'You have successfully registered',
      bonusText: 'You received',
      bonusLabel: 'Welcome Bonus',
      useInfo: 'Use it on your next booking',
      continueButton: 'Continue'
    }
  };

  const t = content[language as keyof typeof content] || content.ka;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative w-full max-w-md bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-3xl p-8 shadow-2xl border border-primary/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full p-4">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-center text-foreground mb-2"
            >
              {t.title}
            </motion.h2>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-muted-foreground mb-8"
            >
              {t.subtitle}
            </motion.p>

            {/* Bonus card */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="relative overflow-hidden bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 rounded-2xl p-6 mb-6"
            >
              {/* Sparkle effects */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute top-2 right-2"
              >
                <Sparkles className="w-6 h-6 text-white/80" />
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute bottom-2 left-2"
              >
                <Sparkles className="w-4 h-4 text-white/60" />
              </motion.div>

              <div className="relative z-10 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gift className="w-6 h-6 text-white" />
                  <span className="text-white/90 font-medium">{t.bonusText}</span>
                </div>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
                  className="text-5xl font-bold text-white mb-2"
                >
                  {bonusAmount}₾
                </motion.div>
                
                <p className="text-white/90 font-medium">{t.bonusLabel}</p>
                <p className="text-white/70 text-sm mt-1">{t.useInfo}</p>
              </div>

              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            </motion.div>

            {/* Continue button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                onClick={onClose}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold rounded-xl"
              >
                {t.continueButton}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegistrationSuccessPopup;
