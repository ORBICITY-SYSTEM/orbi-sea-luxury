import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Plus, RefreshCw, Link2, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
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

interface ChannelIntegration {
  id: string;
  channel_name: string;
  apartment_type: string;
  ical_url: string | null;
  is_active: boolean;
  last_synced_at: string | null;
  sync_errors: string | null;
}

const CHANNEL_CONFIG: Record<string, { name: string; color: string; logo: string }> = {
  booking_com: { name: 'Booking.com', color: 'bg-blue-600', logo: 'B' },
  airbnb: { name: 'Airbnb', color: 'bg-red-500', logo: 'A' },
  expedia: { name: 'Expedia', color: 'bg-yellow-500', logo: 'E' },
  vrbo: { name: 'VRBO', color: 'bg-purple-500', logo: 'V' },
  other: { name: 'სხვა', color: 'bg-gray-500', logo: '?' },
};

export function AdminChannelManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newIntegration, setNewIntegration] = useState({
    channel_name: '',
    apartment_type: '',
    ical_url: '',
  });

  const { data: integrations, isLoading } = useQuery({
    queryKey: ['channel-integrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('channel_integrations')
        .select('*')
        .order('channel_name');
      if (error) throw error;
      return data as ChannelIntegration[];
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
    mutationFn: async (integration: typeof newIntegration) => {
      const { error } = await supabase.from('channel_integrations').insert([{
        ...integration,
        ical_url: integration.ical_url || null,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channel-integrations'] });
      toast({ title: 'წარმატება', description: 'ინტეგრაცია დაემატა' });
      setIsAddOpen(false);
      setNewIntegration({ channel_name: '', apartment_type: '', ical_url: '' });
    },
    onError: () => {
      toast({ title: 'შეცდომა', variant: 'destructive' });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('channel_integrations')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channel-integrations'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('channel_integrations').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channel-integrations'] });
      toast({ title: 'ინტეგრაცია წაიშალა' });
    },
  });

  const syncMutation = useMutation({
    mutationFn: async (integration: ChannelIntegration) => {
      if (!integration.ical_url) {
        throw new Error('iCal URL არ არის მითითებული');
      }

      // Call the edge function to sync iCal
      const { data, error } = await supabase.functions.invoke('sync-ical', {
        body: { integration_id: integration.id },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'სინქრონიზაცია ვერ მოხერხდა');
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['channel-integrations'] });
      queryClient.invalidateQueries({ queryKey: ['blocked-dates'] });
      toast({ 
        title: 'სინქრონიზაცია წარმატებულია', 
        description: `${data.added} ახალი დაბლოკილი თარიღი დაემატა (${data.future_events} ჯავშანი ნაპოვნია)` 
      });
    },
    onError: (error: Error) => {
      queryClient.invalidateQueries({ queryKey: ['channel-integrations'] });
      toast({ title: 'სინქრონიზაციის შეცდომა', description: error.message, variant: 'destructive' });
    },
  });

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
          <h2 className="text-3xl font-bold">Channel Manager</h2>
          <p className="text-muted-foreground">Booking.com, Airbnb და სხვა პლატფორმების iCal სინქრონიზაცია</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              ახალი ინტეგრაცია
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ახალი Channel ინტეგრაცია</DialogTitle>
              <DialogDescription>
                დაამატეთ iCal URL სხვა პლატფორმებიდან ჯავშნების იმპორტისთვის
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>პლატფორმა</Label>
                <Select
                  value={newIntegration.channel_name}
                  onValueChange={(v) => setNewIntegration({ ...newIntegration, channel_name: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="აირჩიეთ პლატფორმა" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CHANNEL_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>აპარტამენტი</Label>
                <Select
                  value={newIntegration.apartment_type}
                  onValueChange={(v) => setNewIntegration({ ...newIntegration, apartment_type: v })}
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
              <div className="space-y-2">
                <Label>iCal URL</Label>
                <Input
                  value={newIntegration.ical_url}
                  onChange={(e) => setNewIntegration({ ...newIntegration, ical_url: e.target.value })}
                  placeholder="https://www.airbnb.com/calendar/ical/..."
                />
                <p className="text-sm text-muted-foreground">
                  iCal URL-ს იპოვით თქვენი პროფილის კალენდრის პარამეტრებში
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>გაუქმება</Button>
              <Button 
                onClick={() => addMutation.mutate(newIntegration)} 
                disabled={addMutation.isPending || !newIntegration.channel_name || !newIntegration.apartment_type}
              >
                {addMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                დამატება
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Card */}
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Link2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold">როგორ მუშაობს?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Channel Manager აკავშირებს Booking.com, Airbnb და სხვა პლატფორმების კალენდრებს iCal-ით. 
                სინქრონიზაციის შემდეგ, სხვა პლატფორმებზე არსებული ჯავშნები ავტომატურად იმპორტირდება 
                და თქვენს კალენდარში დაბლოკილი თარიღებად გამოჩნდება.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrations Table */}
      <Card>
        <CardHeader>
          <CardTitle>აქტიური ინტეგრაციები</CardTitle>
          <CardDescription>დაკავშირებული პლატფორმები და მათი სტატუსი</CardDescription>
        </CardHeader>
        <CardContent>
          {integrations && integrations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>პლატფორმა</TableHead>
                  <TableHead>აპარტამენტი</TableHead>
                  <TableHead>ბოლო სინქრო</TableHead>
                  <TableHead>სტატუსი</TableHead>
                  <TableHead>აქტიური</TableHead>
                  <TableHead className="text-right">მოქმედება</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {integrations.map((integration) => {
                  const channelConfig = CHANNEL_CONFIG[integration.channel_name] || CHANNEL_CONFIG.other;
                  return (
                    <TableRow key={integration.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`h-8 w-8 rounded-full ${channelConfig.color} flex items-center justify-center text-white font-bold text-sm`}>
                            {channelConfig.logo}
                          </div>
                          <span className="font-medium">{channelConfig.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{integration.apartment_type}</Badge>
                      </TableCell>
                      <TableCell>
                        {integration.last_synced_at ? (
                          <span className="text-sm">
                            {format(new Date(integration.last_synced_at), 'd MMM, HH:mm', { locale: ka })}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">არასდროს</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {integration.sync_errors ? (
                          <div className="flex items-center gap-1 text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm">შეცდომა</span>
                          </div>
                        ) : integration.last_synced_at ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-sm">OK</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">მოლოდინში</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={integration.is_active}
                          onCheckedChange={(checked) => toggleMutation.mutate({ id: integration.id, is_active: checked })}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => syncMutation.mutate(integration)}
                            disabled={syncMutation.isPending || !integration.ical_url}
                          >
                            {syncMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <RefreshCw className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMutation.mutate(integration.id)}
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
              <Link2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>ინტეგრაციები არ არის დამატებული</p>
              <p className="text-sm mt-1">დაამატეთ Booking.com ან Airbnb iCal URL სინქრონიზაციისთვის</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
