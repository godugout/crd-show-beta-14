
import React from 'react';
import { Animated3DBackground, type Animated3DVariant } from '@/components/hero/Animated3DBackground';

interface StyleTesterPreviewProps {
  activeVariant: Animated3DVariant;
  opacity: number;
  speed: number;
  scale: number;
  blur: number;
}

export const StyleTesterPreview: React.FC<StyleTesterPreviewProps> = ({
  activeVariant,
  opacity,
  speed,
  scale,
  blur
}) => {
  return (
    <div className="flex-1 relative bg-crd-darker rounded-lg overflow-hidden border border-crd-mediumGray/20">
      <div className="absolute inset-0 bg-gradient-to-br from-crd-darkest via-crd-darker to-crd-darkest">
        {/* Sample Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-crd-white mb-4">
              Sample <span className="text-crd-green">3D Effects</span>
            </h1>
            <p className="text-xl text-crd-lightGray max-w-2xl">
              This is how the background animation would look behind content.
              Adjust the settings to see different effects.
            </p>
          </div>
        </div>

        {/* 3D Background */}
        <div 
          className="absolute inset-0"
          style={{
            opacity: opacity / 100,
            transform: `scale(${scale / 100})`,
            filter: blur > 0 ? `blur(${blur}px)` : 'none',
          }}
        >
          <Animated3DBackground 
            variant={activeVariant} 
            intensity={opacity / 100}
            speed={speed}
            mouseInteraction={true}
            autoRotate={false}
          />
        </div>

        {/* Info overlay */}
        <div className="absolute bottom-4 left-4 bg-crd-darkest/80 backdrop-blur-sm rounded-lg p-3 border border-crd-mediumGray/20">
          <div className="text-xs text-crd-lightGray space-y-1">
            <div>Variant: <span className="text-crd-white">{activeVariant}</span></div>
            <div>Opacity: <span className="text-crd-white">{opacity}%</span></div>
            <div>Speed: <span className="text-crd-white">{speed}x</span></div>
            <div>Scale: <span className="text-crd-white">{scale}%</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
