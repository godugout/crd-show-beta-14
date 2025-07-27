/**
 * Enhanced Profile Service
 * Version 2.0.0
 * 
 * Type-safe service for managing user profiles with support for
 * multiple profile types, roles, and comprehensive profile operations
 */

import { supabase } from '@/integrations/supabase/client';
import type { 
  UserProfile, 
  ProfileType, 
  UserRole, 
  ProfileUpdateData, 
  ProfileCreateData,
  BadgeType,
  ProfileStatus,
  VerificationStatus
} from '../types/profile.types';
import type { AuthResult } from '../types/auth.types';
import { 
  createNewUserProfile, 
  migrateProfileData, 
  validateProfile,
  calculateProfileCompleteness,
  getCompletedSteps,
  calculateExperiencePoints,
  calculateLevel
} from '../utils/profile.utils';
import { UserProfileSchema } from '../types/profile.types';

export class ProfileService {
  private readonly TABLE_NAME = 'user_profiles';
  private profileCache: Map<string, { profile: UserProfile; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Creates a new user profile
   */
  async createProfile(data: ProfileCreateData): Promise<AuthResult<UserProfile>> {
    try {
      // Validate input data
      const validationResult = UserProfileSchema.safeParse(data);
      if (!validationResult.success) {
        return {
          success: false,
          error: {
            type: 'VALIDATION_ERROR' as any,
            message: 'Invalid profile data',
            details: validationResult.error.flatten()
          }
        };
      }

      // Check if profile already exists
      const existing = await this.getProfile(data.id);
      if (existing.success && existing.data) {
        return {
          success: false,
          error: {
            type: 'PROFILE_EXISTS' as any,
            message: 'Profile already exists for this user'
          }
        };
      }

      // Create new profile with defaults
      const newProfile = createNewUserProfile({
        id: data.id,
        email: data.email,
        username: data.username,
        fullName: data.fullName,
        profileType: data.profileType
      });

      // Insert into database
      const { data: insertedProfile, error } = await supabase
        .from(this.TABLE_NAME)
        .insert(this.transformProfileForDB(newProfile))
        .select()
        .single();

      if (error) {
        console.error('Profile creation error:', error);
        return {
          success: false,
          error: {
            type: 'DATABASE_ERROR' as any,
            message: 'Failed to create profile',
            details: error
          }
        };
      }

      const profile = this.transformProfileFromDB(insertedProfile);
      this.cacheProfile(profile);

      return {
        success: true,
        data: profile
      };
    } catch (error) {
      console.error('Unexpected error creating profile:', error);
      return {
        success: false,
        error: {
          type: 'UNKNOWN_ERROR' as any,
          message: 'An unexpected error occurred'
        }
      };
    }
  }

  /**
   * Gets a user profile by ID
   */
  async getProfile(userId: string): Promise<AuthResult<UserProfile | null>> {
    try {
      // Check cache first
      const cached = this.getCachedProfile(userId);
      if (cached) {
        return { success: true, data: cached };
      }

      // Fetch from database
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: true, data: null }; // Profile not found
        }
        return {
          success: false,
          error: {
            type: 'DATABASE_ERROR' as any,
            message: 'Failed to fetch profile',
            details: error
          }
        };
      }

      const profile = this.transformProfileFromDB(data);
      this.cacheProfile(profile);

