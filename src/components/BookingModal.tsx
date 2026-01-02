import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Users, CreditCard, Loader2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { BookingSuccessReviewPopup } from './BookingSuccessReviewPopup';

interface ApartmentPrice {
  id: string;
  apartment_type: string;
  name_en: string;
  name_ka: string;
  description_en: string | null;
  description_ka: string | null;
  price_per_night: number;
  max_guests: number;
  size_sqm: number | null;
  image_url: string | null;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedApartment?: string;
}

// Validation schema
const bookingSchema = z.object({
  guestName: z.string().min(2, 'სახელი სავალდებულოა').max(100),
  guestEmail: z.string().email('არასწორი ელ.ფოსტა'),
  guestPhone: z.string().min(9, 'ტელეფონი სავალდებულოა').max(20),
  guestIdNumber: z.string().min(5, 'პირადი ნომერი სავალდებულოა').max(50),
  guestAddress: z.string().min(5, 'მისამართი სავალდებულოა').max(200),
  specialRequests: z.string().max(500).optional(),
});

export const BookingModal = ({ isOpen, onClose, preselectedApartment }: BookingModalProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  // Form state
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState('2');
  const [selectedApartment, setSelectedApartment] = useState<string>(preselectedApartment || '');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestIdNumber, setGuestIdNumber] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  // UI state
  const [apartments, setApartments] = useState<ApartmentPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isReturningGuest, setIsReturningGuest] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  
  // Fetch apartments
  useEffect(() => {
    const fetchApartments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('apartment_prices')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) {
        console.error('Error fetching apartments:', error);
      } else {
        setApartments(data || []);
        if (preselectedApartment) {
          setSelectedApartment(preselectedApartment);
        } else if (data && data.length > 0) {
          setSelectedApartment(data[0].apartment_type);
        }
      }
      setLoading(false);
    };
    
    if (isOpen) {
      fetchApartments();
    }
  }, [isOpen, preselectedApartment]);

  // Check for returning guest by email
  useEffect(() => {
    const checkReturningGuest = async () => {
      // Validate email format first
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!guestEmail || !emailRegex.test(guestEmail)) {
        setIsReturningGuest(false);
        return;
      }

      setCheckingEmail(true);
      
      try {
        // Check in database for previous bookings
        const { data: previousBooking } = await supabase
          .from('bookings')
          .select('guest_name, guest_phone, guest_id_number, guest_address')
          .eq('guest_email', guestEmail.toLowerCase().trim())
          .in('status', ['confirmed', 'completed', 'pending'])
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (previousBooking) {
          setIsReturningGuest(true);
          // Auto-fill fields if they're empty
          if (!guestName && previousBooking.guest_name) setGuestName(previousBooking.guest_name);
          if (!guestPhone && previousBooking.guest_phone) setGuestPhone(previousBooking.guest_phone);
          if (!guestIdNumber && previousBooking.guest_id_number) setGuestIdNumber(previousBooking.guest_id_number);
          if (!guestAddress && previousBooking.guest_address) setGuestAddress(previousBooking.guest_address);
          
          toast({
            title: language === 'ka' ? '🎉 მოგესალმებით ხელახლა!' : '🎉 Welcome back!',
            description: language === 'ka' 
              ? 'თქვენი მონაცემები ავტომატურად შეივსო' 
              : 'Your details have been auto-filled',
          });
        } else {
          setIsReturningGuest(false);
        }
      } catch (error) {
        console.error('Error checking returning guest:', error);
      } finally {
        setCheckingEmail(false);
      }
    };

    // Debounce the check
    const timeoutId = setTimeout(checkReturningGuest, 500);
    return () => clearTimeout(timeoutId);
  }, [guestEmail]);
  
  // Calculate price
  const selectedApt = apartments.find(a => a.apartment_type === selectedApartment);
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const totalPrice = selectedApt ? selectedApt.price_per_night * nights : 0;
  
  const validateForm = () => {
    const result = bookingSchema.safeParse({
      guestName,
      guestEmail,
      guestPhone,
      guestIdNumber,
      guestAddress,
      specialRequests,
    });
    
    if (result.success) {
      setErrors({});
      return true;
    } else {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          newErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
  };
  
  const handleSubmit = async () => {
    // Validate dates
    if (!checkIn || !checkOut) {
      toast({
        title: language === 'ka' ? 'აირჩიეთ თარიღები' : 'Please select dates',
        variant: 'destructive',
      });
      return;
    }
    
    if (nights < 1) {
      toast({
        title: language === 'ka' ? 'მინიმუმ 1 ღამე' : 'Minimum 1 night required',
        variant: 'destructive',
      });
      return;
    }
    
    if (!selectedApartment) {
      toast({
        title: language === 'ka' ? 'აირჩიეთ ოთახის ტიპი' : 'Please select apartment type',
        variant: 'destructive',
      });
      return;
    }
    
    if (!validateForm()) {
      toast({
        title: language === 'ka' ? 'შეავსეთ ყველა ველი' : 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          apartment_type: selectedApartment,
          check_in: format(checkIn, 'yyyy-MM-dd'),
          check_out: format(checkOut, 'yyyy-MM-dd'),
          guests: parseInt(guests),
          total_price: totalPrice,
          status: 'pending',
          payment_status: 'pay_later',
          payment_method: 'pay_at_hotel',
          guest_name: guestName,
          guest_email: guestEmail,
          guest_phone: guestPhone,
          guest_id_number: guestIdNumber,
          guest_address: guestAddress,
          special_requests: specialRequests || null,
          user_id: '00000000-0000-0000-0000-000000000000', // Anonymous user placeholder
        })
        .select()
        .single();
      
      if (bookingError) throw bookingError;
      
      // Send confirmation email
      const apartmentName = language === 'ka' ? selectedApt?.name_ka : selectedApt?.name_en;
      
      await supabase.functions.invoke('send-email', {
        body: {
          type: 'booking_confirmation',
          to: guestEmail,
          data: {
            guestName,
            checkIn: format(checkIn, 'PPP'),
            checkOut: format(checkOut, 'PPP'),
            guests,
            apartmentName,
            totalPrice: `${totalPrice} GEL`,
            nights,
            paymentNote: language === 'ka' 
              ? 'გადახდა სასტუმროში მოსვლისას' 
              : 'Payment upon arrival at the hotel',
          },
        },
      });
      
      // Save to localStorage for guest review popup
      const guestBookings = JSON.parse(localStorage.getItem('guestBookings') || '[]');
      guestBookings.push({
        checkIn: format(checkIn, 'yyyy-MM-dd'),
        checkOut: format(checkOut, 'yyyy-MM-dd'),
        apartmentType: selectedApartment,
        bookedAt: new Date().toISOString(),
      });
      localStorage.setItem('guestBookings', JSON.stringify(guestBookings));
      
      setSuccess(true);
      toast({
        title: language === 'ka' ? 'ჯავშანი წარმატებით შეიქმნა!' : 'Booking confirmed!',
        description: language === 'ka' 
          ? 'დადასტურება გამოგზავნილია თქვენს ელ.ფოსტაზე' 
          : 'Confirmation sent to your email',
      });
      
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: language === 'ka' ? 'შეცდომა' : 'Error',
        description: language === 'ka' 
          ? 'ჯავშანი ვერ შეიქმნა. სცადეთ თავიდან.' 
          : 'Booking failed. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setCheckIn(undefined);
    setCheckOut(undefined);
    setGuests('2');
    setSelectedApartment('');
    setGuestName('');
    setGuestEmail('');
    setGuestPhone('');
    setGuestIdNumber('');
    setGuestAddress('');
    setSpecialRequests('');
    setSuccess(false);
    setErrors({});
  };

  if (success) {
    return (
      <BookingSuccessReviewPopup
        isOpen={isOpen}
        onClose={() => {
          resetForm();
          onClose();
        }}
        guestName={guestName}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair">
            {language === 'ka' ? 'დაჯავშნეთ ახლავე • გადაიხადეთ მოგვიანებით' : 'Book Now • Pay Later'}
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            {language === 'ka' 
              ? 'გადახდა მოხდება სასტუმროში მოსვლისას' 
              : 'Payment upon arrival at the hotel'}
          </p>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Apartment Selection */}
            <div className="space-y-2">
              <Label>{language === 'ka' ? 'აირჩიეთ ოთახის ტიპი' : 'Select Apartment Type'}</Label>
              <Select value={selectedApartment} onValueChange={setSelectedApartment}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={language === 'ka' ? 'აირჩიეთ...' : 'Select...'} />
                </SelectTrigger>
                <SelectContent>
                  {apartments.map((apt) => (
                    <SelectItem key={apt.id} value={apt.apartment_type}>
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>{language === 'ka' ? apt.name_ka : apt.name_en}</span>
                        <span className="text-primary font-semibold">
                          {apt.price_per_night} GEL/{language === 'ka' ? 'ღამე' : 'night'}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'ka' ? 'ჩასვლა' : 'Check In'}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full h-12 justify-start text-left font-normal',
                        !checkIn && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, 'PPP') : (language === 'ka' ? 'აირჩიეთ' : 'Select date')}
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

              <div className="space-y-2">
                <Label>{language === 'ka' ? 'გასვლა' : 'Check Out'}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full h-12 justify-start text-left font-normal',
                        !checkOut && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut ? format(checkOut, 'PPP') : (language === 'ka' ? 'აირჩიეთ' : 'Select date')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      initialFocus
                      disabled={(date) => date <= (checkIn || new Date())}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <Label>{language === 'ka' ? 'სტუმრების რაოდენობა' : 'Number of Guests'}</Label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger className="h-12">
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {language === 'ka' ? 'სტუმარი' : (num === 1 ? 'Guest' : 'Guests')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Summary */}
            {nights > 0 && selectedApt && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{selectedApt.price_per_night} GEL × {nights} {language === 'ka' ? 'ღამე' : 'nights'}</span>
                  <span>{totalPrice} GEL</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>{language === 'ka' ? 'სულ' : 'Total'}</span>
                  <span className="text-primary">{totalPrice} GEL</span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  {language === 'ka' ? 'გადახდა სასტუმროში მოსვლისას' : 'Pay at hotel upon arrival'}
                </p>
              </div>
            )}

            {/* Guest Information */}
            <div className="border-t pt-6">
              <h4 className="font-semibold mb-4">
                {language === 'ka' ? 'სტუმრის ინფორმაცია' : 'Guest Information'}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{language === 'ka' ? 'სახელი და გვარი *' : 'Full Name *'}</Label>
                  <Input
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder={language === 'ka' ? 'მაგ: გიორგი ბერიძე' : 'e.g. John Smith'}
                    className={errors.guestName ? 'border-destructive' : ''}
                  />
                  {errors.guestName && <p className="text-xs text-destructive">{errors.guestName}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    {language === 'ka' ? 'ელ.ფოსტა *' : 'Email *'}
                    {checkingEmail && <Loader2 className="w-3 h-3 animate-spin" />}
                    {isReturningGuest && !checkingEmail && (
                      <span className="text-xs text-primary font-normal">
                        ✓ {language === 'ka' ? 'ნამყოფი სტუმარი' : 'Returning guest'}
                      </span>
                    )}
                  </Label>
                  <Input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value.toLowerCase().trim())}
                    placeholder="email@example.com"
                    className={cn(
                      errors.guestEmail ? 'border-destructive' : '',
                      isReturningGuest ? 'border-primary' : ''
                    )}
                  />
                  {errors.guestEmail && <p className="text-xs text-destructive">{errors.guestEmail}</p>}
                </div>

                <div className="space-y-2">
                  <Label>{language === 'ka' ? 'ტელეფონი *' : 'Phone *'}</Label>
                  <Input
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+995 5XX XXX XXX"
                    className={errors.guestPhone ? 'border-destructive' : ''}
                  />
                  {errors.guestPhone && <p className="text-xs text-destructive">{errors.guestPhone}</p>}
                </div>

                <div className="space-y-2">
                  <Label>{language === 'ka' ? 'პირადი ნომერი *' : 'ID/Passport Number *'}</Label>
                  <Input
                    value={guestIdNumber}
                    onChange={(e) => setGuestIdNumber(e.target.value)}
                    placeholder={language === 'ka' ? 'პირადი ნომერი ან პასპორტი' : 'ID or Passport number'}
                    className={errors.guestIdNumber ? 'border-destructive' : ''}
                  />
                  {errors.guestIdNumber && <p className="text-xs text-destructive">{errors.guestIdNumber}</p>}
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label>{language === 'ka' ? 'მისამართი *' : 'Address *'}</Label>
                <Input
                  value={guestAddress}
                  onChange={(e) => setGuestAddress(e.target.value)}
                  placeholder={language === 'ka' ? 'ქალაქი, ქვეყანა' : 'City, Country'}
                  className={errors.guestAddress ? 'border-destructive' : ''}
                />
                {errors.guestAddress && <p className="text-xs text-destructive">{errors.guestAddress}</p>}
              </div>

              <div className="space-y-2 mt-4">
                <Label>{language === 'ka' ? 'სპეციალური მოთხოვნები (არასავალდებულო)' : 'Special Requests (optional)'}</Label>
                <Textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder={language === 'ka' 
                    ? 'მაგ: გვიან ჩასვლა, დამატებითი საწოლი...' 
                    : 'e.g. Late check-in, extra bed...'}
                  rows={3}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={submitting || !checkIn || !checkOut || nights < 1}
              className="w-full h-14 text-lg font-semibold bg-gradient-gold hover:bg-secondary-dark text-secondary-foreground"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {language === 'ka' ? 'დაჯავშნა...' : 'Booking...'}
                </>
              ) : (
                <>
                  {language === 'ka' ? 'დაჯავშნა' : 'Confirm Booking'}
                  {totalPrice > 0 && ` • ${totalPrice} GEL`}
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              {language === 'ka' 
                ? 'დაჯავშნით თქვენ ეთანხმებით ჩვენს პირობებს. გაუქმება შესაძლებელია 24 საათით ადრე.'
                : 'By booking you agree to our terms. Free cancellation up to 24 hours before check-in.'}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};