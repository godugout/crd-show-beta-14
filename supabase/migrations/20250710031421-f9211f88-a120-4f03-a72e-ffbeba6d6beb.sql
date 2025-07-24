-- Create CRD Frames core tables
CREATE TABLE public.crd_frames (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text,
  version text DEFAULT '1.0.0',
  description text,
  preview_image_url text,
  frame_config jsonb NOT NULL,
  included_elements text[] DEFAULT '{}',
  is_public boolean DEFAULT true,
  price_cents integer DEFAULT 0,
  rating_average numeric DEFAULT 0,
  rating_count integer DEFAULT 0,
  download_count integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  creator_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create CRD Elements table for reusable components
CREATE TABLE public.crd_elements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  element_type text NOT NULL,
  category text,
  description text,
  config jsonb NOT NULL,
  asset_urls jsonb,
  is_public boolean DEFAULT true,
  is_free boolean DEFAULT true,
  price_cents integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  rating_average numeric DEFAULT 0,
  rating_count integer DEFAULT 0,
  download_count integer DEFAULT 0,
  preview_image_url text,
  creator_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create CRD Visual Styles for advanced rendering
CREATE TYPE visual_style_category AS ENUM ('base', 'finish', 'effect', 'animation');
CREATE TYPE unlock_method AS ENUM ('free', 'purchase', 'achievement', 'premium');

CREATE TABLE public.crd_visual_styles (
  id text NOT NULL PRIMARY KEY,
  display_name text NOT NULL,
  category visual_style_category DEFAULT 'base',
  visual_vibe text NOT NULL,
  ui_preview_gradient text NOT NULL,
  base_material jsonb NOT NULL DEFAULT '{}',
  shader_config jsonb NOT NULL DEFAULT '{}',
  texture_profile jsonb NOT NULL DEFAULT '{}',
  lighting_preset jsonb NOT NULL DEFAULT '{}',
  performance_budget jsonb NOT NULL DEFAULT '{}',
  secondary_finish jsonb,
  particle_effect jsonb,
  animation_profile jsonb,
  is_active boolean DEFAULT true,
  is_locked boolean DEFAULT false,
  unlock_method unlock_method DEFAULT 'free',
  unlock_cost integer,
  sort_order integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.crd_frames ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crd_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crd_visual_styles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crd_frames
CREATE POLICY "Public can view published frames" ON public.crd_frames
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create frames" ON public.crd_frames
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own frames" ON public.crd_frames
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can view their own frames" ON public.crd_frames
  FOR SELECT USING (auth.uid() = creator_id);

-- RLS Policies for crd_elements
CREATE POLICY "Public can view public elements" ON public.crd_elements
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create elements" ON public.crd_elements
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own elements" ON public.crd_elements
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can view their own elements" ON public.crd_elements
  FOR SELECT USING (auth.uid() = creator_id);

-- RLS Policies for crd_visual_styles
CREATE POLICY "Everyone can view active visual styles" ON public.crd_visual_styles
  FOR SELECT USING (is_active = true);

-- Insert default visual styles
INSERT INTO public.crd_visual_styles (
  id, display_name, category, visual_vibe, ui_preview_gradient,
  base_material, shader_config, texture_profile, lighting_preset, performance_budget,
  is_active, is_locked, sort_order
) VALUES 
(
  'classic_matte',
  'Classic Matte',
  'base',
  'Traditional trading card with subtle texture',
  'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  '{"type": "matte", "roughness": 0.8, "metalness": 0.0}',
  '{"diffuse": 1.0, "specular": 0.2, "emission": 0.0}',
  '{"paper_grain": 0.3, "ink_absorption": 0.7}',
  '{"ambient": 0.4, "key_light": 0.8, "rim_light": 0.2}',
  '{"max_triangles": 50000, "texture_memory_mb": 64}',
  true, false, 1
),
(
  'premium_gloss',
  'Premium Gloss',
  'finish',
  'High-end glossy finish with reflections',
  'linear-gradient(135deg, #ffffff 0%, #f1f3f4 50%, #e8eaed 100%)',
  '{"type": "gloss", "roughness": 0.1, "metalness": 0.0}',
  '{"diffuse": 0.8, "specular": 0.9, "emission": 0.0}',
  '{"surface_smoothness": 0.9, "reflection_intensity": 0.7}',
  '{"ambient": 0.3, "key_light": 1.0, "rim_light": 0.4}',
  '{"max_triangles": 75000, "texture_memory_mb": 96}',
  true, false, 2
),
(
  'holographic',
  'Holographic',
  'effect',
  'Rainbow holographic effect with prismatic colors',
  'linear-gradient(135deg, #ff0080 0%, #00ff80 25%, #0080ff 50%, #8000ff 75%, #ff0080 100%)',
  '{"type": "holographic", "roughness": 0.2, "metalness": 0.1}',
  '{"diffuse": 0.6, "specular": 1.0, "emission": 0.2, "iridescence": 1.0}',
  '{"rainbow_intensity": 0.8, "shift_speed": 0.5}',
  '{"ambient": 0.2, "key_light": 1.2, "rim_light": 0.6}',
  '{"max_triangles": 100000, "texture_memory_mb": 128}',
  true, true, 3
),
(
  'foil_chrome',
  'Foil Chrome',
  'effect',
  'Metallic chrome foil with mirror finish',
  'linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 50%, #808080 100%)',
  '{"type": "metallic", "roughness": 0.05, "metalness": 0.9}',
  '{"diffuse": 0.3, "specular": 1.0, "emission": 0.0}',
  '{"chrome_intensity": 0.9, "mirror_reflection": 0.8}',
  '{"ambient": 0.2, "key_light": 1.0, "rim_light": 0.8}',
  '{"max_triangles": 80000, "texture_memory_mb": 112}',
  true, true, 4
);

-- Create indexes for performance
CREATE INDEX idx_crd_frames_category ON public.crd_frames(category);
CREATE INDEX idx_crd_frames_creator ON public.crd_frames(creator_id);
CREATE INDEX idx_crd_frames_public ON public.crd_frames(is_public) WHERE is_public = true;
CREATE INDEX idx_crd_elements_type ON public.crd_elements(element_type);
CREATE INDEX idx_crd_elements_category ON public.crd_elements(category);
CREATE INDEX idx_crd_visual_styles_category ON public.crd_visual_styles(category);
CREATE INDEX idx_crd_visual_styles_active ON public.crd_visual_styles(is_active) WHERE is_active = true;