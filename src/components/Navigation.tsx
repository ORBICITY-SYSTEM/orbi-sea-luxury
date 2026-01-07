import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe, LogIn, LogOut, User, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const languageFlags: Record<string, string> = {
  en: '🇬🇧',
  ka: '🇬🇪',
  ru: '🇷🇺',
  tr: '🇹🇷',
  uk: '🇺🇦',
  ar: '🇸🇦',
  zh: '🇨🇳',
  de: '🇩🇪',
  fr: '🇫🇷',
};

const languageNames: Record<string, string> = {
  en: 'EN',
  ka: 'ქარ',
  ru: 'РУС',
  tr: 'TR',
  uk: 'УКР',
  ar: 'عربي',
  zh: '中文',
  de: 'DE',
  fr: 'FR',
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
    { key: 'nav.apartments', path: '/apartments' },
    { key: 'nav.amenities', path: '/amenities' },
    { key: 'nav.gallery', path: '/gallery' },
    { key: 'nav.location', path: '/location' },
    { key: 'nav.contact', path: '/contact' },
    { key: 'nav.loyalty', path: '/loyalty-program' },
    { key: 'nav.blog', path: '/blog' },
    ...(isAdmin ? [{ key: 'nav.admin', path: '/admin' }] : []),
  ];

  return (
    <nav className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'top-0 bg-white/95 backdrop-blur-xl shadow-md py-3' 
        : 'top-0 bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo - Text Only with 3D Gold Effect */}
          <Link 
            to="/"
            className="flex items-center group"
          >
            <div className="flex flex-col">
              <span className={`text-2xl sm:text-3xl font-serif font-bold tracking-wider transition-all duration-300 ${
                isScrolled ? 'text-3d-gold' : 'text-3d-gold-glow'
              }`}>
                ORBI CITY
              </span>
              <span className={`text-xs sm:text-sm tracking-[0.3em] uppercase font-medium transition-colors duration-300 ${
                isScrolled ? 'text-3d-gold' : 'text-3d-gold-glow'
              }`}>
                BATUMI
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
              {Object.keys(languageNames).map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setLanguage(lang as any)}
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

        {/* Mobile Menu - 3D Gold Effects */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
          isMobileMenuOpen ? 'max-h-[700px] opacity-100 mt-6' : 'max-h-0 opacity-0'
        }`}>
          <div className={`py-6 space-y-2 border-t relative ${isScrolled ? 'border-gold-400/30 bg-gradient-to-b from-white to-gold-50/30' : 'border-gold-400/30 bg-gradient-to-b from-primary/95 to-primary'}`}>
            {/* Gold decorative line */}
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
            
            {navLinks.map((link, index) => (
              <Link
                key={link.key}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-3 px-5 rounded-lg font-medium transition-all duration-300 relative group ${
                  isScrolled
                    ? location.pathname === link.path 
                      ? 'bg-gradient-to-r from-gold-100 to-gold-50 text-3d-gold border border-gold-200' 
                      : 'text-navy-700 hover:bg-gold-50/50 hover:text-gold-600'
                    : location.pathname === link.path 
                      ? 'bg-gradient-to-r from-gold-400/20 to-gold-500/10 text-3d-gold-glow border border-gold-400/30' 
                      : 'text-white/90 hover:bg-gold-400/10 hover:text-gold-300'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Gold glow effect on hover */}
                <span className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  isScrolled 
                    ? 'shadow-[inset_0_0_20px_rgba(212,175,55,0.1)]' 
                    : 'shadow-[inset_0_0_20px_rgba(212,175,55,0.15)]'
                }`} />
                <span className="relative z-10">{t(link.key) || link.key}</span>
              </Link>
            ))}
            
            {/* Mobile Auth - Gold Theme */}
            <div className={`pt-4 mt-4 border-t ${isScrolled ? 'border-gold-200' : 'border-gold-400/30'}`}>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 py-3 px-5 rounded-lg transition-all duration-300 group ${
                      isScrolled 
                        ? 'text-navy-700 hover:bg-gold-50/50' 
                        : 'text-white/90 hover:bg-gold-400/10'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                      isScrolled 
                        ? 'bg-gradient-to-br from-gold-200 to-gold-100 shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
                        : 'bg-gradient-to-br from-gold-400/30 to-gold-500/20 shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    }`}>
                      <LayoutDashboard className={`w-5 h-5 ${isScrolled ? 'text-gold-600' : 'text-gold-300'}`} />
                    </div>
                    <div>
                      <span className={`font-medium block ${isScrolled ? '' : 'text-3d-gold-glow'}`}>Dashboard</span>
                      <span className={`text-xs ${isScrolled ? 'text-gold-600/70' : 'text-gold-300/70'}`}>ჯავშნები & ქულები</span>
                    </div>
                  </Link>
                  <Link
                    to="/loyalty-program"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 py-3 px-5 rounded-lg transition-all duration-300 group ${
                      isScrolled 
                        ? 'text-navy-700 hover:bg-gold-50/50' 
                        : 'text-white/90 hover:bg-gold-400/10'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                      isScrolled 
                        ? 'bg-gradient-to-br from-gold-200 to-gold-100 shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
                        : 'bg-gradient-to-br from-gold-400/30 to-gold-500/20 shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    }`}>
                      <User className={`w-5 h-5 ${isScrolled ? 'text-gold-600' : 'text-gold-300'}`} />
                    </div>
                    <div>
                      <span className={`font-medium block ${isScrolled ? '' : 'text-3d-gold-glow'}`}>{user.email?.split('@')[0]}</span>
                      <span className={`text-xs ${isScrolled ? 'text-gold-600/70' : 'text-gold-300/70'}`}>პროფილი</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-4 w-full py-3 px-5 rounded-lg transition-all duration-300 group ${
                      isScrolled 
                        ? 'text-navy-700 hover:bg-gold-50/50' 
                        : 'text-white/90 hover:bg-gold-400/10'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                      isScrolled ? 'bg-gold-100' : 'bg-gold-400/20'
                    }`}>
                      <LogOut className={`w-5 h-5 ${isScrolled ? 'text-gold-600' : 'text-gold-300'}`} />
                    </div>
                    <span className="font-medium">გასვლა</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 py-3 px-5 rounded-lg transition-all duration-300 group ${
                    isScrolled 
                      ? 'bg-gradient-to-r from-gold-100 to-gold-50 text-gold-700 border border-gold-200 shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
                      : 'bg-gradient-to-r from-gold-400/20 to-gold-500/10 text-white border border-gold-400/40 shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                    isScrolled 
                      ? 'bg-gradient-to-br from-gold-300 to-gold-200 shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                      : 'bg-gradient-to-br from-gold-400/40 to-gold-500/30 shadow-[0_0_15px_rgba(212,175,55,0.5)]'
                  }`}>
                    <LogIn className={`w-5 h-5 ${isScrolled ? 'text-gold-700' : 'text-gold-200'}`} />
                  </div>
                  <span className={`font-medium ${isScrolled ? '' : 'text-3d-gold-glow'}`}>შესვლა / რეგისტრაცია</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
