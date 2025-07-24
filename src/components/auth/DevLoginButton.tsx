import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { devAuthService } from '@/features/auth/services/devAuthService';
import { toast } from 'sonner';

interface DevLoginButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}

export const DevLoginButton: React.FC<DevLoginButtonProps> = ({ 
  className, 
  variant = 'default',
  size = 'default'
}) => {
  const handleDevLogin = () => {
    try {
      const result = devAuthService.forceCreateDevSession();
      if (result.error) {
        toast.error('Failed to create dev session: ' + result.error.message);
      } else {
        toast.success('Dev user logged in! Reloading page...');
        // Force reload to pick up the new auth state
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (error) {
      toast.error('Dev login failed: ' + (error as Error).message);
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Button
      onClick={handleDevLogin}
      variant={variant}
      size={size}
      className={className}
    >
      <User className="w-4 h-4 mr-2" />
      Quick Dev Login
    </Button>
  );
};