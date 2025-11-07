import { useLanguage } from '@/contexts/LanguageContext';
import { Waves, Sparkles, ChefHat, Clock, Waves as Pool, Car, Wifi, Wind, Sparkle, Shield, UserCog, UtensilsCrossed } from 'lucide-react';

const amenities = [
  { icon: Waves, key: 'seaView' },
  { icon: Sparkles, key: 'fountains' },
  { icon: ChefHat, key: 'kitchen' },
  { icon: Clock, key: 'reception' },
  { icon: Pool, key: 'pool' },
  { icon: Car, key: 'parking' },
  { icon: Wifi, key: 'wifi' },
  { icon: Wind, key: 'ac' },
  { icon: Sparkle, key: 'housekeeping' },
  { icon: Shield, key: 'security' },
  { icon: UserCog, key: 'concierge' },
  { icon: UtensilsCrossed, key: 'restaurant' },
];

export const AmenitiesSection = () => {
  const { t } = useLanguage();

  return (
    <section id="amenities" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('amenities.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('amenities.subtitle')}
          </p>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {amenities.map((amenity) => {
            const Icon = amenity.icon;
            return (
              <div
                key={amenity.key}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-sea flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-luxury transition-all duration-300">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {t(`amenities.${amenity.key}`)}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
