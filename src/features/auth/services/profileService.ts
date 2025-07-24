
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface ProfileData {
  username?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  website?: string;
  location?: string;
  preferences?: Record<string, any>;
}

export class ProfileService {
  async ensureProfile(user: User) {
    try {
      console.log('🔧 Ensuring profile exists for user:', user.id);
      
      // Check if profile already exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('🔧 Error fetching profile:', fetchError);
        throw fetchError;
      }

      if (existingProfile) {
        console.log('🔧 Profile already exists');
        return existingProfile;
      }

      // Create new profile
      const profileData = {
        id: user.id,
        username: user.user_metadata?.username || user.email?.split('@')[0] || '',
        full_name: user.user_metadata?.full_name || '',
        avatar_url: user.user_metadata?.avatar_url || '',
        bio: user.user_metadata?.bio || '',
        preferences: user.user_metadata?.preferences || {}
      };

      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (createError) {
        console.error('🔧 Error creating profile:', createError);
        throw createError;
      }

      console.log('🔧 Profile created successfully');
      return newProfile;
    } catch (error) {
      console.error('🔧 Profile service error:', error);
      throw error;
    }
  }

  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Profile service error:', error);
      return null;
    }
  }

  async updateProfile(userId: string, updates: ProfileData) {
    try {
      console.log('🔧 Updating profile for user:', userId, updates);
      
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
        console.error('🔧 Error updating profile:', error);
        throw error;
      }

      console.log('🔧 Profile updated successfully');
      return data;
    } catch (error) {
      console.error('🔧 Profile update error:', error);
      throw error;
    }
  }

  async deleteProfile(userId: string) {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting profile:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Profile deletion error:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();
