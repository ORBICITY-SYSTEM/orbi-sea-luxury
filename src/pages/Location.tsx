import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { LocationSection } from '@/components/LocationSection';
import { useLanguage } from '@/contexts/LanguageContext';

const Location = () => {
  const { t } = useLanguage();
  
  return (
    <Layout>
      {/* Hero */}
      <div className="relative h-[400px] bg-gradient-to-r from-primary via-accent to-secondary">
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold text-white mb-4">{t('location.page.title')}</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            {t('location.page.subtitle')}
          </p>
        </div>
      </div>

      <Breadcrumbs items={[{ label: t('nav.location') }]} />

      {/* Use the LocationSection component */}
      <LocationSection />
    </Layout>
  );
};

export default Location;
