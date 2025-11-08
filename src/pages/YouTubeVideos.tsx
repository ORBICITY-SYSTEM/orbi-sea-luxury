import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useYouTubeVideos } from '@/hooks/useYouTubeVideos';
import { useLanguage } from '@/contexts/LanguageContext';
import { Play } from 'lucide-react';
import { useEffect } from 'react';
import { trackPageView } from '@/lib/tracking';

const YouTubeVideos = () => {
  const { t } = useLanguage();
  const channelId = 'UC3YPMVgwMBJWPvY1IjD8UFQ';
  const { data: videos, isLoading, error } = useYouTubeVideos(channelId);

  useEffect(() => {
    trackPageView();
  }, []);

  return (
    <Layout>
      <div 
        className="relative h-[300px] bg-cover bg-center"
        style={{ backgroundImage: 'url(https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/a0d87736a9a433465e412befdeca2b5d.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('youtubeVideos.title')}</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            {t('youtubeVideos.subtitle')}
          </p>
        </div>
      </div>

      <Breadcrumbs items={[{ label: t('youtubeVideos.breadcrumb') }]} />

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="w-full aspect-video" />
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {t('youtubeVideos.error')}
                </AlertDescription>
              </Alert>
            )}

            {videos && videos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map((video) => (
                  <Card 
                    key={video.id} 
                    className="group cursor-pointer hover:shadow-elegant transition-all duration-300 overflow-hidden border-border/50 bg-card hover:border-primary/30"
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
                  >
                    <div className="relative aspect-video overflow-hidden bg-gradient-subtle">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-overlay opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-gold group-hover:scale-110 flex items-center justify-center transition-all duration-300 shadow-gold">
                          <Play className="w-10 h-10 text-secondary-foreground fill-secondary-foreground ml-1" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6 bg-card">
                      <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
                        {video.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
                        {video.description || t('youtubeVideos.noDescription')}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
                        <span className="font-medium">
                          {new Date(video.publishedAt).toLocaleDateString('ka-GE', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="text-primary font-semibold group-hover:underline">
                          {t('youtubeVideos.watchNow')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {videos && videos.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">{t('youtubeVideos.noVideos')}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default YouTubeVideos;
