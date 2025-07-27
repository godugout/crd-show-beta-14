import { AnimatePresence, motion } from 'framer-motion';
import {
  Crown,
  Eye,
  Layers,
  Lightbulb,
  Palette,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  Wand2,
  Zap,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';

import { CRDBadge } from '@/components/ui/design-system/Badge';
import { CRDButton } from '@/components/ui/design-system/Button';
import { CRDCard } from '@/components/ui/design-system/Card';
import { Typography } from '@/components/ui/design-system/Typography';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface Effect {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  intensity: number;
  color: string;
  category: 'premium' | 'standard' | 'special';
  properties: {
    blendMode: string;
    opacity: number;
    scale: number;
    rotation: number;
    animation: boolean;
  };
}

interface EffectsPanelProps {
  effects: Effect[];
  onEffectToggle: (effectId: string, isActive: boolean) => void;
  onEffectIntensityChange: (effectId: string, intensity: number) => void;
  onEffectPropertyChange: (
    effectId: string,
    property: string,
    value: any
  ) => void;
  onResetEffects: () => void;
  onApplyPreset: (presetName: string) => void;
  className?: string;
}

export const EffectsPanel: React.FC<EffectsPanelProps> = ({
  effects,
  onEffectToggle,
  onEffectIntensityChange,
  onEffectPropertyChange,
  onResetEffects,
  onApplyPreset,
  className = '',
}) => {
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const effectPresets = [
    {
      name: 'Holographic Premium',
      description: 'Full holographic effect with rainbow colors',
      effects: ['holographic', 'glow', 'shadow'],
      icon: <Crown className='w-4 h-4' />,
    },
    {
      name: 'Foil Standard',
      description: 'Classic foil effect with metallic finish',
      effects: ['foil', 'shadow'],
      icon: <Star className='w-4 h-4' />,
    },
    {
      name: 'Chrome Elite',
      description: 'High-end chrome effect with reflections',
      effects: ['chrome', 'glow', 'shadow'],
      icon: <Target className='w-4 h-4' />,
    },
    {
      name: 'Neon Glow',
      description: 'Vibrant neon glow effects',
      effects: ['glow', 'shadow'],
      icon: <Lightbulb className='w-4 h-4' />,
    },
  ];

  const getEffectIcon = useCallback((effectId: string) => {
    switch (effectId) {
      case 'holographic':
        return <Sparkles className='w-4 h-4' />;
      case 'foil':
        return <Palette className='w-4 h-4' />;
      case 'chrome':
        return <Zap className='w-4 h-4' />;
      case 'glow':
        return <Lightbulb className='w-4 h-4' />;
      case 'shadow':
        return <Layers className='w-4 h-4' />;
      default:
        return <Sparkles className='w-4 h-4' />;
    }
  }, []);

  const getEffectColor = useCallback((category: Effect['category']) => {
    switch (category) {
      case 'premium':
        return 'text-crd-gold';
      case 'special':
        return 'text-crd-purple';
      default:
        return 'text-crd-blue';
    }
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Effects Grid */}
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {effects.map(effect => (
          <motion.div
            key={effect.id}
            className='relative'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CRDCard
              className={`cursor-pointer transition-all duration-200 ${
                effect.isActive
                  ? 'border-crd-orange bg-crd-orange/10'
                  : 'border-crd-mediumGray/20 hover:border-crd-mediumGray/40'
              }`}
              onClick={() =>
                setSelectedEffect(
                  selectedEffect === effect.id ? null : effect.id
                )
              }
            >
              <div className='p-4'>
                <div className='flex items-center justify-between mb-3'>
                  <div
                    className={`p-2 rounded bg-crd-darker ${getEffectColor(effect.category)}`}
                  >
                    {getEffectIcon(effect.id)}
                  </div>
                  <Switch
                    checked={effect.isActive}
                    onCheckedChange={checked =>
                      onEffectToggle(effect.id, checked)
                    }
                    onClick={e => e.stopPropagation()}
                  />
                </div>

                <Typography variant='card' className='mb-1'>
                  {effect.name}
                </Typography>

                <Typography variant='small-body' className='mb-3'>
                  {effect.description}
                </Typography>

                {effect.isActive && (
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <Label className='text-xs text-crd-lightGray'>
                        Intensity
                      </Label>
                      <span className='text-xs text-crd-lightGray'>
                        {effect.intensity}%
                      </span>
                    </div>
                    <Slider
                      value={[effect.intensity]}
                      onValueChange={([value]) =>
                        onEffectIntensityChange(effect.id, value)
                      }
                      max={100}
                      step={1}
                      className='w-full'
                    />
                  </div>
                )}

                {effect.category === 'premium' && (
                  <CRDBadge
                    variant='secondary'
                    className='mt-2 bg-crd-gold/20 text-crd-gold border-crd-gold/30'
                  >
                    <Crown className='w-3 h-3 mr-1' />
                    Premium
                  </CRDBadge>
                )}
              </div>
            </CRDCard>

            {/* Advanced Options Overlay */}
            <AnimatePresence>
              {selectedEffect === effect.id && (
                <motion.div
                  className='absolute inset-0 bg-crd-darkest/95 backdrop-blur-sm rounded-lg border border-crd-orange/50 p-4 z-10'
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className='space-y-3'>
                    <Typography
                      variant='component'
                      className='flex items-center gap-2'
                    >
                      {getEffectIcon(effect.id)}
                      {effect.name} Settings
                    </Typography>

                    <div className='space-y-3'>
                      <div>
                        <Label className='text-xs text-crd-lightGray'>
                          Blend Mode
                        </Label>
                        <Select
                          value={effect.properties.blendMode}
                          onValueChange={value =>
                            onEffectPropertyChange(
                              effect.id,
                              'blendMode',
                              value
                            )
                          }
                        >
                          <SelectTrigger className='w-full mt-1'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='normal'>Normal</SelectItem>
                            <SelectItem value='multiply'>Multiply</SelectItem>
                            <SelectItem value='screen'>Screen</SelectItem>
                            <SelectItem value='overlay'>Overlay</SelectItem>
                            <SelectItem value='soft-light'>
                              Soft Light
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className='text-xs text-crd-lightGray'>
                          Opacity
                        </Label>
                        <Slider
                          value={[effect.properties.opacity * 100]}
                          onValueChange={([value]) =>
                            onEffectPropertyChange(
                              effect.id,
                              'opacity',
                              value / 100
                            )
                          }
                          max={100}
                          step={1}
                          className='w-full mt-1'
                        />
                      </div>

                      <div>
                        <Label className='text-xs text-crd-lightGray'>
                          Scale
                        </Label>
                        <Slider
                          value={[effect.properties.scale * 100]}
                          onValueChange={([value]) =>
                            onEffectPropertyChange(
                              effect.id,
                              'scale',
                              value / 100
                            )
                          }
                          max={200}
                          step={1}
                          className='w-full mt-1'
                        />
                      </div>

                      <div>
                        <Label className='text-xs text-crd-lightGray'>
                          Rotation
                        </Label>
                        <Slider
                          value={[effect.properties.rotation]}
                          onValueChange={([value]) =>
                            onEffectPropertyChange(effect.id, 'rotation', value)
                          }
                          max={360}
                          step={1}
                          className='w-full mt-1'
                        />
                      </div>

                      <div className='flex items-center justify-between'>
                        <Label className='text-xs text-crd-lightGray'>
                          Animation
                        </Label>
                        <Switch
                          checked={effect.properties.animation}
                          onCheckedChange={checked =>
                            onEffectPropertyChange(
                              effect.id,
                              'animation',
                              checked
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Presets Section */}
      <CRDCard>
        <div className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <Typography variant='component' className='flex items-center gap-2'>
              <Wand2 className='w-5 h-5 text-crd-purple' />
              Effect Presets
            </Typography>
            <CRDButton variant='outline' size='sm' onClick={onResetEffects}>
              <RotateCcw className='w-4 h-4 mr-2' />
              Reset All
            </CRDButton>
          </div>

          <div className='grid md:grid-cols-2 gap-4'>
            {effectPresets.map(preset => (
              <motion.div
                key={preset.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CRDCard
                  className='cursor-pointer hover:border-crd-purple/50 transition-colors'
                  onClick={() => onApplyPreset(preset.name)}
                >
                  <div className='p-4'>
                    <div className='flex items-center gap-3 mb-2'>
                      <div className='p-2 rounded bg-crd-purple/20 text-crd-purple'>
                        {preset.icon}
                      </div>
                      <Typography variant='card'>{preset.name}</Typography>
                    </div>
                    <Typography
                      variant='small-body'
                      className='text-crd-lightGray'
                    >
                      {preset.description}
                    </Typography>
                    <div className='flex flex-wrap gap-1 mt-2'>
                      {preset.effects.map(effect => (
                        <CRDBadge
                          key={effect}
                          variant='outline'
                          className='text-xs'
                        >
                          {effect}
                        </CRDBadge>
                      ))}
                    </div>
                  </div>
                </CRDCard>
              </motion.div>
            ))}
          </div>
        </div>
      </CRDCard>

      {/* Live Preview */}
      <CRDCard>
        <div className='p-6'>
          <Typography
            variant='component'
            className='flex items-center gap-2 mb-4'
          >
            <Eye className='w-5 h-5 text-crd-green' />
            Effects Preview
          </Typography>

          <div className='aspect-[3/4] bg-gradient-to-br from-crd-darker to-crd-dark rounded-lg border-2 border-dashed border-crd-mediumGray flex items-center justify-center'>
            <div className='text-center'>
              <Sparkles className='w-12 h-12 text-crd-orange mx-auto mb-2' />
              <Typography variant='card'>Effects Preview</Typography>
              <Typography variant='small-body'>
                {effects.filter(e => e.isActive).length} effects active
              </Typography>

              {effects.filter(e => e.isActive).length > 0 && (
                <div className='flex flex-wrap gap-1 mt-3 justify-center'>
                  {effects
                    .filter(e => e.isActive)
                    .map(effect => (
                      <CRDBadge
                        key={effect.id}
                        variant='secondary'
                        className='text-xs'
                      >
                        {effect.name}
                      </CRDBadge>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CRDCard>
    </div>
  );
};
