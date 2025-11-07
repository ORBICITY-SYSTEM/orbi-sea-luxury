import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export const AdminLoyaltyPoints = () => {
  const queryClient = useQueryClient();
  const [pointsToAdd, setPointsToAdd] = useState<{ [key: string]: number }>({});

  const { data: loyaltyData, isLoading } = useQuery({
    queryKey: ['admin-loyalty'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loyalty_points')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .order('points', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updatePointsMutation = useMutation({
    mutationFn: async ({ userId, points }: { userId: string; points: number }) => {
      const current = loyaltyData?.find(l => l.user_id === userId);
      if (!current) return;

      const newPoints = Math.max(0, current.points + points);
      const newTotalEarned = points > 0 ? current.total_earned + points : current.total_earned;
      const newTotalRedeemed = points < 0 ? current.total_redeemed + Math.abs(points) : current.total_redeemed;

      const { error } = await supabase
        .from('loyalty_points')
        .update({
          points: newPoints,
          total_earned: newTotalEarned,
          total_redeemed: newTotalRedeemed,
        })
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-loyalty'] });
      toast.success('ქულები განახლდა');
      setPointsToAdd({});
    },
    onError: (error) => {
      toast.error('შეცდომა: ' + error.message);
    },
  });

  const getTierBadge = (tier: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      bronze: 'outline',
      silver: 'secondary',
      gold: 'default',
    };
    return <Badge variant={variants[tier] || 'outline'}>{tier.toUpperCase()}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ლოიალობის ქულების მართვა</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>მომხმარებელი</TableHead>
                <TableHead>ქულები</TableHead>
                <TableHead>სულ დაგროვილი</TableHead>
                <TableHead>სულ გამოყენებული</TableHead>
                <TableHead>რანგი</TableHead>
                <TableHead>მოქმედებები</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loyaltyData?.map((loyalty) => (
                <TableRow key={loyalty.id}>
                  <TableCell>{(loyalty.profiles as any)?.full_name || '-'}</TableCell>
                  <TableCell>{loyalty.points}</TableCell>
                  <TableCell>{loyalty.total_earned}</TableCell>
                  <TableCell>{loyalty.total_redeemed}</TableCell>
                  <TableCell>{getTierBadge(loyalty.tier)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="ქულები"
                        className="w-24"
                        value={pointsToAdd[loyalty.user_id] || ''}
                        onChange={(e) =>
                          setPointsToAdd({
                            ...pointsToAdd,
                            [loyalty.user_id]: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                      <Button
                        size="sm"
                        onClick={() =>
                          updatePointsMutation.mutate({
                            userId: loyalty.user_id,
                            points: pointsToAdd[loyalty.user_id] || 0,
                          })
                        }
                        disabled={!pointsToAdd[loyalty.user_id] || updatePointsMutation.isPending}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          updatePointsMutation.mutate({
                            userId: loyalty.user_id,
                            points: -(pointsToAdd[loyalty.user_id] || 0),
                          })
                        }
                        disabled={!pointsToAdd[loyalty.user_id] || updatePointsMutation.isPending}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
