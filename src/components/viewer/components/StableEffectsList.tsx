
import React from 'react';
import { Label } from '@/components/ui/label';
import { EnhancedColoredSlider } from './EnhancedColoredSlider';
import { ENHANCED_VISUAL_EFFECTS } from '../hooks/useEnhancedCardEffects';
import { ENHANCED_COMBO_PRESETS } from './presets/enhancedComboPresets';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { getStyleColor } from './presets/styleColors';

interface StableEffectsListProps {
  effectValues: EffectValues;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  selectedPresetId?: string;
}

export const StableEffectsList: React.FC<StableEffectsListProps> = ({
  effectValues,
  onEffectChange,
  selectedPresetId
}) => {
  // Get all available effects from the current preset
  const getEffectsFromPreset = () => {
    if (!selectedPresetId) return [];
    
    // Check if it's a combo preset first
    const comboPreset = ENHANCED_COMBO_PRESETS.find(p => p.id === selectedPresetId);
    if (comboPreset && comboPreset.effects && Object.keys(comboPreset.effects).length > 0) {
      return Object.keys(comboPreset.effects); // Show all effects from the combo preset
    }
    
    // Check if it's a single effect
    const singleEffect = ENHANCED_VISUAL_EFFECTS.find(p => p.id === selectedPresetId);
    if (singleEffect) {
      return [selectedPresetId]; // Show just the selected effect
    }
    
    // For combo presets, get effects from the current effectValues
    const currentEffects = effectValues || {};
    return Object.keys(currentEffects).filter(effectId => {
      const effect = currentEffects[effectId];
      return effect && typeof effect.intensity === 'number';
    });
  };

  const relevantEffects = getEffectsFromPreset();

  if (relevantEffects.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-crd-lightGray text-sm">Select a style to see effects</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {relevantEffects.map((effectId) => {
        const effectConfig = ENHANCED_VISUAL_EFFECTS.find(e => e.id === effectId);
        const effectData = effectValues[effectId] || { intensity: 0 };
        const intensity = typeof effectData.intensity === 'number' ? effectData.intensity : 0;
        const isActive = intensity > 0;

        if (!effectConfig) return null;

        return (
          <div 
            key={effectId} 
            className={cn(
              "border border-white/10 rounded-lg p-3 transition-all",
              isActive ? "bg-white/5 border-white/20" : "bg-transparent opacity-60"
            )}
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 flex-1">
                <span className="text-sm font-medium min-w-[80px] text-crd-lightGray">
                  {effectConfig.name}
                </span>
                <div className="flex-1">
                  <EnhancedColoredSlider
                    value={[intensity]}
                    onValueChange={(value) => onEffectChange(effectId, 'intensity', value[0])}
                    min={0}
                    max={100}
                    step={1}
                    isActive={isActive}
                    styleColor={getStyleColor(effectId).primary}
                    effectName={effectConfig.name}
                  />
                </div>
                <span className="text-xs text-gray-400 w-8 text-right">{intensity}</span>
              </div>
            </div>

            {/* Show additional parameters if they exist and effect is active */}
            {isActive && effectConfig.parameters && effectConfig.parameters.length > 1 && (
              <div className="mt-2 space-y-2 pl-2 border-l border-white/10">
                {effectConfig.parameters.map((param) => {
                  if (param.id === 'intensity') return null;
                  
                  const value = typeof effectData[param.id] === 'number' ? effectData[param.id] : param.defaultValue;
                  
                  if (param.type !== 'slider') return null;
                  
                  return (
                    <div key={param.id} className="flex items-center space-x-2">
                      <Label className="text-xs w-16 text-right text-crd-lightGray/70">
                        {param.name}
                      </Label>
                      <div className="flex-1">
                        <EnhancedColoredSlider
                          value={[Number(value)]}
                          onValueChange={(newValue) => onEffectChange(effectId, param.id, newValue[0])}
                          min={param.min || 0}
                          max={param.max || 100}
                          step={param.step || 1}
                          isActive={Number(value) > (param.min || 0)}
                          styleColor={getStyleColor(effectId).primary}
                          effectName={param.name}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-6 text-right">{value}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
