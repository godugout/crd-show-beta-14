
-- Create color_themes table to store unique color combinations
CREATE TABLE public.color_themes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  primary_color text NOT NULL,
  secondary_color text NOT NULL,
  accent_color text NOT NULL,
  text_color text NOT NULL DEFAULT '#FFFFFF',
  primary_example_team text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create teams table to store all teams using each color theme
CREATE TABLE public.teams (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  city text NOT NULL,
  abbreviation text NOT NULL,
  league text NOT NULL,
  sport text NOT NULL,
  color_theme_id uuid REFERENCES public.color_themes(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.color_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Allow public read access to color themes and teams (since these are reference data)
CREATE POLICY "Allow public read access to color themes" 
  ON public.color_themes 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access to teams" 
  ON public.teams 
  FOR SELECT 
  USING (true);

-- Insert color themes with their primary example teams
INSERT INTO public.color_themes (name, primary_color, secondary_color, accent_color, text_color, primary_example_team) VALUES
  ('Navy/Silver/White', '#132448', '#C4CED4', '#FFFFFF', '#FFFFFF', 'NY Yankees'),
  ('Red/Navy/White', '#BD3039', '#0C2340', '#FFFFFF', '#FFFFFF', 'BOS Red Sox'),
  ('Blue/White/Red', '#005A9C', '#FFFFFF', '#EF3E42', '#FFFFFF', 'LA Dodgers'),
  ('Orange/Black/Cream', '#FD5A1E', '#27251F', '#AE8F6F', '#FFFFFF', 'SF Giants'),
  ('Blue/Red/White', '#0E3386', '#CC3433', '#FFFFFF', '#FFFFFF', 'CHI Cubs'),
  ('Red/Yellow/Navy', '#C41E3A', '#FEDB00', '#0C2340', '#FFFFFF', 'STL Cardinals'),
  ('Purple/Gold/White', '#552583', '#FDB927', '#FFFFFF', '#FFFFFF', 'LA Lakers'),
  ('Green/Gold/White', '#007A33', '#BA9653', '#FFFFFF', '#FFFFFF', 'BOS Celtics'),
  ('Navy/Gold/White', '#1D428A', '#FFC72C', '#FFFFFF', '#FFFFFF', 'GS Warriors'),
  ('Red/Black/White', '#CE1141', '#000000', '#FFFFFF', '#FFFFFF', 'CHI Bulls'),
  ('Green/Black/Yellow', '#203731', '#000000', '#FFB612', '#FFFFFF', 'GB Packers'),
  ('Yellow/Black/Red', '#FFB612', '#101820', '#C60C30', '#000000', 'PIT Steelers'),
  ('Navy/Orange/White', '#002D62', '#EB6E1F', '#FFFFFF', '#FFFFFF', 'HOU Astros'),
  ('Red/Navy/Gold', '#CE1141', '#13274F', '#EAAA00', '#FFFFFF', 'ATL Braves'),
  ('Blue/Orange/White', '#002D72', '#FF5910', '#FFFFFF', '#FFFFFF', 'NY Mets'),
  ('Red/Blue/White', '#E81828', '#002D72', '#FFFFFF', '#FFFFFF', 'PHI Phillies'),
  ('Navy/Teal/Silver', '#0C2C56', '#005C5C', '#C4CED4', '#FFFFFF', 'SEA Mariners'),
  ('Red/Navy/Silver', '#BA0021', '#003263', '#C4CED4', '#FFFFFF', 'LA Angels'),
  ('Green/Black/Silver', '#004C54', '#000000', '#A5ACAF', '#FFFFFF', 'PHI Eagles'),
  ('Purple/Black/Gold', '#241773', '#000000', '#9E7C0C', '#FFFFFF', 'BAL Ravens'),
  ('Orange/Navy/White', '#FB4F14', '#002244', '#FFFFFF', '#FFFFFF', 'DEN Broncos'),
  ('Navy/Green/Silver', '#002244', '#69BE28', '#A5ACAF', '#FFFFFF', 'SEA Seahawks'),
  ('Red/Gold/White', '#E31837', '#FFB81C', '#FFFFFF', '#FFFFFF', 'KC Chiefs'),
  ('Silver/Black/White', '#000000', '#A5ACAF', '#FFFFFF', '#FFFFFF', 'LV Raiders'),
  ('Red/Black/Gold', '#98002E', '#000000', '#F9A01B', '#FFFFFF', 'MIA Heat'),
  ('Black/Silver/White', '#000000', '#C4CED4', '#FFFFFF', '#FFFFFF', 'SA Spurs'),
  ('Blue/Navy/Silver', '#00538C', '#002B5E', '#B8C4CA', '#FFFFFF', 'DAL Mavericks'),
  ('Orange/Purple/Gold', '#E56020', '#1D1160', '#F9AD1B', '#FFFFFF', 'PHX Suns'),
  ('Red/Black/Silver', '#CE1141', '#000000', '#A1A1A4', '#FFFFFF', 'TOR Raptors'),
  ('Red/White/Black', '#CE1126', '#FFFFFF', '#000000', '#FFFFFF', 'DET Red Wings'),
  ('Black/Gold/White', '#000000', '#FCB514', '#FFFFFF', '#FFFFFF', 'PIT Penguins'),
  ('Red/Blue/White Alt', '#AF1E2D', '#192168', '#FFFFFF', '#FFFFFF', 'MTL Canadiens'),
  ('Orange/Blue/White', '#FF4C00', '#041E42', '#FFFFFF', '#FFFFFF', 'EDM Oilers'),
  ('Blue/Black/White', '#002868', '#000000', '#FFFFFF', '#FFFFFF', 'TB Lightning'),
  ('Maroon/Blue/Gold', '#A50044', '#004D98', '#EDBB00', '#FFFFFF', 'FC Barcelona'),
  ('White/Gold/Blue', '#FFFFFF', '#FFC72C', '#00529F', '#000000', 'Real Madrid');

-- Insert teams for each color theme
INSERT INTO public.teams (name, city, abbreviation, league, sport, color_theme_id) VALUES
  -- Navy/Silver/White teams
  ('Yankees', 'New York', 'NYY', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Navy/Silver/White')),
  ('Cowboys', 'Dallas', 'DAL', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Navy/Silver/White')),
  
  -- Red/Navy/White teams  
  ('Red Sox', 'Boston', 'BOS', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Red/Navy/White')),
  ('Patriots', 'New England', 'NE', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Red/Navy/White')),
  ('Nationals', 'Washington', 'WSH', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Red/Navy/White')),
  
  -- Blue/White/Red teams
  ('Dodgers', 'Los Angeles', 'LAD', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Blue/White/Red')),
  ('Bills', 'Buffalo', 'BUF', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Blue/White/Red')),
  ('Pistons', 'Detroit', 'DET', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Blue/White/Red')),
  
  -- Orange/Black/Cream teams
  ('Giants', 'San Francisco', 'SF', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Orange/Black/Cream')),
  ('Orioles', 'Baltimore', 'BAL', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Orange/Black/Cream')),
  ('Bengals', 'Cincinnati', 'CIN', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Orange/Black/Cream')),
  
  -- Blue/Red/White teams
  ('Cubs', 'Chicago', 'CHC', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Blue/Red/White')),
  ('Rangers', 'Texas', 'TEX', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Blue/Red/White')),
  
  -- Red/Yellow/Navy teams
  ('Cardinals', 'St. Louis', 'STL', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Red/Yellow/Navy')),
  ('Cavaliers', 'Cleveland', 'CLE', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Red/Yellow/Navy')),
  
  -- Purple/Gold/White teams
  ('Lakers', 'Los Angeles', 'LAL', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Purple/Gold/White')),
  ('Vikings', 'Minnesota', 'MIN', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Purple/Gold/White')),
  
  -- Green/Gold/White teams
  ('Celtics', 'Boston', 'BOS', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Green/Gold/White')),
  ('Packers', 'Green Bay', 'GB', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Green/Gold/White')),
  ('Athletics', 'Oakland', 'OAK', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Green/Gold/White')),
  
  -- Navy/Gold/White teams
  ('Warriors', 'Golden State', 'GSW', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Navy/Gold/White')),
  ('Rams', 'Los Angeles', 'LAR', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Navy/Gold/White')),
  
  -- Red/Black/White teams
  ('Bulls', 'Chicago', 'CHI', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Red/Black/White')),
  ('Blackhawks', 'Chicago', 'CHI', 'NHL', 'Hockey', (SELECT id FROM public.color_themes WHERE name = 'Red/Black/White')),
  ('Falcons', 'Atlanta', 'ATL', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Red/Black/White')),
  
  -- Additional teams for other themes...
  ('Steelers', 'Pittsburgh', 'PIT', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Yellow/Black/Red')),
  ('Astros', 'Houston', 'HOU', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Navy/Orange/White')),
  ('Braves', 'Atlanta', 'ATL', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Red/Navy/Gold')),
  ('Mets', 'New York', 'NYM', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Blue/Orange/White')),
  ('Phillies', 'Philadelphia', 'PHI', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Red/Blue/White')),
  ('Mariners', 'Seattle', 'SEA', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Navy/Teal/Silver')),
  ('Angels', 'Los Angeles', 'LAA', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Red/Navy/Silver')),
  ('Eagles', 'Philadelphia', 'PHI', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Green/Black/Silver')),
  ('Ravens', 'Baltimore', 'BAL', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Purple/Black/Gold')),
  ('Broncos', 'Denver', 'DEN', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Orange/Navy/White')),
  ('Seahawks', 'Seattle', 'SEA', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Navy/Green/Silver')),
  ('Chiefs', 'Kansas City', 'KC', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Red/Gold/White')),
  ('Raiders', 'Las Vegas', 'LV', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Silver/Black/White')),
  ('Heat', 'Miami', 'MIA', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Red/Black/Gold')),
  ('Spurs', 'San Antonio', 'SA', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Black/Silver/White')),
  ('Mavericks', 'Dallas', 'DAL', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Blue/Navy/Silver')),
  ('Suns', 'Phoenix', 'PHX', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Orange/Purple/Gold')),
  ('Raptors', 'Toronto', 'TOR', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Red/Black/Silver'));

-- Create indexes for better performance
CREATE INDEX idx_teams_color_theme_id ON public.teams(color_theme_id);
CREATE INDEX idx_teams_league ON public.teams(league);
CREATE INDEX idx_teams_sport ON public.teams(sport);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_color_themes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_color_themes_updated_at
  BEFORE UPDATE ON public.color_themes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_color_themes_updated_at();
