import React from 'react';
import { useFollows } from '@/hooks/useFollows';

interface FollowStatsProps {
  userId: string;
  className?: string;
}

export const FollowStats: React.FC<FollowStatsProps> = ({ 
  userId, 
  className = '' 
}) => {
  const { followersCount, followingCount } = useFollows(userId);

  return (
    <div className={`flex items-center gap-4 text-sm ${className}`}>
      <div className="text-center">
        <div className="font-semibold text-crd-white">
          {followersCount.toLocaleString()}
        </div>
        <div className="text-crd-lightGray">
          {followersCount === 1 ? 'Follower' : 'Followers'}
        </div>
      </div>
      
      <div className="text-center">
        <div className="font-semibold text-crd-white">
          {followingCount.toLocaleString()}
        </div>
        <div className="text-crd-lightGray">Following</div>
      </div>
    </div>
  );
};