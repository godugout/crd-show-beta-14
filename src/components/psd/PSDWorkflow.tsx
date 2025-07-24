import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  Layers, 
  Download, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  FileImage
} from 'lucide-react';
import { PSDUploadZone } from './PSDUploadZone';
import { LayerMappingGrid } from './LayerMappingGrid';
import { parsePSD, type PSDLayer } from '@/components/editor/crd/import/CRDPSDProcessor';
import { uploadPSDToStorage, processAndUploadLayers } from '@/services/psd/psdStorage';
import { createCRDElements, createCRDFrame } from '@/services/crd/crdService';
import type { PSDFile } from '@/types/psd';
import { toast } from 'sonner';

interface PSDWorkflowProps {
  onComplete?: (elements: any[], frame?: any) => void;
  onCancel?: () => void;
}

type WorkflowStep = 'upload' | 'processing' | 'mapping' | 'creating' | 'complete';

export const PSDWorkflow: React.FC<PSDWorkflowProps> = ({
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('upload');
  const [psdFile, setPsdFile] = useState<PSDFile | null>(null);
  const [layers, setLayers] = useState<PSDLayer[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<Set<string>>(new Set());
  const [visibleLayers, setVisibleLayers] = useState<Set<string>>(new Set());
  const [layerOpacity, setLayerOpacity] = useState<Map<string, number>>(new Map());
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handlePSDUpload = useCallback(async (file: File) => {
    setProcessing(true);
    setProgress(0);
    setError(null);
    setCurrentStep('processing');

    try {
      // Step 1: Parse PSD
      setProgress(20);
      const result = await parsePSD(file);
      const parsedLayers = result.layers;
      
      // Step 2: Upload original PSD
      setProgress(40);
      const psdUrl = await uploadPSDToStorage(file, `psd-${Date.now()}.psd`);
      
      // Step 3: Process and upload layers
      setProgress(60);
      const processedLayers = await processAndUploadLayers(
        parsedLayers, 
        file.name.replace('.psd', ''),
        (current, total, layerName) => {
          const layerProgress = (current / total) * 30; // 30% for layer processing
          setProgress(60 + layerProgress);
        }
      );

      // Create PSD file record
      const psdFileData: PSDFile = {
        id: crypto.randomUUID(),
        name: file.name.replace('.psd', ''),
        originalUrl: psdUrl,
        width: 1920, // Default, should be extracted from PSD
        height: 1080, // Default, should be extracted from PSD
        layerCount: processedLayers.length,
        fileSize: file.size,
        uploadedAt: new Date(),
      };

      setPsdFile(psdFileData);
      setLayers(processedLayers);
      
      // Auto-select visible layers
      const visibleLayerIds = new Set(
        processedLayers
          .filter(layer => layer.visible && layer.bounds.width > 0 && layer.bounds.height > 0)
          .map(layer => layer.id)
      );
      setSelectedLayers(visibleLayerIds);
      setVisibleLayers(visibleLayerIds);

      setProgress(100);
      setCurrentStep('mapping');
      toast.success(`PSD processed successfully! Found ${processedLayers.length} layers.`);

    } catch (error) {
      console.error('Error processing PSD:', error);
      setError(error instanceof Error ? error.message : 'Failed to process PSD');
      setCurrentStep('upload');
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleLayerToggle = useCallback((layerId: string) => {
    setSelectedLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  }, []);

  const handleLayerVisibilityToggle = useCallback((layerId: string) => {
    setVisibleLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  }, []);

  const handleLayerOpacityChange = useCallback((layerId: string, opacity: number) => {
    setLayerOpacity(prev => new Map(prev).set(layerId, opacity));
  }, []);

  const handleCreateElements = useCallback(async (layerIds: string[]) => {
    if (!psdFile) return;

    setProcessing(true);
    setCurrentStep('creating');
    setProgress(0);

    try {
      const selectedLayerData = layers.filter(layer => layerIds.includes(layer.id));
      const elements = await createCRDElements(selectedLayerData, psdFile);
      
      setProgress(100);
      setCurrentStep('complete');
      
      toast.success(`Created ${elements.length} CRD elements!`);
      onComplete?.(elements);

    } catch (error) {
      console.error('Error creating elements:', error);
      setError(error instanceof Error ? error.message : 'Failed to create elements');
    } finally {
      setProcessing(false);
    }
  }, [psdFile, layers, onComplete]);

  const handleCreateFrame = useCallback(async () => {
    if (!psdFile || selectedLayers.size === 0) return;

    setProcessing(true);
    setCurrentStep('creating');

    try {
      const selectedLayerData = layers.filter(layer => selectedLayers.has(layer.id));
      const elements = await createCRDElements(selectedLayerData, psdFile);
      const frame = await createCRDFrame(elements, psdFile);

      setCurrentStep('complete');
      toast.success('Created CRD frame successfully!');
      onComplete?.(elements, frame);

    } catch (error) {
      console.error('Error creating frame:', error);
      setError(error instanceof Error ? error.message : 'Failed to create frame');
    } finally {
      setProcessing(false);
    }
  }, [psdFile, layers, selectedLayers, onComplete]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileImage className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Upload PSD File</h2>
              <p className="text-muted-foreground">
                Start by uploading a Photoshop file to extract layers and create CRD elements
              </p>
            </div>
            <PSDUploadZone 
              onPSDParsed={async (fileName, parsedLayers) => {
                // The PSDUploadZone already handles file uploading, just process the layers
                setPsdFile({
                  id: crypto.randomUUID(),
                  name: fileName,
                  originalUrl: '',
                  width: 1920,
                  height: 1080,
                  layerCount: parsedLayers.length,
                  fileSize: 0,
                  uploadedAt: new Date(),
                });
                setLayers(parsedLayers);
                setCurrentStep('mapping');
              }}
              onError={setError}
            />
          </div>
        );

      case 'processing':
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-crd-primary/10 flex items-center justify-center">
                <Layers className="h-8 w-8 text-crd-primary animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold">Processing PSD File</h2>
              <p className="text-muted-foreground">
                Extracting layers and converting to CRD-compatible format...
              </p>
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">{progress}% complete</p>
            </div>
          </div>
        );

      case 'mapping':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Layer Mapping</h2>
              <p className="text-muted-foreground">
                Select which layers to convert into CRD elements
              </p>
            </div>
            <LayerMappingGrid
              layers={layers}
              selectedLayers={selectedLayers}
              onLayerToggle={handleLayerToggle}
              onLayerVisibilityToggle={handleLayerVisibilityToggle}
              onLayerOpacityChange={handleLayerOpacityChange}
              onCreateElements={handleCreateElements}
              onCreateFrame={handleCreateFrame}
            />
          </div>
        );

      case 'creating':
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-crd-primary/10 flex items-center justify-center">
                <Download className="h-8 w-8 text-crd-primary animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold">Creating CRD Elements</h2>
              <p className="text-muted-foreground">
                Converting selected layers into reusable CRD elements...
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <Progress value={progress} className="w-full" />
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">PSD Processing Complete!</h2>
              <p className="text-muted-foreground">
                Your layers have been successfully converted to CRD elements
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={onComplete?.bind(null, [], undefined)} size="lg">
                Continue to Editor
              </Button>
              <Button variant="outline" onClick={onCancel} size="lg">
                Start Over
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">PSD to CRD Pipeline</h1>
            <div className="flex items-center gap-2">
              {currentStep !== 'upload' && (
                <Button variant="outline" onClick={() => setCurrentStep('upload')}>
                  Start Over
                </Button>
              )}
              {onCancel && (
                <Button variant="ghost" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-4">
            {[
              { key: 'upload', label: 'Upload', icon: Upload },
              { key: 'processing', label: 'Processing', icon: Layers },
              { key: 'mapping', label: 'Mapping', icon: FileImage },
              { key: 'creating', label: 'Creating', icon: Download },
              { key: 'complete', label: 'Complete', icon: CheckCircle }
            ].map((step, index) => {
              const isActive = currentStep === step.key;
              const isCompleted = ['upload', 'processing', 'mapping', 'creating'].indexOf(currentStep) > 
                                  ['upload', 'processing', 'mapping', 'creating'].indexOf(step.key);
              const Icon = step.icon;

              return (
                <React.Fragment key={step.key}>
                  <div className={`flex items-center gap-2 ${
                    isActive ? 'text-crd-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
                  }`}>
                    <div className={`rounded-full p-2 ${
                      isActive ? 'bg-crd-primary/10' : isCompleted ? 'bg-green-100' : 'bg-muted'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{step.label}</span>
                  </div>
                  {index < 4 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step Content */}
        <Card>
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Info Panel */}
        {psdFile && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm">PSD File Info</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{psdFile.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Dimensions</p>
                  <p className="font-medium">{psdFile.width} × {psdFile.height}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Layers</p>
                  <p className="font-medium">{psdFile.layerCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Size</p>
                  <p className="font-medium">{(psdFile.fileSize / 1024 / 1024).toFixed(1)} MB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};