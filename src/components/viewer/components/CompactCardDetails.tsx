
import React from 'react';
import type { CardData } from '@/types/card';
import { Badge } from '@/components/ui/badge';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { useDynamicCardBackMaterials } from '../hooks/useDynamicCardBackMaterials';
import { Eye, EyeOff } from 'lucide-react';

interface CompactCardDetailsProps {
  card: CardData;
  effectValues?: EffectValues;
  selectedScene?: EnvironmentScene;
  selectedLighting?: LightingPreset;
  materialSettings?: MaterialSettings;
  overallBrightness?: number[];
  interactiveLighting?: boolean;
}

const getRarityColor = (rarity: string) => {
  switch (rarity.toLowerCase()) {
    case 'legendary':
      return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
    case 'rare':
      return 'bg-gradient-to-r from-blue-500 to-purple-500 text-white';
    case 'uncommon':
      return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
    case 'common':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

export const CompactCardDetails: React.FC<CompactCardDetailsProps> = ({ 
  card,
  effectValues,
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness = [100],
  interactiveLighting = false
}) => {
  const { selectedMaterial } = useDynamicCardBackMaterials(effectValues || {});

  // Get active effects with their intensities
  const activeEffects = effectValues ? Object.entries(effectValues)
    .filter(([_, params]) => params && typeof params.intensity === 'number' && params.intensity > 0)
    .map(([effectId, params]) => ({
      id: effectId,
      name: effectId.charAt(0).toUpperCase() + effectId.slice(1),
      intensity: Number(params.intensity) // Convert to primitive number
    }))
    .sort((a, b) => Number(b.intensity) - Number(a.intensity)) : []; // Convert to primitive numbers for arithmetic

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 max-w-sm select-none hover:bg-white/15 transition-all duration-200" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
      {/* Card Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm truncate max-w-[160px]">
          {card.title}
        </h3>
        <Badge className={`text-xs font-bold ${getRarityColor(card.rarity)} border-0`}>
          {card.rarity.toUpperCase()}
        </Badge>
      </div>
      
      {/* Card Info Row */}
      <div className="flex items-center space-x-3 text-xs text-gray-200 mb-3">
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
          <span>{card.template_id}</span>
        </span>
        
        {card.tags && card.tags.length > 0 && (
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span>{card.tags[0]}</span>
            {card.tags.length > 1 && <span>+{card.tags.length - 1}</span>}
          </span>
        )}
      </div>

      {/* Configuration Details */}
      <div className="space-y-2 text-xs">
        {/* Active Effects */}
        <div>
          <h4 className="font-medium text-blue-300 mb-1">
            Active Effects ({activeEffects.length})
          </h4>
          {activeEffects.length > 0 ? (
            <div className="space-y-1">
              {activeEffects.slice(0, 3).map(effect => (
                <div key={effect.id} className="flex justify-between items-center">
                  <span className="text-gray-200">{effect.name}</span>
                  <span className="text-xs text-gray-300">{Number(effect.intensity)}%</span>
                </div>
              ))}
              {activeEffects.length > 3 && (
                <span className="text-gray-400">+{activeEffects.length - 3} more</span>
              )}
            </div>
          ) : (
            <p className="text-gray-400">No effects active</p>
          )}
        </div>

        {/* Material & Environment */}
        {selectedScene && selectedLighting && (
          <div className="grid grid-cols-2 gap-3">
            {/* Card Back Material */}
            <div>
              <h4 className="font-medium text-purple-300 mb-1">Material</h4>
              <div className="space-y-0.5">
                <div className="text-gray-200">{selectedMaterial.name}</div>
                <div className="text-gray-300">{Math.round(selectedMaterial.opacity * 100)}%</div>
              </div>
            </div>

            {/* Environment */}
            <div>
              <h4 className="font-medium text-green-300 mb-1">Environment</h4>
              <div className="space-y-0.5">
                <div className="text-gray-200">{selectedScene.name}</div>
                <div className="text-gray-200">{selectedLighting.name}</div>
                <div className="flex items-center">
                  {interactiveLighting ? (
                    <Eye className="w-3 h-3 text-green-300 mr-1" />
                  ) : (
                    <EyeOff className="w-3 h-3 text-gray-400 mr-1" />
                  )}
                  <span className="text-gray-300">{overallBrightness[0]}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Material Properties */}
        {materialSettings && (
          <div>
            <h4 className="font-medium text-orange-300 mb-1">Properties</h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
              <div className="flex justify-between">
                <span className="text-gray-200">Rough:</span>
                <span className="text-gray-300">{Math.round(materialSettings.roughness * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-200">Metal:</span>
                <span className="text-gray-300">{Math.round(materialSettings.metalness * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-200">Clear:</span>
                <span className="text-gray-300">{Math.round(materialSettings.clearcoat * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-200">Reflect:</span>
                <span className="text-gray-300">{Math.round(materialSettings.reflectivity * 100)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
