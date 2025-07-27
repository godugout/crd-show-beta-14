/**
 * Authentication Validation Utilities
 * 
 * Validation functions for auth-related inputs and data
 */

import { z } from 'zod';

// Password validation schema with custom rules
export const PasswordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must not exceed 100 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Email validation schema
export const EmailSchema = z.string()
  .email('Invalid email address')
  .min(5, 'Email address is too short')
  .max(255, 'Email address is too long')
  .toLowerCase()
  .transform(email => email.trim());

// Username validation schema
export const UsernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must not exceed 30 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
  .regex(/^[a-zA-Z]/, 'Username must start with a letter');

// Full name validation schema
export const FullNameSchema = z.string()
  .min(1, 'Full name is required')
  .max(100, 'Full name must not exceed 100 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes')
  .transform(name => name.trim());

// Sign up validation schema
export const SignUpSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  confirmPassword: z.string(),
  fullName: FullNameSchema,
  username: UsernameSchema.optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  }),
  marketingConsent: z.boolean().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

// Sign in validation schema
export const SignInSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
});

// Password reset validation schema
export const PasswordResetSchema = z.object({
  email: EmailSchema
});

// Password update validation schema
export const PasswordUpdateSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: PasswordSchema,
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
}).refine(data => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword']
});

// Profile update validation schema
export const ProfileUpdateSchema = z.object({
  fullName: FullNameSchema.optional(),
  username: UsernameSchema.optional(),
  bio: z.string().max(500, 'Bio must not exceed 500 characters').optional(),
  location: z.string().max(100, 'Location must not exceed 100 characters').optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  avatarUrl: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
  coverImageUrl: z.string().url('Invalid cover image URL').optional().or(z.literal(''))
});

// Social links validation schema
export const SocialLinksSchema = z.object({
  twitter: z.string().regex(/^[a-zA-Z0-9_]{1,15}$/, 'Invalid Twitter username').optional().or(z.literal('')),
  instagram: z.string().regex(/^[a-zA-Z0-9_.]{1,30}$/, 'Invalid Instagram username').optional().or(z.literal('')),
  facebook: z.string().regex(/^[a-zA-Z0-9.]{5,50}$/, 'Invalid Facebook username').optional().or(z.literal('')),
  linkedin: z.string().regex(/^[a-zA-Z0-9-]{3,100}$/, 'Invalid LinkedIn username').optional().or(z.literal('')),
  youtube: z.string().regex(/^[a-zA-Z0-9_-]{3,100}$/, 'Invalid YouTube username').optional().or(z.literal('')),
  tiktok: z.string().regex(/^[a-zA-Z0-9_.]{2,24}$/, 'Invalid TikTok username').optional().or(z.literal(''))
});

/**
 * Validates email format
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  try {
    EmailSchema.parse(email);
    return { valid: true };
  } catch (error: any) {
    return { valid: false, error: error.errors?.[0]?.message || 'Invalid email' };
  }
}

/**
 * Validates password strength
 */
export function validatePassword(password: string): { valid: boolean; error?: string; strength: number } {
  try {
    PasswordSchema.parse(password);
    const strength = calculatePasswordStrength(password);
    return { valid: true, strength };
  } catch (error: any) {
    return { 
      valid: false, 
      error: error.errors?.[0]?.message || 'Invalid password',
      strength: calculatePasswordStrength(password)
    };
  }
}

/**
 * Validates username format
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  try {
    UsernameSchema.parse(username);
    return { valid: true };
  } catch (error: any) {
    return { valid: false, error: error.errors?.[0]?.message || 'Invalid username' };
  }
}

/**
 * Calculates password strength (0-5)
 */
export function calculatePasswordStrength(password: string): number {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  return Math.min(5, Math.floor((strength / 6) * 5));
}

/**
 * Sanitizes user input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Validates file upload
 */
export function validateFileUpload(file: File, options: {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
} = {}): { valid: boolean; error?: string } {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = options;
  
  if (file.size > maxSize) {
    return { valid: false, error: `File size must not exceed ${Math.floor(maxSize / 1024 / 1024)}MB` };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type' };
  }
  
  return { valid: true };
}

/**
 * Validates age (must be 13+ years old)
 */
export function validateAge(birthDate: string): { valid: boolean; error?: string } {
  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  if (age < 13) {
    return { valid: false, error: 'You must be at least 13 years old' };
  }
  
  return { valid: true };
}

/**
 * Formats validation errors for display
 */
export function formatValidationErrors(errors: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};
  
  errors.errors.forEach(error => {
    const path = error.path.join('.');
    formatted[path] = error.message;
  });
  
  return formatted;
}