-- Fix security issue: Set explicit search_path for update_updated_at_column function
-- This prevents potential privilege escalation attacks by setting a fixed search_path

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;