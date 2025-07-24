
-- Fix the database trigger error by checking if the cards table has the required fields
-- and updating any triggers that reference non-existent fields

-- Check if there are any triggers trying to access 'completed_at' field that doesn't exist
-- and remove or fix them

-- First, let's see what triggers exist on the cards table and fix any that reference completed_at
DO $$
DECLARE
    trigger_rec RECORD;
BEGIN
    -- Get all triggers on the cards table
    FOR trigger_rec IN 
        SELECT tgname, proname 
        FROM pg_trigger t
        JOIN pg_proc p ON t.tgfoid = p.oid
        JOIN pg_class c ON t.tgrelid = c.oid
        WHERE c.relname = 'cards'
    LOOP
        -- Log the trigger names so we can see what exists
        RAISE NOTICE 'Found trigger: % calling function: %', trigger_rec.tgname, trigger_rec.proname;
    END LOOP;
END $$;

-- Add the completed_at field if it doesn't exist to fix the trigger error
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Update the handle_updated_at function to ensure it works properly
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists and is properly configured
DROP TRIGGER IF EXISTS handle_updated_at_cards ON public.cards;
CREATE TRIGGER handle_updated_at_cards
  BEFORE UPDATE ON public.cards
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
