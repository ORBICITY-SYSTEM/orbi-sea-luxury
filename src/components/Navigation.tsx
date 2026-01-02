import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe, LogIn, LogOut, User, ChevronDown, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import logo from '@/assets/logo.jpg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { key: 'nav.home', path: '/' },
    { key: 'nav.rooms', path: '/apartments' },
    { key: 'nav.amenities', path: '/amenities' },
    { key: 'Gallery', path: '/gallery' },
    { key: 'nav.videos', path: '/youtube-videos' },
    { key: 'nav.location', path: '/location' },
    { key: 'nav.contact', path: '/contact' },
    { key: 'Loyalty Program', path: '/loyalty-program' },
    { key: 'Blog', path: '/blog' },
    ...(isAdmin ? [{ key: 'Admin', path: '/admin' }] : []),
  ];

  return (
    <>
      {/* Top Bar - Four Seasons Style */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-navy-900 text-white/80 text-xs py-2 transition-all duration-500 ${
        isScrolled ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
      }`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+995555199090" className="flex items-center gap-2 hover:text-gold-400 transition-colors">
              <Phone className="w-3 h-3" />
              <span>+995 555 199 090</span>
            </a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="text-gold-400">★★★★★</span>
            <span>Luxury Aparthotel in Batumi</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'top-0 bg-navy-900/98 backdrop-blur-xl shadow-nav py-3' 
          : 'top-8 bg-navy-900/95 backdrop-blur-lg py-4'
      }`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/"
              className="flex items-center gap-4 group"
            >
              <div className="relative">
                <img 
                  src={logo} 
                  alt="Orbi City Batumi" 
                  className={`transition-all duration-500 ${isScrolled ? 'h-12' : 'h-14'} w-auto rounded-lg shadow-md`}
                />
                <div className="absolute inset-0 rounded-lg border border-gold-400/20 group-hover:border-gold-400/40 transition-colors" />
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-serif font-light text-gold-400 tracking-wider block">ORBI CITY</span>
                <span className="text-[10px] text-white/60 tracking-[0.3em] uppercase">Batumi</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  to={link.path}
                  className={`relative px-4 py-2 font-sans text-sm tracking-wide transition-all duration-300 group ${
                    location.pathname === link.path 
                      ? 'text-gold-400' 
                      : 'text-white/90 hover:text-gold-400'
                  }`}
                >
                  {t(link.key) || link.key}
                  {/* Underline Effect */}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full transition-all duration-300 ${
                    location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2 text-white/90 hover:text-gold-400 hover:bg-white/5 border border-white/10 hover:border-gold-400/30 rounded-full px-4 transition-all duration-300"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="font-sans text-sm">{languageNames[language]}</span>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-navy-900/98 backdrop-blur-xl border border-gold-400/20 shadow-luxury min-w-[160px] rounded-xl"
                >
                  {(Object.keys(languageNames) as Array<keyof typeof languageNames>).map((lang) => (
                    <DropdownMenuItem
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`cursor-pointer transition-all duration-200 rounded-lg mx-1 ${
                        language === lang 
                          ? 'bg-gold-400/15 text-gold-400' 
                          : 'text-white hover:bg-white/10 hover:text-gold-400'
                      }`}
                    >
                      <span className="mr-3 text-lg">{languageFlags[lang]}</span>
                      <span className="font-medium">{languageNames[lang]}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Auth Button */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="hidden md:flex text-white/90 hover:text-gold-400 hover:bg-white/5 gap-2 transition-all duration-300 rounded-full px-4 border border-white/10 hover:border-gold-400/30"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                        <User className="w-4 h-4 text-navy-900" />
                      </div>
                      <span className="max-w-[80px] truncate text-sm font-medium">
                        {user.email?.split('@')[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="bg-navy-900/98 backdrop-blur-xl border border-gold-400/20 shadow-luxury rounded-xl"
                  >
                    <DropdownMenuItem 
                      onClick={() => window.location.href = '/loyalty-program'}
                      className="text-white hover:bg-white/10 hover:text-gold-400 cursor-pointer rounded-lg mx-1"
                    >
                      <User className="w-4 h-4 mr-2" />
                      პროფილი
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem 
                      onClick={() => signOut()}
                      className="text-white hover:bg-white/10 hover:text-gold-400 cursor-pointer rounded-lg mx-1"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      გასვლა
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth" className="hidden md:block">
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="text-white/90 hover:text-gold-400 hover:bg-white/5 gap-2 transition-all duration-300 rounded-full px-5 border border-white/10 hover:border-gold-400/30"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="font-medium">შესვლა</span>
                  </Button>
                </Link>
              )}

              {/* Book Now Button - Desktop */}
              <Button
                onClick={() => document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })}
                className="hidden lg:flex bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-navy-900 font-semibold px-6 py-2 rounded-full shadow-gold hover:shadow-glow transition-all duration-300 tracking-wide"
              >
                {t('nav.bookNow')}
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-white/10 rounded-full w-10 h-10"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <div className="relative w-6 h-6">
                  <span className={`absolute left-0 block w-6 h-0.5 bg-current transition-all duration-300 ease-out ${isMobileMenuOpen ? 'top-3 rotate-45' : 'top-1'}`} />
                  <span className={`absolute left-0 top-3 block w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`} />
                  <span className={`absolute left-0 block w-6 h-0.5 bg-current transition-all duration-300 ease-out ${isMobileMenuOpen ? 'top-3 -rotate-45' : 'top-5'}`} />
                </div>
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
            isMobileMenuOpen ? 'max-h-[700px] opacity-100 mt-6' : 'max-h-0 opacity-0'
          }`}>
            <div className="py-6 space-y-2 border-t border-gold-400/20">
              {navLinks.map((link, index) => (
                <Link
                  key={link.key}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-3 px-5 rounded-xl font-medium transition-all duration-300 ${
                    location.pathname === link.path 
                      ? 'bg-gold-400/15 text-gold-400 border-l-4 border-gold-400' 
                      : 'text-white/90 hover:bg-white/5 hover:text-gold-400 hover:pl-7'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {t(link.key) || link.key}
                </Link>
              ))}
              
              {/* Mobile Book Now Button */}
              <div className="pt-4">
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-navy-900 font-semibold py-4 rounded-xl shadow-gold"
                >
                  {t('nav.bookNow')}
                </Button>
              </div>
              
              {/* Mobile Auth */}
              <div className="pt-4 mt-4 border-t border-gold-400/20">
                {user ? (
                  <>
                    <Link
                      to="/loyalty-program"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 py-3 px-5 rounded-xl text-white/90 hover:bg-white/5 hover:text-gold-400 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-navy-900" />
                      </div>
                      <div>
                        <span className="font-medium block">{user.email?.split('@')[0]}</span>
                        <span className="text-xs text-white/50">პროფილის ნახვა</span>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-4 w-full py-3 px-5 rounded-xl text-white/90 hover:bg-white/5 hover:text-gold-400 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <LogOut className="w-5 h-5" />
                      </div>
                      <span className="font-medium">გასვლა</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 py-3 px-5 rounded-xl bg-gold-400/15 text-gold-400 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-gold-400/20 flex items-center justify-center">
                      <LogIn className="w-5 h-5" />
                    </div>
                    <span className="font-medium">შესვლა / რეგისტრაცია</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
