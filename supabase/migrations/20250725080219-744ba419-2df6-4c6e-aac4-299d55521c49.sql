-- Create missing tables for CRDMKR functionality

-- PSD Layers table (fixes the console error)
CREATE TABLE IF NOT EXISTS public.psd_layers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psd_file_id UUID NOT NULL,
  layer_name TEXT NOT NULL,
  layer_type TEXT NOT NULL DEFAULT 'normal',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  opacity REAL NOT NULL DEFAULT 1.0,
  blend_mode TEXT DEFAULT 'normal',
  bounds JSONB NOT NULL DEFAULT '{}',
  style_properties JSONB DEFAULT '{}',
  content_data JSONB DEFAULT '{}',
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- PSD Files table  
CREATE TABLE IF NOT EXISTS public.psd_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  processing_status TEXT NOT NULL DEFAULT 'pending',
  layer_count INTEGER DEFAULT 0,
  dimensions JSONB NOT NULL DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CRD Frames table
CREATE TABLE IF NOT EXISTS public.crd_frames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0.0',
  description TEXT,
  preview_image_url TEXT,
  frame_config JSONB NOT NULL DEFAULT '{}',
  included_elements TEXT[] DEFAULT '{}',
  is_public BOOLEAN NOT NULL DEFAULT true,
  price_cents INTEGER NOT NULL DEFAULT 0,
  rating_average REAL NOT NULL DEFAULT 0,
  rating_count INTEGER NOT NULL DEFAULT 0,
  download_count INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  creator_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CRD Elements table
CREATE TABLE IF NOT EXISTS public.crd_elements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  element_type TEXT NOT NULL,
  category TEXT,
  description TEXT,
  config JSONB NOT NULL DEFAULT '{}',
  asset_urls JSONB DEFAULT '{}',
  is_public BOOLEAN NOT NULL DEFAULT true,
  is_free BOOLEAN NOT NULL DEFAULT true,
  price_cents INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  rating_average REAL NOT NULL DEFAULT 0,
  rating_count INTEGER NOT NULL DEFAULT 0,
  download_count INTEGER NOT NULL DEFAULT 0,
  preview_image_url TEXT,
  creator_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CRD Visual Styles table
CREATE TABLE IF NOT EXISTS public.crd_visual_styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'base',
  visual_vibe TEXT NOT NULL,
  ui_preview_gradient TEXT NOT NULL,
  base_material JSONB DEFAULT '{}',
  shader_config JSONB DEFAULT '{}',
  texture_profile JSONB DEFAULT '{}',
  lighting_preset JSONB DEFAULT '{}',
  performance_budget JSONB DEFAULT '{}',
  secondary_finish JSONB,
  particle_effect JSONB,
  animation_profile JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  unlock_method TEXT NOT NULL DEFAULT 'free',
  unlock_cost INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Card Projects (for saving work-in-progress)
CREATE TABLE IF NOT EXISTS public.user_card_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  project_name TEXT NOT NULL,
  project_type TEXT NOT NULL DEFAULT 'crd_card',
  canvas_data JSONB NOT NULL DEFAULT '{}',
  frame_id UUID,
  design_settings JSONB DEFAULT '{}',
  export_settings JSONB DEFAULT '{}',
  last_saved_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.psd_layers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psd_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crd_frames ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crd_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crd_visual_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_card_projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for PSD Layers
