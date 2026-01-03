import { motion } from 'framer-motion';
import { Gift, Sparkles, Sun } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const WelcomeBonusCard = () => {
  const { language } = useLanguage();
  const { user } = useAuth();

  // Wave SVG component
  const WaveSVG = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
    <motion.svg
      viewBox="0 0 1200 120"
      className={className}
      preserveAspectRatio="none"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
        delay,
      }}
    >
      <path
        d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z"
        fill="currentColor"
      />
    </motion.svg>
  );

  // Floating particles
  const FloatingParticle = ({ delay, x, size }: { delay: number; x: number; size: number }) => (
    <motion.div
      className="absolute rounded-full bg-white/30"
      style={{ width: size, height: size, left: `${x}%` }}
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: -50, opacity: [0, 1, 0] }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
  );

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-2xl">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600" />
      
      {/* Animated sun */}
      <motion.div
        className="absolute -top-10 -right-10 w-40 h-40"
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
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full blur-md" />
          <div className="absolute inset-4 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full" />
          {/* Sun rays */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 w-1 h-24 bg-yellow-300/50 origin-bottom"
              style={{
                transform: `rotate(${i * 30}deg) translateX(-50%)`,
              }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <FloatingParticle key={i} delay={i * 0.5} x={Math.random() * 100} size={4 + Math.random() * 8} />
      ))}

      {/* Waves at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
        <WaveSVG className="absolute bottom-0 w-[200%] h-16 text-cyan-300/40" delay={0} />
        <WaveSVG className="absolute bottom-0 w-[200%] h-12 text-cyan-400/50" delay={0.5} />
        <WaveSVG className="absolute bottom-0 w-[200%] h-8 text-cyan-500/60" delay={1} />
      </div>

      {/* Flip flops / Beach items decoration */}
      <motion.div
        className="absolute bottom-4 left-8 text-4xl"
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🩴
      </motion.div>
      <motion.div
        className="absolute bottom-6 right-12 text-3xl"
        animate={{ rotate: [5, -5, 5], y: [0, -5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        🐚
      </motion.div>
      <motion.div
        className="absolute top-4 left-8 text-2xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🌴
      </motion.div>
      <motion.div
        className="absolute bottom-16 left-1/4 text-2xl"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        🏖️
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 p-8 md:p-12 text-center">
        {/* Sparkles around the gift */}
        <div className="relative inline-block mb-6">
          {/* Orbiting sparkles */}
          <motion.div
            className="absolute inset-0 w-32 h-32 -left-4 -top-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="absolute top-0 left-1/2 w-6 h-6 text-yellow-300" />
            <Sparkles className="absolute bottom-0 right-0 w-5 h-5 text-pink-300" />
            <Sparkles className="absolute top-1/2 left-0 w-4 h-4 text-cyan-200" />
          </motion.div>

          {/* Gift icon container */}
          <motion.div
            className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto border-4 border-white/40"
            animate={{
              boxShadow: [
                '0 0 20px rgba(255,255,255,0.5)',
                '0 0 60px rgba(255,255,255,0.8)',
                '0 0 20px rgba(255,255,255,0.5)',
              ],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <Gift className="w-12 h-12 text-white drop-shadow-lg" />
            </motion.div>
          </motion.div>
        </div>

        {/* Animated amount */}
        <motion.div
          className="mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        >
          <motion.span
            className="text-7xl md:text-8xl font-black text-white drop-shadow-lg inline-block"
            animate={{
              textShadow: [
                '0 0 10px rgba(255,255,255,0.5)',
                '0 0 40px rgba(255,255,255,0.9)',
                '0 0 10px rgba(255,255,255,0.5)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            20
          </motion.span>
          <motion.span
            className="text-5xl md:text-6xl font-bold text-yellow-300 drop-shadow-lg"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ₾
          </motion.span>
        </motion.div>

        {/* Welcome bonus text with shine effect */}
        <motion.div
          className="relative inline-block mb-6"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-widest">
            {language === 'ka' ? 'სასაჩუქრე ბონუსი' : 'Welcome Bonus'}
          </h3>
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            style={{ transform: 'skewX(-20deg)' }}
          />
        </motion.div>

        {/* Description */}
        <p className="text-white/90 mb-8 max-w-md mx-auto text-lg">
          {language === 'ka'
            ? '🎉 დარეგისტრირდით და მიიღეთ 20₾ პირველივე დაჯავშნისას გამოსაყენებლად!'
            : '🎉 Register now and receive 20 GEL to use on your first booking!'}
        </p>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { emoji: '⚡', text: language === 'ka' ? 'მყისიერი' : 'Instant' },
            { emoji: '♾️', text: language === 'ka' ? 'უვადო' : 'No expiry' },
            { emoji: '🆓', text: language === 'ka' ? 'უფასო' : 'Free' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ scale: 1.1 }}
            >
              <span className="text-xl">{feature.emoji}</span>
              <span className="text-white font-medium">{feature.text}</span>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        {!user ? (
          <Link to="/auth">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-yellow-300 hover:text-blue-700 font-bold text-lg px-8 py-6 rounded-full shadow-xl transition-all duration-300"
              >
                <Gift className="w-6 h-6 mr-2" />
                {language === 'ka' ? 'მიიღე 20₾ საჩუქრად!' : 'Get 20 GEL Free!'}
              </Button>
            </motion.div>
          </Link>
        ) : (
          <motion.div
            className="inline-flex items-center gap-2 bg-green-400/30 text-white px-6 py-3 rounded-full font-semibold"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sun className="w-5 h-5" />
            {language === 'ka' ? 'თქვენ უკვე ლოიალური წევრი ხართ!' : 'You are a loyalty member!'}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WelcomeBonusCard;
