import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const PurchaseConditions = () => {
  return (
    <Layout>
      <div className="relative h-[250px] bg-[#2C3E50]">
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl font-bold text-white">Purchase Conditions</h1>
        </div>
      </div>

      <Breadcrumbs items={[{ label: 'Purchase Conditions' }]} />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">Payment Terms</h3>
              <p className="text-muted-foreground">
                Payment can be made via bank transfer, credit/debit card, or cash upon arrival. Full payment 
                is required at check-in unless otherwise arranged in advance.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">Cancellation Policy</h3>
              <p className="text-muted-foreground">
                Cancellations made more than 7 days before arrival receive a full refund minus processing fees. 
                Cancellations within 7 days are subject to a cancellation fee. No-shows result in full charge.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">Deposits</h3>
              <p className="text-muted-foreground">
                A security deposit may be required upon check-in. This deposit will be refunded after inspection 
                of the apartment, provided no damage has occurred.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">Refund Policy</h3>
              <p className="text-muted-foreground">
                Refunds are processed within 14 business days to the original payment method. Service charges 
                and processing fees are non-refundable.
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

export default PurchaseConditions;
