import { useLanguage } from '@/contexts/LanguageContext';
import { Waves, Sparkles, Plane, MapPin } from 'lucide-react';

export const LocationSection = () => {
  const { t } = useLanguage();

  const distances = [
    { 
      icon: Waves, 
      title: 'Black Sea Beach',
      distance: '50 meters',
      bgColor: 'bg-teal-500'
    },
    { 
      icon: Sparkles, 
      title: 'Dancing Fountains',
      distance: '100 meters',
      bgColor: 'bg-teal-500'
    },
    { 
      icon: Plane, 
      title: 'Batumi Airport',
      distance: '5 kilometers',
      bgColor: 'bg-teal-500'
    },
  ];

  return (
    <section id="location" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Prime Location
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Steps away from the Black Sea and major attractions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Map - Orbi City Batumi exact location */}
          <div className="rounded-2xl overflow-hidden shadow-lg h-[450px] lg:h-[500px] border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2978.4721849520347!2d41.63281!3d41.6464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40678e4e8f0a1a1b%3A0x8f3f6f5e5a4e5f5e!2sOrbi%20City%20Twin%20Towers!5e0!3m2!1sen!2sge!4v1704067200000!5m2!1sen!2sge"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Orbi City Batumi Location"
            />
          </div>

          {/* Distance Cards - Manus Style */}
          <div className="space-y-4">
            {distances.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index} 
                  className="bg-card rounded-2xl p-6 flex items-center gap-6 border border-border shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className={`w-16 h-16 ${item.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {item.distance}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
