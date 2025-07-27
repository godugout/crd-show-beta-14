import { AnimatePresence, motion, Reorder } from 'framer-motion';
import {
  Copy,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Layers,
  Lock,
  Minus,
  Palette,
  Plus,
  Settings,
  Sparkles,
  Type,
  Unlock,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { CRDButton } from '@/components/ui/design-system/Button';
import { CRDCard } from '@/components/ui/design-system/Card';
import { Typography } from '@/components/ui/design-system/Typography';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PSDLayer {
  id: string;
  name: string;
  type:
    | 'background'
    | 'character'
    | 'effect'
    | 'text'
    | 'logo'
    | 'shape'
    | 'image';
  preview: string;
  isActive: boolean;
  isVisible: boolean;
  isLocked: boolean;
  opacity: number;
  blendMode: string;
  bounds: { x: number; y: number; width: number; height: number };
  metadata: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    effects?: string[];
    filters?: any[];
  };
}

interface LayerManagerProps {
  activeLayers: PSDLayer[];
  elementsBucket: PSDLayer[];
  onLayerMove: (
    layer: PSDLayer,
    from: 'active' | 'bucket',
    to: 'active' | 'bucket'
  ) => void;
  onLayerVisibilityChange: (layerId: string, isVisible: boolean) => void;
  onLayerOpacityChange: (layerId: string, opacity: number) => void;
  onLayerBlendModeChange: (layerId: string, blendMode: string) => void;
  onLayerLockChange: (layerId: string, isLocked: boolean) => void;
  onLayerReorder: (layers: PSDLayer[]) => void;
  onLayerDuplicate: (layer: PSDLayer) => void;
  onLayerDelete: (layerId: string) => void;
  className?: string;
}

