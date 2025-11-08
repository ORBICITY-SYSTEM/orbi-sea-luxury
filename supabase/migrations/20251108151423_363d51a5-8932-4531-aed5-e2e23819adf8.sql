-- Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
);

-- RLS Policies for media bucket
-- Anyone can view files (bucket is public)
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

-- Only admins can upload files
CREATE POLICY "Admins can upload media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media' 
    AND (SELECT has_role(auth.uid(), 'admin'::app_role))
  );

-- Only admins can update files
CREATE POLICY "Admins can update media"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'media' 
    AND (SELECT has_role(auth.uid(), 'admin'::app_role))
  );

-- Only admins can delete files
CREATE POLICY "Admins can delete media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'media' 
    AND (SELECT has_role(auth.uid(), 'admin'::app_role))
  );