import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Waves, Sparkles, Plane } from 'lucide-react';

export const LocationSection = () => {
  const { t } = useLanguage();

  const distances = [
    { icon: Waves, key: 'beach', color: 'text-primary' },
    { icon: Sparkles, key: 'fountains', color: 'text-secondary' },
    { icon: Plane, key: 'airport', color: 'text-accent' },
  ];

  return (
    <section id="location" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('location.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('location.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-luxury h-[400px] lg:h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2950.5753964444843!2d41.64212631549654!3d41.64451997924209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40678166e3f0b5a9%3A0x8f3f6f5e5a4e5f5e!2sOrbi%20City!5e0!3m2!1sen!2sge!4v1234567890123!5m2!1sen!2sge"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Orbi City Batumi Location"
            />
          </div>

          {/* Distance Cards */}
          <div className="space-y-6">
            {distances.map((distance) => {
              const Icon = distance.icon;
              return (
                <Card key={distance.key} className="hover:shadow-luxury transition-shadow duration-300">
                  <CardContent className="p-6 flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-full bg-gradient-sea flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-8 h-8 text-white`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        {t(`location.${distance.key}`)}
                      </h3>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {t(`location.${distance.key}Dist`)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
