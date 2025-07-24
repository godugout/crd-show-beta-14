-- Grant admin role to current user (you'll need to replace with your actual user ID)
-- First, let's check if admin permissions exist
INSERT INTO public.admin_permissions (permission_name, category, description) 
VALUES 
  ('system_administration', 'system', 'Full system administration access'),
  ('user_management', 'users', 'Manage users and roles'),
  ('dna_lab_access', 'lab', 'Access to DNA Lab features')
ON CONFLICT (permission_name) DO NOTHING;

-- Create admin role if it doesn't exist
INSERT INTO public.admin_role_permissions (role, permission_id)
SELECT 'admin', ap.id 
FROM public.admin_permissions ap 
WHERE ap.permission_name IN ('system_administration', 'user_management', 'dna_lab_access')
ON CONFLICT DO NOTHING;

-- Note: You'll need to manually add your user ID to admin_roles table
-- This can be done after we get your user ID