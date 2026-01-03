import { motion } from 'framer-motion';
import { Gift, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const WelcomeBonusCard = () => {
  const { language } = useLanguage();
  const { user } = useAuth();

  return (
    <motion.div 
      className="relative overflow-hidden rounded-2xl p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background gradient - beach/sea theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600" />
      
      {/* Animated sun */}
      <motion.div
        className="absolute -top-6 -right-6 w-24 h-24"
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full blur-sm" />
          <div className="absolute inset-2 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full" />
          {/* Sun rays */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 w-0.5 h-12 bg-yellow-300/50 origin-bottom"
              style={{
                transform: `rotate(${i * 45}deg) translateX(-50%)`,
              }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Waves at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden">
        <motion.svg
          viewBox="0 0 1200 120"
          className="absolute bottom-0 w-[200%] h-8 text-cyan-300/40"
          preserveAspectRatio="none"
          animate={{ x: [-100, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        >
          <path d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z" fill="currentColor" />
        </motion.svg>
        <motion.svg
          viewBox="0 0 1200 120"
          className="absolute bottom-0 w-[200%] h-6 text-cyan-400/50"
          preserveAspectRatio="none"
          animate={{ x: [0, -100] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 0.3 }}
        >
          <path d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z" fill="currentColor" />
        </motion.svg>
      </div>

      {/* Beach decorations */}
      <motion.span
        className="absolute bottom-3 left-4 text-xl"
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🩴
      </motion.span>
      <motion.span
        className="absolute bottom-4 left-16 text-lg"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        🐚
      </motion.span>
      <motion.span
        className="absolute top-3 left-4 text-lg"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🌴
      </motion.span>

      {/* Main content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left side - Gift icon with sparkles */}
        <div className="relative flex items-center gap-4">
          <motion.div
            className="absolute -inset-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="absolute top-0 left-1/2 w-4 h-4 text-yellow-300" />
            <Sparkles className="absolute bottom-0 right-0 w-3 h-3 text-pink-300" />
          </motion.div>

          <motion.div
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40"
            animate={{
              boxShadow: [
                '0 0 15px rgba(255,255,255,0.4)',
                '0 0 30px rgba(255,255,255,0.7)',
                '0 0 15px rgba(255,255,255,0.4)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <Gift className="w-8 h-8 text-white drop-shadow-lg" />
            </motion.div>
          </motion.div>

          {/* Amount */}
          <div className="flex items-baseline">
            <motion.span
              className="text-5xl md:text-6xl font-black text-white drop-shadow-lg"
              animate={{
                textShadow: [
                  '0 0 10px rgba(255,255,255,0.5)',
                  '0 0 30px rgba(255,255,255,0.9)',
                  '0 0 10px rgba(255,255,255,0.5)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              20
            </motion.span>
            <motion.span
              className="text-3xl md:text-4xl font-bold text-yellow-300 drop-shadow-lg ml-1"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ₾
            </motion.span>
          </div>
        </div>

        {/* Center - Text */}
        <div className="text-center md:text-left flex-1">
          <motion.h3
            className="text-xl md:text-2xl font-bold text-white uppercase tracking-wide relative inline-block"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {language === 'ka' ? 'სასაჩუქრე ბონუსი' : 'Welcome Bonus'}
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              style={{ transform: 'skewX(-20deg)' }}
            />
          </motion.h3>
          <p className="text-white/90 text-sm md:text-base mt-1">
            {language === 'ka'
              ? '🎉 დარეგისტრირდით და მიიღეთ 20₾ საჩუქრად!'
              : '🎉 Register and get 20 GEL free!'}
          </p>
        </div>

        {/* Right side - CTA */}
        {!user ? (
          <Link to="/auth">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-yellow-300 hover:text-blue-700 font-bold px-6 py-3 rounded-full shadow-xl whitespace-nowrap"
              >
                <Gift className="w-5 h-5 mr-2" />
                {language === 'ka' ? 'მიიღე!' : 'Get it!'}
              </Button>
            </motion.div>
          </Link>
        ) : (
          <motion.div
            className="flex items-center gap-2 bg-green-400/30 text-white px-4 py-2 rounded-full font-semibold text-sm"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✓ {language === 'ka' ? 'ლოიალური წევრი' : 'Member'}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default WelcomeBonusCard;
