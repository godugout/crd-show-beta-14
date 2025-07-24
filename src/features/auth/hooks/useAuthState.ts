
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';
import { devAuthService } from '../services/devAuthService';
import type { AuthState } from '../types';

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;
    let subscription: { unsubscribe: () => void } | null = null;

    const initializeAuth = async () => {
      
      
      try {
        // Check for dev mode first
        if (devAuthService.isDevMode()) {
          
          
          const storedDevAuth = devAuthService.getStoredDevSession();
          
          if (storedDevAuth.user && storedDevAuth.session) {
            
            if (mounted) {
              setAuthState({
                user: storedDevAuth.user,
                session: storedDevAuth.session,
                loading: false,
                error: null,
              });
            }
            return;
          } else {
            // Auto-create dev session
            
            const { user, session, error } = devAuthService.createDevUserSession();
            if (mounted && user && session) {
              
              setAuthState({
                user,
                session,
                loading: false,
                error: null,
              });
            } else {
              console.error('🔧 Development: Failed to create dev session', error);
              if (mounted) {
                setAuthState(prev => ({ ...prev, loading: false, error }));
              }
            }
            return;
          }
        }

        // Production auth flow
        
        const { data: { session }, error } = await authService.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('🔐 Auth session error:', error);
          setAuthState(prev => ({ ...prev, error, loading: false }));
          return;
        }

        
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
        }));

        // Set up auth state listener for production only
        if (!devAuthService.isDevMode()) {
          
          const { data } = authService.onAuthStateChange(
            async (event, session) => {
              
              
              if (!mounted) return;

              setAuthState(prev => ({
                ...prev,
                session,
                user: session?.user ?? null,
                loading: false,
                error: null,
              }));

              // Handle profile creation/updates after auth state change
              if (event === 'SIGNED_IN' && session?.user) {
                setTimeout(async () => {
                  try {
                    await profileService.ensureProfile(session.user);
                    
                  } catch (error) {
                    console.error('🔐 Error ensuring profile:', error);
                  }
                }, 0);
              }
            }
          );
          subscription = data.subscription;
        }

      } catch (error) {
        console.error('🔐 Auth initialization error:', error);
        if (mounted) {
          setAuthState(prev => ({ 
            ...prev, 
            error: error as any, 
            loading: false 
          }));
        }
      }
    };

    initializeAuth();

    return () => {
      
      mounted = false;
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);

  return authState;
};
