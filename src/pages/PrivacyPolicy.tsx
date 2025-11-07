import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="relative h-[250px] bg-[#2C3E50]">
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
        </div>
      </div>

      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            <div>
              <p className="text-muted-foreground mb-4">
                At Orbi City Batumi, we are committed to protecting your privacy and ensuring the security of your personal information.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Data Collection</h2>
              <p className="text-muted-foreground">
                We collect personal information necessary for booking and providing our services, including name, contact details, 
                and payment information. This data is collected with your consent and used solely for the purposes of your stay.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Data Protection</h2>
              <p className="text-muted-foreground">
                We implement industry-standard security measures to protect your personal data from unauthorized access, 
                alteration, disclosure, or destruction. Your information is stored securely and accessed only by authorized personnel.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, 
                or as required by law. You have the right to request deletion of your personal data at any time.
              </p>
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                Last updated: January 2025
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
