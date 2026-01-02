-- Add parent_id column for nested comments
ALTER TABLE public.blog_comments 
ADD COLUMN parent_id uuid REFERENCES public.blog_comments(id) ON DELETE CASCADE;

-- Create index for faster nested queries
CREATE INDEX idx_blog_comments_parent_id ON public.blog_comments(parent_id);