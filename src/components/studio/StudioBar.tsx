import React, { useState } from 'react';
import { Play, Pause, RotateCw, Palette, ChevronUp, X, Orbit, Lightbulb, Package, Zap, Sparkles, Waves } from 'lucide-react';
import { CRDVisualStyles } from '@/components/crd/styles/StyleRegistry';
import { type AnimationMode, type LightingPreset } from '@/components/crd/types/CRDTypes';

interface StudioBarProps {
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
  
  // Studio controls
  onClose: () => void;
}

type TabId = 'animation' | 'materials' | 'rotation' | 'lighting';

export const StudioBar: React.FC<StudioBarProps> = ({
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
  enableGlassCase = false,
  onEnableGlassCaseChange,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('materials');
  const [isExpanded, setIsExpanded] = useState(true);

  const tabs = [
    { id: 'animation' as TabId, name: 'Animation', icon: Play },
    { id: 'materials' as TabId, name: 'Materials', icon: Palette },
    { id: 'rotation' as TabId, name: 'Motion', icon: Orbit },
    { id: 'lighting' as TabId, name: 'Lighting', icon: Lightbulb }
  ];

  const activeStyle = CRDVisualStyles.find(s => s.id === selectedStyleId);

  // Quick action handlers for animation presets
  const handleAnimationPreset = (preset: AnimationMode) => {
    onAnimationModeChange(preset);
  };

  const handleLightingPreset = (preset: LightingPreset) => {
    onLightingPresetChange(preset);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-crd-dark/95 backdrop-blur-xl border-t border-crd-gray/20 shadow-2xl">
      {/* Top Bar - Always Visible */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-crd-gray/10">
        {/* Left: Studio Title */}
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-crd-orange animate-pulse" />
          <h3 className="text-white font-semibold">3D Studio</h3>
        </div>

        {/* Center: Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Animation Presets */}
          <button
            onClick={() => handleAnimationPreset('monolith')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              animationMode === 'monolith' 
                ? 'bg-crd-orange text-white' 
                : 'bg-crd-gray/20 text-crd-lightGray hover:bg-crd-gray/30'
            }`}
          >
            <Zap className="w-3 h-3 inline mr-1" />
            Monolith
          </button>
          
          <button
            onClick={() => handleAnimationPreset('showcase')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              animationMode === 'showcase' 
                ? 'bg-crd-orange text-white' 
                : 'bg-crd-gray/20 text-crd-lightGray hover:bg-crd-gray/30'
            }`}
          >
            <Sparkles className="w-3 h-3 inline mr-1" />
            Showcase
          </button>

          <button
            onClick={() => handleAnimationPreset('holo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              animationMode === 'holo' 
                ? 'bg-crd-orange text-white' 
                : 'bg-crd-gray/20 text-crd-lightGray hover:bg-crd-gray/30'
            }`}
          >
            <Waves className="w-3 h-3 inline mr-1" />
            Holo
          </button>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          {/* Expand/Collapse Toggle */}
          <button
            onClick={toggleExpanded}
            className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all ${
              isExpanded 
                ? 'border-primary bg-primary/20 text-primary' 
                : 'border-crd-gray/30 hover:border-crd-gray/50 text-crd-lightGray hover:text-white'
            }`}
            title={isExpanded ? "Collapse Studio" : "Expand Studio"}
          >
            <ChevronUp className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-red-500/30 hover:border-red-500 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
            title="Close Studio"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-3">
          {/* Segmented Control Navigation */}
          <div className="relative bg-crd-gray/5 p-0.5 rounded-xl mb-4 border border-crd-gray/10">
            {/* Sliding indicator */}
            <div 
              className="absolute top-0.5 bottom-0.5 bg-gradient-to-r from-crd-orange to-crd-orange/80 rounded-lg transition-all duration-300 ease-out shadow-lg"
              style={{
                width: `${100 / tabs.length}%`,
                left: `${tabs.findIndex(t => t.id === activeTab) * (100 / tabs.length)}%`
              }}
            />
            
            {/* Tab buttons */}
            <div className="relative flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative z-10 ${
                      isActive
                        ? 'text-white'
                        : 'text-crd-lightGray hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {/* Animation Controls */}
            {activeTab === 'animation' && (
              <div className="space-y-4">
                {/* Animation Mode - Compact Pills */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-crd-lightGray">Mode</span>
                  <div className="flex gap-1 bg-crd-gray/5 p-1 rounded-lg border border-crd-gray/10">
                    {(['monolith', 'showcase', 'holo'] as AnimationMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => onAnimationModeChange(mode)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all capitalize ${
                          animationMode === mode
                            ? 'bg-crd-orange text-white shadow-sm'
                            : 'text-crd-lightGray hover:text-white hover:bg-crd-gray/20'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Intensity - Inline Slider */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-crd-lightGray min-w-0">Intensity</span>
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={animationIntensity}
                      onChange={(e) => onAnimationIntensityChange(parseFloat(e.target.value))}
                      className="flex-1 h-1.5 bg-crd-gray/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-crd-orange [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                    />
                    <span className="text-xs text-crd-lightGray min-w-[2rem] text-right">{animationIntensity.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Materials Controls */}
            {activeTab === 'materials' && (
              <div className="space-y-3">
                {/* High-density material grid */}
                <div className="grid grid-cols-10 gap-1.5">
                  {CRDVisualStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => onStyleChange(style.id)}
                      className={`aspect-square rounded-lg border transition-all relative overflow-hidden group hover:scale-110 hover:z-10 ${
                        selectedStyleId === style.id
                          ? 'border-crd-orange shadow-lg shadow-crd-orange/25 ring-2 ring-crd-orange/30'
                          : 'border-crd-gray/30 hover:border-crd-orange/50'
                      }`}
                      style={{
                        background: style.uiPreviewGradient
                      }}
                      title={style.displayName}
                    >
                      {style.locked && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Package className="w-3 h-3 text-white/80" />
                        </div>
                      )}
                      
                      {/* Hover tooltip */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                        {style.displayName}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Active style info - compact */}
                {activeStyle && (
                  <div className="flex items-center justify-between p-2 bg-crd-gray/5 rounded-lg border border-crd-gray/10">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border border-crd-gray/30"
                        style={{ background: activeStyle.uiPreviewGradient }}
                      />
                      <div>
                        <div className="text-white text-sm font-medium">{activeStyle.displayName}</div>
                        <div className="text-crd-lightGray text-xs">{activeStyle.visualVibe}</div>
                      </div>
                    </div>
                    <div className="text-crd-lightGray text-xs">{activeStyle.category}</div>
                  </div>
                )}
              </div>
            )}

            {/* Rotation Controls */}
            {activeTab === 'rotation' && (
              <div className="space-y-4">
                {/* Card Rotation */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-crd-lightGray">Auto Rotate</span>
                    <button
                      onClick={() => onAutoRotateChange(!autoRotate)}
                      className={`relative w-10 h-5 rounded-full transition-all duration-200 ${
                        autoRotate ? 'bg-crd-orange shadow-lg shadow-crd-orange/25' : 'bg-crd-gray/30'
                      }`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 shadow-sm ${
                        autoRotate ? 'translate-x-5' : ''
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-crd-lightGray min-w-0">Speed</span>
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={rotationSpeed}
                        onChange={(e) => onRotationSpeedChange(parseFloat(e.target.value))}
                        disabled={!autoRotate}
                        className="flex-1 h-1.5 bg-crd-gray/20 rounded-lg appearance-none cursor-pointer disabled:opacity-50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-crd-orange [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                      />
                      <span className="text-xs text-crd-lightGray min-w-[2rem] text-right">{rotationSpeed.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Orbital Ring */}
                <div className="space-y-3 pt-3 border-t border-crd-gray/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-crd-lightGray">Orbital Ring</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onShowOrbitalRingChange?.(!showOrbitalRing)}
                        className={`px-2 py-1 rounded text-xs transition-all ${
                          showOrbitalRing ? 'bg-crd-orange text-white' : 'bg-crd-gray/20 text-crd-lightGray hover:bg-crd-gray/30'
                        }`}
                      >
                        Show
                      </button>
                      <button
                        onClick={() => onOrbitalAutoRotateChange?.(!orbitalAutoRotate)}
                        className={`px-2 py-1 rounded text-xs transition-all ${
                          orbitalAutoRotate ? 'bg-crd-orange text-white' : 'bg-crd-gray/20 text-crd-lightGray hover:bg-crd-gray/30'
                        }`}
                      >
                        Auto
                      </button>
                    </div>
                  </div>

                  {(showOrbitalRing || orbitalAutoRotate) && (
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-crd-lightGray min-w-0">Ring Speed</span>
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="range"
                          min="0.1"
                          max="2"
                          step="0.1"
                          value={orbitalRotationSpeed}
                          onChange={(e) => onOrbitalRotationSpeedChange?.(parseFloat(e.target.value))}
                          disabled={!orbitalAutoRotate}
                          className="flex-1 h-1.5 bg-crd-gray/20 rounded-lg appearance-none cursor-pointer disabled:opacity-50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-crd-orange [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                        />
                        <span className="text-xs text-crd-lightGray min-w-[2rem] text-right">{orbitalRotationSpeed?.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lighting Controls */}
            {activeTab === 'lighting' && (
              <div className="space-y-4">
                {/* Lighting Preset - Compact Pills */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-crd-lightGray">Preset</span>
                  <div className="flex gap-1 bg-crd-gray/5 p-1 rounded-lg border border-crd-gray/10">
                    {(['studio', 'dramatic', 'soft'] as LightingPreset[]).map((preset) => (
                      <button
                        key={preset}
                        onClick={() => onLightingPresetChange(preset)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all capitalize ${
                          lightingPreset === preset
                            ? 'bg-crd-orange text-white shadow-sm'
                            : 'text-crd-lightGray hover:text-white hover:bg-crd-gray/20'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Intensity - Inline Slider */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-crd-lightGray min-w-0">Intensity</span>
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="range"
                      min="0.1"
                      max="2"
                      step="0.1"
                      value={lightingIntensity}
                      onChange={(e) => onLightingIntensityChange(parseFloat(e.target.value))}
                      className="flex-1 h-1.5 bg-crd-gray/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-crd-orange [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                    />
                    <span className="text-xs text-crd-lightGray min-w-[2rem] text-right">{lightingIntensity.toFixed(1)}</span>
                  </div>
                </div>

                {/* Glass Case - Toggle */}
                <div className="flex items-center justify-between pt-3 border-t border-crd-gray/10">
                  <span className="text-sm font-medium text-crd-lightGray">Glass Case</span>
                  <button
                    onClick={() => onEnableGlassCaseChange?.(!enableGlassCase)}
                    className={`relative w-10 h-5 rounded-full transition-all duration-200 ${
                      enableGlassCase ? 'bg-crd-orange shadow-lg shadow-crd-orange/25' : 'bg-crd-gray/30'
                    }`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 shadow-sm ${
                      enableGlassCase ? 'translate-x-5' : ''
                    }`} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};