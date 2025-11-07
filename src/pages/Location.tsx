import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock } from 'lucide-react';

const Location = () => {
  return (
    <Layout>
      {/* Hero */}
      <div className="relative h-[300px] bg-[#2C3E50]">
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Our Location</h1>
          <p className="text-xl text-white/90">Perfectly positioned in the heart of Batumi</p>
        </div>
      </div>

      <Breadcrumbs items={[{ label: 'Location' }]} />

      {/* Location Details */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-luxury h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2950.5!2d41.642!3d41.644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40678166e3f0b5a9%3A0x1234567890!2sOrbi%20City%20Batumi!5e0!3m2!1sen!2sge!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Orbi City Location"
              />
            </div>

            {/* Details */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Address</h3>
                      <a 
                        href="https://maps.app.goo.gl/riaDxn5nAe"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Orbi City, Block C, Khimshiashvili St, Batumi
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Business Hours</h3>
                      <p className="text-muted-foreground">24/7 Reception</p>
                      <p className="text-muted-foreground">Check-in: 14:00 | Check-out: 12:00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">Why Our Location?</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• 50 meters from the beach</li>
                    <li>• Walking distance to Batumi Boulevard</li>
                    <li>• 5 km from Batumi International Airport</li>
                    <li>• Surrounded by restaurants and cafes</li>
                    <li>• Easy access to public transport</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Location;
