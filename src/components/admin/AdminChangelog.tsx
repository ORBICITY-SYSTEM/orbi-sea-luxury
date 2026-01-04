import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ka } from 'date-fns/locale';
import { Search, ArrowUpDown, Calendar, Tag, CheckCircle2, Plus, Edit, Trash2 } from 'lucide-react';

interface ChangelogEntry {
  id: string;
  title: string;
  description: string | null;
  change_type: string;
  labels: string[];
  change_date: string;
  created_at: string;
}

const labelConfig: Record<string, { label: string; color: string }> = {
  feature: { label: 'ფუნქცია', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  fix: { label: 'გასწორება', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  improvement: { label: 'გაუმჯობესება', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  integration: { label: 'ინტეგრაცია', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  ui: { label: 'UI/UX', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  backend: { label: 'Backend', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  security: { label: 'უსაფრთხოება', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  api: { label: 'API', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  database: { label: 'მონაცემთა ბაზა', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
};

export function AdminChangelog() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [labelFilter, setLabelFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ChangelogEntry | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    change_type: 'feature',
    labels: '',
    change_date: format(new Date(), 'yyyy-MM-dd'),
  });

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['changelog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('changelog')
        .select('*')
        .order('change_date', { ascending: false });
      if (error) throw error;
      return data as ChangelogEntry[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('changelog').insert({
        title: data.title,
        description: data.description || null,
        change_type: data.change_type,
        labels: data.labels.split(',').map(l => l.trim()).filter(Boolean),
        change_date: data.change_date,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['changelog'] });
      toast.success('ცვლილება დაემატა');
      resetForm();
      setIsDialogOpen(false);
    },
    onError: () => toast.error('შეცდომა დამატებისას'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from('changelog').update({
        title: data.title,
        description: data.description || null,
        change_type: data.change_type,
        labels: data.labels.split(',').map(l => l.trim()).filter(Boolean),
        change_date: data.change_date,
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['changelog'] });
      toast.success('ცვლილება განახლდა');
      resetForm();
      setIsDialogOpen(false);
    },
    onError: () => toast.error('შეცდომა განახლებისას'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('changelog').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['changelog'] });
      toast.success('ცვლილება წაიშალა');
    },
    onError: () => toast.error('შეცდომა წაშლისას'),
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      change_type: 'feature',
      labels: '',
      change_date: format(new Date(), 'yyyy-MM-dd'),
    });
    setEditingEntry(null);
  };

  const openEditDialog = (entry: ChangelogEntry) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title,
      description: entry.description || '',
      change_type: entry.change_type,
      labels: entry.labels?.join(', ') || '',
      change_date: entry.change_date,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('სათაური აუცილებელია');
      return;
    }
    if (editingEntry) {
      updateMutation.mutate({ id: editingEntry.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredData = useMemo(() => {
    let result = [...entries];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        entry =>
          entry.title.toLowerCase().includes(query) ||
          entry.description?.toLowerCase().includes(query) ||
          entry.labels?.some(l => l.toLowerCase().includes(query))
      );
    }
    if (labelFilter !== 'all') {
      result = result.filter(entry => entry.change_type === labelFilter);
    }
    result.sort((a, b) => {
      const dateA = new Date(a.change_date).getTime();
      const dateB = new Date(b.change_date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    return result;
  }, [entries, searchQuery, labelFilter, sortOrder]);

  const stats = useMemo(() => ({
    total: entries.length,
    features: entries.filter(e => e.change_type === 'feature').length,
    integrations: entries.filter(e => e.change_type === 'integration').length,
    ui: entries.filter(e => e.change_type === 'ui').length
  }), [entries]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ცვლილებების ისტორია</h1>
          <p className="text-muted-foreground mt-1">პროექტის განვითარების მართვა</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              ახალი ცვლილება
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingEntry ? 'ცვლილების რედაქტირება' : 'ახალი ცვლილების დამატება'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">სათაური *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="ცვლილების სათაური"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">აღწერა</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="დეტალური აღწერა"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ტიპი</Label>
                  <Select
                    value={formData.change_type}
                    onValueChange={(value) => setFormData({ ...formData, change_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(labelConfig).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">თარიღი</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.change_date}
                    onChange={(e) => setFormData({ ...formData, change_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="labels">ლეიბლები (მძიმით გამოყოფილი)</Label>
                <Input
                  id="labels"
                  value={formData.labels}
                  onChange={(e) => setFormData({ ...formData, labels: e.target.value })}
                  placeholder="admin, booking, ui"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingEntry ? 'განახლება' : 'დამატება'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>გაუქმება</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10"><CheckCircle2 className="h-5 w-5 text-primary" /></div><div><p className="text-2xl font-bold">{stats.total}</p><p className="text-xs text-muted-foreground">სულ ცვლილება</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-emerald-500/10"><Tag className="h-5 w-5 text-emerald-400" /></div><div><p className="text-2xl font-bold">{stats.features}</p><p className="text-xs text-muted-foreground">ახალი ფუნქცია</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-purple-500/10"><Tag className="h-5 w-5 text-purple-400" /></div><div><p className="text-2xl font-bold">{stats.integrations}</p><p className="text-xs text-muted-foreground">ინტეგრაცია</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/10"><Tag className="h-5 w-5 text-amber-400" /></div><div><p className="text-2xl font-bold">{stats.ui}</p><p className="text-xs text-muted-foreground">UI/UX</p></div></div></CardContent></Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="ძებნა..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select value={labelFilter} onValueChange={setLabelFilter}>
              <SelectTrigger className="w-full sm:w-[180px]"><Tag className="h-4 w-4 mr-2" /><SelectValue placeholder="ლეიბლი" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ყველა ტიპი</SelectItem>
                {Object.entries(labelConfig).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')} className="w-full sm:w-auto">
              <ArrowUpDown className="h-4 w-4 mr-2" />{sortOrder === 'newest' ? 'უახლესი' : 'უძველესი'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Changelog List */}
      <Card>
        <CardHeader>
          <CardTitle>ცვლილებები ({filteredData.length})</CardTitle>
          <CardDescription>თარიღების მიხედვით დალაგებული ცვლილებების სია</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">იტვირთება...</div>
          ) : (
            <div className="space-y-4">
              {filteredData.map((entry) => {
                const typeConfig = labelConfig[entry.change_type] || labelConfig.feature;
                return (
                  <div key={entry.id} className="group flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex-shrink-0 flex items-center gap-2 text-sm text-muted-foreground min-w-[100px]">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(entry.change_date), 'd MMM yyyy', { locale: ka })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">{entry.title}</h3>
                        <Badge variant="outline" className={typeConfig.color}>{typeConfig.label}</Badge>
                        {entry.labels?.map((label) => (
                          <Badge key={label} variant="secondary" className="text-xs">{label}</Badge>
                        ))}
                      </div>
                      {entry.description && <p className="text-sm text-muted-foreground mt-1">{entry.description}</p>}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" onClick={() => openEditDialog(entry)}><Edit className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => { if (confirm('წაშალოთ?')) deleteMutation.mutate(entry.id); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </div>
                );
              })}
              {filteredData.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>{entries.length === 0 ? 'ცვლილებები არ არის. დაამატეთ პირველი!' : 'შედეგები არ მოიძებნა'}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
