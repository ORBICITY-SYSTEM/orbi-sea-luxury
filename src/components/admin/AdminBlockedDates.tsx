import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Trash2, Loader2 } from 'lucide-react';
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

interface BlockedDate {
  id: string;
  apartment_type: string;
  start_date: string;
  end_date: string;
  reason: string | null;
  created_at: string;
}

export function AdminBlockedDates() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
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
      const { error } = await supabase.from('blocked_dates').insert([block]);
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            დაბლოკილი თარიღები
          </CardTitle>
          <CardDescription>ჯავშანი ამ თარიღებში მიუწვდომელია</CardDescription>
        </CardHeader>
        <CardContent>
          {blockedDates && blockedDates.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>აპარტამენტი</TableHead>
                  <TableHead>დაწყება</TableHead>
                  <TableHead>დასრულება</TableHead>
                  <TableHead>მიზეზი</TableHead>
                  <TableHead className="text-right">მოქმედება</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blockedDates.map((block) => (
                  <TableRow key={block.id}>
                    <TableCell>
                      <Badge variant="outline">{block.apartment_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(block.start_date), 'd MMM yyyy', { locale: ka })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(block.end_date), 'd MMM yyyy', { locale: ka })}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {block.reason || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(block.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>დაბლოკილი თარიღები არ არის</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
