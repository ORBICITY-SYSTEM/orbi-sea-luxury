import { useState, DragEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Loader2, GripVertical } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isWithinInterval, parseISO, differenceInDays, addDays } from 'date-fns';
import { ka } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Booking {
  id: string;
  guest_name: string | null;
  guest_email: string | null;
  apartment_type: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number | null;
  status: string;
  payment_status: string;
}

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-500',
  pending: 'bg-yellow-500',
  cancelled: 'bg-red-500',
};

const AdminCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBookings, setSelectedBookings] = useState<Booking[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draggedBooking, setDraggedBooking] = useState<Booking | null>(null);
  const [dragOverDate, setDragOverDate] = useState<Date | null>(null);

  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-calendar-bookings', format(currentMonth, 'yyyy-MM')],
    queryFn: async () => {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .or(`check_in.gte.${format(subMonths(start, 1), 'yyyy-MM-dd')},check_out.lte.${format(addMonths(end, 1), 'yyyy-MM-dd')}`);

      if (error) throw error;
      return data as Booking[];
    },
  });

  const updateBookingDatesMutation = useMutation({
    mutationFn: async ({ id, check_in, check_out }: { id: string; check_in: string; check_out: string }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ check_in, check_out })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-calendar-bookings'] });
      toast.success('ჯავშნის თარიღები განახლდა');
    },
    onError: (error) => {
      toast.error('შეცდომა: ' + error.message);
    },
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const firstDayOfWeek = monthStart.getDay();
  const paddingDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const getBookingsForDay = (day: Date) => {
    if (!bookings) return [];
    return bookings.filter((booking) => {
      const checkIn = parseISO(booking.check_in);
      const checkOut = parseISO(booking.check_out);
      return isWithinInterval(day, { start: checkIn, end: checkOut }) || 
             isSameDay(day, checkIn) || 
             isSameDay(day, checkOut);
    });
  };

  const handleDayClick = (day: Date, dayBookings: Booking[]) => {
    if (dayBookings.length > 0 && !draggedBooking) {
      setSelectedDate(day);
      setSelectedBookings(dayBookings);
      setDialogOpen(true);
    }
  };

  const handleDragStart = (e: DragEvent, booking: Booking) => {
    e.stopPropagation();
    setDraggedBooking(booking);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', booking.id);
  };

  const handleDragOver = (e: DragEvent, day: Date) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDate(day);
  };

  const handleDragLeave = () => {
    setDragOverDate(null);
  };

  const handleDrop = (e: DragEvent, targetDate: Date) => {
    e.preventDefault();
    setDragOverDate(null);

    if (!draggedBooking) return;

    const originalCheckIn = parseISO(draggedBooking.check_in);
    const originalCheckOut = parseISO(draggedBooking.check_out);
    const duration = differenceInDays(originalCheckOut, originalCheckIn);

    const newCheckIn = format(targetDate, 'yyyy-MM-dd');
    const newCheckOut = format(addDays(targetDate, duration), 'yyyy-MM-dd');

    updateBookingDatesMutation.mutate({
      id: draggedBooking.id,
      check_in: newCheckIn,
      check_out: newCheckOut,
    });

    setDraggedBooking(null);
  };

  const handleDragEnd = () => {
    setDraggedBooking(null);
    setDragOverDate(null);
  };

  const weekDays = ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვი'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">კალენდარი</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                გადაათრიეთ ჯავშანი სხვა თარიღზე გადასატანად
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium min-w-[180px] text-center">
                {format(currentMonth, 'MMMM yyyy', { locale: ka })}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date())}
                className="ml-2"
              >
                დღეს
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day) => (
              <div
                key={day}
                className="p-2 text-center font-medium text-muted-foreground border-b"
              >
                {day}
              </div>
            ))}

            {Array.from({ length: paddingDays }).map((_, index) => (
              <div key={`padding-${index}`} className="p-2 min-h-[100px]" />
            ))}

            {days.map((day) => {
              const dayBookings = getBookingsForDay(day);
              const isToday = isSameDay(day, new Date());
              const hasBookings = dayBookings.length > 0;
              const isDragOver = dragOverDate && isSameDay(day, dragOverDate);

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => handleDayClick(day, dayBookings)}
                  onDragOver={(e) => handleDragOver(e, day)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, day)}
                  className={`
                    p-2 min-h-[100px] border rounded-lg transition-all
                    ${isToday ? 'bg-primary/10 border-primary' : 'border-border'}
                    ${hasBookings && !draggedBooking ? 'cursor-pointer hover:bg-muted' : ''}
                    ${!isSameMonth(day, currentMonth) ? 'opacity-50' : ''}
                    ${isDragOver ? 'bg-primary/20 border-primary border-2 scale-105' : ''}
                  `}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayBookings.slice(0, 3).map((booking) => {
                      const isCheckInDay = isSameDay(day, parseISO(booking.check_in));
                      
                      return (
                        <div
                          key={booking.id}
                          draggable={isCheckInDay}
                          onDragStart={(e) => isCheckInDay && handleDragStart(e, booking)}
                          onDragEnd={handleDragEnd}
                          className={`
                            text-xs p-1 rounded truncate text-white flex items-center gap-1
                            ${statusColors[booking.status] || 'bg-gray-500'}
                            ${isCheckInDay ? 'cursor-grab active:cursor-grabbing' : ''}
                            ${draggedBooking?.id === booking.id ? 'opacity-50' : ''}
                          `}
                          title={`${booking.guest_name || 'სტუმარი'} - ${booking.apartment_type}`}
                        >
                          {isCheckInDay && <GripVertical className="h-3 w-3 flex-shrink-0" />}
                          <span className="truncate">{booking.guest_name || booking.apartment_type}</span>
                        </div>
                      );
                    })}
                    {dayBookings.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayBookings.length - 3} სხვა
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span className="text-sm">დადასტურებული</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500" />
              <span className="text-sm">მოლოდინში</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span className="text-sm">გაუქმებული</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">გადაათრიეთ შესვლის დღიდან</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: ka })} - ჯავშნები
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {selectedBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{booking.guest_name || 'უცნობი სტუმარი'}</p>
                      <p className="text-sm text-muted-foreground">{booking.guest_email}</p>
                      <p className="text-sm mt-1">{booking.apartment_type}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(booking.check_in), 'd MMM', { locale: ka })} - {format(parseISO(booking.check_out), 'd MMM', { locale: ka })}
                      </p>
                      <p className="text-sm">სტუმრები: {booking.guests}</p>
                      {booking.total_price && (
                        <p className="text-sm font-medium mt-1">${booking.total_price}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant={booking.status === 'confirmed' ? 'default' : booking.status === 'cancelled' ? 'destructive' : 'secondary'}
                      >
                        {booking.status === 'confirmed' ? 'დადასტურებული' : booking.status === 'cancelled' ? 'გაუქმებული' : 'მოლოდინში'}
                      </Badge>
                      <Badge variant="outline">
                        {booking.payment_status === 'paid' ? 'გადახდილი' : booking.payment_status === 'pay_later' ? 'ადგილზე' : 'გადაუხდელი'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCalendar;
