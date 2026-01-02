-- Create apartment_prices table for admin-managed pricing
CREATE TABLE public.apartment_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  apartment_type TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ka TEXT NOT NULL,
  description_en TEXT,
  description_ka TEXT,
  price_per_night NUMERIC NOT NULL,
  max_guests INTEGER NOT NULL DEFAULT 2,
  size_sqm INTEGER,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.apartment_prices ENABLE ROW LEVEL SECURITY;

-- Anyone can view active prices
CREATE POLICY "Anyone can view active apartment prices"
ON public.apartment_prices
FOR SELECT
USING (is_active = true);

-- Only admins can manage prices
CREATE POLICY "Admins can manage apartment prices"
ON public.apartment_prices
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update bookings table to add guest info for non-authenticated users
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS guest_name TEXT,
ADD COLUMN IF NOT EXISTS guest_email TEXT,
ADD COLUMN IF NOT EXISTS guest_phone TEXT,
ADD COLUMN IF NOT EXISTS guest_id_number TEXT,
ADD COLUMN IF NOT EXISTS guest_address TEXT,
ADD COLUMN IF NOT EXISTS special_requests TEXT;

-- Allow anyone to create bookings (pay later = no auth required)
CREATE POLICY "Anyone can create pay-later bookings"
ON public.bookings
FOR INSERT
WITH CHECK (payment_status = 'pay_later');

-- Create trigger for updated_at
CREATE TRIGGER update_apartment_prices_updated_at
BEFORE UPDATE ON public.apartment_prices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default apartment types
INSERT INTO public.apartment_prices (apartment_type, name_en, name_ka, price_per_night, max_guests, size_sqm, display_order)
VALUES 
  ('studio', 'Studio Apartment', 'სტუდიო აპარტამენტი', 120, 2, 35, 1),
  ('one_bedroom', '1-Bedroom Apartment', '1-ოთახიანი აპარტამენტი', 150, 3, 50, 2),
  ('two_bedroom', '2-Bedroom Apartment', '2-ოთახიანი აპარტამენტი', 200, 5, 75, 3),
  ('penthouse', 'Penthouse Suite', 'პენტჰაუს ლუქსი', 350, 6, 120, 4)
ON CONFLICT (apartment_type) DO NOTHING;