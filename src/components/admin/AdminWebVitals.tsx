import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Activity, Gauge, LayoutGrid, Timer, RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface MetricThresholds {
  good: number;
  needsImprovement: number;
}

const METRIC_THRESHOLDS: Record<string, MetricThresholds> = {
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
  INP: { good: 200, needsImprovement: 500 },
};

const METRIC_DESCRIPTIONS: Record<string, string> = {
  LCP: 'Largest Contentful Paint - მთავარი კონტენტის ჩატვირთვის დრო',
  FID: 'First Input Delay - პირველი ინტერაქციის დაყოვნება',
  CLS: 'Cumulative Layout Shift - ლეიაუთის სტაბილურობა',
  FCP: 'First Contentful Paint - პირველი კონტენტის გამოჩენა',
  TTFB: 'Time to First Byte - სერვერის პასუხის დრო',
  INP: 'Interaction to Next Paint - ინტერაქციის რეაქციის დრო',
};

const METRIC_ICONS: Record<string, typeof Activity> = {
  LCP: Timer,
  FID: Activity,
  CLS: LayoutGrid,
  FCP: Gauge,
  TTFB: TrendingUp,
  INP: Activity,
};

export const AdminWebVitals = () => {
  const [metrics, setMetrics] = useState<WebVitalsMetric[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'bg-green-500';
      case 'needs-improvement':
        return 'bg-yellow-500';
      case 'poor':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'good':
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">კარგი</Badge>;
      case 'needs-improvement':
        return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">გასაუმჯობესებელი</Badge>;
      case 'poor':
        return <Badge className="bg-red-500/20 text-red-600 border-red-500/30">ცუდი</Badge>;
      default:
        return <Badge variant="outline">უცნობი</Badge>;
    }
  };

  const getProgressValue = (name: string, value: number) => {
    const thresholds = METRIC_THRESHOLDS[name];
    if (!thresholds) return 50;
    
    // Calculate percentage where 100% = poor threshold
    const maxValue = thresholds.needsImprovement * 1.5;
    return Math.min((value / maxValue) * 100, 100);
  };

  const formatValue = (name: string, value: number) => {
    if (name === 'CLS') {
      return value.toFixed(3);
    }
    return `${Math.round(value)}ms`;
  };

  const getTrendIcon = (rating: string) => {
    switch (rating) {
      case 'good':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'poor':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const observeMetrics = useCallback(() => {
    const reportMetric = (metric: WebVitalsMetric) => {
      setMetrics(prev => {
        const existing = prev.findIndex(m => m.name === metric.name);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = metric;
          return updated;
        }
        return [...prev, metric];
      });
      setLastUpdate(new Date());
    };

    // LCP Observer
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
        if (lastEntry) {
          const value = lastEntry.startTime;
          reportMetric({
            name: 'LCP',
            value,
            rating: value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor',
            timestamp: Date.now(),
          });
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.warn('LCP observation not supported');
    }

    // FID Observer
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as (PerformanceEntry & { processingStart: number; startTime: number })[];
        entries.forEach((entry) => {
          const value = entry.processingStart - entry.startTime;
          reportMetric({
            name: 'FID',
            value,
            rating: value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor',
            timestamp: Date.now(),
          });
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.warn('FID observation not supported');
    }

    // CLS Observer
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[];
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        reportMetric({
          name: 'CLS',
          value: clsValue,
          rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor',
          timestamp: Date.now(),
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.warn('CLS observation not supported');
    }

    // FCP from Performance API
    try {
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        const value = fcpEntry.startTime;
        reportMetric({
          name: 'FCP',
          value,
          rating: value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor',
          timestamp: Date.now(),
        });
      }
    } catch (e) {
      console.warn('FCP not available');
    }

    // TTFB from Navigation Timing
    try {
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navEntries.length > 0) {
        const value = navEntries[0].responseStart - navEntries[0].requestStart;
        reportMetric({
          name: 'TTFB',
          value,
          rating: value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor',
          timestamp: Date.now(),
        });
      }
    } catch (e) {
      console.warn('TTFB not available');
    }

    setIsMonitoring(true);
  }, []);

  useEffect(() => {
    observeMetrics();
  }, [observeMetrics]);

  const refreshMetrics = () => {
    setMetrics([]);
    setIsMonitoring(false);
    setTimeout(() => {
      observeMetrics();
    }, 100);
  };

  const overallScore = metrics.length > 0 
    ? Math.round((metrics.filter(m => m.rating === 'good').length / metrics.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Web Vitals მონიტორინგი</h2>
          <p className="text-muted-foreground">Core Web Vitals მეტრიკები რეალურ დროში</p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdate && (
            <span className="text-sm text-muted-foreground">
              ბოლო განახლება: {lastUpdate.toLocaleTimeString('ka-GE')}
            </span>
          )}
          <Button onClick={refreshMetrics} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            განახლება
          </Button>
        </div>
      </div>

      {/* Overall Score Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            საერთო შეფასება
          </CardTitle>
          <CardDescription>Core Web Vitals-ის საერთო მდგომარეობა</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-6xl font-bold text-primary">{overallScore}%</div>
            <div className="flex-1">
              <Progress value={overallScore} className="h-4" />
              <p className="text-sm text-muted-foreground mt-2">
                {metrics.filter(m => m.rating === 'good').length} / {metrics.length} მეტრიკა კარგ მდგომარეობაშია
              </p>
            </div>
            <Badge 
              className={`text-lg px-4 py-2 ${
                overallScore >= 80 ? 'bg-green-500' : 
                overallScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
            >
              {overallScore >= 80 ? 'შესანიშნავი' : overallScore >= 50 ? 'საშუალო' : 'გასაუმჯობესებელი'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Individual Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {['LCP', 'FID', 'CLS', 'FCP', 'TTFB', 'INP'].map((metricName) => {
          const metric = metrics.find(m => m.name === metricName);
          const Icon = METRIC_ICONS[metricName] || Activity;
          const thresholds = METRIC_THRESHOLDS[metricName];

          return (
            <Card key={metricName} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    {metricName}
                  </CardTitle>
                  {metric && getTrendIcon(metric.rating)}
                </div>
                <CardDescription className="text-xs">
                  {METRIC_DESCRIPTIONS[metricName]}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {metric ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold">
                        {formatValue(metricName, metric.value)}
                      </span>
                      {getRatingBadge(metric.rating)}
                    </div>
                    <Progress 
                      value={getProgressValue(metricName, metric.value)} 
                      className={`h-2 ${getRatingColor(metric.rating)}`}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>კარგი: ≤{metricName === 'CLS' ? thresholds.good : `${thresholds.good}ms`}</span>
                      <span>ცუდი: ≥{metricName === 'CLS' ? thresholds.needsImprovement : `${thresholds.needsImprovement}ms`}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24 text-muted-foreground">
                    {isMonitoring ? 'მონაცემები არ არის' : 'იტვირთება...'}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recommendations Card */}
      <Card>
        <CardHeader>
          <CardTitle>რეკომენდაციები</CardTitle>
          <CardDescription>Web Vitals-ის გასაუმჯობესებლად</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.filter(m => m.rating !== 'good').map(metric => (
              <div key={metric.name} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${getRatingColor(metric.rating)}`} />
                <div>
                  <p className="font-medium">{metric.name} - {formatValue(metric.name, metric.value)}</p>
                  <p className="text-sm text-muted-foreground">
                    {metric.name === 'LCP' && 'გაზარდეთ hero სურათების priority, გამოიყენეთ preload და WebP ფორმატი'}
                    {metric.name === 'FID' && 'შეამცირეთ JavaScript-ის მოცულობა, გამოიყენეთ code splitting'}
                    {metric.name === 'CLS' && 'მიუთითეთ width/height ატრიბუტები სურათებზე, გამოიყენეთ aspect-ratio'}
                    {metric.name === 'FCP' && 'ოპტიმიზაცია გაუკეთეთ CSS-ს, გამოიყენეთ critical CSS'}
                    {metric.name === 'TTFB' && 'გააუმჯობესეთ სერვერის კონფიგურაცია, გამოიყენეთ CDN'}
                    {metric.name === 'INP' && 'ოპტიმიზაცია გაუკეთეთ event handlers-ს, გამოიყენეთ debouncing'}
                  </p>
                </div>
              </div>
            ))}
            {metrics.filter(m => m.rating !== 'good').length === 0 && metrics.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p className="font-medium text-foreground">ყველა მეტრიკა კარგ მდგომარეობაშია!</p>
                <p className="text-sm">თქვენი საიტი კარგად არის ოპტიმიზებული</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
