-- Fix storage bucket policies for card-images bucket
-- Allow authenticated users to insert their own images
INSERT INTO storage.policies (bucket_id, policy_name, definition, allowed_operation, check_expression)
VALUES (
  'card-images',
  'Users can upload their own card images',
  'INSERT',
  'authenticated',
  'auth.uid()::text = (storage.foldername(name))[1]'
) ON CONFLICT DO NOTHING;

-- Allow authenticated users to select their own images  
INSERT INTO storage.policies (bucket_id, policy_name, definition, allowed_operation, check_expression)
VALUES (
  'card-images', 
  'Users can view their own card images',
  'SELECT',
  'authenticated',
  'auth.uid()::text = (storage.foldername(name))[1]'
) ON CONFLICT DO NOTHING;

-- Allow public access to card images (since cards can be public)
INSERT INTO storage.policies (bucket_id, policy_name, definition, allowed_operation, check_expression)  
VALUES (
  'card-images',
  'Public can view card images', 
  'SELECT',
  'public',
  'true'
) ON CONFLICT DO NOTHING;