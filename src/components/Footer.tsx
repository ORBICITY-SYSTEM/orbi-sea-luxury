import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, ArrowUp, Download } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import { trackLead } from '@/lib/tracking';
export const Footer = () => {
  const { t } = useLanguage();
  const { settings } = useSiteSettings();
  const { whatsappUrl, whatsappPhone } = useWhatsApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="bg-gradient-to-b from-primary to-primary/95 relative overflow-hidden">
      {/* Gold Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
      
      {/* Decorative Gold Lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-gold-600/0 via-gold-400/50 to-gold-600/0" />
      
      {/* Main Footer Content - Manus Style */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand Description */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <span className="text-3d-gold-glow text-2xl font-serif font-normal tracking-wider block">
                ORBI CITY
              </span>
              <span className="text-3d-gold text-[10px] tracking-[0.3em] uppercase">
                Batumi
              </span>
            </div>
            <p className="text-white/70 leading-relaxed text-sm">
              Discover unparalleled luxury at Orbi City, where every apartment offers breathtaking Black Sea views and five-star comfort.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/apartments', label: 'Apartments' },
                { to: '/amenities', label: 'Amenities' },
                { to: '/gallery', label: 'Gallery' },
                { to: '/location', label: 'Location' },
                { to: '/contact', label: 'Contact' },
                { to: '/loyalty-program', label: 'Bonuses' },
                { to: '/blog', label: 'Blog' },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-white/70 hover:text-gold-400 transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal + Install App */}
          <div>
            <ul className="space-y-3">
              {[
                { to: '/about-us', label: 'About Us' },
                { to: '/purchase-conditions', label: 'Purchase Conditions' },
                { to: '/privacy-policy', label: 'Privacy Policy' },
                { to: '/terms-and-conditions', label: 'Terms and Conditions' },
                { to: '/install-app', label: '📱 Install App' },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-white/70 hover:text-gold-400 transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <span className="block">7B Sherif Khimshiashvili Str, Orbi City, Batumi</span>
              </li>
              <li>
                <span className="block">Email: info@orbicitybatumi.com</span>
              </li>
              <li>
                <span className="block">Phone: +995 555 19 90 90</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Social Links */}
        <div className="mt-12 pt-8 border-t border-gold-400/30 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo Text Only */}
          <div className="flex items-center gap-2">
            <span className="text-3d-gold-glow font-serif font-semibold tracking-wider text-lg">ORBI CITY</span>
            <span className="text-3d-gold text-xs tracking-wider">BATUMI</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {settings?.facebook_url && (
              <a 
                href={settings.facebook_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {settings?.instagram_url && (
              <a 
                href={settings.instagram_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {settings?.youtube_url && (
              <a 
                href={settings.youtube_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            )}
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => trackLead({ content_name: 'WhatsApp Click - Footer', form_name: 'Footer WhatsApp' })}
              className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors"
              aria-label="WhatsApp"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <p className="text-white/50 text-xs">
            © {new Date().getFullYear()} Orbi City Batumi
          </p>
        </div>
      </div>
    </footer>
  );
};
