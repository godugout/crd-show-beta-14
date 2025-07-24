import React from 'react';
import { CRDCard } from '@/components/ui/design-system/Card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { CRDBadge } from '@/components/ui/design-system/Badge';
import { useColorRotation } from '@/hooks/useColorRotation';
import { Palette, RotateCcw, Sparkles, Eye, Shuffle } from 'lucide-react';

export const ColorRotationControls = () => {
  const {
    rotationState,
    currentPalette,
    setGlassLevel,
    getGlassLevels,
    rotateColors,
    setHueShift,
    getHueShifts,
    toggleColorCycling,
    resetColorState,
    isModified
  } = useColorRotation();

  if (!currentPalette) {
    return (
      <CRDCard variant="flat" padding="default">
        <div className="text-center text-themed-secondary">
          <Palette className="mx-auto mb-2" size={24} />
          <p>No theme selected</p>
        </div>
      </CRDCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-themed-primary">Color Rotation Controls</h3>
          <p className="text-sm text-themed-secondary">Adjust brightness and color variations</p>
        </div>
        {isModified && (
          <CRDButton
            variant="ghost"
            size="sm"
            onClick={resetColorState}
            icon={<RotateCcw size={16} />}
          >
            Reset
          </CRDButton>
        )}
      </div>

      {/* Current Theme Info */}
      <CRDCard variant="flat" padding="sm">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <div 
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: currentPalette.colors.primary }}
            />
            <div 
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: currentPalette.colors.secondary }}
            />
            <div 
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: currentPalette.colors.accent }}
            />
            <div 
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: currentPalette.colors.neutral }}
            />
          </div>
          <div>
            <p className="font-medium text-themed-primary">{currentPalette.name}</p>
            <p className="text-xs text-themed-secondary">{currentPalette.description}</p>
          </div>
        </div>
      </CRDCard>

      {/* Glass Brightness Control */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Eye size={16} className="text-themed-active" />
          <h4 className="font-medium text-themed-primary">Brightness Control</h4>
          <CRDBadge variant="secondary" size="sm">
            {getGlassLevels().find(l => l.value === rotationState.glassLevel)?.label}
          </CRDBadge>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {getGlassLevels().map((level) => (
            <CRDButton
              key={level.value}
              variant={rotationState.glassLevel === level.value ? "primary" : "ghost"}
              size="sm"
              onClick={() => setGlassLevel(level.value)}
              className="text-left"
            >
              <div>
                <div className="font-medium">{level.label}</div>
                <div className="text-xs opacity-75">{level.description}</div>
              </div>
            </CRDButton>
          ))}
        </div>
      </div>

      {/* Color Rotation */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Shuffle size={16} className="text-themed-active" />
          <h4 className="font-medium text-themed-primary">Color Rotation</h4>
          <CRDBadge variant="secondary" size="sm">
            {rotationState.colorRotation === 0 ? 'Original' : `+${rotationState.colorRotation}`}
          </CRDBadge>
        </div>
        
        <div className="grid grid-cols-4 gap-1">
          {[0, 1, 2, 3].map((rotation) => (
            <CRDButton
              key={rotation}
              variant={rotationState.colorRotation === rotation ? "primary" : "ghost"}
              size="sm"
              onClick={() => rotateColors(rotation as any)}
            >
              {rotation === 0 ? 'Orig' : `+${rotation}`}
            </CRDButton>
          ))}
        </div>
      </div>

      {/* Hue Shift */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Palette size={16} className="text-themed-active" />
          <h4 className="font-medium text-themed-primary">Hue Shift</h4>
          <CRDBadge variant="secondary" size="sm">
            {rotationState.hueShift}°
          </CRDBadge>
        </div>
        
        <div className="grid grid-cols-4 gap-1">
          {getHueShifts().slice(0, 8).map((shift) => (
            <CRDButton
              key={shift.value}
              variant={rotationState.hueShift === shift.value ? "primary" : "ghost"}
              size="sm"
              onClick={() => setHueShift(shift.value)}
              title={shift.description}
            >
              {shift.label}
            </CRDButton>
          ))}
        </div>
      </div>

      {/* Color Cycling */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Sparkles size={16} className="text-themed-active" />
          <h4 className="font-medium text-themed-primary">Dynamic Effects</h4>
          {rotationState.isColorCycling && (
            <CRDBadge variant="primary" size="sm">Active</CRDBadge>
          )}
        </div>
        
        <CRDButton
          variant={rotationState.isColorCycling ? "primary" : "secondary"}
          onClick={toggleColorCycling}
          icon={<Sparkles size={16} />}
        >
          {rotationState.isColorCycling ? 'Stop' : 'Start'} Color Cycling
        </CRDButton>
      </div>

      {/* Visual Dopamine Tip */}
      <CRDCard variant="flat" padding="sm" className="border border-themed-secondary/20">
        <div className="flex items-start space-x-2">
          <Sparkles size={16} className="text-themed-active mt-0.5" />
          <div className="text-xs text-themed-secondary">
            <p className="font-medium text-themed-primary mb-1">Pro Tip:</p>
            <p>Use <strong>Ultra Light</strong> or <strong>Light</strong> glass levels to tame bright logos. 
            Try <strong>Color Cycling</strong> for dynamic visual interest!</p>
          </div>
        </div>
      </CRDCard>
    </div>
  );
};