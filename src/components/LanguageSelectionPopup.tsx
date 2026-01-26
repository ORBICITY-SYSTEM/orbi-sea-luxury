import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Globe, Check, Sparkles } from 'lucide-react';

type Language = 'en' | 'ka' | 'ru' | 'tr' | 'uk' | 'ar' | 'zh' | 'de' | 'fr';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', flag: '🇬🇪' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
];

// Detect browser language
const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0].toLowerCase();

  const languageMap: Record<string, Language> = {
    'en': 'en',
    'ka': 'ka',
    'ru': 'ru',
    'tr': 'tr',
    'uk': 'uk',
    'ar': 'ar',
    'zh': 'zh',
    'de': 'de',
    'fr': 'fr',
    'ge': 'ka',
  };

  return languageMap[browserLang] || 'en';
};

export const LanguageSelectionPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language>('en');
  const [detectedLang, setDetectedLang] = useState<Language | null>(null);
  const { setLanguage } = useLanguage();

  useEffect(() => {
    // Check if user has already selected a language
    const hasSelected = localStorage.getItem('language-popup-shown');

    if (!hasSelected) {
      // Detect browser language
      const detected = detectBrowserLanguage();
      setDetectedLang(detected);
      setSelectedLang(detected);

      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleLanguageSelect = (langCode: Language) => {
    setSelectedLang(langCode);
  };

  const handleConfirm = () => {
    setLanguage(selectedLang);
    localStorage.setItem('language-popup-shown', 'true');
    localStorage.setItem('preferred-language', selectedLang);
    setIsOpen(false);
  };

  const handleSkip = () => {
    // Use detected or English as default
    setLanguage(detectedLang || 'en');
    localStorage.setItem('language-popup-shown', 'true');
    localStorage.setItem('preferred-language', detectedLang || 'en');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-cream-50 to-gold-50 border-gold-200">
        <DialogHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Globe className="w-16 h-16 text-gold-500 animate-pulse" />
              <Sparkles className="w-6 h-6 text-gold-400 absolute -top-1 -right-1" />
            </div>
          </div>
          <DialogTitle className="text-2xl md:text-3xl font-serif text-foreground">
            Choose Your Language
          </DialogTitle>
          {detectedLang && (
            <p className="text-sm text-muted-foreground mt-2">
              We detected: <span className="font-semibold text-gold-600">
                {languages.find(l => l.code === detectedLang)?.flag} {languages.find(l => l.code === detectedLang)?.nativeName}
              </span>
            </p>
          )}
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3 py-4">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`
                relative flex flex-col items-center justify-center p-4 rounded-xl
                transition-all duration-300 transform hover:scale-105
                ${selectedLang === lang.code
                  ? 'bg-gradient-to-br from-gold-400 to-gold-500 text-white shadow-lg shadow-gold-300/50 ring-2 ring-gold-300'
                  : 'bg-white hover:bg-gold-50 text-foreground border border-gold-100 hover:border-gold-300'
                }
                ${detectedLang === lang.code && selectedLang !== lang.code ? 'ring-2 ring-gold-200' : ''}
              `}
            >
              {selectedLang === lang.code && (
                <Check className="absolute top-2 right-2 w-4 h-4" />
              )}
              <span className="text-3xl mb-2">{lang.flag}</span>
              <span className="font-medium text-sm">{lang.nativeName}</span>
              <span className={`text-xs mt-1 ${selectedLang === lang.code ? 'text-white/80' : 'text-muted-foreground'}`}>
                {lang.name}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button
            onClick={handleConfirm}
            className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-semibold py-6 text-lg shadow-gold"
          >
            <Check className="w-5 h-5 mr-2" />
            Continue with {languages.find(l => l.code === selectedLang)?.nativeName}
          </Button>

          <button
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground text-sm underline transition-colors"
          >
            Skip for now
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          You can change the language anytime from the navigation menu
        </p>
      </DialogContent>
    </Dialog>
  );
};
