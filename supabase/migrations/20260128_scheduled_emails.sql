-- Create scheduled_emails table for automated email system
CREATE TABLE IF NOT EXISTS scheduled_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  email_type VARCHAR(50) NOT NULL CHECK (email_type IN ('confirmation', 'checkin_reminder', 'thank_you', 'welcome', 'special_offer', 'custom')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  to_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  html_content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for efficient querying of pending emails
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_status_scheduled
ON scheduled_emails(status, scheduled_at)
WHERE status = 'pending';

-- Create index for booking lookups
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_booking
ON scheduled_emails(booking_id);

-- Create index for email address lookups
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_to_email
ON scheduled_emails(to_email);

-- Enable Row Level Security
ALTER TABLE scheduled_emails ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for Edge Functions/automation)
CREATE POLICY "Service role has full access to scheduled_emails"
ON scheduled_emails
USING (auth.role() = 'service_role');

-- Allow admins full access
CREATE POLICY "Admins can manage all scheduled_emails"
ON scheduled_emails
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_scheduled_emails_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS trigger_update_scheduled_emails_updated_at ON scheduled_emails;
CREATE TRIGGER trigger_update_scheduled_emails_updated_at
BEFORE UPDATE ON scheduled_emails
FOR EACH ROW
EXECUTE FUNCTION update_scheduled_emails_updated_at();

-- Function to process due emails (called by cron job)
CREATE OR REPLACE FUNCTION get_due_emails()
RETURNS TABLE (
  id UUID,
  email_type VARCHAR(50),
  to_email VARCHAR(255),
  subject VARCHAR(500),
  html_content TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    se.id,
    se.email_type,
    se.to_email,
    se.subject,
    se.html_content
  FROM scheduled_emails se
  WHERE se.status = 'pending'
    AND se.scheduled_at <= NOW()
    AND se.retry_count < 3
  ORDER BY se.scheduled_at ASC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark email as sent
CREATE OR REPLACE FUNCTION mark_email_sent(email_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE scheduled_emails
  SET
    status = 'sent',
    sent_at = NOW()
  WHERE id = email_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark email as failed
CREATE OR REPLACE FUNCTION mark_email_failed(email_id UUID, error_msg TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE scheduled_emails
  SET
    status = CASE WHEN retry_count >= 2 THEN 'failed' ELSE status END,
    error_message = error_msg,
    retry_count = retry_count + 1
  WHERE id = email_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comment for documentation
COMMENT ON TABLE scheduled_emails IS 'Stores scheduled automated emails for bookings (reminders, confirmations, follow-ups)';
COMMENT ON COLUMN scheduled_emails.email_type IS 'Type: confirmation, checkin_reminder, thank_you, welcome, special_offer, custom';
COMMENT ON COLUMN scheduled_emails.status IS 'Status: pending, sent, failed, cancelled';
COMMENT ON COLUMN scheduled_emails.retry_count IS 'Number of retry attempts (max 3)';
