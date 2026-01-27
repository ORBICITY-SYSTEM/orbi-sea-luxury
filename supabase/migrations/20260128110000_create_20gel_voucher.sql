-- Create 20 GEL welcome voucher for new customers
-- IMPORTANT: Run this via Supabase Dashboard SQL Editor
-- URL: https://supabase.com/dashboard/project/tqfbrgoaucjcttfsimdh/sql

INSERT INTO promo_codes (
  code,
  discount_type,
  discount_amount,
  discount_percentage,
  is_active,
  valid_from,
  valid_until,
  max_uses,
  current_uses,
  min_nights
) VALUES (
  'WELCOME20',
  'fixed',
  20,
  NULL,
  true,
  NOW(),
  '2026-12-31 23:59:59',
  1000,
  0,
  1
) ON CONFLICT (code) DO UPDATE SET
  is_active = true,
  discount_amount = 20,
  valid_until = '2026-12-31 23:59:59';

-- Also create ORBI20 as an alias
INSERT INTO promo_codes (
  code,
  discount_type,
  discount_amount,
  discount_percentage,
  is_active,
  valid_from,
  valid_until,
  max_uses,
  current_uses,
  min_nights
) VALUES (
  'ORBI20',
  'fixed',
  20,
  NULL,
  true,
  NOW(),
  '2026-12-31 23:59:59',
  1000,
  0,
  1
) ON CONFLICT (code) DO UPDATE SET
  is_active = true,
  discount_amount = 20,
  valid_until = '2026-12-31 23:59:59';
