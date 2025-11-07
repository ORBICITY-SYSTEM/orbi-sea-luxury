import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const TermsAndConditions = () => {
  return (
    <Layout>
      <div className="relative h-[250px] bg-[#2C3E50]">
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl font-bold text-white">Terms and Conditions</h1>
        </div>
      </div>

      <Breadcrumbs items={[{ label: 'Terms and Conditions' }]} />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">User Rights</h3>
              <p className="text-muted-foreground">
                Guests have the right to enjoy the facilities and services provided by Orbi City Batumi. 
                You are entitled to a clean, safe, and comfortable environment during your stay.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">User Responsibilities</h3>
              <p className="text-muted-foreground">
                Guests are responsible for respecting property rules, maintaining cleanliness, and ensuring no damage 
                occurs to the apartment or facilities. Any damages will be charged to the guest.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">Booking Rules</h3>
              <p className="text-muted-foreground">
                Bookings are confirmed upon receipt of payment or deposit. Cancellation policies apply as per the rate 
                selected at the time of booking. Check-in time is 14:00 and check-out is 12:00.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">Liability</h3>
              <p className="text-muted-foreground">
                Orbi City Batumi is not liable for loss or damage to personal belongings. Guests are advised to use 
                in-room safes for valuables. We maintain insurance as required by Georgian law.
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

export default TermsAndConditions;
