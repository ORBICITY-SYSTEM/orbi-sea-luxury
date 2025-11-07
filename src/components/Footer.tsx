import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

export const Footer = () => {
  const { t } = useLanguage();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer id="footer" className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1: About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-gradient-gold rounded-lg flex items-center justify-center shadow-gold">
                <span className="text-2xl font-bold text-foreground">OC</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-background">ORBI CITY</span>
                <span className="text-xs text-background/70">BATUMI</span>
              </div>
            </div>
            <p className="text-background/80 mb-4">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-gradient-gold flex items-center justify-center transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-gradient-gold flex items-center justify-center transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-gradient-gold flex items-center justify-center transition-all"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {['home', 'rooms', 'amenities', 'location', 'reviews'].map((section) => (
                <li key={section}>
                  <button
                    onClick={() => scrollToSection(section === 'home' ? 'hero' : section)}
                    className="text-background/80 hover:text-background transition-colors"
                  >
                    {t(`nav.${section}`)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-background/60 mb-1">{t('footer.phone')}</p>
                  <a href="tel:+995555199090" className="text-background/80 hover:text-background">
                    +995 555 199 090
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-background/60 mb-1">{t('footer.email')}</p>
                  <a href="mailto:info@orbicitybatumi.com" className="text-background/80 hover:text-background">
                    info@orbicitybatumi.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-background/60 mb-1">{t('footer.address')}</p>
                  <p className="text-background/80">
                    Orbi City, Batumi<br />
                    Georgia
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-background/20 text-center text-background/60">
          <p>{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};
