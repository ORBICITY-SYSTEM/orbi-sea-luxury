import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBooking } from '@/contexts/BookingContext';
import { CalendarIcon, Users, CreditCard, Shield, Clock, BadgeCheck } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const BookingSection = () => {
  const { t, language } = useLanguage();
  const { openBookingModal } = useBooking();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState('2');

  const handleBookNow = () => {
    openBookingModal();
  };

  return (
    <section className="relative py-20 bg-navy-900">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
      
      <div className="container mx-auto px-4">
        {/* Header - Manus Style */}
        <div className="text-center mb-12">
          <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-4 font-light">
            {language === 'ka' ? 'დაჯავშნეთ თქვენი დასვენება' : 'BOOK YOUR STAY'}
          </p>
          <h2 className="font-playfair italic font-normal text-white text-4xl md:text-5xl lg:text-6xl">
            {language === 'ka' ? 'დაჯავშნე ახლავე • გადაიხადე მოგვიანებით' : 'Book Now • Pay Later'}
          </h2>
          <p className="text-white/60 mt-4 text-lg">
            {language === 'ka' ? 'გადახდა სასტუმროში მოსვლისას' : 'Payment upon arrival at the hotel'}
          </p>
        </div>

        {/* Booking Form - Manus Style */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Check In */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-gold-400 uppercase tracking-wider">
                  {language === 'ka' ? 'ჩასვლა' : 'Check In'}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal h-14 rounded-lg bg-white/5 border-white/20 hover:bg-white/10 hover:border-gold-400/50 text-white transition-all duration-300',
                        !checkIn && 'text-white/50'
                      )}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 text-gold-400" />
                      {checkIn ? (
                        <span className="font-medium">{format(checkIn, 'MMM dd, yyyy')}</span>
                      ) : (
                        <span>{language === 'ka' ? 'აირჩიეთ თარიღი' : 'Select date'}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl shadow-luxury" align="start">
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
              <div className="space-y-3">
                <label className="text-xs font-medium text-gold-400 uppercase tracking-wider">
                  {language === 'ka' ? 'გასვლა' : 'Check Out'}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal h-14 rounded-lg bg-white/5 border-white/20 hover:bg-white/10 hover:border-gold-400/50 text-white transition-all duration-300',
                        !checkOut && 'text-white/50'
                      )}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 text-gold-400" />
                      {checkOut ? (
                        <span className="font-medium">{format(checkOut, 'MMM dd, yyyy')}</span>
                      ) : (
                        <span>{language === 'ka' ? 'აირჩიეთ თარიღი' : 'Select date'}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl shadow-luxury" align="start">
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
              <div className="space-y-3">
                <label className="text-xs font-medium text-gold-400 uppercase tracking-wider">
                  {language === 'ka' ? 'სტუმრები' : 'Guests'}
                </label>
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger className="w-full h-14 rounded-lg bg-white/5 border-white/20 hover:bg-white/10 hover:border-gold-400/50 text-white transition-all duration-300">
                    <div className="flex items-center">
                      <Users className="mr-3 h-5 w-5 text-gold-400" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-luxury">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()} className="rounded-lg">
                        {num} {language === 'ka' ? 'სტუმარი' : (num === 1 ? 'Guest' : 'Guests')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Book Now Button */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-transparent hidden md:block">Action</label>
                <Button
                  onClick={handleBookNow}
                  className="w-full h-14 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold rounded-lg shadow-lg hover:shadow-gold transition-all duration-300 tracking-wider uppercase text-sm"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {language === 'ka' ? 'დაჯავშნე / გადაიხადე მოგვიანებით' : 'Book Now / Pay Later'}
                </Button>
              </div>
            </div>

            {/* Trust Badges - Manus Style */}
            <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold-400/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {language === 'ka' ? 'საუკეთესო ფასის გარანტია' : 'Best Price Guarantee'}
                  </p>
                  <p className="text-white/50 text-sm">
                    {language === 'ka' ? 'ჩვენ ვამცირებთ ნებისმიერ ფასს' : 'We match any lower price'}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold-400/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {language === 'ka' ? 'უფასო გაუქმება' : 'Free Cancellation'}
                  </p>
                  <p className="text-white/50 text-sm">
                    {language === 'ka' ? '24 საათით ადრე' : 'Up to 24 hours before check-in'}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold-400/10 flex items-center justify-center">
                  <BadgeCheck className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {language === 'ka' ? 'გადახდა სასტუმროში' : 'Pay at Hotel'}
                  </p>
                  <p className="text-white/50 text-sm">
                    {language === 'ka' ? 'წინასწარი გადახდა არ არის საჭირო' : 'No prepayment needed'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
