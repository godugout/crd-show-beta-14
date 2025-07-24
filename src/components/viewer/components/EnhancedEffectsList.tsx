
import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FilterButton, EffectCard } from '@/components/ui/design-system';
import { ChevronDown, Palette, Zap, Layers, Eye, EyeOff } from 'lucide-react';
import { ENHANCED_VISUAL_EFFECTS } from '../hooks/effects/effectConfigs';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface EnhancedEffectsListProps {
  effectValues: EffectValues;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  selectedPresetId?: string;
  searchQuery?: string;
}

const EFFECT_EMOJIS: Record<string, string> = {
  holographic: '🌈',
  chrome: '🪞',
  crystal: '💎',
  gold: '🏆',
  vintage: '📜',
  aurora: '🌌',
  waves: '🌊',
  interference: '🫧',
  prizm: '🔮',
  brushedmetal: '⚙️',
  foilspray: '✨',
  ice: '❄️',
  lunar: '🌙'
};

const CATEGORY_INFO = {
  prismatic: { name: 'Holographic & Light', icon: Palette, color: 'text-purple-400' },
  metallic: { name: 'Metallic Finishes', icon: Zap, color: 'text-blue-400' },
  surface: { name: 'Surface Effects', icon: Layers, color: 'text-green-400' },
  vintage: { name: 'Vintage & Classic', icon: Eye, color: 'text-amber-400' }
};

export const EnhancedEffectsList: React.FC<EnhancedEffectsListProps> = ({
  effectValues,
  onEffectChange,
  selectedPresetId,
  searchQuery = ''
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['prismatic']));
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  // Group effects by category
  const effectsByCategory = useMemo(() => {
    const grouped = ENHANCED_VISUAL_EFFECTS.reduce((acc, effect) => {
      if (!acc[effect.category]) {
        acc[effect.category] = [];
      }
      acc[effect.category].push(effect);
      return acc;
    }, {} as Record<string, typeof ENHANCED_VISUAL_EFFECTS>);

    // Filter by search query
    if (searchQuery) {
      Object.keys(grouped).forEach(category => {
        grouped[category] = grouped[category].filter(effect =>
          effect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          effect.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    return grouped;
  }, [searchQuery]);

  // Get active effects
  const activeEffects = useMemo(() => {
    return Object.entries(effectValues).filter(([_, params]) => 
      params && typeof params === 'object' && 'intensity' in params && 
      typeof params.intensity === 'number' && params.intensity > 0
    );
  }, [effectValues]);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getEffectIntensity = (effectId: string): number => {
    const params = effectValues[effectId];
    if (params && typeof params === 'object' && 'intensity' in params) {
      const intensity = params.intensity;
      return typeof intensity === 'number' ? intensity : 0;
    }
    return 0;
  };

  const isEffectActive = (effectId: string): boolean => {
    return getEffectIntensity(effectId) > 0;
  };

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-semibold text-base">Effects Library</h4>
          <p className="text-crd-lightGray text-xs mt-0.5">
            Individual effect controls and customization
          </p>
        </div>
        <FilterButton
          onClick={() => setShowOnlyActive(!showOnlyActive)}
          isActive={showOnlyActive}
          count={showOnlyActive ? undefined : activeEffects.length}
        >
          {showOnlyActive ? (
            <>
              <Eye className="w-3 h-3 mr-1" />
              All
            </>
          ) : (
            <>
              <EyeOff className="w-3 h-3 mr-1" />
              Active
            </>
          )}
        </FilterButton>
      </div>

      {/* Active Effects Section */}
      {activeEffects.length > 0 && !showOnlyActive && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-crd-green font-medium text-sm">
              Active Effects
            </h5>
            <Badge variant="outline" className="bg-crd-green/20 border-crd-green text-crd-green text-xs">
              {activeEffects.length}
            </Badge>
          </div>
          
          <div className="space-y-2">
            {activeEffects.map(([effectId]) => {
              const effect = ENHANCED_VISUAL_EFFECTS.find(e => e.id === effectId);
              if (!effect) return null;

              const intensity = getEffectIntensity(effectId);
              const emoji = EFFECT_EMOJIS[effectId] || '⚡';

              return (
                <EffectCard
                  key={effectId}
                  variant="compact"
                  title={effect.name}
                  emoji={emoji}
                  intensity={intensity}
                  isActive={true}
                  className="border-crd-green/30 bg-crd-green/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-crd-green text-xs font-medium">
                      {Math.round(intensity)}%
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={intensity}
                      onChange={(e) => onEffectChange(effectId, 'intensity', parseInt(e.target.value))}
                      className="w-20 h-1 accent-crd-green"
                    />
                  </div>
                </EffectCard>
              );
            })}
          </div>
        </div>
      )}

      {/* Effects by Category */}
      <div className="space-y-4">
        {Object.entries(effectsByCategory).map(([category, effects]) => {
          if (effects.length === 0) return null;
          if (showOnlyActive && !effects.some(e => isEffectActive(e.id))) return null;

          const categoryInfo = CATEGORY_INFO[category as keyof typeof CATEGORY_INFO];
          const isExpanded = expandedCategories.has(category);
          const activeCount = effects.filter(e => isEffectActive(e.id)).length;

          return (
            <Collapsible key={category} open={isExpanded} onOpenChange={() => toggleCategory(category)}>
              <CollapsibleTrigger asChild>
                <FilterButton
                  className="w-full justify-between h-10 px-4 rounded-lg"
                  count={activeCount}
                >
                  <div className="flex items-center space-x-3">
                    {categoryInfo && <categoryInfo.icon className={`w-4 h-4 ${categoryInfo.color}`} />}
                    <span className="font-medium">
                      {categoryInfo?.name || category}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`} />
                </FilterButton>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-3 mt-3">
                {effects.map((effect) => {
                  if (showOnlyActive && !isEffectActive(effect.id)) return null;

                  const intensity = getEffectIntensity(effect.id);
                  const isActive = intensity > 0;
                  const emoji = EFFECT_EMOJIS[effect.id] || '⚡';

                  return (
                    <EffectCard
                      key={effect.id}
                      title={effect.name}
                      description={effect.description}
                      emoji={emoji}
                      intensity={intensity}
                      isActive={isActive}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-crd-lightGray text-xs">Intensity</span>
                          <span className="text-white text-xs font-medium">{Math.round(intensity)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={intensity}
                          onChange={(e) => onEffectChange(effect.id, 'intensity', parseInt(e.target.value))}
                          className="w-full h-2 accent-crd-green rounded-lg"
                        />
                      </div>
                    </EffectCard>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
};
