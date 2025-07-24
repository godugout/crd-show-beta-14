-- Create enum for visual style categories
CREATE TYPE visual_style_category AS ENUM (
  'premium', 'metallic', 'specialty', 'atmospheric', 'classic', 'experimental'
);

-- Create enum for unlock methods
CREATE TYPE unlock_method AS ENUM (
  'free', 'subscription', 'points', 'marketplace', 'premium_template', 'achievement'
);

-- Create CRD Visual Styles table
CREATE TABLE public.crd_visual_styles (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  category visual_style_category NOT NULL DEFAULT 'classic',
  is_locked BOOLEAN NOT NULL DEFAULT true,
  unlock_method unlock_method NOT NULL DEFAULT 'subscription',
  unlock_cost INTEGER DEFAULT 0, -- points or other currency
  base_material JSONB NOT NULL DEFAULT '{}',
  secondary_finish JSONB,
  texture_profile JSONB NOT NULL DEFAULT '{}',
  particle_effect JSONB,
  lighting_preset JSONB NOT NULL DEFAULT '{}',
  animation_profile JSONB,
  ui_preview_gradient TEXT NOT NULL,
  visual_vibe TEXT NOT NULL,
  performance_budget JSONB NOT NULL DEFAULT '{"shaderCost": 1.0, "particleLimit": 100, "renderPasses": 1}',
  shader_config JSONB NOT NULL DEFAULT '{}', -- Obfuscated shader parameters
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user style unlocks table
CREATE TABLE public.user_style_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  style_id TEXT NOT NULL REFERENCES public.crd_visual_styles(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unlock_method unlock_method NOT NULL,
  unlock_metadata JSONB DEFAULT '{}', -- Additional unlock context
  UNIQUE(user_id, style_id)
);

-- Create user style preferences table
CREATE TABLE public.user_style_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  style_id TEXT NOT NULL REFERENCES public.crd_visual_styles(id) ON DELETE CASCADE,
  custom_parameters JSONB DEFAULT '{}', -- User's custom adjustments within allowed bounds
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, style_id)
);

-- Enable RLS
ALTER TABLE public.crd_visual_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_style_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_style_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crd_visual_styles
CREATE POLICY "Visual styles are viewable by everyone"
ON public.crd_visual_styles
FOR SELECT
USING (is_active = true);

-- RLS Policies for user_style_unlocks
CREATE POLICY "Users can view their own unlocks"
ON public.user_style_unlocks
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own unlocks"
ON public.user_style_unlocks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_style_preferences
CREATE POLICY "Users can manage their own style preferences"
ON public.user_style_preferences
FOR ALL
USING (auth.uid() = user_id);

-- Function to check if user has unlocked a style
CREATE OR REPLACE FUNCTION public.user_has_style_unlocked(user_uuid UUID, style_id_param TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_style_unlocks 
    WHERE user_id = user_uuid AND style_id = style_id_param
  ) OR EXISTS (
    SELECT 1 FROM public.crd_visual_styles 
    WHERE id = style_id_param AND is_locked = false
  );
$$;

