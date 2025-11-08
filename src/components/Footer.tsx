import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import logo from '@/assets/logo.jpg';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const Footer = () => {
  const { t } = useLanguage();
  const { settings } = useSiteSettings();

  return (
    <footer id="footer" className="bg-[#2C3E50] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Column 1: About */}
          <div>
            <img src={logo} alt="Orbi City Batumi" className="h-16 mb-4" />
            <p className="text-white/80 mb-4">
              Discover unparalleled luxury at Orbi City, where every apartment offers breathtaking Black Sea views and five-star comfort.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-secondary">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white/80 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/apartments" className="text-white/80 hover:text-white transition-colors">Apartments</Link></li>
              <li><Link to="/amenities" className="text-white/80 hover:text-white transition-colors">Amenities</Link></li>
              <li><Link to="/gallery" className="text-white/80 hover:text-white transition-colors">Gallery</Link></li>
              <li><Link to="/youtube-videos" className="text-white/80 hover:text-white transition-colors">Videos</Link></li>
              <li><Link to="/location" className="text-white/80 hover:text-white transition-colors">Location</Link></li>
              <li><Link to="/contact" className="text-white/80 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/loyalty-program" className="text-white/80 hover:text-white transition-colors">Loyalty Program</Link></li>
              <li><Link to="/blog" className="text-white/80 hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-secondary">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/about-us" className="text-white/80 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/purchase-conditions" className="text-white/80 hover:text-white transition-colors">Purchase Conditions</Link></li>
              <li><Link to="/privacy-policy" className="text-white/80 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="text-white/80 hover:text-white transition-colors">Terms and Conditions</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-secondary">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <a href="https://maps.app.goo.gl/riaDxn5nAe" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white">
                  Orbi City, Block C<br/>Khimshiashvili St, Batumi
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:info@orbicitybatumi.com" className="text-white/80 hover:text-white">
                  info@orbicitybatumi.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href="tel:+995555199090" className="text-white/80 hover:text-white">
                  +995 555 19 90 90
                </a>
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              {settings?.facebook_url && (
                <a 
                  href={settings.facebook_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-gold flex items-center justify-center transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings?.instagram_url && (
                <a 
                  href={settings.instagram_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-gold flex items-center justify-center transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings?.youtube_url && (
                <a 
                  href={settings.youtube_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-gold flex items-center justify-center transition-all"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/20 text-center text-white/60">
          <p>© 2025 Orbi City Batumi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