export const LayerManager: React.FC<LayerManagerProps> = ({
  activeLayers,
  elementsBucket,
  onLayerMove,
  onLayerVisibilityChange,
  onLayerOpacityChange,
  onLayerBlendModeChange,
  onLayerLockChange,
  onLayerReorder,
  onLayerDuplicate,
  onLayerDelete,
  className = '',
}) => {
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const getLayerIcon = useCallback((type: PSDLayer['type']) => {
    switch (type) {
      case 'text':
        return <Type className='w-4 h-4' />;
      case 'image':
        return <ImageIcon className='w-4 h-4' />;
      case 'background':
        return <Layers className='w-4 h-4' />;
      case 'effect':
        return <Sparkles className='w-4 h-4' />;
      case 'logo':
        return <Palette className='w-4 h-4' />;
      default:
        return <Layers className='w-4 h-4' />;
    }
  }, []);

  const getLayerColor = useCallback((type: PSDLayer['type']) => {
    switch (type) {
      case 'text':
        return 'text-crd-blue';
      case 'image':
        return 'text-crd-green';
      case 'background':
        return 'text-crd-orange';
      case 'effect':
        return 'text-crd-purple';
      case 'logo':
        return 'text-crd-yellow';
      default:
        return 'text-crd-lightGray';
    }
  }, []);

  const handleLayerMove = useCallback(
    (layer: PSDLayer, direction: 'up' | 'down' | 'toBucket' | 'toActive') => {
      if (direction === 'toBucket') {
        onLayerMove(layer, 'active', 'bucket');
      } else if (direction === 'toActive') {
        onLayerMove(layer, 'bucket', 'active');
      }
    },
    [onLayerMove]
  );

  const blendModes = [
    'normal',
    'multiply',
    'screen',
    'overlay',
    'soft-light',
    'hard-light',
    'color-dodge',
    'color-burn',
    'darken',
    'lighten',
    'difference',
    'exclusion',
  ];

  return (
    <div className={`grid lg:grid-cols-2 gap-6 ${className}`}>
      {/* Active Layers */}
      <CRDCard>
        <div className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <Typography variant='component' className='flex items-center gap-2'>
              <Eye className='w-5 h-5 text-crd-green' />
              Active Layers ({activeLayers.length})
            </Typography>
            <CRDButton
              variant='ghost'
              size='sm'
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            >
              <Settings className='w-4 h-4' />
            </CRDButton>
          </div>

          <ScrollArea className='h-80'>
            <Reorder.Group
              axis='y'
              values={activeLayers}
              onReorder={onLayerReorder}
            >
              <AnimatePresence>
                {activeLayers.map((layer, index) => (
                  <Reorder.Item
                    key={layer.id}
                    value={layer}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className='mb-3 p-3 bg-crd-green/10 rounded-lg border border-crd-green/20'
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className='flex items-center gap-3'>
                        <div
                          className={`p-2 rounded bg-crd-darker ${getLayerColor(layer.type)}`}
                        >
                          {getLayerIcon(layer.type)}
                        </div>

                        <img
                          src={layer.preview}
                          alt={layer.name}
                          className='w-12 h-12 object-cover rounded border'
                        />

                        <div className='flex-1 min-w-0'>
                          <p className='font-medium text-sm truncate text-crd-white'>
                            {layer.name}
                          </p>
                          <p className='text-xs text-crd-lightGray'>
                            {layer.type}
                          </p>
                        </div>

                        <div className='flex items-center gap-2'>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <CRDButton
                                variant='ghost'
                                size='sm'
                                onClick={() =>
                                  onLayerVisibilityChange(
                                    layer.id,
                                    !layer.isVisible
                                  )
                                }
                              >
                                {layer.isVisible ? (
                                  <Eye className='w-4 h-4' />
                                ) : (
                                  <EyeOff className='w-4 h-4' />
                                )}
                              </CRDButton>
                            </TooltipTrigger>
                            <TooltipContent>
                              {layer.isVisible ? 'Hide Layer' : 'Show Layer'}
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <CRDButton
                                variant='ghost'
                                size='sm'
                                onClick={() =>
                                  onLayerLockChange(layer.id, !layer.isLocked)
                                }
                              >
                                {layer.isLocked ? (
                                  <Lock className='w-4 h-4' />
                                ) : (
                                  <Unlock className='w-4 h-4' />
                                )}
                              </CRDButton>
                            </TooltipTrigger>
                            <TooltipContent>
                              {layer.isLocked ? 'Unlock Layer' : 'Lock Layer'}
                            </TooltipContent>
                          </Tooltip>

                          <Collapsible
                            open={expandedLayer === layer.id}
                            onOpenChange={open =>
                              setExpandedLayer(open ? layer.id : null)
                            }
                          >
                            <CollapsibleTrigger asChild>
                              <CRDButton variant='ghost' size='sm'>
                                <Settings className='w-4 h-4' />
                              </CRDButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent className='mt-3 space-y-3'>
                              <div className='space-y-2'>
                                <Label className='text-xs text-crd-lightGray'>
                                  Opacity
                                </Label>
                                <Slider
                                  value={[layer.opacity * 100]}
                                  onValueChange={([value]) =>
                                    onLayerOpacityChange(layer.id, value / 100)
                                  }
                                  max={100}
                                  step={1}
                                  className='w-full'
                                />
                              </div>

                              <div className='space-y-2'>
                                <Label className='text-xs text-crd-lightGray'>
                                  Blend Mode
                                </Label>
                                <Select
                                  value={layer.blendMode}
                                  onValueChange={value =>
                                    onLayerBlendModeChange(layer.id, value)
                                  }
                                >
                                  <SelectTrigger className='w-full'>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {blendModes.map(mode => (
                                      <SelectItem key={mode} value={mode}>
                                        {mode.charAt(0).toUpperCase() +
                                          mode.slice(1)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className='flex gap-2'>
                                <CRDButton
                                  variant='outline'
                                  size='sm'
                                  onClick={() => onLayerDuplicate(layer)}
                                  className='flex-1'
                                >
                                  <Copy className='w-3 h-3 mr-1' />
                                  Duplicate
                                </CRDButton>
                                <CRDButton
                                  variant='outline'
                                  size='sm'
                                  onClick={() =>
                                    handleLayerMove(layer, 'toBucket')
                                  }
                                  className='flex-1'
                                >
                                  <Minus className='w-3 h-3 mr-1' />
                                  Remove
                                </CRDButton>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      </div>
                    </motion.div>
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>

            {activeLayers.length === 0 && (
              <div className='text-center py-8 text-crd-lightGray'>
                <Eye className='w-8 h-8 mx-auto mb-2 opacity-50' />
                <p>No active layers</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </CRDCard>

      {/* Elements Bucket */}
      <CRDCard>
        <div className='p-6'>
          <Typography
            variant='component'
            className='flex items-center gap-2 mb-4'
          >
            <Layers className='w-5 h-5 text-crd-blue' />
            Elements Bucket ({elementsBucket.length})
          </Typography>

          <ScrollArea className='h-80'>
            <div className='space-y-3'>
              {elementsBucket.map((layer, index) => (
                <motion.div
                  key={layer.id}
                  className='flex items-center gap-3 p-3 bg-crd-blue/10 rounded-lg border border-crd-blue/20'
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`p-2 rounded bg-crd-darker ${getLayerColor(layer.type)}`}
                  >
                    {getLayerIcon(layer.type)}
                  </div>

                  <img
                    src={layer.preview}
                    alt={layer.name}
                    className='w-12 h-12 object-cover rounded border'
                  />

                  <div className='flex-1 min-w-0'>
                    <p className='font-medium text-sm truncate text-crd-white'>
                      {layer.name}
                    </p>
                    <p className='text-xs text-crd-lightGray'>{layer.type}</p>
                  </div>

                  <CRDButton
                    variant='ghost'
                    size='sm'
                    onClick={() => handleLayerMove(layer, 'toActive')}
                  >
                    <Plus className='w-4 h-4' />
                  </CRDButton>
                </motion.div>
              ))}

              {elementsBucket.length === 0 && (
                <div className='text-center py-8 text-crd-lightGray'>
                  <Layers className='w-8 h-8 mx-auto mb-2 opacity-50' />
                  <p>No unused elements</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CRDCard>
    </div>
  );
};
