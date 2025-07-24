
import React, { memo, useCallback } from 'react';
import { CardItem } from '@/components/shared/CardItem';
import { Skeleton } from '@/components/ui/skeleton';
import type { Tables } from '@/integrations/supabase/types';

type DbCard = Tables<'cards'>;

interface CardsGridProps {
  cards: DbCard[];
  loading: boolean;
  onCardClick: (card: DbCard) => void;
}

const CardGridItem = memo(({ card, onCardClick }: { card: DbCard; onCardClick: (card: DbCard) => void }) => {
  const handleClick = useCallback(() => {
    onCardClick(card);
  }, [card, onCardClick]);

  const getCardImageUrl = useCallback((card: DbCard): string => {
    // Try image_url first, then thumbnail_url, then fallback to placeholder
    if (card.image_url && !card.image_url.startsWith('blob:')) {
      return card.image_url;
    }
    if (card.thumbnail_url && !card.thumbnail_url.startsWith('blob:')) {
      return card.thumbnail_url;
    }
    // Return empty string to let CardItem handle the fallback
    return '';
  }, []);

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer card-item"
    >
      <CardItem
        title={card.title || 'Untitled Card'}
        price="1.5"
        image={getCardImageUrl(card)}
      />
    </div>
  );
}, (prev, next) => prev.card.id === next.card.id);

export const CardsGrid: React.FC<CardsGridProps> = ({ cards, loading, onCardClick }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="w-full aspect-[3/4] rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#777E90]">No cards found</p>
      </div>
    );
  }


  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 card-grid">
      {cards.map((card) => (
        <CardGridItem 
          key={card.id} 
          card={card} 
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
};
