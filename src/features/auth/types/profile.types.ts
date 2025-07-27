/**
 * Enhanced Profile System Types
 * Version 2.0.0
 * 
 * Comprehensive type definitions for the unified profile system
 * with role-based access control and multi-profile support
 */

import { z } from 'zod';

// Enums
export enum UserRole {
  USER = 'user',
  CREATOR = 'creator',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

export enum ProfileType {
  PERSONAL = 'personal',
  CREATOR = 'creator',
  BUSINESS = 'business'
}

export enum ProfileStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BANNED = 'banned'
}

export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  EMAIL_VERIFIED = 'email_verified',
  IDENTITY_VERIFIED = 'identity_verified',
  CREATOR_VERIFIED = 'creator_verified',
  BUSINESS_VERIFIED = 'business_verified'
}

export enum BadgeType {
  EARLY_ADOPTER = 'early_adopter',
  TOP_CREATOR = 'top_creator',
  VERIFIED_CREATOR = 'verified_creator',
  COMMUNITY_CONTRIBUTOR = 'community_contributor',
  BETA_TESTER = 'beta_tester',
  PREMIUM_MEMBER = 'premium_member'
}

// Base Types
export interface ProfileMetadata {
  lastLoginAt?: string;
  loginCount: number;
  preferredLanguage: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
}

export interface ProfileSettings {
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showLocation: boolean;
    showStats: boolean;
    allowMessages: 'everyone' | 'following' | 'none';
  };
  display: {
    showBadges: boolean;
    showAchievements: boolean;
    showCollections: boolean;
    showActivity: boolean;
  };
  notifications: {
    emailDigest: 'daily' | 'weekly' | 'never';
    newFollower: boolean;
    newComment: boolean;
    newLike: boolean;
    newPurchase: boolean;
    systemUpdates: boolean;
  };
}

export interface ProfileStats {
  cardsCreated: number;
  cardsCollected: number;
  totalLikes: number;
  totalViews: number;
  totalSales: number;
  totalRevenue: number;
  followersCount: number;
  followingCount: number;
  averageRating: number;
  ratingCount: number;
}

export interface CreatorProfile {
  artistName?: string;
  portfolioUrl?: string;
  commissionRates?: {
    custom: number;
    bulk: number;
    exclusive: number;
  };
  specialties: string[];
  yearsExperience: number;
  featuredWorks: string[]; // Card IDs
  availability: 'available' | 'busy' | 'unavailable';
  responseTime: string; // e.g., "within 24 hours"
}

export interface BusinessProfile {
  businessName: string;
  businessType: string;
  taxId?: string;
  website?: string;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

// Main Profile Interface
export interface UserProfile {
  // Core fields
  id: string;
  email: string;
  username: string;
  fullName: string;
  
  // Profile type and status
  profileType: ProfileType;
  status: ProfileStatus;
  roles: UserRole[];
  
  // Identity and verification
  verificationStatus: VerificationStatus;
  kycVerified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  
  // Visual identity
  avatarUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  tagline?: string;
  
  // Location and demographics
  location?: string;
  birthDate?: string;
  gender?: string;
  
  // Social and web presence
  website?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
  
  // Gamification
  level: number;
  experiencePoints: number;
  badges: BadgeType[];
  achievements: string[];
  
  // Activity tracking
  lastActiveDate: string;
  daysActiveStreak: number;
  totalDaysActive: number;
  
  // Profile completeness
  profileCompleteness: number; // 0-100
  completedSteps: string[];
  
  // Settings and preferences
  settings: ProfileSettings;
  metadata: ProfileMetadata;
  
  // Statistics
  stats: ProfileStats;
  
  // Extended profiles (conditional based on profileType)
  creatorProfile?: CreatorProfile;
  businessProfile?: BusinessProfile;
  
  // Payment and subscription
  stripeCustomerId?: string;
  stripeConnectAccountId?: string;
  subscriptionTier?: 'free' | 'pro' | 'enterprise';
  subscriptionExpiresAt?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Zod Validation Schemas
export const ProfileMetadataSchema = z.object({
  lastLoginAt: z.string().optional(),
  loginCount: z.number().min(0),
  preferredLanguage: z.string().default('en'),
  timezone: z.string().default('UTC'),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false)
});

export const ProfileSettingsSchema = z.object({
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('public'),
    showEmail: z.boolean().default(false),
    showLocation: z.boolean().default(true),
    showStats: z.boolean().default(true),
    allowMessages: z.enum(['everyone', 'following', 'none']).default('following')
  }),
  display: z.object({
    showBadges: z.boolean().default(true),
    showAchievements: z.boolean().default(true),
    showCollections: z.boolean().default(true),
    showActivity: z.boolean().default(true)
  }),
  notifications: z.object({
    emailDigest: z.enum(['daily', 'weekly', 'never']).default('weekly'),
    newFollower: z.boolean().default(true),
    newComment: z.boolean().default(true),
    newLike: z.boolean().default(true),
    newPurchase: z.boolean().default(true),
    systemUpdates: z.boolean().default(true)
  })
});

export const CreatorProfileSchema = z.object({
  artistName: z.string().optional(),
  portfolioUrl: z.string().url().optional(),
  commissionRates: z.object({
    custom: z.number().min(0).max(100),
    bulk: z.number().min(0).max(100),
    exclusive: z.number().min(0).max(100)
  }).optional(),
  specialties: z.array(z.string()).default([]),
  yearsExperience: z.number().min(0).default(0),
  featuredWorks: z.array(z.string()).default([]),
  availability: z.enum(['available', 'busy', 'unavailable']).default('available'),
  responseTime: z.string().default('within 48 hours')
});

