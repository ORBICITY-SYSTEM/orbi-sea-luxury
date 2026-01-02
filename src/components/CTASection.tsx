import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export const CTASection = () => {
  const { t } = useLanguage();

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
        <Button
          asChild
          size="lg"
          className="bg-gradient-gold hover:bg-secondary-dark text-secondary-foreground font-bold text-lg px-12 py-6 shadow-gold hover:scale-105 transition-transform"
        >
          <a href="https://wa.me/995555199090" target="_blank" rel="noopener noreferrer">
            {t('cta.button')}
          </a>
        </Button>
      </div>
    </section>
  );
};
