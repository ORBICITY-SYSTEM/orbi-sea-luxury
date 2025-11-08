-- Add support for fixed amount vouchers in promo codes

-- Add discount type enum
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed_amount');

-- Add new columns to promo_codes table
ALTER TABLE public.promo_codes 
  ADD COLUMN discount_type discount_type NOT NULL DEFAULT 'percentage',
  ADD COLUMN discount_amount numeric,
  ALTER COLUMN discount_percentage DROP NOT NULL;

-- Add check constraint to ensure either discount_percentage or discount_amount is set
ALTER TABLE public.promo_codes
  ADD CONSTRAINT check_discount_value CHECK (
    (discount_type = 'percentage' AND discount_percentage IS NOT NULL AND discount_amount IS NULL) OR
    (discount_type = 'fixed_amount' AND discount_amount IS NOT NULL AND discount_percentage IS NULL)
  );

-- Drop and recreate the validate_promo_code function with new return type
DROP FUNCTION IF EXISTS public.validate_promo_code(text);

CREATE FUNCTION public.validate_promo_code(code_input text)
RETURNS TABLE(
  id uuid, 
  discount_percentage integer, 
  discount_amount numeric,
  discount_type text,
  is_valid boolean, 
  message text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  promo_record RECORD;
BEGIN
  -- Find the promo code
  SELECT * INTO promo_record
  FROM public.promo_codes
  WHERE code = code_input
  AND is_active = true;

  -- If not found
  IF NOT FOUND THEN
    RETURN QUERY SELECT 
      NULL::UUID,
      0,
      0::numeric,
      ''::TEXT,
      false,
      'Invalid promo code'::TEXT;
    RETURN;
  END IF;

  -- Check validity period
  IF promo_record.valid_until IS NOT NULL AND promo_record.valid_until < NOW() THEN
    RETURN QUERY SELECT 
      promo_record.id,
      0,
      0::numeric,
      ''::TEXT,
      false,
      'Promo code has expired'::TEXT;
    RETURN;
  END IF;

  IF promo_record.valid_from > NOW() THEN
    RETURN QUERY SELECT 
      promo_record.id,
      0,
      0::numeric,
      ''::TEXT,
      false,
      'Promo code is not yet active'::TEXT;
    RETURN;
  END IF;

  -- Check usage limit
  IF promo_record.max_uses IS NOT NULL AND promo_record.current_uses >= promo_record.max_uses THEN
    RETURN QUERY SELECT 
      promo_record.id,
      0,
      0::numeric,
      ''::TEXT,
      false,
      'Promo code usage limit reached'::TEXT;
    RETURN;
  END IF;

  -- Code is valid
  RETURN QUERY SELECT 
    promo_record.id,
    COALESCE(promo_record.discount_percentage, 0),
    COALESCE(promo_record.discount_amount, 0::numeric),
    promo_record.discount_type::TEXT,
    true,
    'Promo code applied successfully'::TEXT;
END;
$function$;