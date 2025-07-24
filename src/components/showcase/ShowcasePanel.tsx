
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SlabPresets } from './SlabPresets';
import { SlabControls } from './SlabControls';
import type { CardData } from '@/types/card';
import type { SlabPresetConfig } from './SlabPresets';

interface ShowcasePanelProps {
  card: CardData;
  slabConfig: SlabPresetConfig;
  onSlabConfigChange: (config: SlabPresetConfig) => void;
  exploded: boolean;
  onExplodedChange: (exploded: boolean) => void;
  onClose: () => void;
}

export const ShowcasePanel: React.FC<ShowcasePanelProps> = ({
  card,
  slabConfig,
  onSlabConfigChange,
  exploded,
  onExplodedChange,
  onClose
}) => {
  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-gray-900 border-l border-gray-700 z-50 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Showcase Settings</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Card Info */}
        <div className="bg-gray-800 rounded-lg p-3">
          <h3 className="font-medium text-white mb-1">{card.title}</h3>
          {card.description && (
            <p className="text-sm text-gray-400">{card.description}</p>
          )}
          <div className="mt-2">
            <span className="inline-block px-2 py-1 bg-crd-green bg-opacity-20 rounded text-xs text-crd-green">
              {card.rarity || 'Common'}
            </span>
          </div>
        </div>

        {/* Slab Configuration */}
        <SlabPresets
          config={slabConfig}
          onConfigChange={onSlabConfigChange}
        />

        {/* Advanced Controls */}
        {slabConfig.type !== 'none' && (
          <SlabControls
            config={slabConfig}
            onConfigChange={onSlabConfigChange}
            exploded={exploded}
            onExplodedChange={onExplodedChange}
          />
        )}
      </div>
    </div>
  );
};
