import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe, LogIn, LogOut, User, ChevronDown, LayoutDashboard } from 'lucide-react';
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
    { key: 'Apartments', path: '/apartments' },
    { key: 'nav.amenities', path: '/amenities' },
    { key: 'Gallery', path: '/gallery' },
    { key: 'nav.location', path: '/location' },
    { key: 'nav.contact', path: '/contact' },
    { key: 'Bonuses', path: '/loyalty-program' },
    { key: 'Blog', path: '/blog' },
    ...(isAdmin ? [{ key: 'Admin', path: '/admin' }] : []),
  ];

  return (
    <nav className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'top-0 bg-white/95 backdrop-blur-xl shadow-md py-3' 
        : 'top-0 bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo - Manus Style */}
          <Link 
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <img 
                src={logo} 
                alt="Orbi City Batumi" 
                className={`transition-all duration-500 ${isScrolled ? 'h-10' : 'h-12'} w-auto rounded-lg`}
              />
            </div>
            <div className="hidden sm:block">
              <span className={`text-xl font-serif font-normal tracking-wider block transition-colors duration-300 ${
                isScrolled ? 'text-navy-800' : 'text-white'
              }`}>
                ORBI CITY
              </span>
              <span className={`text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ${
                isScrolled ? 'text-gold-600' : 'text-gold-400'
              }`}>
                Batumi
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Manus Style: Clean, minimal */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.path}
                className={`relative px-4 py-2 font-sans text-sm tracking-wide transition-all duration-300 group ${
                  isScrolled
                    ? location.pathname === link.path 
                      ? 'text-gold-600' 
                      : 'text-navy-700 hover:text-gold-600'
                    : location.pathname === link.path 
                      ? 'text-white' 
                      : 'text-white/80 hover:text-white'
                }`}
              >
                {t(link.key) || link.key}
                {/* Underline Effect - Manus Style */}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 ${
                  isScrolled ? 'bg-gold-600' : 'bg-white'
                } ${
                  location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Language Selector - Manus Style */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`gap-2 rounded-full px-4 transition-all duration-300 ${
                    isScrolled 
                      ? 'text-navy-700 hover:text-gold-600 hover:bg-gold-50 border border-navy-200' 
                      : 'text-white/90 hover:text-white hover:bg-white/10 border border-white/30'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span className="font-sans text-sm">{languageNames[language]}</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-white border border-gray-200 shadow-lg min-w-[160px] rounded-lg"
              >
                {(Object.keys(languageNames) as Array<keyof typeof languageNames>).map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`cursor-pointer transition-all duration-200 rounded-md mx-1 ${
                      language === lang 
                        ? 'bg-gold-50 text-gold-700' 
                        : 'text-navy-700 hover:bg-gray-50 hover:text-gold-600'
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
                    className={`hidden md:flex gap-2 transition-all duration-300 rounded-full px-4 ${
                      isScrolled 
                        ? 'text-navy-700 hover:text-gold-600 hover:bg-gold-50 border border-navy-200' 
                        : 'text-white/90 hover:text-white hover:bg-white/10 border border-white/30'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      isScrolled ? 'bg-gold-100' : 'bg-white/20'
                    }`}>
                      <User className={`w-4 h-4 ${isScrolled ? 'text-gold-600' : 'text-white'}`} />
                    </div>
                    <span className="max-w-[80px] truncate text-sm font-medium">
                      {user.email?.split('@')[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-white border border-gray-200 shadow-lg rounded-lg"
                >
                  <DropdownMenuItem 
                    onClick={() => window.location.href = '/dashboard'}
                    className="text-navy-700 hover:bg-gray-50 hover:text-gold-600 cursor-pointer rounded-md mx-1"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => window.location.href = '/loyalty-program'}
                    className="text-navy-700 hover:bg-gray-50 hover:text-gold-600 cursor-pointer rounded-md mx-1"
                  >
                    <User className="w-4 h-4 mr-2" />
                    პროფილი
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem 
                    onClick={() => signOut()}
                    className="text-navy-700 hover:bg-gray-50 hover:text-gold-600 cursor-pointer rounded-md mx-1"
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
                  className={`gap-2 transition-all duration-300 rounded-full px-5 ${
                    isScrolled 
                      ? 'text-navy-700 hover:text-gold-600 hover:bg-gold-50 border border-navy-200' 
                      : 'text-white/90 hover:text-white hover:bg-white/10 border border-white/30'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={`lg:hidden rounded-full w-10 h-10 ${
                isScrolled ? 'text-navy-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
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
          <div className={`py-6 space-y-2 border-t ${isScrolled ? 'border-gray-200' : 'border-white/20'}`}>
            {navLinks.map((link, index) => (
              <Link
                key={link.key}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-3 px-5 rounded-lg font-medium transition-all duration-300 ${
                  isScrolled
                    ? location.pathname === link.path 
                      ? 'bg-gold-50 text-gold-700' 
                      : 'text-navy-700 hover:bg-gray-50 hover:text-gold-600'
                    : location.pathname === link.path 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {t(link.key) || link.key}
              </Link>
            ))}
            
            {/* Mobile Auth */}
            <div className={`pt-4 mt-4 border-t ${isScrolled ? 'border-gray-200' : 'border-white/20'}`}>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 py-3 px-5 rounded-lg transition-all duration-300 ${
                      isScrolled 
                        ? 'text-navy-700 hover:bg-gray-50' 
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isScrolled ? 'bg-gold-100' : 'bg-white/20'
                    }`}>
                      <LayoutDashboard className={`w-5 h-5 ${isScrolled ? 'text-gold-600' : 'text-white'}`} />
                    </div>
                    <div>
                      <span className="font-medium block">Dashboard</span>
                      <span className={`text-xs ${isScrolled ? 'text-gray-500' : 'text-white/60'}`}>ჯავშნები & ქულები</span>
                    </div>
                  </Link>
                  <Link
                    to="/loyalty-program"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 py-3 px-5 rounded-lg transition-all duration-300 ${
                      isScrolled 
                        ? 'text-navy-700 hover:bg-gray-50' 
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isScrolled ? 'bg-gold-100' : 'bg-white/20'
                    }`}>
                      <User className={`w-5 h-5 ${isScrolled ? 'text-gold-600' : 'text-white'}`} />
                    </div>
                    <div>
                      <span className="font-medium block">{user.email?.split('@')[0]}</span>
                      <span className={`text-xs ${isScrolled ? 'text-gray-500' : 'text-white/60'}`}>პროფილი</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-4 w-full py-3 px-5 rounded-lg transition-all duration-300 ${
                      isScrolled 
                        ? 'text-navy-700 hover:bg-gray-50' 
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isScrolled ? 'bg-gray-100' : 'bg-white/10'
                    }`}>
                      <LogOut className="w-5 h-5" />
                    </div>
                    <span className="font-medium">გასვლა</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 py-3 px-5 rounded-lg transition-all duration-300 ${
                    isScrolled 
                      ? 'bg-gold-50 text-gold-700' 
                      : 'bg-white/20 text-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isScrolled ? 'bg-gold-100' : 'bg-white/20'
                  }`}>
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
  );
};
