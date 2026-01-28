import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Trash2, Download, Filter, X, Copy, MessageCircle, ChevronDown, ChevronUp, StickyNote, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';
import * as XLSX from 'xlsx';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import { AdminBookingNotes } from './AdminBookingNotes';
import { downloadInvoice, InvoiceData } from '@/lib/invoiceGenerator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface BookingNote {
  id: string;
  booking_id: string;
  note: string;
  note_type: string;
  created_at: string;
}

interface Booking {
  id: string;
  apartment_type: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number | null;
  status: string;
  payment_status: string;
  payment_method: string | null;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  guest_address: string | null;
  guest_id_number: string | null;
  promo_code: string | null;
  discount_amount: number | null;
  created_at: string;
  booking_notes?: BookingNote[];
}

export const AdminBookings = () => {
  const queryClient = useQueryClient();
  const { openWhatsApp } = useWhatsApp();
  
  // Filter states
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [apartmentFilter, setApartmentFilter] = useState('all');
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, booking_notes(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Booking[];
    },
  });

  // Get unique apartment types for filter
  const apartmentTypes = useMemo(() => {
    if (!bookings) return [];
    const types = [...new Set(bookings.map(b => b.apartment_type))];
    return types.sort();
  }, [bookings]);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    
    return bookings.filter(booking => {
      // Date filter
      if (dateFrom) {
        const checkIn = new Date(booking.check_in);
        const fromDate = new Date(dateFrom);
        if (checkIn < fromDate) return false;
      }
      if (dateTo) {
        const checkOut = new Date(booking.check_out);
        const toDate = new Date(dateTo);
        if (checkOut > toDate) return false;
      }
      
      // Status filter
      if (statusFilter !== 'all' && booking.status !== statusFilter) {
        return false;
      }
      
      // Apartment filter
      if (apartmentFilter !== 'all' && booking.apartment_type !== apartmentFilter) {
        return false;
      }
      
      return true;
    });
  }, [bookings, dateFrom, dateTo, statusFilter, apartmentFilter]);

  const clearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setStatusFilter('all');
    setApartmentFilter('all');
  };

  const hasActiveFilters = dateFrom || dateTo || statusFilter !== 'all' || apartmentFilter !== 'all';

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('სტატუსი განახლდა');
    },
    onError: (error) => {
      toast.error('შეცდომა: ' + error.message);
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('ბრონირება წაიშალა');
    },
    onError: (error) => {
      toast.error('შეცდომა: ' + error.message);
    },
  });

  const copyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    toast.success('ტელეფონი დაკოპირდა');
  };

  const handleWhatsApp = (booking: Booking) => {
    if (!booking.guest_phone) {
      toast.error('ტელეფონის ნომერი არ არის მითითებული');
      return;
    }
    const phone = booking.guest_phone.replace(/[^0-9]/g, '');
    const message = `გამარჯობა ${booking.guest_name || ''}! თქვენი ჯავშანი Orbi City-ში: ${format(new Date(booking.check_in), 'dd/MM/yyyy')} - ${format(new Date(booking.check_out), 'dd/MM/yyyy')}`;
    window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDownloadInvoice = (booking: Booking) => {
    const nights = differenceInDays(new Date(booking.check_out), new Date(booking.check_in));
    const pricePerNight = booking.total_price && nights > 0
      ? Math.round((booking.total_price + (booking.discount_amount || 0)) / nights)
      : 0;

    const invoiceData: InvoiceData = {
      bookingId: booking.id,
      apartmentType: booking.apartment_type,
      apartmentName: booking.apartment_type,
      checkIn: booking.check_in,
      checkOut: booking.check_out,
      guests: booking.guests,
      totalPrice: booking.total_price || 0,
      discountAmount: booking.discount_amount || undefined,
      promoCode: booking.promo_code || undefined,
      pricePerNight: pricePerNight,
      guestName: booking.guest_name || 'Guest',
      guestEmail: booking.guest_email || undefined,
      guestPhone: booking.guest_phone || undefined,
      guestAddress: booking.guest_address || undefined,
      guestIdNumber: booking.guest_id_number || undefined,
      paymentStatus: booking.payment_status,
      paymentMethod: booking.payment_method || undefined,
      createdAt: booking.created_at,
    };

    downloadInvoice(invoiceData);
    toast.success('ინვოისი გადმოწერილია');
  };

  const exportToExcel = () => {
    if (!filteredBookings || filteredBookings.length === 0) {
      toast.error('ექსპორტისთვის მონაცემები არ არის');
      return;
    }

    const exportData = filteredBookings.map((booking) => ({
      'სტუმრის სახელი': booking.guest_name || '-',
      'ელ-ფოსტა': booking.guest_email || '-',
      'ტელეფონი': booking.guest_phone || '-',
      'აპარტამენტი': booking.apartment_type,
      'შესვლა': format(new Date(booking.check_in), 'dd/MM/yyyy'),
      'გასვლა': format(new Date(booking.check_out), 'dd/MM/yyyy'),
      'სტუმრები': booking.guests,
      'ფასი': booking.total_price ? `${booking.total_price} ₾` : '-',
      'სტატუსი': booking.status === 'confirmed' ? 'დადასტურებული' : booking.status === 'cancelled' ? 'გაუქმებული' : 'მოლოდინში',
      'გადახდა': booking.payment_status === 'paid' ? 'გადახდილი' : booking.payment_status === 'pay_later' ? 'ადგილზე' : 'გადაუხდელი',
      'პრომო კოდი': booking.promo_code || '-',
      'შექმნის თარიღი': format(new Date(booking.created_at), 'dd/MM/yyyy HH:mm'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ბრონირებები');

    // Auto-size columns
    const maxWidths = Object.keys(exportData[0]).map((key) => ({
      wch: Math.max(
        key.length,
        ...exportData.map((row) => String(row[key as keyof typeof row]).length)
      ),
    }));
    worksheet['!cols'] = maxWidths;

    const fileName = `ბრონირებები_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    toast.success('ფაილი გადმოწერილია');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>ბრონირებების მართვა</CardTitle>
          <Button onClick={exportToExcel} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Excel ექსპორტი
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap items-end gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" />
            ფილტრები:
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">თარიღიდან</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-40"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">თარიღამდე</label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-40"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">სტატუსი</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="ყველა" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ყველა</SelectItem>
                <SelectItem value="pending">მოლოდინში</SelectItem>
                <SelectItem value="confirmed">დადასტურებული</SelectItem>
                <SelectItem value="cancelled">გაუქმებული</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">აპარტამენტი</label>
            <Select value={apartmentFilter} onValueChange={setApartmentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="ყველა" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ყველა</SelectItem>
                {apartmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
              <X className="h-4 w-4" />
              გასუფთავება
            </Button>
          )}
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          ნაჩვენებია: {filteredBookings.length} / {bookings?.length || 0} ბრონირება
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>სტუმარი</TableHead>
                <TableHead>აპარტამენტი</TableHead>
                <TableHead>შესვლა</TableHead>
                <TableHead>გასვლა</TableHead>
                <TableHead>სტუმრები</TableHead>
                <TableHead>ფასი</TableHead>
                <TableHead>სტატუსი</TableHead>
                <TableHead>მოქმედებები</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    ბრონირებები არ მოიძებნა
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <Collapsible 
                    key={booking.id} 
                    open={expandedBookingId === booking.id}
                    onOpenChange={(open) => setExpandedBookingId(open ? booking.id : null)}
                    asChild
                  >
                    <>
                      <TableRow className="group">
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.guest_name || '-'}</p>
                            <p className="text-sm text-muted-foreground">{booking.guest_email || '-'}</p>
                            {booking.guest_phone && (
                              <p className="text-sm text-muted-foreground">{booking.guest_phone}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{booking.apartment_type}</TableCell>
                        <TableCell>{format(new Date(booking.check_in), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{format(new Date(booking.check_out), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{booking.guests}</TableCell>
                        <TableCell>{booking.total_price} ₾</TableCell>
                        <TableCell>
                          <Select
                            value={booking.status}
                            onValueChange={(value) =>
                              updateStatusMutation.mutate({ id: booking.id, status: value })
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">მოლოდინში</SelectItem>
                              <SelectItem value="confirmed">დადასტურებული</SelectItem>
                              <SelectItem value="cancelled">გაუქმებული</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                title="შენიშვნები"
                                className="relative"
                              >
                                <StickyNote className="h-4 w-4" />
                                {(booking.booking_notes?.length || 0) > 0 && (
                                  <Badge 
                                    variant="secondary" 
                                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                                  >
                                    {booking.booking_notes?.length}
                                  </Badge>
                                )}
                              </Button>
                            </CollapsibleTrigger>
                            {booking.guest_phone && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyPhone(booking.guest_phone!)}
                                  title="ტელეფონის კოპირება"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleWhatsApp(booking)}
                                  title="WhatsApp-ით დაკავშირება"
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadInvoice(booking)}
                              title="ინვოისის გადმოწერა"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteBookingMutation.mutate(booking.id)}
                              disabled={deleteBookingMutation.isPending}
                              title="წაშლა"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <CollapsibleContent asChild>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableCell colSpan={8} className="p-4">
                            <AdminBookingNotes 
                              bookingId={booking.id} 
                              notes={booking.booking_notes || []}
                              onNotesChange={() => queryClient.invalidateQueries({ queryKey: ['admin-bookings'] })}
                            />
                          </TableCell>
                        </TableRow>
                      </CollapsibleContent>
                    </>
                  </Collapsible>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};