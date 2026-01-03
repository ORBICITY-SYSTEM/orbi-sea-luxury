-- ===== 1. BLOCKED DATES TABLE (Block Dates) =====
CREATE TABLE public.blocked_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_type text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage blocked dates"
  ON public.blocked_dates FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view blocked dates"
  ON public.blocked_dates FOR SELECT
  USING (true);

-- ===== 2. BOOKING NOTES TABLE (შენიშვნები ჯავშნებზე) =====
CREATE TABLE public.booking_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  note text NOT NULL,
  note_type text DEFAULT 'general', -- 'general', 'vip', 'special_request', 'internal'
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.booking_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage booking notes"
  ON public.booking_notes FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- ===== 3. HOUSEKEEPING TABLE (Housekeeping მენეჯმენტი) =====
CREATE TABLE public.housekeeping (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_type text NOT NULL,
  room_number text,
  status text NOT NULL DEFAULT 'clean', -- 'clean', 'dirty', 'in_progress', 'inspected'
  priority text DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  assigned_to text,
  notes text,
  last_cleaned_at timestamp with time zone,
  next_check_in date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.housekeeping ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage housekeeping"
  ON public.housekeeping FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- ===== 4. GUEST MESSAGES TABLE (სტუმრებთან ჩატი) =====
CREATE TABLE public.guest_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  sender_type text NOT NULL DEFAULT 'guest', -- 'guest', 'admin'
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.guest_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all messages"
  ON public.guest_messages FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own messages"
  ON public.guest_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can send messages"
  ON public.guest_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id AND sender_type = 'guest');

-- ===== 5. EMAIL TEMPLATES TABLE (Email ნოტიფიკაციების მართვა) =====
CREATE TABLE public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key text UNIQUE NOT NULL, -- 'booking_confirmation', 'booking_reminder', 'booking_cancelled', etc.
  template_name text NOT NULL,
  subject_en text NOT NULL,
  subject_ka text NOT NULL,
  body_en text NOT NULL,
  body_ka text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage email templates"
  ON public.email_templates FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- ===== 6. EMAIL LOGS TABLE =====
CREATE TABLE public.email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key text,
  recipient_email text NOT NULL,
  recipient_name text,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  status text DEFAULT 'sent', -- 'sent', 'failed', 'pending'
  error_message text,
  sent_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view email logs"
  ON public.email_logs FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert email logs"
  ON public.email_logs FOR INSERT
  WITH CHECK (true);

-- ===== 7. CHANNEL INTEGRATIONS TABLE (Channel Manager) =====
CREATE TABLE public.channel_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_name text NOT NULL, -- 'booking_com', 'airbnb', 'expedia'
  apartment_type text NOT NULL,
  ical_url text,
  is_active boolean DEFAULT true,
  last_synced_at timestamp with time zone,
  sync_errors text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.channel_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage channel integrations"
  ON public.channel_integrations FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- ===== TRIGGERS FOR UPDATED_AT =====
CREATE TRIGGER update_blocked_dates_updated_at
  BEFORE UPDATE ON public.blocked_dates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_housekeeping_updated_at
  BEFORE UPDATE ON public.housekeeping
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_channel_integrations_updated_at
  BEFORE UPDATE ON public.channel_integrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== INSERT DEFAULT EMAIL TEMPLATES =====
INSERT INTO public.email_templates (template_key, template_name, subject_en, subject_ka, body_en, body_ka) VALUES
  ('booking_confirmation', 'Booking Confirmation', 'Your booking at Orbi City is confirmed!', 'თქვენი ჯავშანი Orbi City-ში დადასტურებულია!', 
   '<h1>Thank you for your booking!</h1><p>Dear {{guest_name}},</p><p>Your reservation at Orbi City Batumi has been confirmed.</p><p><strong>Check-in:</strong> {{check_in}}</p><p><strong>Check-out:</strong> {{check_out}}</p><p><strong>Apartment:</strong> {{apartment_type}}</p><p><strong>Total:</strong> ₾{{total_price}}</p>',
   '<h1>გმადლობთ ჯავშნისთვის!</h1><p>ძვირფასო {{guest_name}},</p><p>თქვენი რეზერვაცია Orbi City ბათუმში დადასტურებულია.</p><p><strong>შემოსვლა:</strong> {{check_in}}</p><p><strong>გასვლა:</strong> {{check_out}}</p><p><strong>აპარტამენტი:</strong> {{apartment_type}}</p><p><strong>ჯამი:</strong> ₾{{total_price}}</p>'),
  ('booking_reminder', 'Check-in Reminder', 'Reminder: Your check-in tomorrow!', 'შეხსენება: ხვალ შემოდიხართ!',
   '<h1>See you tomorrow!</h1><p>Dear {{guest_name}},</p><p>This is a friendly reminder that your check-in is tomorrow.</p>',
   '<h1>ხვალ გნახავთ!</h1><p>ძვირფასო {{guest_name}},</p><p>ეს არის მეგობრული შეხსენება, რომ თქვენი შემოსვლა ხვალ არის.</p>'),
  ('booking_cancelled', 'Booking Cancelled', 'Your booking has been cancelled', 'თქვენი ჯავშანი გაუქმებულია',
   '<h1>Booking Cancelled</h1><p>Dear {{guest_name}},</p><p>Your booking has been cancelled as requested.</p>',
   '<h1>ჯავშანი გაუქმებულია</h1><p>ძვირფასო {{guest_name}},</p><p>თქვენი ჯავშანი გაუქმებულია თქვენი მოთხოვნის შესაბამისად.</p>');