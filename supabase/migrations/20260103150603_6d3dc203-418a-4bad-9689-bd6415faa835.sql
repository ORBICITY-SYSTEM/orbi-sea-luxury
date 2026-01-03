-- Create otelms_sync_logs table for tracking sync operations
CREATE TABLE public.otelms_sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_type TEXT NOT NULL DEFAULT 'email_parse',
  source TEXT NOT NULL DEFAULT 'n8n',
  status TEXT NOT NULL DEFAULT 'pending',
  records_processed INTEGER DEFAULT 0,
  records_created INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_message TEXT,
  raw_data JSONB,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.otelms_sync_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view sync logs
CREATE POLICY "Admins can view sync logs"
ON public.otelms_sync_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert sync logs (from edge function)
CREATE POLICY "System can insert sync logs"
ON public.otelms_sync_logs
FOR INSERT
WITH CHECK (true);

-- Admins can delete old logs
CREATE POLICY "Admins can delete sync logs"
ON public.otelms_sync_logs
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_otelms_sync_logs_status ON public.otelms_sync_logs(status);
CREATE INDEX idx_otelms_sync_logs_created_at ON public.otelms_sync_logs(created_at DESC);