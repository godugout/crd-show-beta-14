-- Insert the revolutionary create mode feature flag
INSERT INTO public.feature_flags (
  name, 
  description, 
  category, 
  is_enabled, 
  rollout_percentage, 
  target_users, 
  metadata
) VALUES (
  'revolutionary_create_mode',
  'Enable the revolutionary interactive card creation mode',
  'creation',
  true,
  100,
  '{}',
  '{}'
) ON CONFLICT (name) DO UPDATE SET
  is_enabled = true,
  rollout_percentage = 100;