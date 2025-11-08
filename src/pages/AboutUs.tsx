import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Heart, TrendingUp, Users2, Building2, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutUs = () => {
  const { t } = useLanguage();

  const values = [
    { icon: Heart, titleKey: 'about.value1.title', descKey: 'about.value1.desc' },
    { icon: Award, titleKey: 'about.value2.title', descKey: 'about.value2.desc' },
    { icon: TrendingUp, titleKey: 'about.value3.title', descKey: 'about.value3.desc' },
  ];

  const stats = [
    { number: '250+', labelKey: 'about.stat1' },
    { number: '50k+', labelKey: 'about.stat2' },
    { number: '4.9/5', labelKey: 'about.stat3' },
    { number: '24/7', labelKey: 'about.stat4' },
  ];

  const gallery = [
    'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/755d262231af5921623772da76ea56c7.jpg',
    'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/29683ca4a5e5c522d3bca348fa0eabb1.jpg',
    'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/12b2972bcb9994f6e350284f65f6d745.jpg',
    'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/0922f2b1b13af96b0d24272d32439996.jpg',
    'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/47fe838e886d9afa24f54f2c292a93c3.jpg',
    'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/78f6531862f26bbcdf6bca5ec8d7305c.jpg',
  ];

  return (
    <Layout>
      <div className="relative h-[400px] bg-gradient-to-r from-primary via-accent to-secondary">
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <Building2 className="w-16 h-16 text-white mb-4" />
          <h1 className="text-5xl font-bold text-white mb-4">{t('about.hero.title')}</h1>
          <p className="text-xl text-white/90 max-w-3xl">{t('about.hero.subtitle')}</p>
        </div>
      </div>

      <Breadcrumbs items={[{ label: t('nav.about') }]} />

      {/* Story */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">{t('about.story.title')}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{t('about.story.p1')}</p>
                <p>{t('about.story.p2')}</p>
                <p>{t('about.story.p3')}</p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/755d262231af5921623772da76ea56c7.jpg"
                alt="Orbi City Batumi"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-luxury transition-all">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{t('about.mission.title')}</h3>
                <p className="text-muted-foreground">{t('about.mission.desc')}</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-luxury transition-all">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center mb-6">
                  <Users2 className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{t('about.vision.title')}</h3>
                <p className="text-muted-foreground">{t('about.vision.desc')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">{t('about.values.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('about.values.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-gold flex items-center justify-center">
                      <Icon className="w-8 h-8 text-secondary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{t(value.titleKey)}</h3>
                    <p className="text-muted-foreground">{t(value.descKey)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-sea">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/90">{t(stat.labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">{t('about.gallery.title')}</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((image, index) => (
              <div key={index} className="relative h-64 overflow-hidden rounded-lg group">
                <img 
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutUs;
