import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, StickyNote, Star, AlertTriangle, Lock } from 'lucide-react';
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

interface BookingNote {
  id: string;
  booking_id: string;
  note: string;
  note_type: string;
  created_at: string;
}

interface AdminBookingNotesProps {
  bookingId: string;
  notes?: BookingNote[];
  onNotesChange?: () => void;
}

const NOTE_TYPES = {
  general: { label: 'ზოგადი', icon: StickyNote, color: 'bg-gray-100 text-gray-800' },
  vip: { label: 'VIP', icon: Star, color: 'bg-yellow-100 text-yellow-800' },
  special_request: { label: 'სპეც. მოთხოვნა', icon: AlertTriangle, color: 'bg-orange-100 text-orange-800' },
  internal: { label: 'შიდა', icon: Lock, color: 'bg-purple-100 text-purple-800' },
};

export function AdminBookingNotes({ bookingId, notes = [], onNotesChange }: AdminBookingNotesProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newNote, setNewNote] = useState({
    note: '',
    note_type: 'general',
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('booking_notes').insert([{
        booking_id: bookingId,
        note: newNote.note,
        note_type: newNote.note_type,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast({ title: 'შენიშვნა დაემატა' });
      setIsAddOpen(false);
      setNewNote({ note: '', note_type: 'general' });
      onNotesChange?.();
    },
    onError: () => {
      toast({ title: 'შეცდომა', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase.from('booking_notes').delete().eq('id', noteId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      onNotesChange?.();
    },
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <StickyNote className="h-4 w-4" />
          შენიშვნები ({notes.length})
        </h4>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              დამატება
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ახალი შენიშვნა</DialogTitle>
              <DialogDescription>დაამატეთ შენიშვნა ამ ჯავშანზე</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Select
                  value={newNote.note_type}
                  onValueChange={(v) => setNewNote({ ...newNote, note_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(NOTE_TYPES).map(([key, config]) => {
                      const Icon = config.icon;
                      return (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {config.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                value={newNote.note}
                onChange={(e) => setNewNote({ ...newNote, note: e.target.value })}
                placeholder="შენიშვნა..."
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>გაუქმება</Button>
              <Button 
                onClick={() => addMutation.mutate()} 
                disabled={addMutation.isPending || !newNote.note.trim()}
              >
                {addMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                დამატება
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {notes.length > 0 ? (
        <div className="space-y-2">
          {notes.map((note) => {
            const config = NOTE_TYPES[note.note_type as keyof typeof NOTE_TYPES] || NOTE_TYPES.general;
            const Icon = config.icon;
            return (
              <div key={note.id} className="p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-start justify-between">
                  <Badge className={config.color}>
                    <Icon className="h-3 w-3 mr-1" />
                    {config.label}
                  </Badge>
                  <button
                    onClick={() => deleteMutation.mutate(note.id)}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    წაშლა
                  </button>
                </div>
                <p className="text-sm mt-2">{note.note}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {format(new Date(note.created_at), 'd MMM, HH:mm', { locale: ka })}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          შენიშვნები არ არის
        </p>
      )}
    </div>
  );
}
