import React, { useState, useCallback } from 'react';
import { UnifiedCreationInterface } from '@/components/editor/unified/UnifiedCreationInterface';
import { ProDesignStudio } from '@/components/editor/modes/ProDesignStudio';
import { useProModeState } from '@/hooks/useProModeState';
import { InteractiveCardData } from '@/types/interactiveCard';
import type { CardData } from '@/hooks/useCardEditor';

interface CRDCardCreatorProps {
  initialCard?: Partial<InteractiveCardData>;
  onSave: (card: InteractiveCardData) => void;
  onPreview: (card: InteractiveCardData) => void;
}

export const CRDCardCreator: React.FC<CRDCardCreatorProps> = ({
  initialCard,
  onSave,
  onPreview
}) => {
  const [cardData, setCardData] = useState<InteractiveCardData>({
    id: initialCard?.id || `crd_${Date.now()}`,
    title: initialCard?.title || 'Untitled CRD Collectible',
    description: initialCard?.description || '',
    rarity: initialCard?.rarity || 'common',
    creator_id: initialCard?.creator_id || 'current_user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assets: {
      images: [],
      videos: []
    },
    version: 1
  });

  // Pro Mode State
  const { proModeState, toggleProMode, exitProMode } = useProModeState();

  // Convert InteractiveCardData to CardData for Pro Mode
  const convertToCardData = useCallback((interactiveCard: InteractiveCardData): CardData => {
    return {
      id: interactiveCard.id,
      title: interactiveCard.title,
      description: interactiveCard.description || '',
      rarity: interactiveCard.rarity as any,
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
        print_available: true
      },
      design_metadata: {
        ...interactiveCard,
        card_type: 'crd',
        print_optimized: true
      }
    };
  }, []);

  const handleProModeComplete = useCallback((proCardData: CardData) => {
    // Convert back to InteractiveCardData format
    const interactiveCard: InteractiveCardData = {
      id: proCardData.id,
      title: proCardData.title,
      description: proCardData.description,
      rarity: proCardData.rarity as any,
      creator_id: proCardData.creator_id,
      created_at: cardData.created_at,
      updated_at: new Date().toISOString(),
      assets: cardData.assets,
      version: cardData.version + 1
    };
    
    setCardData(interactiveCard);
    exitProMode();
    console.log('✅ Pro Mode design completed and applied');
  }, [cardData, exitProMode]);

  const handleUnifiedComplete = useCallback((unifiedCardData: CardData) => {
    // Convert CardData back to InteractiveCardData and save
    const interactiveCard: InteractiveCardData = {
      id: unifiedCardData.id,
      title: unifiedCardData.title,
      description: unifiedCardData.description,
      rarity: unifiedCardData.rarity as any,
      creator_id: unifiedCardData.creator_id,
      created_at: cardData.created_at,
      updated_at: new Date().toISOString(),
      assets: cardData.assets,
      version: cardData.version + 1
    };
    
    onSave(interactiveCard);
  }, [cardData, onSave]);

  // If Pro Mode is active, show Pro Design Studio
  if (proModeState.isProModeActive) {
    return (
      <ProDesignStudio
        cardData={convertToCardData(cardData)}
        onComplete={handleProModeComplete}
        onBack={exitProMode}
        className="h-screen"
        gridType="standard"
        showGrid={false}
      />
    );
  }

  return (
    <div className="h-full w-full bg-crd-darkest">
      <UnifiedCreationInterface
        initialMode="quick"
        initialCardData={convertToCardData(cardData)}
        onComplete={handleUnifiedComplete}
        onCancel={() => console.log('Creation cancelled')}
        showHeader={false}
      />
    </div>
  );
};