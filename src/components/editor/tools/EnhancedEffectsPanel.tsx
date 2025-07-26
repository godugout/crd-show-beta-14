import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Zap, 
  Layers, 
  Palette, 
  Sun, 
  Moon,
  Droplets,
  Wind,
  Flame,
  Snowflake,
  Crown,
  Star,
  Settings,
  Eye,
  RotateCcw
} from 'lucide-react';

interface EffectConfig {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  category: 'lighting' | 'weather' | 'magical' | 'premium' | 'texture';
  description: string;
  intensity: number;
  enabled: boolean;
  isPremium: boolean;
  presets: { name: string; value: number }[];
}

const AVAILABLE_EFFECTS: EffectConfig[] = [
  {
    id: 'holographic',
    name: 'Holographic Shine',
    icon: Sparkles,
    category: 'premium',
    description: 'Rainbow holographic effect that shifts with viewing angle',
    intensity: 50,
    enabled: false,
    isPremium: true,
    presets: [
      { name: 'Subtle', value: 25 },
      { name: 'Medium', value: 50 },
      { name: 'Intense', value: 75 },
      { name: 'Maximum', value: 100 }
    ]
  },
  {
    id: 'foil',
    name: 'Foil Treatment',
    icon: Star,
    category: 'premium',
    description: 'Metallic foil effect for premium cards',
    intensity: 40,
    enabled: false,
    isPremium: true,
    presets: [
      { name: 'Gold', value: 30 },
      { name: 'Silver', value: 50 },
      { name: 'Platinum', value: 70 }
    ]
  },
  {
    id: 'glow',
    name: 'Edge Glow',
    icon: Sun,
    category: 'lighting',
    description: 'Glowing border effect around the card',
    intensity: 30,
    enabled: false,
    isPremium: false,
    presets: [
      { name: 'Soft', value: 20 },
      { name: 'Bright', value: 50 },
      { name: 'Intense', value: 80 }
    ]
  },
  {
    id: 'shadow',
    name: 'Drop Shadow',
    icon: Moon,
    category: 'lighting',
    description: 'Realistic shadow beneath the card',
    intensity: 60,
    enabled: false,
    isPremium: false,
    presets: [
      { name: 'Light', value: 30 },
      { name: 'Medium', value: 60 },
      { name: 'Heavy', value: 90 }
    ]
  },
  {
    id: 'rain',
    name: 'Rain Effect',
    icon: Droplets,
    category: 'weather',
    description: 'Animated rain droplets across the card',
    intensity: 40,
    enabled: false,
    isPremium: false,
    presets: [
      { name: 'Drizzle', value: 25 },
      { name: 'Shower', value: 50 },
      { name: 'Storm', value: 75 }
    ]
  },
  {
    id: 'wind',
    name: 'Wind Particles',
    icon: Wind,
    category: 'weather',
    description: 'Swirling wind particles and debris',
    intensity: 35,
    enabled: false,
    isPremium: false,
    presets: [
      { name: 'Breeze', value: 20 },
      { name: 'Wind', value: 50 },
      { name: 'Gale', value: 80 }
    ]
  },
  {
    id: 'fire',
    name: 'Fire Aura',
    icon: Flame,
    category: 'magical',
    description: 'Flickering flames around the border',
    intensity: 45,
    enabled: false,
    isPremium: true,
    presets: [
      { name: 'Ember', value: 30 },
      { name: 'Flame', value: 60 },
      { name: 'Inferno', value: 90 }
    ]
  },
  {
    id: 'ice',
    name: 'Frost Effect',
    icon: Snowflake,
    category: 'magical',
    description: 'Crystalline ice formations',
    intensity: 55,
    enabled: false,
    isPremium: true,
    presets: [
      { name: 'Frost', value: 35 },
      { name: 'Ice', value: 65 },
      { name: 'Frozen', value: 95 }
    ]
  },
  {
    id: 'grunge',
    name: 'Grunge Texture',
    icon: Layers,
    category: 'texture',
    description: 'Weathered, distressed texture overlay',
    intensity: 25,
    enabled: false,
    isPremium: false,
    presets: [
      { name: 'Worn', value: 20 },
      { name: 'Aged', value: 50 },
      { name: 'Distressed', value: 80 }
    ]
  }
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'premium': return Crown;
    case 'lighting': return Sun;
    case 'weather': return Droplets;
    case 'magical': return Sparkles;
    case 'texture': return Layers;
    default: return Settings;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'premium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/40';
    case 'lighting': return 'text-orange-400 bg-orange-400/20 border-orange-400/40';
    case 'weather': return 'text-blue-400 bg-blue-400/20 border-blue-400/40';
    case 'magical': return 'text-purple-400 bg-purple-400/20 border-purple-400/40';
    case 'texture': return 'text-green-400 bg-green-400/20 border-green-400/40';
    default: return 'text-gray-400 bg-gray-400/20 border-gray-400/40';
  }
};

