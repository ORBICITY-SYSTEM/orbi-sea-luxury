import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Gift, Award, TrendingUp, Users, Crown, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { LoyaltyDashboard } from '@/components/LoyaltyDashboard';
import WelcomeBonusCard from '@/components/WelcomeBonusCard';

const LoyaltyProgram = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const steps = [
    {
      icon: Users,
      titleKey: 'loyalty.step1.title',
      descKey: 'loyalty.step1.desc',
    },
    {
      icon: TrendingUp,
      titleKey: 'loyalty.step2.title',
      descKey: 'loyalty.step2.desc',
    },
    {
      icon: Gift,
      titleKey: 'loyalty.step3.title',
      descKey: 'loyalty.step3.desc',
    },
  ];

  const benefits = [
    { icon: Star, textKey: 'loyalty.benefit1' },
    { icon: Gift, textKey: 'loyalty.benefit2' },
    { icon: Award, textKey: 'loyalty.benefit3' },
    { icon: Crown, textKey: 'loyalty.benefit4' },
    { icon: Sparkles, textKey: 'loyalty.benefit5' },
  ];

  const testimonials = [
    {
      name: 'ნინო ღვინიაშვილი',
      text: 'loyalty.testimonial1',
      rating: 5,
    },
    {
      name: 'გიორგი მელაძე',
      text: 'loyalty.testimonial2',
      rating: 5,
    },
  ];

  return (
    <Layout>
      <div className="relative h-96 bg-gradient-sea">
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <Crown className="w-20 h-20 text-gold-400 mb-6 animate-pulse drop-shadow-[0_4px_12px_rgba(212,175,55,0.6)]" />
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 drop-shadow-[0_4px_8px_rgba(212,175,55,0.4)] [text-shadow:_0_1px_0_rgb(255_255_255_/_40%),_0_4px_12px_rgba(212,175,55,0.5)]">{t('loyalty.hero.title')}</h1>
          <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-200 to-gold-300 drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)] max-w-2xl mb-8">{t('loyalty.hero.subtitle')}</p>
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-gold hover:bg-secondary-dark text-secondary-foreground font-bold shadow-gold">
              {t('loyalty.hero.cta')}
            </Button>
          </Link>
        </div>
      </div>

      <Breadcrumbs items={[{ label: t('nav.loyalty') }]} />

      {/* 20 GEL Welcome Bonus Banner */}
      <section className="py-16 bg-gradient-to-b from-blue-50 via-cyan-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <WelcomeBonusCard />
          </div>
        </div>
      </section>

      {/* User's Loyalty Dashboard */}
      {user && (
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 max-w-2xl">
            <LoyaltyDashboard />
          </div>
        </section>
      )}

      {/* How it Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)]">{t('loyalty.howItWorks.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('loyalty.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index} className="text-center hover:shadow-luxury transition-all">
                  <CardContent className="p-8">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-gold flex items-center justify-center">
                      <Icon className="w-10 h-10 text-secondary-foreground" />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-4">{index + 1}</div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{t(step.titleKey)}</h3>
                    <p className="text-muted-foreground">{t(step.descKey)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)]">{t('loyalty.benefits.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('loyalty.benefits.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <p className="text-foreground flex-1 pt-2">{t(benefit.textKey)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)]">{t('loyalty.testimonials.title')}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-luxury transition-all">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{t(testimonial.text)}"</p>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-sea">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 drop-shadow-[0_4px_8px_rgba(212,175,55,0.4)] [text-shadow:_0_1px_0_rgb(255_255_255_/_40%),_0_4px_12px_rgba(212,175,55,0.5)]">{t('loyalty.cta.title')}</h2>
          <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-200 to-gold-300 drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)] mb-8 max-w-2xl mx-auto">{t('loyalty.cta.subtitle')}</p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold">
              {t('loyalty.cta.button')}
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default LoyaltyProgram;
