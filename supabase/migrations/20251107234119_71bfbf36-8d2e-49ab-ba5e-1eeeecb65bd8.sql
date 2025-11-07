-- Create site_settings table for managing app configuration
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value text,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Admins can view all settings
CREATE POLICY "Admins can view all settings"
ON public.site_settings
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update all settings
CREATE POLICY "Admins can update all settings"
ON public.site_settings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert settings
CREATE POLICY "Admins can insert settings"
ON public.site_settings
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete settings
CREATE POLICY "Admins can delete settings"
ON public.site_settings
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial settings
INSERT INTO public.site_settings (key, value, description) VALUES
  ('youtube_channel_id', '', 'YouTube Channel ID for video integration'),
  ('facebook_url', '', 'Facebook page URL'),
  ('instagram_url', '', 'Instagram profile URL'),
  ('twitter_url', '', 'Twitter/X profile URL'),
  ('contact_email', 'info@orbicitybatumi.com', 'Contact email address'),
  ('contact_phone', '+995 XXX XXX XXX', 'Contact phone number'),
  ('google_maps_url', '', 'Google Maps embed URL');