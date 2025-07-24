import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Chrome, Zap } from 'lucide-react';

export interface CardEffects {
  chrome: boolean;
  holographic: boolean;
  foil: boolean;
}

export interface CardEffectsSettings {
  effects: CardEffects;
  effectIntensity: number;
}

interface CardEffectsControlsProps {
  effects: CardEffects;
  effectIntensity: number;
  onEffectsChange: (effects: CardEffects) => void;
  onIntensityChange: (intensity: number) => void;
  className?: string;
}

export const CardEffectsControls: React.FC<CardEffectsControlsProps> = ({
  effects,
  effectIntensity,
  onEffectsChange,
  onIntensityChange,
  className = ''
}) => {
  const handleEffectToggle = (effectName: keyof CardEffects) => {
    onEffectsChange({
      ...effects,
      [effectName]: !effects[effectName]
    });
  };

  const activeEffectsCount = Object.values(effects).filter(Boolean).length;

  return (
    <Card className={`bg-crd-dark border-crd-mediumGray ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-crd-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-crd-blue" />
          Card Effects
          {activeEffectsCount > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {activeEffectsCount} active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Effect Toggles */}
        <div className="space-y-4">
          {/* Chrome Effect */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-crd-darker">
            <div className="flex items-center gap-3">
              <Chrome className="h-4 w-4 text-crd-lightGray" />
              <div>
                <div className="text-sm font-medium text-crd-white">Chrome</div>
                <div className="text-xs text-crd-lightGray">Metallic gradient shine</div>
              </div>
            </div>
            <Switch
              checked={effects.chrome}
              onCheckedChange={() => handleEffectToggle('chrome')}
            />
          </div>

          {/* Holographic Effect */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-crd-darker">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-green-500" />
              <div>
                <div className="text-sm font-medium text-crd-white">Holographic</div>
                <div className="text-xs text-crd-lightGray">Animated rainbow gradient</div>
              </div>
            </div>
            <Switch
              checked={effects.holographic}
              onCheckedChange={() => handleEffectToggle('holographic')}
            />
          </div>

          {/* Foil Effect */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-crd-darker">
            <div className="flex items-center gap-3">
              <Zap className="h-4 w-4 text-crd-yellow" />
              <div>
                <div className="text-sm font-medium text-crd-white">Foil</div>
                <div className="text-xs text-crd-lightGray">Shimmering prismatic overlay</div>
              </div>
            </div>
            <Switch
              checked={effects.foil}
              onCheckedChange={() => handleEffectToggle('foil')}
            />
          </div>
        </div>

        {/* Intensity Slider */}
        {activeEffectsCount > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-crd-white">
                Effect Intensity
              </label>
              <span className="text-sm text-crd-lightGray">
                {Math.round(effectIntensity * 100)}%
              </span>
            </div>
            <Slider
              value={[effectIntensity * 100]}
              onValueChange={(value) => onIntensityChange(value[0] / 100)}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-crd-lightGray">
              <span>Subtle</span>
              <span>Normal</span>
              <span>Intense</span>
            </div>
          </div>
        )}

        {/* Effect Preview */}
        {activeEffectsCount > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-crd-white">Preview</div>
            <div className="h-20 rounded-lg border border-crd-mediumGray card-effect-container multi-effect overflow-hidden relative">
              <div className="absolute inset-0 bg-crd-mediumGray"></div>
              {effects.chrome && (
                <div 
                  className="effect-chrome"
                  style={{ opacity: effectIntensity }}
                ></div>
              )}
              {effects.holographic && (
                <div 
                  className="effect-holographic"
                  style={{ opacity: effectIntensity }}
                ></div>
              )}
              {effects.foil && (
                <div 
                  className="effect-foil"
                  style={{ opacity: effectIntensity }}
                ></div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-crd-white font-medium mix-blend-difference">
                  Effect Preview
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Effect Tips */}
        {activeEffectsCount === 0 && (
          <div className="text-center py-4 text-crd-lightGray">
            <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <div className="text-sm">Select effects to enhance your card</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};