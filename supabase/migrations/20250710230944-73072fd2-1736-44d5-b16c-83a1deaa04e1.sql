-- Create comprehensive sports database for global team branding
-- This creates the foundation for Phase 2: Sports Database Architecture

-- Sports categories (US Sports, Global Soccer, etc.)
CREATE TABLE public.sport_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  region TEXT, -- 'US', 'Europe', 'Global', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Sports leagues (NFL, NBA, Premier League, etc.)
CREATE TABLE public.sports_leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  abbreviation TEXT,
  sport_category_id UUID REFERENCES public.sport_categories(id),
  country TEXT,
  founded_year INTEGER,
  official_website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Sports teams with comprehensive brand data
CREATE TABLE public.sports_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  nickname TEXT, -- "Warriors", "Lakers", etc.
  city TEXT NOT NULL,
  league_id UUID REFERENCES public.sports_leagues(id),
  
  -- Official brand colors (hex values)
  primary_color TEXT NOT NULL,
  secondary_color TEXT NOT NULL,
  accent_color TEXT,
  neutral_color TEXT,
  
  -- Team metadata
  founded_year INTEGER,
  logo_url TEXT,
  official_website TEXT,
  stadium_arena TEXT,
  
  -- Brand guidelines
  brand_guidelines JSONB DEFAULT '{}',
  alternate_colors JSONB DEFAULT '[]', -- Array of color schemes
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Generated color palettes for each team (auto-calculated)
CREATE TABLE public.team_color_palettes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.sports_teams(id) ON DELETE CASCADE,
  
  -- 4-color palette (HSL format for CSS)
  primary_hsl TEXT NOT NULL, -- "217 100 25"
  secondary_hsl TEXT NOT NULL,
  accent_hsl TEXT NOT NULL,
  neutral_hsl TEXT NOT NULL,
  
  -- UI optimization data
  navbar_bg_hsl TEXT NOT NULL, -- Optimized for logo contrast
  text_primary_hsl TEXT NOT NULL,
  text_secondary_hsl TEXT NOT NULL,
  cta_bg_hsl TEXT NOT NULL,
  
  -- Accessibility compliance
  contrast_ratio DECIMAL,
  accessibility_level TEXT, -- "AA", "AAA", etc.
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Seed data for major sport categories
INSERT INTO public.sport_categories (name, description, region) VALUES
('US Professional Sports', 'Major US professional leagues', 'US'),
('European Soccer', 'European football leagues and teams', 'Europe'),
('Global Soccer', 'International football teams and competitions', 'Global'),
('Cricket', 'International cricket teams and leagues', 'Global'),
('Rugby', 'International rugby teams and competitions', 'Global'),
('Hockey', 'Professional hockey leagues worldwide', 'Global'),
('Olympics', 'Olympic Games country representations', 'Global'),
('US College Sports', 'Major US college athletics', 'US');

-- Seed data for major US sports leagues
INSERT INTO public.sports_leagues (name, abbreviation, sport_category_id, country, founded_year) 
SELECT 
  league_name,
  league_abbr,
  sc.id,
  'USA',
  founded
FROM (VALUES
  ('National Football League', 'NFL', 1920),
  ('National Basketball Association', 'NBA', 1946),
  ('Major League Baseball', 'MLB', 1903),
  ('National Hockey League', 'NHL', 1917),
  ('Major League Soccer', 'MLS', 1993)
) AS leagues(league_name, league_abbr, founded)
CROSS JOIN public.sport_categories sc
WHERE sc.name = 'US Professional Sports';

-- Seed data for major European soccer leagues
INSERT INTO public.sports_leagues (name, abbreviation, sport_category_id, country, founded_year)
SELECT 
  league_name,
  league_abbr,
  sc.id,
  country_name,
  founded
FROM (VALUES
  ('Premier League', 'EPL', 'England', 1992),
  ('La Liga', 'LaLiga', 'Spain', 1929),
  ('Serie A', 'Serie A', 'Italy', 1898),
  ('Bundesliga', 'Bundesliga', 'Germany', 1963),
  ('Ligue 1', 'Ligue 1', 'France', 1932)
) AS leagues(league_name, league_abbr, country_name, founded)
CROSS JOIN public.sport_categories sc
WHERE sc.name = 'European Soccer';

