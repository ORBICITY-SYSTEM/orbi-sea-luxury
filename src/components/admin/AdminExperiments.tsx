import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Trash2, Edit, BarChart3, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const variantSchema = z.object({
  name: z.string().min(1, 'სახელი აუცილებელია'),
  weight: z.number().min(0).max(100, 'წონა უნდა იყოს 0-100 შორის'),
});

const experimentSchema = z.object({
  name: z.string().min(1, 'სახელი აუცილებელია').max(100),
  description: z.string().max(500).optional(),
  traffic_allocation: z.number().min(0).max(1),
  variants: z.array(variantSchema).min(2, 'მინიმუმ 2 ვარიანტი აუცილებელია'),
});

type ExperimentFormData = z.infer<typeof experimentSchema>;

interface Variant {
  name: string;
  weight: number;
}

export function AdminExperiments() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperiment, setEditingExperiment] = useState<any>(null);
  const [selectedExperimentId, setSelectedExperimentId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: experiments, isLoading } = useQuery({
    queryKey: ['admin-experiments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experiments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: experimentStats } = useQuery({
    queryKey: ['experiment-stats', selectedExperimentId],
    enabled: !!selectedExperimentId,
    queryFn: async () => {
      if (!selectedExperimentId) return null;

      const { data: assignments, error: assignmentsError } = await supabase
        .from('experiment_assignments')
        .select('variant_name')
        .eq('experiment_id', selectedExperimentId);

      if (assignmentsError) throw assignmentsError;

      const { data: events, error: eventsError } = await supabase
        .from('experiment_events')
        .select('event_name, assignment_id')
        .eq('experiment_id', selectedExperimentId);

      if (eventsError) throw eventsError;

      // Calculate stats by variant
      const variantStats: Record<string, { total: number; conversions: number }> = {};
      
      assignments?.forEach((assignment) => {
        if (!variantStats[assignment.variant_name]) {
          variantStats[assignment.variant_name] = { total: 0, conversions: 0 };
        }
        variantStats[assignment.variant_name].total++;
      });

      events?.forEach((event) => {
        const assignment = assignments?.find((a: any) => a.id === event.assignment_id);
        if (assignment && event.event_name === 'conversion') {
          variantStats[assignment.variant_name].conversions++;
        }
      });

      return variantStats;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ExperimentFormData) => {
      const { error } = await supabase.from('experiments').insert({
        name: data.name,
        description: data.description || null,
        traffic_allocation: data.traffic_allocation,
        variants: data.variants,
        is_active: false,
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiments'] });
      toast.success('ექსპერიმენტი შექმნილია');
      setIsDialogOpen(false);
      setEditingExperiment(null);
    },
    onError: (error: any) => {
      toast.error('შეცდომა: ' + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ExperimentFormData> }) => {
      const { error } = await supabase
        .from('experiments')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiments'] });
      toast.success('ექსპერიმენტი განახლდა');
      setIsDialogOpen(false);
      setEditingExperiment(null);
    },
    onError: (error: any) => {
      toast.error('შეცდომა: ' + error.message);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('experiments')
        .update({ is_active })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiments'] });
      toast.success('სტატუსი შეიცვალა');
    },
    onError: (error: any) => {
      toast.error('შეცდომა: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('experiments').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiments'] });
      toast.success('ექსპერიმენტი წაიშალა');
    },
    onError: (error: any) => {
      toast.error('შეცდომა: ' + error.message);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">A/B Testing</h2>
          <p className="text-muted-foreground">მართეთ ექსპერიმენტები და გაანალიზეთ შედეგები</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingExperiment(null)}>
              <Plus className="h-4 w-4 mr-2" />
              ახალი ექსპერიმენტი
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingExperiment ? 'ექსპერიმენტის რედაქტირება' : 'ახალი ექსპერიმენტი'}
              </DialogTitle>
            </DialogHeader>
            <ExperimentForm
              experiment={editingExperiment}
              onSubmit={(data) => {
                if (editingExperiment) {
                  updateMutation.mutate({ id: editingExperiment.id, data });
                } else {
                  createMutation.mutate(data);
                }
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">ექსპერიმენტები</TabsTrigger>
          <TabsTrigger value="analytics" disabled={!selectedExperimentId}>
            ანალიტიკა
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ექსპერიმენტების სია</CardTitle>
              <CardDescription>ყველა A/B ტესტის მართვა</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div>იტვირთება...</div>
              ) : experiments && experiments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>სახელი</TableHead>
                      <TableHead>აღწერა</TableHead>
                      <TableHead>ვარიანტები</TableHead>
                      <TableHead>ტრაფიკი</TableHead>
                      <TableHead>სტატუსი</TableHead>
                      <TableHead>მოქმედებები</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {experiments.map((experiment) => (
                      <TableRow key={experiment.id}>
                        <TableCell className="font-medium">{experiment.name}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {experiment.description || '-'}
                        </TableCell>
                        <TableCell>
                          {(experiment.variants as unknown as Variant[])?.map((v: Variant) => (
                            <Badge key={v.name} variant="outline" className="mr-1">
                              {v.name} ({v.weight}%)
                            </Badge>
                          ))}
                        </TableCell>
                        <TableCell>{(experiment.traffic_allocation * 100).toFixed(0)}%</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={experiment.is_active}
                              onCheckedChange={(checked) =>
                                toggleActiveMutation.mutate({
                                  id: experiment.id,
                                  is_active: checked,
                                })
                              }
                            />
                            <Badge variant={experiment.is_active ? 'default' : 'secondary'}>
                              {experiment.is_active ? 'აქტიური' : 'არააქტიური'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedExperimentId(experiment.id)}
                            >
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingExperiment(experiment);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                if (confirm('დარწმუნებული ხართ?')) {
                                  deleteMutation.mutate(experiment.id);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  ექსპერიმენტები ჯერ არ არის შექმნილი
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          {selectedExperimentId && experimentStats && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>ანალიტიკა</CardTitle>
                    <CardDescription>ექსპერიმენტის შედეგები</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedExperimentId(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {Object.entries(experimentStats).map(([variant, stats]) => {
                    const conversionRate =
                      stats.total > 0 ? (stats.conversions / stats.total) * 100 : 0;
                    return (
                      <Card key={variant}>
                        <CardHeader>
                          <CardTitle className="text-lg">{variant}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">მონაწილეები</p>
                              <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">კონვერსიები</p>
                              <p className="text-2xl font-bold">{stats.conversions}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">კონვერსიის მაჩვენებელი</p>
                              <p className="text-2xl font-bold">{conversionRate.toFixed(2)}%</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ExperimentForm({
  experiment,
  onSubmit,
}: {
  experiment?: any;
  onSubmit: (data: ExperimentFormData) => void;
}) {
  const [variants, setVariants] = useState<Variant[]>(
    experiment?.variants || [
      { name: 'Control', weight: 50 },
      { name: 'Variant A', weight: 50 },
    ]
  );

  const form = useForm<ExperimentFormData>({
    resolver: zodResolver(experimentSchema),
    defaultValues: {
      name: experiment?.name || '',
      description: experiment?.description || '',
      traffic_allocation: experiment?.traffic_allocation || 1,
      variants: experiment?.variants || variants,
    },
  });

  const addVariant = () => {
    setVariants([...variants, { name: `Variant ${String.fromCharCode(65 + variants.length - 1)}`, weight: 0 }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 2) {
      const newVariants = variants.filter((_, i) => i !== index);
      setVariants(newVariants);
      form.setValue('variants', newVariants);
    }
  };

  const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
    form.setValue('variants', newVariants);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>სახელი</FormLabel>
              <FormControl>
                <Input {...field} placeholder="ექსპერიმენტის სახელი" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>აღწერა</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="ექსპერიმენტის აღწერა" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="traffic_allocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ტრაფიკის განაწილება (0-1)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>ვარიანტები</Label>
            <Button type="button" variant="outline" size="sm" onClick={addVariant}>
              <Plus className="h-4 w-4 mr-2" />
              დამატება
            </Button>
          </div>

          {variants.map((variant, index) => (
            <div key={index} className="flex items-center gap-2 p-4 border rounded-lg">
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="ვარიანტის სახელი"
                  value={variant.name}
                  onChange={(e) => updateVariant(index, 'name', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="წონა (%)"
                  min="0"
                  max="100"
                  value={variant.weight}
                  onChange={(e) => updateVariant(index, 'weight', parseInt(e.target.value) || 0)}
                />
              </div>
              {variants.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVariant(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button type="submit" className="w-full">
          {experiment ? 'განახლება' : 'შექმნა'}
        </Button>
      </form>
    </Form>
  );
}
