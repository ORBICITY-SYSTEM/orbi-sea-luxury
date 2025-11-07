import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const LoyaltyProgram = () => {
  return (
    <Layout>
      <div className="relative h-[300px] bg-gradient-sea">
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Loyalty Program</h1>
          <p className="text-xl text-white/90">Earn rewards with every stay</p>
        </div>
      </div>

      <Breadcrumbs items={[{ label: 'Loyalty Program' }]} />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our exclusive loyalty program is launching soon. Join us to earn points, enjoy special discounts, 
            and access exclusive member benefits.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default LoyaltyProgram;
