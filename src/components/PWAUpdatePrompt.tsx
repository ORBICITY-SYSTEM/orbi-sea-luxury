import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Custom hook for PWA registration
const usePWAUpdate = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const checkForUpdates = async () => {
      try {
        // Get existing registration
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          setRegistration(reg);

          // Check for updates periodically
          const interval = setInterval(() => {
            reg.update();
          }, 5 * 60 * 1000); // Every 5 minutes

          // Listen for new service worker
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setNeedRefresh(true);
                }
              });
            }
          });

          return () => clearInterval(interval);
        }
      } catch (error) {
        console.error('[PWA] Check failed:', error);
      }
    };

    checkForUpdates();
  }, []);

  const updateServiceWorker = useCallback(() => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  }, [registration]);

  return { needRefresh, setNeedRefresh, updateServiceWorker };
};

export const PWAUpdatePrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const { needRefresh, setNeedRefresh, updateServiceWorker } = usePWAUpdate();

  useEffect(() => {
    if (needRefresh) {
      setShowPrompt(true);
    }
  }, [needRefresh]);

  const handleUpdate = () => {
    updateServiceWorker();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setNeedRefresh(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[200] bg-card border border-border rounded-lg shadow-xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Download className="w-5 h-5 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">
                ახალი ვერსია ხელმისაწვდომია
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                განაახლეთ აპლიკაცია უახლესი ფუნქციებისა და გაუმჯობესებების მისაღებად.
              </p>
              
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={handleUpdate}>
                  <RefreshCw className="w-4 h-4 mr-1" />
                  განახლება
                </Button>
                <Button size="sm" variant="ghost" onClick={handleDismiss}>
                  მოგვიანებით
                </Button>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
