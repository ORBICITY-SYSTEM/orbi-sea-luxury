import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { GoogleMapInteractive } from '@/components/GoogleMapInteractive';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { trackLead, trackPageView } from '@/lib/tracking';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useEmail } from '@/hooks/useEmail';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import { useLanguage } from '@/contexts/LanguageContext';
import { z } from 'zod';

// Validation schema - messages will be translated in component
const createContactFormSchema = (t: (key: string) => string) => z.object({
  name: z.string()
    .trim()
    .min(1, { message: t('contact.validation.nameRequired') })
    .max(100, { message: t('contact.validation.nameMax') }),
  email: z.string()
    .trim()
    .email({ message: t('contact.validation.emailInvalid') })
    .max(255, { message: t('contact.validation.emailMax') }),
  phone: z.string()
    .trim()
    .optional(),
  message: z.string()
    .trim()
    .min(10, { message: t('contact.validation.messageMin') })
    .max(1000, { message: t('contact.validation.messageMax') })
});

const Contact = () => {
  const { toast } = useToast();
  const { settings, isLoading } = useSiteSettings();
  const { sendContactReply } = useEmail();
  const { getWhatsAppUrl } = useWhatsApp();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    trackPageView();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate form data with translated messages
    try {
      const contactFormSchema = createContactFormSchema(t);
      const validatedData = contactFormSchema.parse(formData);
      setIsSubmitting(true);

      // Insert to Supabase
      const { error } = await supabase
        .from('contact_submissions')
        .insert([validatedData]);

      if (error) throw error;

      // Send auto-reply email to the user
      await sendContactReply(validatedData.email, {
        name: validatedData.name,
        message: validatedData.message
      });

      // Track lead generation
      trackLead({
        content_name: 'Contact Form Submission',
        form_id: 'contact_form',
        form_name: 'Contact Page Form',
      });

      toast({
        title: t('contact.successTitle'),
        description: t('contact.successDesc'),
      });

      // Reset form
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Set validation errors
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0].toString()] = issue.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: t('contact.validationError'),
          description: t('contact.validationErrorDesc'),
          variant: 'destructive',
        });
      } else {
        console.error('Error submitting form:', error);
        toast({
          title: t('contact.errorTitle'),
          description: t('contact.errorDesc'),
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactEmail = settings?.contact_email || 'info@orbicitybatumi.com';
  const contactPhone = settings?.contact_phone || '+995555199090';
  const contactAddress = settings?.contact_address || 'Sheriff Khimshiashvili Street 7B, Batumi, Georgia';
  const googleMapsUrl = settings?.google_maps_url || 'https://maps.app.goo.gl/riaDxn5nAe';

  return (
    <Layout>
      {/* Hero */}
      <div className="relative h-[300px] bg-gradient-to-r from-primary to-accent">
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 drop-shadow-[0_4px_8px_rgba(212,175,55,0.4)] [text-shadow:_0_1px_0_rgb(255_255_255_/_40%),_0_4px_12px_rgba(212,175,55,0.5)]">{t('contact.title')}</h1>
          <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-200 to-gold-300 drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)] max-w-2xl">
            {t('contact.subtitle')}
          </p>
        </div>
      </div>

      <Breadcrumbs items={[{ label: t('nav.contact') }]} />

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Phone */}
            <Card className="hover:shadow-luxury transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-gold flex items-center justify-center">
                  <Phone className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500">{t('contact.phone')}</h3>
                <a href={`tel:${contactPhone}`} className="text-primary hover:underline text-lg">
                  {contactPhone}
                </a>
                <p className="text-sm text-muted-foreground mt-2">{t('contact.reception')}</p>
              </CardContent>
            </Card>

            {/* Email */}
            <Card className="hover:shadow-luxury transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-gold flex items-center justify-center">
                  <Mail className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500">{t('contact.email')}</h3>
                <a href={`mailto:${contactEmail}`} className="text-primary hover:underline text-lg">
                  {contactEmail}
                </a>
                <p className="text-sm text-muted-foreground mt-2">{t('contact.responseTime')}</p>
              </CardContent>
            </Card>

            {/* Address */}
            <Card className="hover:shadow-luxury transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-gold flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500">{t('contact.address')}</h3>
                <a 
                  href={googleMapsUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {contactAddress}
                </a>
                <p className="text-sm text-muted-foreground mt-2">{t('contact.seafrontLocation')}</p>
              </CardContent>
            </Card>
          </div>

          {/* Map (interactive, uses your Google Business Place ID via backend function) */}
          <Card className="mb-12 overflow-hidden">
            <div className="w-full h-[400px]">
              <GoogleMapInteractive className="h-[400px]" />
            </div>
          </Card>

          {/* Contact Form */}
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500">{t('contact.sendMessage')}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('contact.name')} *</Label>
                    <Input 
                      id="name"
                      placeholder={t('contact.namePlaceholder')}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={errors.name ? 'border-destructive' : ''}
                      disabled={isSubmitting}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('contact.email')} *</Label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder={t('contact.emailPlaceholder')}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={errors.email ? 'border-destructive' : ''}
                      disabled={isSubmitting}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('contact.phoneOptional')}</Label>
                  <Input 
                    id="phone"
                    type="tel"
                    placeholder={t('contact.phonePlaceholder')}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t('contact.message')} *</Label>
                  <Textarea 
                    id="message"
                    placeholder={t('contact.messagePlaceholder')}
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className={errors.message ? 'border-destructive' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                  <p className="text-xs text-muted-foreground">{formData.message.length}/1000 {t('contact.characters')}</p>
                </div>
                <div className="flex gap-4">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => {
                      trackLead({ content_name: 'WhatsApp Click - Contact Page', form_name: 'Contact WhatsApp' });
                      window.open(getWhatsAppUrl('Hello, I would like to get more information about Orbi City apartments.'), '_blank');
                    }}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1 bg-gradient-gold hover:bg-secondary-dark text-secondary-foreground font-semibold"
                    disabled={isSubmitting}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? t('contact.sending') : t('contact.send')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