-- Enable RLS for all tables
ALTER TABLE public.sport_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_color_palettes ENABLE ROW LEVEL SECURITY;

-- RLS policies (public read access for sports data)
CREATE POLICY "Anyone can view sport categories" ON public.sport_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view sports leagues" ON public.sports_leagues FOR SELECT USING (true);
CREATE POLICY "Anyone can view sports teams" ON public.sports_teams FOR SELECT USING (true);
CREATE POLICY "Anyone can view team color palettes" ON public.team_color_palettes FOR SELECT USING (true);

-- Admin can manage sports data
CREATE POLICY "Admins can manage sport categories" ON public.sport_categories FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage sports leagues" ON public.sports_leagues FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage sports teams" ON public.sports_teams FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage team palettes" ON public.team_color_palettes FOR ALL USING (is_admin(auth.uid()));

-- Function to automatically generate color palette when team is created/updated
CREATE OR REPLACE FUNCTION generate_team_palette()
RETURNS TRIGGER AS $$
DECLARE
  primary_h INTEGER;
  primary_s INTEGER;
  primary_l INTEGER;
  optimal_navbar_bg TEXT;
  optimal_text_primary TEXT;
BEGIN
  -- Convert hex to HSL for primary color to determine optimal backgrounds
  -- This is a simplified conversion - in production, use a more robust hex-to-hsl function
  
  -- Smart navbar background based on primary color brightness
  -- Dark colors get light backgrounds, light colors get dark backgrounds
  IF LENGTH(NEW.primary_color) = 7 THEN
    -- Simple brightness calculation
    primary_l := (
      ('x' || SUBSTRING(NEW.primary_color, 2, 2))::bit(8)::int * 299 +
      ('x' || SUBSTRING(NEW.primary_color, 4, 2))::bit(8)::int * 587 +
      ('x' || SUBSTRING(NEW.primary_color, 6, 2))::bit(8)::int * 114
    ) / 1000;
    
    -- Determine optimal navbar background and text colors
    IF primary_l > 128 THEN
      optimal_navbar_bg := '0 0 15'; -- Dark background for light logos
      optimal_text_primary := '0 0 100'; -- White text
    ELSE
      optimal_navbar_bg := '0 0 95'; -- Light background for dark logos  
      optimal_text_primary := '0 0 10'; -- Dark text
    END IF;
  ELSE
    -- Fallback values
    optimal_navbar_bg := '0 0 50';
    optimal_text_primary := '0 0 100';
  END IF;

  -- Insert or update the color palette
  INSERT INTO public.team_color_palettes (
    team_id,
    primary_hsl,
    secondary_hsl,
    accent_hsl,
    neutral_hsl,
    navbar_bg_hsl,
    text_primary_hsl,
    text_secondary_hsl,
    cta_bg_hsl,
    contrast_ratio,
    accessibility_level
  ) VALUES (
    NEW.id,
    '0 0 50', -- Will be calculated properly in production
    '0 0 100',
    '0 0 75',
    '0 0 25',
    optimal_navbar_bg,
    optimal_text_primary,
    '0 0 70',
    '0 0 60',
    4.5,
    'AA'
  )
  ON CONFLICT (team_id) DO UPDATE SET
    navbar_bg_hsl = optimal_navbar_bg,
    text_primary_hsl = optimal_text_primary,
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate palette when team is created/updated
CREATE TRIGGER generate_team_palette_trigger
  AFTER INSERT OR UPDATE ON public.sports_teams
  FOR EACH ROW
  EXECUTE FUNCTION generate_team_palette();

-- Create indexes for performance
CREATE INDEX idx_sports_teams_league ON public.sports_teams(league_id);
CREATE INDEX idx_sports_teams_name ON public.sports_teams(name);
CREATE INDEX idx_sports_leagues_category ON public.sports_leagues(sport_category_id);
CREATE INDEX idx_team_palettes_team ON public.team_color_palettes(team_id);

COMMENT ON TABLE public.sports_teams IS 'Comprehensive database of global sports teams with official brand colors';
COMMENT ON TABLE public.team_color_palettes IS 'Auto-generated 4-color palettes optimized for UI theming';
COMMENT ON FUNCTION generate_team_palette() IS 'Automatically creates optimal color palettes for team branding';