import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, CreditCard, RefreshCw, Shield, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const PurchaseConditions = () => {
  const { t } = useLanguage();

  const sections = [
    {
      icon: CreditCard,
      titleKey: 'purchase.payment.title',
      contentKey: 'purchase.payment.content',
      color: 'text-primary'
    },
    {
      icon: RefreshCw,
      titleKey: 'purchase.cancellation.title',
      contentKey: 'purchase.cancellation.content',
      color: 'text-accent'
    },
    {
      icon: Shield,
      titleKey: 'purchase.deposit.title',
      contentKey: 'purchase.deposit.content',
      color: 'text-secondary'
    },
    {
      icon: Clock,
      titleKey: 'purchase.refund.title',
      contentKey: 'purchase.refund.content',
      color: 'text-primary'
    },
  ];

  return (
    <Layout>
      <div className="relative h-[300px] bg-gradient-to-r from-primary via-accent to-secondary">
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold text-white mb-4">{t('purchase.hero.title')}</h1>
          <p className="text-xl text-white/90 max-w-2xl">{t('purchase.hero.subtitle')}</p>
        </div>
      </div>

      <Breadcrumbs items={[{ label: t('purchase.breadcrumb') }]} />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid gap-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-luxury transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className={`w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center flex-shrink-0 ${section.color}`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-foreground mb-4">{t(section.titleKey)}</h3>
                        <div className="prose prose-lg max-w-none">
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {t(section.contentKey)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Important Notes */}
          <Card className="mt-12 bg-muted/50">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{t('purchase.important.title')}</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{t('purchase.important.point1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{t('purchase.important.point2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{t('purchase.important.point3')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {t('purchase.updated')}: {t('purchase.updateDate')}
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PurchaseConditions;
