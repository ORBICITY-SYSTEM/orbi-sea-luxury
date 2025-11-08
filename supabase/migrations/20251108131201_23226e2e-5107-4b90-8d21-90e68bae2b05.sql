-- Create seo_pages table for per-page SEO settings
CREATE TABLE IF NOT EXISTS public.seo_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT UNIQUE NOT NULL,
  page_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  keywords TEXT,
  og_image TEXT,
  canonical_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.seo_pages ENABLE ROW LEVEL SECURITY;

-- Anyone can view active SEO pages
CREATE POLICY "Anyone can view active SEO pages"
ON public.seo_pages
FOR SELECT
USING (is_active = true);

-- Admins can manage SEO pages
CREATE POLICY "Admins can manage SEO pages"
ON public.seo_pages
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at trigger
CREATE TRIGGER update_seo_pages_updated_at
BEFORE UPDATE ON public.seo_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default SEO settings for main pages
INSERT INTO public.seo_pages (page_path, page_name, title, description, keywords) VALUES
  ('/', 'Home', 'Orbi City Batumi - Luxury Apartments with Sea View | Book Your Perfect Stay', 'Discover luxury apartments in Orbi City Batumi. Premium accommodations with breathtaking sea views, modern amenities, and prime seafront location. Book now and pay later.', 'Orbi City Batumi, luxury apartments Batumi, sea view apartments, Batumi accommodation, Georgia hotels'),
  ('/apartments', 'Apartments', 'Our Apartments - Orbi City Batumi | Suite, Deluxe & Family Rooms', 'Explore our range of beautifully designed apartments: from intimate suites to spacious family rooms. Find your perfect sanctuary by the sea at Orbi City Batumi.', 'Batumi apartments, suite with sea view, family apartments, deluxe rooms'),
  ('/amenities', 'Amenities', 'Hotel Amenities - Orbi City Batumi | Pool, Spa & Entertainment', 'Experience world-class amenities at Orbi City: outdoor pools, spa, fitness center, restaurants, and entertainment facilities. Everything for a perfect vacation.', 'hotel amenities, Batumi pool, spa Batumi, fitness center'),
  ('/gallery', 'Gallery', 'Photo Gallery - Orbi City Batumi | View Our Stunning Apartments', 'Browse our photo gallery and see the beauty of Orbi City Batumi. Stunning apartments, breathtaking views, and luxury facilities captured in images.', 'Batumi hotel photos, apartment gallery, Orbi City images'),
  ('/location', 'Location', 'Location & Map - Orbi City Batumi | Seafront Prime Location', 'Orbi City is perfectly located on Sheriff Khimshiashvili Street, offering direct access to the beach and proximity to Batumi''s main attractions.', 'Batumi location, Orbi City map, seafront hotel, Batumi beach'),
  ('/contact', 'Contact', 'Contact Us - Orbi City Batumi | Book Now & Get Assistance', 'Get in touch with Orbi City Batumi. Book your stay, ask questions, or request assistance. Available 24/7 via phone, email, or WhatsApp.', 'contact Orbi City, book apartment Batumi, hotel contact'),
  ('/loyalty-program', 'Loyalty Program', 'Loyalty Program - Orbi City Batumi | Earn Rewards & Benefits', 'Join our loyalty program and earn points with every stay. Enjoy exclusive benefits, discounts, and special offers at Orbi City Batumi.', 'loyalty program, hotel rewards, Batumi benefits'),
  ('/about-us', 'About Us', 'About Us - Orbi City Batumi | Your Home Away From Home', 'Learn about Orbi City Batumi - a luxury apartment complex offering world-class hospitality in the heart of Georgia''s coastal gem.', 'about Orbi City, Batumi hospitality, luxury hotel Georgia')
ON CONFLICT (page_path) DO NOTHING;

-- Add global SEO settings to site_settings
INSERT INTO site_settings (key, value, description) VALUES
  ('site_name', 'Orbi City Batumi', 'Site name for SEO'),
  ('site_tagline', 'Luxury Apartments with Sea View', 'Site tagline/slogan'),
  ('default_og_image', 'https://horizons-cdn.hostinger.com/b7134a16-4d20-4990-bbc6-0f01fe63442b/a0d87736a9a433465e412befdeca2b5d.jpg', 'Default Open Graph image URL'),
  ('twitter_handle', '@orbicitybatumi', 'Twitter/X handle'),
  ('company_legal_name', 'Orbi City Batumi LLC', 'Legal company name'),
  ('company_founding_year', '2020', 'Company founding year')
ON CONFLICT (key) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX idx_seo_pages_path ON public.seo_pages(page_path);
CREATE INDEX idx_seo_pages_active ON public.seo_pages(is_active);