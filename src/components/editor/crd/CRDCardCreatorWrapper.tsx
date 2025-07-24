import React, { useState } from 'react';
import { CRDCardCreator } from './CRDCardCreator';

import { InteractiveCardData } from '@/types/interactiveCard';
import type { CardData, CardRarity } from '@/hooks/useCardEditor';

interface CRDCardCreatorWrapperProps {
  onComplete: (cardData: CardData) => void;
  onCancel: () => void;
  initialMode?: string;
}

export const CRDCardCreatorWrapper: React.FC<CRDCardCreatorWrapperProps> = ({
  onComplete,
  onCancel
}) => {
  const [currentCard, setCurrentCard] = useState<InteractiveCardData | null>(null);

  const handleCRDComplete = (interactiveCard: InteractiveCardData) => {
    // Convert InteractiveCardData to CardData format for compatibility
    const compatibleCard: CardData = {
      id: interactiveCard.id,
      title: interactiveCard.title,
      description: interactiveCard.description || '',
      rarity: interactiveCard.rarity as CardRarity,
      creator_id: interactiveCard.creator_id,
      image_url: interactiveCard.assets.images[0]?.url || '',
      tags: [],
      visibility: 'private' as const,
      creator_attribution: {
        creator_name: '',
        creator_id: interactiveCard.creator_id,
        collaboration_type: 'solo'
      },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: true // CRD cards are optimized for print
      },
      // Include CRD-specific metadata
      design_metadata: {
        ...interactiveCard,
        card_type: 'crd',
        print_optimized: true
      }
    };

    onComplete(compatibleCard);
  };

  const handleSave = (card: InteractiveCardData) => {
    handleCRDComplete(card);
  };

  const handlePreview = (card: InteractiveCardData) => {
    setCurrentCard(card);
  };

  return (
    <div className="h-full bg-crd-darkest">
      <CRDCardCreator
        initialCard={currentCard || undefined}
        onSave={handleSave}
        onPreview={handlePreview}
      />
    </div>
  );
};