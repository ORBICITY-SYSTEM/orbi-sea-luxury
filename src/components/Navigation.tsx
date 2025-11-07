import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe, LogIn } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.jpg';
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
  const location = useLocation();

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
    { key: 'nav.home', path: '/' },
    { key: 'nav.rooms', path: '/apartments' },
    { key: 'nav.amenities', path: '/amenities' },
    { key: 'Gallery', path: '/gallery' },
    { key: 'nav.location', path: '/location' },
    { key: 'nav.contact', path: '/contact' },
    { key: 'Loyalty Program', path: '/loyalty-program' },
    { key: 'Blog', path: '/blog' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2C3E50] shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/"
            className="flex items-center space-x-2 group"
          >
            <img 
              src={logo} 
              alt="Orbi City Batumi" 
              className="h-14 w-auto group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.path}
                className={`text-white hover:text-secondary transition-colors font-medium ${
                  location.pathname === link.path ? 'text-secondary' : ''
                }`}
              >
                {t(link.key) || link.key}
              </Link>
            ))}
          </div>

          {/* Right Side - Language + Book Now */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/10">
                  <Globe className="w-4 h-4" />
                  <span>{languageNames[language]}</span>
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

            {/* Login Button */}
            <Button 
              variant="ghost"
              size="sm"
              className="hidden md:flex text-white hover:bg-white/10 gap-2"
            >
              <LogIn className="w-4 h-4" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-white/10 bg-[#2C3E50]">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left py-2 px-2 text-white hover:bg-white/10 rounded transition-colors font-medium"
              >
                {t(link.key) || link.key}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
