import { supabase } from '@/integrations/supabase/client';
import { User, AuthError } from '@supabase/supabase-js';
import type { OAuthProvider } from '../types';

export class AuthService {
  private getRedirectUrl(path: string = '') {
    // Use the current origin for redirect URLs
    const origin = window.location.origin;
    return `${origin}${path}`;
  }

  async signUp(email: string, password: string, metadata?: Record<string, any>) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: this.getRedirectUrl('/auth/callback'),
        },
      });
      
      if (error) {
        console.error('Sign up error:', error);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Sign up exception:', err);
      return { data: null, error: err as AuthError };
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Sign in exception:', err);
      return { data: null, error: err as AuthError };
    }
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error);
    }
    
    return { error };
  }

  async signInWithOAuth(provider: OAuthProvider) {
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: this.getRedirectUrl('/auth/callback'),
      },
    });
    
    if (error) {
      console.error('OAuth sign in error:', error);
    }
    
    return { data, error };
  }

  async signInWithMagicLink(email: string) {
    
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: this.getRedirectUrl('/auth/callback'),
      },
    });
    
    if (error) {
      console.error('Magic link error:', error);
    }
    
    return { data, error };
  }

  async resetPassword(email: string) {
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: this.getRedirectUrl('/auth/reset-password'),
    });
    
    if (error) {
      console.error('Password reset error:', error);
    }
    
    return { data, error };
  }

  async getSession() {
    const result = await supabase.auth.getSession();
    return result;
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();
