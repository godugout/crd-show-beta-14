import React from 'react';
import { UserPlus, UserCheck } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { useFollows } from '@/hooks/useFollows';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { toast } from '@/hooks/use-toast';

interface FollowButtonProps {
  userId: string;
  username?: string;
  variant?: 'default' | 'compact';
  className?: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ 
  userId, 
  username,
  variant = 'default',
  className = '' 
}) => {
  const { isFollowing, toggleFollow, loading } = useFollows(userId);
  const { user } = useAuth();

  // Don't show follow button for own profile
  if (user?.id === userId) {
    return null;
  }

  const handleFollow = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to follow creators",
        variant: "destructive"
      });
      return;
    }

    await toggleFollow();
    
    if (!isFollowing) {
      toast({
        title: "Following!",
        description: `You are now following ${username || 'this creator'}`,
      });
    }
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleFollow}
        disabled={loading}
        className={`
          p-2 rounded-lg transition-all duration-200 min-h-[44px] min-w-[44px]
          ${isFollowing 
            ? 'bg-crd-green/20 text-crd-green hover:bg-crd-green/30' 
            : 'bg-crd-mediumGray/20 text-crd-lightGray hover:bg-crd-green/20 hover:text-crd-green'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
      >
        {isFollowing ? (
          <UserCheck className="w-5 h-5" />
        ) : (
          <UserPlus className="w-5 h-5" />
        )}
      </button>
    );
  }

  return (
    <CRDButton
      variant={isFollowing ? "outline" : "primary"}
      size="sm"
      onClick={handleFollow}
      disabled={loading}
      className={`min-h-[44px] ${className}`}
    >
      {isFollowing ? (
        <>
          <UserCheck className="w-4 h-4 mr-2" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4 mr-2" />
          Follow
        </>
      )}
    </CRDButton>
  );
};