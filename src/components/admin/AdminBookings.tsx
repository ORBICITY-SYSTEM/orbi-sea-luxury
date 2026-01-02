import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Trash2, Download, Filter, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Booking {
  id: string;
  apartment_type: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number | null;
  status: string;
  payment_status: string;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  promo_code: string | null;
  created_at: string;
}

export const AdminBookings = () => {
  const queryClient = useQueryClient();
  
  // Filter states
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [apartmentFilter, setApartmentFilter] = useState('all');

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
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
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.guest_name || '-'}</p>
                        <p className="text-sm text-muted-foreground">{booking.guest_email || '-'}</p>
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
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteBookingMutation.mutate(booking.id)}
                        disabled={deleteBookingMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};