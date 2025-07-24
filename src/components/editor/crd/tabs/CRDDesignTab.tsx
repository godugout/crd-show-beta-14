import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Type, Sparkles, Image } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';

interface CRDDesignTabProps {
  colorPalette: string;
  onColorPaletteChange: (palette: string) => void;
  typography: string;
  onTypographyChange: (font: string) => void;
  effects: string[];
  onEffectsChange: (effects: string[]) => void;
}

const COLOR_PALETTES = [
  { id: 'classic', name: 'Classic Blue', colors: ['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD'] },
  { id: 'sports', name: 'Sports Red', colors: ['#DC2626', '#EF4444', '#F87171', '#FCA5A5'] },
  { id: 'premium', name: 'Premium Gold', colors: ['#D97706', '#F59E0B', '#FBBF24', '#FCD34D'] },
  { id: 'modern', name: 'Modern Purple', colors: ['#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD'] },
  { id: 'nature', name: 'Nature Green', colors: ['#059669', '#10B981', '#34D399', '#6EE7B7'] }
];

const TYPOGRAPHY_STYLES = [
  { id: 'classic', name: 'Classic Serif', preview: 'Player Name 2024' },
  { id: 'modern', name: 'Modern Sans', preview: 'Player Name 2024' },
  { id: 'sport', name: 'Sports Bold', preview: 'Player Name 2024' },
  { id: 'elegant', name: 'Elegant Script', preview: 'Player Name 2024' }
];

const VISUAL_EFFECTS = [
  { id: 'foil', name: 'Foil Finish', description: 'Premium metallic foil effect' },
  { id: 'holographic', name: 'Holographic', description: 'Rainbow holographic finish' },
  { id: 'chrome', name: 'Chrome', description: 'Mirror-like chrome effect' },
  { id: 'texture', name: 'Textured', description: 'Physical texture overlay' },
  { id: 'gradient', name: 'Gradient', description: 'Smooth color transitions' }
];

export const CRDDesignTab: React.FC<CRDDesignTabProps> = ({
  colorPalette,
  onColorPaletteChange,
  typography,
  onTypographyChange,
  effects,
  onEffectsChange
}) => {
  const toggleEffect = (effectId: string) => {
    const newEffects = effects.includes(effectId)
      ? effects.filter(e => e !== effectId)
      : [...effects, effectId];
    onEffectsChange(newEffects);
  };

  return (
    <div className="space-y-4">
      {/* Color Palette */}
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-crd-white text-sm flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Color Palette
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {COLOR_PALETTES.map(palette => (
            <div
              key={palette.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                colorPalette === palette.id
                  ? 'border-crd-blue bg-crd-blue/10'
                  : 'border-crd-mediumGray/20 hover:border-crd-blue/50'
              }`}
              onClick={() => onColorPaletteChange(palette.id)}
            >
              <div className="flex items-center justify-between">
                <span className="text-crd-white text-sm font-medium">{palette.name}</span>
                <div className="flex gap-1">
                  {palette.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded border border-crd-mediumGray/20"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Typography */}
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-crd-white text-sm flex items-center gap-2">
            <Type className="w-4 h-4" />
            Typography
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {TYPOGRAPHY_STYLES.map(font => (
            <div
              key={font.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                typography === font.id
                  ? 'border-crd-blue bg-crd-blue/10'
                  : 'border-crd-mediumGray/20 hover:border-crd-blue/50'
              }`}
              onClick={() => onTypographyChange(font.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-crd-white text-sm font-medium">{font.name}</div>
                  <div className="text-crd-lightGray text-xs mt-1">{font.preview}</div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Visual Effects */}
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-crd-white text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Visual Effects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {VISUAL_EFFECTS.map(effect => (
            <div
              key={effect.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                effects.includes(effect.id)
                  ? 'border-crd-blue bg-crd-blue/10'
                  : 'border-crd-mediumGray/20 hover:border-crd-blue/50'
              }`}
              onClick={() => toggleEffect(effect.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-crd-white text-sm font-medium">{effect.name}</div>
                  <div className="text-crd-lightGray text-xs mt-1">{effect.description}</div>
                </div>
                {effects.includes(effect.id) && (
                  <Sparkles className="w-4 h-4 text-crd-blue flex-shrink-0 ml-2" />
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Background Options */}
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-crd-white text-sm flex items-center gap-2">
            <Image className="w-4 h-4" />
            Background
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <CRDButton variant="outline" size="sm" className="text-xs">
              Solid Color
            </CRDButton>
            <CRDButton variant="outline" size="sm" className="text-xs">
              Gradient
            </CRDButton>
            <CRDButton variant="outline" size="sm" className="text-xs">
              Pattern
            </CRDButton>
            <CRDButton variant="outline" size="sm" className="text-xs">
              Upload Image
            </CRDButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};