-- Function to unlock a style for a user
CREATE OR REPLACE FUNCTION public.unlock_style_for_user(
  user_uuid UUID,
  style_id_param TEXT,
  unlock_method_param unlock_method,
  metadata_param JSONB DEFAULT '{}'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  style_exists BOOLEAN;
  already_unlocked BOOLEAN;
BEGIN
  -- Check if style exists
  SELECT EXISTS(SELECT 1 FROM public.crd_visual_styles WHERE id = style_id_param) INTO style_exists;
  
  IF NOT style_exists THEN
    RAISE EXCEPTION 'Style does not exist: %', style_id_param;
  END IF;
  
  -- Check if already unlocked
  SELECT public.user_has_style_unlocked(user_uuid, style_id_param) INTO already_unlocked;
  
  IF already_unlocked THEN
    RETURN false; -- Already unlocked
  END IF;
  
  -- Insert unlock record
  INSERT INTO public.user_style_unlocks (user_id, style_id, unlock_method, unlock_metadata)
  VALUES (user_uuid, style_id_param, unlock_method_param, metadata_param);
  
  RETURN true;
END;
$$;

-- Function to get user's unlocked styles
CREATE OR REPLACE FUNCTION public.get_user_unlocked_styles(user_uuid UUID)
RETURNS TABLE(
  style_id TEXT,
  display_name TEXT,
  category visual_style_category,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  unlock_method unlock_method
)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT 
    cvs.id,
    cvs.display_name,
    cvs.category,
    usu.unlocked_at,
    usu.unlock_method
  FROM public.crd_visual_styles cvs
  LEFT JOIN public.user_style_unlocks usu ON cvs.id = usu.style_id AND usu.user_id = user_uuid
  WHERE cvs.is_active = true AND (cvs.is_locked = false OR usu.style_id IS NOT NULL)
  ORDER BY cvs.sort_order, cvs.display_name;
$$;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_crd_visual_styles_updated_at
  BEFORE UPDATE ON public.crd_visual_styles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_style_preferences_updated_at
  BEFORE UPDATE ON public.user_style_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial premium visual styles
INSERT INTO public.crd_visual_styles (
  id, display_name, category, is_locked, unlock_method, unlock_cost,
  ui_preview_gradient, visual_vibe, base_material, texture_profile, lighting_preset, sort_order
) VALUES 
-- Free starter styles
('basic-foil', 'Basic Foil', 'classic', false, 'free', 0, 
 'linear-gradient(135deg, #C0C0C0, #E8E8E8)', 'Simple metallic shine',
 '{"type": "metallic", "roughness": 0.3, "metalness": 0.8}',
 '{"emboss": 0.2, "grain": 0.1}',
 '{"type": "studio", "intensity": 1.0}', 1),

('matte-classic', 'Matte Classic', 'classic', false, 'free', 0,
 'linear-gradient(135deg, #4A5568, #718096)', 'Clean professional look',
 '{"type": "standard", "roughness": 0.9, "metalness": 0.0}',
 '{"emboss": 0.0, "grain": 0.05}',
 '{"type": "soft", "intensity": 0.8}', 2),

('clear-gloss', 'Clear Gloss', 'classic', false, 'free', 0,
 'linear-gradient(135deg, #E2E8F0, #F7FAFC)', 'Crystal clear finish',
 '{"type": "glass", "roughness": 0.1, "metalness": 0.0, "transmission": 0.9}',
 '{"emboss": 0.1, "grain": 0.0}',
 '{"type": "bright", "intensity": 1.2}', 3),

-- Premium locked styles
('holographic-burst', 'Holographic Burst', 'premium', true, 'subscription', 500,
 'linear-gradient(to right, #e4d00a, #d95eff)', 'Futuristic & eye-catching',
 '{"type": "prismatic", "roughness": 0.1, "metalness": 0.7, "iridescence": 1.0}',
 '{"emboss": 0.3, "grain": 0.0, "holographic": true}',
 '{"type": "studio_hdr", "intensity": 1.5}', 10),

('crystal-interference', 'Crystal Interference', 'specialty', true, 'points', 750,
 'linear-gradient(to right, #6de4dc, #c5b7ff)', 'Ethereal & high-tech',
 '{"type": "crystal", "roughness": 0.05, "metalness": 0.1, "transmission": 0.8}',
 '{"emboss": 0.1, "grain": 0.0, "interference": true}',
 '{"type": "cool_backlit", "intensity": 1.3}', 11),

('chrome-burst', 'Chrome Burst', 'metallic', true, 'subscription', 400,
 'linear-gradient(135deg, #8B9DC3, #DFE7FD)', 'Ultra-reflective mirror finish',
 '{"type": "chrome", "roughness": 0.02, "metalness": 1.0, "reflectivity": 0.95}',
 '{"emboss": 0.2, "grain": 0.05, "chrome": true}',
 '{"type": "sharp_studio", "intensity": 1.4}', 12),

('golden-fire', 'Golden Fire', 'premium', true, 'marketplace', 600,
 'linear-gradient(135deg, #F6AD55, #ED8936)', 'Luxurious gold warmth',
 '{"type": "gold", "roughness": 0.2, "metalness": 0.9, "goldTone": "rich"}',
 '{"emboss": 0.25, "grain": 0.1, "shimmer": true}',
 '{"type": "warm_studio", "intensity": 1.2}', 13),

('ocean-waves', 'Ocean Waves', 'atmospheric', true, 'points', 550,
 'linear-gradient(135deg, #4299E1, #3182CE)', 'Flowing natural movement',
 '{"type": "liquid", "roughness": 0.3, "metalness": 0.2, "flow": true}',
 '{"emboss": 0.15, "grain": 0.0, "waves": true}',
 '{"type": "ambient_soft", "intensity": 1.0}', 14);

-- Auto-unlock free styles for existing users (if any)
-- This would be handled by the application on user registration