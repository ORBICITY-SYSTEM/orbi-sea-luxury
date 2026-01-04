import { useState, useEffect, useCallback } from 'react';
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
import { CalendarIcon, Users, CreditCard, Loader2, Crown, Gift, Lock, Eye, EyeOff } from 'lucide-react';
import { format, differenceInDays, eachDayOfInterval, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { BookingSuccessReviewPopup } from './BookingSuccessReviewPopup';
import { useLoyaltyDiscount, addLoyaltyPoints } from './LoyaltyDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Checkbox } from '@/components/ui/checkbox';
import RegistrationSuccessPopup from './RegistrationSuccessPopup';
import LoyaltyRedemptionSection from './LoyaltyRedemptionSection';
import { useLoyaltyRedemption } from '@/hooks/useLoyaltyRedemption';

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
  const { user } = useAuth();
  const { discount: loyaltyDiscount, tier: loyaltyTier } = useLoyaltyDiscount();
  const { redeemPoints } = useLoyaltyRedemption();
  
  // Points redemption state
  const [pointsRedemptionDiscount, setPointsRedemptionDiscount] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  
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
  const [useLoyalty, setUseLoyalty] = useState(true);
  
  // Registration state for non-logged users
  const [wantsToRegister, setWantsToRegister] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  
  // UI state
  const [apartments, setApartments] = useState<ApartmentPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isReturningGuest, setIsReturningGuest] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);
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
  
  // Fetch seasonal prices
  const currentYear = new Date().getFullYear();
  const { data: seasonalPrices } = useQuery({
    queryKey: ['seasonal-prices-booking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seasonal_prices')
        .select('*')
        .eq('is_active', true)
        .gte('year', currentYear);
      if (error) throw error;
      return data;
    },
    enabled: isOpen,
  });

  // Calculate price with seasonal pricing and loyalty discount
  const selectedApt = apartments.find(a => a.apartment_type === selectedApartment);
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  
  // Calculate base price considering seasonal pricing with breakdown
  const calculateSeasonalPriceWithBreakdown = () => {
    if (!checkIn || !checkOut || !selectedApt) return { total: 0, breakdown: [] as { date: Date; price: number }[] };
    
    let total = 0;
    const breakdown: { date: Date; price: number }[] = [];
    const days = eachDayOfInterval({ start: checkIn, end: addDays(checkOut, -1) });
    
    days.forEach(day => {
      const month = day.getMonth() + 1;
      const year = day.getFullYear();
      
      // Check for seasonal price
      const seasonalPrice = seasonalPrices?.find(
        sp => sp.apartment_type === selectedApartment && sp.month === month && sp.year === year
      );
      
      const priceForDay = seasonalPrice ? seasonalPrice.price_per_night : selectedApt.price_per_night;
      total += priceForDay;
      breakdown.push({ date: day, price: priceForDay });
    });
    
    return { total, breakdown };
  };

  const { total: basePrice, breakdown: priceBreakdown } = calculateSeasonalPriceWithBreakdown();
  const loyaltyDiscountAmount = user && useLoyalty && loyaltyDiscount > 0 
    ? Math.round(basePrice * (loyaltyDiscount / 100)) 
    : 0;
  const totalPrice = basePrice - loyaltyDiscountAmount - pointsRedemptionDiscount;
  const pointsToEarn = Math.floor(totalPrice / 10);
  
  // Handler for points redemption
  const handlePointsRedemptionChange = useCallback((discount: number, points: number) => {
    setPointsRedemptionDiscount(discount);
    setPointsToRedeem(points);
  }, []);
  
  // Check if prices vary (to show breakdown only when relevant)
  const hasVariedPrices = priceBreakdown.length > 1 && 
    new Set(priceBreakdown.map(p => p.price)).size > 1;
  
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
    
    // Validate registration if user wants to register
    if (wantsToRegister && !user) {
      if (password.length < 6) {
        setRegistrationError(language === 'ka' ? 'პაროლი მინიმუმ 6 სიმბოლო უნდა იყოს' : 'Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        setRegistrationError(language === 'ka' ? 'პაროლები არ ემთხვევა' : 'Passwords do not match');
        return;
      }
    }
    
    setSubmitting(true);
    
    let registeredUserId: string | null = null;
    
    try {
      // Auto-register user if they want to
      if (wantsToRegister && !user) {
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: guestEmail,
          password: password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: guestName,
            }
          }
        });
        
        if (signUpError) {
          // Check for specific errors
          if (signUpError.message.includes('already registered')) {
            setRegistrationError(language === 'ka' ? 'ეს ელ.ფოსტა უკვე რეგისტრირებულია. გთხოვთ შეხვიდეთ სისტემაში.' : 'This email is already registered. Please log in.');
            setSubmitting(false);
            return;
          }
          throw signUpError;
        }
        
        if (authData.user) {
          registeredUserId = authData.user.id;
          
          // Show registration success popup with confetti
          setShowRegistrationPopup(true);
        }
      }
      
      // Redeem loyalty points if user is using them
      if (user && pointsToRedeem > 0) {
        try {
          await redeemPoints(pointsToRedeem);
        } catch (error) {
          console.error('Error redeeming points:', error);
          // Continue with booking even if points redemption fails
        }
      }
      
      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          apartment_type: selectedApartment,
          check_in: format(checkIn, 'yyyy-MM-dd'),
          check_out: format(checkOut, 'yyyy-MM-dd'),
          guests: parseInt(guests),
          total_price: totalPrice,
          discount_amount: loyaltyDiscountAmount + pointsRedemptionDiscount,
          status: 'pending',
          payment_status: 'pay_later',
          payment_method: 'pay_at_hotel',
          guest_name: guestName,
          guest_email: guestEmail,
          guest_phone: guestPhone,
          guest_id_number: guestIdNumber,
          guest_address: guestAddress,
          special_requests: specialRequests || null,
          notes: pointsToRedeem > 0 ? `Redeemed ${pointsToRedeem} loyalty points for ${pointsRedemptionDiscount} GEL discount` : null,
          user_id: registeredUserId || user?.id || '00000000-0000-0000-0000-000000000000',
        })
        .select()
        .single();
      
      if (bookingError) throw bookingError;
      
      // Add loyalty points for registered or logged-in users
      const effectiveUserId = registeredUserId || user?.id;
      if (effectiveUserId) {
        const result = await addLoyaltyPoints(effectiveUserId, totalPrice);
        if (result) {
          setEarnedPoints(result.pointsAdded);
        }
      }
      
      // Send confirmation email with language preference
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
            language, // Pass language preference
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
      
      // Send webhook notification (fire and forget - don't block success)
      if (booking) {
        supabase.functions.invoke('send-booking-webhook', {
          body: { booking }
        }).catch(err => console.error('Webhook error:', err));
      }
      
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
    setWantsToRegister(false);
    setPassword('');
    setConfirmPassword('');
    setRegistrationError('');
    setPointsRedemptionDiscount(0);
    setPointsToRedeem(0);
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
                <SelectContent className="bg-background border">
                  {apartments.map((apt) => (
                    <SelectItem key={apt.id} value={apt.apartment_type}>
                      {language === 'ka' ? apt.name_ka : apt.name_en}
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
                {/* Nightly breakdown - show when prices vary */}
                {hasVariedPrices && priceBreakdown.length > 0 && (
                  <div className="space-y-1 pb-2 border-b border-border/50">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      {language === 'ka' ? 'ღამეების დეტალები:' : 'Nightly breakdown:'}
                    </p>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {priceBreakdown.map((item, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            {format(item.date, 'MMM d, yyyy')}
                          </span>
                          <span>{item.price} GEL</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Simple summary when prices don't vary */}
                {!hasVariedPrices && (
                  <div className="flex justify-between text-sm">
                    <span>{selectedApt.price_per_night} GEL × {nights} {language === 'ka' ? 'ღამე' : 'nights'}</span>
                    <span>{basePrice} GEL</span>
                  </div>
                )}
                
                {/* Total for varied prices */}
                {hasVariedPrices && (
                  <div className="flex justify-between text-sm">
                    <span>{nights} {language === 'ka' ? 'ღამე' : 'nights'}</span>
                    <span>{basePrice} GEL</span>
                  </div>
                )}
                
                {/* Loyalty Discount */}
                {user && loyaltyDiscount > 0 && (
                  <div className="flex justify-between text-sm text-primary">
                    <span className="flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      {language === 'ka' ? `ლოიალობის ფასდაკლება (${loyaltyDiscount}%)` : `Loyalty discount (${loyaltyDiscount}%)`}
                    </span>
                    <span>-{loyaltyDiscountAmount} GEL</span>
                  </div>
                )}
                
                {/* Points Redemption Discount */}
                {pointsRedemptionDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span className="flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      {language === 'ka' ? `ქულებით ფასდაკლება (${pointsToRedeem} ქულა)` : `Points discount (${pointsToRedeem} pts)`}
                    </span>
                    <span>-{pointsRedemptionDiscount.toFixed(2)} GEL</span>
                  </div>
                )}
                
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>{language === 'ka' ? 'სულ' : 'Total'}</span>
                  <span className="text-primary">{totalPrice.toFixed(2)} GEL</span>
                </div>
                
                {/* Points to earn */}
                {user && (
                  <p className="text-xs text-primary flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    {language === 'ka' 
                      ? `დაიგროვებთ ${pointsToEarn} ქულას`
                      : `You'll earn ${pointsToEarn} points`}
                  </p>
                )}
                
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  {language === 'ka' ? 'გადახდა სასტუმროში მოსვლისას' : 'Pay at hotel upon arrival'}
                </p>
                
                {/* Free Cancellation Badge */}
                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2 mt-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">
                    {language === 'ka' ? 'უფასო გაუქმება ჩასვლამდე 24 საათით ადრე' : 'Free cancellation up to 24 hours before check-in'}
                  </span>
                </div>
              </div>
            )}
            
            {/* Loyalty Points Redemption Section */}
            {user && nights > 0 && basePrice > 0 && (
              <LoyaltyRedemptionSection 
                totalPrice={basePrice - loyaltyDiscountAmount} 
                onDiscountChange={handlePointsRedemptionChange} 
              />
            )}
            
            {/* Registration Offer for Non-Logged Users */}
            {!user && nights > 0 && (
              <div className="bg-gradient-to-r from-gold-50 to-primary/5 border border-gold-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center flex-shrink-0 shadow-gold">
                    <Gift className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">
                      {language === 'ka' ? '🎁 მიიღეთ 20₾ საჩუქარი!' : '🎁 Get 20 GEL Welcome Gift!'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ka' 
                        ? 'დაამატეთ პაროლი და მიიღეთ 20 ლარი ბონუსად' 
                        : 'Add a password and receive 20 GEL bonus credit'}
                    </p>
                  </div>
                </div>
                
                {/* Registration checkbox */}
                <div className="flex items-center space-x-2 mt-3">
                  <Checkbox 
                    id="wantsToRegister" 
                    checked={wantsToRegister}
                    onCheckedChange={(checked) => {
                      setWantsToRegister(checked === true);
                      if (!checked) {
                        setPassword('');
                        setConfirmPassword('');
                        setRegistrationError('');
                      }
                    }}
                  />
                  <label 
                    htmlFor="wantsToRegister" 
                    className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2"
                  >
                    <Gift className="w-4 h-4 text-gold-500" />
                    {language === 'ka' 
                      ? 'დიახ, მინდა რეგისტრაცია და 20₾ ბონუსი!' 
                      : 'Yes, register me and get 20 GEL bonus!'}
                  </label>
                </div>
                
                {/* Password fields - only shown when checkbox is checked */}
                {wantsToRegister && (
                  <div className="space-y-3 mt-3 p-3 bg-background/50 rounded-lg border border-gold-200/50">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Lock className="w-3 h-3" />
                        {language === 'ka' ? 'პაროლი *' : 'Password *'}
                      </Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setRegistrationError('');
                          }}
                          placeholder={language === 'ka' ? 'მინიმუმ 6 სიმბოლო' : 'Minimum 6 characters'}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Lock className="w-3 h-3" />
                        {language === 'ka' ? 'გაიმეორეთ პაროლი *' : 'Confirm Password *'}
                      </Label>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setRegistrationError('');
                        }}
                        placeholder={language === 'ka' ? 'იგივე პაროლი' : 'Same password'}
                      />
                    </div>
                    
                    {registrationError && (
                      <p className="text-xs text-destructive">{registrationError}</p>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Crown className="w-3 h-3 text-gold-500" />
                      <span>
                        {language === 'ka' 
                          ? 'ლოიალობის პროგრამით დააგროვეთ ქულები' 
                          : 'Earn points with loyalty program'}
                      </span>
                    </div>
                  </div>
                )}
                
                {!wantsToRegister && (
                  <p className="text-[10px] text-center text-muted-foreground">
                    {language === 'ka' 
                      ? 'ან გააგრძელეთ როგორც სტუმარი' 
                      : 'Or continue as guest'}
                  </p>
                )}
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
      
      {/* Registration Success Popup with Confetti */}
      <RegistrationSuccessPopup
        isOpen={showRegistrationPopup}
        onClose={() => setShowRegistrationPopup(false)}
        bonusAmount={20}
      />
    </Dialog>
  );
};