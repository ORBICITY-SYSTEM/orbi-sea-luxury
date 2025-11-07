import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

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
                <a href="tel:+995555199090" className="text-primary hover:underline text-lg">
                  +995 555 19 90 90
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
                <a href="mailto:info@orbicitybatumi.com" className="text-primary hover:underline text-lg">
                  info@orbicitybatumi.com
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
                  href="https://maps.app.goo.gl/riaDxn5nAe" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Sheriff Khimshiashvili Street 7B<br/>Batumi, Georgia
                </a>
                <p className="text-sm text-muted-foreground mt-2">Seafront Location</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input 
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                  <Input 
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <Textarea 
                  placeholder="Your Message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                />
                <div className="flex gap-4">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => window.open('https://wa.me/995555199090', '_blank')}
                    className="flex-1"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message us on WhatsApp
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1 bg-gradient-gold hover:bg-secondary-dark text-secondary-foreground font-semibold"
                  >
                    Send Message
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
