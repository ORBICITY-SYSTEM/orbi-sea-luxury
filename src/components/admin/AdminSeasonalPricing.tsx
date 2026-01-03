import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Loader2, Calendar, Copy } from 'lucide-react';

interface SeasonalPrice {
  id: string;
  apartment_type: string;
  month: number;
  year: number;
  price_per_night: number;
  is_active: boolean;
  created_at: string;
}

interface ApartmentPrice {
  apartment_type: string;
  name_en: string;
  name_ka: string;
  price_per_night: number;
}

const MONTHS = [
  { value: 1, name_en: 'January', name_ka: 'იანვარი' },
  { value: 2, name_en: 'February', name_ka: 'თებერვალი' },
  { value: 3, name_en: 'March', name_ka: 'მარტი' },
  { value: 4, name_en: 'April', name_ka: 'აპრილი' },
  { value: 5, name_en: 'May', name_ka: 'მაისი' },
  { value: 6, name_en: 'June', name_ka: 'ივნისი' },
  { value: 7, name_en: 'July', name_ka: 'ივლისი' },
  { value: 8, name_en: 'August', name_ka: 'აგვისტო' },
  { value: 9, name_en: 'September', name_ka: 'სექტემბერი' },
  { value: 10, name_en: 'October', name_ka: 'ოქტომბერი' },
  { value: 11, name_en: 'November', name_ka: 'ნოემბერი' },
  { value: 12, name_en: 'December', name_ka: 'დეკემბერი' },
];

