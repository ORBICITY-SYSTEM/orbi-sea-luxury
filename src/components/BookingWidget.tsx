import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { CalendarIcon, Users } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const BookingWidget = () => {
  const { t } = useLanguage();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState('2');

  const handleCheckAvailability = () => {
    const message = `Hello! I'm interested in booking an apartment at Orbi City.\n\nCheck-in: ${checkIn ? format(checkIn, 'PPP') : 'Not selected'}\nCheck-out: ${checkOut ? format(checkOut, 'PPP') : 'Not selected'}\nGuests: ${guests}`;
    window.open(`https://wa.me/+995555199090?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-luxury p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Check In */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">{t('booking.checkIn')}</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !checkIn && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkIn ? format(checkIn, 'PPP') : <span>{t('booking.checkIn')}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                initialFocus
                disabled={(date) => date < new Date()}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check Out */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">{t('booking.checkOut')}</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !checkOut && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOut ? format(checkOut, 'PPP') : <span>{t('booking.checkOut')}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                initialFocus
                disabled={(date) => date < (checkIn || new Date())}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">{t('booking.guests')}</label>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger className="w-full">
              <Users className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? t('booking.guests').slice(0, -1) : t('booking.guests')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Check Availability Button */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-transparent hidden md:block">Action</label>
          <Button
            onClick={handleCheckAvailability}
            className="w-full h-10 bg-gradient-gold hover:bg-secondary-dark text-secondary-foreground font-bold shadow-gold"
          >
            {t('booking.checkAvailability')}
          </Button>
        </div>
      </div>
    </div>
  );
};
