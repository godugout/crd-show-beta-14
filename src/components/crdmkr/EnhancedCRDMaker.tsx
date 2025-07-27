import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle,
  Crown,
  Download,
  Eye,
  FileImage,
  Layers,
  Loader2,
  Maximize2,
  Minimize2,
  Move,
  Palette,
  Pause,
  Play,
  Plus,
  Settings,
  Sparkles,
  Upload,
  Wand2,
  Zap,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CRDBadge } from '@/components/ui/design-system/Badge';
import { CRDButton } from '@/components/ui/design-system/Button';
import { CRDCard } from '@/components/ui/design-system/Card';
import { Typography } from '@/components/ui/design-system/Typography';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { useSecureAuth } from '@/features/auth/providers/SecureAuthProvider';
import { useCardEditor } from '@/hooks/useCardEditor';
import { usePSDProcessingWorker } from '@/hooks/usePSDProcessingWorker';
import { toast } from 'sonner';

// Types
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

interface CRDFrame {
  id: string;
  name: string;
  preview: string;
  layers: PSDLayer[];
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
  };
}

interface ProcessingJob {
  id: string;
  file: File;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  layers?: PSDLayer[];
  error?: string;
}

// Enhanced CRDMKR Component
export const EnhancedCRDMaker: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSecureAuth();
  const cardEditor = useCardEditor();

  // State management
  const [activeTab, setActiveTab] = useState('upload');
  const [processingJobs, setProcessingJobs] = useState<ProcessingJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<ProcessingJob | null>(null);
  const [activeLayers, setActiveLayers] = useState<PSDLayer[]>([]);
  const [elementsBucket, setElementsBucket] = useState<PSDLayer[]>([]);
  const [generatedFrames, setGeneratedFrames] = useState<CRDFrame[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<CRDFrame | null>(null);

  // UI State
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [autoGenerateFrames, setAutoGenerateFrames] = useState(true);

  // Effects and styling
  const [activeEffects, setActiveEffects] = useState({
    holographic: false,
    foil: false,
    chrome: false,
    glow: false,
    shadow: true,
  });

  // PSD Processing
  const { processPSDFile, isProcessing, progress, currentStep } =
    usePSDProcessingWorker();

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      const psdFiles = files.filter(
        file =>
          file.name.toLowerCase().endsWith('.psd') ||
          file.name.toLowerCase().endsWith('.psb')
      );

      if (psdFiles.length === 0) {
        toast.error('Please select valid PSD or PSB files');
        return;
      }

      for (const file of psdFiles) {
        const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const newJob: ProcessingJob = {
          id: jobId,
          file,
          status: 'uploading',
          progress: 0,
        };

        setProcessingJobs(prev => [...prev, newJob]);

        try {
          // Process PSD file
          const result = await processPSDFile(file);

          // Update job with results
          setProcessingJobs(prev =>
            prev.map(job =>
              job.id === jobId
                ? {
                    ...job,
                    status: 'completed',
                    progress: 100,
                    layers: result.layers || [],
                  }
                : job
            )
          );

          toast.success(`Successfully processed ${file.name}`);
        } catch (error) {
          console.error('PSD processing failed:', error);
          setProcessingJobs(prev =>
            prev.map(job =>
              job.id === jobId
                ? {
                    ...job,
                    status: 'error',
                    error:
                      error instanceof Error
                        ? error.message
                        : 'Processing failed',
                  }
                : job
            )
          );
          toast.error(`Failed to process ${file.name}`);
        }
      }
    },
    [processPSDFile]
  );

  // Handle layer management
  const moveToActive = useCallback((layer: PSDLayer) => {
    setElementsBucket(prev => prev.filter(l => l.id !== layer.id));
    setActiveLayers(prev => [...prev, { ...layer, isActive: true }]);
  }, []);

  const moveToElements = useCallback((layer: PSDLayer) => {
    setActiveLayers(prev => prev.filter(l => l.id !== layer.id));
    setElementsBucket(prev => [...prev, { ...layer, isActive: false }]);
  }, []);

  const toggleLayerVisibility = useCallback((layerId: string) => {
    setActiveLayers(prev =>
      prev.map(layer =>
        layer.id === layerId ? { ...layer, isVisible: !layer.isVisible } : layer
      )
    );
  }, []);

  // Generate CRD frames
  const generateFrames = useCallback(async () => {
    if (activeLayers.length === 0) {
      toast.error('Please add layers to generate frames');
      return;
    }

    toast.loading('Generating CRD frames...');

    try {
      // Simulate frame generation with different combinations
      const frames: CRDFrame[] = [];

      // Frame 1: Standard composition
      frames.push({
        id: 'frame_1',
        name: 'Standard CRD',
        preview: '/placeholder.svg',
        layers: activeLayers,
        effects: { ...activeEffects },
        metadata: {
          rarity: 'common',
          series: 'CRD Standard',
          edition: '2024',
          year: 2024,
        },
      });

      // Frame 2: Premium with effects
      frames.push({
        id: 'frame_2',
        name: 'Premium CRD',
        preview: '/placeholder.svg',
        layers: activeLayers,
        effects: { ...activeEffects, holographic: true, foil: true },
        metadata: {
          rarity: 'rare',
          series: 'CRD Premium',
          edition: 'Limited',
          year: 2024,
        },
      });

      // Frame 3: Legendary with all effects
      frames.push({
        id: 'frame_3',
        name: 'Legendary CRD',
        preview: '/placeholder.svg',
        layers: activeLayers,
        effects: {
          holographic: true,
          foil: true,
          chrome: true,
          glow: true,
          shadow: true,
        },
        metadata: {
          rarity: 'legendary',
          series: 'CRD Legendary',
          edition: 'Ultimate',
          year: 2024,
        },
      });

      setGeneratedFrames(frames);
      setActiveTab('export');
      toast.dismiss();
      toast.success(`Generated ${frames.length} CRD frames!`);
    } catch (error) {
      console.error('Frame generation failed:', error);
      toast.dismiss();
      toast.error('Failed to generate frames');
    }
  }, [activeLayers, activeEffects]);

  // Export to CRD Studio
  const exportToStudio = useCallback(
    (frame: CRDFrame) => {
      // Convert frame data to card format
      const cardData = {
        id: frame.id,
        title: frame.name,
        description: `Generated CRD frame with ${frame.layers.length} layers`,
        rarity: frame.metadata.rarity,
        image_url: frame.preview,
        design_metadata: {
          ...frame,
          card_type: 'crd',
          print_optimized: true,
        },
      };

      // Save to card editor
      cardEditor.updateCardField('image_url', frame.preview);
      cardEditor.updateCardField('title', frame.name);
      cardEditor.updateCardField('rarity', frame.metadata.rarity);
      cardEditor.updateCardField('design_metadata', cardData.design_metadata);

      // Navigate to studio
      navigate('/create/crd', {
        state: {
          importedFrame: frame,
          cardData,
        },
      });
    },
    [cardEditor, navigate]
  );

  // Auto-organize layers when job completes
  useEffect(() => {
    const completedJob = processingJobs.find(
      job => job.status === 'completed' && job.layers
    );
    if (completedJob && completedJob.layers) {
      const activeLayers = completedJob.layers.filter(layer => layer.isActive);
      const elements = completedJob.layers.filter(layer => !layer.isActive);

      setActiveLayers(activeLayers);
      setElementsBucket(elements);
      setSelectedJob(completedJob);

      if (autoGenerateFrames && activeLayers.length > 0) {
        generateFrames();
      }
    }
  }, [processingJobs, autoGenerateFrames, generateFrames]);

  return (
    <div className='min-h-screen bg-crd-darkest'>
      {/* Header */}
      <motion.header
        className='border-b border-crd-mediumGray/20 bg-crd-darker/80 backdrop-blur-sm sticky top-0 z-50'
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className='container mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <CRDButton
                variant='ghost'
                size='sm'
                onClick={() => navigate(-1)}
                className='hover:bg-crd-mediumGray/20'
              >
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back
              </CRDButton>
              <div>
                <Typography
                  variant='page-title'
                  className='flex items-center gap-2'
                >
                  <Sparkles className='w-6 h-6 text-crd-orange' />
                  CRDMKR Pro
                </Typography>
                <p className='text-sm text-crd-lightGray'>
                  Advanced PSD to CRD Frame Converter
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <CRDBadge variant='primary' className='bg-crd-purple text-white'>
                <Crown className='w-3 h-3 mr-1' />
                Pro
              </CRDBadge>
              <CRDBadge variant='outline'>Beta v2.0</CRDBadge>
            </div>
          </div>
        </div>
      </motion.header>

      <div className='container mx-auto px-6 py-8'>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-8'
        >
          <TabsList className='grid w-full grid-cols-5 bg-crd-darker border border-crd-mediumGray/20'>
            <TabsTrigger
              value='upload'
              className='flex items-center gap-2 data-[state=active]:bg-crd-blue data-[state=active]:text-white'
            >
              <Upload className='w-4 h-4' />
              Upload
            </TabsTrigger>
            <TabsTrigger
              value='process'
              disabled={processingJobs.length === 0}
              className='flex items-center gap-2 data-[state=active]:bg-crd-blue data-[state=active]:text-white'
            >
              <Loader2 className='w-4 h-4' />
              Process
            </TabsTrigger>
            <TabsTrigger
              value='organize'
              disabled={!processingJobs.some(job => job.status === 'completed')}
              className='flex items-center gap-2 data-[state=active]:bg-crd-blue data-[state=active]:text-white'
            >
              <Layers className='w-4 h-4' />
              Organize
            </TabsTrigger>
            <TabsTrigger
              value='effects'
              disabled={activeLayers.length === 0}
              className='flex items-center gap-2 data-[state=active]:bg-crd-blue data-[state=active]:text-white'
            >
              <Palette className='w-4 h-4' />
              Effects
            </TabsTrigger>
            <TabsTrigger
              value='export'
              disabled={generatedFrames.length === 0}
              className='flex items-center gap-2 data-[state=active]:bg-crd-blue data-[state=active]:text-white'
            >
              <Download className='w-4 h-4' />
              Export
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value='upload' className='space-y-6'>
            <motion.div
              className='text-center'
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant='hero' className='mb-4'>
                Upload Your PSD Files
              </Typography>
              <Typography
                variant='large-body'
                className='max-w-2xl mx-auto text-crd-lightGray'
              >
                Drag and drop your Photoshop files here, or click to browse.
                CRDMKR Pro will automatically extract all layers and prepare
                them for conversion.
              </Typography>
            </motion.div>

            <CRDCard className='border-dashed border-2 border-crd-mediumGray/30 hover:border-crd-orange transition-colors'>
              <div className='p-12'>
                <div className='text-center space-y-6'>
                  <motion.div
                    className='bg-gradient-to-br from-crd-orange/20 to-crd-purple/20 p-8 rounded-full w-32 h-32 mx-auto flex items-center justify-center'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FileImage className='w-16 h-16 text-crd-orange' />
                  </motion.div>
                  <div>
                    <Typography variant='component' className='mb-2'>
                      Drop PSD files here
                    </Typography>
                    <Typography variant='small-body'>
                      Supports .psd and .psb files up to 500MB each
                    </Typography>
                  </div>
                  <CRDButton
                    onClick={() => fileInputRef.current?.click()}
                    className='bg-gradient-to-r from-crd-orange to-crd-purple hover:from-crd-orange/90 hover:to-crd-purple/90 text-white px-8 py-4'
                    size='lg'
                  >
                    Browse Files
                    <Upload className='w-4 h-4 ml-2' />
                  </CRDButton>
                  <input
                    ref={fileInputRef}
                    type='file'
                    multiple
                    accept='.psd,.psb'
                    onChange={handleFileUpload}
                    className='hidden'
                  />
                </div>
              </div>
            </CRDCard>

            {processingJobs.length > 0 && (
              <motion.div
                className='space-y-4'
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Typography variant='component'>
                  Processing Jobs ({processingJobs.length})
                </Typography>
                {processingJobs.map(job => (
                  <CRDCard key={job.id} className='p-4'>
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center gap-3'>
                        <FileImage className='w-5 h-5 text-crd-orange' />
                        <span className='font-medium text-crd-white'>
                          {job.file.name}
                        </span>
                        <CRDBadge
                          variant={
                            job.status === 'completed'
                              ? 'success'
                              : job.status === 'error'
                                ? 'destructive'
                                : 'secondary'
                          }
                        >
                          {job.status}
                        </CRDBadge>
                      </div>
                      <span className='text-sm text-crd-lightGray'>
                        {(job.file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                    {job.status !== 'completed' && (
                      <Progress value={job.progress} className='h-2' />
                    )}
                    {job.status === 'completed' && (
                      <div className='flex items-center gap-2 mt-2'>
                        <CheckCircle className='w-4 h-4 text-crd-green' />
                        <span className='text-sm text-crd-green'>
                          {job.layers?.length || 0} layers extracted
                        </span>
                        <CRDButton
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            setSelectedJob(job);
                            setActiveTab('organize');
                          }}
                        >
                          Organize Layers
                        </CRDButton>
                      </div>
                    )}
                    {job.status === 'error' && (
                      <div className='flex items-center gap-2 mt-2 text-crd-orange'>
                        <span className='text-sm'>{job.error}</span>
                      </div>
                    )}
                  </CRDCard>
                ))}

                {processingJobs.some(job => job.status === 'completed') && (
                  <div className='text-center pt-4'>
                    <CRDButton
                      onClick={() => setActiveTab('organize')}
                      className='bg-gradient-to-r from-crd-orange to-crd-purple hover:from-crd-orange/90 hover:to-crd-purple/90 text-white px-8 py-4'
                      size='lg'
                    >
                      Continue to Layer Organization
                      <Layers className='w-4 h-4 ml-2' />
                    </CRDButton>
                  </div>
                )}
              </motion.div>
            )}
          </TabsContent>

          {/* Organize Tab */}
          <TabsContent value='organize' className='space-y-6'>
            <motion.div
              className='text-center'
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant='hero' className='mb-4'>
                Organize Your Layers
              </Typography>
              <Typography
                variant='large-body'
                className='max-w-2xl mx-auto text-crd-lightGray'
              >
                Arrange layers into your active card composition or keep them in
                the elements bucket for later use.
              </Typography>
            </motion.div>

            <div className='grid lg:grid-cols-3 gap-6'>
              {/* Active Layers */}
              <CRDCard>
                <div className='p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <Typography
                      variant='component'
                      className='flex items-center gap-2'
                    >
                      <Eye className='w-5 h-5 text-crd-green' />
                      Active Layers ({activeLayers.length})
                    </Typography>
                    <CRDButton
                      variant='ghost'
                      size='sm'
                      onClick={() =>
                        setShowAdvancedOptions(!showAdvancedOptions)
                      }
                    >
                      <Settings className='w-4 h-4' />
                    </CRDButton>
                  </div>

                  <ScrollArea className='h-64'>
                    <div className='space-y-3'>
                      {activeLayers.map(layer => (
                        <motion.div
                          key={layer.id}
                          className='flex items-center gap-3 p-3 bg-crd-green/10 rounded-lg border border-crd-green/20'
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          whileHover={{ scale: 1.02 }}
                        >
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
                            <Switch
                              checked={layer.isVisible}
                              onCheckedChange={() =>
                                toggleLayerVisibility(layer.id)
                              }
                              size='sm'
                            />
                            <CRDButton
                              variant='ghost'
                              size='sm'
                              onClick={() => moveToElements(layer)}
                            >
                              <Move className='w-4 h-4' />
                            </CRDButton>
                          </div>
                        </motion.div>
                      ))}
                      {activeLayers.length === 0 && (
                        <div className='text-center py-8 text-crd-lightGray'>
                          <Eye className='w-8 h-8 mx-auto mb-2 opacity-50' />
                          <p>No active layers</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </CRDCard>

              {/* Preview */}
              <CRDCard>
                <div className='p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <Typography
                      variant='component'
                      className='flex items-center gap-2'
                    >
                      <Zap className='w-5 h-5 text-crd-orange' />
                      Live Preview
                    </Typography>
                    <div className='flex items-center gap-2'>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <CRDButton
                            variant='ghost'
                            size='sm'
                            onClick={() => setIsPreviewMode(!isPreviewMode)}
                          >
                            {isPreviewMode ? (
                              <Pause className='w-4 h-4' />
                            ) : (
                              <Play className='w-4 h-4' />
                            )}
                          </CRDButton>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isPreviewMode ? 'Pause Preview' : 'Start Preview'}
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <CRDButton
                            variant='ghost'
                            size='sm'
                            onClick={() => setIsFullscreen(!isFullscreen)}
                          >
                            {isFullscreen ? (
                              <Minimize2 className='w-4 h-4' />
                            ) : (
                              <Maximize2 className='w-4 h-4' />
                            )}
                          </CRDButton>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <div className='aspect-[3/4] bg-gradient-to-br from-crd-darker to-crd-dark rounded-lg border-2 border-dashed border-crd-mediumGray flex items-center justify-center'>
                    {activeLayers.length > 0 ? (
                      <div className='text-center'>
                        <Layers className='w-12 h-12 text-crd-orange mx-auto mb-2' />
                        <Typography variant='card'>Card Preview</Typography>
                        <Typography variant='small-body'>
                          {activeLayers.length} layers composed
                        </Typography>
                      </div>
                    ) : (
                      <div className='text-center text-crd-lightGray'>
                        <Plus className='w-12 h-12 mx-auto mb-2 opacity-50' />
                        <p>Add layers to see preview</p>
                      </div>
                    )}
                  </div>

                  {activeLayers.length > 0 && (
                    <CRDButton
                      onClick={generateFrames}
                      className='w-full mt-4 bg-gradient-to-r from-crd-orange to-crd-purple hover:from-crd-orange/90 hover:to-crd-purple/90 text-white'
                      size='lg'
                    >
                      Generate CRD Frames
                      <Zap className='w-4 h-4 ml-2' />
                    </CRDButton>
                  )}
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

                  <ScrollArea className='h-64'>
                    <div className='space-y-3'>
                      {elementsBucket.map(layer => (
                        <motion.div
                          key={layer.id}
                          className='flex items-center gap-3 p-3 bg-crd-blue/10 rounded-lg border border-crd-blue/20'
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          whileHover={{ scale: 1.02 }}
                        >
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
                          <CRDButton
                            variant='ghost'
                            size='sm'
                            onClick={() => moveToActive(layer)}
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
          </TabsContent>

          {/* Effects Tab */}
          <TabsContent value='effects' className='space-y-6'>
            <motion.div
              className='text-center'
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant='hero' className='mb-4'>
                Apply Premium Effects
              </Typography>
              <Typography
                variant='large-body'
                className='max-w-2xl mx-auto text-crd-lightGray'
              >
                Add holographic, foil, chrome, and other premium effects to your
                CRD frames.
              </Typography>
            </motion.div>

            <div className='grid md:grid-cols-2 gap-6'>
              {/* Effects Panel */}
              <CRDCard>
                <div className='p-6'>
                  <Typography variant='component' className='mb-4'>
                    Available Effects
                  </Typography>

                  <div className='space-y-4'>
                    {Object.entries(activeEffects).map(([effect, isActive]) => (
                      <div
                        key={effect}
                        className='flex items-center justify-between p-3 bg-crd-darker rounded-lg'
                      >
                        <div className='flex items-center gap-3'>
                          <div
                            className={`w-4 h-4 rounded-full ${isActive ? 'bg-crd-orange' : 'bg-crd-mediumGray'}`}
                          />
                          <span className='capitalize text-crd-white'>
                            {effect}
                          </span>
                        </div>
                        <Switch
                          checked={isActive}
                          onCheckedChange={checked =>
                            setActiveEffects(prev => ({
                              ...prev,
                              [effect]: checked,
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <Separator className='my-6' />

                  <div className='space-y-4'>
                    <div>
                      <Label className='text-crd-lightGray'>
                        Effect Intensity
                      </Label>
                      <Slider
                        defaultValue={[50]}
                        max={100}
                        step={1}
                        className='mt-2'
                      />
                    </div>

                    <div>
                      <Label className='text-crd-lightGray'>Blend Mode</Label>
                      <Select defaultValue='normal'>
                        <SelectTrigger className='mt-2'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='normal'>Normal</SelectItem>
                          <SelectItem value='multiply'>Multiply</SelectItem>
                          <SelectItem value='screen'>Screen</SelectItem>
                          <SelectItem value='overlay'>Overlay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CRDCard>

              {/* Preview */}
              <CRDCard>
                <div className='p-6'>
                  <Typography variant='component' className='mb-4'>
                    Effects Preview
                  </Typography>

                  <div className='aspect-[3/4] bg-gradient-to-br from-crd-darker to-crd-dark rounded-lg border-2 border-dashed border-crd-mediumGray flex items-center justify-center'>
                    <div className='text-center'>
                      <Sparkles className='w-12 h-12 text-crd-orange mx-auto mb-2' />
                      <Typography variant='card'>Effects Preview</Typography>
                      <Typography variant='small-body'>
                        {Object.values(activeEffects).filter(Boolean).length}{' '}
                        effects active
                      </Typography>
                    </div>
                  </div>

                  <CRDButton
                    onClick={generateFrames}
                    className='w-full mt-4 bg-gradient-to-r from-crd-orange to-crd-purple hover:from-crd-orange/90 hover:to-crd-purple/90 text-white'
                    size='lg'
                  >
                    Generate Frames with Effects
                    <Wand2 className='w-4 h-4 ml-2' />
                  </CRDButton>
                </div>
              </CRDCard>
            </div>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value='export' className='space-y-6'>
            <motion.div
              className='text-center'
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant='hero' className='mb-4'>
                Your CRD Frames Are Ready!
              </Typography>
              <Typography
                variant='large-body'
                className='max-w-2xl mx-auto text-crd-lightGray'
              >
                We've generated multiple frame variations from your PSD layers.
                Choose the ones you want to use in CRD Studio.
              </Typography>
            </motion.div>

            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {generatedFrames.map((frame, index) => (
                <motion.div
                  key={frame.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CRDCard className='hover:shadow-lg transition-shadow cursor-pointer'>
                    <div className='p-4'>
                      <div className='aspect-[3/4] bg-gradient-to-br from-crd-purple/20 to-crd-orange/20 rounded-lg mb-4 flex items-center justify-center'>
                        <div className='text-center'>
                          <Zap className='w-8 h-8 text-crd-orange mx-auto mb-2' />
                          <Typography variant='card'>{frame.name}</Typography>
                        </div>
                      </div>
                      <div className='space-y-3'>
                        <Typography variant='component'>
                          {frame.name}
                        </Typography>
                        <Typography variant='small-body'>
                          Generated from {frame.layers.length} active layers
                        </Typography>

                        <div className='flex flex-wrap gap-1'>
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

                        <div className='flex gap-2'>
                          <CRDButton
                            variant='outline'
                            size='sm'
                            className='flex-1'
                          >
                            Preview
                            <Eye className='w-4 h-4 ml-1' />
                          </CRDButton>
                          <CRDButton
                            className='flex-1 bg-gradient-to-r from-crd-orange to-crd-purple hover:from-crd-orange/90 hover:to-crd-purple/90 text-white'
                            onClick={() => exportToStudio(frame)}
                          >
                            Use in Studio
                            <Zap className='w-4 h-4 ml-1' />
                          </CRDButton>
                        </div>
                      </div>
                    </div>
                  </CRDCard>
                </motion.div>
              ))}
            </div>

            <div className='text-center pt-6'>
              <CRDButton
                onClick={() => navigate('/create/crd')}
                className='bg-gradient-to-r from-crd-orange to-crd-purple hover:from-crd-orange/90 hover:to-crd-purple/90 text-white px-8 py-4'
                size='lg'
              >
                Open CRD Studio
                <Zap className='w-4 h-4 ml-2' />
              </CRDButton>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
