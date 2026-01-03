import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Download, FileText, TrendingUp, Calendar, DollarSign, Users, Loader2, Building } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, differenceInDays } from 'date-fns';
import { ka } from 'date-fns/locale';
import * as XLSX from 'xlsx';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export function AdminReports() {
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    end: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  });
  const [reportType, setReportType] = useState('overview');

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['admin-reports', dateRange, reportType],
    queryFn: async () => {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end + 'T23:59:59');
      
      if (error) throw error;

      const { data: apartments } = await supabase
        .from('apartment_prices')
        .select('apartment_type, name_ka')
        .eq('is_active', true);

      // Calculate metrics
      const totalBookings = bookings.length;
      const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
      const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
      const avgBookingValue = totalBookings > 0 ? totalRevenue / confirmedBookings.length : 0;
      
      // Calculate total nights booked
      const totalNights = confirmedBookings.reduce((sum, b) => {
        const checkIn = parseISO(b.check_in);
        const checkOut = parseISO(b.check_out);
        return sum + differenceInDays(checkOut, checkIn);
      }, 0);

      // Calculate occupancy rate (simplified - assumes 30 rooms)
      const daysInRange = differenceInDays(parseISO(dateRange.end), parseISO(dateRange.start)) + 1;
      const totalPossibleNights = daysInRange * 5; // Assuming 5 apartments
      const occupancyRate = totalPossibleNights > 0 ? (totalNights / totalPossibleNights) * 100 : 0;

      // ADR (Average Daily Rate)
      const adr = totalNights > 0 ? totalRevenue / totalNights : 0;

      // RevPAR (Revenue Per Available Room)
      const revpar = adr * (occupancyRate / 100);

      // Daily revenue chart
      const days = eachDayOfInterval({
        start: parseISO(dateRange.start),
        end: parseISO(dateRange.end),
      });

      const dailyRevenue = days.map(day => {
        const dayStr = format(day, 'yyyy-MM-dd');
        const dayBookings = confirmedBookings.filter(b => b.created_at?.startsWith(dayStr));
        const revenue = dayBookings.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
        return {
          date: format(day, 'd MMM', { locale: ka }),
          revenue,
          bookings: dayBookings.length,
        };
      });

      // By apartment type
      const byApartment = apartments?.map(apt => {
        const aptBookings = confirmedBookings.filter(b => b.apartment_type === apt.apartment_type);
        return {
          name: apt.name_ka,
          bookings: aptBookings.length,
          revenue: aptBookings.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0),
        };
      }) || [];

      // By status
      const byStatus = [
        { name: 'დადასტურებული', value: confirmedBookings.length, color: COLORS[0] },
        { name: 'მოლოდინში', value: bookings.filter(b => b.status === 'pending').length, color: COLORS[1] },
        { name: 'გაუქმებული', value: bookings.filter(b => b.status === 'cancelled').length, color: COLORS[2] },
      ];

      return {
        totalBookings,
        confirmedBookings: confirmedBookings.length,
        totalRevenue,
        avgBookingValue,
        totalNights,
        occupancyRate,
        adr,
        revpar,
        dailyRevenue,
        byApartment,
        byStatus,
        rawBookings: bookings,
      };
    },
  });

  const exportToExcel = () => {
    if (!reportData?.rawBookings) return;

    const ws = XLSX.utils.json_to_sheet(reportData.rawBookings.map(b => ({
      'ID': b.id,
      'სტუმარი': b.guest_name,
      'Email': b.guest_email,
      'ტელეფონი': b.guest_phone,
      'აპარტამენტი': b.apartment_type,
      'Check-in': b.check_in,
      'Check-out': b.check_out,
      'სტუმრები': b.guests,
      'ფასი': b.total_price,
      'სტატუსი': b.status,
      'შექმნის თარიღი': b.created_at,
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
    XLSX.writeFile(wb, `bookings-report-${dateRange.start}-${dateRange.end}.xlsx`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">ანგარიშები</h2>
          <p className="text-muted-foreground">დეტალური სტატისტიკა და ანალიტიკა</p>
        </div>
        <Button onClick={exportToExcel}>
          <Download className="h-4 w-4 mr-2" />
          Excel-ში ექსპორტი
        </Button>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label>დაწყების თარიღი</Label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>დასრულების თარიღი</Label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>პერიოდი</Label>
              <Select
                value=""
                onValueChange={(v) => {
                  const today = new Date();
                  if (v === 'this_month') {
                    setDateRange({
                      start: format(startOfMonth(today), 'yyyy-MM-dd'),
                      end: format(endOfMonth(today), 'yyyy-MM-dd'),
                    });
                  } else if (v === 'last_month') {
                    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                    setDateRange({
                      start: format(startOfMonth(lastMonth), 'yyyy-MM-dd'),
                      end: format(endOfMonth(lastMonth), 'yyyy-MM-dd'),
                    });
                  } else if (v === 'this_year') {
                    setDateRange({
                      start: format(new Date(today.getFullYear(), 0, 1), 'yyyy-MM-dd'),
                      end: format(new Date(today.getFullYear(), 11, 31), 'yyyy-MM-dd'),
                    });
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="სწრაფი არჩევა" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this_month">ეს თვე</SelectItem>
                  <SelectItem value="last_month">წინა თვე</SelectItem>
                  <SelectItem value="this_year">ეს წელი</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">სულ შემოსავალი</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₾{reportData?.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">დადასტურებული ჯავშნებიდან</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData?.occupancyRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{reportData?.totalNights} ღამე დაკავებული</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ADR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₾{reportData?.adr.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">საშუალო ფასი ღამეზე</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RevPAR</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₾{reportData?.revpar.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">შემოსავალი თითო ოთახზე</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ყოველდღიური შემოსავალი</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData?.dailyRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`₾${value.toLocaleString()}`, 'შემოსავალი']}
                />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>აპარტამენტების მიხედვით</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData?.byApartment || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`₾${value.toLocaleString()}`, 'შემოსავალი']}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>სტატუსის მიხედვით</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={reportData?.byStatus || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="hsl(var(--primary))"
                dataKey="value"
              >
                {reportData?.byStatus?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>დეტალური მონაცემები</CardTitle>
          <CardDescription>ბოლო ჯავშნები არჩეულ პერიოდში</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>სტუმარი</TableHead>
                <TableHead>აპარტამენტი</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>ფასი</TableHead>
                <TableHead>სტატუსი</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData?.rawBookings?.slice(0, 10).map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.guest_name}</TableCell>
                  <TableCell>{booking.apartment_type}</TableCell>
                  <TableCell>{format(parseISO(booking.check_in), 'd MMM', { locale: ka })}</TableCell>
                  <TableCell>{format(parseISO(booking.check_out), 'd MMM', { locale: ka })}</TableCell>
                  <TableCell>₾{booking.total_price}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
