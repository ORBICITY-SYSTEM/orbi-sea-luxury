-- Insert default site settings
INSERT INTO public.site_settings (key, value, description) VALUES
  ('youtube_channel_id', '', 'YouTube Channel ID for gallery videos'),
  ('facebook_url', '', 'Facebook page URL'),
  ('instagram_url', '', 'Instagram profile URL'),
  ('twitter_url', '', 'Twitter/X profile URL'),
  ('contact_email', '', 'Contact email address'),
  ('contact_phone', '', 'Contact phone number'),
  ('google_maps_url', '', 'Google Maps embed URL')
ON CONFLICT (key) DO NOTHING;