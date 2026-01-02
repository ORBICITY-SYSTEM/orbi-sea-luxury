import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
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
import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z.string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phone: z.string()
    .trim()
    .optional(),
  message: z.string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must be less than 1000 characters" })
});

const Contact = () => {
  const { toast } = useToast();
  const { settings, isLoading } = useSiteSettings();
  const { sendContactReply } = useEmail();
  const { getWhatsAppUrl } = useWhatsApp();
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
    
    // Validate form data
    try {
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
        title: 'Message Sent Successfully! ✅',
        description: 'We\'ll get back to you as soon as possible. Check your email for confirmation.',
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
          title: 'Validation Error',
          description: 'Please check the form fields and try again.',
          variant: 'destructive',
        });
      } else {
        console.error('Error submitting form:', error);
        toast({
          title: 'Error',
          description: 'Failed to send message. Please try again.',
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
          <h1 className="text-5xl font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            We're here to help you plan your perfect stay. Contact us with any questions or for booking assistance.
          </p>
        </div>
      </div>

      <Breadcrumbs items={[{ label: 'Contact' }]} />

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
                <h3 className="text-xl font-bold text-foreground mb-2">Phone</h3>
                <a href={`tel:${contactPhone}`} className="text-primary hover:underline text-lg">
                  {contactPhone}
                </a>
                <p className="text-sm text-muted-foreground mt-2">24/7 Reception</p>
              </CardContent>
            </Card>

            {/* Email */}
            <Card className="hover:shadow-luxury transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-gold flex items-center justify-center">
                  <Mail className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Email</h3>
                <a href={`mailto:${contactEmail}`} className="text-primary hover:underline text-lg">
                  {contactEmail}
                </a>
                <p className="text-sm text-muted-foreground mt-2">Response within 24 hours</p>
              </CardContent>
            </Card>

            {/* Address */}
            <Card className="hover:shadow-luxury transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-gold flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Address</h3>
                <a 
                  href={googleMapsUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {contactAddress}
                </a>
                <p className="text-sm text-muted-foreground mt-2">Seafront Location</p>
              </CardContent>
            </Card>
          </div>

          {/* Google Maps Embed */}
          <Card className="mb-12 overflow-hidden">
            <div className="w-full h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2974.8154446089724!2d41.64283647645193!3d41.642883371251976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406786e1e7d6b515%3A0x8b9d1c3e9a7f5b9e!2sOrbi%20City!5e0!3m2!1sen!2sge!4v1234567890123"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Orbi City Batumi Location"
              />
            </div>
          </Card>

          {/* Contact Form */}
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input 
                      id="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={errors.name ? 'border-destructive' : ''}
                      disabled={isSubmitting}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={errors.email ? 'border-destructive' : ''}
                      disabled={isSubmitting}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input 
                    id="phone"
                    type="tel"
                    placeholder="+995 555 123 456"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea 
                    id="message"
                    placeholder="Your Message (minimum 10 characters)"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className={errors.message ? 'border-destructive' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                  <p className="text-xs text-muted-foreground">{formData.message.length}/1000 characters</p>
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
                    {isSubmitting ? 'Sending...' : 'Send Message'}
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
