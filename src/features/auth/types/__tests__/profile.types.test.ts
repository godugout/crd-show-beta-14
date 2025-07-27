/**
 * Profile Types Tests
 * 
 * Tests for profile type definitions, validations, and utilities
 */

import { describe, it, expect } from 'vitest';
import {
  UserProfile,
  ProfileType,
  UserRole,
  ProfileStatus,
  VerificationStatus,
  BadgeType,
  UserProfileSchema,
  isCreatorProfile,
  isBusinessProfile,
  hasRole,
  isAdmin,
  isModerator,
  isVerified,
  calculateProfileCompleteness
} from '../profile.types';
import {
  createNewUserProfile,
  migrateProfileData,
  validateProfile,
  sanitizeProfileForPublic,
  calculateExperiencePoints,
  calculateLevel,
  getXPForNextLevel
} from '../../utils/profile.utils';

describe('Profile Types', () => {
  describe('UserProfileSchema', () => {
    it('should validate a complete profile', () => {
      const profile = createNewUserProfile({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        username: 'testuser',
        fullName: 'Test User'
      });

      const result = UserProfileSchema.safeParse(profile);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const profile = createNewUserProfile({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'invalid-email',
        username: 'testuser',
        fullName: 'Test User'
      });

      const result = UserProfileSchema.safeParse(profile);
      expect(result.success).toBe(false);
    });

    it('should reject invalid username', () => {
      const profile = createNewUserProfile({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        username: 'test user', // Contains space
        fullName: 'Test User'
      });

      const result = UserProfileSchema.safeParse(profile);
      expect(result.success).toBe(false);
    });
  });

  describe('Type Guards', () => {
    const baseProfile = createNewUserProfile({
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      username: 'testuser',
      fullName: 'Test User'
    });

    it('should identify creator profile', () => {
      const creatorProfile: UserProfile = {
        ...baseProfile,
        profileType: ProfileType.CREATOR,
        creatorProfile: {
          specialties: ['photography'],
          yearsExperience: 5,
          featuredWorks: [],
          availability: 'available',
          responseTime: 'within 24 hours'
        }
      };

      expect(isCreatorProfile(creatorProfile)).toBe(true);
      expect(isBusinessProfile(creatorProfile)).toBe(false);
    });

    it('should identify business profile', () => {
      const businessProfile: UserProfile = {
        ...baseProfile,
        profileType: ProfileType.BUSINESS,
        businessProfile: {
          businessName: 'Test Business',
          businessType: 'LLC',
          contactEmail: 'business@example.com'
        }
      };

      expect(isBusinessProfile(businessProfile)).toBe(true);
      expect(isCreatorProfile(businessProfile)).toBe(false);
    });

    it('should check user roles', () => {
      const adminProfile: UserProfile = {
        ...baseProfile,
        roles: [UserRole.USER, UserRole.ADMIN]
      };

      expect(hasRole(adminProfile, UserRole.ADMIN)).toBe(true);
      expect(isAdmin(adminProfile)).toBe(true);
      expect(isModerator(adminProfile)).toBe(false);
    });

    it('should check verification status', () => {
      const verifiedProfile: UserProfile = {
        ...baseProfile,
        verificationStatus: VerificationStatus.EMAIL_VERIFIED
      };

      expect(isVerified(verifiedProfile)).toBe(true);
    });
  });

  describe('Profile Completeness', () => {
    it('should calculate basic profile completeness', () => {
      const profile = createNewUserProfile({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        username: 'testuser',
        fullName: 'Test User'
      });

      const completeness = calculateProfileCompleteness(profile);
      expect(completeness).toBe(20); // Only basic info
    });

    it('should increase completeness with more fields', () => {
      const profile: UserProfile = {
        ...createNewUserProfile({
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'test@example.com',
          username: 'testuser',
          fullName: 'Test User'
        }),
        bio: 'Test bio',
        avatarUrl: 'https://example.com/avatar.jpg',
        location: 'New York',
        website: 'https://example.com'
      };

      const completeness = calculateProfileCompleteness(profile);
      expect(completeness).toBeGreaterThan(20);
    });
  });

  describe('Profile Migration', () => {
    it('should migrate old profile format', () => {
      const oldProfile = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        username: 'testuser',
        full_name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
        is_creator: true,
        creator_verified: true,
        experience_points: 500,
        cards_created_count: 10,
        total_followers: 100
      };

      const newProfile = migrateProfileData(oldProfile);
      
      expect(newProfile.fullName).toBe('Test User');
      expect(newProfile.avatarUrl).toBe('https://example.com/avatar.jpg');
      expect(newProfile.profileType).toBe(ProfileType.CREATOR);
      expect(newProfile.roles).toContain(UserRole.CREATOR);
      expect(newProfile.badges).toContain(BadgeType.VERIFIED_CREATOR);
      expect(newProfile.experiencePoints).toBe(500);
      expect(newProfile.stats.cardsCreated).toBe(10);
      expect(newProfile.stats.followersCount).toBe(100);
    });
  });

  describe('Profile Utilities', () => {
    it('should sanitize profile for public display', () => {
      const profile = createNewUserProfile({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        username: 'testuser',
        fullName: 'Test User'
      });

      const sanitized = sanitizeProfileForPublic(profile);
      
      expect(sanitized.email).toBeUndefined();
      expect(sanitized.metadata).toBeUndefined();
      expect(sanitized.stripeCustomerId).toBeUndefined();
    });

    it('should calculate experience points correctly', () => {
      expect(calculateExperiencePoints('profile_complete')).toBe(100);
      expect(calculateExperiencePoints('first_card')).toBe(50);
      expect(calculateExperiencePoints('card_created')).toBe(10);
      expect(calculateExperiencePoints('unknown_action')).toBe(0);
    });

    it('should calculate level based on XP', () => {
      expect(calculateLevel(0)).toBe(1);
      expect(calculateLevel(99)).toBe(1);
      expect(calculateLevel(100)).toBe(2);
      expect(calculateLevel(250)).toBe(3);
      expect(calculateLevel(450)).toBe(4);
    });

    it('should calculate XP needed for next level', () => {
      expect(getXPForNextLevel(1, 0)).toBe(100);
      expect(getXPForNextLevel(1, 50)).toBe(50);
      expect(getXPForNextLevel(2, 100)).toBe(150);
      expect(getXPForNextLevel(3, 250)).toBe(200);
    });
  });

  describe('Profile Validation', () => {
    it('should validate correct profile', () => {
      const profile = createNewUserProfile({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        username: 'testuser',
        fullName: 'Test User'
      });

      const { valid, errors } = validateProfile(profile);
      expect(valid).toBe(true);
      expect(errors).toHaveLength(0);
    });

    it('should catch validation errors', () => {
      const invalidProfile = {
        id: 'not-a-uuid',
        email: 'invalid-email',
        username: 'a', // Too short
        fullName: ''
      };

      const { valid, errors } = validateProfile(invalidProfile);
      expect(valid).toBe(false);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});