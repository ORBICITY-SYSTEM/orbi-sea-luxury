import { useState, useEffect } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, X, Check, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PushNotificationPromptProps {
  className?: string;
  variant?: 'banner' | 'modal' | 'inline';
  showAfterDelay?: number; // milliseconds
}

export const PushNotificationPrompt = ({
  className,
  variant = 'banner',
  showAfterDelay = 10000 // Show after 10 seconds by default
}: PushNotificationPromptProps) => {
  const { t, language } = useLanguage();
  const {
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    subscribe,
    unsubscribe
  } = usePushNotifications();

  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if user has already dismissed the prompt
  useEffect(() => {
    const dismissed = localStorage.getItem('push-notification-dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  // Show prompt after delay (only if supported, not subscribed, and not dismissed)
  useEffect(() => {
    if (!isSupported || isSubscribed || isDismissed || permission === 'denied') {
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, showAfterDelay);

    return () => clearTimeout(timer);
  }, [isSupported, isSubscribed, isDismissed, permission, showAfterDelay]);

  const handleSubscribe = async () => {
    const result = await subscribe();
    if (result) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('push-notification-dismissed', 'true');
  };

  // Don't render if not visible or not supported
  if (!isVisible || !isSupported) {
    return null;
  }

  const content = {
    title: language === 'ka' ? 'არ გამოტოვოთ სპეცოფერები!' : "Don't miss special offers!",
    description: language === 'ka'
      ? 'მიიღეთ შეტყობინებები ფასდაკლებებზე, ახალ აპარტამენტებზე და ექსკლუზიურ შეთავაზებებზე.'
      : 'Get notified about discounts, new apartments, and exclusive deals.',
    allow: language === 'ka' ? 'დაშვება' : 'Allow Notifications',
    later: language === 'ka' ? 'მოგვიანებით' : 'Maybe Later',
    bonus: language === 'ka' ? 'მიიღეთ 20 GEL ბონუსი!' : 'Get 20 GEL bonus!'
  };

  if (variant === 'banner') {
    return (
      <div
        className={cn(
          "fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50",
          "animate-in slide-in-from-bottom-5 duration-500",
          className
        )}
      >
        <div className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl shadow-2xl overflow-hidden border border-gold-400/30">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* Decorative accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400" />

          <div className="p-5">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center">
                <Bell className="w-6 h-6 text-gold-400" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-lg mb-1">
                  {content.title}
                </h3>
                <p className="text-white/80 text-sm mb-3">
                  {content.description}
                </p>

                {/* Bonus badge */}
                <div className="inline-flex items-center gap-1.5 bg-gold-500/20 rounded-full px-3 py-1 mb-4">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  <span className="text-sm font-medium text-gold-400">{content.bonus}</span>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleSubscribe}
                    disabled={isLoading}
                    className="bg-gold-500 hover:bg-gold-600 text-white flex-1"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Bell className="w-4 h-4 mr-2" />
                    )}
                    {content.allow}
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    variant="ghost"
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    {content.later}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
        <div
          className={cn(
            "bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-300",
            className
          )}
        >
          {/* Header with gradient */}
          <div className="relative h-32 bg-gradient-to-br from-primary to-primary/80 rounded-t-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Bell className="w-10 h-10 text-gold-400" />
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {content.title}
            </h2>
            <p className="text-muted-foreground mb-4">
              {content.description}
            </p>

            {/* Bonus */}
            <div className="inline-flex items-center gap-2 bg-gold-50 border border-gold-200 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-5 h-5 text-gold-500" />
              <span className="font-semibold text-gold-600">{content.bonus}</span>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="w-full bg-gold-500 hover:bg-gold-600 text-white h-12 text-lg"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Check className="w-5 h-5 mr-2" />
                )}
                {content.allow}
              </Button>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                className="w-full text-muted-foreground"
              >
                {content.later}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Inline variant
  return (
    <div
      className={cn(
        "bg-gradient-to-r from-gold-50 to-gold-100 border border-gold-200 rounded-xl p-4",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
          <Bell className="w-5 h-5 text-gold-500" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-foreground">{content.title}</p>
          <p className="text-sm text-muted-foreground">{content.description}</p>
        </div>
        <Button
          onClick={handleSubscribe}
          disabled={isLoading}
          size="sm"
          className="bg-gold-500 hover:bg-gold-600 text-white"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
          {content.allow}
        </Button>
      </div>
    </div>
  );
};

// Settings toggle component for notification preferences
export const NotificationToggle = () => {
  const { language } = useLanguage();
  const { isSupported, isSubscribed, isLoading, subscribe, unsubscribe } = usePushNotifications();

  if (!isSupported) {
    return null;
  }

  const handleToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-3 w-full p-4 rounded-xl transition-colors",
        isSubscribed
          ? "bg-green-50 border border-green-200"
          : "bg-muted border border-border hover:bg-muted/80"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center",
        isSubscribed ? "bg-green-500" : "bg-muted-foreground/20"
      )}>
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        ) : isSubscribed ? (
          <Bell className="w-5 h-5 text-white" />
        ) : (
          <BellOff className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 text-left">
        <p className="font-medium text-foreground">
          {language === 'ka' ? 'Push შეტყობინებები' : 'Push Notifications'}
        </p>
        <p className="text-sm text-muted-foreground">
          {isSubscribed
            ? (language === 'ka' ? 'ჩართულია' : 'Enabled')
            : (language === 'ka' ? 'გამორთულია' : 'Disabled')
          }
        </p>
      </div>
      <div className={cn(
        "w-12 h-7 rounded-full relative transition-colors",
        isSubscribed ? "bg-green-500" : "bg-muted-foreground/30"
      )}>
        <div className={cn(
          "absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform",
          isSubscribed ? "translate-x-5" : "translate-x-0.5"
        )} />
      </div>
    </button>
  );
};
