import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import { useBooking } from '@/contexts/BookingContext';
import { MessageCircle, CalendarCheck } from 'lucide-react';

export const CTASection = () => {
  const { t } = useLanguage();
  const { whatsappUrl } = useWhatsApp();
  const { openBookingModal } = useBooking();

  return (
    <section className="py-20 bg-gradient-sea relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          {t('cta.title')}
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          {t('cta.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={() => openBookingModal()}
            className="group relative bg-gradient-to-r from-gold-400 via-gold-300 to-gold-400 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-navy-900 font-bold text-lg px-12 py-6 rounded-full transition-all duration-500 hover:scale-105 overflow-hidden shadow-[0_4px_25px_rgba(212,175,55,0.5)] hover:shadow-[0_8px_35px_rgba(212,175,55,0.7)]"
          >
            {/* Shine effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            {/* 3D border effect */}
            <span className="absolute inset-0 rounded-full border-2 border-gold-200/50" />
            <span className="absolute inset-[3px] rounded-full border border-gold-600/30" />
            {/* Content */}
            <span className="relative z-10 flex items-center drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
              <CalendarCheck className="w-5 h-5 mr-2" />
              {t('hero.bookNow')}
            </span>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="group relative border-2 border-gold-400/70 text-white hover:text-navy-900 font-bold text-lg px-12 py-6 rounded-full transition-all duration-500 hover:scale-105 overflow-hidden hover:border-gold-400 hover:bg-gradient-to-r hover:from-gold-400 hover:via-gold-300 hover:to-gold-400 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.5)]"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              {/* Shine effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative z-10 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
