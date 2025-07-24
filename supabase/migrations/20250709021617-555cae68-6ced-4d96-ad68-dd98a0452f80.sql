-- Fix feature flag rollout percentage to enable revolutionary mode for all users
UPDATE public.feature_flags 
SET rollout_percentage = 100 
WHERE name = 'revolutionary_create_mode';