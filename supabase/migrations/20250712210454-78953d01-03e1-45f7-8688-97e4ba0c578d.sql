-- Fix the insert statements for cities table
INSERT INTO public.cities (city_code, city_name, state_province, state_code, country, region, nicknames, landmarks, established_year) VALUES
('BAL', 'Baltimore', 'Maryland', 'MD', 'USA', 'Mid-Atlantic', ARRAY['Charm City', 'Monument City'], ARRAY['Inner Harbor', 'Fort McHenry'], 1729),
('BOS', 'Boston', 'Massachusetts', 'MA', 'USA', 'Northeast', ARRAY['Beantown', 'The Hub'], ARRAY['Freedom Trail', 'Fenway Park'], 1630),
('NYY', 'New York', 'New York', 'NY', 'USA', 'Northeast', ARRAY['The Big Apple', 'City That Never Sleeps'], ARRAY['Statue of Liberty', 'Central Park'], 1624),
('CHI', 'Chicago', 'Illinois', 'IL', 'USA', 'Midwest', ARRAY['Windy City', 'Second City'], ARRAY['Willis Tower', 'Millennium Park'], 1837),
('LAD', 'Los Angeles', 'California', 'CA', 'USA', 'West Coast', ARRAY['City of Angels', 'LA'], ARRAY['Hollywood Sign', 'Santa Monica Pier'], 1781),
('SF', 'San Francisco', 'California', 'CA', 'USA', 'West Coast', ARRAY['The City', 'Fog City'], ARRAY['Golden Gate Bridge', 'Alcatraz'], 1776),
('MIA', 'Miami', 'Florida', 'FL', 'USA', 'Southeast', ARRAY['Magic City', 'Gateway to the Americas'], ARRAY['South Beach', 'Art Deco District'], 1896),
('SEA', 'Seattle', 'Washington', 'WA', 'USA', 'Pacific Northwest', ARRAY['Emerald City', 'Jet City'], ARRAY['Space Needle', 'Pike Place Market'], 1851),
('DEN', 'Denver', 'Colorado', 'CO', 'USA', 'Mountain West', ARRAY['Mile High City'], ARRAY['Red Rocks', 'Rocky Mountains'], 1858),
('PHX', 'Phoenix', 'Arizona', 'AZ', 'USA', 'Southwest', ARRAY['Valley of the Sun'], ARRAY['Camelback Mountain', 'Desert Botanical Garden'], 1868);

-- Add more DNA entries with different cities and color combinations
INSERT INTO public.dna_entries_v2 (
  dna_code, city_id, color_scheme_id, style_id, emoji, symbols, vibes, rarity, power_level, legacy_team_code, legacy_team_name
) VALUES
(
  'bos_rnw_classic',
  (SELECT id FROM public.cities WHERE city_code = 'BOS'),
  (SELECT id FROM public.color_schemes WHERE color_code = 'RNW'),
  (SELECT id FROM public.style_definitions WHERE style_code = 'classic'),
  '🦞',
  ARRAY['lobster', 'tea', 'freedom'],
  ARRAY['historic', 'academic', 'revolutionary'],
  'rare',
  85,
  'BOS',
  'Boston Red Sox'
),
(
  'nyy_blu_vintage',
  (SELECT id FROM public.cities WHERE city_code = 'NYY'),
  (SELECT id FROM public.color_schemes WHERE color_code = 'BLU'),
  (SELECT id FROM public.style_definitions WHERE style_code = 'vintage'),
  '🗽',
  ARRAY['statue', 'skyscraper', 'subway'],
  ARRAY['urban', 'fast-paced', 'diverse'],
  'legendary',
  95,
  'NYY',
  'New York Yankees'
),
(
  'chi_grn_modern',
  (SELECT id FROM public.cities WHERE city_code = 'CHI'),
  (SELECT id FROM public.color_schemes WHERE color_code = 'GRN'),
  (SELECT id FROM public.style_definitions WHERE style_code = 'modern'),
  '🌆',
  ARRAY['wind', 'architecture', 'deep-dish'],
  ARRAY['architectural', 'windy', 'industrial'],
  'epic',
  80,
  'CHI',
  'Chicago Cubs'
),
(
  'lad_blo_script',
  (SELECT id FROM public.cities WHERE city_code = 'LAD'),
  (SELECT id FROM public.color_schemes WHERE color_code = 'BLO'),
  (SELECT id FROM public.style_definitions WHERE style_code = 'script'),
  '🌴',
  ARRAY['palm', 'sun', 'beach'],
  ARRAY['sunny', 'entertainment', 'coastal'],
  'rare',
  78,
  'LAD',
  'Los Angeles Dodgers'
),
(
  'sf_orb_vintage',
  (SELECT id FROM public.cities WHERE city_code = 'SF'),
  (SELECT id FROM public.color_schemes WHERE color_code = 'ORB'),
  (SELECT id FROM public.style_definitions WHERE style_code = 'vintage'),
  '🌉',
  ARRAY['bridge', 'fog', 'cable-car'],
  ARRAY['foggy', 'tech', 'hilly'],
  'uncommon',
  72,
  'SF',
  'San Francisco Giants'
);