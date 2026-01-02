import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe, LogIn, LogOut, User, ChevronDown } from 'lucide-react';
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
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-primary shadow-luxury py-2' 
        : 'bg-primary/95 py-4'
    }`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/"
            className="flex items-center gap-3 group"
          >
            <img 
              src={logo} 
              alt="Orbi City Batumi" 
              className={`transition-all duration-500 ${isScrolled ? 'h-10' : 'h-12'} w-auto rounded-lg`}
            />
            <span className="text-xl font-bold text-white tracking-wide hidden sm:block">ORBI CITY</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.path}
                className={`relative px-4 py-2 font-sans text-sm tracking-wide transition-all duration-300 rounded-lg ${
                  location.pathname === link.path 
                    ? 'text-secondary font-medium' 
                    : 'text-white/90 hover:text-secondary hover:bg-white/5'
                }`}
              >
                {t(link.key) || link.key}
                {location.pathname === link.path && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-secondary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1.5 text-white/90 hover:text-secondary hover:bg-white/5 border-0 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="font-sans text-sm">{languageNames[language]}</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-primary/98 backdrop-blur-xl border border-white/10 shadow-luxury min-w-[140px]"
              >
                {(Object.keys(languageNames) as Array<keyof typeof languageNames>).map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`cursor-pointer transition-colors ${
                      language === lang 
                        ? 'bg-secondary/15 text-secondary' 
                        : 'text-white hover:bg-white/10 hover:text-secondary'
                    }`}
                  >
                    <span className="mr-2 text-base">{languageFlags[lang]}</span>
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
                    className="hidden md:flex text-white/90 hover:text-secondary hover:bg-white/5 gap-2 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-secondary" />
                    </div>
                    <span className="max-w-[80px] truncate text-sm">
                      {user.email?.split('@')[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-primary/98 backdrop-blur-xl border border-white/10 shadow-luxury"
                >
                  <DropdownMenuItem 
                    onClick={() => window.location.href = '/loyalty-program'}
                    className="text-white hover:bg-white/10 hover:text-secondary cursor-pointer"
                  >
                    <User className="w-4 h-4 mr-2" />
                    პროფილი
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    onClick={() => signOut()}
                    className="text-white hover:bg-white/10 hover:text-secondary cursor-pointer"
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
                  className="text-white/90 hover:text-secondary hover:bg-white/5 gap-2 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>შესვლა</span>
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="relative w-6 h-6">
                <span className={`absolute left-0 block w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'top-3 rotate-45' : 'top-1'}`} />
                <span className={`absolute left-0 top-3 block w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`absolute left-0 block w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'top-3 -rotate-45' : 'top-5'}`} />
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
          isMobileMenuOpen ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-1 border-t border-white/10">
            {navLinks.map((link, index) => (
              <Link
                key={link.key}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  location.pathname === link.path 
                    ? 'bg-secondary/15 text-secondary' 
                    : 'text-white/90 hover:bg-white/5 hover:text-secondary'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {t(link.key) || link.key}
              </Link>
            ))}
            
            {/* Mobile Auth */}
            <div className="pt-4 mt-4 border-t border-white/10">
              {user ? (
                <>
                  <Link
                    to="/loyalty-program"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-4 rounded-lg text-white/90 hover:bg-white/5 hover:text-secondary transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-secondary" />
                    </div>
                    <span className="font-medium">პროფილი</span>
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full py-3 px-4 rounded-lg text-white/90 hover:bg-white/5 hover:text-secondary transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span className="font-medium">გასვლა</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 rounded-lg bg-secondary/15 text-secondary transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                    <LogIn className="w-4 h-4" />
                  </div>
                  <span className="font-medium">შესვლა</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
