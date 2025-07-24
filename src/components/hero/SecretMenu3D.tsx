import React from 'react';
import { X, RotateCcw, Sparkles } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Typography } from '@/components/ui/design-system/Typography';
import type { TextEffectStyle, TextAnimation } from './TextEffects3D';

interface SecretMenu3DProps {
  isOpen: boolean;
  onClose: () => void;
  textStyle: TextEffectStyle;
  onTextStyleChange: (style: TextEffectStyle) => void;
  animation: TextAnimation;
  onAnimationChange: (animation: TextAnimation) => void;
  intensity: number;
  onIntensityChange: (intensity: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  glowEnabled: boolean;
  onGlowChange: (enabled: boolean) => void;
  onReset: () => void;
}

const textStyles: { key: TextEffectStyle; name: string; description: string }[] = [
  { key: 'gradient', name: 'Gradient', description: 'Multi-color gradient text' },
  { key: 'holographic', name: 'Holographic', description: 'Iridescent rainbow effect' },
  { key: 'neon', name: 'Neon', description: 'Glowing neon sign style' },
  { key: 'metallic', name: 'Metallic', description: 'Shiny metallic finish' },
  { key: 'crystalline', name: 'Crystalline', description: 'Crystal-like refraction' }
];

const animations: { key: TextAnimation; name: string; description: string }[] = [
  { key: 'none', name: 'Static', description: 'No animation' },
  { key: 'glow', name: 'Glow', description: 'Pulsing glow effect' },
  { key: 'pulse', name: 'Pulse', description: 'Breathing animation' },
  { key: 'shimmer', name: 'Shimmer', description: 'Shimmering light sweep' },
  { key: 'wave', name: 'Wave', description: '3D wave distortion' }
];

export const SecretMenu3D: React.FC<SecretMenu3DProps> = ({
  isOpen,
  onClose,
  textStyle,
  onTextStyleChange,
  animation,
  onAnimationChange,
  intensity,
  onIntensityChange,
  speed,
  onSpeedChange,
  glowEnabled,
  onGlowChange,
  onReset
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-crd-darkest/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Secret Menu Panel */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-scale-in">
        <div className="bg-crd-dark/95 backdrop-blur-lg border border-crd-border rounded-2xl p-6 w-96 max-w-[90vw] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-crd-green" />
              <Typography variant="h4" className="text-crd-white">
                Text Effects Lab
              </Typography>
            </div>
            <CRDButton
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="w-4 h-4" />
            </CRDButton>
          </div>

          {/* Text Style Selection */}
          <div className="space-y-4">
            <Typography variant="label" className="text-crd-lightGray">
              Text Style
            </Typography>
            <div className="grid grid-cols-2 gap-2">
              {textStyles.map((style) => (
                <button
                  key={style.key}
                  onClick={() => onTextStyleChange(style.key)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    textStyle === style.key
                      ? 'border-crd-green bg-crd-green/10 text-crd-green'
                      : 'border-crd-border bg-crd-darker text-crd-lightGray hover:border-crd-green/50'
                  }`}
                >
                  <div className="font-medium text-sm">{style.name}</div>
                  <div className="text-xs opacity-70">{style.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Animation Selection */}
          <div className="space-y-4 mt-6">
            <Typography variant="label" className="text-crd-lightGray">
              Animation
            </Typography>
            <div className="grid grid-cols-2 gap-2">
              {animations.map((anim) => (
                <button
                  key={anim.key}
                  onClick={() => onAnimationChange(anim.key)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    animation === anim.key
                      ? 'border-crd-green bg-crd-green/10 text-crd-green'
                      : 'border-crd-border bg-crd-darker text-crd-lightGray hover:border-crd-green/50'
                  }`}
                >
                  <div className="font-medium text-xs">{anim.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4 mt-6">
            {/* Intensity */}
            <div>
              <Typography variant="label" className="text-crd-lightGray mb-2 block">
                Intensity: {Math.round(intensity * 100)}%
              </Typography>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={intensity}
                onChange={(e) => onIntensityChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-crd-darker rounded-lg appearance-none cursor-pointer slider-thumb"
              />
            </div>

            {/* Speed */}
            <div>
              <Typography variant="label" className="text-crd-lightGray mb-2 block">
                Speed: {speed}x
              </Typography>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={speed}
                onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-crd-darker rounded-lg appearance-none cursor-pointer slider-thumb"
              />
            </div>

            {/* Glow Toggle */}
            <div className="flex justify-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={glowEnabled}
                  onChange={(e) => onGlowChange(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  glowEnabled 
                    ? 'border-crd-green bg-crd-green' 
                    : 'border-crd-border bg-transparent'
                }`}>
                  {glowEnabled && (
                    <div className="w-2 h-2 bg-crd-darkest rounded-sm" />
                  )}
                </div>
                <Typography variant="caption" className="text-crd-lightGray">
                  Glow Effect
                </Typography>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-6">
            <CRDButton
              variant="outline"
              size="sm"
              onClick={onReset}
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </CRDButton>
            <CRDButton
              variant="primary"
              size="sm"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </CRDButton>
          </div>

          {/* Easter Egg Info */}
          <div className="mt-4 p-3 bg-crd-darker/50 rounded-lg">
            <Typography variant="caption" className="text-crd-lightGray/70 text-center">
              🎮 Try: Ctrl+Shift+3+D or ↑↑↓↓←→←→BA
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
};