import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { LoadingState } from '@/components/common/LoadingState';

interface AdminRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ 
  children, 
  requiredPermission 
}) => {
  const { isAdmin, hasPermission, isLoading } = useAdminAuth();

  if (isLoading) {
    return <LoadingState message="Verifying admin access..." fullPage size="lg" />;
  }

  if (!isAdmin) {
    return <Navigate to="/dna/lab" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-crd-danger mb-4">Access Denied</h1>
          <p className="text-crd-lightGray">
            You don't have permission to access this area.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};