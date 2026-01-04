-- Create changelog table for tracking project changes
CREATE TABLE public.changelog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  change_type TEXT NOT NULL DEFAULT 'feature',
  labels TEXT[] DEFAULT '{}',
  change_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.changelog ENABLE ROW LEVEL SECURITY;

-- Admins can manage changelog
CREATE POLICY "Admins can manage changelog" 
ON public.changelog 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view changelog (for transparency)
CREATE POLICY "Anyone can view changelog" 
ON public.changelog 
FOR SELECT 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_changelog_updated_at
BEFORE UPDATE ON public.changelog
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();