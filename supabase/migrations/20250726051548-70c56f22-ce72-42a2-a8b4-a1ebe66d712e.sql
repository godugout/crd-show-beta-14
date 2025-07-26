-- Fix card ID generation and storage issues
-- First, update the generate_proper_card_id function to return proper UUIDs
DROP FUNCTION IF EXISTS generate_proper_card_id();

CREATE OR REPLACE FUNCTION generate_proper_card_id()
RETURNS uuid
LANGUAGE sql
AS $$
  SELECT gen_random_uuid();
$$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Public card images viewable" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload card images" ON storage.objects;

-- Create better storage policies for card-images bucket
CREATE POLICY "Anyone can view card images" ON storage.objects
  FOR SELECT USING (bucket_id = 'card-images');

CREATE POLICY "Authenticated users can upload to card-images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'card-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own card images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'card-images' AND
    auth.role() = 'authenticated'
  );

-- Ensure the bucket is properly configured
UPDATE storage.buckets 
SET public = true 
WHERE id = 'card-images';