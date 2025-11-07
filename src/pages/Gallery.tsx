import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const galleryImages = {
  interiors: [
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/e4578176040cf98304ee3ae0477a108f.jpg', caption: 'Suite with Sea View - Bedroom' },
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/ec9c162356788e602d498e723a989de6.jpg', caption: 'Suite with Sea View - Kitchenette' },
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/78f6531862f26bbcdf6bca5ec8d7305c.jpg', caption: 'Superior Suite - Dining Area' },
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/47fe838e886d9afa24f54f2c292a93c3.jpg', caption: 'Delux Suite - Bedroom' },
  ],
  views: [
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/636d61089bf9b6dbdef774c6f108123e.jpg', caption: 'Panoramic Sea View' },
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/29683ca4a5e5c522d3bca348fa0eabb1.jpg', caption: 'Stunning sea view from balcony' },
    { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/12b2972bcb9994f6e350284f65f6d745.jpg', caption: 'Night view of Batumi coastline' },
  ],
};

const Gallery = () => {
  return (
    <Layout>
      {/* Hero */}
      <div 
        className="relative h-[400px] bg-cover bg-center"
        style={{ backgroundImage: 'url(https://storage.googleapis.com/hostinger-horizons-assets-prod/b7134a16-4d20-4990-bbc6-0f01fe63442b/47fe838e886d9afa24f54f2c292a93c3.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Our Gallery</h1>
          <p className="text-xl text-white/90">A glimpse into the luxury and beauty of Orbi City Batumi</p>
        </div>
      </div>

      <Breadcrumbs items={[{ label: 'Gallery' }]} />

      {/* Gallery Sections */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 space-y-16">
          {/* Apartment Interiors */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Apartment Interiors</h2>
            <p className="text-muted-foreground mb-8">
              Step inside our luxurious and comfortable apartments, designed for your ultimate relaxation.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.interiors.map((image, index) => (
                <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
                  <img 
                    src={image.url} 
                    alt={image.caption}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white font-medium">{image.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sea Views */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Breathtaking Views</h2>
            <p className="text-muted-foreground mb-8">
              Experience stunning panoramic views of the Black Sea from your private balcony.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.views.map((image, index) => (
                <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
                  <img 
                    src={image.url} 
                    alt={image.caption}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white font-medium">{image.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Gallery;
