
-- Fix Admin RLS Infinite Recursion
-- Create security definer function to get current user's admin role
CREATE OR REPLACE FUNCTION public.get_current_user_admin_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.admin_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Create helper function to check if user has admin permission
CREATE OR REPLACE FUNCTION public.user_has_admin_permission(permission_name text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_roles ar
    JOIN public.admin_role_permissions arp ON ar.role = arp.role
    JOIN public.admin_permissions ap ON arp.permission_id = ap.id
    WHERE ar.user_id = auth.uid() 
    AND ap.permission_name = user_has_admin_permission.permission_name
  );
$$;

-- Update admin_permissions RLS policy to prevent infinite recursion
DROP POLICY IF EXISTS "Admin users can manage permissions" ON public.admin_permissions;
CREATE POLICY "Admin users can manage permissions" 
ON public.admin_permissions 
FOR ALL 
USING (public.user_has_admin_permission('system_administration'));

-- Update admin_role_permissions RLS policy
DROP POLICY IF EXISTS "Admin users can view role permissions" ON public.admin_role_permissions;
CREATE POLICY "Admin users can view role permissions" 
ON public.admin_role_permissions 
FOR SELECT 
USING (public.user_has_admin_permission('user_management'));

-- Add missing policies for admin_role_permissions
CREATE POLICY "Admin users can manage role permissions" 
ON public.admin_role_permissions 
FOR ALL 
USING (public.user_has_admin_permission('user_management'));

-- Update admin_roles policies to use security definer functions
DROP POLICY IF EXISTS "Admins can manage admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Admins can view admin roles" ON public.admin_roles;

CREATE POLICY "Admins can view admin roles" 
ON public.admin_roles 
FOR SELECT 
USING (public.get_current_user_admin_role() IS NOT NULL);

CREATE POLICY "Admins can manage admin roles" 
ON public.admin_roles 
FOR ALL 
USING (public.user_has_admin_permission('user_management'));

-- Add database performance indexes
CREATE INDEX IF NOT EXISTS idx_cards_creator_id ON public.cards(creator_id);
CREATE INDEX IF NOT EXISTS idx_cards_is_public ON public.cards(is_public);
CREATE INDEX IF NOT EXISTS idx_cards_created_at ON public.cards(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cards_visibility ON public.cards(visibility);
CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON public.admin_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_cards_collection_id ON public.collection_cards(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_cards_card_id ON public.collection_cards(card_id);
