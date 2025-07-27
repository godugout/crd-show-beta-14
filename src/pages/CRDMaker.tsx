import type { PSDLayer } from '@/components/editor/crd/import/CRDPSDProcessor';
import { FrameGenerator } from '@/components/psd/FrameGenerator';
import { LayerManager } from '@/components/psd/LayerManager';
import { PSDUploadZone } from '@/components/psd/PSDUploadZone';
import { PSDJobHistory } from '@/components/psd/PSDJobHistory';
import { usePSDProcessingWorker } from '@/hooks/usePSDProcessingWorker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    ArrowRight,
    Clock,
    Crown,
    Download,
    Eye,
    Layers,
    Sparkles,
    Upload
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface CRDMakerState {
  currentStep: 'welcome' | 'upload' | 'processing' | 'layers' | 'frames' | 'complete' | 'history';
  psdFile: File | null;
  layers: PSDLayer[];
  selectedLayers: Set<string>;
  visibleLayers: Set<string>;
  generatedFrames: any[];
  processingProgress: number;
  processingStep: string;
}

export const CRDMaker: React.FC = () => {
  const navigate = useNavigate();
  const { processPSDFile, isProcessing, progress, step, error, result } = usePSDProcessingWorker();
  const [state, setState] = useState<CRDMakerState>({
    currentStep: 'welcome',
    psdFile: null,
    layers: [],
    selectedLayers: new Set(),
    visibleLayers: new Set(),
    generatedFrames: [],
    processingProgress: 0,
    processingStep: ''
  });

  const handlePSDUpload = async (file: File) => {
    setState(prev => ({ ...prev, psdFile: file, currentStep: 'processing' }));
    
    try {
      // Simulate processing steps
      setState(prev => ({ ...prev, processingStep: 'Analyzing PSD structure...', processingProgress: 20 }));
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setState(prev => ({ ...prev, processingStep: 'Extracting layers...', processingProgress: 50 }));
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setState(prev => ({ ...prev, processingStep: 'Converting to CRD format...', processingProgress: 80 }));
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setState(prev => ({ ...prev, processingStep: 'Complete!', processingProgress: 100 }));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock layers for demo
      const mockLayers: PSDLayer[] = [
        {
          id: 'layer-1',
          name: 'Background',
          type: 'layer',
          visible: true,
          opacity: 1,
          bounds: { x: 0, y: 0, width: 800, height: 600 },
          imageUrl: '/placeholder-bg.png',
          children: []
        },
        {
          id: 'layer-2',
          name: 'Character',
          type: 'layer',
          visible: true,
          opacity: 1,
          bounds: { x: 200, y: 100, width: 400, height: 500 },
          imageUrl: '/placeholder-character.png',
          children: []
        },
        {
          id: 'layer-3',
          name: 'Effects',
          type: 'layer',
          visible: true,
          opacity: 0.8,
          bounds: { x: 0, y: 0, width: 800, height: 600 },
          imageUrl: '/placeholder-effects.png',
          children: []
        }
      ];
      
      const visibleLayerIds = new Set(mockLayers.filter(l => l.visible).map(l => l.id));
      
      setState(prev => ({
        ...prev,
        layers: mockLayers,
        selectedLayers: visibleLayerIds,
        visibleLayers: visibleLayerIds,
        currentStep: 'layers'
      }));
      
      toast.success('PSD processed successfully! Found 3 layers.');
    } catch (error) {
      console.error('Error processing PSD:', error);
      toast.error('Failed to process PSD file');
      setState(prev => ({ ...prev, currentStep: 'upload' }));
    }
  };

  const handleLayerToggle = (layerId: string) => {
    setState(prev => {
      const newSelected = new Set(prev.selectedLayers);
      if (newSelected.has(layerId)) {
        newSelected.delete(layerId);
      } else {
        newSelected.add(layerId);
      }
      return { ...prev, selectedLayers: newSelected };
    });
  };

  const handleLayerVisibilityToggle = (layerId: string) => {
    setState(prev => {
      const newVisible = new Set(prev.visibleLayers);
      if (newVisible.has(layerId)) {
        newVisible.delete(layerId);
      } else {
        newVisible.add(layerId);
      }
      return { ...prev, visibleLayers: newVisible };
    });
  };

  const handleGenerateFrames = async () => {
    setState(prev => ({ ...prev, currentStep: 'frames' }));
    
    try {
      // Simulate frame generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockFrames = [
        {
          id: 'frame-1',
          name: 'Classic Frame',
          preview: '/placeholder-frame-1.png',
          layers: Array.from(state.selectedLayers)
        },
        {
          id: 'frame-2',
          name: 'Modern Frame',
          preview: '/placeholder-frame-2.png',
          layers: Array.from(state.selectedLayers)
        },
        {
          id: 'frame-3',
          name: 'Premium Frame',
          preview: '/placeholder-frame-3.png',
          layers: Array.from(state.selectedLayers)
        }
      ];
      
      setState(prev => ({
        ...prev,
        generatedFrames: mockFrames,
        currentStep: 'complete'
      }));
      
      toast.success('Generated 3 frame variations!');
    } catch (error) {
      console.error('Error generating frames:', error);
      toast.error('Failed to generate frames');
    }
  };

  const handleExportFrame = (frameId: string) => {
    toast.success('Frame exported to your template library!');
    navigate('/cards/create', { 
      state: { 
        importedFrameId: frameId,
        fromCRDMKR: true 
      }
    });
  };

  const renderWelcomeStep = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="w-24 h-24 bg-gradient-to-br from-crd-blue to-crd-purple rounded-full flex items-center justify-center mx-auto">
          <Crown className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-crd-white">CRDMKR Studio</h1>
        <p className="text-xl text-crd-lightGray max-w-2xl mx-auto">
          Transform your Photoshop designs into professional card templates with our advanced PSD-to-CRD conversion tool.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="bg-crd-darker border-crd-mediumGray/30">
          <CardContent className="p-6 text-center">
            <Upload className="w-8 h-8 text-crd-blue mx-auto mb-4" />
            <h3 className="text-crd-white font-semibold mb-2">Upload PSD</h3>
            <p className="text-crd-lightGray text-sm">
              Drag and drop your Photoshop files to begin the conversion process
            </p>
          </CardContent>
        </Card>

        <Card className="bg-crd-darker border-crd-mediumGray/30">
          <CardContent className="p-6 text-center">
            <Layers className="w-8 h-8 text-crd-green mx-auto mb-4" />
            <h3 className="text-crd-white font-semibold mb-2">Layer Management</h3>
            <p className="text-crd-lightGray text-sm">
              Organize and customize layers to create the perfect composition
            </p>
          </CardContent>
        </Card>

        <Card className="bg-crd-darker border-crd-mediumGray/30">
          <CardContent className="p-6 text-center">
            <Sparkles className="w-8 h-8 text-crd-orange mx-auto mb-4" />
            <h3 className="text-crd-white font-semibold mb-2">Generate Frames</h3>
            <p className="text-crd-lightGray text-sm">
              Create multiple frame variations and export as CRD templates
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 justify-center">
        <Button 
          onClick={() => setState(prev => ({ ...prev, currentStep: 'upload' }))}
          className="bg-crd-blue hover:bg-crd-lightBlue text-white px-8 py-4 text-lg"
        >
          <Upload className="w-5 h-5 mr-2" />
          Start Converting PSD Files
        </Button>
        
        <Button 
          onClick={() => setState(prev => ({ ...prev, currentStep: 'history' }))}
          variant="outline"
          className="border-crd-mediumGray text-crd-white hover:bg-crd-mediumGray px-8 py-4 text-lg"
        >
          <Clock className="w-5 h-5 mr-2" />
          View History
        </Button>
      </div>
    </div>
  );

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-crd-white mb-2">Upload PSD File</h2>
        <p className="text-crd-lightGray">
          Select your Photoshop file to begin the conversion process
        </p>
      </div>
      
      <PSDUploadZone
        onPSDParsed={(fileName, layers) => {
          setState(prev => ({
            ...prev,
            layers,
            selectedLayers: new Set(layers.filter(l => l.visible).map(l => l.id)),
            visibleLayers: new Set(layers.filter(l => l.visible).map(l => l.id)),
            currentStep: 'layers'
          }));
        }}
        onError={(error) => {
          toast.error(error);
        }}
      />
    </div>
  );

  const renderProcessingStep = () => (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-crd-blue/10 rounded-full flex items-center justify-center mx-auto">
          <Layers className="w-8 h-8 text-crd-blue animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-crd-white">Processing PSD File</h2>
        <p className="text-crd-lightGray">{state.processingStep}</p>
      </div>
      
      <div className="max-w-md mx-auto space-y-2">
        <Progress value={state.processingProgress} className="w-full" />
        <p className="text-sm text-crd-lightGray">{state.processingProgress}% complete</p>
      </div>
    </div>
  );

  const renderLayersStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-crd-white mb-2">Layer Management</h2>
        <p className="text-crd-lightGray">
          Select which layers to include in your card composition
        </p>
      </div>
      
      <LayerManager
        layers={state.layers}
        selectedLayers={state.selectedLayers}
        visibleLayers={state.visibleLayers}
        onLayerToggle={handleLayerToggle}
        onLayerVisibilityToggle={handleLayerVisibilityToggle}
        onGenerateFrames={handleGenerateFrames}
      />
    </div>
  );

  const renderFramesStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-crd-white mb-2">Generated Frames</h2>
        <p className="text-crd-lightGray">
          Review and export your generated frame templates
        </p>
      </div>
      
      <FrameGenerator
        frames={state.generatedFrames}
        onExportFrame={handleExportFrame}
      />
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-crd-green/10 rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8 text-crd-green" />
        </div>
        <h2 className="text-2xl font-bold text-crd-white">Conversion Complete!</h2>
        <p className="text-crd-lightGray">
          Your PSD has been successfully converted to CRD templates
        </p>
      </div>
      
      <div className="flex justify-center gap-4">
        <Button
          onClick={() => setState(prev => ({ ...prev, currentStep: 'upload' }))}
          variant="outline"
          className="border-crd-mediumGray text-crd-white hover:bg-crd-mediumGray"
        >
          Convert Another PSD
        </Button>
        <Button
          onClick={() => navigate('/cards/create')}
          className="bg-crd-blue hover:bg-crd-lightBlue text-white"
        >
          Go to Card Creator
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (state.currentStep) {
      case 'welcome':
        return renderWelcomeStep();
      case 'upload':
        return renderUploadStep();
      case 'processing':
        return renderProcessingStep();
      case 'layers':
        return renderLayersStep();
      case 'frames':
        return renderFramesStep();
      case 'complete':
        return renderCompleteStep();
      case 'history':
        return <PSDJobHistory />;
      default:
        return renderWelcomeStep();
    }
  };

  return (
    <div className="min-h-screen bg-crd-darkest pt-16">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-crd-white">CRDMKR Studio</h1>
              <p className="text-crd-lightGray">PSD-to-CRD Conversion Tool</p>
            </div>
            <Badge variant="secondary" className="bg-crd-blue/20 text-crd-blue border-crd-blue/30">
              <Crown className="w-3 h-3 mr-1" />
              Premium Tool
            </Badge>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { key: 'welcome', label: 'Welcome', icon: Crown },
              { key: 'upload', label: 'Upload', icon: Upload },
              { key: 'processing', label: 'Processing', icon: Layers },
              { key: 'layers', label: 'Layers', icon: Eye },
              { key: 'frames', label: 'Frames', icon: Sparkles },
              { key: 'complete', label: 'Complete', icon: Download },
              { key: 'history', label: 'History', icon: Clock }
            ].map((step, index) => {
              const isActive = state.currentStep === step.key;
              const isCompleted = ['welcome', 'upload', 'processing', 'layers', 'frames', 'complete'].indexOf(state.currentStep) > 
                                  ['welcome', 'upload', 'processing', 'layers', 'frames', 'complete'].indexOf(step.key);
              const Icon = step.icon;

              return (
                <div key={step.key} className="flex items-center">
                  <div className={`flex items-center gap-2 ${
                    isActive ? 'text-crd-blue' : isCompleted ? 'text-crd-green' : 'text-crd-lightGray'
                  }`}>
                    <div className={`rounded-full p-2 ${
                      isActive ? 'bg-crd-blue/10' : isCompleted ? 'bg-crd-green/10' : 'bg-crd-mediumGray/20'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{step.label}</span>
                  </div>
                  {index < 6 && <div className="w-8 h-px bg-crd-mediumGray/30 mx-4" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <Card className="bg-crd-darker border-crd-mediumGray/30">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CRDMaker; 