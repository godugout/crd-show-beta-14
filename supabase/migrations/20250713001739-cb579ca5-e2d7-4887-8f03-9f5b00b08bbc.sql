-- Update crdmkr_processing_jobs table to allow anonymous processing
ALTER TABLE public.crdmkr_processing_jobs 
ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing RLS policies for crdmkr_processing_jobs
DROP POLICY IF EXISTS "Users can view their own processing jobs" ON public.crdmkr_processing_jobs;
DROP POLICY IF EXISTS "Users can create processing jobs" ON public.crdmkr_processing_jobs;
DROP POLICY IF EXISTS "Users can update their own processing jobs" ON public.crdmkr_processing_jobs;

-- Create new RLS policies that support anonymous processing
CREATE POLICY "Users can view their own processing jobs or anonymous jobs" 
ON public.crdmkr_processing_jobs 
FOR SELECT 
USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Authenticated users can create processing jobs" 
ON public.crdmkr_processing_jobs 
FOR INSERT 
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can update their own processing jobs or anonymous jobs" 
ON public.crdmkr_processing_jobs 
FOR UPDATE 
USING (user_id = auth.uid() OR user_id IS NULL);

-- Update psd_layers policies to work with anonymous jobs
DROP POLICY IF EXISTS "Users can view layers from their jobs" ON public.psd_layers;
DROP POLICY IF EXISTS "System can insert layer data" ON public.psd_layers;

CREATE POLICY "Users can view layers from their jobs or anonymous jobs" 
ON public.psd_layers 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.crdmkr_processing_jobs 
  WHERE id = psd_layers.job_id 
  AND (user_id = auth.uid() OR user_id IS NULL)
));

CREATE POLICY "System can insert layer data for any job" 
ON public.psd_layers 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.crdmkr_processing_jobs 
  WHERE id = psd_layers.job_id
));

-- Update psd_generated_frames policies
DROP POLICY IF EXISTS "Users can view frames from their jobs" ON public.psd_generated_frames;
DROP POLICY IF EXISTS "Users can manage frames from their jobs" ON public.psd_generated_frames;

CREATE POLICY "Users can view frames from their jobs or anonymous jobs" 
ON public.psd_generated_frames 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.crdmkr_processing_jobs 
  WHERE id = psd_generated_frames.job_id 
  AND (user_id = auth.uid() OR user_id IS NULL)
));

CREATE POLICY "Users can manage frames from their jobs or anonymous frames" 
ON public.psd_generated_frames 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.crdmkr_processing_jobs 
  WHERE id = psd_generated_frames.job_id 
  AND (user_id = auth.uid() OR user_id IS NULL)
));

-- Update storage policies for psd-originals bucket
DELETE FROM storage.policies WHERE bucket_id = 'psd-originals';

-- Allow anonymous uploads to psd-originals with file size and type restrictions
INSERT INTO storage.policies (bucket_id, name, definition, check_expression, command) VALUES
('psd-originals', 'Anonymous can upload PSD files', 
 'true', 
 '(bucket_id = ''psd-originals'') AND (storage.extension(name) = ''psd'') AND (octet_length(content) <= 104857600)', 
 'INSERT'),
('psd-originals', 'Anyone can view PSD files', 
 'true', 
 'bucket_id = ''psd-originals''', 
 'SELECT'),
('psd-originals', 'Anyone can update PSD files', 
 'true', 
 'bucket_id = ''psd-originals''', 
 'UPDATE'),
('psd-originals', 'Anyone can delete PSD files', 
 'true', 
 'bucket_id = ''psd-originals''', 
 'DELETE');

-- Update storage policies for psd-layers bucket  
DELETE FROM storage.policies WHERE bucket_id = 'psd-layers';

INSERT INTO storage.policies (bucket_id, name, definition, check_expression, command) VALUES
('psd-layers', 'Anonymous can upload layer data', 
 'true', 
 'bucket_id = ''psd-layers''', 
 'INSERT'),
('psd-layers', 'Anyone can view layer data', 
 'true', 
 'bucket_id = ''psd-layers''', 
 'SELECT'),
('psd-layers', 'Anyone can update layer data', 
 'true', 
 'bucket_id = ''psd-layers''', 
 'UPDATE'),
('psd-layers', 'Anyone can delete layer data', 
 'true', 
 'bucket_id = ''psd-layers''', 
 'DELETE');