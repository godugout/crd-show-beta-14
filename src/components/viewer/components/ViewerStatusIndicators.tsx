import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Eye, Zap, Settings } from 'lucide-react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset } from '../types';
import { ENHANCED_COMBO_PRESETS } from './presets/enhancedComboPresets';

interface ViewerStatusIndicatorsProps {
  effectValues: EffectValues;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  showEffects: boolean;
  interactiveLighting: boolean;
  showCustomizePanel: boolean;
  selectedPresetId?: string;
}

export const ViewerStatusIndicators: React.FC<ViewerStatusIndicatorsProps> = ({
  effectValues,
  selectedScene,
  selectedLighting,
  showEffects,
  interactiveLighting,
  showCustomizePanel,
  selectedPresetId
}) => {
  // Count active effects
  const activeEffectCount = Object.entries(effectValues || {}).filter(([_, effect]) => 
    effect && typeof effect.intensity === 'number' && effect.intensity > 0
  ).length;

  // Get style name from preset data
  const getStyleName = () => {
    if (!selectedPresetId) return 'None';
    
    // Try to find in combo presets first
    const comboPreset = ENHANCED_COMBO_PRESETS.find(p => p.id === selectedPresetId);
    if (comboPreset) return comboPreset.name;
    
    // Fallback to formatted ID
    return selectedPresetId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  const styleName = getStyleName();

  return (
    <div className="fixed top-4 left-4 z-40 flex flex-col space-y-2">
      {/* Current Style */}
      <Badge variant="outline" className="bg-black/80 text-white border-white/20 backdrop-blur-sm">
        <Sparkles className="w-3 h-3 mr-1" />
        {styleName}
      </Badge>

      {/* Active Effects Count */}
      {activeEffectCount > 0 && (
        <Badge variant="outline" className="bg-black/80 text-crd-green border-crd-green/30 backdrop-blur-sm">
          <Zap className="w-3 h-3 mr-1" />
          {activeEffectCount} Effect{activeEffectCount !== 1 ? 's' : ''}
        </Badge>
      )}

      {/* Environment Scene */}
      <Badge variant="outline" className="bg-black/80 text-blue-400 border-blue-400/30 backdrop-blur-sm">
        <Eye className="w-3 h-3 mr-1" />
        {selectedScene.name}
      </Badge>

      {/* Lighting Preset */}
      <Badge variant="outline" className="bg-black/80 text-yellow-400 border-yellow-400/30 backdrop-blur-sm">
        💡 {selectedLighting.name}
      </Badge>

      {/* Interactive Lighting */}
      {interactiveLighting && (
        <Badge variant="outline" className="bg-black/80 text-orange-400 border-orange-400/30 backdrop-blur-sm">
          ✨ Interactive
        </Badge>
      )}

      {/* Studio Panel Status */}
      {showCustomizePanel && (
        <Badge variant="outline" className="bg-black/80 text-purple-400 border-purple-400/30 backdrop-blur-sm">
          <Settings className="w-3 h-3 mr-1" />
          Studio Open
        </Badge>
      )}

      {/* Effects Toggle Status */}
      {!showEffects && (
        <Badge variant="outline" className="bg-black/80 text-red-400 border-red-400/30 backdrop-blur-sm">
          🚫 Effects Off
        </Badge>
      )}
    </div>
  );
};