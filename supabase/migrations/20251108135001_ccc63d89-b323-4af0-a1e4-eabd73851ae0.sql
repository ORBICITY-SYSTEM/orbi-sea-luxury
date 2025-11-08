-- Fix security issues: Explicitly deny anonymous access to sensitive tables

-- Deny anonymous SELECT access to profiles table
CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Deny anonymous SELECT access to contact_submissions table  
CREATE POLICY "Deny anonymous access to contact submissions"
ON public.contact_submissions
FOR SELECT
TO anon
USING (false);