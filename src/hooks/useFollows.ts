import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/providers/AuthProvider';

interface FollowStats {
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export const useFollows = (targetUserId?: string) => {
  const [stats, setStats] = useState<FollowStats>({
    followersCount: 0,
    followingCount: 0,
    isFollowing: false
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (targetUserId) {
      fetchFollowStats();
    }
  }, [targetUserId, user]);

  const fetchFollowStats = async () => {
    if (!targetUserId) return;

    try {
      // Get followers count
      const { count: followersCount } = await supabase
        .from('user_relationships')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', targetUserId)
        .eq('relationship_type', 'follow');

      // Get following count
      const { count: followingCount } = await supabase
        .from('user_relationships')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', targetUserId)
        .eq('relationship_type', 'follow');

      // Check if current user follows target user
      let isFollowing = false;
      if (user && user.id !== targetUserId) {
        const { data: followData } = await supabase
          .from('user_relationships')
          .select('id')
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId)
          .eq('relationship_type', 'follow')
          .maybeSingle();

        isFollowing = !!followData;
      }

      setStats({
        followersCount: followersCount || 0,
        followingCount: followingCount || 0,
        isFollowing
      });
    } catch (error) {
      console.error('Error fetching follow stats:', error);
    }
  };

  const toggleFollow = async () => {
    if (!user || !targetUserId || user.id === targetUserId || loading) return;

    setLoading(true);
    try {
      if (stats.isFollowing) {
        // Unfollow
        await supabase
          .from('user_relationships')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId)
          .eq('relationship_type', 'follow');

        setStats(prev => ({
          ...prev,
          followersCount: Math.max(0, prev.followersCount - 1),
          isFollowing: false
        }));
      } else {
        // Follow
        await supabase
          .from('user_relationships')
          .insert({
            follower_id: user.id,
            following_id: targetUserId,
            relationship_type: 'follow'
          });

        setStats(prev => ({
          ...prev,
          followersCount: prev.followersCount + 1,
          isFollowing: true
        }));
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    ...stats,
    toggleFollow,
    loading,
    refetch: fetchFollowStats
  };
};