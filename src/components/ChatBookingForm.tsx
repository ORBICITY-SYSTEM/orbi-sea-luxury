import { useState, useEffect } from 'react';
import { Calendar, Users, Home, ArrowRight, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, addDays, differenceInDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChatBookingFormProps {
  onBookingComplete?: (bookingDetails: any) => void;
  onClose?: () => void;
}

interface ApartmentOption {
  apartment_type: string;
  name_en: string;
  name_ka: string;
  price_per_night: number;
  max_guests: number;
}

type BookingStep = 'apartment' | 'dates' | 'guests' | 'contact' | 'confirm' | 'success';

export const ChatBookingForm = ({ onBookingComplete, onClose }: ChatBookingFormProps) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  
  const [step, setStep] = useState<BookingStep>('apartment');
  const [apartments, setApartments] = useState<ApartmentOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data
  const [selectedApartment, setSelectedApartment] = useState<ApartmentOption | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Load apartments
  useEffect(() => {
    const fetchApartments = async () => {
      const { data } = await supabase
        .from('apartment_prices')
        .select('apartment_type, name_en, name_ka, price_per_night, max_guests')
        .eq('is_active', true)
        .order('display_order');
      
      if (data) {
        setApartments(data);
      }
    };
    fetchApartments();
  }, []);

  // Set default dates
  useEffect(() => {
    const tomorrow = addDays(new Date(), 1);
    const dayAfter = addDays(new Date(), 3);
    setCheckIn(format(tomorrow, 'yyyy-MM-dd'));
    setCheckOut(format(dayAfter, 'yyyy-MM-dd'));
  }, []);

  const calculateTotal = () => {
    if (!selectedApartment || !checkIn || !checkOut) return 0;
    const nights = differenceInDays(new Date(checkOut), new Date(checkIn));
    return nights > 0 ? nights * selectedApartment.price_per_night : 0;
  };

  const getNights = () => {
    if (!checkIn || !checkOut) return 0;
    return differenceInDays(new Date(checkOut), new Date(checkIn));
  };

  const handleSubmitBooking = async () => {
    if (!selectedApartment || !checkIn || !checkOut || !guestName || !guestEmail) {
      toast.error(language === 'ka' ? 'გთხოვთ შეავსოთ ყველა ველი' : 'Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        apartment_type: selectedApartment.apartment_type,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        special_requests: specialRequests,
        total_price: calculateTotal(),
        user_id: user?.id || '00000000-0000-0000-0000-000000000000',
        status: 'pending',
        payment_status: 'pending'
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) throw error;

      setStep('success');
      
      if (onBookingComplete) {
        onBookingComplete({
          ...bookingData,
          id: data.id,
          apartmentName: language === 'ka' ? selectedApartment.name_ka : selectedApartment.name_en
        });
      }

      toast.success(language === 'ka' ? 'დაჯავშნა წარმატებით შეიქმნა!' : 'Booking created successfully!');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(language === 'ka' ? 'დაჯავშნა ვერ მოხერხდა' : 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    const steps: BookingStep[] = ['apartment', 'dates', 'guests', 'contact', 'confirm'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: BookingStep[] = ['apartment', 'dates', 'guests', 'contact', 'confirm'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'apartment':
        return !!selectedApartment;
      case 'dates':
        return checkIn && checkOut && getNights() > 0;
      case 'guests':
        return guests > 0;
      case 'contact':
        return guestName && guestEmail;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'apartment':
        return (
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Home className="h-4 w-4 text-primary" />
              {language === 'ka' ? 'აირჩიეთ აპარტამენტი' : 'Select Apartment'}
            </Label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {apartments.map((apt) => (
                <motion.button
                  key={apt.apartment_type}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedApartment(apt)}
                  className={cn(
                    "w-full p-3 rounded-lg border text-left transition-all",
                    selectedApartment?.apartment_type === apt.apartment_type
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">
                        {language === 'ka' ? apt.name_ka : apt.name_en}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'ka' ? `მაქს. ${apt.max_guests} სტუმარი` : `Max ${apt.max_guests} guests`}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-primary">
                      {apt.price_per_night} ₾
                      <span className="text-xs font-normal text-muted-foreground">
                        /{language === 'ka' ? 'ღამე' : 'night'}
                      </span>
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'dates':
        return (
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              {language === 'ka' ? 'აირჩიეთ თარიღები' : 'Select Dates'}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">
                  {language === 'ka' ? 'ჩასვლა' : 'Check-in'}
                </Label>
                <Input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  {language === 'ka' ? 'გასვლა' : 'Check-out'}
                </Label>
                <Input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || format(new Date(), 'yyyy-MM-dd')}
                  className="text-sm"
                />
              </div>
            </div>
            {getNights() > 0 && (
              <p className="text-sm text-center text-muted-foreground">
                {getNights()} {language === 'ka' ? 'ღამე' : 'nights'} • {calculateTotal()} ₾ {language === 'ka' ? 'ჯამი' : 'total'}
              </p>
            )}
          </div>
        );

      case 'guests':
        return (
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              {language === 'ka' ? 'სტუმრების რაოდენობა' : 'Number of Guests'}
            </Label>
            <Select value={guests.toString()} onValueChange={(v) => setGuests(parseInt(v))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[...Array(selectedApartment?.max_guests || 4)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1} {language === 'ka' ? 'სტუმარი' : 'guest(s)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              {language === 'ka' ? 'საკონტაქტო ინფორმაცია' : 'Contact Information'}
            </Label>
            <Input
              placeholder={language === 'ka' ? 'სახელი და გვარი *' : 'Full Name *'}
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="text-sm"
            />
            <Input
              type="email"
              placeholder={language === 'ka' ? 'ელ-ფოსტა *' : 'Email *'}
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="text-sm"
            />
            <Input
              type="tel"
              placeholder={language === 'ka' ? 'ტელეფონი' : 'Phone'}
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              className="text-sm"
            />
          </div>
        );

      case 'confirm':
        return (
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              {language === 'ka' ? 'დაადასტურეთ ჯავშანი' : 'Confirm Booking'}
            </Label>
            <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{language === 'ka' ? 'აპარტამენტი:' : 'Apartment:'}</span>
                <span className="font-medium">
                  {language === 'ka' ? selectedApartment?.name_ka : selectedApartment?.name_en}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{language === 'ka' ? 'თარიღები:' : 'Dates:'}</span>
                <span className="font-medium">{checkIn} → {checkOut}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{language === 'ka' ? 'ღამეები:' : 'Nights:'}</span>
                <span className="font-medium">{getNights()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{language === 'ka' ? 'სტუმრები:' : 'Guests:'}</span>
                <span className="font-medium">{guests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{language === 'ka' ? 'სახელი:' : 'Name:'}</span>
                <span className="font-medium">{guestName}</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between text-base">
                  <span className="font-semibold">{language === 'ka' ? 'ჯამი:' : 'Total:'}</span>
                  <span className="font-bold text-primary">{calculateTotal()} ₾</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'success':
        return (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-4 space-y-3"
          >
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="font-semibold">
              {language === 'ka' ? 'დაჯავშნა წარმატებით შეიქმნა!' : 'Booking Successful!'}
            </h4>
            <p className="text-sm text-muted-foreground">
              {language === 'ka' 
                ? 'თქვენს ელ-ფოსტაზე გამოგზავნილია დადასტურება.'
                : 'A confirmation has been sent to your email.'}
            </p>
          </motion.div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-background to-muted/30 rounded-xl border border-primary/20 p-4 shadow-lg"
    >
      {/* Progress indicator */}
      {step !== 'success' && (
        <div className="flex items-center justify-between mb-4">
          {['apartment', 'dates', 'guests', 'contact', 'confirm'].map((s, i) => (
            <div
              key={s}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                step === s
                  ? "bg-primary text-primary-foreground"
                  : i < ['apartment', 'dates', 'guests', 'contact', 'confirm'].indexOf(step)
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {i + 1}
            </div>
          ))}
        </div>
      )}

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      {step !== 'success' && (
        <div className="flex gap-2 mt-4">
          {step !== 'apartment' && (
            <Button
              variant="outline"
              size="sm"
              onClick={prevStep}
              className="flex-1"
            >
              {language === 'ka' ? 'უკან' : 'Back'}
            </Button>
          )}
          {step === 'confirm' ? (
            <Button
              size="sm"
              onClick={handleSubmitBooking}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-gold hover:opacity-90"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {language === 'ka' ? 'დაჯავშნა' : 'Book Now'}
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex-1 bg-gradient-gold hover:opacity-90"
            >
              {language === 'ka' ? 'შემდეგი' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      )}

      {step === 'success' && onClose && (
        <Button
          size="sm"
          onClick={onClose}
          className="w-full mt-2"
          variant="outline"
        >
          {language === 'ka' ? 'დახურვა' : 'Close'}
        </Button>
      )}
    </motion.div>
  );
};
