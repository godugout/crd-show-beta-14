
-- Clean up existing data and implement comprehensive city/team/color database
DELETE FROM public.teams;
DELETE FROM public.color_themes;

-- Baseball Teams and Color Themes
INSERT INTO public.color_themes (name, primary_color, secondary_color, accent_color, text_color, primary_example_team) VALUES
  ('Yankees Navy/Gray', '#132448', '#C4CED4', '#FFFFFF', '#FFFFFF', 'New York Yankees'),
  ('Red Sox Red/Navy', '#BD3039', '#0C2340', '#FFFFFF', '#FFFFFF', 'Boston Red Sox'),
  ('Dodgers Blue/White', '#005A9C', '#FFFFFF', '#EF3E42', '#FFFFFF', 'Los Angeles Dodgers'),
  ('Giants Orange/Black', '#FD5A1E', '#000000', '#FFFFFF', '#FFFFFF', 'San Francisco Giants'),
  ('Cubs Blue/Red', '#0E3386', '#CC3433', '#FFFFFF', '#FFFFFF', 'Chicago Cubs'),
  ('Cardinals Red/Navy', '#C41E3A', '#0C2340', '#FEDB00', '#FFFFFF', 'St. Louis Cardinals'),
  ('Astros Navy/Orange', '#002D62', '#EB6E1F', '#FFFFFF', '#FFFFFF', 'Houston Astros'),
  ('Braves Navy/Red', '#CE1141', '#13274F', '#FFFFFF', '#FFFFFF', 'Atlanta Braves'),
  ('Phillies Red/Blue', '#E81828', '#002D72', '#FFFFFF', '#FFFFFF', 'Philadelphia Phillies'),
  ('Tigers Navy/Orange', '#0C2340', '#FA4616', '#FFFFFF', '#FFFFFF', 'Detroit Tigers'),
  ('Athletics Green/Gold', '#003831', '#EFB21E', '#FFFFFF', '#FFFFFF', 'Oakland Athletics'),
  ('Mariners Navy/Teal', '#0C2C56', '#005C5C', '#C4CED4', '#FFFFFF', 'Seattle Mariners');

-- Basketball Teams and Color Themes
INSERT INTO public.color_themes (name, primary_color, secondary_color, accent_color, text_color, primary_example_team) VALUES
  ('Lakers Purple/Gold', '#552583', '#FDB927', '#FFFFFF', '#FFFFFF', 'Los Angeles Lakers'),
  ('Celtics Green/White', '#007A33', '#FFFFFF', '#BA9653', '#FFFFFF', 'Boston Celtics'),
  ('Bulls Red/Black', '#CE1141', '#000000', '#FFFFFF', '#FFFFFF', 'Chicago Bulls'),
  ('Warriors Blue/Gold', '#1D428A', '#FFC72C', '#FFFFFF', '#FFFFFF', 'Golden State Warriors'),
  ('Heat Red/Black', '#98002E', '#000000', '#F9A01B', '#FFFFFF', 'Miami Heat'),
  ('Spurs Black/Silver', '#C4CED4', '#000000', '#FFFFFF', '#FFFFFF', 'San Antonio Spurs'),
  ('Knicks Blue/Orange', '#006BB6', '#F58426', '#FFFFFF', '#FFFFFF', 'New York Knicks'),
  ('Nets Black/White', '#000000', '#FFFFFF', '#777D84', '#FFFFFF', 'Brooklyn Nets'),
  ('Suns Orange/Purple', '#E56020', '#1D1160', '#FFFFFF', '#FFFFFF', 'Phoenix Suns'),
  ('Mavericks Blue/Silver', '#00538C', '#B8C4CA', '#FFFFFF', '#FFFFFF', 'Dallas Mavericks'),
  ('Raptors Red/Black', '#CE1141', '#000000', '#A1A1A4', '#FFFFFF', 'Toronto Raptors'),
  ('Nuggets Blue/Gold', '#0E2240', '#FEC524', '#FFFFFF', '#FFFFFF', 'Denver Nuggets');

