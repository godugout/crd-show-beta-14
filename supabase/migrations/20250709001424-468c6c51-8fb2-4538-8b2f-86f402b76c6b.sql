-- Insert revolutionary creator feature flags if they don't exist
INSERT INTO public.feature_flags (name, description, category, is_enabled, rollout_percentage) VALUES
('revolutionary_create_mode', 'Enable the revolutionary interactive card creation mode', 'creator', false, 0),
('advanced_particle_systems', 'Enable advanced particle system designer', 'creator', false, 0),
('biometric_integration', 'Enable biometric card response features', 'creator', false, 0),
('collaborative_fusion', 'Enable multi-user card collaboration features', 'creator', false, 0),
('visual_programming', 'Enable visual programming canvas for card behaviors', 'creator', false, 0)
ON CONFLICT (name) DO NOTHING;