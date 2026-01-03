import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, Loader2, User, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ka } from 'date-fns/locale';

interface GuestMessage {
  id: string;
  booking_id: string | null;
  user_id: string | null;
  sender_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  booking_id: string;
  guest_name: string;
  apartment_type: string;
  unread_count: number;
  last_message: string;
  last_message_at: string;
}

export function AdminGuestMessages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Get conversations (grouped by booking)
  const { data: conversations, isLoading: loadingConversations } = useQuery({
    queryKey: ['guest-conversations'],
    queryFn: async () => {
      const { data: messages, error } = await supabase
        .from('guest_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;

      // Get bookings for context
      const bookingIds = [...new Set(messages.map(m => m.booking_id).filter(Boolean))];
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id, guest_name, apartment_type')
        .in('id', bookingIds);

      // Group messages by booking
      const grouped = messages.reduce((acc: Record<string, GuestMessage[]>, msg) => {
        const key = msg.booking_id || 'no-booking';
        if (!acc[key]) acc[key] = [];
        acc[key].push(msg);
        return acc;
      }, {});

      // Build conversation list
      const convos: Conversation[] = Object.entries(grouped).map(([bookingId, msgs]) => {
        const booking = bookings?.find(b => b.id === bookingId);
        const unreadCount = msgs.filter(m => !m.is_read && m.sender_type === 'guest').length;
        return {
          booking_id: bookingId,
          guest_name: booking?.guest_name || 'სტუმარი',
          apartment_type: booking?.apartment_type || 'N/A',
          unread_count: unreadCount,
          last_message: msgs[0].message,
          last_message_at: msgs[0].created_at,
        };
      });

      return convos.sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());
    },
  });

  // Get messages for selected booking
  const { data: messages, isLoading: loadingMessages } = useQuery({
    queryKey: ['guest-messages', selectedBooking],
    enabled: !!selectedBooking,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guest_messages')
        .select('*')
        .eq('booking_id', selectedBooking)
        .order('created_at', { ascending: true });
      if (error) throw error;

      // Mark as read
      await supabase
        .from('guest_messages')
        .update({ is_read: true })
        .eq('booking_id', selectedBooking)
        .eq('sender_type', 'guest');

      queryClient.invalidateQueries({ queryKey: ['guest-conversations'] });

      return data as GuestMessage[];
    },
  });

  const sendMutation = useMutation({
    mutationFn: async (message: string) => {
      const { error } = await supabase.from('guest_messages').insert([{
        booking_id: selectedBooking,
        sender_type: 'admin',
        message,
        is_read: true,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest-messages', selectedBooking] });
      queryClient.invalidateQueries({ queryKey: ['guest-conversations'] });
      setNewMessage('');
    },
    onError: () => {
      toast({ title: 'შეცდომა', variant: 'destructive' });
    },
  });

  const handleSend = () => {
    if (!newMessage.trim() || !selectedBooking) return;
    sendMutation.mutate(newMessage);
  };

  if (loadingConversations) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">სტუმრებთან ჩატი</h2>
        <p className="text-muted-foreground">პირდაპირი კომუნიკაცია დაჯავშნულ სტუმრებთან</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              მიმოწერები
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[480px]">
              {conversations && conversations.length > 0 ? (
                <div className="divide-y">
                  {conversations.map((convo) => (
                    <button
                      key={convo.booking_id}
                      onClick={() => setSelectedBooking(convo.booking_id)}
                      className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                        selectedBooking === convo.booking_id ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {convo.guest_name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{convo.guest_name}</p>
                            <p className="text-sm text-muted-foreground">{convo.apartment_type}</p>
                          </div>
                        </div>
                        {convo.unread_count > 0 && (
                          <Badge className="bg-primary">{convo.unread_count}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 truncate">
                        {convo.last_message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(convo.last_message_at), 'd MMM, HH:mm', { locale: ka })}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>მიმოწერები არ არის</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-2">
          <CardContent className="p-0 h-full flex flex-col">
            {selectedBooking ? (
              <>
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages?.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              msg.sender_type === 'admin'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {msg.sender_type === 'admin' ? (
                                <Building className="h-3 w-3" />
                              ) : (
                                <User className="h-3 w-3" />
                              )}
                              <span className="text-xs opacity-80">
                                {msg.sender_type === 'admin' ? 'თქვენ' : 'სტუმარი'}
                              </span>
                            </div>
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs opacity-60 mt-1">
                              {format(new Date(msg.created_at), 'HH:mm', { locale: ka })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                {/* Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="დაწერეთ შეტყობინება..."
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button onClick={handleSend} disabled={sendMutation.isPending || !newMessage.trim()}>
                      {sendMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>აირჩიეთ მიმოწერა</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
