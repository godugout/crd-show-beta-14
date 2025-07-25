-- Drop existing tables if they exist to avoid conflicts
DROP TABLE IF EXISTS public.user_card_projects CASCADE;
DROP TABLE IF EXISTS public.crd_frames CASCADE;
DROP TABLE IF EXISTS public.psd_layers CASCADE;
DROP TABLE IF EXISTS public.psd_files CASCADE;

-- Create psd_files table first (no dependencies)
CREATE TABLE public.psd_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  original_url TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  layer_count INTEGER NOT NULL DEFAULT 0,
  file_size INTEGER NOT NULL DEFAULT 0,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create psd_layers table (depends on psd_files)
CREATE TABLE public.psd_layers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  psd_file_id UUID NOT NULL REFERENCES public.psd_files(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  layer_type TEXT NOT NULL DEFAULT 'image',
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  opacity NUMERIC(3,2) DEFAULT 1.0,
  blend_mode TEXT DEFAULT 'normal',
  is_visible BOOLEAN DEFAULT true,
  layer_index INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crd_frames table (no dependencies on other new tables)
CREATE TABLE public.crd_frames (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  frame_config JSONB NOT NULL DEFAULT '{}',
  is_public BOOLEAN DEFAULT true,
  price_cents INTEGER DEFAULT 0,
  rating_average NUMERIC(3,2) DEFAULT 0.0,
  rating_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  creator_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_card_projects table (no dependencies on other new tables)
CREATE TABLE public.user_card_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  project_name TEXT NOT NULL,
  project_type TEXT NOT NULL DEFAULT 'crd_card',
  project_data JSONB NOT NULL DEFAULT '{}',
  thumbnail_url TEXT,
  is_template BOOLEAN DEFAULT false,
  template_category TEXT,
  last_modified TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.psd_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psd_layers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crd_frames ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_card_projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for psd_files
CREATE POLICY "Users can view public PSD files" ON public.psd_files
  FOR SELECT USING (true);

CREATE POLICY "Users can upload their own PSD files" ON public.psd_files
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own PSD files" ON public.psd_files
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own PSD files" ON public.psd_files
  FOR DELETE USING (auth.uid() = created_by);

-- Create RLS policies for psd_layers
CREATE POLICY "Users can view all PSD layers" ON public.psd_layers
  FOR SELECT USING (true);

CREATE POLICY "Users can create layers for their PSD files" ON public.psd_layers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.psd_files 
      WHERE id = psd_file_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update layers of their PSD files" ON public.psd_layers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.psd_files 
      WHERE id = psd_file_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete layers of their PSD files" ON public.psd_layers
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.psd_files 
      WHERE id = psd_file_id AND created_by = auth.uid()
    )
  );

-- Create RLS policies for crd_frames
CREATE POLICY "Users can view public CRD frames" ON public.crd_frames
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own CRD frames" ON public.crd_frames
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Users can create their own CRD frames" ON public.crd_frames
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own CRD frames" ON public.crd_frames
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own CRD frames" ON public.crd_frames
  FOR DELETE USING (auth.uid() = creator_id);

-- Create RLS policies for user_card_projects
CREATE POLICY "Users can view their own projects" ON public.user_card_projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" ON public.user_card_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.user_card_projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON public.user_card_projects
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_psd_files_created_by ON public.psd_files(created_by);
CREATE INDEX idx_psd_files_uploaded_at ON public.psd_files(uploaded_at DESC);

CREATE INDEX idx_psd_layers_psd_file_id ON public.psd_layers(psd_file_id);
CREATE INDEX idx_psd_layers_layer_index ON public.psd_layers(psd_file_id, layer_index);

CREATE INDEX idx_crd_frames_category ON public.crd_frames(category);
CREATE INDEX idx_crd_frames_creator_id ON public.crd_frames(creator_id);
CREATE INDEX idx_crd_frames_is_public ON public.crd_frames(is_public);
CREATE INDEX idx_crd_frames_rating ON public.crd_frames(rating_average DESC);

CREATE INDEX idx_user_card_projects_user_id ON public.user_card_projects(user_id);
CREATE INDEX idx_user_card_projects_type ON public.user_card_projects(project_type);
CREATE INDEX idx_user_card_projects_modified ON public.user_card_projects(last_modified DESC);

-- Insert sample CRD frames
INSERT INTO public.crd_frames (name, category, description, frame_config, is_public, creator_id) VALUES
('Classic Sports Card', 'sports', 'Traditional sports card layout with player photo and stats', 
 '{"width": 400, "height": 560, "elements": [{"type": "image", "id": "player_photo", "x": 20, "y": 20, "width": 360, "height": 280}, {"type": "text", "id": "player_name", "x": 20, "y": 320, "width": 360, "height": 40, "fontSize": 24, "fontWeight": "bold"}, {"type": "text", "id": "team_name", "x": 20, "y": 370, "width": 360, "height": 30, "fontSize": 18}, {"type": "rect", "id": "stats_background", "x": 20, "y": 420, "width": 360, "height": 120, "fill": "#f0f0f0"}, {"type": "text", "id": "stats_text", "x": 30, "y": 440, "width": 340, "height": 80, "fontSize": 14}]}', 
 true, NULL),

('Fantasy Character', 'fantasy', 'Mystical character card with ornate borders and magical elements', 
 '{"width": 400, "height": 560, "elements": [{"type": "rect", "id": "border", "x": 0, "y": 0, "width": 400, "height": 560, "fill": "linear-gradient(45deg, #4a1a4a, #2a0a2a)", "rx": 15}, {"type": "image", "id": "character_art", "x": 20, "y": 60, "width": 360, "height": 300}, {"type": "text", "id": "character_name", "x": 20, "y": 20, "width": 360, "height": 35, "fontSize": 20, "fontWeight": "bold", "color": "#gold"}, {"type": "rect", "id": "ability_box", "x": 20, "y": 380, "width": 360, "height": 160, "fill": "rgba(0,0,0,0.7)", "rx": 10}, {"type": "text", "id": "abilities", "x": 30, "y": 400, "width": 340, "height": 120, "fontSize": 12, "color": "#fff"}]}', 
 true, NULL),

('Minimalist Modern', 'modern', 'Clean, minimal design with focus on typography and white space', 
 '{"width": 400, "height": 560, "elements": [{"type": "rect", "id": "background", "x": 0, "y": 0, "width": 400, "height": 560, "fill": "#ffffff"}, {"type": "image", "id": "main_image", "x": 40, "y": 40, "width": 320, "height": 320}, {"type": "text", "id": "title", "x": 40, "y": 380, "width": 320, "height": 50, "fontSize": 28, "fontWeight": "300", "color": "#333"}, {"type": "text", "id": "subtitle", "x": 40, "y": 440, "width": 320, "height": 30, "fontSize": 16, "color": "#666"}, {"type": "line", "id": "accent_line", "x1": 40, "y1": 480, "x2": 120, "y2": 480, "stroke": "#000", "strokeWidth": 2}]}', 
 true, NULL);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_psd_files_updated_at
  BEFORE UPDATE ON public.psd_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_psd_layers_updated_at
  BEFORE UPDATE ON public.psd_layers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crd_frames_updated_at
  BEFORE UPDATE ON public.crd_frames
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_card_projects_updated_at
  BEFORE UPDATE ON public.user_card_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();