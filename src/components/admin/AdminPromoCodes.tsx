import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Pencil, Trash2, Copy } from 'lucide-react';
import { format } from 'date-fns';

const promoCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, 'Code must be at least 3 characters')
    .max(50, 'Code must be less than 50 characters')
    .regex(/^[A-Z0-9_-]+$/, 'Code must contain only uppercase letters, numbers, hyphens, and underscores'),
  discount_percentage: z
    .number()
    .min(1, 'Discount must be at least 1%')
    .max(100, 'Discount cannot exceed 100%'),
  valid_from: z.string().min(1, 'Start date is required'),
  valid_until: z.string().optional(),
  max_uses: z.number().optional(),
  min_nights: z.number().min(1, 'Minimum nights must be at least 1').optional(),
  is_active: z.boolean(),
}).refine((data) => {
  if (data.valid_until && data.valid_from) {
    return new Date(data.valid_until) > new Date(data.valid_from);
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['valid_until'],
});

type PromoCodeFormData = z.infer<typeof promoCodeSchema>;

interface PromoCode {
  id: string;
  code: string;
  discount_percentage: number;
  valid_from: string;
  valid_until: string | null;
  max_uses: number | null;
  current_uses: number;
  min_nights: number | null;
  is_active: boolean;
  created_at: string;
}

export const AdminPromoCodes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState<PromoCode | null>(null);

  const form = useForm<PromoCodeFormData>({
    resolver: zodResolver(promoCodeSchema),
    defaultValues: {
      code: '',
      discount_percentage: 10,
      valid_from: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
      valid_until: '',
      max_uses: undefined,
      min_nights: 1,
      is_active: true,
    },
  });

  const { data: promoCodes, isLoading } = useQuery({
    queryKey: ['admin-promo-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PromoCode[];
    },
  });

  const createPromoCode = useMutation({
    mutationFn: async (data: PromoCodeFormData) => {
      const { error } = await supabase.from('promo_codes').insert([
        {
          code: data.code,
          discount_percentage: data.discount_percentage,
          valid_from: data.valid_from,
          valid_until: data.valid_until || null,
          max_uses: data.max_uses || null,
          min_nights: data.min_nights || 1,
          is_active: data.is_active,
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promo-codes'] });
      toast({
        title: 'პრომო კოდი შეიქმნა',
        description: 'პრომო კოდი წარმატებით დაემატა',
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'შეცდომა',
        description: error.message || 'პრომო კოდის შექმნა ვერ მოხერხდა',
        variant: 'destructive',
      });
    },
  });

  const updatePromoCode = useMutation({
    mutationFn: async (data: PromoCodeFormData) => {
      if (!editingPromoCode) return;

      const { error } = await supabase
        .from('promo_codes')
        .update({
          code: data.code,
          discount_percentage: data.discount_percentage,
          valid_from: data.valid_from,
          valid_until: data.valid_until || null,
          max_uses: data.max_uses || null,
          min_nights: data.min_nights || 1,
          is_active: data.is_active,
        })
        .eq('id', editingPromoCode.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promo-codes'] });
      toast({
        title: 'პრომო კოდი განახლდა',
        description: 'ცვლილებები წარმატებით შეინახა',
      });
      setIsDialogOpen(false);
      setEditingPromoCode(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'შეცდომა',
        description: error.message || 'პრომო კოდის განახლება ვერ მოხერხდა',
        variant: 'destructive',
      });
    },
  });

  const deletePromoCode = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('promo_codes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promo-codes'] });
      toast({
        title: 'პრომო კოდი წაიშალა',
        description: 'პრომო კოდი წარმატებით წაიშალა',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'შეცდომა',
        description: error.message || 'პრომო კოდის წაშლა ვერ მოხერხდა',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: PromoCodeFormData) => {
    if (editingPromoCode) {
      updatePromoCode.mutate(data);
    } else {
      createPromoCode.mutate(data);
    }
  };

  const handleEdit = (promoCode: PromoCode) => {
    setEditingPromoCode(promoCode);
    form.reset({
      code: promoCode.code,
      discount_percentage: promoCode.discount_percentage,
      valid_from: format(new Date(promoCode.valid_from), 'yyyy-MM-dd\'T\'HH:mm'),
      valid_until: promoCode.valid_until
        ? format(new Date(promoCode.valid_until), 'yyyy-MM-dd\'T\'HH:mm')
        : '',
      max_uses: promoCode.max_uses || undefined,
      min_nights: promoCode.min_nights || 1,
      is_active: promoCode.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingPromoCode(null);
    form.reset({
      code: '',
      discount_percentage: 10,
      valid_from: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
      valid_until: '',
      max_uses: undefined,
      min_nights: 1,
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'დაკოპირდა',
      description: `კოდი "${code}" დაკოპირდა`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>პრომო კოდები</CardTitle>
            <CardDescription>შექმენით და მართეთ პრომო კოდები</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <Plus className="mr-2 h-4 w-4" />
                ახალი პრომო კოდი
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPromoCode ? 'პრომო კოდის რედაქტირება' : 'ახალი პრომო კოდი'}
                </DialogTitle>
                <DialogDescription>
                  შეავსეთ ველები პრომო კოდის {editingPromoCode ? 'განახლებისთვის' : 'შესაქმნელად'}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>პრომო კოდი *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="SUMMER2024"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          />
                        </FormControl>
                        <FormDescription>
                          მხოლოდ დიდი ასოები, ციფრები, - და _
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discount_percentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ფასდაკლება (%) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={100}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="valid_from"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>მოქმედების დაწყება *</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="valid_until"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>მოქმედების დასრულება</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormDescription>არასავალდებულო</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="max_uses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>მაქს. გამოყენება</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              placeholder="შეუზღუდავი"
                              {...field}
                              value={field.value || ''}
                              onChange={(e) =>
                                field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                              }
                            />
                          </FormControl>
                          <FormDescription>არასავალდებულო</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="min_nights"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>მინ. ღამეები</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              {...field}
                              value={field.value || ''}
                              onChange={(e) =>
                                field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                              }
                            />
                          </FormControl>
                          <FormDescription>არასავალდებულო</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">აქტიური</FormLabel>
                          <FormDescription>
                            აქტიური პრომო კოდები ხელმისაწვდომია გამოსაყენებლად
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setEditingPromoCode(null);
                        form.reset();
                      }}
                    >
                      გაუქმება
                    </Button>
                    <Button
                      type="submit"
                      disabled={createPromoCode.isPending || updatePromoCode.isPending}
                    >
                      {(createPromoCode.isPending || updatePromoCode.isPending) && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {editingPromoCode ? 'განახლება' : 'შექმნა'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {!promoCodes || promoCodes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            პრომო კოდები არ არის. შექმენით პირველი!
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>კოდი</TableHead>
                <TableHead>ფასდაკლება</TableHead>
                <TableHead>მოქმედი</TableHead>
                <TableHead>გამოყენება</TableHead>
                <TableHead>მინ. ღამეები</TableHead>
                <TableHead>სტატუსი</TableHead>
                <TableHead className="text-right">მოქმედებები</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promoCodes.map((promoCode) => {
                const now = new Date();
                const validFrom = new Date(promoCode.valid_from);
                const validUntil = promoCode.valid_until ? new Date(promoCode.valid_until) : null;
                const isExpired = validUntil && validUntil < now;
                const isNotYetActive = validFrom > now;
                const isMaxUsesReached =
                  promoCode.max_uses !== null && promoCode.current_uses >= promoCode.max_uses;

                return (
                  <TableRow key={promoCode.id}>
                    <TableCell className="font-mono font-bold">
                      <div className="flex items-center gap-2">
                        {promoCode.code}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(promoCode.code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{promoCode.discount_percentage}%</TableCell>
                    <TableCell className="text-sm">
                      <div>{format(new Date(promoCode.valid_from), 'dd/MM/yyyy HH:mm')}</div>
                      {promoCode.valid_until && (
                        <div className="text-muted-foreground">
                          - {format(new Date(promoCode.valid_until), 'dd/MM/yyyy HH:mm')}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {promoCode.current_uses}
                      {promoCode.max_uses && ` / ${promoCode.max_uses}`}
                    </TableCell>
                    <TableCell>{promoCode.min_nights || '-'}</TableCell>
                    <TableCell>
                      {!promoCode.is_active ? (
                        <Badge variant="secondary">გამორთული</Badge>
                      ) : isExpired ? (
                        <Badge variant="destructive">ვადაგასული</Badge>
                      ) : isNotYetActive ? (
                        <Badge variant="outline">მალე აქტიური</Badge>
                      ) : isMaxUsesReached ? (
                        <Badge variant="destructive">ამოწურული</Badge>
                      ) : (
                        <Badge className="bg-green-500">აქტიური</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(promoCode)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (
                              confirm(
                                `დარწმუნებული ხართ რომ გსურთ პრომო კოდის "${promoCode.code}" წაშლა?`
                              )
                            ) {
                              deletePromoCode.mutate(promoCode.id);
                            }
                          }}
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
        )}
      </CardContent>
    </Card>
  );
};
