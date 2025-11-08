import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useYouTubeVideos } from '@/hooks/useYouTubeVideos';
import { useLanguage } from '@/contexts/LanguageContext';
import { Play, Star, Building2, Users, MapPin, Sparkles } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { trackPageView } from '@/lib/tracking';

// Category keywords for filtering
const categoryKeywords = {
  propertyTours: ['tour', 'apartment', 'room', 'suite', 'property', 'აპარტამენტი', 'ტური', 'ოთახი'],
  testimonials: ['review', 'testimonial', 'guest', 'experience', 'მიმოხილვა', 'სტუმარი'],
  areaGuide: ['batumi', 'location', 'area', 'city', 'beach', 'ბათუმი', 'ლოკაცია', 'პლაჟი'],
  amenities: ['amenity', 'pool', 'gym', 'spa', 'restaurant', 'სერვისი', 'აუზი', 'რესტორანი'],
};

const categorizeVideo = (video: any) => {
  const text = `${video.title} ${video.description}`.toLowerCase();
  
  if (categoryKeywords.propertyTours.some(keyword => text.includes(keyword.toLowerCase()))) {
    return 'propertyTours';
  }
  if (categoryKeywords.testimonials.some(keyword => text.includes(keyword.toLowerCase()))) {
    return 'testimonials';
  }
  if (categoryKeywords.areaGuide.some(keyword => text.includes(keyword.toLowerCase()))) {
    return 'areaGuide';
  }
  if (categoryKeywords.amenities.some(keyword => text.includes(keyword.toLowerCase()))) {
    return 'amenities';
  }
  return 'propertyTours'; // Default category
};

