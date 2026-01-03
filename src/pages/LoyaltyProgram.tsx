import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Gift, Award, TrendingUp, Users, Crown, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { LoyaltyDashboard } from '@/components/LoyaltyDashboard';

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
          <Crown className="w-20 h-20 text-secondary mb-6 animate-pulse" />
          <h1 className="text-5xl font-bold text-white mb-4">{t('loyalty.hero.title')}</h1>
          <p className="text-xl text-white/90 max-w-2xl mb-8">{t('loyalty.hero.subtitle')}</p>
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-gold hover:bg-secondary-dark text-secondary-foreground font-bold shadow-gold">
              {t('loyalty.hero.cta')}
            </Button>
          </Link>
        </div>
      </div>

      <Breadcrumbs items={[{ label: t('nav.loyalty') }]} />

      {/* 20 GEL Welcome Bonus Banner */}
      <section className="py-12 bg-gradient-to-r from-gold-50 via-white to-gold-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-luxury border border-gold-200 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center">
              {/* Gift Visual */}
              <div className="w-full md:w-1/3 bg-gradient-gold p-8 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-4 animate-pulse">
                  <Gift className="w-14 h-14 text-secondary-foreground" />
                </div>
                <div className="text-5xl font-bold text-secondary-foreground mb-2">20₾</div>
                <p className="text-secondary-foreground/80 text-sm uppercase tracking-wider">
                  {language === 'ka' ? 'სასაჩუქრე ბონუსი' : 'Welcome Bonus'}
                </p>
              </div>
              
              {/* Content */}
              <div className="flex-1 p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  {language === 'ka' 
                    ? '🎉 დარეგისტრირდით და მიიღეთ 20₾ საჩუქრად!' 
                    : '🎉 Register Now & Get 20 GEL Free!'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {language === 'ka' 
                    ? 'ყველა ახალ წევრს ვაჩუქებთ 20 ლარის ბონუს კრედიტს, რომლის გამოყენებაც შესაძლებელია პირველივე დაჯავშნისას. გახდით ჩვენი ლოიალური მომხმარებელი და ისარგებლეთ ექსკლუზიური ფასდაკლებებით!' 
                    : 'Every new member receives 20 GEL bonus credit to use on their first booking. Join our loyalty program and enjoy exclusive discounts on all future stays!'}
                </p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{language === 'ka' ? 'მყისიერი აქტივაცია' : 'Instant activation'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{language === 'ka' ? 'ვადა არ აქვს' : 'No expiration'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{language === 'ka' ? 'უფასო გაწევრიანება' : 'Free to join'}</span>
                  </div>
                </div>
                
                {!user && (
                  <Link to="/auth">
                    <Button size="lg" className="bg-gradient-gold hover:bg-secondary-dark text-secondary-foreground font-bold shadow-gold">
                      <Gift className="w-5 h-5 mr-2" />
                      {language === 'ka' ? 'დარეგისტრირდი და მიიღე 20₾' : 'Register & Get 20 GEL'}
                    </Button>
                  </Link>
                )}
                
                {user && (
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Crown className="w-5 h-5" />
                    {language === 'ka' ? 'თქვენ უკვე ლოიალური წევრი ხართ!' : 'You are already a loyalty member!'}
                  </div>
                )}
              </div>
            </div>
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
            <h2 className="text-4xl font-bold text-foreground mb-4">{t('loyalty.howItWorks.title')}</h2>
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
            <h2 className="text-4xl font-bold text-foreground mb-4">{t('loyalty.benefits.title')}</h2>
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
            <h2 className="text-4xl font-bold text-foreground mb-4">{t('loyalty.testimonials.title')}</h2>
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
          <h2 className="text-4xl font-bold text-white mb-6">{t('loyalty.cta.title')}</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">{t('loyalty.cta.subtitle')}</p>
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
