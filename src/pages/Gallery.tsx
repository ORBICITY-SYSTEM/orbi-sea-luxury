import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';

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
        <div className="container mx-auto px-4 space-y-20">
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
                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
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
            <h2 className="text-3xl font-bold text-foreground mb-4">Building & Views</h2>
            <p className="text-muted-foreground mb-8">
              Discover the stunning architecture of Orbi City and the breathtaking views of the Black Sea.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.buildingViews.map((image, index) => (
                <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
                  <img 
                    src={image.url} 
                    alt={image.caption}
                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
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
            <h2 className="text-3xl font-bold text-foreground mb-4">Amenities & Common Areas</h2>
            <p className="text-muted-foreground mb-8">
              Explore the world-class amenities and elegant common spaces available to all our guests.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.amenities.map((image, index) => (
                <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
                  <img 
                    src={image.url} 
                    alt={image.caption}
                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white font-medium">{image.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Section */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Video Tour</h2>
            <p className="text-muted-foreground mb-8">
              Take a virtual tour of our property and experience the luxury firsthand.
            </p>
            <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
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

          {/* YouTube Videos */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Virtual Tours & Reviews</h2>
            <p className="text-muted-foreground mb-8">
              Watch our property tours and guest experiences.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                  title="Orbi City Batumi Tour" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                  title="Guest Experience" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Gallery;
