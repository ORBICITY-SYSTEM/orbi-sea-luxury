import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Phone, Mail, User, Calendar, Users, Home, Copy, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const AdminPendingReservations = () => {
  const queryClient = useQueryClient();

  const copyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    toast.success('ტელეფონი დაკოპირდა');
  };

  const handleWhatsApp = (booking: { guest_name: string | null; guest_phone: string | null; check_in: string; check_out: string }) => {
    if (!booking.guest_phone) return;
    const phone = booking.guest_phone.replace(/[^0-9]/g, '');
    const message = `გამარჯობა ${booking.guest_name || ''}! თქვენი ჯავშანი Orbi City-ში: ${format(new Date(booking.check_in), 'dd/MM/yyyy')} - ${format(new Date(booking.check_out), 'dd/MM/yyyy')}`;
    window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`, '_blank');
  };

  const { data: pendingBookings, isLoading } = useQuery({
    queryKey: ['admin-pending-reservations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('payment_status', 'pay_later')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'confirmed' | 'cancelled' }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-reservations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success(status === 'confirmed' ? 'ჯავშანი დადასტურდა!' : 'ჯავშანი გაუქმდა');
    },
    onError: (error) => {
      toast.error('შეცდომა: ' + error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            მოლოდინში მყოფი ჯავშნები (Pay Later)
          </CardTitle>
          <CardDescription>
            სტუმრები, რომლებმაც ჯავშანი დაჯავშნეს "გადახდა შემდეგ" ოფციით
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingBookings && pendingBookings.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>სტუმრის ინფორმაცია</TableHead>
                    <TableHead>აპარტამენტი</TableHead>
                    <TableHead>თარიღები</TableHead>
                    <TableHead>დეტალები</TableHead>
                    <TableHead>ფასი</TableHead>
                    <TableHead>მოქმედებები</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-medium">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {booking.guest_name || 'N/A'}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {booking.guest_email || 'N/A'}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {booking.guest_phone || 'N/A'}
                            {booking.guest_phone && (
                              <div className="flex gap-1 ml-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => copyPhone(booking.guest_phone!)}
                                  title="ტელეფონის კოპირება"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                                  onClick={() => handleWhatsApp(booking)}
                                  title="WhatsApp-ით დაკავშირება"
                                >
                                  <MessageCircle className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                          {booking.guest_id_number && (
                            <div className="text-xs text-muted-foreground">
                              ID: {booking.guest_id_number}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="secondary">{booking.apartment_type}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="text-muted-foreground">შესვლა:</span>{' '}
                            {format(new Date(booking.check_in), 'dd/MM/yyyy')}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">გასვლა:</span>{' '}
                            {format(new Date(booking.check_out), 'dd/MM/yyyy')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {booking.guests} სტუმარი
                        </div>
                        {booking.special_requests && (
                          <div className="mt-1 text-xs text-muted-foreground max-w-[200px] truncate">
                            {booking.special_requests}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-lg">
                          {booking.total_price} ₾
                        </div>
                        {booking.discount_amount && booking.discount_amount > 0 && (
                          <div className="text-xs text-green-600">
                            ფასდაკლება: -{booking.discount_amount} ₾
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            className="gap-2"
                            onClick={() => updateStatusMutation.mutate({ id: booking.id, status: 'confirmed' })}
                            disabled={updateStatusMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4" />
                            დადასტურება
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="gap-2"
                            onClick={() => updateStatusMutation.mutate({ id: booking.id, status: 'cancelled' })}
                            disabled={updateStatusMutation.isPending}
                          >
                            <XCircle className="h-4 w-4" />
                            გაუქმება
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                მოლოდინში მყოფი ჯავშნები არ არის
              </h3>
              <p className="text-muted-foreground">
                ახალი Pay Later ჯავშნები აქ გამოჩნდება
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
