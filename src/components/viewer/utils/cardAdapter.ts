
import type { CardData } from '@/types/card';

export interface Simple3DCard {
  id: string;
  title: string;
  image_url?: string;
}

export const adaptCardForSpaceRenderer = (card: CardData): Simple3DCard => {
  return {
    id: card.id || `card_${Date.now()}`,
    title: card.title,
    image_url: card.image_url
  };
};
