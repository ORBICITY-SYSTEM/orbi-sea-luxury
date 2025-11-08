-- Create content_sections table for managing site text content
CREATE TABLE public.content_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  section_name TEXT NOT NULL,
  content_en TEXT,
  content_ka TEXT,
  page TEXT NOT NULL,
  section_type TEXT NOT NULL DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create media_library table for managing images and videos
CREATE TABLE public.media_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  media_type TEXT NOT NULL, -- 'image' or 'video'
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content_sections
CREATE POLICY "Anyone can view content sections"
  ON public.content_sections
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage content sections"
  ON public.content_sections
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for media_library
CREATE POLICY "Anyone can view media"
  ON public.media_library
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage media"
  ON public.media_library
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_content_sections_updated_at
  BEFORE UPDATE ON public.content_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_media_library_updated_at
  BEFORE UPDATE ON public.media_library
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default content sections
INSERT INTO public.content_sections (section_key, section_name, content_en, content_ka, page, section_type) VALUES
  ('hero_title', 'Hero Title', 'Your Perfect Seaside Escape', 'თქვენი იდეალური სანაპირო დასვენება', 'home', 'text'),
  ('hero_subtitle', 'Hero Subtitle', 'Experience luxury living with stunning Black Sea views at Orbi City Batumi', 'მიიღეთ ლუქს ცხოვრება შავი ზღვის შესანიშნავი ხედებით Orbi City ბათუმში', 'home', 'text'),
  ('about_title', 'About Title', '5 Star Aparthotel Orbi City', '5 ვარსკვლავიანი აპარტჰოტელი Orbi City', 'home', 'text'),
  ('about_description', 'About Description', 'Discover unparalleled luxury at Orbi City, where every apartment offers breathtaking Black Sea views and five-star comfort.', 'აღმოაჩინეთ უბადლო ფუფუნება Orbi City-ში, სადაც ყველა აპარტამენტი გთავაზობთ შავი ზღვის საოცარ ხედებს და ხუთვარსკვლავიან კომფორტს.', 'home', 'textarea');