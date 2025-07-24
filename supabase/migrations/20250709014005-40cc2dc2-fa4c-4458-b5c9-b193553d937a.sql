-- Enable revolutionary creator mode for testing
UPDATE public.feature_flags 
SET is_enabled = true 
WHERE name = 'revolutionary_create_mode';