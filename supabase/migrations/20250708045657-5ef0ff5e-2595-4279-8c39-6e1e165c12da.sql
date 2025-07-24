-- Create storage bucket for optimized images
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit) 
VALUES (
  'optimized-images', 
  'optimized-images', 
  true,
  '{"image/webp", "image/jpeg", "image/png"}',
  10485760  -- 10MB limit
);

-- Create storage policies for optimized images
CREATE POLICY "Public access to optimized images"
ON storage.objects FOR SELECT
USING (bucket_id = 'optimized-images');

CREATE POLICY "System can upload optimized images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'optimized-images');

CREATE POLICY "System can update optimized images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'optimized-images');

CREATE POLICY "System can delete optimized images"
ON storage.objects FOR DELETE
USING (bucket_id = 'optimized-images');