interface EnhancedEffectsPanelProps {
  onEffectChange: (effects: EffectConfig[]) => void;
  className?: string;
}

export const EnhancedEffectsPanel: React.FC<EnhancedEffectsPanelProps> = ({
  onEffectChange,
  className = ''
}) => {
  const [effects, setEffects] = useState<EffectConfig[]>(AVAILABLE_EFFECTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewMode, setPreviewMode] = useState(false);

  const categories = [
    { id: 'all', name: 'All Effects', icon: Settings },
    { id: 'premium', name: 'Premium', icon: Crown },
    { id: 'lighting', name: 'Lighting', icon: Sun },
    { id: 'weather', name: 'Weather', icon: Droplets },
    { id: 'magical', name: 'Magical', icon: Sparkles },
    { id: 'texture', name: 'Texture', icon: Layers }
  ];

  const filteredEffects = effects.filter(effect => 
    selectedCategory === 'all' || effect.category === selectedCategory
  );

  const enabledEffects = effects.filter(effect => effect.enabled);

  const updateEffect = (effectId: string, updates: Partial<EffectConfig>) => {
    const updatedEffects = effects.map(effect =>
      effect.id === effectId ? { ...effect, ...updates } : effect
    );
    setEffects(updatedEffects);
    onEffectChange(updatedEffects);
  };

  const resetAllEffects = () => {
    const resetEffects = effects.map(effect => ({
      ...effect,
      enabled: false,
      intensity: AVAILABLE_EFFECTS.find(e => e.id === effect.id)?.intensity || 50
    }));
    setEffects(resetEffects);
    onEffectChange(resetEffects);
  };

  const applyPreset = (effectId: string, preset: { name: string; value: number }) => {
    updateEffect(effectId, { intensity: preset.value });
  };

  return (
    <Card className={`bg-crd-darker/90 border-crd-mediumGray/40 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-crd-white flex items-center gap-3 text-lg">
            <Zap className="w-5 h-5 text-crd-green" />
            Effects Studio
          </CardTitle>
          <div className="flex items-center gap-2">
            <CRDButton
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
              className={previewMode ? 'bg-crd-green text-black' : ''}
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </CRDButton>
            <CRDButton
              variant="outline"
              size="sm"
              onClick={resetAllEffects}
              className="text-crd-lightGray hover:text-crd-white"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </CRDButton>
          </div>
        </div>

        {/* Active Effects Summary */}
        {enabledEffects.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {enabledEffects.map(effect => {
              const Icon = effect.icon;
              return (
                <Badge 
                  key={effect.id}
                  className={`${getCategoryColor(effect.category)} flex items-center gap-1`}
                >
                  <Icon className="w-3 h-3" />
                  {effect.name} ({effect.intensity}%)
                </Badge>
              );
            })}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-2 rounded-lg border transition-all flex items-center gap-2 text-sm ${
                  selectedCategory === category.id
                    ? 'bg-crd-green text-black border-crd-green'
                    : 'text-crd-lightGray bg-crd-darkest/50 border-crd-mediumGray/40 hover:border-crd-green/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Effects List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredEffects.map(effect => {
            const Icon = effect.icon;
            const CategoryIcon = getCategoryIcon(effect.category);
            
            return (
              <div
                key={effect.id}
                className={`p-4 rounded-lg border transition-all ${
                  effect.enabled 
                    ? 'bg-crd-green/10 border-crd-green/30' 
                    : 'bg-crd-darkest/30 border-crd-mediumGray/20'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${getCategoryColor(effect.category)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-crd-white">{effect.name}</h4>
                        {effect.isPremium && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400/40">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-crd-lightGray">{effect.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={effect.enabled}
                    onCheckedChange={(enabled) => updateEffect(effect.id, { enabled })}
                  />
                </div>

                {effect.enabled && (
                  <div className="space-y-3 animate-fade-in">
                    {/* Intensity Slider */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-crd-lightGray">Intensity</label>
                        <span className="text-sm text-crd-white font-medium">{effect.intensity}%</span>
                      </div>
                      <Slider
                        value={[effect.intensity]}
                        onValueChange={([value]) => updateEffect(effect.id, { intensity: value })}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    {/* Presets */}
                    <div className="space-y-2">
                      <label className="text-sm text-crd-lightGray">Quick Presets</label>
                      <div className="flex flex-wrap gap-2">
                        {effect.presets.map(preset => (
                          <button
                            key={preset.name}
                            onClick={() => applyPreset(effect.id, preset)}
                            className={`px-3 py-1 rounded text-xs transition-colors ${
                              effect.intensity === preset.value
                                ? 'bg-crd-green text-black'
                                : 'bg-crd-darkest text-crd-lightGray hover:text-crd-white'
                            }`}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredEffects.length === 0 && (
          <div className="text-center py-8 text-crd-lightGray">
            <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No effects found in this category</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};