CREATE POLICY "Users can view their own PSD layers" ON public.psd_layers
  FOR SELECT USING (
    psd_file_id IN (
      SELECT id FROM public.psd_files WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own PSD layers" ON public.psd_layers
  FOR ALL USING (
    psd_file_id IN (
      SELECT id FROM public.psd_files WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for PSD Files
CREATE POLICY "Users can view their own PSD files" ON public.psd_files
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own PSD files" ON public.psd_files
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for CRD Frames
CREATE POLICY "Anyone can view public CRD frames" ON public.crd_frames
  FOR SELECT USING (is_public = true OR creator_id = auth.uid());

CREATE POLICY "Users can create CRD frames" ON public.crd_frames
  FOR INSERT WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update their own CRD frames" ON public.crd_frames
  FOR UPDATE USING (creator_id = auth.uid());

CREATE POLICY "Users can delete their own CRD frames" ON public.crd_frames
  FOR DELETE USING (creator_id = auth.uid());

-- RLS Policies for CRD Elements
CREATE POLICY "Anyone can view public CRD elements" ON public.crd_elements
  FOR SELECT USING (is_public = true OR creator_id = auth.uid());

CREATE POLICY "Users can create CRD elements" ON public.crd_elements
  FOR INSERT WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update their own CRD elements" ON public.crd_elements
  FOR UPDATE USING (creator_id = auth.uid());

CREATE POLICY "Users can delete their own CRD elements" ON public.crd_elements
  FOR DELETE USING (creator_id = auth.uid());

-- RLS Policies for CRD Visual Styles
CREATE POLICY "Anyone can view active visual styles" ON public.crd_visual_styles
  FOR SELECT USING (is_active = true);

-- RLS Policies for User Card Projects
CREATE POLICY "Users can manage their own card projects" ON public.user_card_projects
  FOR ALL USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_psd_layers_file_id ON public.psd_layers(psd_file_id);
CREATE INDEX IF NOT EXISTS idx_psd_layers_display_order ON public.psd_layers(display_order);
CREATE INDEX IF NOT EXISTS idx_psd_files_user_id ON public.psd_files(user_id);
CREATE INDEX IF NOT EXISTS idx_crd_frames_category ON public.crd_frames(category);
CREATE INDEX IF NOT EXISTS idx_crd_frames_public ON public.crd_frames(is_public);
CREATE INDEX IF NOT EXISTS idx_crd_elements_category ON public.crd_elements(category);
CREATE INDEX IF NOT EXISTS idx_user_card_projects_user_id ON public.user_card_projects(user_id);

-- Insert sample CRD visual styles
INSERT INTO public.crd_visual_styles (
  display_name, category, visual_vibe, ui_preview_gradient,
  base_material, shader_config, is_active
) VALUES 
('Classic Matte', 'base', 'professional', 'linear-gradient(135deg, #1E40AF, #3B82F6)',
 '{"finish": "matte", "roughness": 0.8}', '{"diffuse": 0.9, "specular": 0.1}', true),
('Holographic', 'finish', 'futuristic', 'linear-gradient(135deg, #8B5CF6, #EC4899, #06D6A0)',
 '{"finish": "holographic", "iridescence": 1.0}', '{"rainbow": true, "shimmer": 0.8}', true),
('Premium Foil', 'finish', 'luxury', 'linear-gradient(135deg, #F59E0B, #FBBF24)',
 '{"finish": "metallic", "reflectance": 0.9}', '{"metallic": 0.8, "roughness": 0.2}', true),
('Vintage Texture', 'effect', 'nostalgic', 'linear-gradient(135deg, #92400E, #D97706)',
 '{"finish": "textured", "grain": 0.3}', '{"vintage": true, "sepia": 0.2}', true);

-- Insert sample CRD frames from existing data
INSERT INTO public.crd_frames (
  id, name, category, description, frame_config, included_elements, 
  is_public, price_cents, rating_average, rating_count, download_count, tags
) VALUES 
('classic-sports-1', 'Classic Sports Frame', 'sports', 
 'Professional sports card frame with CRD elements and 4-color theme support',
 '{"dimensions": {"width": 400, "height": 560}, "regions": [{"id": "main-photo", "type": "photo", "bounds": {"x": 8, "y": 28, "width": 384, "height": 468}}]}',
 '{"primary-frame", "catalog-header", "card-footer"}',
 true, 0, 4.7, 234, 2156, '{"sports", "professional", "crd-compliant"}'),
('fantasy-mystical-1', 'Mystical Fantasy Frame', 'fantasy',
 'Fantasy-themed CRD frame with magical elements and 4-color theme support',
 '{"dimensions": {"width": 400, "height": 560}, "regions": [{"id": "main-photo", "type": "photo", "bounds": {"x": 12, "y": 40, "width": 376, "height": 440}}]}',
 '{"fantasy-frame", "fantasy-header", "fantasy-footer"}',
 true, 200, 4.9, 167, 1893, '{"fantasy", "mystical", "crd-compliant", "premium"}'),
('full-bleed-back', 'CRD Card Back', 'default',
 'Full bleed CRD card back with centered logo and gradient background',
 '{"dimensions": {"width": 400, "height": 560}, "regions": []}',
 '{"background-gradient", "crd-logo", "catalog-bottom", "series-bottom"}',
 true, 0, 5.0, 1, 1, '{"default", "card-back", "crd-logo", "full-bleed"}');