import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const AboutUs = () => {
  return (
    <Layout>
      <div className="relative h-[300px] bg-[#2C3E50]">
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold text-white mb-4">About Us</h1>
          <p className="text-xl text-white/90">Your home away from home in Batumi</p>
        </div>
      </div>

      <Breadcrumbs items={[{ label: 'About Us' }]} />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-foreground mb-6">Welcome to Orbi City Batumi</h2>
            <p className="text-muted-foreground mb-6">
              Discover unparalleled luxury at Orbi City, where every apartment offers breathtaking Black Sea views 
              and five-star comfort. Located in the heart of Batumi, Georgia, we provide premium serviced apartments 
              that combine the comfort of home with the luxury of a hotel.
            </p>
            <p className="text-muted-foreground mb-6">
              Our modern apartments feature fully equipped kitchenettes, spacious living areas, and stunning sea views. 
              Whether you're traveling for business or pleasure, solo or with family, we have the perfect accommodation 
              for your needs.
            </p>
            <p className="text-muted-foreground">
              With 24/7 reception, premium amenities, and a prime location just 50 meters from the beach, 
              Orbi City Batumi is your gateway to an unforgettable Georgian experience.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutUs;
