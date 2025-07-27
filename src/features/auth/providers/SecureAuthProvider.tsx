import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { secureAuthService } from '../services/secureAuthService';
import { userManagementService } from '../services/userManagementService';

export interface SecureAuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string, username?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: any) => Promise<{ success: boolean; error?: string }>;
  rateLimitInfo: {
    remainingAttempts: number;
    lockoutTime?: number;
  } | null;
}

const SecureAuthContext = createContext<SecureAuthContextType | undefined>(undefined);

export const useSecureAuth = () => {
  const context = useContext(SecureAuthContext);
  if (!context) {
    throw new Error('useSecureAuth must be used within a SecureAuthProvider');
  }
  return context;
};

interface SecureAuthProviderProps {
  children: React.ReactNode;
}

const SecureAuthProviderComponent: React.FC<SecureAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    remainingAttempts: number;
    lockoutTime?: number;
  } | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const sessionResult = await secureAuthService.getSession();
        
        if (sessionResult.success && sessionResult.user) {
          setUser(sessionResult.user);
          
          // Ensure user profile exists
          const profileResult = await userManagementService.ensureUserProfile(
            sessionResult.user.id,
            sessionResult.user.email || '',
            sessionResult.user.user_metadata?.full_name
          );
          
          if (profileResult.success) {
            setProfile(profileResult.profile);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          setUser(session.user);
          
          // Ensure user profile exists
          const profileResult = await userManagementService.ensureUserProfile(
            session.user.id,
            session.user.email || '',
            session.user.user_metadata?.full_name
          );
          
          if (profileResult.success) {
            setProfile(profileResult.profile);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await secureAuthService.signIn(email, password);
      
      if (result.rateLimitInfo) {
        setRateLimitInfo(result.rateLimitInfo);
      } else {
        setRateLimitInfo(null);
      }
      
      return {
        success: result.success,
        error: result.error
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during sign in.'
      };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, username?: string) => {
    try {
      const result = await secureAuthService.signUp(email, password, {
        full_name: fullName,
        username
      });
      
      if (result.rateLimitInfo) {
        setRateLimitInfo(result.rateLimitInfo);
      } else {
        setRateLimitInfo(null);
      }
      
      return {
        success: result.success,
        error: result.error
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during sign up.'
      };
    }
  };

  const signOut = async () => {
    try {
      const result = await secureAuthService.signOut();
      return {
        success: result.success,
        error: result.error
      };
    } catch (error) {
      console.error('Sign out error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during sign out.'
      };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const result = await secureAuthService.resetPassword(email);
      
      if (result.rateLimitInfo) {
        setRateLimitInfo(result.rateLimitInfo);
      } else {
        setRateLimitInfo(null);
      }
      
      return {
        success: result.success,
        error: result.error
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during password reset.'
      };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const result = await secureAuthService.updatePassword(newPassword);
      return {
        success: result.success,
        error: result.error
      };
    } catch (error) {
      console.error('Update password error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred while updating password.'
      };
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      if (!user) {
        return {
          success: false,
          error: 'No user logged in.'
        };
      }

      const result = await userManagementService.updateUserProfile(user.id, updates);
      return {
        success: result.success,
        error: result.error
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred while updating profile.'
      };
    }
  };

  const contextValue = useMemo(() => ({
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    rateLimitInfo
  }), [user, profile, loading, rateLimitInfo]);

  return (
    <SecureAuthContext.Provider value={contextValue}>
      {children}
    </SecureAuthContext.Provider>
  );
};

export const SecureAuthProvider = React.memo(SecureAuthProviderComponent); 