import { useState, useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Save, TestTube, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AdminSettings = () => {
  const { settings, isLoading, updateSetting } = useSiteSettings();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [gaTestStatus, setGaTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [metaTestStatus, setMetaTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update all changed settings
    Object.entries(formData).forEach(([key, value]) => {
      if (settings && settings[key] !== value) {
        updateSetting({ key, value });
      }
    });
  };

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const testGoogleAnalytics = () => {
    const gaId = formData.google_analytics_id;
    if (!gaId) {
      toast({
        title: 'შეცდომა',
        description: 'GA4 Measurement ID არ არის შეყვანილი',
        variant: 'destructive',
      });
      return;
    }

    setGaTestStatus('testing');
    
    // Check if gtag is loaded
    if ((window as any).gtag) {
      try {
        // Send test event
        (window as any).gtag('event', 'admin_test_event', {
          event_category: 'admin',
          event_label: 'GA4 Test from Admin Panel',
          value: 1
        });
        
        setGaTestStatus('success');
        toast({
          title: 'წარმატება!',
          description: `GA4 (${gaId}) მუშაობს სწორად. ტესტ ივენტი გაიგზავნა.`,
        });
      } catch (error) {
        setGaTestStatus('error');
        toast({
          title: 'შეცდომა',
          description: 'ივენტის გაგზავნა ვერ მოხერხდა',
          variant: 'destructive',
        });
      }
    } else {
      setGaTestStatus('error');
      toast({
        title: 'შეცდომა',
        description: 'Google Analytics არ არის ჩატვირთული. შეამოწმეთ Measurement ID.',
        variant: 'destructive',
      });
    }

    // Reset status after 3 seconds
    setTimeout(() => setGaTestStatus('idle'), 3000);
  };

  const testMetaPixel = () => {
    const pixelId = formData.meta_pixel_id;
    if (!pixelId) {
      toast({
        title: 'შეცდომა',
        description: 'Meta Pixel ID არ არის შეყვანილი',
        variant: 'destructive',
      });
      return;
    }

    setMetaTestStatus('testing');
    
    // Check if fbq is loaded
    if ((window as any).fbq) {
      try {
        // Send test event
        (window as any).fbq('trackCustom', 'AdminTestEvent', {
          source: 'Admin Panel',
          timestamp: new Date().toISOString()
        });
        
        setMetaTestStatus('success');
        toast({
          title: 'წარმატება!',
          description: `Meta Pixel (${pixelId}) მუშაობს სწორად. ტესტ ივენტი გაიგზავნა.`,
        });
      } catch (error) {
        setMetaTestStatus('error');
        toast({
          title: 'შეცდომა',
          description: 'ივენტის გაგზავნა ვერ მოხერხდა',
          variant: 'destructive',
        });
      }
    } else {
      setMetaTestStatus('error');
      toast({
        title: 'შეცდომა',
        description: 'Meta Pixel არ არის ჩატვირთული. შეამოწმეთ Pixel ID.',
        variant: 'destructive',
      });
    }

    // Reset status after 3 seconds
    setTimeout(() => setMetaTestStatus('idle'), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">საიტის პარამეტრები</h2>
        <p className="text-muted-foreground mt-2">მართეთ საიტის ძირითადი კონფიგურაციები</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* YouTube Settings */}
        <Card>
          <CardHeader>
            <CardTitle>YouTube ინტეგრაცია</CardTitle>
            <CardDescription>გალერეაში ვიდეოების ჩვენებისთვის</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="youtube_channel_id">YouTube Channel ID</Label>
              <Input
                id="youtube_channel_id"
                value={formData.youtube_channel_id || ''}
                onChange={(e) => handleChange('youtube_channel_id', e.target.value)}
                placeholder="UCxxxxxxxxxxxxxxxxxxx"
              />
              <p className="text-sm text-muted-foreground">
                იხილეთ YouTube Studio → Settings → Channel → Advanced settings
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Links */}
        <Card>
          <CardHeader>
            <CardTitle>სოციალური მედია</CardTitle>
            <CardDescription>თქვენი სოციალური მედიის ბმულები</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook_url">Facebook</Label>
              <Input
                id="facebook_url"
                value={formData.facebook_url || ''}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram_url">Instagram</Label>
              <Input
                id="instagram_url"
                value={formData.instagram_url || ''}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                placeholder="https://instagram.com/yourprofile"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube_url">YouTube</Label>
              <Input
                id="youtube_url"
                value={formData.youtube_url || ''}
                onChange={(e) => handleChange('youtube_url', e.target.value)}
                placeholder="https://youtube.com/@yourprofile"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>საკონტაქტო ინფორმაცია</CardTitle>
            <CardDescription>ელფოსტა, ტელეფონი და მდებარეობა</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact_email">ელფოსტა</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                placeholder="info@orbicitybatumi.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone">ტელეფონი</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone || ''}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                placeholder="+995 XXX XX XX XX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp_phone">WhatsApp ნომერი</Label>
              <Input
                id="whatsapp_phone"
                value={formData.whatsapp_phone || ''}
                onChange={(e) => handleChange('whatsapp_phone', e.target.value)}
                placeholder="995555199090"
              />
              <p className="text-sm text-muted-foreground">
                ქვეყნის კოდით, + გარეშე (მაგ: 995555199090)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_address">მისამართი</Label>
              <Input
                id="contact_address"
                value={formData.contact_address || ''}
                onChange={(e) => handleChange('contact_address', e.target.value)}
                placeholder="Sheriff Khimshiashvili Street 7B, Batumi, Georgia"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="google_maps_place_id">Google Maps Place ID</Label>
              <Input
                id="google_maps_place_id"
                value={formData.google_maps_place_id || ''}
                onChange={(e) => handleChange('google_maps_place_id', e.target.value)}
                placeholder="ChIJxf79LQmHZ0ARpmv2Eih-1WE"
              />
              <p className="text-sm text-muted-foreground">
                თქვენი ბიზნესის Place ID (რუკაზე და შეფასებებში გამოსაჩენად)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="google_maps_url">Google Maps URL</Label>
              <Input
                id="google_maps_url"
                value={formData.google_maps_url || ''}
                onChange={(e) => handleChange('google_maps_url', e.target.value)}
                placeholder="https://maps.google.com/..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Google Analytics Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Google Analytics 4</CardTitle>
            <CardDescription>GA4 Measurement ID ტრაფიკის ანალიზისთვის</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="google_analytics_id">GA4 Measurement ID</Label>
              <div className="flex gap-2">
                <Input
                  id="google_analytics_id"
                  value={formData.google_analytics_id || ''}
                  onChange={(e) => handleChange('google_analytics_id', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={testGoogleAnalytics}
                  disabled={gaTestStatus === 'testing'}
                  className="shrink-0"
                >
                  {gaTestStatus === 'testing' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {gaTestStatus === 'success' && <CheckCircle className="h-4 w-4 mr-2 text-green-500" />}
                  {gaTestStatus === 'error' && <XCircle className="h-4 w-4 mr-2 text-red-500" />}
                  {gaTestStatus === 'idle' && <TestTube className="h-4 w-4 mr-2" />}
                  ტესტი
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                იხილეთ Google Analytics → Admin → Data Streams → Your Stream
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Meta Pixel Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Meta Pixel (Facebook)</CardTitle>
            <CardDescription>Meta Pixel ID კონვერსიების თვალყურის დევნებისთვის</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta_pixel_id">Meta Pixel ID</Label>
              <div className="flex gap-2">
                <Input
                  id="meta_pixel_id"
                  value={formData.meta_pixel_id || ''}
                  onChange={(e) => handleChange('meta_pixel_id', e.target.value)}
                  placeholder="1234567890123456"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={testMetaPixel}
                  disabled={metaTestStatus === 'testing'}
                  className="shrink-0"
                >
                  {metaTestStatus === 'testing' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {metaTestStatus === 'success' && <CheckCircle className="h-4 w-4 mr-2 text-green-500" />}
                  {metaTestStatus === 'error' && <XCircle className="h-4 w-4 mr-2 text-red-500" />}
                  {metaTestStatus === 'idle' && <TestTube className="h-4 w-4 mr-2" />}
                  ტესტი
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                იხილეთ Meta Events Manager → Data Sources → Your Pixel
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta_access_token">Meta Access Token (Conversions API)</Label>
              <Input
                id="meta_access_token"
                type="password"
                value={formData.meta_access_token || ''}
                onChange={(e) => handleChange('meta_access_token', e.target.value)}
                placeholder="Access Token..."
              />
              <p className="text-sm text-muted-foreground">
                Conversions API-სთვის (სერვერული tracking)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Popup Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Popup პარამეტრები</CardTitle>
            <CardDescription>ფასდაკლებისა და შეფასების popup-ების კონფიგურაცია</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="discount_popup_code">ვაუჩერის კოდი</Label>
              <Input
                id="discount_popup_code"
                value={formData.discount_popup_code || ''}
                onChange={(e) => handleChange('discount_popup_code', e.target.value)}
                placeholder="ORBI20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount_popup_percentage">ფასდაკლების პროცენტი</Label>
              <Input
                id="discount_popup_percentage"
                value={formData.discount_popup_percentage || ''}
                onChange={(e) => handleChange('discount_popup_percentage', e.target.value)}
                placeholder="20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="google_review_url">Google Review URL</Label>
              <Input
                id="google_review_url"
                value={formData.google_review_url || ''}
                onChange={(e) => handleChange('google_review_url', e.target.value)}
                placeholder="https://g.page/r/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review_popup_discount">შეფასების ფასდაკლება (%)</Label>
              <Input
                id="review_popup_discount"
                value={formData.review_popup_discount || ''}
                onChange={(e) => handleChange('review_popup_discount', e.target.value)}
                placeholder="10"
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <Save className="h-4 w-4 mr-2" />
          ცვლილებების შენახვა
        </Button>
      </form>
    </div>
  );
};
