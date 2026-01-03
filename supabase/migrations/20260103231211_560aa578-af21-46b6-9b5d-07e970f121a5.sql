-- Update handle_new_user function to add 20 GEL (points) welcome bonus
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $$
BEGIN
  -- Create user profile
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  -- Create loyalty points with 20 GEL welcome bonus
  INSERT INTO public.loyalty_points (user_id, points, total_earned, tier)
  VALUES (NEW.id, 20, 20, 'bronze');
  
  RETURN NEW;
END;
$$;