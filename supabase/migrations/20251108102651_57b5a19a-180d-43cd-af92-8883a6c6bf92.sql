-- Add social media links to site_settings
INSERT INTO site_settings (key, description, value) VALUES
  ('facebook_url', 'Facebook page URL', 'https://facebook.com/orbicitybatumi'),
  ('instagram_url', 'Instagram profile URL', 'https://instagram.com/orbicitybatumi'),
  ('youtube_url', 'YouTube channel URL', 'https://youtube.com/@orbicitybatumi')
ON CONFLICT (key) DO NOTHING;