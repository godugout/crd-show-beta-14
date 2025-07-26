-- Create proper storage policies for card-images bucket
CREATE POLICY "Users can upload their own card images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'card-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own card images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'card-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public can view card images" ON storage.objects
  FOR SELECT USING (bucket_id = 'card-images');