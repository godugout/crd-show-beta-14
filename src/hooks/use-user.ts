
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { useProfile } from '@/hooks/useProfile';

export const useUser = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading, error } = useProfile(authUser?.id);

  // Combine auth user with profile data
  const user = authUser && profile ? {
    id: authUser.id,
    email: authUser.email || '',
    username: profile.username || authUser.email?.split('@')[0] || '',
    full_name: profile.full_name || '',
    avatar_url: profile.avatar_url || '',
    bio: profile.bio || '',
    team_id: '',
    createdAt: profile.created_at || new Date().toISOString(),
    preferences: profile.preferences || null,
    profileImage: profile.avatar_url || '',
  } : null;

  return { 
    user, 
    loading: authLoading || profileLoading, 
    error: error ? new Error(error.message || 'Profile error') : null 
  };
};
