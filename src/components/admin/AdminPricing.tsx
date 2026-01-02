import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Loader2, DollarSign } from 'lucide-react';

interface ApartmentPrice {
  id: string;
  apartment_type: string;
  name_en: string;
  name_ka: string;
  description_en: string | null;
  description_ka: string | null;
  price_per_night: number;
  max_guests: number;
  size_sqm: number | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
}

export const AdminPricing = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ApartmentPrice | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    apartment_type: '',
    name_en: '',
    name_ka: '',
    description_en: '',
    description_ka: '',
    price_per_night: 0,
    max_guests: 2,
    size_sqm: 0,
    image_url: '',
    is_active: true,
    display_order: 0,
  });

  // Fetch prices
  const { data: prices, isLoading } = useQuery({
    queryKey: ['admin-apartment-prices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apartment_prices')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data as ApartmentPrice[];
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      if (data.id) {
        const { error } = await supabase
          .from('apartment_prices')
          .update({
            apartment_type: data.apartment_type,
            name_en: data.name_en,
            name_ka: data.name_ka,
            description_en: data.description_en || null,
            description_ka: data.description_ka || null,
            price_per_night: data.price_per_night,
            max_guests: data.max_guests,
            size_sqm: data.size_sqm || null,
            image_url: data.image_url || null,
            is_active: data.is_active,
            display_order: data.display_order,
          })
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('apartment_prices')
          .insert({
            apartment_type: data.apartment_type,
            name_en: data.name_en,
            name_ka: data.name_ka,
            description_en: data.description_en || null,
            description_ka: data.description_ka || null,
            price_per_night: data.price_per_night,
            max_guests: data.max_guests,
            size_sqm: data.size_sqm || null,
            image_url: data.image_url || null,
            is_active: data.is_active,
            display_order: data.display_order,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-apartment-prices'] });
      toast({ title: 'ფასი შენახულია!' });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'შეცდომა', description: String(error), variant: 'destructive' });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('apartment_prices')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-apartment-prices'] });
      toast({ title: 'წაშლილია!' });
    },
    onError: (error) => {
      toast({ title: 'შეცდომა', description: String(error), variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData({
      apartment_type: '',
      name_en: '',
      name_ka: '',
      description_en: '',
      description_ka: '',
      price_per_night: 0,
      max_guests: 2,
      size_sqm: 0,
      image_url: '',
      is_active: true,
      display_order: 0,
    });
    setEditingItem(null);
  };

  const handleEdit = (item: ApartmentPrice) => {
    setEditingItem(item);
    setFormData({
      apartment_type: item.apartment_type,
      name_en: item.name_en,
      name_ka: item.name_ka,
      description_en: item.description_en || '',
      description_ka: item.description_ka || '',
      price_per_night: item.price_per_night,
      max_guests: item.max_guests,
      size_sqm: item.size_sqm || 0,
      image_url: item.image_url || '',
      is_active: item.is_active,
      display_order: item.display_order,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.apartment_type || !formData.name_en || !formData.name_ka || formData.price_per_night <= 0) {
      toast({ title: 'შეავსეთ სავალდებულო ველები', variant: 'destructive' });
      return;
    }
    
    saveMutation.mutate({
      ...formData,
      id: editingItem?.id,
    });
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          ოთახების ფასები
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              ახალი ოთახი
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'რედაქტირება' : 'ახალი ოთახის ტიპი'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ტიპი (slug) *</Label>
                  <Input
                    value={formData.apartment_type}
                    onChange={(e) => setFormData({ ...formData, apartment_type: e.target.value })}
                    placeholder="studio, one_bedroom..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>ფასი (GEL/ღამე) *</Label>
                  <Input
                    type="number"
                    value={formData.price_per_night}
                    onChange={(e) => setFormData({ ...formData, price_per_night: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>სახელი (EN) *</Label>
                  <Input
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    placeholder="Studio Apartment"
                  />
                </div>
                <div className="space-y-2">
                  <Label>სახელი (KA) *</Label>
                  <Input
                    value={formData.name_ka}
                    onChange={(e) => setFormData({ ...formData, name_ka: e.target.value })}
                    placeholder="სტუდიო აპარტამენტი"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>აღწერა (EN)</Label>
                  <Textarea
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>აღწერა (KA)</Label>
                  <Textarea
                    value={formData.description_ka}
                    onChange={(e) => setFormData({ ...formData, description_ka: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>მაქს. სტუმრები</Label>
                  <Input
                    type="number"
                    value={formData.max_guests}
                    onChange={(e) => setFormData({ ...formData, max_guests: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ფართი (m²)</Label>
                  <Input
                    type="number"
                    value={formData.size_sqm}
                    onChange={(e) => setFormData({ ...formData, size_sqm: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>რიგი</Label>
                  <Input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>სურათის URL</Label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>აქტიური</Label>
              </div>

              <Button 
                onClick={handleSubmit} 
                className="w-full"
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                შენახვა
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ტიპი</TableHead>
              <TableHead>სახელი (KA)</TableHead>
              <TableHead>ფასი/ღამე</TableHead>
              <TableHead>სტუმრები</TableHead>
              <TableHead>სტატუსი</TableHead>
              <TableHead className="text-right">მოქმედებები</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prices?.map((price) => (
              <TableRow key={price.id}>
                <TableCell className="font-mono text-sm">{price.apartment_type}</TableCell>
                <TableCell>{price.name_ka}</TableCell>
                <TableCell className="font-semibold text-primary">{price.price_per_night} GEL</TableCell>
                <TableCell>{price.max_guests}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    price.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {price.is_active ? 'აქტიური' : 'არააქტიური'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(price)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm('წავშალოთ?')) {
                          deleteMutation.mutate(price.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};