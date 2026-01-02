import { useLanguage } from '@/contexts/LanguageContext';
import { Waves, Sparkles, Plane, MapPin } from 'lucide-react';
import { GoogleMapInteractive } from './GoogleMapInteractive';

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
          {/* Interactive Google Map */}
          <GoogleMapInteractive className="h-[448px] lg:h-[496px] shadow-lg border border-border" />

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
