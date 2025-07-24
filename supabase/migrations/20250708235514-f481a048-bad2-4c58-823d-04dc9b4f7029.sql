-- Create feature_flags table for controlling optional creation flows
CREATE TABLE public.feature_flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flag_key TEXT NOT NULL UNIQUE,
  flag_name TEXT NOT NULL,
  description TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  target_audience JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Enable RLS
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view enabled flags" 
ON public.feature_flags 
FOR SELECT 
USING (is_enabled = true);

CREATE POLICY "Admins can manage all flags" 
ON public.feature_flags 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE user_id = auth.uid()
  )
);

-- Insert initial feature flags for revolutionary creator
INSERT INTO public.feature_flags (flag_key, flag_name, description, is_enabled, rollout_percentage) VALUES
('revolutionary_create_mode', 'Revolutionary Card Creator', 'Enable the revolutionary interactive card creation mode', false, 0),
('advanced_particle_systems', 'Advanced Particle Systems', 'Enable advanced particle system designer', false, 0),
('biometric_integration', 'Biometric Integration', 'Enable biometric card response features', false, 0),
('collaborative_fusion', 'Collaborative Fusion', 'Enable multi-user card collaboration features', false, 0),
('visual_programming', 'Visual Programming', 'Enable visual programming canvas for card behaviors', false, 0);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_feature_flags_updated_at
BEFORE UPDATE ON public.feature_flags
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();