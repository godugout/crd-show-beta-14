
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { profileService, type ProfileData } from '@/features/auth/services/profileService';

export const useProfile = (userId?: string) => {
  const queryClient = useQueryClient();
  
  // Get user profile from database
  const {
    data: profile,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => profileService.getProfile(userId!),
    enabled: !!userId,
    retry: 1
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: ProfileData) => {
      if (!userId) throw new Error('User ID is required');
      return await profileService.updateProfile(userId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update profile: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending
  };
};
