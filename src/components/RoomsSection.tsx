import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Maximize2, Users, Video } from 'lucide-react';

const rooms = [
  {
    id: 'suite',
    image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/e4578176040cf98304ee3ae0477a108f.jpg',
    size: '35-40m²',
    guests: '1-2',
    price: '$65',
  },
  {
    id: 'deluxe',
    image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/47fe838e886d9afa24f54f2c292a93c3.jpg',
    size: '45-50m²',
    guests: '2-3',
    price: '$85',
  },
  {
    id: 'superior',
    image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/78f6531862f26bbcdf6bca5ec8d7305c.jpg',
    size: '55-60m²',
    guests: '2-4',
    price: '$105',
  },
  {
    id: 'family',
    image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/0922f2b1b13af96b0d24272d32439996.jpg',
    size: '65-70m²',
    guests: '4-5',
    price: '$125',
  },
  {
    id: 'twobed',
    image: 'https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/80787ed88713055ace717fd00ec62ca7.jpg',
    size: '85-90m²',
    guests: '6-8',
    price: '$165',
  },
];

export const RoomsSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section id="rooms" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('rooms.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('rooms.subtitle')}
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <Card key={room.id} className="group overflow-hidden hover:shadow-luxury transition-all duration-300">
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={room.image}
                  alt={t(`rooms.${room.id}`)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-gold text-secondary-foreground font-bold shadow-gold">
                    {t('rooms.from')} {room.price}{t('rooms.night')}
                  </Badge>
                </div>
                {/* Floating Video Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/youtube-videos?type=${room.id}`);
                  }}
                  className="absolute bottom-4 right-4 bg-primary/90 hover:bg-primary text-primary-foreground rounded-full p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
                  aria-label={t('rooms.watchVideo')}
                >
                  <Video className="w-5 h-5" />
                </button>
              </div>

              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {t(`rooms.${room.id}`)}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t(`rooms.${room.id}Desc`)}
                </p>

                {/* Room Details */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Maximize2 className="w-4 h-4 text-primary" />
                    <span>{room.size}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{room.guests} {t('rooms.guests')}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => window.open('https://orbicitybatumi.com/apartments', '_blank')}
                >
                  {t('rooms.viewDetails')}
                </Button>
                 <Button 
                  asChild
                  className="flex-1 bg-gradient-gold hover:bg-secondary-dark text-secondary-foreground font-semibold shadow-gold"
                >
                  <a href="https://wa.me/995555199090" target="_blank" rel="noopener noreferrer">
                    {t('rooms.bookNow')}
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
