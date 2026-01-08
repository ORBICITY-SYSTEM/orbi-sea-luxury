-- Fix 1: contact_submissions - Remove conflicting RESTRICTIVE policy that blocks admin access
-- The "Deny anonymous access" policy with USING (false) is RESTRICTIVE and blocks ALL reads including admins
DROP POLICY IF EXISTS "Deny anonymous access to contact submissions" ON public.contact_submissions;

-- The "Only admins can view contact submissions" policy already protects the data properly

-- Fix 2: bookings - Strengthen pay-later booking policy to require essential fields
-- This prevents empty/malicious data injection while still allowing anonymous bookings
DROP POLICY IF EXISTS "Anyone can create pay-later bookings" ON public.bookings;

-- Recreate with validation: require essential guest info and valid dates
CREATE POLICY "Anyone can create pay-later bookings with valid data" 
ON public.bookings 
FOR INSERT 
WITH CHECK (
  payment_status = 'pay_later' AND
  guest_name IS NOT NULL AND
  guest_name != '' AND
  guest_email IS NOT NULL AND
  guest_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
  guest_phone IS NOT NULL AND
  check_in IS NOT NULL AND
  check_out IS NOT NULL AND
  check_out > check_in AND
  apartment_type IS NOT NULL
);

-- Add a trigger to sanitize input data on bookings
CREATE OR REPLACE FUNCTION public.sanitize_booking_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Sanitize text fields to prevent XSS
  NEW.guest_name := regexp_replace(NEW.guest_name, '[<>]', '', 'g');
  NEW.special_requests := regexp_replace(COALESCE(NEW.special_requests, ''), '[<>]', '', 'g');
  NEW.notes := regexp_replace(COALESCE(NEW.notes, ''), '[<>]', '', 'g');
  NEW.guest_address := regexp_replace(COALESCE(NEW.guest_address, ''), '[<>]', '', 'g');
  
  -- Normalize email to lowercase
  NEW.guest_email := LOWER(NEW.guest_email);
  
  -- Ensure status defaults
  IF NEW.status IS NULL THEN
    NEW.status := 'pending';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger if not exists
DROP TRIGGER IF EXISTS sanitize_booking_data_trigger ON public.bookings;
CREATE TRIGGER sanitize_booking_data_trigger
  BEFORE INSERT OR UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.sanitize_booking_data();