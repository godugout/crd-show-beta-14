
-- Create new Kelly Green/Sports Gold color theme for Oakland Athletics
INSERT INTO public.color_themes (name, primary_color, secondary_color, accent_color, text_color, primary_example_team) 
VALUES (
  'Kelly Green/Sports Gold', 
  '#003831', 
  '#FFB81C', 
  '#FFFFFF', 
  '#FFFFFF', 
  'OAK Athletics'
);

-- Update Oakland Athletics to use the new Kelly Green/Sports Gold theme
UPDATE public.teams 
SET color_theme_id = (
  SELECT id FROM public.color_themes WHERE name = 'Kelly Green/Sports Gold'
)
WHERE name = 'Athletics' AND city = 'Oakland' AND abbreviation = 'OAK';
