import React, { useState } from 'react';
import { Play, Pause, RotateCw, Palette, ChevronUp, X, Orbit, Lightbulb, Package, Zap, Sparkles, Waves, MousePointer } from 'lucide-react';
import { CRDVisualStyles } from '../styles/StyleRegistry';
import { type AnimationMode, type LightingPreset } from '../types/CRDTypes';
import { UserTracker } from '../tracking/UserTracker';
import { useFirstMaterialSelection } from '@/hooks/useFirstMaterialSelection';
import { useGlowState } from '@/hooks/useGlowState';

interface CRDStickyFooterProps {
  // Animation controls
  animationMode: AnimationMode;
  animationIntensity: number;
  onAnimationModeChange: (mode: AnimationMode) => void;
  onAnimationIntensityChange: (intensity: number) => void;
  
  // Visual style controls
  selectedStyleId: string;
  onStyleChange: (styleId: string) => void;
  
  // Rotation controls
  autoRotate: boolean;
  rotationSpeed: number;
  onAutoRotateChange: (enabled: boolean) => void;
  onRotationSpeedChange: (speed: number) => void;
  
  // Lighting controls
  lightingPreset: LightingPreset;
  lightingIntensity: number;
  onLightingPresetChange: (preset: LightingPreset) => void;
  onLightingIntensityChange: (intensity: number) => void;
  
  // Orbital controls
  orbitalAutoRotate?: boolean;
  orbitalRotationSpeed?: number;
  showOrbitalRing?: boolean;
  showLockIndicators?: boolean;
  onOrbitalAutoRotateChange?: (enabled: boolean) => void;
  onOrbitalRotationSpeedChange?: (speed: number) => void;
  onShowOrbitalRingChange?: (show: boolean) => void;
  onShowLockIndicatorsChange?: (show: boolean) => void;

  // Glass case controls
  enableGlassCase?: boolean;
  onEnableGlassCaseChange?: (enabled: boolean) => void;

  // User tracking controls
  enableUserTracking?: boolean;
  onEnableUserTrackingChange?: (enabled: boolean) => void;
  cardAngle?: number;
  cameraDistance?: number;
  animationProgress?: number;

  // Engagement tracking
  onMaterialSelectionTracked?: (styleId: string) => void;
}

type TabId = 'animation' | 'materials' | 'rotation' | 'lighting' | 'tracking';

