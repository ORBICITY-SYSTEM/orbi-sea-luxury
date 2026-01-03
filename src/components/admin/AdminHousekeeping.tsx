import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Sparkles, Clock, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
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

interface HousekeepingItem {
  id: string;
  apartment_type: string;
  room_number: string | null;
  status: string;
  priority: string;
  assigned_to: string | null;
  notes: string | null;
  last_cleaned_at: string | null;
  next_check_in: string | null;
}

const STATUS_CONFIG = {
  clean: { label: 'სუფთა', icon: CheckCircle2, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  dirty: { label: 'საწმენდი', icon: AlertTriangle, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
  in_progress: { label: 'მიმდინარე', icon: RefreshCw, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  inspected: { label: 'შემოწმებული', icon: Sparkles, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
};

const PRIORITY_CONFIG = {
  low: { label: 'დაბალი', color: 'bg-gray-100 text-gray-800' },
  normal: { label: 'ჩვეულებრივი', color: 'bg-blue-100 text-blue-800' },
  high: { label: 'მაღალი', color: 'bg-orange-100 text-orange-800' },
  urgent: { label: 'სასწრაფო', color: 'bg-red-100 text-red-800' },
};

export function AdminHousekeeping() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    apartment_type: '',
    room_number: '',
    status: 'dirty',
    priority: 'normal',
    assigned_to: '',
    notes: '',
    next_check_in: '',
  });

  const { data: housekeeping, isLoading } = useQuery({
    queryKey: ['housekeeping'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('housekeeping')
        .select('*')
        .order('priority', { ascending: false });
      if (error) throw error;
      return data as HousekeepingItem[];
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
    mutationFn: async (item: typeof newItem) => {
      const { error } = await supabase.from('housekeeping').insert([{
        ...item,
        room_number: item.room_number || null,
        assigned_to: item.assigned_to || null,
        notes: item.notes || null,
        next_check_in: item.next_check_in || null,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['housekeeping'] });
      toast({ title: 'წარმატება', description: 'ჩანაწერი დაემატა' });
      setIsAddOpen(false);
      setNewItem({ apartment_type: '', room_number: '', status: 'dirty', priority: 'normal', assigned_to: '', notes: '', next_check_in: '' });
    },
    onError: () => {
      toast({ title: 'შეცდომა', variant: 'destructive' });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updates: any = { status };
      if (status === 'clean' || status === 'inspected') {
        updates.last_cleaned_at = new Date().toISOString();
      }
      const { error } = await supabase.from('housekeeping').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['housekeeping'] });
      toast({ title: 'სტატუსი განახლდა' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('housekeeping').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['housekeeping'] });
      toast({ title: 'ჩანაწერი წაიშალა' });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = {
    clean: housekeeping?.filter(h => h.status === 'clean').length || 0,
    dirty: housekeeping?.filter(h => h.status === 'dirty').length || 0,
    in_progress: housekeeping?.filter(h => h.status === 'in_progress').length || 0,
    inspected: housekeeping?.filter(h => h.status === 'inspected').length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Housekeeping</h2>
          <p className="text-muted-foreground">ბინების დალაგების სტატუსი</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              დამატება
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ახალი ჩანაწერი</DialogTitle>
              <DialogDescription>დაამატეთ ბინა housekeeping სიაში</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>აპარტამენტი</Label>
                  <Select
                    value={newItem.apartment_type}
                    onValueChange={(v) => setNewItem({ ...newItem, apartment_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="აირჩიეთ" />
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
                <div className="space-y-2">
                  <Label>ოთახის ნომერი</Label>
                  <Input
                    value={newItem.room_number}
                    onChange={(e) => setNewItem({ ...newItem, room_number: e.target.value })}
                    placeholder="მაგ: 2401"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>სტატუსი</Label>
                  <Select
                    value={newItem.status}
                    onValueChange={(v) => setNewItem({ ...newItem, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>პრიორიტეტი</Label>
                  <Select
                    value={newItem.priority}
                    onValueChange={(v) => setNewItem({ ...newItem, priority: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>პასუხისმგებელი</Label>
                <Input
                  value={newItem.assigned_to}
                  onChange={(e) => setNewItem({ ...newItem, assigned_to: e.target.value })}
                  placeholder="სახელი"
                />
              </div>
              <div className="space-y-2">
                <Label>შემდეგი Check-in</Label>
                <Input
                  type="date"
                  value={newItem.next_check_in}
                  onChange={(e) => setNewItem({ ...newItem, next_check_in: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>შენიშვნები</Label>
                <Textarea
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                  placeholder="დამატებითი ინფორმაცია..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>გაუქმება</Button>
              <Button onClick={() => addMutation.mutate(newItem)} disabled={addMutation.isPending}>
                {addMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                დამატება
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <Card key={key}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{config.label}</p>
                    <p className="text-3xl font-bold">{stats[key as keyof typeof stats]}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${config.color.includes('green') ? 'text-green-500' : config.color.includes('red') ? 'text-red-500' : config.color.includes('yellow') ? 'text-yellow-500' : 'text-blue-500'}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>ბინების სია</CardTitle>
          <CardDescription>დააწკაპუნეთ სტატუსის შესაცვლელად</CardDescription>
        </CardHeader>
        <CardContent>
          {housekeeping && housekeeping.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {housekeeping.map((item) => {
                const statusConfig = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.dirty;
                const priorityConfig = PRIORITY_CONFIG[item.priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.normal;
                const StatusIcon = statusConfig.icon;

                return (
                  <Card key={item.id} className="relative overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-1 ${statusConfig.color.split(' ')[0]}`} />
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">{item.apartment_type}</h4>
                          {item.room_number && (
                            <p className="text-sm text-muted-foreground">ოთახი: {item.room_number}</p>
                          )}
                        </div>
                        <Badge className={priorityConfig.color}>{priorityConfig.label}</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <StatusIcon className="h-4 w-4" />
                          <Select
                            value={item.status}
                            onValueChange={(v) => updateStatusMutation.mutate({ id: item.id, status: v })}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                <SelectItem key={key} value={key}>{config.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {item.assigned_to && (
                          <p className="text-sm"><span className="text-muted-foreground">პასუხისმგებელი:</span> {item.assigned_to}</p>
                        )}
                        
                        {item.next_check_in && (
                          <p className="text-sm flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Check-in: {format(new Date(item.next_check_in), 'd MMM', { locale: ka })}
                          </p>
                        )}

                        {item.last_cleaned_at && (
                          <p className="text-xs text-muted-foreground">
                            დალაგდა: {format(new Date(item.last_cleaned_at), 'd MMM, HH:mm', { locale: ka })}
                          </p>
                        )}

                        {item.notes && (
                          <p className="text-sm text-muted-foreground mt-2 border-t pt-2">{item.notes}</p>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-4 text-destructive"
                        onClick={() => deleteMutation.mutate(item.id)}
                      >
                        წაშლა
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>ჩანაწერები არ არის. დაამატეთ ბინები Housekeeping-ის სამართავად.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
