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
            className="bg-gradient-gold hover:bg-secondary-dark text-secondary-foreground font-bold text-lg px-12 py-6 shadow-gold hover:scale-105 transition-transform"
          >
            <CalendarCheck className="w-5 h-5 mr-2" />
            {t('hero.bookNow')}
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold text-lg px-12 py-6 hover:scale-105 transition-transform"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
