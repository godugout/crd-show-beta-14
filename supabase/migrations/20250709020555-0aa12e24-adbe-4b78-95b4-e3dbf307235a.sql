-- Fix feature flag column name mismatch and enable revolutionary mode
UPDATE public.feature_flags 
SET is_enabled = true 
WHERE flag_key = 'revolutionary_create_mode' OR flag_name = 'Revolutionary Card Creator';

-- If no rows updated, insert with correct structure
INSERT INTO public.feature_flags (flag_key, flag_name, description, is_enabled, rollout_percentage) 
VALUES ('revolutionary_create_mode', 'Revolutionary Card Creator', 'Enable the revolutionary interactive card creation mode', true, 100)
ON CONFLICT (flag_key) DO UPDATE SET is_enabled = true;