export const CRDStickyFooter: React.FC<CRDStickyFooterProps> = ({
  animationMode,
  animationIntensity,
  onAnimationModeChange,
  onAnimationIntensityChange,
  selectedStyleId,
  onStyleChange,
  autoRotate,
  rotationSpeed,
  onAutoRotateChange,
  onRotationSpeedChange,
  lightingPreset,
  lightingIntensity,
  onLightingPresetChange,
  onLightingIntensityChange,
  orbitalAutoRotate = true,
  orbitalRotationSpeed = 1,
  showOrbitalRing = true,
  showLockIndicators = false,
  onOrbitalAutoRotateChange,
  onOrbitalRotationSpeedChange,
  onShowOrbitalRingChange,
  onShowLockIndicatorsChange,
  enableGlassCase = true,
  onEnableGlassCaseChange,
  enableUserTracking = false,
  onEnableUserTrackingChange,
  cardAngle = 0,
  cameraDistance = 10,
  animationProgress = 0,
  onMaterialSelectionTracked
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('animation');

  // Engagement tracking for box icon glow
  const { shouldShowBoxGlow, onMaterialSelect } = useFirstMaterialSelection();
  const { isGlowing: isBoxGlowing } = useGlowState({ 
    duration: 4000,
    pulseSpeed: 900
  });

  // Handle material selection with tracking
  const handleStyleChange = (styleId: string) => {
    onStyleChange(styleId);
    onMaterialSelect(styleId);
    onMaterialSelectionTracked?.(styleId);
  };

  const animationModes: { id: AnimationMode; name: string; icon: React.ComponentType<any> }[] = [
    { id: 'monolith', name: 'Monolith', icon: Zap },
    { id: 'showcase', name: 'Showcase', icon: Waves },
    { id: 'ice', name: 'Ice', icon: Sparkles },
    { id: 'gold', name: 'Gold', icon: Lightbulb },
    { id: 'glass', name: 'Glass', icon: Package },
    { id: 'holo', name: 'Holo', icon: Orbit }
  ];

  const lightingPresets: { id: LightingPreset; name: string }[] = [
    { id: 'studio', name: 'Studio' },
    { id: 'dramatic', name: 'Dramatic' },
    { id: 'soft', name: 'Soft' },
    { id: 'showcase', name: 'Showcase' }
  ];

  const tabs = [
    { id: 'animation' as TabId, name: 'Animation', icon: Play },
    { id: 'materials' as TabId, name: 'Materials', icon: Palette },
    { id: 'rotation' as TabId, name: 'Motion', icon: Orbit },
    { id: 'lighting' as TabId, name: 'Lighting', icon: Lightbulb },
    { id: 'tracking' as TabId, name: 'Tracking', icon: MousePointer }
  ];

  const activeStyle = CRDVisualStyles.find(s => s.id === selectedStyleId);

  // Quick action handlers for animation presets
  const handleAnimationPreset = (preset: AnimationMode) => {
    onAnimationModeChange(preset);
    onAnimationIntensityChange(1); // Reset intensity to default
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Main Toolbar Bar */}
      <div className="bg-background/90 backdrop-blur-md border-t border-white/10 px-6 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left: Quick Access Buttons */}
          <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
            {/* Rotation Toggle */}
            <button
              onClick={() => onAutoRotateChange(!autoRotate)}
              className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all ${
                autoRotate
                  ? 'border-primary bg-primary/20 text-primary'
                  : 'border-white/20 hover:border-white/40 text-foreground/70'
              }`}
              title={autoRotate ? 'Stop Rotation' : 'Start Rotation'}
            >
              {autoRotate ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            {/* Materials Ring Toggle */}
            <button
              onClick={() => onShowOrbitalRingChange?.(!showOrbitalRing)}
              className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all ${
                showOrbitalRing
                  ? 'border-primary bg-primary/20 text-primary'
                  : 'border-white/20 hover:border-white/40 text-foreground/70'
              }`}
              title={showOrbitalRing ? 'Hide Materials Ring' : 'Show Materials Ring'}
            >
              <Orbit className="w-5 h-5" />
            </button>

            {/* Case Toggle with Glow Effect */}
            <button
              onClick={() => onEnableGlassCaseChange?.(!enableGlassCase)}
              className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all ${
                enableGlassCase
                  ? 'border-primary bg-primary/20 text-primary'
                  : 'border-white/20 hover:border-white/40 text-foreground/70'
              } ${shouldShowBoxGlow ? 'glow-primary glow-pulse' : ''}`}
              title={enableGlassCase ? 'Remove Case' : 'Add Case'}
            >
              <Package className="w-5 h-5" />
            </button>

            {/* Animation Presets */}
            <div className="h-8 w-px bg-white/20 mx-2"></div>
            
            {/* All 6 Animation Mode Buttons */}
            {animationModes.slice(0, 6).map((mode) => (
              <button
                key={mode.id}
                onClick={() => handleAnimationPreset(mode.id)}
                className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all ${
                  animationMode === mode.id
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-white/20 hover:border-white/40 text-foreground/70'
                }`}
                title={`${mode.name} Animation`}
              >
                <mode.icon className="w-5 h-5" />
              </button>
            ))}
          </div>

          {/* Center: Condensed Card Info */}
          <div className="flex items-center justify-center space-x-4 flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
              <span className="text-sm font-medium truncate">
                {activeStyle?.displayName || 'Unknown'}
              </span>
            </div>
            <div className="h-5 w-px bg-white/20 flex-shrink-0"></div>
            <span className="text-sm text-foreground/70 font-medium">
              {animationMode.toUpperCase()}
            </span>
            <div className="h-5 w-px bg-white/20 flex-shrink-0"></div>
            <span className="text-sm text-foreground/70 capitalize">
              {lightingPreset}
            </span>
            <div className="h-5 w-px bg-white/20 flex-shrink-0"></div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="text-xs text-green-300 font-medium">Ready</span>
            </div>
          </div>

          {/* Right: Expansion Toggle */}
          <div className="flex items-center justify-end min-w-0 flex-shrink-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-white/20 hover:border-white/40 text-foreground/70 transition-all"
              title="Advanced Settings"
            >
              <ChevronUp className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Content */}
      <div className={`bg-background/95 backdrop-blur-md transition-all duration-300 overflow-hidden ${
        isOpen ? 'h-80' : 'h-0'
      }`}>
        <div className="h-full flex flex-col">
          {/* Tab Navigation */}
          <div className="flex border-b border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary/20 text-primary border-b-2 border-primary'
                    : 'hover:bg-white/5 text-foreground/70'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-6">
            {activeTab === 'animation' && (
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-semibold mb-4">Animation Modes</h3>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {animationModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => onAnimationModeChange(mode.id)}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                        animationMode === mode.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-white/20 hover:border-white/40 text-foreground/80'
                      }`}
                    >
                      <mode.icon className="w-6 h-6" />
                      <div className="font-medium text-sm">{mode.name}</div>
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-sm font-medium text-foreground/80 mb-2 block">
                      Intensity: {animationIntensity.toFixed(1)}x
                    </span>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={animationIntensity}
                      onChange={(e) => onAnimationIntensityChange(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-semibold mb-4">Visual Materials</h3>
                <div className="grid grid-cols-6 gap-3">
                   {CRDVisualStyles.map((style) => (
                     <button
                       key={style.id}
                       onClick={() => handleStyleChange(style.id)}
                       className={`aspect-square rounded-lg border-2 transition-all relative overflow-hidden ${
                         selectedStyleId === style.id
                           ? 'border-primary ring-2 ring-primary/30'
                           : 'border-white/20 hover:border-white/40'
                       }`}
                      style={{
                        background: style.uiPreviewGradient || '#333',
                      }}
                      title={style.displayName}
                    >
                      {style.locked && !showLockIndicators && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                        {style.displayName}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'rotation' && (
              <div className="h-full flex flex-col space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Card Rotation</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Auto Rotate</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoRotate}
                          onChange={(e) => onAutoRotateChange(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    {autoRotate && (
                      <div>
                        <label className="block">
                          <span className="text-sm font-medium text-foreground/80 mb-2 block">
                            Speed: {rotationSpeed.toFixed(1)}x
                          </span>
                          <input
                            type="range"
                            min="0.1"
                            max="3"
                            step="0.1"
                            value={rotationSpeed}
                            onChange={(e) => onRotationSpeedChange(parseFloat(e.target.value))}
                            className="w-full"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Orbital Ring</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto Orbit</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={orbitalAutoRotate}
                            onChange={(e) => onOrbitalAutoRotateChange?.(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Show Ring</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showOrbitalRing}
                            onChange={(e) => onShowOrbitalRingChange?.(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                    {orbitalAutoRotate && (
                      <div>
                        <label className="block">
                          <span className="text-sm font-medium text-foreground/80 mb-2 block">
                            Orbit Speed: {orbitalRotationSpeed?.toFixed(1)}x
                          </span>
                          <input
                            type="range"
                            min="0.1"
                            max="5"
                            step="0.1"
                            value={orbitalRotationSpeed}
                            onChange={(e) => onOrbitalRotationSpeedChange?.(parseFloat(e.target.value))}
                            className="w-full"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'lighting' && (
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-semibold mb-4">Lighting Setup</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {lightingPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => onLightingPresetChange(preset.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        lightingPreset === preset.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-white/20 hover:border-white/40 text-foreground/80'
                      }`}
                    >
                      <div className="font-medium">{preset.name}</div>
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-sm font-medium text-foreground/80 mb-2 block">
                      Intensity: {lightingIntensity.toFixed(1)}x
                    </span>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={lightingIntensity}
                      onChange={(e) => onLightingIntensityChange(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'tracking' && (
              <div className="h-full">
                <UserTracker
                  enabled={enableUserTracking || false}
                  onToggle={onEnableUserTrackingChange || (() => {})}
                  cardAngle={cardAngle}
                  cameraDistance={cameraDistance}
                  animationProgress={animationProgress}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};