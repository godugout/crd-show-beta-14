import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/providers/AuthProvider';

export const useLikes = (cardId: string) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (cardId) {
      fetchLikeStatus();
    }
  }, [cardId, user]);

  const fetchLikeStatus = async () => {
    try {
      // Get card's current like count
      const { data: cardData } = await supabase
        .from('cards')
        .select('favorite_count')
        .eq('id', cardId)
        .single();

      if (cardData) {
        setLikeCount(cardData.favorite_count || 0);
      }

      // Check if current user has liked this card
      if (user) {
        const { data: likeData } = await supabase
          .from('card_likes')
          .select('id')
          .eq('card_id', cardId)
          .eq('user_id', user.id)
          .maybeSingle();

        setIsLiked(!!likeData);
      }
    } catch (error) {
      console.error('Error fetching like status:', error);
    }
  };

  const toggleLike = async () => {
    if (!user || loading) return;

    setLoading(true);
    try {
      if (isLiked) {
        // Unlike
        await supabase
          .from('card_likes')
          .delete()
          .eq('card_id', cardId)
          .eq('user_id', user.id);

        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        // Like
        await supabase
          .from('card_likes')
          .insert({
            card_id: cardId,
            user_id: user.id
          });

        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    isLiked,
    likeCount,
    toggleLike,
    loading
  };
};