
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Settings, Lock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EnhancedColoredSlider } from './EnhancedColoredSlider';
import { ENHANCED_VISUAL_EFFECTS } from '../hooks/useEnhancedCardEffects';
import { getStyleColor } from './presets/styleColors';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { cn } from '@/lib/utils';

interface CleanEffectsListProps {
  effectValues: EffectValues;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  selectedPresetId?: string;
}

export const CleanEffectsList: React.FC<CleanEffectsListProps> = ({
  effectValues,
  onEffectChange,
  selectedPresetId
}) => {
  const [openPopovers, setOpenPopovers] = useState<Set<string>>(new Set());

  const togglePopover = (effectId: string) => {
    const newOpen = new Set(openPopovers);
    if (newOpen.has(effectId)) {
      newOpen.delete(effectId);
    } else {
      newOpen.add(effectId);
    }
    setOpenPopovers(newOpen);
  };

  // Get active effects from selected preset
  const getActiveEffects = () => {
    if (!selectedPresetId || !effectValues) return new Set();
    
    const activeEffects = new Set<string>();
    Object.entries(effectValues).forEach(([effectId, effectData]) => {
      const intensity = typeof effectData.intensity === 'number' ? effectData.intensity : 0;
      if (intensity > 0) {
        activeEffects.add(effectId);
      }
    });
    return activeEffects;
  };

  const activeEffects = getActiveEffects();
  const styleColor = selectedPresetId ? getStyleColor(selectedPresetId) : null;

  return (
    <div className="space-y-2">
      {ENHANCED_VISUAL_EFFECTS.map((effectConfig) => {
        const effectData = effectValues[effectConfig.id] || { intensity: 0 };
        const intensity = typeof effectData.intensity === 'number' ? effectData.intensity : 0;
        const isActive = activeEffects.has(effectConfig.id);
        const isDisabled = selectedPresetId && !isActive;
        const hasSecondaryParams = effectConfig.parameters && effectConfig.parameters.length > 1;

        return (
          <div 
            key={effectConfig.id} 
            className={cn(
              "border rounded-lg p-3 transition-all",
              isActive && styleColor ? 
                `border-[${styleColor.border}] bg-gradient-to-r from-transparent to-[${styleColor.bg}]` :
                "border-white/10 bg-white/5",
              isDisabled && "opacity-60"
            )}
            style={isActive && styleColor ? {
              borderColor: styleColor.border,
              background: `linear-gradient(90deg, transparent, ${styleColor.bg})`
            } : {}}
          >
            {/* Main effect row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                {/* Effect name with lock indicator */}
                <div className="flex items-center space-x-2 min-w-[90px]">
                  <span className={cn(
                    "text-sm font-medium text-left",
                    isActive ? "text-white" : "text-gray-400"
                  )}>
                    {effectConfig.name}
                  </span>
                  {isDisabled && (
                    <Lock className="w-3 h-3 text-gray-500" />
                  )}
                </div>

                {/* Enhanced slider */}
                <div className="flex-1">
                  <EnhancedColoredSlider
                    value={[intensity]}
                    onValueChange={(value) => onEffectChange(effectConfig.id, 'intensity', value[0])}
                    min={0}
                    max={100}
                    step={1}
                    isActive={isActive}
                    styleColor={styleColor?.primary}
                    effectName={effectConfig.name}
                    disabled={isDisabled}
                  />
                </div>

                {/* Value display */}
                <span className={cn(
                  "text-xs w-8 text-right font-medium",
                  isActive ? "text-white" : "text-gray-400"
                )}>
                  {intensity}
                </span>
              </div>

              {/* Settings button for secondary controls */}
              {hasSecondaryParams && isActive && !isDisabled && (
                <Popover 
                  open={openPopovers.has(effectConfig.id)}
                  onOpenChange={() => togglePopover(effectConfig.id)}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-2 text-gray-400 hover:text-white"
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-80 bg-gray-900 border-gray-700" 
                    side="left"
                    align="start"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 border-b border-gray-700 pb-2">
                        <span className="font-medium text-white">{effectConfig.name}</span>
                        <span className="text-xs text-gray-400">Advanced Settings</span>
                      </div>
                      
                      {effectConfig.parameters.map((param) => {
                        if (param.id === 'intensity') return null;
                        
                        const value = typeof effectData[param.id] === 'number' ? effectData[param.id] : param.defaultValue;
                        
                        if (param.type !== 'slider') return null;
                        
                        return (
                          <div key={param.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label className="text-sm text-white">{param.name}</Label>
                              <span className="text-xs text-gray-400">{value}</span>
                            </div>
                            <EnhancedColoredSlider
                              value={[Number(value)]}
                              onValueChange={(newValue) => onEffectChange(effectConfig.id, param.id, newValue[0])}
                              min={param.min || 0}
                              max={param.max || 100}
                              step={param.step || 1}
                              isActive={true}
                              styleColor={styleColor?.primary}
                              effectName={param.name}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
