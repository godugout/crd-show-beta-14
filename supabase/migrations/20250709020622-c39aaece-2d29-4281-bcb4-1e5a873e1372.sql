-- Enable revolutionary creator mode with correct column name
UPDATE public.feature_flags 
SET is_enabled = true 
WHERE name = 'revolutionary_create_mode';