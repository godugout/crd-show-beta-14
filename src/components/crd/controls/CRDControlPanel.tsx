import React, { useState } from 'react';
import { Settings, Palette, RotateCcw, Lightbulb, Zap } from 'lucide-react';
import { type AnimationMode, type LightingPreset } from '../types/CRDTypes';
import { StyleSelector } from '../styles/StyleSelector';

interface CRDControlPanelProps {
  className?: string;
  // Animation Settings
  animationMode: AnimationMode;
  animationIntensity: number;
  onAnimationModeChange: (mode: AnimationMode) => void;
  onAnimationIntensityChange: (intensity: number) => void;
  
  // Visual Style Settings
  selectedStyleId: string;
  onStyleChange: (styleId: string) => void;
  
  // Rotation Settings
  autoRotate: boolean;
  rotationSpeed: number;
  onAutoRotateChange: (enabled: boolean) => void;
  onRotationSpeedChange: (speed: number) => void;
  
  // Lighting Settings  
  lightingPreset: LightingPreset;
  lightingIntensity: number;
  onLightingPresetChange: (preset: LightingPreset) => void;
  onLightingIntensityChange: (intensity: number) => void;
}

type ControlSection = 'styles' | 'animation' | 'rotation' | 'lighting';

export const CRDControlPanel: React.FC<CRDControlPanelProps> = ({
  className = '',
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
  onLightingIntensityChange
}) => {
  const [activeSection, setActiveSection] = useState<ControlSection>('styles');
  const [isExpanded, setIsExpanded] = useState(false);

  const sections = [
    {
      id: 'styles' as ControlSection,
      label: 'Visual Styles',
      icon: Palette,
      description: 'Choose premium materials and effects'
    },
    {
      id: 'animation' as ControlSection,
      label: 'Animation',
      icon: Zap,
      description: 'Control movement and floating effects'
    },
    {
      id: 'rotation' as ControlSection,
      label: 'Rotation',
      icon: RotateCcw,
      description: 'Auto-rotate and manual controls'
    },
    {
      id: 'lighting' as ControlSection,
      label: 'Lighting',
      icon: Lightbulb,
      description: 'Lighting presets and intensity'
    }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'styles':
        return (
          <StyleSelector
            selectedStyleId={selectedStyleId}
            onStyleChange={onStyleChange}
            showLockedStyles={true}
          />
        );

      case 'animation':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Animation Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['monolith', 'ice', 'gold', 'glass', 'holo', 'showcase'] as AnimationMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => onAnimationModeChange(mode)}
                    className={`
                      px-3 py-2 text-sm rounded-md transition-all
                      ${animationMode === mode 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }
                    `}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Float Intensity: {animationIntensity.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={animationIntensity}
                onChange={(e) => onAnimationIntensityChange(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Subtle</span>
                <span>Dramatic</span>
              </div>
            </div>
          </div>
        );

      case 'rotation':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Auto-Rotate
              </label>
              <button
                onClick={() => onAutoRotateChange(!autoRotate)}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${autoRotate ? 'bg-primary' : 'bg-muted'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${autoRotate ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
            
            {autoRotate && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Rotation Speed: {rotationSpeed.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={rotationSpeed}
                  onChange={(e) => onRotationSpeedChange(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Slow</span>
                  <span>Fast</span>
                </div>
              </div>
            )}
          </div>
        );

      case 'lighting':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Lighting Preset
              </label>
              <div className="grid grid-cols-1 gap-2">
                {(['studio', 'dramatic', 'soft', 'sports-arena', 'sci-fi-arcade', 'nature-preserve'] as LightingPreset[]).map(preset => (
                  <button
                    key={preset}
                    onClick={() => onLightingPresetChange(preset)}
                    className={`
                      px-3 py-2 text-sm rounded-md transition-all text-left
                      ${lightingPreset === preset 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }
                    `}
                  >
                    <div className="font-medium">
                      {preset.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </div>
                    <div className="text-xs opacity-70">
                      {getPresetDescription(preset)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Light Intensity: {lightingIntensity.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={lightingIntensity}
                onChange={(e) => onLightingIntensityChange(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Dim</span>
                <span>Bright</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getPresetDescription = (preset: LightingPreset): string => {
    switch (preset) {
      case 'studio': return 'Professional, balanced lighting';
      case 'dramatic': return 'High contrast, moody shadows';
      case 'soft': return 'Gentle, diffused illumination';
      case 'sports-arena': return 'Bright stadium floodlights';
      case 'sci-fi-arcade': return 'Neon cyberpunk atmosphere';
      case 'nature-preserve': return 'Warm natural sunlight';
      default: return '';
    }
  };

  return (
    <div className={`bg-card/95 backdrop-blur-md border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-sm">Card Controls</span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-muted rounded-md transition-colors"
        >
          <Settings className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex border-b border-border">
        {sections.map(section => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium transition-all
                ${activeSection === section.id 
                  ? 'text-primary border-b-2 border-primary bg-primary/5' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{section.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-medium text-foreground">
            {sections.find(s => s.id === activeSection)?.label}
          </h3>
          <p className="text-xs text-muted-foreground">
            {sections.find(s => s.id === activeSection)?.description}
          </p>
        </div>
        
        {renderSectionContent()}
      </div>
    </div>
  );
};