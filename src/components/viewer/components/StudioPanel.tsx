
import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { ScrollableStudioContent } from './studio/ScrollableStudioContent';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings, EnvironmentControls } from '../types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface StudioPanelProps {
  isVisible: boolean;
  onClose: () => void;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  effectValues: EffectValues;
  overallBrightness: number[];
  interactiveLighting: boolean;
  materialSettings: MaterialSettings;
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  onApplyCombo: (combo: any) => void;
  isApplyingPreset?: boolean;
  environmentControls?: EnvironmentControls;
  onEnvironmentControlsChange?: (controls: EnvironmentControls) => void;
  onResetCamera?: () => void;
  solidCardTransition: boolean;
  onSolidCardTransitionChange: (value: boolean) => void;
}

export const StudioPanel: React.FC<StudioPanelProps> = ({
  isVisible,
  onClose,
  solidCardTransition,
  onSolidCardTransitionChange,
  ...studioProps
}) => {
  if (!isVisible) return null;

  const panelWidth = 320;

  return (
    <div 
      className="fixed top-0 right-0 h-full z-50" 
      style={{ width: `${panelWidth}px` }}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="h-full bg-black bg-opacity-95 backdrop-blur-lg border-l border-white/10 flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between min-h-[3.5rem]">
          <h2 className="text-lg font-semibold text-white leading-none flex items-center space-x-2 mt-2">
            <Sparkles className="w-5 h-5 text-crd-green flex-shrink-0 -mt-0.5" />
            <span>Studio</span>
          </h2>
          <button 
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-white hover:text-gray-300 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Performance Settings Section */}
        <div className="p-4 border-b border-white/10">
          <h3 className="text-sm font-semibold text-white mb-3">Performance & Display</h3>
          
          {/* Solid Card Transition */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <Label htmlFor="solid-transition" className="text-white cursor-pointer font-medium">
                Solid Card Flip
              </Label>
              <p className="text-xs text-gray-400 mt-1">
                Disables fade effect for smoother card rotation
              </p>
            </div>
            <Switch
              id="solid-transition"
              checked={solidCardTransition}
              onCheckedChange={onSolidCardTransitionChange}
            />
          </div>

          {/* Performance hint */}
          <div className="p-2 rounded bg-crd-green/10 border border-crd-green/20">
            <p className="text-xs text-crd-green">
              💡 Enable for better performance on mobile devices
            </p>
          </div>
        </div>

        {/* Studio Content with Scroll Support */}
        <ScrollableStudioContent {...studioProps} />
      </div>
    </div>
  );
};
