-- Create blog_comments table
CREATE TABLE public.blog_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_slug TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_name TEXT,
  guest_email TEXT,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add constraint to ensure either user_id or guest info is provided
ALTER TABLE public.blog_comments ADD CONSTRAINT check_user_or_guest 
  CHECK (user_id IS NOT NULL OR (guest_name IS NOT NULL AND guest_email IS NOT NULL));

-- Enable RLS
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- Policies
-- Anyone can view approved comments
CREATE POLICY "Anyone can view approved comments" 
ON public.blog_comments 
FOR SELECT 
USING (is_approved = true);

-- Authenticated users can create comments (auto-approved)
CREATE POLICY "Authenticated users can create comments" 
ON public.blog_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Guest comments (requires moderation)
CREATE POLICY "Guests can submit comments for moderation" 
ON public.blog_comments 
FOR INSERT 
WITH CHECK (user_id IS NULL AND guest_name IS NOT NULL AND guest_email IS NOT NULL);

-- Admins can manage all comments
CREATE POLICY "Admins can view all comments" 
ON public.blog_comments 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update comments" 
ON public.blog_comments 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete comments" 
ON public.blog_comments 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments" 
ON public.blog_comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_blog_comments_post_slug ON public.blog_comments(post_slug);
CREATE INDEX idx_blog_comments_created_at ON public.blog_comments(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_blog_comments_updated_at
BEFORE UPDATE ON public.blog_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();