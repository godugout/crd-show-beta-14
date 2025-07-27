import { supabase } from '@/integrations/supabase/client';
import { secureAuthService } from './secureAuthService';

export interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  username?: string;
  metadata?: Record<string, any>;
}

export interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  team_id: string | null;
  creator_verified: boolean;
  creator_badge: string | null;
  specialties: string[];
  portfolio_links: Record<string, any>;
  bio_extended: string | null;
}

export class UserManagementService {
  async createUser(request: CreateUserRequest): Promise<{ success: boolean; error?: string; user?: any; profile?: UserProfile }> {
    try {
      // First, create the auth user
      const authResult = await secureAuthService.signUp(request.email, request.password, {
        full_name: request.fullName,
        username: request.username,
        ...request.metadata
      });

      if (!authResult.success) {
        return {
          success: false,
          error: authResult.error
        };
      }

      // Create profile in profiles table
      const profileData = {
        id: authResult.user?.id,
        username: request.username || request.email.split('@')[0],
        full_name: request.fullName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        creator_verified: false,
        creator_badge: null,
        specialties: [],
        portfolio_links: {},
        bio_extended: null
      };

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't fail the entire operation if profile creation fails
        // The user can still sign in and we can retry profile creation
      }

      return {
        success: true,
        user: authResult.user,
        profile: profile || null
      };
    } catch (err) {
      console.error('User creation error:', err);
      return {
        success: false,
        error: 'An unexpected error occurred while creating your account.'
      };
    }
  }

  async getUserProfile(userId: string): Promise<{ success: boolean; error?: string; profile?: UserProfile }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        profile: data
      };
    } catch (err) {
      console.error('Get profile error:', err);
      return {
        success: false,
        error: 'An unexpected error occurred while retrieving your profile.'
      };
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string; profile?: UserProfile }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        profile: data
      };
    } catch (err) {
      console.error('Update profile error:', err);
      return {
        success: false,
        error: 'An unexpected error occurred while updating your profile.'
      };
    }
  }

  async ensureUserProfile(userId: string, email: string, fullName?: string): Promise<{ success: boolean; error?: string; profile?: UserProfile }> {
    try {
      // First, try to get existing profile
      const existingProfile = await this.getUserProfile(userId);
      
      if (existingProfile.success && existingProfile.profile) {
        return existingProfile;
      }

      // Create profile if it doesn't exist
      const profileData = {
        id: userId,
        username: email.split('@')[0],
        full_name: fullName || email.split('@')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        creator_verified: false,
        creator_badge: null,
        specialties: [],
        portfolio_links: {},
        bio_extended: null
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        profile: data
      };
    } catch (err) {
      console.error('Ensure profile error:', err);
      return {
        success: false,
        error: 'An unexpected error occurred while ensuring your profile exists.'
      };
    }
  }

  async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Delete profile first
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('Profile deletion error:', profileError);
      }

      // Delete auth user (this requires admin privileges)
      // For now, we'll just sign out the user
      await secureAuthService.signOut();

      return {
        success: true
      };
    } catch (err) {
      console.error('Delete user error:', err);
      return {
        success: false,
        error: 'An unexpected error occurred while deleting your account.'
      };
    }
  }
}

// Export singleton instance
export const userManagementService = new UserManagementService(); 