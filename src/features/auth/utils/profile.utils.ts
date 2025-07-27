/**
 * Profile Utility Functions
 * 
 * Helper functions for profile operations, validations, and transformations
 */

import { 
  UserProfile, 
  ProfileType, 
  UserRole, 
  ProfileStatus,
  VerificationStatus,
  BadgeType,
  ProfileSettings,
  ProfileMetadata,
  UserProfileSchema,
  calculateProfileCompleteness
} from '../types/profile.types';

/**
 * Creates default profile settings
 */
export function createDefaultProfileSettings(): ProfileSettings {
  return {
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showLocation: true,
      showStats: true,
      allowMessages: 'following'
    },
    display: {
      showBadges: true,
      showAchievements: true,
      showCollections: true,
      showActivity: true
    },
    notifications: {
      emailDigest: 'weekly',
      newFollower: true,
      newComment: true,
      newLike: true,
      newPurchase: true,
      systemUpdates: true
    }
  };
}

/**
 * Creates default profile metadata
 */
export function createDefaultProfileMetadata(): ProfileMetadata {
  return {
    loginCount: 0,
    preferredLanguage: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    theme: 'system',
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false
  };
}

/**
 * Creates a new user profile with defaults
 */
export function createNewUserProfile(data: {
  id: string;
  email: string;
  username: string;
  fullName: string;
  profileType?: ProfileType;
}): UserProfile {
  const now = new Date().toISOString();
  
  return {
    id: data.id,
    email: data.email,
    username: data.username,
    fullName: data.fullName,
    
    profileType: data.profileType || ProfileType.PERSONAL,
    status: ProfileStatus.ACTIVE,
    roles: [UserRole.USER],
    
    verificationStatus: VerificationStatus.UNVERIFIED,
    kycVerified: false,
    emailVerified: false,
    phoneVerified: false,
    
    level: 1,
    experiencePoints: 0,
    badges: [],
    achievements: [],
    
    lastActiveDate: now,
    daysActiveStreak: 0,
    totalDaysActive: 0,
    
    profileCompleteness: 20, // Basic info only
    completedSteps: ['basic_info'],
    
    settings: createDefaultProfileSettings(),
    metadata: createDefaultProfileMetadata(),
    
    stats: {
      cardsCreated: 0,
      cardsCollected: 0,
      totalLikes: 0,
      totalViews: 0,
      totalSales: 0,
      totalRevenue: 0,
      followersCount: 0,
      followingCount: 0,
      averageRating: 0,
      ratingCount: 0
    },
    
    subscriptionTier: 'free',
    
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Migrates old profile format to new format
 */
export function migrateProfileData(oldProfile: any): UserProfile {
  const now = new Date().toISOString();
  
  // Determine profile type based on old data
  let profileType = ProfileType.PERSONAL;
  if (oldProfile.is_creator || oldProfile.creator_verified) {
    profileType = ProfileType.CREATOR;
  }
  
  // Map old fields to new structure
  const newProfile: UserProfile = {
    id: oldProfile.id,
    email: oldProfile.email || '',
    username: oldProfile.username || oldProfile.email?.split('@')[0] || 'user',
    fullName: oldProfile.full_name || oldProfile.fullName || '',
    
    profileType,
    status: ProfileStatus.ACTIVE,
    roles: [UserRole.USER],
    
    verificationStatus: oldProfile.email_verified ? VerificationStatus.EMAIL_VERIFIED : VerificationStatus.UNVERIFIED,
    kycVerified: oldProfile.kyc_verified || false,
    emailVerified: oldProfile.email_verified || false,
    phoneVerified: false,
    
    avatarUrl: oldProfile.avatar_url || oldProfile.avatarUrl,
    coverImageUrl: oldProfile.cover_image_url || oldProfile.coverImageUrl,
    bio: oldProfile.bio,
    
    location: oldProfile.location,
    website: oldProfile.website,
    socialLinks: oldProfile.social_links || {},
    
    level: oldProfile.level || 1,
    experiencePoints: oldProfile.experience_points || 0,
    badges: [],
    achievements: [],
    
    lastActiveDate: oldProfile.last_active_date || now,
    daysActiveStreak: oldProfile.days_active_streak || 0,
    totalDaysActive: oldProfile.total_days_active || 0,
    
    profileCompleteness: 0, // Will be calculated
    completedSteps: [],
    
    settings: oldProfile.privacy_settings ? 
      parseOldSettings(oldProfile.privacy_settings) : 
      createDefaultProfileSettings(),
    
    metadata: createDefaultProfileMetadata(),
    
    stats: {
      cardsCreated: oldProfile.cards_created_count || 0,
      cardsCollected: oldProfile.cards_collected || 0,
      totalLikes: oldProfile.total_likes || 0,
      totalViews: oldProfile.total_views || 0,
      totalSales: oldProfile.total_sales || 0,
      totalRevenue: oldProfile.total_revenue || 0,
      followersCount: oldProfile.total_followers || 0,
      followingCount: oldProfile.total_following || 0,
      averageRating: oldProfile.average_rating || 0,
      ratingCount: oldProfile.rating_count || 0
    },
    
    stripeCustomerId: oldProfile.stripe_customer_id,
    stripeConnectAccountId: oldProfile.stripe_connect_account_id,
    subscriptionTier: oldProfile.subscription_tier || 'free',
    
    createdAt: oldProfile.created_at || now,
    updatedAt: oldProfile.updated_at || now
  };
  
  // Add creator-specific data if applicable
  if (profileType === ProfileType.CREATOR) {
    newProfile.creatorProfile = {
      specialties: oldProfile.specialties || [],
      yearsExperience: 0,
      featuredWorks: [],
      availability: 'available',
      responseTime: 'within 48 hours'
    };
    
    // Add creator role
    newProfile.roles.push(UserRole.CREATOR);
    
    // Add creator badge if verified
    if (oldProfile.creator_verified) {
      newProfile.badges.push(BadgeType.VERIFIED_CREATOR);
      newProfile.verificationStatus = VerificationStatus.CREATOR_VERIFIED;
    }
  }
  
  // Calculate profile completeness
  newProfile.profileCompleteness = calculateProfileCompleteness(newProfile);
  
  // Update completed steps based on what's filled
  newProfile.completedSteps = getCompletedSteps(newProfile);
  
  return newProfile;
}

/**
 * Parses old settings format to new format
 */
function parseOldSettings(oldSettings: any): ProfileSettings {
  try {
    const parsed = typeof oldSettings === 'string' ? JSON.parse(oldSettings) : oldSettings;
    
    return {
      privacy: parsed.privacy || createDefaultProfileSettings().privacy,
      display: parsed.display || createDefaultProfileSettings().display,
      notifications: parsed.notifications || createDefaultProfileSettings().notifications
    };
  } catch {
    return createDefaultProfileSettings();
  }
}

/**
 * Gets completed profile steps
 */
export function getCompletedSteps(profile: UserProfile): string[] {
  const steps: string[] = ['basic_info']; // Always completed if profile exists
  
  if (profile.avatarUrl) steps.push('avatar');
  if (profile.bio) steps.push('bio');
  if (profile.location || profile.website) steps.push('details');
  if (profile.socialLinks && Object.values(profile.socialLinks).some(v => !!v)) steps.push('social');
  if (profile.emailVerified) steps.push('email_verification');
  if (profile.phoneVerified) steps.push('phone_verification');
  
  if (profile.profileType === ProfileType.CREATOR && profile.creatorProfile) {
    if (profile.creatorProfile.specialties.length > 0) steps.push('creator_specialties');
    if (profile.creatorProfile.portfolioUrl) steps.push('creator_portfolio');
  }
  
  if (profile.profileType === ProfileType.BUSINESS && profile.businessProfile) {
    if (profile.businessProfile.description) steps.push('business_description');
    if (profile.businessProfile.address) steps.push('business_address');
  }
  
  return steps;
}

/**
 * Validates profile data
 */
export function validateProfile(profile: any): { valid: boolean; errors: string[] } {
  try {
    UserProfileSchema.parse(profile);
    return { valid: true, errors: [] };
  } catch (error: any) {
    const errors = error.errors?.map((e: any) => `${e.path.join('.')}: ${e.message}`) || ['Invalid profile data'];
    return { valid: false, errors };
  }
}

/**
 * Sanitizes profile data for public display
 */
export function sanitizeProfileForPublic(profile: UserProfile): Partial<UserProfile> {
  const { 
    email,
    metadata,
    settings,
    stripeCustomerId,
    stripeConnectAccountId,
    ...publicData 
  } = profile;
  
  // Remove email if privacy settings say so
  const sanitized: any = { ...publicData };
  
  if (!profile.settings.privacy.showEmail) {
    delete sanitized.email;
  }
  
  if (!profile.settings.privacy.showLocation) {
    delete sanitized.location;
  }
  
  if (!profile.settings.privacy.showStats) {
    delete sanitized.stats;
  }
  
  return sanitized;
}

/**
 * Calculates experience points for an action
 */
export function calculateExperiencePoints(action: string): number {
  const pointsMap: Record<string, number> = {
    'profile_complete': 100,
    'first_card': 50,
    'card_created': 10,
    'card_liked': 5,
    'card_collected': 15,
    'follower_gained': 10,
    'daily_login': 5,
    'streak_7_days': 50,
    'streak_30_days': 200,
    'first_sale': 100,
    'sale_made': 20
  };
  
  return pointsMap[action] || 0;
}

/**
 * Determines user level based on experience points
 */
export function calculateLevel(experiencePoints: number): number {
  // Level progression: 100 XP for level 2, then increases by 50 each level
  let level = 1;
  let requiredXP = 100;
  let totalRequired = 0;
  
  while (experiencePoints >= totalRequired + requiredXP) {
    totalRequired += requiredXP;
    level++;
    requiredXP += 50;
  }
  
  return level;
}

/**
 * Gets the experience points needed for next level
 */
export function getXPForNextLevel(currentLevel: number, currentXP: number): number {
  let totalRequired = 0;
  let requiredXP = 100;
  
  for (let i = 1; i < currentLevel; i++) {
    totalRequired += requiredXP;
    requiredXP += 50;
  }
  
  const nextLevelTotal = totalRequired + requiredXP;
  return Math.max(0, nextLevelTotal - currentXP);
}