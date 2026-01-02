import { useState, useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';

export const AdminSettings = () => {
  const { settings, isLoading, updateSetting } = useSiteSettings();
  const [formData, setFormData] = useState<Record<string, string>>({});

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
              <Label htmlFor="contact_address">მისამართი</Label>
              <Input
                id="contact_address"
                value={formData.contact_address || ''}
                onChange={(e) => handleChange('contact_address', e.target.value)}
                placeholder="Sheriff Khimshiashvili Street 7B, Batumi, Georgia"
              />
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
              <Label htmlFor="ga4_measurement_id">GA4 Measurement ID</Label>
              <Input
                id="ga4_measurement_id"
                value={formData.ga4_measurement_id || ''}
                onChange={(e) => handleChange('ga4_measurement_id', e.target.value)}
                placeholder="G-XXXXXXXXXX"
              />
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
              <Input
                id="meta_pixel_id"
                value={formData.meta_pixel_id || ''}
                onChange={(e) => handleChange('meta_pixel_id', e.target.value)}
                placeholder="1234567890123456"
              />
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
