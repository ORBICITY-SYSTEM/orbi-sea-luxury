import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBookingForm } from './ChatBookingForm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  showBookingForm?: boolean;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

// Keywords that indicate booking intent
const BOOKING_KEYWORDS_KA = ['დაჯავშნა', 'ჯავშანი', 'რეზერვაცია', 'დავჯავშნო', 'ვჯავშნი', 'შევუკვეთო'];
const BOOKING_KEYWORDS_EN = ['book', 'booking', 'reserve', 'reservation', 'stay', 'available'];

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { language, t } = useLanguage();

  // Check if message contains booking intent
  const hasBookingIntent = (text: string) => {
    const keywords = language === 'ka' ? BOOKING_KEYWORDS_KA : BOOKING_KEYWORDS_EN;
    return keywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
  };

  // Quick reply suggestions
  const quickReplies = language === 'ka' ? [
    { text: '🏠 აპარტამენტები', message: 'რა ტიპის აპარტამენტები გაქვთ?' },
    { text: '💰 ფასები', message: 'რა ფასები გაქვთ?' },
    { text: '📅 დაჯავშნა', message: 'მინდა დავჯავშნო აპარტამენტი' },
    { text: '🏊 კეთილმოწყობილობები', message: 'რა კეთილმოწყობილობები გაქვთ?' },
  ] : [
    { text: '🏠 Apartments', message: 'What types of apartments do you have?' },
    { text: '💰 Prices', message: 'What are your prices?' },
    { text: '📅 Book Now', message: 'I want to book an apartment' },
    { text: '🏊 Amenities', message: 'What amenities do you have?' },
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const streamChat = async (userMessages: Message[]) => {
    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: userMessages, language }),
      });

      if (resp.status === 429) {
        toast.error(t('chatRateLimitError') || 'Too many requests. Please wait a moment.');
        return;
      }

      if (resp.status === 402) {
        toast.error(t('chatPaymentError') || 'Service temporarily unavailable.');
        return;
      }

      if (!resp.ok || !resp.body) {
        throw new Error("Failed to start stream");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantContent = "";
      let streamDone = false;

      // Create initial assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: 'assistant', content: assistantContent };
                return newMessages;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: 'assistant', content: assistantContent };
                return newMessages;
              });
            }
          } catch { /* ignore */ }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(t('chatError') || 'Failed to send message. Please try again.');
      // Remove empty assistant message on error
      setMessages(prev => prev.filter(m => m.content !== ''));
    }
  };

  const handleSend = async (customMessage?: string) => {
    const messageToSend = customMessage || input.trim();
    if (!messageToSend || isLoading) return;

    const userMessage: Message = { role: 'user', content: messageToSend };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    // Check for booking intent and show booking form
    if (hasBookingIntent(messageToSend)) {
      // Add assistant response with booking form
      const bookingResponse = language === 'ka'
        ? 'რა თქმა უნდა! 🎉 მოხარული ვარ დაგეხმაროთ დაჯავშნაში. ქვემოთ შეგიძლიათ შეავსოთ დაჯავშნის ფორმა:'
        : 'Absolutely! 🎉 I\'d be happy to help you book. Please fill out the booking form below:';
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: bookingResponse,
        showBookingForm: true 
      }]);
      setShowBookingForm(true);
      setIsLoading(false);
      return;
    }

    await streamChat(updatedMessages);
    setIsLoading(false);
  };

  const handleBookingComplete = (bookingDetails: any) => {
    setShowBookingForm(false);
    const successMessage = language === 'ka'
      ? `🎉 შესანიშნავია! თქვენი დაჯავშნა წარმატებით შეიქმნა!\n\n📍 აპარტამენტი: ${bookingDetails.apartmentName}\n📅 თარიღები: ${bookingDetails.check_in} - ${bookingDetails.check_out}\n👥 სტუმრები: ${bookingDetails.guests}\n💰 ჯამური თანხა: ${bookingDetails.total_price} ₾\n\nდადასტურება გამოგზავნილია თქვენს ელ-ფოსტაზე. გმადლობთ, რომ აირჩიეთ Orbi City!`
      : `🎉 Wonderful! Your booking has been successfully created!\n\n📍 Apartment: ${bookingDetails.apartmentName}\n📅 Dates: ${bookingDetails.check_in} - ${bookingDetails.check_out}\n👥 Guests: ${bookingDetails.guests}\n💰 Total: ${bookingDetails.total_price} ₾\n\nA confirmation has been sent to your email. Thank you for choosing Orbi City!`;
    
    setMessages(prev => [...prev, { role: 'assistant', content: successMessage }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const welcomeMessage = language === 'ka' 
    ? 'გამარჯობა! 👋 მე ვარ Orbi City-ის ვირტუალური ასისტენტი. როგორ შემიძლია დაგეხმაროთ?'
    : 'Hello! 👋 I\'m the Orbi City virtual assistant. How can I help you today?';

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className={cn(
                "h-12 px-5 rounded-full shadow-lg transition-all duration-300",
                "bg-gradient-gold hover:scale-110 active:scale-95",
                "relative overflow-hidden gap-2"
              )}
              aria-label="Open chat"
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <MessageCircle className="h-5 w-5 text-secondary-foreground relative" />
              <span className="font-medium text-sm text-secondary-foreground relative">AI Chat</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] rounded-2xl bg-card shadow-2xl border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-gold">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-foreground">Orbi Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-xs text-secondary-foreground/70">
                      {language === 'ka' ? 'ონლაინ' : 'Online'}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-secondary-foreground hover:bg-white/20 hover:text-secondary-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="h-[350px] p-4" ref={scrollRef}>
              <div className="space-y-4">
                {/* Welcome message */}
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-secondary-foreground" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                        <p className="text-sm">{welcomeMessage}</p>
                      </div>
                    </div>
                    
                    {/* Quick replies */}
                    <div className="flex flex-wrap gap-2 ml-11">
                      {quickReplies.map((reply, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          onClick={() => handleSend(reply.message)}
                          disabled={isLoading}
                          className="px-3 py-1.5 text-xs rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                        >
                          {reply.text}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className={cn(
                      "flex gap-3",
                      message.role === 'user' && "flex-row-reverse"
                    )}>
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                        message.role === 'assistant' ? "bg-gradient-gold" : "bg-primary"
                      )}>
                        {message.role === 'assistant' ? (
                          <Bot className="h-4 w-4 text-secondary-foreground" />
                        ) : (
                          <User className="h-4 w-4 text-primary-foreground" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3 max-w-[85%]",
                          message.role === 'assistant' 
                            ? "bg-muted rounded-tl-sm" 
                            : "bg-primary text-primary-foreground rounded-tr-sm"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content || (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              {language === 'ka' ? 'ვფიქრობ...' : 'Thinking...'}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    {/* Show booking form inline after the message */}
                    {message.showBookingForm && showBookingForm && (
                      <div className="ml-11">
                        <ChatBookingForm 
                          onBookingComplete={handleBookingComplete}
                          onClose={() => setShowBookingForm(false)}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={language === 'ka' ? 'დაწერეთ შეტყობინება...' : 'Type a message...'}
                  disabled={isLoading}
                  className="flex-1 rounded-full bg-muted border-0"
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="rounded-full shrink-0 bg-gradient-gold hover:opacity-90"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-secondary-foreground" />
                  ) : (
                    <Send className="h-4 w-4 text-secondary-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
