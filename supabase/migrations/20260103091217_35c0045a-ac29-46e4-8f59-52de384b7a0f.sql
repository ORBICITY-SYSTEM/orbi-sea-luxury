-- Create seasonal/monthly pricing table
CREATE TABLE public.seasonal_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  apartment_type TEXT NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2024),
  price_per_night NUMERIC NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(apartment_type, month, year)
);

-- Enable RLS
ALTER TABLE public.seasonal_prices ENABLE ROW LEVEL SECURITY;

-- Admins can manage seasonal prices
CREATE POLICY "Admins can manage seasonal prices"
ON public.seasonal_prices
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view active seasonal prices
CREATE POLICY "Anyone can view active seasonal prices"
ON public.seasonal_prices
FOR SELECT
USING (is_active = true);

-- Create trigger for updated_at
CREATE TRIGGER update_seasonal_prices_updated_at
BEFORE UPDATE ON public.seasonal_prices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_seasonal_prices_lookup ON public.seasonal_prices(apartment_type, year, month);