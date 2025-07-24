
-- Create enums for standardized values
CREATE TYPE brand_rarity AS ENUM ('common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic');
CREATE TYPE unlock_method AS ENUM ('starter', 'achievement', 'premium', 'seasonal', 'special', 'legacy');
CREATE TYPE brand_category AS ENUM ('Script', 'Bold', 'Retro', 'Modern', 'Fantasy', 'SciFi', 'Classic');
CREATE TYPE font_style AS ENUM ('Script', 'Block', 'Sans', 'Serif', 'Display', 'Unknown');

-- Master Cardshow Brands table
CREATE TABLE public.cardshow_brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Core Identification
  dna_code VARCHAR(50) UNIQUE NOT NULL,
  file_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  product_name TEXT,
  
  -- Visual Assets
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size INTEGER,
  image_dimensions JSONB DEFAULT '{}',
  
  -- Categorization
  category brand_category NOT NULL,
  group_type VARCHAR(10), -- MLB, NCAA, UNI, CRD, 3D, etc
  font_style font_style DEFAULT 'Unknown',
  design_elements TEXT[] DEFAULT '{}',
  style_tags TEXT[] DEFAULT '{}',
  
  -- Color System
  color_palette TEXT[] NOT NULL DEFAULT '{}',
  primary_color VARCHAR(7) NOT NULL, -- Hex color
  secondary_color VARCHAR(7) NOT NULL,
  tertiary_color VARCHAR(7),
  quaternary_color VARCHAR(7),
  
  -- Theme Integration
  logo_theme JSONB NOT NULL DEFAULT '{}',
  theme_usage JSONB NOT NULL DEFAULT '{}',
  
  -- Team/Organization Data
  team_code VARCHAR(10),
  team_name TEXT,
  team_city TEXT,
  league VARCHAR(20),
  mascot TEXT,
  founded_year INTEGER,
  decade VARCHAR(10), -- 70s, 80s, 00s, etc
  
  -- Gaming/Collectibility Attributes
  rarity brand_rarity NOT NULL DEFAULT 'common',
  power_level INTEGER DEFAULT 50 CHECK (power_level >= 1 AND power_level <= 100),
  unlock_method unlock_method DEFAULT 'starter',
  collectibility_score INTEGER DEFAULT 50 CHECK (collectibility_score >= 1 AND collectibility_score <= 100),
  is_blendable BOOLEAN DEFAULT true,
  is_remixable BOOLEAN DEFAULT true,
  total_supply INTEGER, -- NULL for unlimited
  current_supply INTEGER DEFAULT 0,
  drop_rate DECIMAL(5,4) DEFAULT 0.5000 CHECK (drop_rate >= 0 AND drop_rate <= 1),
  
  -- Metadata & Management
  description TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- Brand Minting Rules (separate table for complex rules)
CREATE TABLE public.brand_minting_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.cardshow_brands(id) ON DELETE CASCADE,
  requires_achievement TEXT,
  seasonal_only BOOLEAN DEFAULT false,
  requires_purchase BOOLEAN DEFAULT false,
  pack_exclusive BOOLEAN DEFAULT false,
  special_requirements JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brand Usage Statistics
CREATE TABLE public.brand_usage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.cardshow_brands(id) ON DELETE CASCADE,
  user_id UUID,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usage_context TEXT, -- 'navbar', 'card_creation', 'theme_selection', etc
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(brand_id, user_id, usage_context)
);

-- Create indexes for performance
CREATE INDEX idx_cardshow_brands_dna_code ON public.cardshow_brands(dna_code);
CREATE INDEX idx_cardshow_brands_category ON public.cardshow_brands(category);
CREATE INDEX idx_cardshow_brands_team_code ON public.cardshow_brands(team_code);
CREATE INDEX idx_cardshow_brands_rarity ON public.cardshow_brands(rarity);
CREATE INDEX idx_cardshow_brands_active ON public.cardshow_brands(is_active);
CREATE INDEX idx_cardshow_brands_sort_order ON public.cardshow_brands(sort_order);

-- Indexes for related tables
CREATE INDEX idx_brand_minting_rules_brand_id ON public.brand_minting_rules(brand_id);
CREATE INDEX idx_brand_usage_stats_brand_id ON public.brand_usage_stats(brand_id);
CREATE INDEX idx_brand_usage_stats_user_id ON public.brand_usage_stats(user_id);

-- Add RLS policies
ALTER TABLE public.cardshow_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_minting_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_usage_stats ENABLE ROW LEVEL SECURITY;

-- Public read access for brands (anyone can view)
CREATE POLICY "Allow public read access to cardshow brands" 
  ON public.cardshow_brands FOR SELECT USING (is_active = true);

-- Admin/creator write access for brands
CREATE POLICY "Admins can manage cardshow brands" 
  ON public.cardshow_brands FOR ALL 
  USING (is_admin(auth.uid()));

-- Public read access for minting rules
CREATE POLICY "Allow public read access to brand minting rules" 
  ON public.brand_minting_rules FOR SELECT USING (true);

-- Admin write access for minting rules
CREATE POLICY "Admins can manage brand minting rules" 
  ON public.brand_minting_rules FOR ALL 
  USING (is_admin(auth.uid()));

-- Users can manage their own usage stats
CREATE POLICY "Users can manage their own brand usage stats" 
  ON public.brand_usage_stats FOR ALL 
  USING (auth.uid() = user_id);

-- Public read access for usage stats (for analytics)
CREATE POLICY "Allow public read access to brand usage stats" 
  ON public.brand_usage_stats FOR SELECT USING (true);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_cardshow_brands_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cardshow_brands_updated_at
  BEFORE UPDATE ON public.cardshow_brands
  FOR EACH ROW
  EXECUTE FUNCTION update_cardshow_brands_updated_at();

CREATE TRIGGER update_brand_usage_stats_updated_at
  BEFORE UPDATE ON public.brand_usage_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_cardshow_brands_updated_at();
