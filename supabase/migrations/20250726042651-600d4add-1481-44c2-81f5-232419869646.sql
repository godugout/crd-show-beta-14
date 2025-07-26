-- Fix UUID generation and add comprehensive RLS policies for card creation

-- First, let's ensure we have proper UUID generation function
CREATE OR REPLACE FUNCTION generate_card_uuid() 
RETURNS uuid 
LANGUAGE sql 
AS $$
  SELECT gen_random_uuid();
$$;

-- Create comprehensive RLS policies for cards table
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

-- Create storage bucket policies for card images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('card-images', 'card-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for card images
CREATE POLICY "Public card images are viewable by everyone" ON storage.objects
  FOR SELECT USING (bucket_id = 'card-images');

CREATE POLICY "Users can upload card images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'card-images' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can update their own card images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'card-images' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can delete their own card images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'card-images' AND
    auth.uid() IS NOT NULL
  );

-- Create policies for other tables that might need them
-- Profiles table policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- Collections table policies (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'collections') THEN
    EXECUTE 'CREATE POLICY "Users can view public collections" ON public.collections
      FOR SELECT USING (
        visibility = ''public'' OR 
        creator_id = auth.uid()::text
      )';
    
    EXECUTE 'CREATE POLICY "Users can create their own collections" ON public.collections
      FOR INSERT WITH CHECK (
        creator_id = auth.uid()::text
      )';
      
    EXECUTE 'CREATE POLICY "Users can update their own collections" ON public.collections
      FOR UPDATE USING (
        creator_id = auth.uid()::text
      )';
      
    EXECUTE 'CREATE POLICY "Users can delete their own collections" ON public.collections
      FOR DELETE USING (
        creator_id = auth.uid()::text
      )';
  END IF;
END $$;

-- Create function to handle card creation with proper UUID
CREATE OR REPLACE FUNCTION create_card_with_uuid(
  p_title text,
  p_description text,
  p_image_url text,
  p_tags text[],
  p_rarity text DEFAULT 'common',
  p_visibility text DEFAULT 'private',
  p_design_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_card_id uuid;
  current_user_id text;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid()::text;
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;
  
  -- Generate new UUID
  new_card_id := gen_random_uuid();
  
  -- Insert the card
  INSERT INTO public.cards (
    id,
    title,
    description,
    creator_id,
    image_url,
    thumbnail_url,
    tags,
    rarity,
    visibility,
    design_metadata,
    abilities,
    created_at,
    updated_at
  ) VALUES (
    new_card_id,
    p_title,
    p_description,
    current_user_id,
    p_image_url,
    p_image_url, -- Use same URL for thumbnail for now
    COALESCE(p_tags, ARRAY[]::text[]),
    p_rarity,
    p_visibility,
    p_design_metadata,
    ARRAY[]::text[], -- Empty abilities array
    now(),
    now()
  );
  
  RETURN new_card_id;
END;
$$;