
import React from 'react';
import { CardViewer3DContainer } from './CardViewer3DContainer';
import { useCardEffects } from './hooks/useCardEffects';
import type { CardData } from '@/types/card';

interface Card3DPreviewProps {
  card: CardData;
  showControls?: boolean;
  autoRotate?: boolean;
  environment?: 'studio' | 'city' | 'sunset' | 'dawn';
}

export const Card3DPreview: React.FC<Card3DPreviewProps> = ({
  card,
  showControls = true,
  autoRotate = false,
  environment = 'studio'
}) => {
  const { effectClasses, effectStyles } = useCardEffects(card);

  return (
    <div className="w-full h-full relative">
      {/* 3D Viewer */}
      <div className={`w-full h-full ${effectClasses}`} style={effectStyles}>
        <CardViewer3DContainer
          card={card}
          environment={environment}
          interactive={showControls}
          autoRotate={autoRotate}
        />
      </div>

      {/* Card Info Overlay */}
      <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 backdrop-blur-sm rounded-lg p-3 text-white">
        <h3 className="font-bold text-lg mb-1">{card.title}</h3>
        {card.description && (
          <p className="text-sm opacity-90 mb-2">{card.description}</p>
        )}
        <div className="flex items-center justify-between text-xs">
          <span className="px-2 py-1 bg-crd-green bg-opacity-20 rounded text-crd-green">
            {card.rarity || 'Common'}
          </span>
          {card.design_metadata?.effects && (
            <div className="flex gap-1">
              {card.design_metadata.effects.holographic && (
                <span className="px-2 py-1 bg-purple-500 bg-opacity-20 rounded text-purple-300">
                  Holographic
                </span>
              )}
              {card.design_metadata.effects.chrome && (
                <span className="px-2 py-1 bg-gray-500 bg-opacity-20 rounded text-gray-300">
                  Chrome
                </span>
              )}
              {card.design_metadata.effects.foil && (
                <span className="px-2 py-1 bg-pink-500 bg-opacity-20 rounded text-pink-300">
                  Foil
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
