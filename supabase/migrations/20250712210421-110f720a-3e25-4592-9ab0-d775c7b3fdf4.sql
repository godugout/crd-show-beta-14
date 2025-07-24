-- Copyright-Safe CRD:DNA System Migration
-- Create tables for the new city-based, color-coded DNA system

-- Cities table for location-based identity
CREATE TABLE IF NOT EXISTS public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_code VARCHAR(10) UNIQUE NOT NULL,
  city_name VARCHAR(100) NOT NULL,
  state_province VARCHAR(100),
  state_code VARCHAR(10),
  country VARCHAR(100) NOT NULL DEFAULT 'USA',
  region VARCHAR(50),
  coordinates POINT,
  area_codes TEXT[],
  nicknames TEXT[],
  landmarks TEXT[],
  cuisine TEXT[],
  established_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Color schemes table for visual identity
CREATE TABLE IF NOT EXISTS public.color_schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  color_code VARCHAR(10) UNIQUE NOT NULL,
  primary_color VARCHAR(7) NOT NULL,
  secondary_color VARCHAR(7) NOT NULL,
  tertiary_color VARCHAR(7),
  accent_color VARCHAR(7),
  color_names TEXT[] NOT NULL,
  combo_name VARCHAR(100),
  pattern VARCHAR(20) DEFAULT 'solid',
  contrast VARCHAR(10) DEFAULT 'high',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Style definitions table
CREATE TABLE IF NOT EXISTS public.style_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  style_code VARCHAR(20) UNIQUE NOT NULL,
  style_name VARCHAR(50) NOT NULL,
  era VARCHAR(20),
  typography_style VARCHAR(20) DEFAULT 'sans',
  typography_weight VARCHAR(20) DEFAULT 'regular',
  typography_transform VARCHAR(20),
  has_borders BOOLEAN DEFAULT false,
  has_shadows BOOLEAN DEFAULT false,
  has_gradients BOOLEAN DEFAULT false,
  textures TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Updated DNA entries table for copyright-safe system
CREATE TABLE IF NOT EXISTS public.dna_entries_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dna_code VARCHAR(50) UNIQUE NOT NULL, -- "bal_orb_classic"
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
CREATE INDEX IF NOT EXISTS idx_dna_v2_city ON public.dna_entries_v2(city_id);
CREATE INDEX IF NOT EXISTS idx_dna_v2_colors ON public.dna_entries_v2(color_scheme_id);
CREATE INDEX IF NOT EXISTS idx_dna_v2_style ON public.dna_entries_v2(style_id);
CREATE INDEX IF NOT EXISTS idx_dna_v2_rarity ON public.dna_entries_v2(rarity);
CREATE INDEX IF NOT EXISTS idx_dna_v2_code ON public.dna_entries_v2(dna_code);
CREATE INDEX IF NOT EXISTS idx_cities_name ON public.cities(city_name);
CREATE INDEX IF NOT EXISTS idx_cities_country ON public.cities(country);
CREATE INDEX IF NOT EXISTS idx_cities_region ON public.cities(region);
CREATE INDEX IF NOT EXISTS idx_colors_code ON public.color_schemes(color_code);

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

-- Allow admins to manage data
CREATE POLICY "Allow admins to manage cities" ON public.cities FOR ALL USING (is_admin());
CREATE POLICY "Allow admins to manage color schemes" ON public.color_schemes FOR ALL USING (is_admin());
CREATE POLICY "Allow admins to manage style definitions" ON public.style_definitions FOR ALL USING (is_admin());
CREATE POLICY "Allow admins to manage DNA entries v2" ON public.dna_entries_v2 FOR ALL USING (is_admin());

-- Insert some initial data
INSERT INTO public.cities (city_code, city_name, state_province, state_code, country, region, nicknames, landmarks, emoji, established_year) VALUES
('BAL', 'Baltimore', 'Maryland', 'MD', 'USA', 'Mid-Atlantic', ARRAY['Charm City', 'Monument City'], ARRAY['Inner Harbor', 'Fort McHenry'], '🦀', 1729),
('BOS', 'Boston', 'Massachusetts', 'MA', 'USA', 'Northeast', ARRAY['Beantown', 'The Hub'], ARRAY['Freedom Trail', 'Fenway Park'], '🦞', 1630),
('NYY', 'New York', 'New York', 'NY', 'USA', 'Northeast', ARRAY['The Big Apple', 'City That Never Sleeps'], ARRAY['Statue of Liberty', 'Central Park'], '🗽', 1624),
('CHI', 'Chicago', 'Illinois', 'IL', 'USA', 'Midwest', ARRAY['Windy City', 'Second City'], ARRAY['Willis Tower', 'Millennium Park'], '🌆', 1837),
('LAD', 'Los Angeles', 'California', 'CA', 'USA', 'West Coast', ARRAY['City of Angels', 'LA'], ARRAY['Hollywood Sign', 'Santa Monica Pier'], '🌴', 1781),
('SF', 'San Francisco', 'California', 'CA', 'USA', 'West Coast', ARRAY['The City', 'Fog City'], ARRAY['Golden Gate Bridge', 'Alcatraz'], '🌉', 1776);

INSERT INTO public.color_schemes (color_code, primary_color, secondary_color, tertiary_color, color_names, combo_name) VALUES
('ORB', '#DF4601', '#000000', '#FFFFFF', ARRAY['Orange', 'Black', 'White'], 'Orange & Black'),
('RNW', '#BD3039', '#0C2340', '#FFFFFF', ARRAY['Red', 'Navy', 'White'], 'Red & Navy'),
('BLU', '#132448', '#FFFFFF', '#C4CED4', ARRAY['Navy', 'White', 'Silver'], 'Navy & Pinstripe'),
('GRN', '#228B22', '#FFD700', '#FFFFFF', ARRAY['Green', 'Gold', 'White'], 'Green & Gold'),
('BLO', '#0047AB', '#FF7F00', '#FFFFFF', ARRAY['Blue', 'Orange', 'White'], 'Blue & Orange');

INSERT INTO public.style_definitions (style_code, style_name, era, typography_style, typography_weight) VALUES
('classic', 'Classic', '1980s', 'serif', 'bold'),
('modern', 'Modern', '2020s', 'sans', 'regular'),
('vintage', 'Vintage', '1970s', 'script', 'bold'),
('script', 'Script', '1990s', 'script', 'regular'),
('block', 'Block', '2000s', 'sans', 'black');

-- Insert sample DNA entries
INSERT INTO public.dna_entries_v2 (
  dna_code, city_id, color_scheme_id, style_id, emoji, symbols, vibes, rarity, power_level, legacy_team_code, legacy_team_name
) VALUES
(
  'bal_orb_classic',
  (SELECT id FROM public.cities WHERE city_code = 'BAL'),
  (SELECT id FROM public.color_schemes WHERE color_code = 'ORB'),
  (SELECT id FROM public.style_definitions WHERE style_code = 'classic'),
  '🦀',
  ARRAY['crab', 'ship', 'star'],
  ARRAY['maritime', 'historic', 'industrial'],
  'uncommon',
  75,
  'BAL',
  'Baltimore Orioles'
);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cities_updated_at BEFORE UPDATE ON public.cities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dna_entries_v2_updated_at BEFORE UPDATE ON public.dna_entries_v2 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();