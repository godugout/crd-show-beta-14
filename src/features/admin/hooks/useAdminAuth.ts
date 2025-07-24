
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface AdminUser {
  id: string;
  role: string;
  permissions: string[];
}

// Cache for admin auth results to reduce database calls
const adminAuthCache = new Map<string, { data: AdminUser | null; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useAdminAuth = () => {
  const { user } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAdminStatus = useCallback(async () => {
    if (!user) {
      setAdminUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Check cache first
      const cached = adminAuthCache.get(user.id);
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        logger.debug('Using cached admin auth result', { userId: user.id });
        setAdminUser(cached.data);
        setIsLoading(false);
        return;
      }

      logger.debug('Checking admin status for user', { userId: user.id });

      // Use the new security definer function to get admin role
      const { data: adminRole, error: roleError } = await supabase.rpc(
        'get_current_user_admin_role'
      );

      if (roleError) {
        logger.error('Error fetching admin role', roleError, { userId: user.id });
        throw roleError;
      }

      if (!adminRole) {
        logger.debug('User is not an admin', { userId: user.id });
        const result = null;
        adminAuthCache.set(user.id, { data: result, timestamp: Date.now() });
        setAdminUser(result);
        setIsLoading(false);
        return;
      }

      // Get permissions for this role using the security definer function
      const { data: permissions, error: permError } = await supabase
        .from('admin_role_permissions')
        .select(`
          admin_permissions (
            permission_name
          )
        `)
        .eq('role', adminRole);

      if (permError) {
        logger.error('Error fetching admin permissions', permError, { userId: user.id, role: adminRole });
        throw permError;
      }

      const permissionNames = permissions?.map(p => 
        (p.admin_permissions as any)?.permission_name
      ).filter(Boolean) || [];

      const result: AdminUser = {
        id: user.id,
        role: adminRole,
        permissions: permissionNames
      };

      logger.info('Admin auth successful', { 
        userId: user.id, 
        role: adminRole, 
        permissionCount: permissionNames.length 
      });

      // Cache the result
      adminAuthCache.set(user.id, { data: result, timestamp: Date.now() });
      setAdminUser(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check admin status';
      logger.error('Admin auth check failed', err as Error, { userId: user.id });
      setError(errorMessage);
      setAdminUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  const hasPermission = useCallback((permission: string): boolean => {
    const result = adminUser?.permissions.includes(permission) || false;
    logger.debug('Permission check', { 
      permission, 
      result, 
      userPermissions: adminUser?.permissions 
    });
    return result;
  }, [adminUser]);

  const isAdmin = adminUser !== null;

  // Clear cache when user changes
  useEffect(() => {
    return () => {
      if (user) {
        adminAuthCache.delete(user.id);
      }
    };
  }, [user]);

  return {
    adminUser,
    isAdmin,
    hasPermission,
    isLoading,
    error,
    checkAdminStatus
  };
};
