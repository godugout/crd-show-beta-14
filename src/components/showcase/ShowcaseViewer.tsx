
import React, { useState } from 'react';
import { ShowcasePanel } from './ShowcasePanel';
import { ShowcaseCanvas } from './ShowcaseCanvas';
import { ViewerHeader } from '@/components/viewer/components/ViewerHeader';
import { CardNavigationHandler } from '@/components/viewer/components/CardNavigationHandler';
import type { CardData } from '@/types/card';
import type { SlabPresetConfig } from './SlabPresets';

interface ShowcaseViewerProps {
  card: CardData;
  cards: CardData[];
  currentCardIndex: number;
  onCardChange?: (index: number) => void;
  slabConfig: SlabPresetConfig;
  onSlabConfigChange: (config: SlabPresetConfig) => void;
  onClose?: () => void;
  onShare?: (card: CardData) => void;
  onDownload?: (card: CardData) => void;
}

export const ShowcaseViewer: React.FC<ShowcaseViewerProps> = ({
  card,
  cards,
  currentCardIndex,
  onCardChange,
  slabConfig,
  onSlabConfigChange,
  onClose,
  onShare,
  onDownload
}) => {
  const [showPanel, setShowPanel] = useState(true);
  const [exploded, setExploded] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Header */}
      <ViewerHeader
        onClose={onClose}
        showStudioButton={!showPanel}
        onOpenStudio={() => setShowPanel(true)}
      />

      {/* Main Canvas Area */}
      <div className={`flex-1 ${showPanel ? 'pr-80' : ''} transition-all duration-300`}>
        <ShowcaseCanvas
          card={card}
          slabConfig={slabConfig}
          exploded={exploded}
          onExplodedChange={setExploded}
        />
      </div>

      {/* Side Panel */}
      {showPanel && (
        <ShowcasePanel
          card={card}
          slabConfig={slabConfig}
          onSlabConfigChange={onSlabConfigChange}
          exploded={exploded}
          onExplodedChange={setExploded}
          onClose={() => setShowPanel(false)}
        />
      )}

      {/* Card Navigation */}
      <CardNavigationHandler
        cards={cards}
        currentCardIndex={currentCardIndex}
        onCardChange={onCardChange}
        setIsFlipped={() => {}} // Not used in showcase
      />
    </div>
  );
};
