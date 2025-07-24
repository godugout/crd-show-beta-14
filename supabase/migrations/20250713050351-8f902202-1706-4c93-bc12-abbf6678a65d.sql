
-- Create cardshow_brands table
CREATE TABLE public.cardshow_brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dna_code TEXT NOT NULL UNIQUE,
  file_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  product_name TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size INTEGER,
  image_dimensions JSONB,
  category TEXT NOT NULL,
  group_type TEXT,
  font_style TEXT NOT NULL DEFAULT 'Unknown',
  design_elements TEXT[] DEFAULT '{}',
  style_tags TEXT[] DEFAULT '{}',
  color_palette TEXT[] DEFAULT '{}',
  primary_color TEXT NOT NULL,
  secondary_color TEXT NOT NULL,
  tertiary_color TEXT,
  quaternary_color TEXT,
  logo_theme JSONB DEFAULT '{}',
  theme_usage JSONB DEFAULT '{}',
  team_code TEXT,
  team_name TEXT,
  team_city TEXT,
  league TEXT,
  mascot TEXT,
  founded_year INTEGER,
  decade TEXT,
  rarity TEXT NOT NULL DEFAULT 'common',
  power_level INTEGER NOT NULL DEFAULT 50,
  unlock_method TEXT NOT NULL DEFAULT 'starter',
  collectibility_score INTEGER NOT NULL DEFAULT 50,
  is_blendable BOOLEAN NOT NULL DEFAULT true,
  is_remixable BOOLEAN NOT NULL DEFAULT true,
  total_supply INTEGER,
  current_supply INTEGER NOT NULL DEFAULT 0,
  drop_rate NUMERIC NOT NULL DEFAULT 0.5,
  description TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Create brand_usage_stats table
CREATE TABLE public.brand_usage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.cardshow_brands(id) ON DELETE CASCADE,
  user_id UUID,
  usage_count INTEGER NOT NULL DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  usage_context TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(brand_id, user_id, usage_context)
);

-- Enable RLS on both tables
ALTER TABLE public.cardshow_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_usage_stats ENABLE ROW LEVEL SECURITY;

-- RLS policies for cardshow_brands
CREATE POLICY "Anyone can view active brands" ON public.cardshow_brands
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can create brands" ON public.cardshow_brands
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own brands" ON public.cardshow_brands
  FOR UPDATE USING (created_by = auth.uid());

-- RLS policies for brand_usage_stats
CREATE POLICY "Users can view their own usage stats" ON public.brand_usage_stats
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own usage stats" ON public.brand_usage_stats
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own usage stats" ON public.brand_usage_stats
  FOR UPDATE USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_cardshow_brands_dna_code ON public.cardshow_brands(dna_code);
CREATE INDEX idx_cardshow_brands_category ON public.cardshow_brands(category);
CREATE INDEX idx_cardshow_brands_rarity ON public.cardshow_brands(rarity);
CREATE INDEX idx_cardshow_brands_active ON public.cardshow_brands(is_active);
CREATE INDEX idx_brand_usage_stats_brand_id ON public.brand_usage_stats(brand_id);
CREATE INDEX idx_brand_usage_stats_user_id ON public.brand_usage_stats(user_id);
