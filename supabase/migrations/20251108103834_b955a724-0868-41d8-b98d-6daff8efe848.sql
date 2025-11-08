-- Add Meta Pixel settings to site_settings
INSERT INTO site_settings (key, value) 
VALUES 
  ('meta_pixel_id', ''),
  ('meta_access_token', '')
ON CONFLICT (key) DO NOTHING;