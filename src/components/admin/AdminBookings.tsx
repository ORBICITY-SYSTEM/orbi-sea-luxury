import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Download } from 'lucide-react';
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
    if (!bookings || bookings.length === 0) {
      toast.error('ექსპორტისთვის მონაცემები არ არის');
      return;
    }

    const exportData = bookings.map((booking) => ({
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
      <CardContent>
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
              {bookings?.map((booking) => (
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
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
