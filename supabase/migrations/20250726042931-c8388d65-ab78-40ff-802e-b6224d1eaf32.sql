-- Fix card creation issues with proper UUID handling
-- Drop conflicting policies first, then create correct ones

-- Drop any existing conflicting policies
DROP POLICY IF EXISTS "Users can view public cards" ON public.cards;
DROP POLICY IF EXISTS "Users can create their own cards" ON public.cards;  
DROP POLICY IF EXISTS "Users can update their own cards" ON public.cards;
DROP POLICY IF EXISTS "Users can delete their own cards" ON public.cards;

-- Create RLS policies with proper UUID handling (creator_id is text, auth.uid() is uuid)
CREATE POLICY "Users can view public cards" ON public.cards
  FOR SELECT USING (
    visibility = 'public' OR 
    creator_id = auth.uid()::text
  );

CREATE POLICY "Users can create their own cards" ON public.cards
  FOR INSERT WITH CHECK (
    creator_id = auth.uid()::text
  );

CREATE POLICY "Users can update their own cards" ON public.cards
  FOR UPDATE USING (
    creator_id = auth.uid()::text
  );

CREATE POLICY "Users can delete their own cards" ON public.cards
  FOR DELETE USING (
    creator_id = auth.uid()::text
  );

-- Ensure storage bucket exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('card-images', 'card-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for card images
CREATE POLICY "Public card images viewable" ON storage.objects
  FOR SELECT USING (bucket_id = 'card-images');

CREATE POLICY "Authenticated users can upload card images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'card-images' AND
    auth.uid() IS NOT NULL
  );

-- Create proper UUID generation function
CREATE OR REPLACE FUNCTION generate_proper_card_id()
RETURNS text
LANGUAGE sql
AS $$
  SELECT 'card_' || extract(epoch from now()) || '_' || substring(md5(random()::text) from 1 for 8);
$$;