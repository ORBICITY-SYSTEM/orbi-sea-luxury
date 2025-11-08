-- FIX ALL SECURITY ISSUES: Protect business-critical tables from public access

-- =====================================================
-- 1. PROMO CODES TABLE - Protect pricing strategy
-- =====================================================
-- Drop existing public policy
DROP POLICY IF EXISTS "Anyone can view active promo codes" ON public.promo_codes;

-- Only authenticated users can validate specific codes (via function, not full table access)
-- Admins can view all codes
CREATE POLICY "Admins can view all promo codes"
ON public.promo_codes
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage promo codes
CREATE POLICY "Admins can insert promo codes"
ON public.promo_codes
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update promo codes"
ON public.promo_codes
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete promo codes"
ON public.promo_codes
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- 2. EXPERIMENTS TABLE - Protect A/B testing strategy
-- =====================================================
-- Drop existing public policy
DROP POLICY IF EXISTS "Experiments are viewable by everyone" ON public.experiments;
DROP POLICY IF EXISTS "Only admins can manage experiments" ON public.experiments;

-- Only admins can view experiments
CREATE POLICY "Only admins can view experiments"
ON public.experiments
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can manage experiments
CREATE POLICY "Only admins can insert experiments"
ON public.experiments
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update experiments"
ON public.experiments
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete experiments"
ON public.experiments
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- 3. EXPERIMENT ASSIGNMENTS - Protect user tracking
-- =====================================================
-- Drop existing public policies
DROP POLICY IF EXISTS "Anyone can view assignments" ON public.experiment_assignments;
DROP POLICY IF EXISTS "Anyone can create assignments" ON public.experiment_assignments;

-- System can create assignments (for A/B testing logic)
CREATE POLICY "System can create experiment assignments"
ON public.experiment_assignments
FOR INSERT
WITH CHECK (true);

-- Only admins can view assignments
CREATE POLICY "Only admins can view experiment assignments"
ON public.experiment_assignments
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can manage assignments
CREATE POLICY "Only admins can update experiment assignments"
ON public.experiment_assignments
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete experiment assignments"
ON public.experiment_assignments
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- 4. EXPERIMENT EVENTS - Protect analytics data
-- =====================================================
-- Drop existing public policies
DROP POLICY IF EXISTS "Anyone can view experiment events" ON public.experiment_events;
DROP POLICY IF EXISTS "Anyone can create experiment events" ON public.experiment_events;

-- System can create events (for tracking)
CREATE POLICY "System can create experiment events"
ON public.experiment_events
FOR INSERT
WITH CHECK (true);

-- Only admins can view events
CREATE POLICY "Only admins can view experiment events"
ON public.experiment_events
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can manage events
CREATE POLICY "Only admins can update experiment events"
ON public.experiment_events
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete experiment events"
ON public.experiment_events
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- 5. CREATE PROMO CODE VALIDATION FUNCTION
-- =====================================================
-- This allows validating a code without exposing the full table
CREATE OR REPLACE FUNCTION public.validate_promo_code(code_input TEXT)
RETURNS TABLE (
  id UUID,
  discount_percentage INTEGER,
  is_valid BOOLEAN,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
      false,
      'Invalid promo code'::TEXT;
    RETURN;
  END IF;

  -- Check validity period
  IF promo_record.valid_until IS NOT NULL AND promo_record.valid_until < NOW() THEN
    RETURN QUERY SELECT 
      promo_record.id,
      0,
      false,
      'Promo code has expired'::TEXT;
    RETURN;
  END IF;

  IF promo_record.valid_from > NOW() THEN
    RETURN QUERY SELECT 
      promo_record.id,
      0,
      false,
      'Promo code is not yet active'::TEXT;
    RETURN;
  END IF;

  -- Check usage limit
  IF promo_record.max_uses IS NOT NULL AND promo_record.current_uses >= promo_record.max_uses THEN
    RETURN QUERY SELECT 
      promo_record.id,
      0,
      false,
      'Promo code usage limit reached'::TEXT;
    RETURN;
  END IF;

  -- Code is valid
  RETURN QUERY SELECT 
    promo_record.id,
    promo_record.discount_percentage,
    true,
    'Promo code applied successfully'::TEXT;
END;
$$;