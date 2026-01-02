-- Allow public read access to specific site settings like google_analytics_id
CREATE POLICY "Anyone can read public settings like GA ID"
ON public.site_settings
FOR SELECT
USING (key IN ('google_analytics_id', 'meta_pixel_id'));