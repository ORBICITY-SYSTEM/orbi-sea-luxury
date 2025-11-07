import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';

export const DiscountPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [voucherCode] = useState('AMERIA20');

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('hasSeenDiscountPopup');
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('hasSeenDiscountPopup', 'true');
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  const copyVoucher = () => {
    navigator.clipboard.writeText(voucherCode);
    // Track with Meta Pixel if available
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: 'Discount Voucher',
        value: 20,
        currency: 'USD'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <div className="text-6xl">🎉</div>
          <h2 className="text-2xl font-bold text-center">
            მიიღე 20% ფასდაკლება!
          </h2>
          <p className="text-center text-muted-foreground">
            გამოიყენე ვაუჩერი პირველი ჯავშნისთვის
          </p>
          
          <div className="bg-primary/10 px-6 py-4 rounded-lg">
            <p className="text-3xl font-mono font-bold text-primary">
              {voucherCode}
            </p>
          </div>
          
          <div className="flex gap-2 w-full">
            <Button 
              onClick={copyVoucher}
              className="flex-1"
            >
              კოპირება
            </Button>
            <Button 
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="flex-1"
            >
              დახურვა
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            * ფასდაკლება მოქმედებს 3 ღამე ან მეტი ხნით დაჯავშნაზე
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
