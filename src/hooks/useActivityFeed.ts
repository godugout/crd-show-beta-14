import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/providers/AuthProvider';

interface ActivityItem {
  id: string;
  type: 'card_created' | 'user_followed' | 'collection_created';
  user: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  data: any;
  created_at: string;
}

export const useActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchActivityFeed();
    }
  }, [user]);

  const fetchActivityFeed = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get activities from users the current user follows
      const { data: followingUsers } = await supabase
        .from('user_relationships')
        .select('following_id')
        .eq('follower_id', user.id)
        .eq('relationship_type', 'follow');

      const followingIds = followingUsers?.map(f => f.following_id) || [];

      if (followingIds.length === 0) {
        // If not following anyone, show trending content
        await fetchTrendingContent();
        return;
      }

      // Fetch recent activities from followed users
      const { data: activitiesData } = await supabase
        .from('social_activities')
        .select(`
          id,
          activity_type,
          target_id,
          target_type,
          activity_timestamp,
          metadata,
          user_id
        `)
        .in('user_id', followingIds)
        .order('activity_timestamp', { ascending: false })
        .limit(20);

      if (activitiesData) {
        // Get user profiles for the activities
        const userIds = [...new Set(activitiesData.map(a => a.user_id))];
        const { data: userProfiles } = await supabase
          .from('user_profiles')
          .select('id, username, avatar_url')
          .in('id', userIds);

        const userProfilesMap = new Map(
          userProfiles?.map(profile => [profile.id, profile]) || []
        );

        const formattedActivities = activitiesData
          .map(activity => {
            const userProfile = userProfilesMap.get(activity.user_id);
            if (!userProfile) return null;

            return {
              id: activity.id,
              type: activity.activity_type as ActivityItem['type'],
              user: {
                id: userProfile.id,
                username: userProfile.username,
                avatar_url: userProfile.avatar_url
              },
              data: {
                target_id: activity.target_id,
                target_type: activity.target_type,
                metadata: activity.metadata
              },
              created_at: activity.activity_timestamp
            };
          })
          .filter(Boolean) as ActivityItem[];

        setActivities(formattedActivities);
      }
    } catch (error) {
      console.error('Error fetching activity feed:', error);
      // Fallback to trending content
      await fetchTrendingContent();
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingContent = async () => {
    try {
      // Get recent popular cards as trending content
      const { data: trendingCards } = await supabase
        .from('cards')
        .select(`
          id,
          title,
          image_url,
          creator_id,
          created_at,
          favorite_count
        `)
        .eq('is_public', true)
        .order('favorite_count', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(10);

      if (trendingCards) {
        // Get user profiles for the card creators
        const creatorIds = [...new Set(trendingCards.map(card => card.creator_id))];
        const { data: userProfiles } = await supabase
          .from('user_profiles')
          .select('id, username, avatar_url')
          .in('id', creatorIds);

        const userProfilesMap = new Map(
          userProfiles?.map(profile => [profile.id, profile]) || []
        );

        const trendingActivities = trendingCards
          .map(card => {
            const userProfile = userProfilesMap.get(card.creator_id);
            if (!userProfile) return null;

            return {
              id: `trending-${card.id}`,
              type: 'card_created' as const,
              user: {
                id: userProfile.id,
                username: userProfile.username,
                avatar_url: userProfile.avatar_url
              },
              data: {
                target_id: card.id,
                target_type: 'card',
                title: card.title,
                image_url: card.image_url,
                favorite_count: card.favorite_count
              },
              created_at: card.created_at
            };
          })
          .filter(Boolean) as ActivityItem[];

        setActivities(trendingActivities);
      }
    } catch (error) {
      console.error('Error fetching trending content:', error);
    }
  };

  return {
    activities,
    loading,
    refetch: fetchActivityFeed
  };
};