-- Football Teams and Color Themes
INSERT INTO public.color_themes (name, primary_color, secondary_color, accent_color, text_color, primary_example_team) VALUES
  ('Cowboys Blue/Silver', '#003594', '#869397', '#FFFFFF', '#FFFFFF', 'Dallas Cowboys'),
  ('Patriots Navy/Red', '#002244', '#C60C30', '#B0B7BC', '#FFFFFF', 'New England Patriots'),
  ('Packers Green/Gold', '#203731', '#FFB612', '#FFFFFF', '#FFFFFF', 'Green Bay Packers'),
  ('Steelers Black/Gold', '#FFB612', '#000000', '#FFFFFF', '#FFFFFF', 'Pittsburgh Steelers'),
  ('Chiefs Red/Gold', '#E31837', '#FFB81C', '#FFFFFF', '#FFFFFF', 'Kansas City Chiefs'),
  ('Bills Blue/Red', '#00338D', '#C60C30', '#FFFFFF', '#FFFFFF', 'Buffalo Bills'),
  ('49ers Red/Gold', '#AA0000', '#B3995D', '#FFFFFF', '#FFFFFF', 'San Francisco 49ers'),
  ('Giants Blue/Red', '#0B2265', '#A71930', '#FFFFFF', '#FFFFFF', 'New York Giants'),
  ('Eagles Green/Silver', '#004C54', '#A5ACAF', '#FFFFFF', '#FFFFFF', 'Philadelphia Eagles'),
  ('Rams Blue/Gold', '#003594', '#FFA300', '#FFFFFF', '#FFFFFF', 'Los Angeles Rams'),
  ('Seahawks Navy/Green', '#002244', '#69BE28', '#A5ACAF', '#FFFFFF', 'Seattle Seahawks'),
  ('Broncos Orange/Blue', '#FB4F14', '#002244', '#FFFFFF', '#FFFFFF', 'Denver Broncos');

-- Hockey Teams and Color Themes
INSERT INTO public.color_themes (name, primary_color, secondary_color, accent_color, text_color, primary_example_team) VALUES
  ('Rangers Blue/Red', '#0038A8', '#CE1126', '#FFFFFF', '#FFFFFF', 'New York Rangers'),
  ('Bruins Gold/Black', '#FFB81C', '#000000', '#FFFFFF', '#FFFFFF', 'Boston Bruins'),
  ('Blackhawks Red/Black', '#CF0A2C', '#000000', '#FF671B', '#FFFFFF', 'Chicago Blackhawks'),
  ('Penguins Black/Gold', '#000000', '#FCB514', '#FFFFFF', '#FFFFFF', 'Pittsburgh Penguins'),
  ('Red Wings Red/White', '#CE1126', '#FFFFFF', '#000000', '#FFFFFF', 'Detroit Red Wings'),
  ('Maple Leafs Blue/White', '#003E7E', '#FFFFFF', '#000000', '#FFFFFF', 'Toronto Maple Leafs'),
  ('Kings Black/Silver', '#000000', '#A2AAAD', '#FFFFFF', '#FFFFFF', 'Los Angeles Kings'),
  ('Lightning Blue/White', '#002868', '#FFFFFF', '#000000', '#FFFFFF', 'Tampa Bay Lightning'),
  ('Capitals Red/Blue', '#C8102E', '#041E42', '#FFFFFF', '#FFFFFF', 'Washington Capitals'),
  ('Flyers Orange/Black', '#F74902', '#000000', '#FFFFFF', '#FFFFFF', 'Philadelphia Flyers'),
  ('Golden Knights Gold/Black', '#B4975A', '#000000', '#333F42', '#FFFFFF', 'Vegas Golden Knights'),
  ('Blues Blue/Gold', '#002F87', '#FCB514', '#FFFFFF', '#FFFFFF', 'St. Louis Blues');

