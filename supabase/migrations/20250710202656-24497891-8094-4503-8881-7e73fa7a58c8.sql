-- Enhanced PSD storage system with better caching and persistence

-- Create storage bucket for PSD layer images
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit) 
VALUES (
  'psd-layers', 
  'psd-layers', 
  true,
  '{"image/png", "image/jpeg", "image/webp"}',
  52428800  -- 50MB limit
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies for PSD layer images
CREATE POLICY "Public access to PSD layer images"
ON storage.objects FOR SELECT
USING (bucket_id = 'psd-layers');

CREATE POLICY "Authenticated users can upload PSD layer images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'psd-layers' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their PSD layer images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'psd-layers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their PSD layer images"
ON storage.objects FOR DELETE
USING (bucket_id = 'psd-layers' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage bucket for original PSD files
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit) 
VALUES (
  'psd-originals', 
  'psd-originals', 
  false,
  '{"image/vnd.adobe.photoshop"}',
  104857600  -- 100MB limit for PSD files
) ON CONFLICT (id) DO NOTHING;

-- Create policies for original PSD files
CREATE POLICY "Users can access their own PSD files"
ON storage.objects FOR SELECT
USING (bucket_id = 'psd-originals' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own PSD files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'psd-originals' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own PSD files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'psd-originals' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own PSD files"
ON storage.objects FOR DELETE
USING (bucket_id = 'psd-originals' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add new columns to existing tables for better caching
ALTER TABLE crdmkr_processing_jobs 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS original_file_path TEXT,
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS cached_layers_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE psd_layers 
ADD COLUMN IF NOT EXISTS cached_image_url TEXT,
ADD COLUMN IF NOT EXISTS layer_hash TEXT,
ADD COLUMN IF NOT EXISTS last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_psd_layers_job_user ON psd_layers(job_id) WHERE job_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_processing_jobs_user ON crdmkr_processing_jobs(user_id) WHERE user_id IS NOT NULL;

-- Create user session table for auto-save functionality
CREATE TABLE IF NOT EXISTS user_psd_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  job_id UUID REFERENCES crdmkr_processing_jobs(id) NOT NULL,
  session_data JSONB NOT NULL DEFAULT '{}',
  visible_layers TEXT[] DEFAULT '{}',
  layer_modifications JSONB DEFAULT '{}',
  canvas_state JSONB DEFAULT '{}',
  auto_saved_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- Enable RLS for user sessions
ALTER TABLE user_psd_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for user sessions
CREATE POLICY "Users can view their own PSD sessions" 
ON user_psd_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own PSD sessions" 
ON user_psd_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own PSD sessions" 
ON user_psd_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own PSD sessions" 
ON user_psd_sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating timestamps
CREATE TRIGGER update_psd_sessions_updated_at
BEFORE UPDATE ON user_psd_sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_psd_layers_modified_at
BEFORE UPDATE ON psd_layers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();