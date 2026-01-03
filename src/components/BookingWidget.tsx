import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBooking } from '@/contexts/BookingContext';
import { CalendarIcon, Users, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const BookingWidget = () => {
  const { t, language } = useLanguage();
  const { openBookingModal } = useBooking();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState('2');

  const handleBookNow = () => {
    openBookingModal();
  };

  return (
    <div className="bg-white/98 backdrop-blur-xl rounded-2xl shadow-luxury border border-gold-400/10 overflow-hidden">
      {/* Header */}
      <div className="bg-navy-900 px-6 py-4 text-center">
        <h3 className="text-white font-serif text-lg tracking-wide">
          {language === 'ka' ? 'დაჯავშნე ახლავე • გადაიხადე მოგვიანებით' : 'Book Now • Pay Later'}
        </h3>
        <p className="text-gold-400 text-xs mt-1">
          {language === 'ka' ? 'გადახდა სასტუმროში მოსვლისას' : 'Payment upon arrival'}
        </p>
      </div>
      
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* Check In */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-navy-700 uppercase tracking-wider">
              {language === 'ka' ? 'ჩასვლა' : 'Check In'}
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal h-14 rounded-xl border-2 border-navy-200 hover:border-gold-400 transition-all duration-300',
                    !checkIn && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-3 h-5 w-5 text-gold-500" />
                  {checkIn ? (
                    <span className="text-navy-900 font-medium">{format(checkIn, 'MMM dd, yyyy')}</span>
                  ) : (
                    <span className="text-navy-400">{language === 'ka' ? 'აირჩიეთ' : 'Select date'}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl shadow-luxury border-gold-400/20" align="start">
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  className="pointer-events-auto rounded-xl"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Check Out */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-navy-700 uppercase tracking-wider">
              {language === 'ka' ? 'გასვლა' : 'Check Out'}
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal h-14 rounded-xl border-2 border-navy-200 hover:border-gold-400 transition-all duration-300',
                    !checkOut && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-3 h-5 w-5 text-gold-500" />
                  {checkOut ? (
                    <span className="text-navy-900 font-medium">{format(checkOut, 'MMM dd, yyyy')}</span>
                  ) : (
                    <span className="text-navy-400">{language === 'ka' ? 'აირჩიეთ' : 'Select date'}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl shadow-luxury border-gold-400/20" align="start">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  initialFocus
                  disabled={(date) => date < (checkIn || new Date())}
                  className="pointer-events-auto rounded-xl"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-navy-700 uppercase tracking-wider">
              {language === 'ka' ? 'სტუმრები' : 'Guests'}
            </label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger className="w-full h-14 rounded-xl border-2 border-navy-200 hover:border-gold-400 transition-all duration-300">
                <div className="flex items-center">
                  <Users className="mr-3 h-5 w-5 text-gold-500" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-luxury border-gold-400/20">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <SelectItem key={num} value={num.toString()} className="rounded-lg">
                    {num} {language === 'ka' ? 'სტუმარი' : (num === 1 ? 'Guest' : 'Guests')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Book Now Button */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-transparent hidden md:block">Action</label>
            <Button
              onClick={handleBookNow}
              className="w-full h-14 bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-navy-900 font-bold rounded-xl shadow-gold hover:shadow-glow transition-all duration-300 tracking-wider uppercase text-xs flex flex-col items-center gap-0"
            >
              <div className="flex items-center">
                <CreditCard className="w-4 h-4 mr-1.5" />
                {language === 'ka' ? 'დაჯავშნე / მოგვიანებით' : 'Book Now / Pay Later'}
              </div>
              <span className="text-[9px] text-green-700 font-medium">✓ {language === 'ka' ? 'უფასო გაუქმება' : 'Free Cancellation'}</span>
            </Button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 pt-6 border-t border-navy-100 flex flex-wrap justify-center gap-6 text-xs text-navy-500">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{language === 'ka' ? 'საუკეთესო ფასი' : 'Best Price Guarantee'}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{language === 'ka' ? 'უფასო გაუქმება' : 'Free Cancellation'}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{language === 'ka' ? 'გადახდა სასტუმროში' : 'Pay at Hotel'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
