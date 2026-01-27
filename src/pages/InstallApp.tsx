import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Smartphone, Wifi, Bell, Zap, Check, Share, Plus, BellRing } from 'lucide-react';
import { NotificationToggle } from '@/components/PushNotificationPrompt';
import { motion } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallApp() {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const features = [
    { icon: Zap, title: 'სწრაფი ჩატვირთვა', description: 'მყისიერი წვდომა ერთი დაკლიკებით' },
    { icon: Wifi, title: 'ოფლაინ რეჟიმი', description: 'მუშაობს ინტერნეტის გარეშეც' },
    { icon: Bell, title: 'შეტყობინებები', description: 'მიიღე სიახლეები პირველმა' },
    { icon: Smartphone, title: 'ფულსქრინ რეჟიმი', description: 'სრულეკრანიანი გამოცდილება' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-50 to-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg">
              <Download className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-light text-navy-800 mb-4">
              დააინსტალირე აპლიკაცია
            </h1>
            <p className="text-lg text-navy-600">
              Orbi City Batumi - შენს მობილურზე, როგორც ნამდვილი აპლიკაცია
            </p>
          </div>

          {/* Install Card */}
          <Card className="mb-8 border-gold-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-navy-800">
                {isInstalled ? '✓ უკვე დაინსტალირებულია!' : 'მზადაა ინსტალაციისთვის'}
              </CardTitle>
              <CardDescription>
                {isInstalled 
                  ? 'აპლიკაცია უკვე შენს მოწყობილობაზეა' 
                  : 'დააინსტალირე უფასოდ, წამებში'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isInstalled ? (
                <div className="flex items-center justify-center gap-2 text-green-600 py-4">
                  <Check className="w-8 h-8" />
                  <span className="text-xl font-medium">დაინსტალირებულია</span>
                </div>
              ) : isIOS ? (
                <div className="space-y-4 text-left">
                  <p className="text-navy-700 font-medium text-center mb-4">
                    iOS-ზე დასაინსტალირებლად:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-navy-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 font-bold">1</div>
                      <div className="flex items-center gap-2">
                        <span>დააჭირე</span>
                        <Share className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">Share ღილაკს</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-navy-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 font-bold">2</div>
                      <div className="flex items-center gap-2">
                        <span>აირჩიე</span>
                        <Plus className="w-5 h-5 text-navy-600" />
                        <span className="font-medium">"Add to Home Screen"</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-navy-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 font-bold">3</div>
                      <span>დააჭირე <span className="font-medium">"Add"</span></span>
                    </div>
                  </div>
                </div>
              ) : deferredPrompt ? (
                <Button
                  size="lg"
                  onClick={handleInstall}
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white py-6 text-lg rounded-xl shadow-lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  დააინსტალირე უფასოდ
                </Button>
              ) : (
                <div className="text-navy-600 py-4">
                  <p className="mb-4">აპლიკაციის ინსტალაცია ხელმისაწვდომია მობილურ ბრაუზერებში.</p>
                  <p className="text-sm text-navy-500">
                    გახსენი ეს გვერდი Chrome ან Safari-ით მობილურზე
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="mb-8 border-gold-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-navy-800">
                <BellRing className="w-5 h-5 text-gold-500" />
                შეტყობინებების პარამეტრები
              </CardTitle>
              <CardDescription>
                მიიღე შეტყობინებები სპეციალურ შეთავაზებებზე და ფასდაკლებებზე
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationToggle />
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-navy-100 hover:border-gold-300 transition-colors">
                  <CardContent className="pt-6 text-center">
                    <feature.icon className="w-8 h-8 mx-auto mb-3 text-gold-500" />
                    <h3 className="font-medium text-navy-800 mb-1">{feature.title}</h3>
                    <p className="text-sm text-navy-500">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
