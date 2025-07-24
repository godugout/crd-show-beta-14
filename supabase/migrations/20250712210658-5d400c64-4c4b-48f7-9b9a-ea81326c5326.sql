-- Create the main DNA entries table and policies

-- Updated DNA entries table for copyright-safe system
CREATE TABLE public.dna_entries_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dna_code VARCHAR(50) UNIQUE NOT NULL,
  city_id UUID REFERENCES public.cities(id),
  color_scheme_id UUID REFERENCES public.color_schemes(id),
  style_id UUID REFERENCES public.style_definitions(id),
  variant VARCHAR(20) DEFAULT 'home',
  
  -- Cultural properties
  emoji VARCHAR(10),
  symbols TEXT[],
  vibes TEXT[],
  music TEXT[],
  architecture TEXT[],
  climate VARCHAR(50),
  
  -- Game mechanics
  rarity VARCHAR(20) NOT NULL DEFAULT 'common',
  power_level INTEGER DEFAULT 50 CHECK (power_level >= 1 AND power_level <= 100),
  unlock_method VARCHAR(20) DEFAULT 'starter',
  collectibility INTEGER DEFAULT 50 CHECK (collectibility >= 1 AND collectibility <= 100),
  is_blendable BOOLEAN DEFAULT true,
  is_remixable BOOLEAN DEFAULT true,
  
  -- Scarcity system
  total_supply INTEGER,
  current_supply INTEGER DEFAULT 0,
  drop_rate DECIMAL(3,3) DEFAULT 0.5 CHECK (drop_rate >= 0 AND drop_rate <= 1),
  
  -- Minting rules
  requires_achievement TEXT,
  seasonal_only BOOLEAN DEFAULT false,
  requires_purchase BOOLEAN DEFAULT false,
  pack_exclusive BOOLEAN DEFAULT false,
  
  -- Metadata
  version VARCHAR(10) DEFAULT '2.0.0',
  source VARCHAR(20) DEFAULT 'official',
  tags TEXT[],
  search_terms TEXT[],
  community_tags TEXT[],
  popularity INTEGER DEFAULT 0,
  
  -- Legacy support for migration
  legacy_team_code VARCHAR(10),
  legacy_team_name VARCHAR(100),
  legacy_group VARCHAR(10),
  migration_date TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_dna_v2_city ON public.dna_entries_v2(city_id);
CREATE INDEX idx_dna_v2_colors ON public.dna_entries_v2(color_scheme_id);
CREATE INDEX idx_dna_v2_style ON public.dna_entries_v2(style_id);
CREATE INDEX idx_dna_v2_rarity ON public.dna_entries_v2(rarity);
CREATE INDEX idx_dna_v2_code ON public.dna_entries_v2(dna_code);

-- Add RLS policies
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.color_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.style_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dna_entries_v2 ENABLE ROW LEVEL SECURITY;

-- Allow public read access for all tables
CREATE POLICY "Allow public read access to cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Allow public read access to color schemes" ON public.color_schemes FOR SELECT USING (true);
CREATE POLICY "Allow public read access to style definitions" ON public.style_definitions FOR SELECT USING (true);
CREATE POLICY "Allow public read access to DNA entries v2" ON public.dna_entries_v2 FOR SELECT USING (true);