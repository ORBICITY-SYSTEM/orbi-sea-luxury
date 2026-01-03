-- Add source column to blocked_dates for filtering
ALTER TABLE public.blocked_dates 
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';

-- Add external_id to track synced bookings
ALTER TABLE public.blocked_dates 
ADD COLUMN IF NOT EXISTS external_id TEXT;

-- Add integration_id to link to channel_integrations
ALTER TABLE public.blocked_dates 
ADD COLUMN IF NOT EXISTS integration_id UUID REFERENCES public.channel_integrations(id) ON DELETE SET NULL;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_blocked_dates_source ON public.blocked_dates(source);
CREATE INDEX IF NOT EXISTS idx_blocked_dates_integration_id ON public.blocked_dates(integration_id);