/**
 * Authentication System Types
 * Version 2.0.0
 * 
 * Type definitions for the enhanced authentication system
 * with proper type safety and comprehensive error handling
 */

import type { User } from '@supabase/supabase-js';
import type { UserProfile } from './profile.types';

// Auth States
export enum AuthState {
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error'
}

// Auth Error Types
export enum AuthErrorType {
  INVALID_CREDENTIALS = 'invalid_credentials',
  USER_NOT_FOUND = 'user_not_found',
  EMAIL_NOT_VERIFIED = 'email_not_verified',
  ACCOUNT_SUSPENDED = 'account_suspended',
  RATE_LIMITED = 'rate_limited',
  NETWORK_ERROR = 'network_error',
  INVALID_TOKEN = 'invalid_token',
  SESSION_EXPIRED = 'session_expired',
  PERMISSION_DENIED = 'permission_denied',
  UNKNOWN_ERROR = 'unknown_error'
}

// Auth Interfaces
export interface AuthError {
  type: AuthErrorType;
  message: string;
  details?: Record<string, any>;
}

export interface RateLimitInfo {
  remainingAttempts: number;
  resetAt: Date;
  lockoutDuration?: number;
}

export interface AuthSession {
  user: User;
  profile: UserProfile;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  issuedAt: Date;
}

export interface AuthResult<T = any> {
  success: boolean;
  data?: T;
  error?: AuthError;
  rateLimitInfo?: RateLimitInfo;
}

// Sign Up/Sign In Data
export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  username?: string;
  acceptTerms: boolean;
  marketingConsent?: boolean;
  metadata?: Record<string, any>;
}

export interface SignInData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface OAuthProvider {
  provider: 'google' | 'github' | 'twitter' | 'facebook';
  redirectTo?: string;
}

// Password Management
export interface PasswordResetRequest {
  email: string;
  redirectTo?: string;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Profile Updates
export interface ProfileUpdateData {
  fullName?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  location?: string;
  website?: string;
  socialLinks?: Record<string, string>;
  settings?: Record<string, any>;
  metadata?: Record<string, any>;
}

// Auth Context Type
export interface AuthContextType {
  // State
  state: AuthState;
  user: User | null;
  profile: UserProfile | null;
  session: AuthSession | null;
  loading: boolean;
  error: AuthError | null;
  
  // Auth Methods
  signUp: (data: SignUpData) => Promise<AuthResult<AuthSession>>;
  signIn: (data: SignInData) => Promise<AuthResult<AuthSession>>;
  signInWithOAuth: (provider: OAuthProvider) => Promise<AuthResult<void>>;
  signOut: () => Promise<AuthResult<void>>;
  
  // Password Methods
  resetPassword: (data: PasswordResetRequest) => Promise<AuthResult<void>>;
  updatePassword: (data: PasswordUpdateData) => Promise<AuthResult<void>>;
  
  // Profile Methods
  updateProfile: (data: ProfileUpdateData) => Promise<AuthResult<UserProfile>>;
  refreshProfile: () => Promise<AuthResult<UserProfile>>;
  deleteAccount: (password: string) => Promise<AuthResult<void>>;
  
  // Session Methods
  refreshSession: () => Promise<AuthResult<AuthSession>>;
  validateSession: () => Promise<boolean>;
  
  // Utility Methods
  checkEmailAvailability: (email: string) => Promise<boolean>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  resendVerificationEmail: () => Promise<AuthResult<void>>;
  
  // Rate Limiting
  rateLimitInfo: RateLimitInfo | null;
  clearRateLimitInfo: () => void;
}

// Auth Provider Props
export interface AuthProviderProps {
  children: React.ReactNode;
  onAuthStateChange?: (state: AuthState, session: AuthSession | null) => void;
  requireAuth?: boolean;
  redirectTo?: string;
}

// Auth Hook Return Type
export interface UseAuthReturn extends AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

// Session Storage
export interface StoredSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  userId: string;
  rememberMe: boolean;
}

// Auth Events
export enum AuthEvent {
  SIGN_IN = 'auth:sign_in',
  SIGN_OUT = 'auth:sign_out',
  TOKEN_REFRESHED = 'auth:token_refreshed',
  USER_UPDATED = 'auth:user_updated',
  PASSWORD_RECOVERY = 'auth:password_recovery',
  USER_DELETED = 'auth:user_deleted'
}

export interface AuthEventData {
  event: AuthEvent;
  session: AuthSession | null;
  error?: AuthError;
}