import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  TrendingUp,
  DollarSign,
  Award,
  Tag,
  Activity,
  Clock,
  CalendarCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isToday, isSameMonth, parseISO } from 'date-fns';
import { ka } from 'date-fns/locale';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'მოლოდინში',
  confirmed: 'დადასტურებული',
  cancelled: 'გაუქმებული',
};

export function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const today = new Date();
      const todayStr = format(today, 'yyyy-MM-dd');
      const monthStart = format(startOfMonth(today), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(today), 'yyyy-MM-dd');
      const weekStart = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      const weekEnd = format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');

      // Fetch all data in parallel
      const [bookings, users, contacts, loyalty, promoCodes] = await Promise.all([
        supabase.from('bookings').select('*'),
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('contact_submissions').select('*', { count: 'exact' }),
        supabase.from('loyalty_points').select('*'),
        supabase.from('promo_codes').select('*', { count: 'exact' }).eq('is_active', true),
      ]);

      const allBookings = bookings.data || [];

      // Today's check-ins
      const todayCheckIns = allBookings.filter(b => b.check_in === todayStr);
      
      // Today's check-outs
      const todayCheckOuts = allBookings.filter(b => b.check_out === todayStr);

      // Pending reservations (pay_later)
      const pendingReservations = allBookings.filter(
        b => b.payment_status === 'pay_later' && b.status === 'pending'
      );

      // This week's bookings
      const weeklyBookings = allBookings.filter(b => {
        const createdAt = b.created_at?.split('T')[0];
        return createdAt >= weekStart && createdAt <= weekEnd;
      });

      // This month's bookings
      const monthlyBookings = allBookings.filter(b => {
        const createdAt = b.created_at?.split('T')[0];
        return createdAt >= monthStart && createdAt <= monthEnd;
      });

      // Calculate revenue
      const totalRevenue = allBookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, booking) => sum + (Number(booking.total_price) || 0), 0);

      const monthlyRevenue = monthlyBookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, booking) => sum + (Number(booking.total_price) || 0), 0);

      const weeklyRevenue = weeklyBookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, booking) => sum + (Number(booking.total_price) || 0), 0);

      // Calculate booking status distribution
      const bookingsByStatus = allBookings.reduce((acc: Record<string, number>, booking) => {
        acc[booking.status] = (acc[booking.status] || 0) + 1;
        return acc;
      }, {});

      // Calculate monthly bookings for chart (last 6 months)
      const last6Months: Record<string, number> = {};
      for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthKey = format(date, 'MMM', { locale: ka });
        last6Months[monthKey] = 0;
      }

      allBookings.forEach(booking => {
        const bookingDate = new Date(booking.created_at);
        const monthKey = format(bookingDate, 'MMM', { locale: ka });
        if (last6Months.hasOwnProperty(monthKey)) {
          last6Months[monthKey]++;
        }
      });

      // Revenue by month for chart
      const revenueByMonth: Record<string, number> = {};
      for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthKey = format(date, 'MMM', { locale: ka });
        revenueByMonth[monthKey] = 0;
      }

      allBookings.filter(b => b.status === 'confirmed').forEach(booking => {
        const bookingDate = new Date(booking.created_at);
        const monthKey = format(bookingDate, 'MMM', { locale: ka });
        if (revenueByMonth.hasOwnProperty(monthKey)) {
          revenueByMonth[monthKey] += Number(booking.total_price) || 0;
        }
      });

      // Total loyalty points distributed
      const totalLoyaltyPoints = loyalty.data?.reduce((sum, lp) => 
        sum + (lp.total_earned || 0), 0
      ) || 0;

      // New contacts this week
      const newContactsThisWeek = (contacts.data || []).filter(c => {
        const createdAt = c.created_at?.split('T')[0];
        return createdAt >= weekStart && createdAt <= weekEnd;
      }).length;

      return {
        // Today stats
        todayCheckIns: todayCheckIns.length,
        todayCheckOuts: todayCheckOuts.length,
        pendingReservations: pendingReservations.length,
        
        // Period stats
        weeklyBookings: weeklyBookings.length,
        monthlyBookings: monthlyBookings.length,
        totalBookings: allBookings.length,
        
        // Revenue
        totalRevenue,
        monthlyRevenue,
        weeklyRevenue,
        
        // Users & contacts
        totalUsers: users.count || 0,
        totalContacts: contacts.count || 0,
        newContactsThisWeek,
        
        // Other
        totalPromoCodes: promoCodes.count || 0,
        totalLoyaltyPoints,
        bookingsByStatus,
        
        // Chart data
        monthlyChartData: Object.entries(last6Months).map(([month, count]) => ({ month, count })),
        revenueChartData: Object.entries(revenueByMonth).map(([month, revenue]) => ({ month, revenue })),
        
        // Recent bookings
        recentBookings: allBookings.slice(0, 5),
        pendingBookingsList: pendingReservations.slice(0, 5),
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const statusChartData = stats?.bookingsByStatus 
    ? Object.entries(stats.bookingsByStatus).map(([name, value]) => ({ 
        name: STATUS_LABELS[name] || name, 
        value 
      }))
    : [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {format(new Date(), "EEEE, d MMMM yyyy", { locale: ka })}
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Activity className="h-3 w-3 mr-1" />
          Live
        </Badge>
      </div>

      {/* Today's Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">დღევანდელი Check-in</CardTitle>
            <CalendarCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.todayCheckIns || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">სტუმრები შემოდიან დღეს</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">დღევანდელი Check-out</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.todayCheckOuts || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">სტუმრები გადიან დღეს</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">მოლოდინში (Pay Later)</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.pendingReservations || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">საჭიროებს დადასტურებას</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">კვირის შემოსავალი</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₾{stats?.weeklyRevenue?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              დადასტურებული ჯავშნებიდან
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue & Bookings Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">თვის შემოსავალი</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₾{stats?.monthlyRevenue?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.monthlyBookings || 0} ჯავშანი ამ თვეში</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">სულ შემოსავალი</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₾{stats?.totalRevenue?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.totalBookings || 0} ჯავშანი სულ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">მომხმარებლები</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">რეგისტრირებული</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">შეტყობინებები</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalContacts || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.newContactsThisWeek || 0} ამ კვირაში
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>შემოსავალი (ბოლო 6 თვე)</CardTitle>
            <CardDescription>დადასტურებული ჯავშნებიდან</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={stats?.revenueChartData || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`₾${value.toLocaleString()}`, 'შემოსავალი']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ბრონირებები (ბოლო 6 თვე)</CardTitle>
            <CardDescription>ყველა ჯავშანი</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats?.monthlyChartData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [value, 'ჯავშანი']}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution & Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>სტატუსის მიხედვით</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {statusChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {statusChartData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-1 text-xs">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ლოიალობის ქულები</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalLoyaltyPoints?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">სულ გაცემული ქულები</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">აქტიური პრომო კოდები</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPromoCodes || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">მოქმედი კოდები</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Reservations & Recent Bookings */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              მოლოდინში მყოფი ჯავშნები
            </CardTitle>
            <CardDescription>Pay Later - საჭიროებს დადასტურებას</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.pendingBookingsList?.length ? (
                stats.pendingBookingsList.map((booking: any) => (
                  <div 
                    key={booking.id} 
                    className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{booking.guest_name || 'უცნობი სტუმარი'}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.apartment_type} • {format(new Date(booking.check_in), 'dd/MM')} - {format(new Date(booking.check_out), 'dd/MM')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₾{Number(booking.total_price).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>ყველა ჯავშანი დამუშავებულია</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>უკანასკნელი ბრონირებები</CardTitle>
            <CardDescription>ბოლო 5 ჯავშანი</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recentBookings?.map((booking: any) => (
                <div 
                  key={booking.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div>
                    <p className="font-medium">{booking.apartment_type}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(booking.check_in), 'dd/MM')} - {format(new Date(booking.check_out), 'dd/MM')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₾{Number(booking.total_price).toLocaleString()}</p>
                    <Badge className={STATUS_COLORS[booking.status]} variant="secondary">
                      {STATUS_LABELS[booking.status] || booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
