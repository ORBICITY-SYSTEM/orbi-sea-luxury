import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Trash2, Loader2, Filter, CalendarDays, Home, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInDays } from 'date-fns';
import { ka } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface BlockedDate {
  id: string;
  apartment_type: string;
  start_date: string;
  end_date: string;
  reason: string | null;
  source: string | null;
  external_id: string | null;
  integration_id: string | null;
  created_at: string;
}

const SOURCE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  airbnb: { label: 'Airbnb', color: 'bg-rose-100 text-rose-800 border-rose-200', icon: '🏠' },
  booking_com: { label: 'Booking.com', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '🔵' },
  expedia: { label: 'Expedia', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '✈️' },
  vrbo: { label: 'VRBO', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '🏡' },
  manual: { label: 'მანუალური', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: '✍️' },
};

export function AdminBlockedDates() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [apartmentFilter, setApartmentFilter] = useState<string>('all');
  const [newBlock, setNewBlock] = useState({
    apartment_type: '',
    start_date: '',
    end_date: '',
    reason: '',
  });

  const { data: blockedDates, isLoading } = useQuery({
    queryKey: ['blocked-dates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blocked_dates')
        .select('*')
        .order('start_date', { ascending: true });
      if (error) throw error;
      return data as BlockedDate[];
    },
  });

  const { data: apartments } = useQuery({
    queryKey: ['apartment-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apartment_prices')
        .select('apartment_type, name_ka')
        .eq('is_active', true);
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (block: typeof newBlock) => {
      const { error } = await supabase.from('blocked_dates').insert([{
        ...block,
        source: 'manual',
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-dates'] });
      toast({ title: 'წარმატება', description: 'თარიღები დაიბლოკა' });
      setIsAddOpen(false);
      setNewBlock({ apartment_type: '', start_date: '', end_date: '', reason: '' });
    },
    onError: () => {
      toast({ title: 'შეცდომა', description: 'ვერ მოხერხდა დაბლოკვა', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blocked_dates').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-dates'] });
      toast({ title: 'წარმატება', description: 'ბლოკი წაიშალა' });
    },
  });

  const handleAdd = () => {
    if (!newBlock.apartment_type || !newBlock.start_date || !newBlock.end_date) {
      toast({ title: 'შეცდომა', description: 'შეავსეთ ყველა ველი', variant: 'destructive' });
      return;
    }
    addMutation.mutate(newBlock);
  };

  // Filter and compute stats
  const { filteredDates, stats, uniqueSources } = useMemo(() => {
    if (!blockedDates) return { filteredDates: [], stats: { total: 0, totalDays: 0 }, uniqueSources: [] };

    const sources = [...new Set(blockedDates.map(b => b.source || 'manual'))];
    
    let filtered = blockedDates;
    
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(b => (b.source || 'manual') === sourceFilter);
    }
    
    if (apartmentFilter !== 'all') {
      filtered = filtered.filter(b => b.apartment_type === apartmentFilter);
    }

    const totalDays = filtered.reduce((acc, block) => {
      const days = differenceInDays(new Date(block.end_date), new Date(block.start_date));
      return acc + Math.max(days, 1);
    }, 0);

    return {
      filteredDates: filtered,
      stats: { total: filtered.length, totalDays },
      uniqueSources: sources,
    };
  }, [blockedDates, sourceFilter, apartmentFilter]);

  const getSourceConfig = (source: string | null) => {
    return SOURCE_CONFIG[source || 'manual'] || SOURCE_CONFIG.manual;
  };

  const getNights = (startDate: string, endDate: string) => {
    const days = differenceInDays(new Date(endDate), new Date(startDate));
    return Math.max(days, 1);
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
          <h2 className="text-3xl font-bold">Block Dates</h2>
          <p className="text-muted-foreground">დაბლოკეთ თარიღები რემონტის, პერსონალური გამოყენების ან სხვა მიზეზით</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              თარიღების დაბლოკვა
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ახალი თარიღების დაბლოკვა</DialogTitle>
              <DialogDescription>
                აირჩიეთ აპარტამენტი და თარიღები რომლებშიც არ იქნება ჯავშანი შესაძლებელი
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>აპარტამენტი</Label>
                <Select
                  value={newBlock.apartment_type}
                  onValueChange={(v) => setNewBlock({ ...newBlock, apartment_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="აირჩიეთ აპარტამენტი" />
                  </SelectTrigger>
                  <SelectContent>
                    {apartments?.map((apt) => (
                      <SelectItem key={apt.apartment_type} value={apt.apartment_type}>
                        {apt.name_ka}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>დაწყების თარიღი</Label>
                  <Input
                    type="date"
                    value={newBlock.start_date}
                    onChange={(e) => setNewBlock({ ...newBlock, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>დასრულების თარიღი</Label>
                  <Input
                    type="date"
                    value={newBlock.end_date}
                    onChange={(e) => setNewBlock({ ...newBlock, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>მიზეზი (არასავალდებულო)</Label>
                <Input
                  value={newBlock.reason}
                  onChange={(e) => setNewBlock({ ...newBlock, reason: e.target.value })}
                  placeholder="მაგ: რემონტი, პირადი გამოყენება..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>გაუქმება</Button>
              <Button onClick={handleAdd} disabled={addMutation.isPending}>
                {addMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                დაბლოკვა
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">სულ ბლოკი</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalDays}</p>
                <p className="text-xs text-muted-foreground">სულ ღამე</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {uniqueSources.filter(s => s !== 'manual').slice(0, 2).map(source => {
          const config = getSourceConfig(source);
          const count = blockedDates?.filter(b => b.source === source).length || 0;
          return (
            <Card key={source}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{config.icon}</span>
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">{config.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">ფილტრაცია:</span>
            </div>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="წყარო" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ყველა წყარო</SelectItem>
                {uniqueSources.map(source => {
                  const config = getSourceConfig(source);
                  return (
                    <SelectItem key={source} value={source}>
                      {config.icon} {config.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Select value={apartmentFilter} onValueChange={setApartmentFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="აპარტამენტი" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ყველა აპარტამენტი</SelectItem>
                {apartments?.map((apt) => (
                  <SelectItem key={apt.apartment_type} value={apt.apartment_type}>
                    {apt.name_ka}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(sourceFilter !== 'all' || apartmentFilter !== 'all') && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSourceFilter('all');
                  setApartmentFilter('all');
                }}
              >
                გასუფთავება
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            დაბლოკილი თარიღები
            {filteredDates.length !== blockedDates?.length && (
              <Badge variant="secondary" className="ml-2">
                {filteredDates.length} / {blockedDates?.length}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>ჯავშანი ამ თარიღებში მიუწვდომელია</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredDates && filteredDates.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>წყარო</TableHead>
                  <TableHead>აპარტამენტი</TableHead>
                  <TableHead>დაწყება</TableHead>
                  <TableHead>დასრულება</TableHead>
                  <TableHead className="text-center">ღამეები</TableHead>
                  <TableHead>მიზეზი</TableHead>
                  <TableHead className="text-right">მოქმედება</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDates.map((block) => {
                  const sourceConfig = getSourceConfig(block.source);
                  const nights = getNights(block.start_date, block.end_date);
                  return (
                    <TableRow key={block.id}>
                      <TableCell>
                        <Badge className={`${sourceConfig.color} border`}>
                          {sourceConfig.icon} {sourceConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{block.apartment_type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(block.start_date), 'd MMM yyyy', { locale: ka })}
                      </TableCell>
                      <TableCell>
                        {format(new Date(block.end_date), 'd MMM yyyy', { locale: ka })}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono">
                          {nights} ღამე
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {block.reason || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {block.external_id && (
                            <Badge variant="outline" className="text-xs">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              სინქ.
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMutation.mutate(block.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>დაბლოკილი თარიღები არ არის</p>
              {(sourceFilter !== 'all' || apartmentFilter !== 'all') && (
                <p className="text-sm mt-2">სცადეთ ფილტრის გასუფთავება</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* iCal Info Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ExternalLink className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="font-medium">iCal სინქრონიზაცია</h4>
              <p className="text-sm text-muted-foreground">
                iCal ფორმატი მხოლოდ <strong>თარიღებს</strong> და <strong>სტატუსს</strong> (Reserved/Blocked) აწვდის. 
                ფასი, სტუმრის სახელი, კონტაქტი და სხვა დეტალები <strong>არ გადმოდის</strong> - ეს iCal სტანდარტის შეზღუდვაა.
              </p>
              <p className="text-xs text-muted-foreground">
                დეტალური ინფორმაციისთვის გამოიყენეთ Booking.com/Airbnb-ის საკუთარი დაშბორდები.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}