export const BusinessProfileSchema = z.object({
  businessName: z.string().min(1),
  businessType: z.string().min(1),
  taxId: z.string().optional(),
  website: z.string().url().optional(),
  description: z.string().optional(),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string()
  }).optional()
});

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
  fullName: z.string().min(1).max(100),
  
  profileType: z.nativeEnum(ProfileType),
  status: z.nativeEnum(ProfileStatus),
  roles: z.array(z.nativeEnum(UserRole)),
  
  verificationStatus: z.nativeEnum(VerificationStatus),
  kycVerified: z.boolean().default(false),
  emailVerified: z.boolean().default(false),
  phoneVerified: z.boolean().default(false),
  
  avatarUrl: z.string().url().optional(),
  coverImageUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  tagline: z.string().max(100).optional(),
  
  location: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  
  website: z.string().url().optional(),
  socialLinks: z.object({
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    linkedin: z.string().optional(),
    youtube: z.string().optional(),
    tiktok: z.string().optional()
  }).optional(),
  
  level: z.number().min(1).default(1),
  experiencePoints: z.number().min(0).default(0),
  badges: z.array(z.nativeEnum(BadgeType)).default([]),
  achievements: z.array(z.string()).default([]),
  
  lastActiveDate: z.string(),
  daysActiveStreak: z.number().min(0).default(0),
  totalDaysActive: z.number().min(0).default(0),
  
  profileCompleteness: z.number().min(0).max(100).default(0),
  completedSteps: z.array(z.string()).default([]),
  
  settings: ProfileSettingsSchema,
  metadata: ProfileMetadataSchema,
  
  stats: z.object({
    cardsCreated: z.number().min(0).default(0),
    cardsCollected: z.number().min(0).default(0),
    totalLikes: z.number().min(0).default(0),
    totalViews: z.number().min(0).default(0),
    totalSales: z.number().min(0).default(0),
    totalRevenue: z.number().min(0).default(0),
    followersCount: z.number().min(0).default(0),
    followingCount: z.number().min(0).default(0),
    averageRating: z.number().min(0).max(5).default(0),
    ratingCount: z.number().min(0).default(0)
  }),
  
  creatorProfile: CreatorProfileSchema.optional(),
  businessProfile: BusinessProfileSchema.optional(),
  
  stripeCustomerId: z.string().optional(),
  stripeConnectAccountId: z.string().optional(),
  subscriptionTier: z.enum(['free', 'pro', 'enterprise']).default('free'),
  subscriptionExpiresAt: z.string().optional(),
  
  createdAt: z.string(),
  updatedAt: z.string()
});

// Type Guards
export function isCreatorProfile(profile: UserProfile): profile is UserProfile & { creatorProfile: CreatorProfile } {
  return profile.profileType === ProfileType.CREATOR && !!profile.creatorProfile;
}

export function isBusinessProfile(profile: UserProfile): profile is UserProfile & { businessProfile: BusinessProfile } {
  return profile.profileType === ProfileType.BUSINESS && !!profile.businessProfile;
}

export function hasRole(profile: UserProfile, role: UserRole): boolean {
  return profile.roles.includes(role);
}

export function isAdmin(profile: UserProfile): boolean {
  return hasRole(profile, UserRole.ADMIN);
}

export function isModerator(profile: UserProfile): boolean {
  return hasRole(profile, UserRole.MODERATOR);
}

export function isVerified(profile: UserProfile): boolean {
  return profile.verificationStatus !== VerificationStatus.UNVERIFIED;
}

// Utility Types
export type ProfileUpdateData = Partial<Omit<UserProfile, 'id' | 'email' | 'createdAt' | 'stats'>>;
export type ProfileCreateData = Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt' | 'stats' | 'level' | 'experiencePoints'>;

// Profile completion calculation
export function calculateProfileCompleteness(profile: UserProfile): number {
  const requiredFields = ['username', 'fullName', 'bio', 'avatarUrl'];
  const optionalFields = ['location', 'website', 'tagline', 'coverImageUrl', 'socialLinks'];
  
  let completed = 0;
  let total = requiredFields.length + optionalFields.length;
  
  // Check required fields
  requiredFields.forEach(field => {
    if (profile[field as keyof UserProfile]) completed++;
  });
  
  // Check optional fields
  if (profile.location) completed++;
  if (profile.website) completed++;
  if (profile.tagline) completed++;
  if (profile.coverImageUrl) completed++;
  if (profile.socialLinks && Object.values(profile.socialLinks).some(link => !!link)) completed++;
  
  // Check profile-specific fields
  if (profile.profileType === ProfileType.CREATOR && profile.creatorProfile) {
    total += 3;
    if (profile.creatorProfile.artistName) completed++;
    if (profile.creatorProfile.portfolioUrl) completed++;
    if (profile.creatorProfile.specialties.length > 0) completed++;
  }
  
  if (profile.profileType === ProfileType.BUSINESS && profile.businessProfile) {
    total += 2;
    if (profile.businessProfile.description) completed++;
    if (profile.businessProfile.website) completed++;
  }
  
  return Math.round((completed / total) * 100);
}