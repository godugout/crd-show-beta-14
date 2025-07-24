
-- Remove cricket teams and color themes, reorganize existing data for proper sports categorization
DELETE FROM public.teams WHERE sport = 'Cricket';
DELETE FROM public.color_themes WHERE name LIKE '%Cricket%' OR primary_example_team LIKE '%Cricket%';

-- Update existing teams to have proper sport categorization
UPDATE public.teams SET sport = 'Baseball' WHERE league = 'MLB' OR name LIKE '%Baseball%';
UPDATE public.teams SET sport = 'Basketball' WHERE league = 'NBA' OR name LIKE '%Basketball%';
UPDATE public.teams SET sport = 'Football' WHERE league = 'NFL' OR name LIKE '%Football%';
UPDATE public.teams SET sport = 'Hockey' WHERE league = 'NHL' OR name LIKE '%Hockey%';
UPDATE public.teams SET sport = 'Soccer' WHERE league = 'FIFA' OR name LIKE '%Soccer%' OR league = 'MLS';

-- Add some popular team color schemes for each sport
INSERT INTO public.color_themes (name, primary_color, secondary_color, accent_color, text_color, primary_example_team) VALUES
  -- Baseball teams
  ('Yankees Navy/Gray', '#132448', '#C4CED4', '#FFFFFF', '#FFFFFF', 'New York Yankees'),
  ('Red Sox Red/Navy', '#BD3039', '#0C2340', '#FFFFFF', '#FFFFFF', 'Boston Red Sox'),
  ('Dodgers Blue/White', '#005A9C', '#FFFFFF', '#EF3E42', '#FFFFFF', 'Los Angeles Dodgers'),
  
  -- Basketball teams  
  ('Lakers Purple/Gold', '#552583', '#FDB927', '#FFFFFF', '#FFFFFF', 'Los Angeles Lakers'),
  ('Celtics Green/White', '#007A33', '#FFFFFF', '#BA9653', '#FFFFFF', 'Boston Celtics'),
  ('Bulls Red/Black', '#CE1141', '#000000', '#FFFFFF', '#FFFFFF', 'Chicago Bulls'),
  
  -- Football teams
  ('Cowboys Blue/Silver', '#003594', '#869397', '#FFFFFF', '#FFFFFF', 'Dallas Cowboys'),
  ('Patriots Navy/Red', '#002244', '#C60C30', '#B0B7BC', '#FFFFFF', 'New England Patriots'),
  ('Packers Green/Gold', '#203731', '#FFB612', '#FFFFFF', '#FFFFFF', 'Green Bay Packers'),
  
  -- Hockey teams
  ('Rangers Blue/Red', '#0038A8', '#CE1126', '#FFFFFF', '#FFFFFF', 'New York Rangers'),
  ('Bruins Gold/Black', '#FFB81C', '#000000', '#FFFFFF', '#FFFFFF', 'Boston Bruins'),
  ('Blackhawks Red/Black', '#CF0A2C', '#000000', '#FF671B', '#FFFFFF', 'Chicago Blackhawks'),
  
  -- Soccer teams
  ('Manchester United Red', '#DA020E', '#FBE122', '#000000', '#FFFFFF', 'Manchester United'),
  ('Barcelona Blue/Red', '#A50044', '#004D98', '#FFED02', '#FFFFFF', 'FC Barcelona'),
  ('Real Madrid White/Gold', '#FEBE10', '#00529F', '#FFFFFF', '#000000', 'Real Madrid');

-- Add corresponding teams for the new color themes
INSERT INTO public.teams (name, city, abbreviation, league, sport, color_theme_id) VALUES
  -- Baseball
  ('Yankees', 'New York', 'NYY', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Yankees Navy/Gray')),
  ('Red Sox', 'Boston', 'BOS', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Red Sox Red/Navy')),
  ('Dodgers', 'Los Angeles', 'LAD', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Dodgers Blue/White')),
  
  -- Basketball
  ('Lakers', 'Los Angeles', 'LAL', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Lakers Purple/Gold')),
  ('Celtics', 'Boston', 'BOS', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Celtics Green/White')),
  ('Bulls', 'Chicago', 'CHI', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Bulls Red/Black')),
  
  -- Football
  ('Cowboys', 'Dallas', 'DAL', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Cowboys Blue/Silver')),
  ('Patriots', 'New England', 'NE', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Patriots Navy/Red')),
  ('Packers', 'Green Bay', 'GB', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Packers Green/Gold')),
  
  -- Hockey
  ('Rangers', 'New York', 'NYR', 'NHL', 'Hockey', (SELECT id FROM public.color_themes WHERE name = 'Rangers Blue/Red')),
  ('Bruins', 'Boston', 'BOS', 'NHL', 'Hockey', (SELECT id FROM public.color_themes WHERE name = 'Bruins Gold/Black')),
  ('Blackhawks', 'Chicago', 'CHI', 'NHL', 'Hockey', (SELECT id FROM public.color_themes WHERE name = 'Blackhawks Red/Black')),
  
  -- Soccer
  ('Man United', 'Manchester', 'MUN', 'EPL', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'Manchester United Red')),
  ('Barcelona', 'Barcelona', 'BAR', 'La Liga', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'Barcelona Blue/Red')),
  ('Real Madrid', 'Madrid', 'RM', 'La Liga', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'Real Madrid White/Gold'));
