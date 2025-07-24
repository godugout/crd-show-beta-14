
-- Add top international soccer color themes
INSERT INTO public.color_themes (name, primary_color, secondary_color, accent_color, text_color, primary_example_team) VALUES
  -- Soccer teams
  ('Brazil Yellow/Green', '#FFDF00', '#009639', '#002776', '#000000', 'Brazil National Team'),
  ('Argentina Sky Blue/White', '#75AADB', '#FFFFFF', '#000000', '#000000', 'Argentina National Team'),
  ('Germany Black/Red/Gold', '#000000', '#DD0000', '#FFCE00', '#FFFFFF', 'Germany National Team'),
  ('Spain Red/Gold', '#AA151B', '#F1BF00', '#FFFFFF', '#FFFFFF', 'Spain National Team'),
  ('France Blue/White/Red', '#002395', '#FFFFFF', '#ED2939', '#FFFFFF', 'France National Team'),
  ('Italy Blue/White', '#0066CC', '#FFFFFF', '#009246', '#FFFFFF', 'Italy National Team'),
  ('Netherlands Orange/Blue', '#FF4F00', '#21468B', '#FFFFFF', '#FFFFFF', 'Netherlands National Team'),
  ('England White/Red', '#FFFFFF', '#CE1124', '#012169', '#000000', 'England National Team'),
  ('Portugal Red/Green', '#FF0000', '#006600', '#FFFFFF', '#FFFFFF', 'Portugal National Team'),
  ('Belgium Black/Yellow/Red', '#000000', '#FFD100', '#FF0000', '#FFFFFF', 'Belgium National Team'),

  -- Cricket teams
  ('India Blue/Orange', '#FF9933', '#FFFFFF', '#138808', '#000000', 'India Cricket Team'),
  ('Australia Green/Gold', '#006A4E', '#FFD100', '#FFFFFF', '#FFFFFF', 'Australia Cricket Team'),
  ('England Cricket Blue/Red', '#003366', '#FFFFFF', '#CE1124', '#FFFFFF', 'England Cricket Team'),
  ('South Africa Green/Gold', '#007749', '#FFB81C', '#FFFFFF', '#FFFFFF', 'South Africa Cricket Team'),
  ('West Indies Maroon/Gold', '#722F37', '#FFD700', '#FFFFFF', '#FFFFFF', 'West Indies Cricket Team'),
  ('Pakistan Green/White', '#01411C', '#FFFFFF', '#000000', '#FFFFFF', 'Pakistan Cricket Team'),
  ('New Zealand Black/White', '#000000', '#FFFFFF', '#C0C0C0', '#FFFFFF', 'New Zealand Cricket Team'),
  ('Sri Lanka Blue/Yellow', '#003DA5', '#FFD100', '#FFFFFF', '#FFFFFF', 'Sri Lanka Cricket Team'),
  ('Bangladesh Green/Red', '#006A4E', '#F42A41', '#FFFFFF', '#FFFFFF', 'Bangladesh Cricket Team'),
  ('Afghanistan Blue/Red/White', '#0066CC', '#CC0000', '#FFFFFF', '#FFFFFF', 'Afghanistan Cricket Team');

-- Add corresponding teams for soccer
INSERT INTO public.teams (name, city, abbreviation, league, sport, color_theme_id) VALUES
  ('National Team', 'Brazil', 'BRA', 'FIFA', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'Brazil Yellow/Green')),
  ('National Team', 'Argentina', 'ARG', 'FIFA', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'Argentina Sky Blue/White')),
  ('National Team', 'Germany', 'GER', 'FIFA', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'Germany Black/Red/Gold')),
  ('National Team', 'Spain', 'ESP', 'FIFA', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'Spain Red/Gold')),
  ('National Team', 'France', 'FRA', 'FIFA', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'France Blue/White/Red')),
  ('National Team', 'Italy', 'ITA', 'FIFA', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'Italy Blue/White')),
  ('National Team', 'Netherlands', 'NED', 'FIFA', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'Netherlands Orange/Blue')),
  ('National Team', 'England', 'ENG', 'FIFA', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'England White/Red')),
  ('National Team', 'Portugal', 'POR', 'FIFA', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'Portugal Red/Green')),
  ('National Team', 'Belgium', 'BEL', 'FIFA', 'Soccer', (SELECT id FROM public.color_themes WHERE name = 'Belgium Black/Yellow/Red')),

  -- Add corresponding teams for cricket
  ('Cricket Team', 'India', 'IND', 'ICC', 'Cricket', (SELECT id FROM public.color_themes WHERE name = 'India Blue/Orange')),
  ('Cricket Team', 'Australia', 'AUS', 'ICC', 'Cricket', (SELECT id FROM public.color_themes WHERE name = 'Australia Green/Gold')),
  ('Cricket Team', 'England', 'ENG', 'ICC', 'Cricket', (SELECT id FROM public.color_themes WHERE name = 'England Cricket Blue/Red')),
  ('Cricket Team', 'South Africa', 'RSA', 'ICC', 'Cricket', (SELECT id FROM public.color_themes WHERE name = 'South Africa Green/Gold')),
  ('Cricket Team', 'West Indies', 'WI', 'ICC', 'Cricket', (SELECT id FROM public.color_themes WHERE name = 'West Indies Maroon/Gold')),
  ('Cricket Team', 'Pakistan', 'PAK', 'ICC', 'Cricket', (SELECT id FROM public.color_themes WHERE name = 'Pakistan Green/White')),
  ('Cricket Team', 'New Zealand', 'NZ', 'ICC', 'Cricket', (SELECT id FROM public.color_themes WHERE name = 'New Zealand Black/White')),
  ('Cricket Team', 'Sri Lanka', 'SL', 'ICC', 'Cricket', (SELECT id FROM public.color_themes WHERE name = 'Sri Lanka Blue/Yellow')),
  ('Cricket Team', 'Bangladesh', 'BAN', 'ICC', 'Cricket', (SELECT id FROM public.color_themes WHERE name = 'Bangladesh Green/Red')),
  ('Cricket Team', 'Afghanistan', 'AFG', 'ICC', 'Cricket', (SELECT id FROM public.color_themes WHERE name = 'Afghanistan Blue/Red/White'));
