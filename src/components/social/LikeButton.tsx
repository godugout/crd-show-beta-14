import React from 'react';
import { Heart } from 'lucide-react';
import { useLikes } from '@/hooks/useLikes';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { toast } from '@/hooks/use-toast';

interface LikeButtonProps {
  cardId: string;
  className?: string;
  showCount?: boolean;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ 
  cardId, 
  className = '',
  showCount = true 
}) => {
  const { isLiked, likeCount, toggleLike, loading } = useLikes(cardId);
  const { user } = useAuth();

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like cards",
        variant: "destructive"
      });
      return;
    }

    await toggleLike();
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`
        flex items-center gap-1 transition-all duration-200 group
        ${isLiked 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-crd-lightGray hover:text-red-500'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <Heart 
        className={`w-5 h-5 transition-all duration-200 ${
          isLiked 
            ? 'fill-current scale-110' 
            : 'group-hover:scale-110'
        }`}
      />
      {showCount && (
        <span className="text-sm font-medium min-w-[20px] text-left">
          {likeCount > 0 ? likeCount.toLocaleString() : ''}
        </span>
      )}
    </button>
  );
};