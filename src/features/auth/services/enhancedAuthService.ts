/**
 * Enhanced Authentication Service
 * Version 2.0.0
 * 
 * Secure authentication service with proper type safety,
 * comprehensive error handling, and profile integration
 */

import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { profileService } from './profileService';
import { rateLimiter } from './rateLimiter';
import { PasswordValidator } from '../validators/passwordValidator';
import type {
  AuthResult,
  AuthSession,
  SignUpData,
  SignInData,
  OAuthProvider,
  PasswordResetRequest,
  PasswordUpdateData,
  AuthError,
  AuthErrorType,
  RateLimitInfo
} from '../types/auth.types';
import type { UserProfile } from '../types/profile.types';
import { 
  validateEmail, 
  validatePassword, 
  validateUsername,
  SignUpSchema,
  SignInSchema,
  PasswordUpdateSchema
} from '../utils/validation.utils';

export class EnhancedAuthService {
  private sessionCache: AuthSession | null = null;
  private sessionCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Start session monitoring
    this.startSessionMonitoring();
  }

  /**
   * Sign up a new user
   */
  async signUp(data: SignUpData): Promise<AuthResult<AuthSession>> {
    try {
      // Validate input
      const validation = SignUpSchema.safeParse(data);
      if (!validation.success) {
        return {
          success: false,
          error: {
            type: AuthErrorType.INVALID_CREDENTIALS,
            message: validation.error.errors[0]?.message || 'Invalid input data'
          }
        };
      }

      // Check rate limiting
      const rateLimitCheck = await rateLimiter.checkRateLimit(data.email);
      if (!rateLimitCheck.allowed) {
        return this.createRateLimitError(rateLimitCheck);
      }

      // Check if email is already registered
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', data.email)
        .single();

      if (existingUser) {
        return {
          success: false,
          error: {
            type: AuthErrorType.USER_NOT_FOUND,
            message: 'Email already registered'
          }
        };
      }

      // Check username availability if provided
      if (data.username) {
        const usernameAvailable = await this.checkUsernameAvailability(data.username);
        if (!usernameAvailable) {
          return {
            success: false,
            error: {
              type: AuthErrorType.INVALID_CREDENTIALS,
              message: 'Username already taken'
            }
          };
        }
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            username: data.username,
            marketing_consent: data.marketingConsent
          }
        }
      });

      // Record attempt
      await rateLimiter.recordAttempt(data.email, !authError);

      if (authError || !authData.user) {
        return {
          success: false,
          error: this.mapSupabaseError(authError),
          rateLimitInfo: this.getRateLimitInfo(rateLimitCheck)
        };
      }

      // Create user profile
      const profileResult = await profileService.createProfile({
        id: authData.user.id,
        email: data.email,
        username: data.username || data.email.split('@')[0],
        fullName: data.fullName
      } as any);

      if (!profileResult.success) {
        // Clean up auth user if profile creation fails
        await supabase.auth.signOut();
        return {
          success: false,
          error: profileResult.error || {
            type: AuthErrorType.UNKNOWN_ERROR,
            message: 'Failed to create user profile'
          }
        };
      }

      // Create session
      const session = await this.createSession(authData.user, profileResult.data!);
      
      return {
        success: true,
        data: session
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: {
          type: AuthErrorType.UNKNOWN_ERROR,
          message: 'An unexpected error occurred during sign up'
        }
      };
    }
  }

  /**
   * Sign in an existing user
   */
  async signIn(data: SignInData): Promise<AuthResult<AuthSession>> {
    try {
      // Validate input
      const validation = SignInSchema.safeParse(data);
      if (!validation.success) {
        return {
          success: false,
          error: {
            type: AuthErrorType.INVALID_CREDENTIALS,
            message: validation.error.errors[0]?.message || 'Invalid credentials'
          }
        };
      }

      // Check rate limiting
      const rateLimitCheck = await rateLimiter.checkRateLimit(data.email);
      if (!rateLimitCheck.allowed) {
        return this.createRateLimitError(rateLimitCheck);
      }

      // Attempt sign in
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      // Record attempt
      await rateLimiter.recordAttempt(data.email, !authError);

      if (authError || !authData.user) {
        return {
          success: false,
          error: this.mapSupabaseError(authError),
          rateLimitInfo: this.getRateLimitInfo(rateLimitCheck)
        };
      }

      // Ensure profile exists
      const profileResult = await profileService.ensureProfile(
        authData.user.id,
        authData.user.email || '',
        authData.user.user_metadata?.full_name
      );

      if (!profileResult.success) {
        return {
          success: false,
          error: profileResult.error || {
            type: AuthErrorType.UNKNOWN_ERROR,
            message: 'Failed to load user profile'
          }
        };
      }

      // Check if account is suspended
      if (profileResult.data!.status === 'suspended' || profileResult.data!.status === 'banned') {
        await supabase.auth.signOut();
        return {
          success: false,
          error: {
            type: AuthErrorType.ACCOUNT_SUSPENDED,
            message: 'Your account has been suspended. Please contact support.'
          }
        };
      }

      // Update last active date
      await profileService.updateProfile(authData.user.id, {
        lastActiveDate: new Date().toISOString(),
        metadata: {
          ...profileResult.data!.metadata,
          lastLoginAt: new Date().toISOString(),
          loginCount: (profileResult.data!.metadata?.loginCount || 0) + 1
        }
      });

      // Create session
      const session = await this.createSession(authData.user, profileResult.data!);
      
      // Store session if remember me
      if (data.rememberMe) {
        this.storeSession(session);
      }

      return {
        success: true,
        data: session
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: {
          type: AuthErrorType.UNKNOWN_ERROR,
          message: 'An unexpected error occurred during sign in'
        }
      };
    }
  }

  /**
   * Sign in with OAuth provider
   */
  async signInWithOAuth(provider: OAuthProvider): Promise<AuthResult<void>> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider.provider,
        options: {
          redirectTo: provider.redirectTo || `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        return {
          success: false,
          error: this.mapSupabaseError(error)
        };
      }

      return { success: true };
    } catch (error) {
      console.error('OAuth sign in error:', error);
      return {
        success: false,
        error: {
          type: AuthErrorType.UNKNOWN_ERROR,
          message: 'Failed to initiate OAuth sign in'
        }
      };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<AuthResult<void>> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return {
          success: false,
          error: this.mapSupabaseError(error)
        };
      }

      // Clear session cache
      this.sessionCache = null;
      this.clearStoredSession();
      
      // Clear profile cache
      profileService.clearCache();

      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return {
        success: false,
        error: {
          type: AuthErrorType.UNKNOWN_ERROR,
          message: 'Failed to sign out'
        }
      };
    }
  }

  /**
   * Request password reset
   */
  async resetPassword(data: PasswordResetRequest): Promise<AuthResult<void>> {
    try {
      // Validate email
      const emailValidation = validateEmail(data.email);
      if (!emailValidation.valid) {
        return {
          success: false,
          error: {
            type: AuthErrorType.INVALID_CREDENTIALS,
            message: emailValidation.error!
          }
        };
      }

      // Check rate limiting
      const rateLimitCheck = await rateLimiter.checkRateLimit(`reset:${data.email}`);
      if (!rateLimitCheck.allowed) {
        return this.createRateLimitError(rateLimitCheck);
      }

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: data.redirectTo || `${window.location.origin}/auth/reset-password`
      });

      // Record attempt
      await rateLimiter.recordAttempt(`reset:${data.email}`, !error);

      if (error) {
        return {
          success: false,
          error: this.mapSupabaseError(error),
          rateLimitInfo: this.getRateLimitInfo(rateLimitCheck)
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: {
          type: AuthErrorType.UNKNOWN_ERROR,
          message: 'Failed to send password reset email'
        }
      };
    }
  }

  /**
   * Update user password
   */
  async updatePassword(data: PasswordUpdateData): Promise<AuthResult<void>> {
    try {
      // Validate input
      const validation = PasswordUpdateSchema.safeParse(data);
      if (!validation.success) {
        return {
          success: false,
          error: {
            type: AuthErrorType.INVALID_CREDENTIALS,
            message: validation.error.errors[0]?.message || 'Invalid password'
          }
        };
      }

      // Verify current password first
      const session = await this.getSession();
      if (!session.success || !session.data) {
        return {
          success: false,
          error: {
            type: AuthErrorType.SESSION_EXPIRED,
            message: 'No active session'
          }
        };
      }

      // Re-authenticate with current password
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: session.data.user.email!,
        password: data.currentPassword
      });

      if (authError) {
        return {
          success: false,
          error: {
            type: AuthErrorType.INVALID_CREDENTIALS,
            message: 'Current password is incorrect'
          }
        };
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });

      if (error) {
        return {
          success: false,
          error: this.mapSupabaseError(error)
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Password update error:', error);
      return {
        success: false,
        error: {
          type: AuthErrorType.UNKNOWN_ERROR,
          message: 'Failed to update password'
        }
      };
    }
  }

  /**
   * Get current session
   */
  async getSession(): Promise<AuthResult<AuthSession | null>> {
    try {
      // Check cache first
      if (this.sessionCache && this.isSessionValid(this.sessionCache)) {
        return { success: true, data: this.sessionCache };
      }

      // Get session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        return {
          success: false,
          error: this.mapSupabaseError(error)
        };
      }

      if (!session) {
        // Try to restore from stored session
        const storedSession = await this.restoreStoredSession();
        if (storedSession) {
          return { success: true, data: storedSession };
        }
        return { success: true, data: null };
      }

      // Get user profile
      const profileResult = await profileService.getProfile(session.user.id);
      if (!profileResult.success || !profileResult.data) {
        return {
          success: false,
          error: {
            type: AuthErrorType.USER_NOT_FOUND,
            message: 'User profile not found'
          }
        };
      }

      // Create and cache session
      const authSession = await this.createSession(session.user, profileResult.data);
      this.sessionCache = authSession;

      return { success: true, data: authSession };
    } catch (error) {
      console.error('Get session error:', error);
      return {
        success: false,
        error: {
          type: AuthErrorType.UNKNOWN_ERROR,
          message: 'Failed to get session'
        }
      };
    }
  }

  /**
   * Refresh the current session
   */
  async refreshSession(): Promise<AuthResult<AuthSession>> {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error || !session) {
        return {
          success: false,
          error: this.mapSupabaseError(error) || {
            type: AuthErrorType.SESSION_EXPIRED,
            message: 'Failed to refresh session'
          }
        };
      }

      // Get updated profile
      const profileResult = await profileService.getProfile(session.user.id);
      if (!profileResult.success || !profileResult.data) {
        return {
          success: false,
          error: {
            type: AuthErrorType.USER_NOT_FOUND,
            message: 'User profile not found'
          }
        };
      }

      // Create new session
      const authSession = await this.createSession(session.user, profileResult.data);
      this.sessionCache = authSession;

      return { success: true, data: authSession };
    } catch (error) {
      console.error('Refresh session error:', error);
      return {
        success: false,
        error: {
          type: AuthErrorType.UNKNOWN_ERROR,
          message: 'Failed to refresh session'
        }
      };
    }
  }

  /**
   * Check if email is available
   */
  async checkEmailAvailability(email: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', email)
        .single();
      
      return !data;
    } catch {
      return true; // Assume available if error
    }
  }

  /**
   * Check if username is available
   */
  async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('username', username)
        .single();
      
      return !data;
    } catch {
      return true; // Assume available if error
    }
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(): Promise<AuthResult<void>> {
    try {
      const session = await this.getSession();
      if (!session.success || !session.data) {
        return {
          success: false,
          error: {
            type: AuthErrorType.SESSION_EXPIRED,
            message: 'No active session'
          }
        };
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: session.data.user.email!
      });

      if (error) {
        return {
          success: false,
          error: this.mapSupabaseError(error)
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Resend verification error:', error);
      return {
        success: false,
        error: {
          type: AuthErrorType.UNKNOWN_ERROR,
          message: 'Failed to resend verification email'
        }
      };
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(password: string): Promise<AuthResult<void>> {
    try {
      const session = await this.getSession();
      if (!session.success || !session.data) {
        return {
          success: false,
          error: {
            type: AuthErrorType.SESSION_EXPIRED,
            message: 'No active session'
          }
        };
      }

      // Verify password
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: session.data.user.email!,
        password
      });

      if (authError) {
        return {
          success: false,
          error: {
            type: AuthErrorType.INVALID_CREDENTIALS,
            message: 'Incorrect password'
          }
        };
      }

      // Delete user data (this should be handled by a server function)
      // For now, just sign out
      await this.signOut();

      return { success: true };
    } catch (error) {
      console.error('Delete account error:', error);
      return {
        success: false,
        error: {
          type: AuthErrorType.UNKNOWN_ERROR,
          message: 'Failed to delete account'
        }
      };
    }
  }

  /**
   * Create auth session from user and profile
   */
  private async createSession(user: User, profile: UserProfile): Promise<AuthSession> {
    const { data: { session } } = await supabase.auth.getSession();
    
    return {
      user,
      profile,
      accessToken: session?.access_token || '',
      refreshToken: session?.refresh_token || '',
      expiresAt: new Date(session?.expires_at ? session.expires_at * 1000 : Date.now() + 3600000),
      issuedAt: new Date()
    };
  }

  /**
   * Check if session is valid
   */
  private isSessionValid(session: AuthSession): boolean {
    return session.expiresAt > new Date();
  }

  /**
   * Map Supabase errors to our error types
   */
  private mapSupabaseError(error: any): AuthError {
    if (!error) {
      return {
        type: AuthErrorType.UNKNOWN_ERROR,
        message: 'An unknown error occurred'
      };
    }

    const message = error.message || 'An error occurred';
    
    if (message.includes('Invalid login credentials')) {
      return {
        type: AuthErrorType.INVALID_CREDENTIALS,
        message: 'Invalid email or password'
      };
    }
    
    if (message.includes('User not found')) {
      return {
        type: AuthErrorType.USER_NOT_FOUND,
        message: 'User not found'
      };
    }
    
    if (message.includes('Email not confirmed')) {
      return {
        type: AuthErrorType.EMAIL_NOT_VERIFIED,
        message: 'Please verify your email before signing in'
      };
    }
    
    if (message.includes('Token has expired')) {
      return {
        type: AuthErrorType.SESSION_EXPIRED,
        message: 'Your session has expired. Please sign in again.'
      };
    }

    return {
      type: AuthErrorType.UNKNOWN_ERROR,
      message,
      details: error
    };
  }

  /**
   * Create rate limit error
   */
  private createRateLimitError(rateLimitCheck: any): AuthResult<any> {
    const lockoutMinutes = Math.ceil((rateLimitCheck.lockoutTime || 0) / 1000 / 60);
    return {
      success: false,
      error: {
        type: AuthErrorType.RATE_LIMITED,
        message: `Too many attempts. Please try again in ${lockoutMinutes} minutes.`
      },
      rateLimitInfo: {
        remainingAttempts: rateLimitCheck.remainingAttempts,
        resetAt: new Date(Date.now() + (rateLimitCheck.lockoutTime || 0))
      }
    };
  }

  /**
   * Get rate limit info
   */
  private getRateLimitInfo(rateLimitCheck: any): RateLimitInfo {
    return {
      remainingAttempts: Math.max(0, rateLimitCheck.remainingAttempts - 1),
      resetAt: new Date(Date.now() + (rateLimitCheck.lockoutTime || 0))
    };
  }

  /**
   * Store session for remember me
   */
  private storeSession(session: AuthSession): void {
    try {
      const data = {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        expiresAt: session.expiresAt.toISOString(),
        userId: session.user.id,
        rememberMe: true
      };
      localStorage.setItem('crd_session', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to store session:', error);
    }
  }

  /**
   * Clear stored session
   */
  private clearStoredSession(): void {
    try {
      localStorage.removeItem('crd_session');
    } catch (error) {
      console.error('Failed to clear stored session:', error);
    }
  }

  /**
   * Restore session from storage
   */
  private async restoreStoredSession(): Promise<AuthSession | null> {
    try {
      const stored = localStorage.getItem('crd_session');
      if (!stored) return null;

      const data = JSON.parse(stored);
      if (!data.rememberMe || new Date(data.expiresAt) < new Date()) {
        this.clearStoredSession();
        return null;
      }

      // Refresh the session
      const result = await this.refreshSession();
      return result.success ? result.data! : null;
    } catch (error) {
      console.error('Failed to restore session:', error);
      return null;
    }
  }

  /**
   * Start monitoring session validity
   */
  private startSessionMonitoring(): void {
    // Check session every 5 minutes
    this.sessionCheckInterval = setInterval(async () => {
      if (this.sessionCache) {
        const minutesUntilExpiry = (this.sessionCache.expiresAt.getTime() - Date.now()) / 1000 / 60;
        
        // Refresh if less than 10 minutes until expiry
        if (minutesUntilExpiry < 10) {
          await this.refreshSession();
        }
      }
    }, 5 * 60 * 1000);
  }

  /**
   * Stop session monitoring
   */
  stopSessionMonitoring(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  }
}

// Export singleton instance
export const enhancedAuthService = new EnhancedAuthService();