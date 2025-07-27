import { motion } from 'framer-motion';
import {
  Copy,
  Crown,
  Download,
  Edit,
  Eye,
  Globe,
  Share2,
  Star,
  Target,
  Zap,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';

import { CRDBadge } from '@/components/ui/design-system/Badge';
import { CRDButton } from '@/components/ui/design-system/Button';
import { CRDCard } from '@/components/ui/design-system/Card';
import { CRDInput } from '@/components/ui/design-system/Input';
import { Typography } from '@/components/ui/design-system/Typography';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface CRDFrame {
  id: string;
  name: string;
  description: string;
  preview: string;
  layers: any[];
  effects: {
    holographic: boolean;
    foil: boolean;
    chrome: boolean;
    glow: boolean;
    shadow: boolean;
  };
  metadata: {
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    series: string;
    edition: string;
    year: number;
    creator: string;
    tags: string[];
    category: string;
    license: string;
  };
  exportOptions: {
    format: 'png' | 'jpg' | 'svg' | 'pdf';
    quality: number;
    resolution: number;
    includeMetadata: boolean;
    watermark: boolean;
  };
}

interface FrameExportProps {
  frames: CRDFrame[];
  selectedFrame: CRDFrame | null;
  onFrameSelect: (frame: CRDFrame) => void;
  onFrameEdit: (frameId: string, updates: Partial<CRDFrame>) => void;
  onFrameExport: (frame: CRDFrame, options: any) => void;
  onFrameShare: (frame: CRDFrame) => void;
  onFrameDuplicate: (frame: CRDFrame) => void;
  onFrameDelete: (frameId: string) => void;
  onExportToStudio: (frame: CRDFrame) => void;
  className?: string;
}

export const FrameExport: React.FC<FrameExportProps> = ({
  frames,
  selectedFrame,
  onFrameSelect,
  onFrameEdit,
  onFrameExport,
  onFrameShare,
  onFrameDuplicate,
  onFrameDelete,
  onExportToStudio,
  className = '',
}) => {
  const [editingFrame, setEditingFrame] = useState<string | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    format: 'png' as const,
    quality: 95,
    resolution: 300,
    includeMetadata: true,
    watermark: false,
  });

  const rarityColors = {
    common: 'text-crd-lightGray',
    uncommon: 'text-crd-green',
    rare: 'text-crd-blue',
    epic: 'text-crd-purple',
    legendary: 'text-crd-gold',
  };

  const rarityIcons = {
    common: <Star className='w-4 h-4' />,
    uncommon: <Star className='w-4 h-4' />,
    rare: <Target className='w-4 h-4' />,
    epic: <Crown className='w-4 h-4' />,
    legendary: <Crown className='w-4 h-4' />,
  };

  const handleFrameEdit = useCallback(
    (frameId: string, field: string, value: any) => {
      onFrameEdit(frameId, { [field]: value });
    },
    [onFrameEdit]
  );

  const handleExport = useCallback(
    (frame: CRDFrame) => {
      onFrameExport(frame, exportOptions);
    },
    [onFrameExport, exportOptions]
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Frame Grid */}
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {frames.map((frame, index) => (
          <motion.div
            key={frame.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <CRDCard
              className={`cursor-pointer transition-all duration-200 ${
                selectedFrame?.id === frame.id
                  ? 'border-crd-orange bg-crd-orange/10'
                  : 'hover:border-crd-mediumGray/40'
              }`}
              onClick={() => onFrameSelect(frame)}
            >
              <div className='p-4'>
                {/* Frame Preview */}
                <div className='aspect-[3/4] bg-gradient-to-br from-crd-purple/20 to-crd-orange/20 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden'>
                  <div className='text-center'>
                    <Zap className='w-8 h-8 text-crd-orange mx-auto mb-2' />
                    <Typography variant='card'>{frame.name}</Typography>
                  </div>

                  {/* Effects Overlay */}
                  {Object.entries(frame.effects).some(
                    ([_, isActive]) => isActive
                  ) && (
                    <div className='absolute top-2 right-2 flex gap-1'>
                      {Object.entries(frame.effects).map(
                        ([effect, isActive]) =>
                          isActive && (
                            <CRDBadge
                              key={effect}
                              variant='secondary'
                              className='text-xs'
                            >
                              {effect}
                            </CRDBadge>
                          )
                      )}
                    </div>
                  )}

                  {/* Rarity Badge */}
                  <div className='absolute top-2 left-2'>
                    <CRDBadge
                      variant='secondary'
                      className={`${rarityColors[frame.metadata.rarity]} border-current`}
                    >
                      {rarityIcons[frame.metadata.rarity]}
                      {frame.metadata.rarity}
                    </CRDBadge>
                  </div>
                </div>

                {/* Frame Info */}
                <div className='space-y-3'>
                  <div>
                    <Typography variant='component' className='mb-1'>
                      {frame.name}
                    </Typography>
                    <Typography
                      variant='small-body'
                      className='text-crd-lightGray mb-2'
                    >
                      {frame.description}
                    </Typography>
                  </div>

                  <div className='flex flex-wrap gap-1'>
                    <CRDBadge variant='outline' className='text-xs'>
                      {frame.metadata.series}
                    </CRDBadge>
                    <CRDBadge variant='outline' className='text-xs'>
                      {frame.metadata.edition}
                    </CRDBadge>
                    <CRDBadge variant='outline' className='text-xs'>
                      {frame.metadata.year}
                    </CRDBadge>
                  </div>

                  <div className='flex gap-2'>
                    <CRDButton variant='outline' size='sm' className='flex-1'>
                      <Eye className='w-4 h-4 mr-1' />
                      Preview
                    </CRDButton>
                    <CRDButton
                      className='flex-1 bg-gradient-to-r from-crd-orange to-crd-purple hover:from-crd-orange/90 hover:to-crd-purple/90 text-white'
                      onClick={e => {
                        e.stopPropagation();
                        onExportToStudio(frame);
                      }}
                    >
                      <Zap className='w-4 h-4 mr-1' />
                      Use
                    </CRDButton>
                  </div>
                </div>
              </div>
            </CRDCard>
          </motion.div>
        ))}
      </div>

      {/* Selected Frame Details */}
      {selectedFrame && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CRDCard>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <Typography
                  variant='component'
                  className='flex items-center gap-2'
                >
                  <Edit className='w-5 h-5 text-crd-orange' />
                  Frame Details
                </Typography>
                <div className='flex gap-2'>
                  <CRDButton
                    variant='outline'
                    size='sm'
                    onClick={() => onFrameDuplicate(selectedFrame)}
                  >
                    <Copy className='w-4 h-4 mr-2' />
                    Duplicate
                  </CRDButton>
                  <CRDButton
                    variant='outline'
                    size='sm'
                    onClick={() => onFrameShare(selectedFrame)}
                  >
                    <Share2 className='w-4 h-4 mr-2' />
                    Share
                  </CRDButton>
                </div>
              </div>

              <div className='grid md:grid-cols-2 gap-6'>
                {/* Basic Info */}
                <div className='space-y-4'>
                  <div>
                    <Label className='text-crd-lightGray'>Frame Name</Label>
                    <CRDInput
                      value={selectedFrame.name}
                      onChange={e =>
                        handleFrameEdit(
                          selectedFrame.id,
                          'name',
                          e.target.value
                        )
                      }
                      className='mt-1'
                    />
                  </div>

                  <div>
                    <Label className='text-crd-lightGray'>Description</Label>
                    <Textarea
                      value={selectedFrame.description}
                      onChange={e =>
                        handleFrameEdit(
                          selectedFrame.id,
                          'description',
                          e.target.value
                        )
                      }
                      className='mt-1'
                      rows={3}
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label className='text-crd-lightGray'>Series</Label>
                      <CRDInput
                        value={selectedFrame.metadata.series}
                        onChange={e =>
                          handleFrameEdit(
                            selectedFrame.id,
                            'metadata.series',
                            e.target.value
                          )
                        }
                        className='mt-1'
                      />
                    </div>
                    <div>
                      <Label className='text-crd-lightGray'>Edition</Label>
                      <CRDInput
                        value={selectedFrame.metadata.edition}
                        onChange={e =>
                          handleFrameEdit(
                            selectedFrame.id,
                            'metadata.edition',
                            e.target.value
                          )
                        }
                        className='mt-1'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label className='text-crd-lightGray'>Year</Label>
                      <CRDInput
                        type='number'
                        value={selectedFrame.metadata.year}
                        onChange={e =>
                          handleFrameEdit(
                            selectedFrame.id,
                            'metadata.year',
                            parseInt(e.target.value)
                          )
                        }
                        className='mt-1'
                      />
                    </div>
                    <div>
                      <Label className='text-crd-lightGray'>Rarity</Label>
                      <Select
                        value={selectedFrame.metadata.rarity}
                        onValueChange={value =>
                          handleFrameEdit(
                            selectedFrame.id,
                            'metadata.rarity',
                            value
                          )
                        }
                      >
                        <SelectTrigger className='mt-1'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='common'>Common</SelectItem>
                          <SelectItem value='uncommon'>Uncommon</SelectItem>
                          <SelectItem value='rare'>Rare</SelectItem>
                          <SelectItem value='epic'>Epic</SelectItem>
                          <SelectItem value='legendary'>Legendary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Export Options */}
                <div className='space-y-4'>
                  <Typography
                    variant='component'
                    className='flex items-center gap-2'
                  >
                    <Download className='w-5 h-5 text-crd-green' />
                    Export Options
                  </Typography>

                  <div>
                    <Label className='text-crd-lightGray'>Format</Label>
                    <Select
                      value={exportOptions.format}
                      onValueChange={value =>
                        setExportOptions(prev => ({
                          ...prev,
                          format: value as any,
                        }))
                      }
                    >
                      <SelectTrigger className='mt-1'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='png'>PNG (High Quality)</SelectItem>
                        <SelectItem value='jpg'>JPG (Compressed)</SelectItem>
                        <SelectItem value='svg'>SVG (Vector)</SelectItem>
                        <SelectItem value='pdf'>PDF (Print Ready)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className='text-crd-lightGray'>
                      Quality: {exportOptions.quality}%
                    </Label>
                    <Slider
                      value={[exportOptions.quality]}
                      onValueChange={([value]) =>
                        setExportOptions(prev => ({ ...prev, quality: value }))
                      }
                      max={100}
                      step={5}
                      className='mt-1'
                    />
                  </div>

                  <div>
                    <Label className='text-crd-lightGray'>
                      Resolution: {exportOptions.resolution} DPI
                    </Label>
                    <Slider
                      value={[exportOptions.resolution]}
                      onValueChange={([value]) =>
                        setExportOptions(prev => ({
                          ...prev,
                          resolution: value,
                        }))
                      }
                      max={600}
                      step={50}
                      min={72}
                      className='mt-1'
                    />
                  </div>

                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <Label className='text-crd-lightGray'>
                        Include Metadata
                      </Label>
                      <Switch
                        checked={exportOptions.includeMetadata}
                        onCheckedChange={checked =>
                          setExportOptions(prev => ({
                            ...prev,
                            includeMetadata: checked,
                          }))
                        }
                      />
                    </div>

                    <div className='flex items-center justify-between'>
                      <Label className='text-crd-lightGray'>
                        Add Watermark
                      </Label>
                      <Switch
                        checked={exportOptions.watermark}
                        onCheckedChange={checked =>
                          setExportOptions(prev => ({
                            ...prev,
                            watermark: checked,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <CRDButton
                    onClick={() => handleExport(selectedFrame)}
                    className='w-full bg-gradient-to-r from-crd-green to-crd-blue hover:from-crd-green/90 hover:to-crd-blue/90 text-white'
                    size='lg'
                  >
                    <Download className='w-4 h-4 mr-2' />
                    Export Frame
                  </CRDButton>
                </div>
              </div>
            </div>
          </CRDCard>
        </motion.div>
      )}

      {/* Export to Studio */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <CRDCard>
          <div className='p-6 text-center'>
            <Typography variant='component' className='mb-4'>
              Ready to Create Your CRD?
            </Typography>
            <Typography
              variant='large-body'
              className='text-crd-lightGray mb-6'
            >
              Export your frames to CRD Studio for advanced editing, publishing,
              and marketplace integration.
            </Typography>

            <div className='flex gap-4 justify-center'>
              <CRDButton
                onClick={() => selectedFrame && onExportToStudio(selectedFrame)}
                className='bg-gradient-to-r from-crd-orange to-crd-purple hover:from-crd-orange/90 hover:to-crd-purple/90 text-white px-8 py-4'
                size='lg'
                disabled={!selectedFrame}
              >
                <Zap className='w-4 h-4 mr-2' />
                Export to Studio
              </CRDButton>

              <CRDButton variant='outline' size='lg' className='px-8 py-4'>
                <Globe className='w-4 h-4 mr-2' />
                Browse Templates
              </CRDButton>
            </div>
          </div>
        </CRDCard>
      </motion.div>
    </div>
  );
};