-- Soccer Teams and Color Themes
INSERT INTO public.color_themes (name, primary_color, secondary_color, accent_color, text_color, primary_example_team) VALUES
  ('Manchester United Red', '#DA020E', '#FBE122', '#000000', '#FFFFFF', 'Manchester United'),
  ('Barcelona Blue/Red', '#A50044', '#004D98', '#FFED02', '#FFFFFF', 'FC Barcelona'),
  ('Real Madrid White/Gold', '#FEBE10', '#00529F', '#FFFFFF', '#000000', 'Real Madrid'),
  ('Liverpool Red/Gold', '#C8102E', '#F6EB61', '#00B2A9', '#FFFFFF', 'Liverpool FC'),
  ('Chelsea Blue/White', '#034694', '#FFFFFF', '#000000', '#FFFFFF', 'Chelsea FC'),
  ('Arsenal Red/White', '#EF0107', '#FFFFFF', '#9C824A', '#FFFFFF', 'Arsenal FC'),
  ('Bayern Munich Red/Blue', '#DC052D', '#0066B2', '#FFFFFF', '#FFFFFF', 'Bayern Munich'),
  ('Juventus Black/White', '#000000', '#FFFFFF', '#000000', '#FFFFFF', 'Juventus FC'),
  ('PSG Blue/Red', '#004170', '#ED1C24', '#FFFFFF', '#FFFFFF', 'Paris Saint-Germain'),
  ('AC Milan Red/Black', '#FB090B', '#000000', '#FFFFFF', '#FFFFFF', 'AC Milan'),
  ('Inter Milan Blue/Black', '#0068A8', '#000000', '#FFFFFF', '#FFFFFF', 'Inter Milan'),
  ('Dortmund Yellow/Black', '#FDE100', '#000000', '#FFFFFF', '#000000', 'Borussia Dortmund');

