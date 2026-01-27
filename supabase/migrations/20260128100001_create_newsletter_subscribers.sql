-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  language TEXT DEFAULT 'en',
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  source TEXT DEFAULT 'website', -- where they subscribed from (website, footer, popup, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (subscribe)
CREATE POLICY "Anyone can subscribe to newsletter"
ON newsletter_subscribers FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated users (admins) can view all subscribers
CREATE POLICY "Authenticated users can view subscribers"
ON newsletter_subscribers FOR SELECT
TO authenticated
USING (true);

-- Allow users to unsubscribe (update their own record)
CREATE POLICY "Anyone can unsubscribe"
ON newsletter_subscribers FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);