export const AdminSeasonalPricing = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SeasonalPrice | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  
  const [formData, setFormData] = useState({
    apartment_type: '',
    month: 1,
    year: currentYear,
    price_per_night: 0,
  });

  // Fetch apartment types
  const { data: apartments } = useQuery({
    queryKey: ['apartment-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apartment_prices')
        .select('apartment_type, name_en, name_ka, price_per_night')
        .eq('is_active', true)
        .order('display_order');
      if (error) throw error;
      return data as ApartmentPrice[];
    },
  });

  // Fetch seasonal prices
  const { data: seasonalPrices, isLoading } = useQuery({
    queryKey: ['seasonal-prices', selectedYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seasonal_prices')
        .select('*')
        .eq('year', selectedYear)
        .order('apartment_type')
        .order('month');
      if (error) throw error;
      return data as SeasonalPrice[];
    },
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      if (data.id) {
        const { error } = await supabase
          .from('seasonal_prices')
          .update({
            apartment_type: data.apartment_type,
            month: data.month,
            year: data.year,
            price_per_night: data.price_per_night,
          })
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('seasonal_prices')
          .insert({
            apartment_type: data.apartment_type,
            month: data.month,
            year: data.year,
            price_per_night: data.price_per_night,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasonal-prices'] });
      toast({ title: 'ფასი შენახულია!' });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast({ 
          title: 'ეს ფასი უკვე არსებობს', 
          description: 'აირჩიეთ სხვა თვე ან ოთახის ტიპი',
          variant: 'destructive' 
        });
      } else {
        toast({ title: 'შეცდომა', description: String(error), variant: 'destructive' });
      }
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('seasonal_prices')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasonal-prices'] });
      toast({ title: 'წაშლილია!' });
    },
    onError: (error) => {
      toast({ title: 'შეცდომა', description: String(error), variant: 'destructive' });
    },
  });

  // Bulk copy from previous year
  const copyFromYear = useMutation({
    mutationFn: async (fromYear: number) => {
      const { data: previousPrices, error: fetchError } = await supabase
        .from('seasonal_prices')
        .select('apartment_type, month, price_per_night')
        .eq('year', fromYear);
      
      if (fetchError) throw fetchError;
      if (!previousPrices || previousPrices.length === 0) {
        throw new Error('წინა წლის ფასები ვერ მოიძებნა');
      }

      const newPrices = previousPrices.map(p => ({
        apartment_type: p.apartment_type,
        month: p.month,
        year: selectedYear,
        price_per_night: p.price_per_night,
      }));

      const { error: insertError } = await supabase
        .from('seasonal_prices')
        .upsert(newPrices, { onConflict: 'apartment_type,month,year' });
      
      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasonal-prices'] });
      toast({ title: 'ფასები დაკოპირდა!' });
    },
    onError: (error) => {
      toast({ title: 'შეცდომა', description: String(error), variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData({
      apartment_type: apartments?.[0]?.apartment_type || '',
      month: 1,
      year: selectedYear,
      price_per_night: 0,
    });
    setEditingItem(null);
  };

  const handleEdit = (item: SeasonalPrice) => {
    setEditingItem(item);
    setFormData({
      apartment_type: item.apartment_type,
      month: item.month,
      year: item.year,
      price_per_night: item.price_per_night,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.apartment_type || formData.price_per_night <= 0) {
      toast({ title: 'შეავსეთ ყველა ველი', variant: 'destructive' });
      return;
    }
    
    saveMutation.mutate({
      ...formData,
      id: editingItem?.id,
    });
  };

  // Get price for specific apartment and month
  const getPrice = (apartmentType: string, month: number) => {
    return seasonalPrices?.find(
      p => p.apartment_type === apartmentType && p.month === month
    );
  };

  // Get apartment name
  const getApartmentName = (type: string) => {
    return apartments?.find(a => a.apartment_type === type)?.name_ka || type;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          სეზონური ფასები
        </CardTitle>
        <div className="flex items-center gap-3">
          <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(Number(v))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={() => copyFromYear.mutate(selectedYear - 1)}
            disabled={copyFromYear.isPending}
          >
            {copyFromYear.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Copy className="w-4 h-4 mr-2" />}
            {selectedYear - 1} წლიდან კოპირება
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                ფასის დამატება
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'ფასის რედაქტირება' : 'ახალი ფასი'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>ოთახის ტიპი *</Label>
                  <Select 
                    value={formData.apartment_type} 
                    onValueChange={(v) => setFormData({ ...formData, apartment_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="აირჩიეთ..." />
                    </SelectTrigger>
                    <SelectContent>
                      {apartments?.map((apt) => (
                        <SelectItem key={apt.apartment_type} value={apt.apartment_type}>
                          {apt.name_ka} (საბაზისო: {apt.price_per_night} GEL)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>თვე *</Label>
                    <Select 
                      value={formData.month.toString()} 
                      onValueChange={(v) => setFormData({ ...formData, month: Number(v) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((m) => (
                          <SelectItem key={m.value} value={m.value.toString()}>
                            {m.name_ka}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>წელი *</Label>
                    <Select 
                      value={formData.year.toString()} 
                      onValueChange={(v) => setFormData({ ...formData, year: Number(v) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>ფასი (GEL/ღამე) *</Label>
                  <Input
                    type="number"
                    value={formData.price_per_night}
                    onChange={(e) => setFormData({ ...formData, price_per_night: Number(e.target.value) })}
                    min={0}
                  />
                </div>

                <Button 
                  onClick={handleSubmit} 
                  className="w-full"
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  შენახვა
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="table" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="table">ცხრილი</TabsTrigger>
            <TabsTrigger value="matrix">მატრიცა</TabsTrigger>
          </TabsList>

          <TabsContent value="table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ოთახი</TableHead>
                  <TableHead>თვე</TableHead>
                  <TableHead>წელი</TableHead>
                  <TableHead>ფასი/ღამე</TableHead>
                  <TableHead className="text-right">მოქმედებები</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seasonalPrices?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {selectedYear} წლისთვის ფასები არ არის დამატებული
                    </TableCell>
                  </TableRow>
                ) : (
                  seasonalPrices?.map((price) => (
                    <TableRow key={price.id}>
                      <TableCell>{getApartmentName(price.apartment_type)}</TableCell>
                      <TableCell>{MONTHS.find(m => m.value === price.month)?.name_ka}</TableCell>
                      <TableCell>{price.year}</TableCell>
                      <TableCell className="font-semibold text-primary">{price.price_per_night} GEL</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(price)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              if (confirm('წავშალოთ?')) deleteMutation.mutate(price.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="matrix">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-background">ოთახი</TableHead>
                    {MONTHS.map(m => (
                      <TableHead key={m.value} className="text-center min-w-[80px]">
                        {m.name_ka.slice(0, 3)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apartments?.map((apt) => (
                    <TableRow key={apt.apartment_type}>
                      <TableCell className="sticky left-0 bg-background font-medium">
                        {apt.name_ka}
                        <div className="text-xs text-muted-foreground">საბაზისო: {apt.price_per_night} GEL</div>
                      </TableCell>
                      {MONTHS.map(m => {
                        const price = getPrice(apt.apartment_type, m.value);
                        return (
                          <TableCell 
                            key={m.value} 
                            className={`text-center cursor-pointer hover:bg-muted transition-colors ${
                              price ? 'text-primary font-semibold' : 'text-muted-foreground'
                            }`}
                            onClick={() => {
                              if (price) {
                                handleEdit(price);
                              } else {
                                setFormData({
                                  apartment_type: apt.apartment_type,
                                  month: m.value,
                                  year: selectedYear,
                                  price_per_night: apt.price_per_night,
                                });
                                setIsDialogOpen(true);
                              }
                            }}
                          >
                            {price ? `${price.price_per_night}` : '-'}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              * დააკლიკეთ უჯრაზე ფასის დასამატებლად ან შესაცვლელად
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
