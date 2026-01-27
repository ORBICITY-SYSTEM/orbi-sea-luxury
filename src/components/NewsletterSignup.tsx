import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Check, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsletterSignupProps {
  variant?: 'footer' | 'hero' | 'popup';
  className?: string;
}

export const NewsletterSignup = ({ variant = 'footer', className }: NewsletterSignupProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError(language === 'ka' ? 'შეიყვანეთ ელ.ფოსტა' : 'Please enter your email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(language === 'ka' ? 'არასწორი ელ.ფოსტის ფორმატი' : 'Invalid email format');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: dbError } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: email.toLowerCase().trim(),
          language,
          source: variant,
        });

      if (dbError) {
        if (dbError.code === '23505') {
          // Unique constraint violation - already subscribed
          setError(language === 'ka' ? 'უკვე გამოწერილი ხართ!' : 'You are already subscribed!');
        } else {
          throw dbError;
        }
      } else {
        setSuccess(true);
        setEmail('');
        toast({
          title: language === 'ka' ? 'წარმატებით გამოწერეთ!' : 'Successfully subscribed!',
          description: language === 'ka'
            ? 'მადლობა! მიიღებთ ექსკლუზიურ შეთავაზებებს.'
            : 'Thank you! You will receive exclusive offers.',
        });
      }
    } catch (err) {
      console.error('Newsletter signup error:', err);
      setError(language === 'ka' ? 'შეცდომა. სცადეთ თავიდან.' : 'Error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={cn(
        "flex items-center gap-2 text-green-500",
        variant === 'hero' && "justify-center",
        className
      )}>
        <Check className="w-5 h-5" />
        <span className="font-medium">
          {language === 'ka' ? 'გამოწერილი ხართ!' : 'You are subscribed!'}
        </span>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={cn("w-full max-w-md mx-auto", className)}>
        <div className="flex items-center gap-2 mb-3 justify-center">
          <Gift className="w-5 h-5 text-gold-400" />
          <span className="text-sm text-white/80">
            {language === 'ka'
              ? 'მიიღეთ 10% ფასდაკლება პირველ ჯავშანზე!'
              : 'Get 10% off your first booking!'}
          </span>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder={language === 'ka' ? 'თქვენი ელ.ფოსტა' : 'Your email address'}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-gold-500 hover:bg-gold-600 text-white"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              language === 'ka' ? 'გამოწერა' : 'Subscribe'
            )}
          </Button>
        </form>
        {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
      </div>
    );
  }

  // Footer variant (default)
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Mail className="w-5 h-5 text-gold-400" />
        <h4 className="font-semibold text-foreground">
          {language === 'ka' ? 'გამოიწერეთ სიახლეები' : 'Subscribe to Newsletter'}
        </h4>
      </div>
      <p className="text-sm text-muted-foreground">
        {language === 'ka'
          ? 'მიიღეთ ექსკლუზიური შეთავაზებები და სიახლეები'
          : 'Get exclusive offers and updates'}
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          placeholder={language === 'ka' ? 'ელ.ფოსტა' : 'Email address'}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={loading}
          size="sm"
          className="bg-gold-500 hover:bg-gold-600"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Mail className="w-4 h-4" />
          )}
        </Button>
      </form>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default NewsletterSignup;
