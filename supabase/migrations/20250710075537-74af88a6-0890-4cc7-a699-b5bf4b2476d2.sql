-- Create table for PSD processing jobs
CREATE TABLE public.crdmkr_processing_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  progress INTEGER DEFAULT 0,
  error_message TEXT,
  result JSONB,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for extracted PSD layers
CREATE TABLE public.psd_layers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.crdmkr_processing_jobs(id) ON DELETE CASCADE,
  layer_name TEXT NOT NULL,
  layer_type TEXT NOT NULL, -- 'text', 'image', 'group', 'shape'
  bounds JSONB NOT NULL, -- {x, y, width, height}
  content JSONB, -- layer content (text content, image data, etc.)
  style_properties JSONB, -- fonts, colors, effects
  parent_layer_id UUID REFERENCES public.psd_layers(id),
  layer_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for generated frames from PSD
CREATE TABLE public.psd_generated_frames (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.crdmkr_processing_jobs(id) ON DELETE CASCADE,
  frame_name TEXT NOT NULL,
  frame_config JSONB NOT NULL, -- CRD frame configuration
  layer_mapping JSONB, -- mapping of PSD layers to frame regions
  auto_generated BOOLEAN DEFAULT true,
  user_modified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.crdmkr_processing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psd_layers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psd_generated_frames ENABLE ROW LEVEL SECURITY;

-- RLS Policies for processing jobs
CREATE POLICY "Users can view their own processing jobs" 
ON public.crdmkr_processing_jobs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own processing jobs" 
ON public.crdmkr_processing_jobs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own processing jobs" 
ON public.crdmkr_processing_jobs 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for PSD layers
CREATE POLICY "Users can view layers from their jobs" 
ON public.psd_layers 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.crdmkr_processing_jobs 
  WHERE id = psd_layers.job_id AND user_id = auth.uid()
));

CREATE POLICY "System can insert layer data" 
ON public.psd_layers 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.crdmkr_processing_jobs 
  WHERE id = psd_layers.job_id AND user_id = auth.uid()
));

-- RLS Policies for generated frames
CREATE POLICY "Users can view frames from their jobs" 
ON public.psd_generated_frames 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.crdmkr_processing_jobs 
  WHERE id = psd_generated_frames.job_id AND user_id = auth.uid()
));

CREATE POLICY "Users can manage frames from their jobs" 
ON public.psd_generated_frames 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.crdmkr_processing_jobs 
  WHERE id = psd_generated_frames.job_id AND user_id = auth.uid()
));

-- Add trigger for updated_at
CREATE TRIGGER update_crdmkr_processing_jobs_updated_at
  BEFORE UPDATE ON public.crdmkr_processing_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_psd_generated_frames_updated_at
  BEFORE UPDATE ON public.psd_generated_frames
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();