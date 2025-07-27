import { supabase } from '@/integrations/supabase/client';
import { PasswordValidator } from '../validators/passwordValidator';
import { rateLimiter } from './rateLimiter';

export interface SecureAuthResult {
  success: boolean;
  error?: string;
  user?: any;
  session?: any;
  rateLimitInfo?: {
    remainingAttempts: number;
    lockoutTime?: number;
  };
}

export class SecureAuthService {
  async signIn(email: string, password: string): Promise<SecureAuthResult> {
    try {
      // Check rate limiting
      const rateLimitCheck = await rateLimiter.checkRateLimit(email);
      
      if (!rateLimitCheck.allowed) {
        return {
          success: false,
          error: `Account temporarily locked. Try again in ${Math.ceil((rateLimitCheck.lockoutTime || 0) / 1000 / 60)} minutes.`,
          rateLimitInfo: {
            remainingAttempts: rateLimitCheck.remainingAttempts,
            lockoutTime: rateLimitCheck.lockoutTime
          }
        };
      }

      // Attempt sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Record attempt
      rateLimiter.recordAttempt(email, !error);

      if (error) {
        return {
          success: false,
          error: error.message,
          rateLimitInfo: {
            remainingAttempts: rateLimitCheck.remainingAttempts - 1
          }
        };
      }

      return {
        success: true,
        user: data.user,
        session: data.session
      };
    } catch (err) {
      console.error('Secure auth sign in error:', err);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  async signUp(email: string, password: string, metadata?: Record<string, any>): Promise<SecureAuthResult> {
    try {
      // Validate password strength
      const passwordValidation = PasswordValidator.validate(password);
      
      if (!passwordValidation.valid) {
        return {
          success: false,
          error: `Password validation failed: ${passwordValidation.errors.join(', ')}`
        };
      }

      // Check rate limiting for signup (use email as identifier)
      const rateLimitCheck = await rateLimiter.checkRateLimit(`signup_${email}`);
      
      if (!rateLimitCheck.allowed) {
        return {
          success: false,
          error: 'Too many signup attempts. Please try again later.',
          rateLimitInfo: {
            remainingAttempts: rateLimitCheck.remainingAttempts,
            lockoutTime: rateLimitCheck.lockoutTime
          }
        };
      }

      // Attempt sign up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: import.meta.env.VITE_AUTH_REDIRECT_URL || `${window.location.origin}/auth/callback`,
        },
      });

      // Record attempt
      rateLimiter.recordAttempt(`signup_${email}`, !error);

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        user: data.user,
        session: data.session
      };
    } catch (err) {
      console.error('Secure auth sign up error:', err);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  async signOut(): Promise<SecureAuthResult> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true
      };
    } catch (err) {
      console.error('Secure auth sign out error:', err);
      return {
        success: false,
        error: 'An unexpected error occurred during sign out.'
      };
    }
  }

  async resetPassword(email: string): Promise<SecureAuthResult> {
    try {
      // Check rate limiting for password reset
      const rateLimitCheck = await rateLimiter.checkRateLimit(`reset_${email}`);
      
      if (!rateLimitCheck.allowed) {
        return {
          success: false,
          error: 'Too many password reset attempts. Please try again later.',
          rateLimitInfo: {
            remainingAttempts: rateLimitCheck.remainingAttempts,
            lockoutTime: rateLimitCheck.lockoutTime
          }
        };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      // Record attempt
      rateLimiter.recordAttempt(`reset_${email}`, !error);

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true
      };
    } catch (err) {
      console.error('Secure auth reset password error:', err);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  async getSession(): Promise<SecureAuthResult> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        user: data.session?.user,
        session: data.session
      };
    } catch (err) {
      console.error('Secure auth get session error:', err);
      return {
        success: false,
        error: 'An unexpected error occurred while retrieving session.'
      };
    }
  }

  async updatePassword(newPassword: string): Promise<SecureAuthResult> {
    try {
      // Validate new password strength
      const passwordValidation = PasswordValidator.validate(newPassword);
      
      if (!passwordValidation.valid) {
        return {
          success: false,
          error: `Password validation failed: ${passwordValidation.errors.join(', ')}`
        };
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true
      };
    } catch (err) {
      console.error('Secure auth update password error:', err);
      return {
        success: false,
        error: 'An unexpected error occurred while updating password.'
      };
    }
  }
}

// Export singleton instance
export const secureAuthService = new SecureAuthService(); 