-- Add Baseball Teams
INSERT INTO public.teams (name, city, abbreviation, league, sport, color_theme_id) VALUES
  ('Yankees', 'New York', 'NYY', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Yankees Navy/Gray')),
  ('Red Sox', 'Boston', 'BOS', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Red Sox Red/Navy')),
  ('Dodgers', 'Los Angeles', 'LAD', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Dodgers Blue/White')),
  ('Giants', 'San Francisco', 'SF', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Giants Orange/Black')),
  ('Cubs', 'Chicago', 'CHC', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Cubs Blue/Red')),
  ('Cardinals', 'St. Louis', 'STL', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Cardinals Red/Navy')),
  ('Astros', 'Houston', 'HOU', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Astros Navy/Orange')),
  ('Braves', 'Atlanta', 'ATL', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Braves Navy/Red')),
  ('Phillies', 'Philadelphia', 'PHI', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Phillies Red/Blue')),
  ('Tigers', 'Detroit', 'DET', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Tigers Navy/Orange')),
  ('Athletics', 'Oakland', 'OAK', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Athletics Green/Gold')),
  ('Mariners', 'Seattle', 'SEA', 'MLB', 'Baseball', (SELECT id FROM public.color_themes WHERE name = 'Mariners Navy/Teal'));

-- Add Basketball Teams
INSERT INTO public.teams (name, city, abbreviation, league, sport, color_theme_id) VALUES
  ('Lakers', 'Los Angeles', 'LAL', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Lakers Purple/Gold')),
  ('Celtics', 'Boston', 'BOS', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Celtics Green/White')),
  ('Bulls', 'Chicago', 'CHI', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Bulls Red/Black')),
  ('Warriors', 'Golden State', 'GSW', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Warriors Blue/Gold')),
  ('Heat', 'Miami', 'MIA', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Heat Red/Black')),
  ('Spurs', 'San Antonio', 'SAS', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Spurs Black/Silver')),
  ('Knicks', 'New York', 'NYK', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Knicks Blue/Orange')),
  ('Nets', 'Brooklyn', 'BKN', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Nets Black/White')),
  ('Suns', 'Phoenix', 'PHX', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Suns Orange/Purple')),
  ('Mavericks', 'Dallas', 'DAL', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Mavericks Blue/Silver')),
  ('Raptors', 'Toronto', 'TOR', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Raptors Red/Black')),
  ('Nuggets', 'Denver', 'DEN', 'NBA', 'Basketball', (SELECT id FROM public.color_themes WHERE name = 'Nuggets Blue/Gold'));

-- Add Football Teams
INSERT INTO public.teams (name, city, abbreviation, league, sport, color_theme_id) VALUES
  ('Cowboys', 'Dallas', 'DAL', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Cowboys Blue/Silver')),
  ('Patriots', 'New England', 'NE', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Patriots Navy/Red')),
  ('Packers', 'Green Bay', 'GB', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Packers Green/Gold')),
  ('Steelers', 'Pittsburgh', 'PIT', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Steelers Black/Gold')),
  ('Chiefs', 'Kansas City', 'KC', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Chiefs Red/Gold')),
  ('Bills', 'Buffalo', 'BUF', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Bills Blue/Red')),
  ('49ers', 'San Francisco', 'SF', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = '49ers Red/Gold')),
  ('Giants', 'New York', 'NYG', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Giants Blue/Red')),
  ('Eagles', 'Philadelphia', 'PHI', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Eagles Green/Silver')),
  ('Rams', 'Los Angeles', 'LAR', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Rams Blue/Gold')),
  ('Seahawks', 'Seattle', 'SEA', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Seahawks Navy/Green')),
  ('Broncos', 'Denver', 'DEN', 'NFL', 'Football', (SELECT id FROM public.color_themes WHERE name = 'Broncos Orange/Blue'));

-- Add Hockey Teams
INSERT INTO public.teams (name, city, abbreviation, league, sport, color_theme_id) VALUES
  ('Rangers', 'New York', 'NYR', 'NHL', 'Hockey', (SELECT id FROM public.color_themes WHERE name = 'Rangers Blue/Red')),
  ('Bruins', 'Boston', 'BOS', 'NHL', 'Hockey', (SELECT id FROM public.color_themes WHERE name = 'Bruins Gold/Black')),
  ('Blackhawks', 'Chicago', 'CHI', 'NHL', 'Hockey', (SELECT id FROM public.color_themes WHERE name = 'Blackhawks Red/Black')),
  ('Penguins', 'Pittsburgh', 'PIT', 'NHL', 'Hockey', (SELECT id FROM public.color_themes WHERE name = 'Penguins Black/Gold')),
  ('Red Wings', 'Detroit', 'DET', 'NHL', 'Hockey', (SELECT id FROM public.color_themes WHERE name = 'Red Wings Red/White')),
  ('Maple Leafs', 'Toronto', 'TOR', 'NHL', 'Hockey', (SELECT id FROM public.color_themes WHERE name = 'Maple Leafs Blue/White')),
  ('Kings', 'Los Angeles', 'LAK', 'NHL', 'Hockey', (SELECT id FROM public.color_themes WHERE name = 'Kings Black/Silver')),
  ('Lightning', 'Tampa Bay', 'TB', 'NHL', 'Hockey', (SELECT id FROM public.color_themes WHERE name = 'Lightning Blue/White')),
  ('Capitals', 'Washington', 'WSH', 'NHL', 'Hockey', (SELECT id FROM public.color_themes WHERE name = 'Capitals Red/Blue')),
  ('Flyers', 'Philadelphia', 'PHI', 'NHL', 'Hockey', (SELECT id FROM public.color_themes WHERE name = 'Flyers Orange/Black')),
  ('Golden Knights', 'Vegas', 'VGK', 'NHL', 'Hockey', (SELECT id FROM public.color_themes WHERE name = 'Golden Knights Gold/Black')),
  ('Blues', 'St. Louis', 'STL', 'NHL', 'Hockey', (SELECT id FROM public.color_themes WHERE name = 'Blues Blue/Gold'));

-- Add Soccer Teams
INSERT INTO public.teams (name, city, abbreviation, league, sport, color_theme_id) VALUES
  ('Man United', 'Manchester', 'MUN', 'EPL', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'Manchester United Red')),
  ('Barcelona', 'Barcelona', 'BAR', 'La Liga', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'Barcelona Blue/Red')),
  ('Real Madrid', 'Madrid', 'RM', 'La Liga', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'Real Madrid White/Gold')),
  ('Liverpool', 'Liverpool', 'LIV', 'EPL', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'Liverpool Red/Gold')),
  ('Chelsea', 'London', 'CHE', 'EPL', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'Chelsea Blue/White')),
  ('Arsenal', 'London', 'ARS', 'EPL', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'Arsenal Red/White')),
  ('Bayern Munich', 'Munich', 'BAY', 'Bundesliga', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'Bayern Munich Red/Blue')),
  ('Juventus', 'Turin', 'JUV', 'Serie A', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'Juventus Black/White')),
  ('PSG', 'Paris', 'PSG', 'Ligue 1', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'PSG Blue/Red')),
  ('AC Milan', 'Milan', 'MIL', 'Serie A', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'AC Milan Red/Black')),
  ('Inter Milan', 'Milan', 'INT', 'Serie A', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'Inter Milan Blue/Black')),
  ('Dortmund', 'Dortmund', 'BVB', 'Bundesliga', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'Dortmund Yellow/Black'));
