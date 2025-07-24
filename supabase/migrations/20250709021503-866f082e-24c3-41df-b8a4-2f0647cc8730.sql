-- Fix feature flag rollout percentage to enable revolutionary mode for all users
UPDATE public.feature_flags 
SET rollout_percentage = 100 
WHERE flag_key = 'revolutionary_create_mode' OR flag_name = 'Revolutionary Card Creator';