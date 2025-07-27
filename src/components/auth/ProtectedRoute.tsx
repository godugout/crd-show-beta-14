
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSecureAuth } from '@/features/auth/providers/SecureAuthProvider';
import { LoadingState } from '@/components/common/LoadingState';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { user, loading  } = useSecureAuth();
  const location = useLocation();

  // Debug current auth state
  console.log('🔐 ProtectedRoute auth state:', { 
    user: user ? { id: user.id, email: user.email } : null, 
    loading, 
    requireAuth, 
    pathname: location.pathname 
  });

  if (loading) {
    return <LoadingState message="Authenticating..." fullPage size="lg" />;
  }

  if (requireAuth && !user) {
    console.log('🔐 ProtectedRoute: Redirecting to signin - no user found');
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
