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

-- Update storage.objects policies for psd-originals bucket to allow anonymous access
CREATE POLICY "Anonymous PSD upload access" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'psd-originals' AND (storage.extension(name) = 'psd'));

CREATE POLICY "Anonymous PSD view access" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'psd-originals');

CREATE POLICY "Anonymous PSD update access" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'psd-originals');

CREATE POLICY "Anonymous PSD delete access" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'psd-originals');

-- Update storage.objects policies for psd-layers bucket
CREATE POLICY "Anonymous layer upload access" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'psd-layers');

CREATE POLICY "Anonymous layer view access" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'psd-layers');

CREATE POLICY "Anonymous layer update access" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'psd-layers');

CREATE POLICY "Anonymous layer delete access" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'psd-layers');