const YouTubeVideos = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const channelId = 'UC3YPMVgwMBJWPvY1IjD8UFQ';
  const { data: videos, isLoading, error } = useYouTubeVideos(channelId);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    trackPageView();
    // Check if there's a type parameter in URL and switch to property tours
    const typeParam = searchParams.get('type');
    if (typeParam) {
      setSelectedCategory('propertyTours');
    }
  }, [searchParams]);

  const categorizedVideos = useMemo(() => {
    if (!videos) return { all: [], propertyTours: [], testimonials: [], areaGuide: [], amenities: [] };
    
    const categories: any = {
      all: videos,
      propertyTours: [],
      testimonials: [],
      areaGuide: [],
      amenities: [],
    };

    videos.forEach((video) => {
      const category = categorizeVideo(video);
      categories[category].push(video);
    });

    return categories;
  }, [videos]);

  const featuredVideo = videos && videos.length > 0 ? videos[0] : null;
  const displayVideos = selectedCategory === 'all' ? videos?.slice(1) : categorizedVideos[selectedCategory];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'propertyTours': return <Building2 className="w-4 h-4" />;
      case 'testimonials': return <Users className="w-4 h-4" />;
      case 'areaGuide': return <MapPin className="w-4 h-4" />;
      case 'amenities': return <Sparkles className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <Layout>
      <div 
        className="relative h-[300px] bg-cover bg-center"
        style={{ backgroundImage: 'url(https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/a0d87736a9a433465e412befdeca2b5d.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">{t('youtubeVideos.title')}</h1>
          <p className="text-xl text-white/90 max-w-3xl animate-fade-in">
            {t('youtubeVideos.subtitle')}
          </p>
        </div>
      </div>

      <Breadcrumbs items={[{ label: t('youtubeVideos.breadcrumb') }]} />

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {isLoading && (
              <div className="space-y-8">
                <Card>
                  <Skeleton className="w-full aspect-video md:aspect-[21/9]" />
                  <CardContent className="p-6">
                    <Skeleton className="h-8 w-2/3 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
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
              <div className="space-y-12">
                {/* Featured Video */}
                {featuredVideo && (
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-2 mb-6">
                      <Star className="w-6 h-6 text-primary fill-primary" />
                      <h2 className="text-3xl font-bold text-foreground">{t('youtubeVideos.featured')}</h2>
                    </div>
                    <Card 
                      className="group cursor-pointer hover:shadow-elegant transition-all duration-500 overflow-hidden border-primary/30 bg-card"
                      onClick={() => window.open(`https://www.youtube.com/watch?v=${featuredVideo.id}`, '_blank')}
                    >
                      <div className="grid md:grid-cols-2 gap-0">
                        <div className="relative aspect-video md:aspect-square overflow-hidden bg-gradient-subtle">
                          <img
                            src={featuredVideo.thumbnail}
                            alt={featuredVideo.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-overlay opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-gold group-hover:scale-110 flex items-center justify-center transition-all duration-300 shadow-gold animate-pulse">
                              <Play className="w-12 h-12 text-secondary-foreground fill-secondary-foreground ml-1" />
                            </div>
                          </div>
                          <Badge className="absolute top-4 left-4 bg-gradient-gold text-secondary-foreground font-bold shadow-gold">
                            {t('youtubeVideos.featured')}
                          </Badge>
                        </div>
                        <CardContent className="p-8 flex flex-col justify-center">
                          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                            {featuredVideo.title}
                          </h3>
                          <p className="text-base text-muted-foreground mb-6 leading-relaxed line-clamp-4">
                            {featuredVideo.description || t('youtubeVideos.noDescription')}
                          </p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border/50">
                            <span className="font-medium">
                              {new Date(featuredVideo.publishedAt).toLocaleDateString('ka-GE', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                            <span className="text-primary font-bold group-hover:underline text-lg">
                              {t('youtubeVideos.watchNow')} →
                            </span>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Category Tabs */}
                <div className="animate-fade-in">
                  <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedCategory}>
                    <div className="flex items-center justify-center mb-8">
                      <TabsList className="bg-muted/50 p-1.5 backdrop-blur-sm">
                        <TabsTrigger value="all" className="data-[state=active]:bg-gradient-gold data-[state=active]:text-secondary-foreground">
                          {t('youtubeVideos.category.all')}
                        </TabsTrigger>
                        <TabsTrigger value="propertyTours" className="data-[state=active]:bg-gradient-gold data-[state=active]:text-secondary-foreground">
                          <Building2 className="w-4 h-4 mr-2" />
                          {t('youtubeVideos.category.propertyTours')}
                        </TabsTrigger>
                        <TabsTrigger value="testimonials" className="data-[state=active]:bg-gradient-gold data-[state=active]:text-secondary-foreground">
                          <Users className="w-4 h-4 mr-2" />
                          {t('youtubeVideos.category.testimonials')}
                        </TabsTrigger>
                        <TabsTrigger value="areaGuide" className="data-[state=active]:bg-gradient-gold data-[state=active]:text-secondary-foreground">
                          <MapPin className="w-4 h-4 mr-2" />
                          {t('youtubeVideos.category.areaGuide')}
                        </TabsTrigger>
                        <TabsTrigger value="amenities" className="data-[state=active]:bg-gradient-gold data-[state=active]:text-secondary-foreground">
                          <Sparkles className="w-4 h-4 mr-2" />
                          {t('youtubeVideos.category.amenities')}
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value={selectedCategory} className="mt-0">
                      {displayVideos && displayVideos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {displayVideos.map((video: any, index: number) => (
                            <Card 
                              key={video.id} 
                              className="group cursor-pointer hover:shadow-elegant transition-all duration-300 overflow-hidden border-border/50 bg-card hover:border-primary/30 animate-fade-in"
                              style={{ animationDelay: `${index * 50}ms` }}
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
                                {selectedCategory !== 'all' && (
                                  <Badge className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm">
                                    <span className="flex items-center gap-1">
                                      {getCategoryIcon(selectedCategory)}
                                      {t(`youtubeVideos.category.${selectedCategory}`)}
                                    </span>
                                  </Badge>
                                )}
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
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground text-lg">{t('youtubeVideos.noVideosInCategory')}</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
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
