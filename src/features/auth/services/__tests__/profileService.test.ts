/**
 * Profile Service Tests
 * 
 * Tests for the enhanced profile service
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { profileService } from '../profileService';
import { ProfileType, UserRole, ProfileStatus, BadgeType } from '../../types/profile.types';
import { createNewUserProfile } from '../../utils/profile.utils';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null }))
        })),
        neq: vi.fn(() => ({
          range: vi.fn(() => Promise.resolve({ data: [], error: null, count: 0 }))
        })),
        or: vi.fn(() => ({
          eq: vi.fn(() => ({
            neq: vi.fn(() => ({
              range: vi.fn(() => Promise.resolve({ data: [], error: null, count: 0 }))
            }))
          }))
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: null, error: null }))
          }))
        }))
      })),
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      }))
    }))
  }
}));

describe('ProfileService', () => {
  beforeEach(() => {
    profileService.clearCache();
    vi.clearAllMocks();
  });

  describe('createProfile', () => {
    it('should create a new profile', async () => {
      const mockProfile = createNewUserProfile({
        id: 'test-id',
        email: 'test@example.com',
        username: 'testuser',
        fullName: 'Test User'
      });

      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ 
              data: profileService['transformProfileForDB'](mockProfile), 
              error: null 
            }))
          }))
        }))
      } as any);

      const result = await profileService.createProfile({
        id: 'test-id',
        email: 'test@example.com',
        username: 'testuser',
        fullName: 'Test User'
      } as any);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.email).toBe('test@example.com');
      expect(result.data?.username).toBe('testuser');
    });

    it('should fail if profile already exists', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Mock existing profile
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ 
              data: { id: 'test-id' }, 
              error: null 
            }))
          }))
        }))
      } as any);

      const result = await profileService.createProfile({
        id: 'test-id',
        email: 'test@example.com',
        username: 'testuser',
        fullName: 'Test User'
      } as any);

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('already exists');
    });
  });

  describe('getProfile', () => {
    it('should return cached profile if available', async () => {
      const mockProfile = createNewUserProfile({
        id: 'test-id',
        email: 'test@example.com',
        username: 'testuser',
        fullName: 'Test User'
      });

      // Cache the profile
      profileService['cacheProfile'](mockProfile);

      const result = await profileService.getProfile('test-id');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProfile);
      
      // Verify no database call was made
      const { supabase } = await import('@/integrations/supabase/client');
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should fetch from database if not cached', async () => {
      const mockProfile = createNewUserProfile({
        id: 'test-id',
        email: 'test@example.com',
        username: 'testuser',
        fullName: 'Test User'
      });

      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ 
              data: profileService['transformProfileForDB'](mockProfile), 
              error: null 
            }))
          }))
        }))
      } as any);

      const result = await profileService.getProfile('test-id');

      expect(result.success).toBe(true);
      expect(result.data?.id).toBe('test-id');
      expect(supabase.from).toHaveBeenCalledWith('user_profiles');
    });
  });

  describe('updateProfile', () => {
    it('should update profile and recalculate completeness', async () => {
      const mockProfile = createNewUserProfile({
        id: 'test-id',
        email: 'test@example.com',
        username: 'testuser',
        fullName: 'Test User'
      });

      const { supabase } = await import('@/integrations/supabase/client');
      
      // Mock get profile
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ 
              data: profileService['transformProfileForDB'](mockProfile), 
              error: null 
            }))
          }))
        }))
      } as any);

      // Mock update
      const updatedData = {
        ...profileService['transformProfileForDB'](mockProfile),
        bio: 'Updated bio',
        avatar_url: 'https://example.com/avatar.jpg'
      };

      vi.mocked(supabase.from).mockReturnValueOnce({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ 
                data: updatedData, 
                error: null 
              }))
            }))
          }))
        }))
      } as any);

      const result = await profileService.updateProfile('test-id', {
        bio: 'Updated bio',
        avatarUrl: 'https://example.com/avatar.jpg'
      });

      expect(result.success).toBe(true);
      expect(result.data?.bio).toBe('Updated bio');
      expect(result.data?.profileCompleteness).toBeGreaterThan(20);
    });
  });

  describe('Role Management', () => {
    it('should add role to user', async () => {
      const mockProfile = createNewUserProfile({
        id: 'test-id',
        email: 'test@example.com',
        username: 'testuser',
        fullName: 'Test User'
      });

      // Cache profile
      profileService['cacheProfile'](mockProfile);

      const { supabase } = await import('@/integrations/supabase/client');
      
      // Mock update
      vi.mocked(supabase.from).mockReturnValue({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ 
                data: {
                  ...profileService['transformProfileForDB'](mockProfile),
                  roles: [UserRole.USER, UserRole.CREATOR]
                }, 
                error: null 
              }))
            }))
          }))
        }))
      } as any);

      const result = await profileService.addRole('test-id', UserRole.CREATOR);

      expect(result.success).toBe(true);
      expect(result.data?.roles).toContain(UserRole.CREATOR);
    });

    it('should not duplicate existing role', async () => {
      const mockProfile = createNewUserProfile({
        id: 'test-id',
        email: 'test@example.com',
        username: 'testuser',
        fullName: 'Test User'
      });
      mockProfile.roles = [UserRole.USER, UserRole.CREATOR];

      // Cache profile
      profileService['cacheProfile'](mockProfile);

      const result = await profileService.addRole('test-id', UserRole.CREATOR);

      expect(result.success).toBe(true);
      expect(result.data?.roles.filter(r => r === UserRole.CREATOR)).toHaveLength(1);
    });
  });

  describe('Experience Points', () => {
    it('should add experience points and level up', async () => {
      const mockProfile = createNewUserProfile({
        id: 'test-id',
        email: 'test@example.com',
        username: 'testuser',
        fullName: 'Test User'
      });
      mockProfile.experiencePoints = 90;

      // Cache profile
      profileService['cacheProfile'](mockProfile);

      const { supabase } = await import('@/integrations/supabase/client');
      
      // Mock update
      vi.mocked(supabase.from).mockReturnValue({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ 
                data: {
                  ...profileService['transformProfileForDB'](mockProfile),
                  experience_points: 140,
                  level: 2,
                  achievements: ['level_2']
                }, 
                error: null 
              }))
            }))
          }))
        }))
      } as any);

      const result = await profileService.addExperiencePoints('test-id', 'first_card');

      expect(result.success).toBe(true);
      expect(result.data?.experiencePoints).toBe(140);
      expect(result.data?.level).toBe(2);
      expect(result.data?.achievements).toContain('level_2');
    });
  });

  describe('Profile Search', () => {
    it('should search profiles with filters', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const mockProfiles = [
        createNewUserProfile({
          id: 'user1',
          email: 'user1@example.com',
          username: 'user1',
          fullName: 'User One'
        }),
        createNewUserProfile({
          id: 'user2',
          email: 'user2@example.com',
          username: 'user2',
          fullName: 'User Two'
        })
      ];

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn(() => ({
          or: vi.fn(() => ({
            eq: vi.fn(() => ({
              neq: vi.fn(() => ({
                range: vi.fn(() => Promise.resolve({ 
                  data: mockProfiles.map(p => profileService['transformProfileForDB'](p)), 
                  error: null,
                  count: 2
                }))
              }))
            }))
          }))
        }))
      } as any);

      const result = await profileService.searchProfiles({
        query: 'user',
        profileType: ProfileType.PERSONAL,
        verified: true,
        limit: 10,
        offset: 0
      });

      expect(result.success).toBe(true);
      expect(result.data?.profiles).toHaveLength(2);
      expect(result.data?.total).toBe(2);
    });
  });

  describe('Cache Management', () => {
    it('should expire cached profiles after TTL', async () => {
      const mockProfile = createNewUserProfile({
        id: 'test-id',
        email: 'test@example.com',
        username: 'testuser',
        fullName: 'Test User'
      });

      // Cache with expired timestamp
      profileService['profileCache'].set('test-id', {
        profile: mockProfile,
        timestamp: Date.now() - (6 * 60 * 1000) // 6 minutes ago
      });

      const { supabase } = await import('@/integrations/supabase/client');
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ 
              data: profileService['transformProfileForDB'](mockProfile), 
              error: null 
            }))
          }))
        }))
      } as any);

      const result = await profileService.getProfile('test-id');

      expect(result.success).toBe(true);
      expect(supabase.from).toHaveBeenCalled(); // Should fetch from DB
    });

    it('should clear specific user cache', () => {
      const mockProfile = createNewUserProfile({
        id: 'test-id',
        email: 'test@example.com',
        username: 'testuser',
        fullName: 'Test User'
      });

      profileService['cacheProfile'](mockProfile);
      expect(profileService['profileCache'].size).toBe(1);

      profileService.clearCache('test-id');
      expect(profileService['profileCache'].size).toBe(0);
    });

    it('should clear all cache', () => {
      // Cache multiple profiles
      for (let i = 0; i < 3; i++) {
        const profile = createNewUserProfile({
          id: `test-id-${i}`,
          email: `test${i}@example.com`,
          username: `testuser${i}`,
          fullName: `Test User ${i}`
        });
        profileService['cacheProfile'](profile);
      }

      expect(profileService['profileCache'].size).toBe(3);

      profileService.clearCache();
      expect(profileService['profileCache'].size).toBe(0);
    });
  });
});