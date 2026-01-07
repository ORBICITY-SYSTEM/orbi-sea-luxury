import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useYouTubeVideos } from '@/hooks/useYouTubeVideos';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LazyImage } from '@/components/ui/lazy-image';
import { useLanguage } from '@/contexts/LanguageContext';

const galleryImages = {
  interiors: [
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/e4578176040cf98304ee3ae0477a108f.jpg', caption: 'Suite with Sea View - Bedroom' },
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/ec9c162356788e602d498e723a989de6.jpg', caption: 'Suite with Sea View - Kitchenette' },
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/78f6531862f26bbcdf6bca5ec8d7305c.jpg', caption: 'Superior Suite - Dining Area' },
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/47fe838e886d9afa24f54f2c292a93c3.jpg', caption: 'Delux Suite - Bedroom' },
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/57d1db414b4cb0734254625854a7e6d5.jpg', caption: 'Delux Suite - Kitchenette' },
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/5c6c9cc61a4deba5276ff094ac8ed11b.jpg', caption: 'Delux Suite - Living Area' },
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/bddec56c6ef5d23a4f593adcd512b633.jpg', caption: 'Superior Suite - Living Area' },
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/0922f2b1b13af96b0d24272d32439996.jpg', caption: 'Family Suite - Kitchenette' },
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/9e6c74cb7dcc746532511de0608b4b76.jpg', caption: 'Standard Bathroom' },
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/a8e056679876a0ec81cba5bb82a37322.jpg', caption: 'Family Suite - Second Bedroom' },
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/e14cbb9029dc3648799f7b8f5b50359e.jpg', caption: 'Superior Suite - Interconnecting Rooms' },
  ],
  buildingViews: [
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/afc86f5cb7e7850ab4c3434709ae453c.jpg', caption: 'Exterior View - Orbi City Towers' },
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/29683ca4a5e5c522d3bca348fa0eabb1.jpg', caption: 'Balcony Sea View' },
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/12b2972bcb9994f6e350284f65f6d745.jpg', caption: 'Night View from Balcony' },
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/636d61089bf9b6dbdef774c6f108123e.jpg', caption: 'Panoramic Sea View' },
  ],
  amenities: [
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/2d636f5f3dbcb88e5597d96aa752684e.jpg', caption: 'On-site Restaurant - Breakfast Buffet' },
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/cf7247acbf8abaabe5e3d39c96b81db3.jpg', caption: 'Elevator Hall - 40th Floor' },
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/303c40807b2e0bccf840b8ebe31b7161.jpg', caption: 'Elevator Hall' },
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/078d21c514da0ed8384da7474442f374.jpg', caption: 'Main Lobby' },
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/e04fa4f0c83b330812e44e5772ffc3c6.jpg', caption: 'Elegant hotel lobby with marble floors' },
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/755d262231af5921623772da76ea56c7.jpg', caption: 'Luxury Lobby Interior' },
  ],
};

const Gallery = () => {
  const { t } = useLanguage();
  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      
      return data.reduce((acc, setting) => {
        acc[setting.key] = setting.value || '';
        return acc;
      }, {} as Record<string, string>);
    },
  });

  const YOUTUBE_CHANNEL_ID = settings?.youtube_channel_id || '';
  
  const { data: youtubeVideos, isLoading: videosLoading, error: videosError } = useYouTubeVideos(YOUTUBE_CHANNEL_ID);

  return (
    <Layout>
      {/* Hero */}
      <div 
        className="relative h-96 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/47fe838e886d9afa24f54f2c292a93c3.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 drop-shadow-[0_4px_8px_rgba(212,175,55,0.4)] [text-shadow:_0_1px_0_rgb(255_255_255_/_40%),_0_4px_12px_rgba(212,175,55,0.5)]">{t('gallery.title')}</h1>
          <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-200 to-gold-300 drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)]">{t('gallery.subtitle')}</p>
        </div>
      </div>

      <Breadcrumbs items={[{ label: t('nav.gallery') }]} />

      {/* Gallery Tabs */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="photos" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="photos" className="text-lg">{t('gallery.photos')}</TabsTrigger>
              <TabsTrigger value="videos" className="text-lg">{t('gallery.videos')}</TabsTrigger>
            </TabsList>

            {/* Photos Tab */}
            <TabsContent value="photos" className="space-y-20">
              {/* Apartment Interiors */}
              <div>
                <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)]">{t('gallery.interiors')}</h2>
                <p className="text-muted-foreground mb-8">
                  {t('gallery.interiorsDesc')}
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryImages.interiors.map((image, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
                      <LazyImage 
                        src={image.url} 
                        alt={image.caption}
                        className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p className="text-white font-medium">{image.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Building & Views */}
              <div>
                <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)]">{t('gallery.buildingViews')}</h2>
                <p className="text-muted-foreground mb-8">
                  {t('gallery.buildingViewsDesc')}
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryImages.buildingViews.map((image, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
                      <LazyImage 
                        src={image.url} 
                        alt={image.caption}
                        className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p className="text-white font-medium">{image.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities & Common Areas */}
              <div>
                <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)]">{t('gallery.amenitiesAreas')}</h2>
                <p className="text-muted-foreground mb-8">
                  {t('gallery.amenitiesAreasDesc')}
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryImages.amenities.map((image, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
                      <LazyImage 
                        src={image.url} 
                        alt={image.caption}
                        className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p className="text-white font-medium">{image.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos" className="space-y-12">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)]">{t('gallery.videoTour')}</h2>
                <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
                  {t('gallery.videoTourDesc')}
                </p>
                
                {/* Local Video */}
                <div className="max-w-5xl mx-auto mb-16">
                  <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
                    <video
                      controls
                      className="w-full h-full object-cover"
                      poster="https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/636d61089bf9b6dbdef774c6f108123e.jpg"
                    >
                      <source src="/videos/hero-video.mov" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>

                {/* YouTube Videos Grid */}
                {!YOUTUBE_CHANNEL_ID ? (
                  <Alert className="max-w-2xl mx-auto">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {t('gallery.youtubeNotConfigured')}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-foreground mb-6 text-center">{t('gallery.youtubeChannel')}</h3>
                    
                    {videosError && (
                      <Alert variant="destructive" className="max-w-2xl mx-auto mb-8">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {t('gallery.youtubeError')}
                        </AlertDescription>
                      </Alert>
                    )}

                    {videosLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="space-y-3">
                        <Skeleton className="aspect-video rounded-xl" />
                        <Skeleton className="h-6 w-3/4" />
                      </div>
                    ))}
                  </div>
                ) : youtubeVideos && youtubeVideos.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {youtubeVideos.map((video) => (
                      <div key={video.id} className="group">
                        <div className="aspect-video rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                          <iframe 
                            width="100%" 
                            height="100%" 
                            src={`https://www.youtube.com/embed/${video.id}`}
                            title={video.title}
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                        <h4 className="mt-3 font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {video.title}
                        </h4>
                      </div>
                    ))}
                  </div>
                    ) : (
                      <Alert className="max-w-2xl mx-auto">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {t('gallery.noVideos')}
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Gallery;