      return {
        success: true,
        data: profile
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return {
        success: false,
        error: {
          type: 'UNKNOWN_ERROR' as any,
          message: 'An unexpected error occurred'
        }
      };
    }
  }

  /**
   * Updates a user profile
   */
  async updateProfile(userId: string, updates: ProfileUpdateData): Promise<AuthResult<UserProfile>> {
    try {
      // Get existing profile
      const existingResult = await this.getProfile(userId);
      if (!existingResult.success || !existingResult.data) {
        return {
          success: false,
          error: {
            type: 'PROFILE_NOT_FOUND' as any,
            message: 'Profile not found'
          }
        };
      }

      const existingProfile = existingResult.data;
      
      // Merge updates with existing profile
      const updatedProfile: UserProfile = {
        ...existingProfile,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      // Recalculate profile completeness
      updatedProfile.profileCompleteness = calculateProfileCompleteness(updatedProfile);
      updatedProfile.completedSteps = getCompletedSteps(updatedProfile);

      // Validate updated profile
      const validationResult = validateProfile(updatedProfile);
      if (!validationResult.valid) {
        return {
          success: false,
          error: {
            type: 'VALIDATION_ERROR' as any,
            message: 'Invalid profile data',
            details: validationResult.errors
          }
        };
      }

      // Update in database
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .update(this.transformProfileForDB(updatedProfile))
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: {
            type: 'DATABASE_ERROR' as any,
            message: 'Failed to update profile',
            details: error
          }
        };
      }

      const profile = this.transformProfileFromDB(data);
      this.cacheProfile(profile);

      return {
        success: true,
        data: profile
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        error: {
          type: 'UNKNOWN_ERROR' as any,
          message: 'An unexpected error occurred'
        }
      };
    }
  }

  /**
   * Ensures a profile exists, creating it if necessary
   */
  async ensureProfile(userId: string, email: string, fullName?: string): Promise<AuthResult<UserProfile>> {
    try {
      // Try to get existing profile
      const existingResult = await this.getProfile(userId);
      
      if (existingResult.success && existingResult.data) {
        return existingResult as AuthResult<UserProfile>;
      }

      // Check if there's a legacy profile to migrate
      const legacyProfile = await this.getLegacyProfile(userId);
      if (legacyProfile) {
        const migrated = migrateProfileData(legacyProfile);
        const { data, error } = await supabase
          .from(this.TABLE_NAME)
          .upsert(this.transformProfileForDB(migrated))
          .select()
          .single();

        if (!error) {
          const profile = this.transformProfileFromDB(data);
          this.cacheProfile(profile);
          return { success: true, data: profile };
        }
      }

      // Create new profile
      return this.createProfile({
        id: userId,
        email,
        username: email.split('@')[0],
        fullName: fullName || email.split('@')[0],
        profileType: ProfileType.PERSONAL,
        status: ProfileStatus.ACTIVE,
        roles: [UserRole.USER],
        verificationStatus: VerificationStatus.UNVERIFIED,
        settings: {} as any,
        metadata: {} as any
      } as ProfileCreateData);
    } catch (error) {
      console.error('Error ensuring profile:', error);
      return {
        success: false,
        error: {
          type: 'UNKNOWN_ERROR' as any,
          message: 'Failed to ensure profile exists'
        }
      };
    }
  }

  /**
   * Adds a role to a user
   */
  async addRole(userId: string, role: UserRole): Promise<AuthResult<UserProfile>> {
    const profileResult = await this.getProfile(userId);
    if (!profileResult.success || !profileResult.data) {
      return profileResult as AuthResult<UserProfile>;
    }

    const profile = profileResult.data;
    if (profile.roles.includes(role)) {
      return { success: true, data: profile };
    }

    return this.updateProfile(userId, {
      roles: [...profile.roles, role]
    });
  }

  /**
   * Removes a role from a user
   */
  async removeRole(userId: string, role: UserRole): Promise<AuthResult<UserProfile>> {
    const profileResult = await this.getProfile(userId);
    if (!profileResult.success || !profileResult.data) {
      return profileResult as AuthResult<UserProfile>;
    }

    const profile = profileResult.data;
    return this.updateProfile(userId, {
      roles: profile.roles.filter(r => r !== role)
    });
  }

  /**
   * Awards a badge to a user
   */
  async awardBadge(userId: string, badge: BadgeType): Promise<AuthResult<UserProfile>> {
    const profileResult = await this.getProfile(userId);
    if (!profileResult.success || !profileResult.data) {
      return profileResult as AuthResult<UserProfile>;
    }

    const profile = profileResult.data;
    if (profile.badges.includes(badge)) {
      return { success: true, data: profile };
    }

    return this.updateProfile(userId, {
      badges: [...profile.badges, badge]
    });
  }

  /**
   * Adds experience points to a user
   */
  async addExperiencePoints(userId: string, action: string): Promise<AuthResult<UserProfile>> {
    const profileResult = await this.getProfile(userId);
    if (!profileResult.success || !profileResult.data) {
      return profileResult as AuthResult<UserProfile>;
    }

    const profile = profileResult.data;
    const points = calculateExperiencePoints(action);
    const newXP = profile.experiencePoints + points;
    const newLevel = calculateLevel(newXP);

    const updates: ProfileUpdateData = {
      experiencePoints: newXP,
      level: newLevel
    };

    // Check for level up achievements
    if (newLevel > profile.level) {
      updates.achievements = [...(profile.achievements || []), `level_${newLevel}`];
      
      // Award badges for milestones
      if (newLevel === 10 && !profile.badges.includes(BadgeType.EARLY_ADOPTER)) {
        updates.badges = [...profile.badges, BadgeType.EARLY_ADOPTER];
      }
    }

    return this.updateProfile(userId, updates);
  }

  /**
   * Updates profile statistics
   */
  async updateStats(userId: string, stats: Partial<UserProfile['stats']>): Promise<AuthResult<UserProfile>> {
    const profileResult = await this.getProfile(userId);
    if (!profileResult.success || !profileResult.data) {
      return profileResult as AuthResult<UserProfile>;
    }

    const profile = profileResult.data;
    return this.updateProfile(userId, {
      stats: {
        ...profile.stats,
        ...stats
      }
    });
  }

  /**
   * Searches profiles with filters
   */
  async searchProfiles(filters: {
    query?: string;
    profileType?: ProfileType;
    roles?: UserRole[];
    verified?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<AuthResult<{ profiles: UserProfile[]; total: number }>> {
    try {
      let query = supabase
        .from(this.TABLE_NAME)
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.query) {
        query = query.or(`username.ilike.%${filters.query}%,full_name.ilike.%${filters.query}%`);
      }
      if (filters.profileType) {
        query = query.eq('profile_type', filters.profileType);
      }
      if (filters.verified) {
        query = query.neq('verification_status', VerificationStatus.UNVERIFIED);
      }

      // Apply pagination
      const limit = filters.limit || 20;
      const offset = filters.offset || 0;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        return {
          success: false,
          error: {
            type: 'DATABASE_ERROR' as any,
            message: 'Failed to search profiles',
            details: error
          }
        };
      }

      const profiles = data.map(d => this.transformProfileFromDB(d));
      
      // Filter by roles in memory (since PostgreSQL array contains is complex)
      const filteredProfiles = filters.roles
        ? profiles.filter(p => filters.roles!.some(role => p.roles.includes(role)))
        : profiles;

      return {
        success: true,
        data: {
          profiles: filteredProfiles,
          total: count || 0
        }
      };
    } catch (error) {
      console.error('Error searching profiles:', error);
      return {
        success: false,
        error: {
          type: 'UNKNOWN_ERROR' as any,
          message: 'Failed to search profiles'
        }
      };
    }
  }

  /**
   * Gets a legacy profile from the old profiles table
   */
  private async getLegacyProfile(userId: string): Promise<any | null> {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      return data;
    } catch {
      return null;
    }
  }

  /**
   * Transforms profile data for database storage
   */
  private transformProfileForDB(profile: UserProfile): any {
    return {
      id: profile.id,
      email: profile.email,
      username: profile.username,
      full_name: profile.fullName,
      profile_type: profile.profileType,
      status: profile.status,
      roles: profile.roles,
      verification_status: profile.verificationStatus,
      kyc_verified: profile.kycVerified,
      email_verified: profile.emailVerified,
      phone_verified: profile.phoneVerified,
      avatar_url: profile.avatarUrl,
      cover_image_url: profile.coverImageUrl,
      bio: profile.bio,
      tagline: profile.tagline,
      location: profile.location,
      birth_date: profile.birthDate,
      gender: profile.gender,
      website: profile.website,
      social_links: profile.socialLinks,
      level: profile.level,
      experience_points: profile.experiencePoints,
      badges: profile.badges,
      achievements: profile.achievements,
      last_active_date: profile.lastActiveDate,
      days_active_streak: profile.daysActiveStreak,
      total_days_active: profile.totalDaysActive,
      profile_completeness: profile.profileCompleteness,
      completed_steps: profile.completedSteps,
      settings: profile.settings,
      metadata: profile.metadata,
      cards_created: profile.stats.cardsCreated,
      cards_collected: profile.stats.cardsCollected,
      total_likes: profile.stats.totalLikes,
      total_views: profile.stats.totalViews,
      total_sales: profile.stats.totalSales,
      total_revenue: profile.stats.totalRevenue,
      total_followers: profile.stats.followersCount,
      total_following: profile.stats.followingCount,
      average_rating: profile.stats.averageRating,
      rating_count: profile.stats.ratingCount,
      creator_profile: profile.creatorProfile,
      business_profile: profile.businessProfile,
      stripe_customer_id: profile.stripeCustomerId,
      stripe_connect_account_id: profile.stripeConnectAccountId,
      subscription_tier: profile.subscriptionTier,
      subscription_expires_at: profile.subscriptionExpiresAt,
      created_at: profile.createdAt,
      updated_at: profile.updatedAt
    };
  }

  /**
   * Transforms database data to profile type
   */
  private transformProfileFromDB(data: any): UserProfile {
    return {
      id: data.id,
      email: data.email,
      username: data.username,
      fullName: data.full_name,
      profileType: data.profile_type,
      status: data.status,
      roles: data.roles || [UserRole.USER],
      verificationStatus: data.verification_status,
      kycVerified: data.kyc_verified,
      emailVerified: data.email_verified,
      phoneVerified: data.phone_verified || false,
      avatarUrl: data.avatar_url,
      coverImageUrl: data.cover_image_url,
      bio: data.bio,
      tagline: data.tagline,
      location: data.location,
      birthDate: data.birth_date,
      gender: data.gender,
      website: data.website,
      socialLinks: data.social_links,
      level: data.level,
      experiencePoints: data.experience_points,
      badges: data.badges || [],
      achievements: data.achievements || [],
      lastActiveDate: data.last_active_date,
      daysActiveStreak: data.days_active_streak,
      totalDaysActive: data.total_days_active || 0,
      profileCompleteness: data.profile_completeness,
      completedSteps: data.completed_steps || [],
      settings: data.settings || {},
      metadata: data.metadata || {},
      stats: {
        cardsCreated: data.cards_created || 0,
        cardsCollected: data.cards_collected || 0,
        totalLikes: data.total_likes || 0,
        totalViews: data.total_views || 0,
        totalSales: data.total_sales || 0,
        totalRevenue: data.total_revenue || 0,
        followersCount: data.total_followers || 0,
        followingCount: data.total_following || 0,
        averageRating: data.average_rating || 0,
        ratingCount: data.rating_count || 0
      },
      creatorProfile: data.creator_profile,
      businessProfile: data.business_profile,
      stripeCustomerId: data.stripe_customer_id,
      stripeConnectAccountId: data.stripe_connect_account_id,
      subscriptionTier: data.subscription_tier || 'free',
      subscriptionExpiresAt: data.subscription_expires_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  /**
   * Cache profile with TTL
   */
  private cacheProfile(profile: UserProfile): void {
    this.profileCache.set(profile.id, {
      profile,
      timestamp: Date.now()
    });
  }

  /**
   * Get cached profile if valid
   */
  private getCachedProfile(userId: string): UserProfile | null {
    const cached = this.profileCache.get(userId);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.profileCache.delete(userId);
      return null;
    }

    return cached.profile;
  }

  /**
   * Clear cache for a user
   */
  clearCache(userId?: string): void {
    if (userId) {
      this.profileCache.delete(userId);
    } else {
      this.profileCache.clear();
    }
  }
}

// Export singleton instance
export const profileService = new ProfileService();