-- Create storage bucket for card images if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'card-images', 
  'card-images', 
  true, 
  10485760, -- 10MB limit
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for card images
-- Allow authenticated users to upload their own card images
CREATE POLICY "Authenticated users can upload card images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'card-images' 
  AND auth.uid() IS NOT NULL
);

-- Allow public read access to card images
CREATE POLICY "Public read access to card images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'card-images');

-- Allow users to update/delete their own card images
CREATE POLICY "Users can update their card images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'card-images' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete their card images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'card-images' 
  AND auth.uid() IS NOT NULL
);