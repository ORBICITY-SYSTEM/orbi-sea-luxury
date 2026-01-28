-- Create scheduled_notifications table for WhatsApp and other automated notifications
CREATE TABLE IF NOT EXISTS scheduled_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('confirmation', 'checkin_reminder', 'thank_you', 'special_offer', 'custom')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for efficient querying of pending notifications
CREATE INDEX IF NOT EXISTS idx_scheduled_notifications_status_scheduled
ON scheduled_notifications(status, scheduled_at)
WHERE status = 'pending';

-- Create index for booking lookups
CREATE INDEX IF NOT EXISTS idx_scheduled_notifications_booking
ON scheduled_notifications(booking_id);

-- Enable Row Level Security
ALTER TABLE scheduled_notifications ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read their own notifications
CREATE POLICY "Users can view notifications for their bookings"
ON scheduled_notifications FOR SELECT
USING (
  booking_id IN (
    SELECT id FROM bookings WHERE user_id = auth.uid()
  )
);

-- Allow service role full access (for n8n/automation)
CREATE POLICY "Service role has full access"
ON scheduled_notifications
USING (auth.role() = 'service_role');

-- Allow admins full access
CREATE POLICY "Admins can manage all notifications"
ON scheduled_notifications
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_scheduled_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS trigger_update_scheduled_notifications_updated_at ON scheduled_notifications;
CREATE TRIGGER trigger_update_scheduled_notifications_updated_at
BEFORE UPDATE ON scheduled_notifications
FOR EACH ROW
EXECUTE FUNCTION update_scheduled_notifications_updated_at();

-- Add whatsapp_webhook_url to site_settings if not exists
INSERT INTO site_settings (key, value)
VALUES ('whatsapp_webhook_url', '')
ON CONFLICT (key) DO NOTHING;

-- Comment for documentation
COMMENT ON TABLE scheduled_notifications IS 'Stores scheduled WhatsApp and other automated notifications for bookings';
COMMENT ON COLUMN scheduled_notifications.notification_type IS 'Type: confirmation, checkin_reminder, thank_you, special_offer, custom';
COMMENT ON COLUMN scheduled_notifications.status IS 'Status: pending, sent, failed, cancelled';
