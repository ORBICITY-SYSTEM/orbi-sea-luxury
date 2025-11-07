import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languageFlags = {
  en: '🇬🇧',
  ka: '🇬🇪',
  ru: '🇷🇺',
  tr: '🇹🇷',
  uk: '🇺🇦',
};

const languageNames = {
  en: 'EN',
  ka: 'ქარ',
  ru: 'РУС',
  tr: 'TR',
  uk: 'УКР',
};

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { key: 'nav.home', section: 'hero' },
    { key: 'nav.rooms', section: 'rooms' },
    { key: 'nav.amenities', section: 'amenities' },
    { key: 'nav.location', section: 'location' },
    { key: 'nav.reviews', section: 'reviews' },
    { key: 'nav.contact', section: 'footer' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button 
            onClick={() => scrollToSection('hero')}
            className="flex items-center space-x-2 group"
          >
            <div className="w-12 h-12 bg-gradient-gold rounded-lg flex items-center justify-center shadow-gold group-hover:scale-105 transition-transform">
              <span className="text-2xl font-bold text-foreground">OC</span>
            </div>
            <div className="hidden md:flex flex-col">
              <span className="font-bold text-lg text-foreground">ORBI CITY</span>
              <span className="text-xs text-muted-foreground">BATUMI</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => scrollToSection(link.section)}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {t(link.key)}
              </button>
            ))}
          </div>

          {/* Right Side - Language + Book Now */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="w-4 h-4" />
                  <span>{languageFlags[language]} {languageNames[language]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(Object.keys(languageNames) as Array<keyof typeof languageNames>).map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={language === lang ? 'bg-muted' : ''}
                  >
                    <span className="mr-2">{languageFlags[lang]}</span>
                    {languageNames[lang]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Book Now Button */}
            <Button 
              onClick={() => window.open('https://wa.me/+995555199090', '_blank')}
              className="hidden md:flex bg-gradient-gold hover:bg-secondary-dark text-secondary-foreground font-semibold shadow-gold"
            >
              {t('nav.bookNow')}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-4 border-t border-border">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => scrollToSection(link.section)}
                className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                {t(link.key)}
              </button>
            ))}
            <Button 
              onClick={() => {
                window.open('https://wa.me/+995555199090', '_blank');
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-gradient-gold hover:bg-secondary-dark text-secondary-foreground font-semibold"
            >
              {t('nav.bookNow')}
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
