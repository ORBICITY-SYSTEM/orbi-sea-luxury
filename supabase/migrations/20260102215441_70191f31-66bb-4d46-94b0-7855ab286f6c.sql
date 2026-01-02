-- Update RLS policy to include whatsapp_message in public settings
DROP POLICY IF EXISTS "Anyone can read public settings" ON public.site_settings;

CREATE POLICY "Anyone can read public settings" 
ON public.site_settings 
FOR SELECT 
USING (key = ANY (ARRAY['google_analytics_id', 'meta_pixel_id', 'google_maps_place_id', 'whatsapp_phone', 'whatsapp_message']));