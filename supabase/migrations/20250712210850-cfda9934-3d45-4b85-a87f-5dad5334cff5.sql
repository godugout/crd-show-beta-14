-- Insert initial data for the copyright-safe DNA system

-- Insert cities
INSERT INTO public.cities (city_code, city_name, state_province, state_code, country, region, nicknames, landmarks, established_year) VALUES
('BAL', 'Baltimore', 'Maryland', 'MD', 'USA', 'Mid-Atlantic', ARRAY['Charm City', 'Monument City'], ARRAY['Inner Harbor', 'Fort McHenry'], 1729),
('BOS', 'Boston', 'Massachusetts', 'MA', 'USA', 'Northeast', ARRAY['Beantown', 'The Hub'], ARRAY['Freedom Trail', 'Fenway Park'], 1630),
('NYY', 'New York', 'New York', 'NY', 'USA', 'Northeast', ARRAY['The Big Apple', 'City That Never Sleeps'], ARRAY['Statue of Liberty', 'Central Park'], 1624),
('CHI', 'Chicago', 'Illinois', 'IL', 'USA', 'Midwest', ARRAY['Windy City', 'Second City'], ARRAY['Willis Tower', 'Millennium Park'], 1837),
('LAD', 'Los Angeles', 'California', 'CA', 'USA', 'West Coast', ARRAY['City of Angels', 'LA'], ARRAY['Hollywood Sign', 'Santa Monica Pier'], 1781),
('SF', 'San Francisco', 'California', 'CA', 'USA', 'West Coast', ARRAY['The City', 'Fog City'], ARRAY['Golden Gate Bridge', 'Alcatraz'], 1776);

-- Insert color schemes
INSERT INTO public.color_schemes (color_code, primary_color, secondary_color, tertiary_color, color_names, combo_name) VALUES
('ORB', '#DF4601', '#000000', '#FFFFFF', ARRAY['Orange', 'Black', 'White'], 'Orange & Black'),
('RNW', '#BD3039', '#0C2340', '#FFFFFF', ARRAY['Red', 'Navy', 'White'], 'Red & Navy'),
('BLU', '#132448', '#FFFFFF', '#C4CED4', ARRAY['Navy', 'White', 'Silver'], 'Navy & Pinstripe'),
('GRN', '#228B22', '#FFD700', '#FFFFFF', ARRAY['Green', 'Gold', 'White'], 'Green & Gold'),
('BLO', '#0047AB', '#FF7F00', '#FFFFFF', ARRAY['Blue', 'Orange', 'White'], 'Blue & Orange');

-- Insert style definitions
INSERT INTO public.style_definitions (style_code, style_name, era, typography_style, typography_weight) VALUES
('classic', 'Classic', '1980s', 'serif', 'bold'),
('modern', 'Modern', '2020s', 'sans', 'regular'),
('vintage', 'Vintage', '1970s', 'script', 'bold'),
('script', 'Script', '1990s', 'script', 'regular'),
('block', 'Block', '2000s', 'sans', 'black');