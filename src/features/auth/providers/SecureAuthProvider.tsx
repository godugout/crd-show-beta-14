import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { enhancedAuthService } from '../services/enhancedAuthService';
import { profileService } from '../services/profileService';
import type {
  AuthContextType,
  AuthState,
  AuthSession,
  AuthError,
  SignUpData,
  SignInData,
  OAuthProvider,
  PasswordResetRequest,
  PasswordUpdateData,
  ProfileUpdateData,
  RateLimitInfo,
  UseAuthReturn
} from '../types/auth.types';
import type { UserProfile } from '../types/profile.types';

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

export const SecureAuthProvider: React.FC<SecureAuthProviderProps> = ({ children }) => {
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
      const result = await userManagementService.createUser({
        email,
        password,
        fullName,
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
      
      if (result.success) {
        setUser(null);
        setProfile(null);
        setRateLimitInfo(null);
      }
      
      return result;
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
        error: 'An unexpected error occurred while resetting password.'
      };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const result = await secureAuthService.updatePassword(newPassword);
      return result;
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
      
      if (result.success && result.profile) {
        setProfile(result.profile);
      }
      
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

  const value: SecureAuthContextType = {
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
  };

  return (
    <SecureAuthContext.Provider value={value}>
      {children}
    </SecureAuthContext.Provider>
  );
}; rComponent); 