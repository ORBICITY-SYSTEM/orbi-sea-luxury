import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, ArrowUp } from 'lucide-react';
import logo from '@/assets/logo.jpg';
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
    <footer id="footer" className="bg-navy-900 text-white relative overflow-hidden">
      {/* Decorative Gold Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-4 mb-6">
              <img src={logo} alt="Orbi City Batumi" className="h-16 w-16 rounded-xl shadow-lg" />
              <div>
                <span className="text-2xl font-serif font-light text-gold-400 tracking-wider block">ORBI CITY</span>
                <span className="text-xs text-white/50 tracking-[0.3em] uppercase">Batumi</span>
              </div>
            </div>
            <p className="text-white/70 leading-relaxed mb-6 font-light">
              Experience unparalleled luxury at Orbi City, where every apartment offers breathtaking Black Sea views and five-star comfort.
            </p>
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-gold-400">
                {'★★★★★'.split('').map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
              <span className="text-white/50 text-sm">5.0 Rating</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-serif text-xl mb-6 text-gold-400 tracking-wide">Explore</h3>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/apartments', label: 'Apartments' },
                { to: '/amenities', label: 'Amenities' },
                { to: '/gallery', label: 'Gallery' },
                { to: '/youtube-videos', label: 'Videos' },
                { to: '/location', label: 'Location' },
                { to: '/contact', label: 'Contact' },
                { to: '/loyalty-program', label: 'Loyalty Program' },
                { to: '/blog', label: 'Blog' },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-white/70 hover:text-gold-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-gold-400 group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="font-serif text-xl mb-6 text-gold-400 tracking-wide">Information</h3>
            <ul className="space-y-3">
              {[
                { to: '/about-us', label: 'About Us' },
                { to: '/purchase-conditions', label: 'Purchase Conditions' },
                { to: '/privacy-policy', label: 'Privacy Policy' },
                { to: '/terms-and-conditions', label: 'Terms & Conditions' },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-white/70 hover:text-gold-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-gold-400 group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-serif text-xl mb-6 text-gold-400 tracking-wide">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="https://maps.app.goo.gl/riaDxn5nAe" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-start gap-4 text-white/70 hover:text-gold-400 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-gold-400/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-medium text-white/90">Address</span>
                    <span className="text-sm">Orbi City, Block C, Khimshiashvili St, Batumi</span>
                  </div>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@orbicitybatumi.com" 
                  className="flex items-start gap-4 text-white/70 hover:text-gold-400 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-gold-400/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-medium text-white/90">Email</span>
                    <span className="text-sm">info@orbicitybatumi.com</span>
                  </div>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+995555199090" 
                  className="flex items-start gap-4 text-white/70 hover:text-gold-400 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-gold-400/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-medium text-white/90">Phone</span>
                    <span className="text-sm">+995 555 19 90 90</span>
                  </div>
                </a>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex gap-3 mt-8">
              {settings?.facebook_url && (
                <a 
                  href={settings.facebook_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/5 hover:bg-gold-400 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 group-hover:text-navy-900" />
                </a>
              )}
              {settings?.instagram_url && (
                <a 
                  href={settings.instagram_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/5 hover:bg-gold-400 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 group-hover:text-navy-900" />
                </a>
              )}
              {settings?.youtube_url && (
                <a 
                  href={settings.youtube_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/5 hover:bg-gold-400 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5 group-hover:text-navy-900" />
                </a>
              )}
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => trackLead({ content_name: 'WhatsApp Click - Footer', form_name: 'Footer WhatsApp' })}
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-green-500 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Orbi City Batumi. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-white/50">
            <span>Designed with ♥ for luxury travelers</span>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute right-8 bottom-8 w-12 h-12 rounded-full bg-gold-400 text-navy-900 flex items-center justify-center shadow-gold hover:shadow-glow transition-all duration-300 hover:scale-110"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
};
