
-- Grant admin role to the current user account that might be logged in
-- This covers both potential user accounts to ensure access
INSERT INTO public.admin_roles (user_id, role)
VALUES ('a43ddc45-daac-4d00-a663-cd5a82cec469', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Also ensure the other account has admin access
INSERT INTO public.admin_roles (user_id, role)
VALUES ('196b5883-8d80-4f7a-9c5f-5f83f964f9ce', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
