-- Fix storage policies for card-images bucket
-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload card images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'card-images' 
  AND auth.role() = 'authenticated'
);

-- Allow users to view their own uploaded images
CREATE POLICY "Allow users to view their own card images" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'card-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own images
CREATE POLICY "Allow users to update their own card images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'card-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own images
CREATE POLICY "Allow users to delete their own card images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'card-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);