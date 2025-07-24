
import React from 'react';
import { Button } from '@/components/ui/button';
import { Layers, Sparkles, Settings, Palette, Shapes } from 'lucide-react';
import type { Animated3DVariant } from '@/components/hero/Animated3DBackground';

const variants = [
  { id: 'panels', name: 'Isometric Panels', icon: Layers, description: 'Floating rainbow grid panels' },
  { id: 'cards', name: 'Holographic Cards', icon: Sparkles, description: 'Floating card-like shapes' },
  { id: 'particles', name: 'Particle Constellation', icon: Settings, description: 'Small glowing particles' },
  { id: 'glass', name: 'Glass Planes', icon: Palette, description: 'Layered glass surfaces' },
  { id: 'shapes', name: 'Morphing Shapes', icon: Shapes, description: 'Geometric transformations' },
];

const presets = ['subtle', 'normal', 'dramatic', 'ethereal'];

interface StyleVariantSelectorProps {
  activeVariant: Animated3DVariant;
  setActiveVariant: (variant: Animated3DVariant) => void;
  applyPreset: (preset: string) => void;
}

export const StyleVariantSelector: React.FC<StyleVariantSelectorProps> = ({
  activeVariant,
  setActiveVariant,
  applyPreset
}) => {
  return (
    <>
      <div className="space-y-3">
        {variants.map((variant) => {
          const IconComponent = variant.icon;
          return (
            <div
              key={variant.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                activeVariant === variant.id
                  ? 'border-crd-green bg-crd-green/10'
                  : 'border-crd-mediumGray/30 hover:border-crd-mediumGray/50 bg-crd-darkest/50'
              }`}
              onClick={() => setActiveVariant(variant.id as Animated3DVariant)}
            >
              <div className="flex items-center gap-3">
                <IconComponent className={`w-5 h-5 ${
                  activeVariant === variant.id ? 'text-crd-green' : 'text-crd-lightGray'
                }`} />
                <div>
                  <h4 className={`font-medium ${
                    activeVariant === variant.id ? 'text-crd-white' : 'text-crd-lightGray'
                  }`}>
                    {variant.name}
                  </h4>
                  <p className="text-xs text-crd-mediumGray">
                    {variant.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-crd-mediumGray/20 pt-4">
        <h4 className="text-sm font-medium text-crd-white mb-3">Quick Presets</h4>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((preset) => (
            <Button
              key={preset}
              variant="outline"
              size="sm"
              onClick={() => applyPreset(preset)}
              className="text-xs capitalize border-crd-mediumGray/30 hover:border-crd-green/50"
            >
              {preset}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};
