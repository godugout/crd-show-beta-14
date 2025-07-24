import React from 'react';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { Heart, User, Palette } from 'lucide-react';

export const ActivityFeed: React.FC = () => {
  const { activities, loading } = useActivityFeed();

  if (loading) {
    return (
      <div className="space-y-4">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-4 bg-crd-mediumGray/10 rounded-lg">
            <LoadingSkeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <LoadingSkeleton className="h-4 w-32 mb-2" />
              <LoadingSkeleton className="h-3 w-48" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-crd-mediumGray/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-crd-lightGray" />
        </div>
        <h3 className="text-crd-white font-medium mb-2">No activity yet</h3>
        <p className="text-crd-lightGray text-sm">
          Follow some creators to see their latest cards and activities here!
        </p>
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'card_created':
        return <Palette className="w-4 h-4 text-crd-green" />;
      case 'user_followed':
        return <User className="w-4 h-4 text-crd-blue" />;
      default:
        return <Heart className="w-4 h-4 text-crd-orange" />;
    }
  };

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case 'card_created':
        return `created a new card "${activity.data.title || 'Untitled'}"`;
      case 'user_followed':
        return 'started following someone new';
      case 'collection_created':
        return `created a new collection "${activity.data.title || 'Untitled'}"`;
      default:
        return 'had some activity';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-crd-white font-semibold text-lg mb-4">Recent Activity</h3>
      
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 p-4 bg-crd-mediumGray/10 rounded-lg hover:bg-crd-mediumGray/15 transition-colors">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            {activity.user.avatar_url ? (
              <img
                src={activity.user.avatar_url}
                alt={activity.user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-crd-mediumGray/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-crd-lightGray" />
              </div>
            )}
          </div>

          {/* Activity Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {getActivityIcon(activity.type)}
              <span className="text-crd-white font-medium">{activity.user.username}</span>
              <span className="text-crd-lightGray text-sm">
                {getActivityText(activity)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-crd-lightGray text-xs">
                {formatTimeAgo(activity.created_at)}
              </span>
              
              {activity.data.favorite_count && (
                <div className="flex items-center gap-1 text-xs text-crd-lightGray">
                  <Heart className="w-3 h-3" />
                  {activity.data.favorite_count}
                </div>
              )}
            </div>

            {/* Preview for card activities */}
            {activity.type === 'card_created' && activity.data.image_url && (
              <div className="mt-2">
                <img
                  src={activity.data.image_url}
                  alt={activity.data.title}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};