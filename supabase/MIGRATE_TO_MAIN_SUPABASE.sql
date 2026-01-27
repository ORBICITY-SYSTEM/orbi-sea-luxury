-- ============================================================
-- ORBI CITY WEBSITE TABLES MIGRATION TO MAIN SUPABASE
-- ============================================================
-- Run this in: https://supabase.com/dashboard/project/lusagtvxjtfxgfadulgv/sql
-- ============================================================

-- ===== 0. HELPER FUNCTION =====
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ===== 1. APP_ROLE ENUM =====
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ===== 2. USER_ROLES TABLE =====
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ===== 3. HAS_ROLE FUNCTION =====
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- ===== 4. PROFILES TABLE =====
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'ka',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ===== 5. BOOKINGS TABLE =====
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  apartment_type TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10, 2),
  promo_code TEXT,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'pay_later', 'partial')),
  payment_method TEXT,
  notes TEXT,
  guest_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  guest_id_number TEXT,
  guest_address TEXT,
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all bookings" ON public.bookings FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ===== 6. LOYALTY_POINTS TABLE =====
CREATE TABLE IF NOT EXISTS public.loyalty_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL DEFAULT 0,
  total_earned INTEGER NOT NULL DEFAULT 0,
  total_redeemed INTEGER NOT NULL DEFAULT 0,
  tier TEXT NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own loyalty points" ON public.loyalty_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own loyalty points" ON public.loyalty_points FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own loyalty points" ON public.loyalty_points FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ===== 7. PROMO_CODES TABLE =====
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_percentage INTEGER CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  discount_amount DECIMAL(10, 2),
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  max_uses INTEGER,
  current_uses INTEGER NOT NULL DEFAULT 0,
  min_nights INTEGER DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active promo codes" ON public.promo_codes FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage promo codes" ON public.promo_codes FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ===== 8. APARTMENT_PRICES TABLE =====
CREATE TABLE IF NOT EXISTS public.apartment_prices (
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
ALTER TABLE public.apartment_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active apartment prices" ON public.apartment_prices FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage apartment prices" ON public.apartment_prices FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ===== 9. SEASONAL_PRICES TABLE =====
CREATE TABLE IF NOT EXISTS public.seasonal_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  apartment_type TEXT NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  price_per_night NUMERIC NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(apartment_type, month, year)
);
ALTER TABLE public.seasonal_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view seasonal prices" ON public.seasonal_prices FOR SELECT USING (true);
CREATE POLICY "Admins can manage seasonal prices" ON public.seasonal_prices FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ===== 10. BLOCKED_DATES TABLE =====
CREATE TABLE IF NOT EXISTS public.blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view blocked dates" ON public.blocked_dates FOR SELECT USING (true);
CREATE POLICY "Admins can manage blocked dates" ON public.blocked_dates FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ===== 11. SITE_SETTINGS TABLE =====
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ===== 12. NEWSLETTER_SUBSCRIBERS TABLE =====
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  language TEXT DEFAULT 'en',
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can view subscribers" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (true);

-- ===== 13. CONTACT_SUBMISSIONS TABLE =====
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view contact submissions" ON public.contact_submissions FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- ===== 14. EMAIL_TEMPLATES TABLE =====
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT UNIQUE NOT NULL,
  template_name TEXT NOT NULL,
  subject_en TEXT NOT NULL,
  subject_ka TEXT NOT NULL,
  body_en TEXT NOT NULL,
  body_ka TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage email templates" ON public.email_templates FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ===== 15. EMAIL_LOGS TABLE =====
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'sent',
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view email logs" ON public.email_logs FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert email logs" ON public.email_logs FOR INSERT WITH CHECK (true);

-- ===== 16. BOOKING_NOTES TABLE =====
CREATE TABLE IF NOT EXISTS public.booking_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  note_type TEXT DEFAULT 'general',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.booking_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage booking notes" ON public.booking_notes FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ===== 17. GUEST_MESSAGES TABLE =====
CREATE TABLE IF NOT EXISTS public.guest_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  sender_type TEXT NOT NULL DEFAULT 'guest',
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.guest_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all messages" ON public.guest_messages FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view their own messages" ON public.guest_messages FOR SELECT USING (auth.uid() = user_id);

-- ===== TRIGGERS =====
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_loyalty_points_updated_at ON public.loyalty_points;
CREATE TRIGGER update_loyalty_points_updated_at BEFORE UPDATE ON public.loyalty_points FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_apartment_prices_updated_at ON public.apartment_prices;
CREATE TRIGGER update_apartment_prices_updated_at BEFORE UPDATE ON public.apartment_prices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== AUTO-CREATE PROFILE ON USER SIGNUP =====
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.loyalty_points (user_id, points)
  VALUES (NEW.id, 0)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===== INSERT DEFAULT DATA =====

-- Default Apartment Types
INSERT INTO public.apartment_prices (apartment_type, name_en, name_ka, price_per_night, max_guests, size_sqm, display_order)
VALUES
  ('studio', 'Studio Apartment', 'სტუდიო აპარტამენტი', 120, 2, 35, 1),
  ('one_bedroom', '1-Bedroom Apartment', '1-ოთახიანი აპარტამენტი', 150, 3, 50, 2),
  ('two_bedroom', '2-Bedroom Apartment', '2-ოთახიანი აპარტამენტი', 200, 5, 75, 3),
  ('penthouse', 'Penthouse Suite', 'პენტჰაუსი', 350, 6, 120, 4)
ON CONFLICT (apartment_type) DO NOTHING;

-- Default Site Settings
INSERT INTO public.site_settings (key, value, description) VALUES
  ('youtube_channel_id', '', 'YouTube Channel ID'),
  ('facebook_url', 'https://facebook.com/orbicitybatumi', 'Facebook page URL'),
  ('instagram_url', 'https://instagram.com/orbi.city.batumi', 'Instagram profile URL'),
  ('youtube_url', '', 'YouTube channel URL'),
  ('contact_email', 'info@orbicitybatumi.com', 'Contact email'),
  ('contact_phone', '+995 555 19 90 90', 'Contact phone'),
  ('whatsapp_phone', '+995555199090', 'WhatsApp number'),
  ('google_maps_url', '', 'Google Maps URL')
ON CONFLICT (key) DO NOTHING;

-- Default Promo Codes
INSERT INTO public.promo_codes (code, discount_type, discount_amount, min_nights, max_uses, is_active)
VALUES
  ('WELCOME20', 'fixed', 20, 1, 1000, true),
  ('ORBI20', 'fixed', 20, 1, 1000, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- DONE! Your website tables are now in MAIN Supabase
-- ============================================================
