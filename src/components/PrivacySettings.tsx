import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGDPR } from '@/hooks/useGDPR';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Download,
  Trash2,
  Shield,
  Bell,
  Mail,
  Loader2,
  AlertTriangle,
  CheckCircle,
  FileJson,
} from 'lucide-react';

export const PrivacySettings = () => {
  const { language } = useLanguage();
  const {
    exportUserData,
    deleteAccount,
    unsubscribeNewsletter,
    withdrawMarketingConsent,
    isLoading,
  } = useGDPR();

  const [confirmText, setConfirmText] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(true);

  const handleDeleteAccount = async () => {
    if (confirmText.toLowerCase() === 'delete' || confirmText === 'წაშლა') {
      await deleteAccount.mutateAsync();
    }
  };

  const handleMarketingToggle = async (checked: boolean) => {
    setMarketingConsent(checked);
    if (!checked) {
      await withdrawMarketingConsent.mutateAsync();
    }
  };

  const t = {
    title: language === 'ka' ? 'კონფიდენციალურობის პარამეტრები' : 'Privacy Settings',
    subtitle:
      language === 'ka'
        ? 'მართეთ თქვენი მონაცემები და კონფიდენციალურობის პარამეტრები'
        : 'Manage your data and privacy preferences',

    // Data Export
    exportTitle: language === 'ka' ? 'მონაცემების ექსპორტი' : 'Export Your Data',
    exportDesc:
      language === 'ka'
        ? 'გადმოწერეთ თქვენი ყველა მონაცემის ასლი JSON ფორმატში'
        : 'Download a copy of all your data in JSON format',
    exportButton: language === 'ka' ? 'მონაცემების გადმოწერა' : 'Download My Data',
    exportIncludes: language === 'ka' ? 'მოიცავს:' : 'Includes:',
    exportItem1: language === 'ka' ? 'პროფილის ინფორმაცია' : 'Profile information',
    exportItem2: language === 'ka' ? 'ჯავშნების ისტორია' : 'Booking history',
    exportItem3: language === 'ka' ? 'ლოიალობის ქულები' : 'Loyalty points',
    exportItem4: language === 'ka' ? 'სიახლეების გამოწერის სტატუსი' : 'Newsletter subscription status',

    // Marketing Consent
    marketingTitle: language === 'ka' ? 'მარკეტინგული კომუნიკაცია' : 'Marketing Communications',
    marketingDesc:
      language === 'ka'
        ? 'მართეთ მარკეტინგული შეტყობინებების მიღება'
        : 'Manage your marketing communication preferences',
    marketingLabel:
      language === 'ka'
        ? 'სპეციალური შეთავაზებები და სიახლეები'
        : 'Special offers and updates',
    marketingHelper:
      language === 'ka'
        ? 'მიიღეთ ინფორმაცია ფასდაკლებებზე, ახალ აპარტამენტებზე და სპეციალურ შეთავაზებებზე'
        : 'Receive information about discounts, new apartments, and special offers',

    // Delete Account
    deleteTitle: language === 'ka' ? 'ანგარიშის წაშლა' : 'Delete Account',
    deleteDesc:
      language === 'ka'
        ? 'სამუდამოდ წაშალეთ თქვენი ანგარიში და ყველა მონაცემი'
        : 'Permanently delete your account and all associated data',
    deleteWarning:
      language === 'ka'
        ? 'ეს მოქმედება შეუქცევადია. წაიშლება თქვენი პროფილი, ჯავშნების ისტორია, ლოიალობის ქულები და სხვა მონაცემები.'
        : 'This action cannot be undone. This will permanently delete your profile, booking history, loyalty points, and other data.',
    deleteButton: language === 'ka' ? 'ანგარიშის წაშლა' : 'Delete Account',
    deleteConfirmTitle:
      language === 'ka' ? 'დარწმუნებული ხართ?' : 'Are you absolutely sure?',
    deleteConfirmDesc:
      language === 'ka'
        ? 'ეს სამუდამოდ წაშლის თქვენს ანგარიშს და ყველა მონაცემს. ჩაწერეთ "წაშლა" დასადასტურებლად.'
        : 'This will permanently delete your account and all data. Type "delete" to confirm.',
    deleteConfirmLabel: language === 'ka' ? 'ჩაწერეთ "წაშლა"' : 'Type "delete"',
    deleteConfirmButton: language === 'ka' ? 'სამუდამოდ წაშლა' : 'Delete Forever',
    cancel: language === 'ka' ? 'გაუქმება' : 'Cancel',

    // GDPR Rights
    gdprTitle: language === 'ka' ? 'თქვენი უფლებები (GDPR)' : 'Your Rights (GDPR)',
    gdprRights: [
      {
        title: language === 'ka' ? 'წვდომის უფლება' : 'Right to Access',
        desc:
          language === 'ka'
            ? 'შეგიძლიათ მოითხოვოთ თქვენი მონაცემების ასლი'
            : 'You can request a copy of your personal data',
      },
      {
        title: language === 'ka' ? 'შესწორების უფლება' : 'Right to Rectification',
        desc:
          language === 'ka'
            ? 'შეგიძლიათ მოითხოვოთ არაზუსტი მონაცემების შესწორება'
            : 'You can request correction of inaccurate data',
      },
      {
        title: language === 'ka' ? 'წაშლის უფლება' : 'Right to Erasure',
        desc:
          language === 'ka'
            ? 'შეგიძლიათ მოითხოვოთ თქვენი მონაცემების წაშლა'
            : 'You can request deletion of your personal data',
      },
      {
        title: language === 'ka' ? 'პორტაბელურობის უფლება' : 'Right to Data Portability',
        desc:
          language === 'ka'
            ? 'შეგიძლიათ გადმოწეროთ თქვენი მონაცემები სტანდარტულ ფორმატში'
            : 'You can download your data in a standard format',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{t.title}</h2>
        <p className="text-muted-foreground mt-1">{t.subtitle}</p>
      </div>

      {/* GDPR Rights Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            {t.gdprTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {t.gdprRights.map((right, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm">{right.title}</p>
                  <p className="text-xs text-muted-foreground">{right.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="w-5 h-5 text-blue-500" />
            {t.exportTitle}
          </CardTitle>
          <CardDescription>{t.exportDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">{t.exportIncludes}</p>
            <ul className="list-disc list-inside space-y-1">
              <li>{t.exportItem1}</li>
              <li>{t.exportItem2}</li>
              <li>{t.exportItem3}</li>
              <li>{t.exportItem4}</li>
            </ul>
          </div>
          <Button
            onClick={() => exportUserData.mutate()}
            disabled={isLoading}
            className="gap-2"
          >
            {exportUserData.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {t.exportButton}
          </Button>
        </CardContent>
      </Card>

      {/* Marketing Consent */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-gold-500" />
            {t.marketingTitle}
          </CardTitle>
          <CardDescription>{t.marketingDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-consent" className="font-medium">
                {t.marketingLabel}
              </Label>
              <p className="text-sm text-muted-foreground">{t.marketingHelper}</p>
            </div>
            <Switch
              id="marketing-consent"
              checked={marketingConsent}
              onCheckedChange={handleMarketingToggle}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            {t.deleteTitle}
          </CardTitle>
          <CardDescription>{t.deleteDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{t.deleteWarning}</p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="w-4 h-4" />
                {t.deleteButton}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.deleteConfirmTitle}</AlertDialogTitle>
                <AlertDialogDescription>{t.deleteConfirmDesc}</AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <Label htmlFor="confirm-delete">{t.deleteConfirmLabel}</Label>
                <Input
                  id="confirm-delete"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={language === 'ka' ? 'წაშლა' : 'delete'}
                  className="mt-2"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setConfirmText('')}>
                  {t.cancel}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={
                    (confirmText.toLowerCase() !== 'delete' && confirmText !== 'წაშლა') ||
                    deleteAccount.isPending
                  }
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {deleteAccount.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {t.deleteConfirmButton}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};
