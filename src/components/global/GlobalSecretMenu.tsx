
import React from 'react';
import { useGlobalSecretEffects } from '@/contexts/GlobalSecretEffectsContext';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ChevronRight, RotateCcw, Palette, Type, Sparkles } from 'lucide-react';

// Valid options based on TextEffects3D types
const TEXT_STYLES = [
  { value: 'gradient', label: 'Gradient' },
  { value: 'holographic', label: 'Holographic' },
  { value: 'neon', label: 'Neon' },
  { value: 'metallic', label: 'Metallic' },
  { value: 'crystalline', label: 'Crystalline' }
] as const;

const TEXT_ANIMATIONS = [
  { value: 'none', label: 'None' },
  { value: 'glow', label: 'Glow' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'shimmer', label: 'Shimmer' },
  { value: 'wave', label: 'Wave' },
  { value: 'typing', label: 'Typing' }
] as const;

const VISUAL_EFFECTS = [
  { id: 'chrome', label: 'Chrome', description: 'Metallic chrome finish' },
  { id: 'holographic', label: 'Holographic', description: 'Rainbow holographic effect' },
  { id: 'foil', label: 'Foil', description: 'Shimmering foil texture' },
  { id: 'rainbow', label: 'Rainbow', description: 'Color-shifting rainbow' },
  { id: 'shimmer', label: 'Shimmer', description: 'Subtle light shimmer' }
] as const;

export const GlobalSecretMenu: React.FC = () => {
  const {
    isEnabled,
    toggleEnabled,
    textStyle,
    setTextStyle,
    animation,
    setAnimation,
    intensity,
    setIntensity,
    speed,
    setSpeed,
    glowEnabled,
    setGlowEnabled,
    visualEffects,
    updateVisualEffect,
    resetTextEffects,
    resetVisualEffects,
    interactiveMode,
    setInteractiveMode
  } = useGlobalSecretEffects();

  const [isExpanded, setIsExpanded] = React.useState(false);

  if (!isEnabled) return null;

  return (
    <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50">
      <div className={`bg-crd-darker border border-crd-border rounded-r-lg shadow-2xl transition-all duration-300 ${
        isExpanded ? 'w-80' : 'w-12'
      }`}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full h-12 flex items-center justify-center text-crd-green hover:bg-crd-mediumGray/20 transition-colors rounded-r-lg"
        >
          {isExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>

        {/* Menu Content */}
        {isExpanded && (
          <div className="p-4 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Palette className="w-5 h-5 text-crd-green" />
                <h2 className="text-lg font-bold text-crd-white">Effects Lab</h2>
              </div>
              <p className="text-xs text-crd-lightGray">Real-time visual customization</p>
            </div>

            <Separator className="bg-crd-border" />

            {/* Interactive Mode */}
            <Card className="bg-crd-darkest border-crd-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-crd-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-crd-green" />
                  Interactive Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-crd-lightGray">Hover to customize</span>
                  <Switch
                    checked={interactiveMode}
                    onCheckedChange={(enabled) => setInteractiveMode(enabled)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Text Effects */}
            <Card className="bg-crd-darkest border-crd-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-crd-white flex items-center gap-2">
                    <Type className="w-4 h-4 text-crd-green" />
                    Text Effects
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetTextEffects}
                    className="h-6 px-2 text-xs text-crd-lightGray hover:text-crd-white"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {/* Style Selection */}
                <div>
                  <label className="text-xs font-medium text-crd-lightGray mb-2 block">Style</label>
                  <Select value={textStyle} onValueChange={setTextStyle}>
                    <SelectTrigger className="h-8 text-xs bg-crd-darker border-crd-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-crd-darker border-crd-border">
                      {TEXT_STYLES.map((style) => (
                        <SelectItem key={style.value} value={style.value} className="text-xs">
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Animation Selection */}
                <div>
                  <label className="text-xs font-medium text-crd-lightGray mb-2 block">Animation</label>
                  <Select value={animation} onValueChange={setAnimation}>
                    <SelectTrigger className="h-8 text-xs bg-crd-darker border-crd-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-crd-darker border-crd-border">
                      {TEXT_ANIMATIONS.map((anim) => (
                        <SelectItem key={anim.value} value={anim.value} className="text-xs">
                          {anim.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Glow Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-crd-lightGray">Glow Effect</span>
                  <Switch
                    checked={glowEnabled}
                    onCheckedChange={(checked) => setGlowEnabled(checked)}
                  />
                </div>

                {/* Intensity Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-crd-lightGray">Intensity</label>
                    <span className="text-xs text-crd-green">{(typeof intensity === 'number' ? intensity : 0.8).toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[typeof intensity === 'number' ? intensity : 0.8]}
                    onValueChange={([value]) => setIntensity(value)}
                    min={0.1}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Speed Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-crd-lightGray">Speed</label>
                    <span className="text-xs text-crd-green">{(typeof speed === 'number' ? speed : 1.5).toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[typeof speed === 'number' ? speed : 1.5]}
                    onValueChange={([value]) => setSpeed(value)}
                    min={0.5}
                    max={3.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Visual Effects */}
            <Card className="bg-crd-darkest border-crd-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-crd-white">Visual Effects</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetVisualEffects}
                    className="h-6 px-2 text-xs text-crd-lightGray hover:text-crd-white"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {VISUAL_EFFECTS.map((effect) => {
                  const effectConfig = visualEffects[effect.id as keyof typeof visualEffects];
                  const isEnabled = typeof effectConfig?.enabled === 'boolean' ? effectConfig.enabled : false;
                  const effectIntensity = typeof effectConfig?.intensity === 'number' ? effectConfig.intensity : 0.5;
                  const effectSpeed = typeof effectConfig?.speed === 'number' ? effectConfig.speed : 1.0;

                  return (
                    <div key={effect.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-medium text-crd-white">{effect.label}</span>
                          <p className="text-xs text-crd-lightGray">{effect.description}</p>
                        </div>
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={(enabled) => updateVisualEffect(effect.id, 'enabled', enabled)}
                        />
                      </div>

                      {isEnabled && (
                        <div className="ml-4 space-y-2">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-crd-lightGray">Intensity</span>
                              <span className="text-xs text-crd-green">{effectIntensity.toFixed(1)}</span>
                            </div>
                            <Slider
                              value={[effectIntensity]}
                              onValueChange={([value]) => updateVisualEffect(effect.id, 'intensity', value)}
                              min={0.1}
                              max={1.0}
                              step={0.1}
                              className="w-full"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-crd-lightGray">Speed</span>
                              <span className="text-xs text-crd-green">{effectSpeed.toFixed(1)}</span>
                            </div>
                            <Slider
                              value={[effectSpeed]}
                              onValueChange={([value]) => updateVisualEffect(effect.id, 'speed', value)}
                              min={0.5}
                              max={2.0}
                              step={0.1}
                              className="w-full"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
