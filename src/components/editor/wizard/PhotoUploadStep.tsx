
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Sparkles, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { AdvancedCropper } from '../AdvancedCropper';
import { BulkUploadOption } from '../BulkUploadOption';
import { PhotoPreview } from './components/PhotoPreview';
import { UploadActions } from './components/UploadActions';
import { ReadySection } from './components/ReadySection';
import { AnalysisReviewPrompt } from './components/AnalysisReviewPrompt';
import { usePhotoUpload } from './hooks/usePhotoUpload';
import type { UnifiedAnalysisResult } from '@/services/imageAnalysis/unifiedCardAnalyzer';

interface PhotoUploadStepProps {
  selectedPhoto: string;
  onPhotoSelect: (photo: string) => void;
  onAnalysisComplete?: (analysis: UnifiedAnalysisResult) => void;
  onBulkUpload?: () => void;
}

export const PhotoUploadStep = ({ 
  selectedPhoto, 
  onPhotoSelect, 
  onAnalysisComplete, 
  onBulkUpload 
}: PhotoUploadStepProps) => {
  const [showAdvancedCrop, setShowAdvancedCrop] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<UnifiedAnalysisResult | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  
  const { isAnalyzing, imageDetails, handleFileUpload } = usePhotoUpload(
    onPhotoSelect, 
    (analysis) => {
      setAnalysisResult(analysis);
      onAnalysisComplete?.(analysis);
    }
  );

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setAnalysisResult(null);
      setShowManualEntry(false);
      await handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true
  });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAnalysisResult(null);
      setShowManualEntry(false);
      await handleFileUpload(file);
    }
    event.target.value = '';
  };

  const handleAdvancedCropComplete = (crops: { main?: string; frame?: string; elements?: string[] }) => {
    if (crops.main) {
      onPhotoSelect(crops.main);
      toast.success('Advanced crop applied to card!');
      // Re-analyze the cropped image
      setAnalysisResult(null);
      handleFileUpload(new File([crops.main], 'cropped.jpg'));
    }
    setShowAdvancedCrop(false);
  };

  const handleRetryAnalysis = async () => {
    if (selectedPhoto) {
      setAnalysisResult(null);
      // Create a mock file from the selected photo for re-analysis
      try {
        const response = await fetch(selectedPhoto);
        const blob = await response.blob();
        const file = new File([blob], 'retry.jpg');
        await handleFileUpload(file);
      } catch (error) {
        toast.error('Failed to retry analysis');
      }
    }
  };

  const handleManualEntry = () => {
    setShowManualEntry(true);
    // Clear analysis result to allow manual input
    const manualAnalysis: UnifiedAnalysisResult = {
      title: 'Manual Entry',
      description: 'Card details entered manually',
      rarity: 'common',
      estimatedValue: 0,
      confidence: 0,
      category: 'Baseball Card',
      type: 'Sports Card',
      specialFeatures: [],
      tags: ['manual-entry'],
      sources: {
        ocr: false,
        visual: false,
        webSearch: false,
        database: false
      }
    };
    setAnalysisResult(manualAnalysis);
    onAnalysisComplete?.(manualAnalysis);
  };

  const handleProceedAnyway = () => {
    if (analysisResult) {
      toast.info('Proceeding with current analysis results');
      onAnalysisComplete?.(analysisResult);
    }
  };

  // Show advanced cropper if active
  if (showAdvancedCrop && selectedPhoto) {
    return (
      <div className="h-[600px]">
        <AdvancedCropper
          imageUrl={selectedPhoto}
          onCropComplete={handleAdvancedCropComplete}
          onCancel={() => setShowAdvancedCrop(false)}
          aspectRatio={2.5 / 3.5}
        />
      </div>
    );
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'epic': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'rare': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'uncommon': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {isAnalyzing && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-crd-green">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-sm">Running comprehensive card analysis (OCR + Visual + Web Search)...</span>
          </div>
        </div>
      )}
      
      <PhotoPreview selectedPhoto={selectedPhoto} imageDetails={imageDetails} />

      {/* Enhanced Analysis Results Display */}
      {analysisResult && analysisResult.confidence > 0.3 && (
        <div className="bg-crd-mediumGray/20 border border-crd-mediumGray/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-crd-green" />
            <h3 className="text-crd-white font-medium">Analysis Results</h3>
            <Badge variant="outline" className="text-crd-green border-crd-green/30">
              {Math.round(analysisResult.confidence * 100)}% confidence
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card Info */}
            <div className="space-y-2">
              <h4 className="text-crd-lightGray text-sm">Detected Card</h4>
              <div className="text-crd-white font-medium">{analysisResult.title}</div>
              {analysisResult.playerName && (
                <div className="text-sm text-crd-lightGray">Player: {analysisResult.playerName}</div>
              )}
            </div>

            {/* Value & Rarity */}
            <div className="space-y-2">
              <h4 className="text-crd-lightGray text-sm">Value & Rarity</h4>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-crd-green" />
                <span className="text-crd-white font-medium">${analysisResult.estimatedValue.toFixed(2)}</span>
              </div>
              <Badge className={getRarityColor(analysisResult.rarity)}>
                {analysisResult.rarity.toUpperCase()}
              </Badge>
            </div>

            {/* Analysis Sources */}
            <div className="space-y-2">
              <h4 className="text-crd-lightGray text-sm">Analysis Sources</h4>
              <div className="flex flex-wrap gap-1">
                {analysisResult.sources.ocr && (
                  <Badge variant="outline" className="text-xs text-crd-green border-crd-green/30">OCR</Badge>
                )}
                {analysisResult.sources.visual && (
                  <Badge variant="outline" className="text-xs text-crd-green border-crd-green/30">Visual</Badge>
                )}
                {analysisResult.sources.webSearch && (
                  <Badge variant="outline" className="text-xs text-crd-green border-crd-green/30">Web</Badge>
                )}
                {analysisResult.sources.database && (
                  <Badge variant="outline" className="text-xs text-crd-green border-crd-green/30">DB</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show analysis review prompt if analysis completed with issues */}
      {analysisResult && (analysisResult.confidence < 0.5) && (
        <AnalysisReviewPrompt
          confidence={analysisResult.confidence}
          detectionMethod="unified"
          requiresManualReview={analysisResult.confidence < 0.3}
          error={false}
          message={`Analysis complete with ${Math.round(analysisResult.confidence * 100)}% confidence. Review recommended.`}
          onRetryAnalysis={handleRetryAnalysis}
          onManualEntry={handleManualEntry}
          onProceedAnyway={analysisResult.confidence > 0.2 ? handleProceedAnyway : undefined}
        />
      )}

      <UploadActions
        selectedPhoto={selectedPhoto}
        isAnalyzing={isAnalyzing}
        onChooseFile={() => document.getElementById('photo-input')?.click()}
        onAdvancedCrop={() => setShowAdvancedCrop(true)}
      />

      {/* Bulk Upload Option - Secondary placement */}
      {onBulkUpload && (
        <div className="mb-8">
          <BulkUploadOption onSelectBulkUpload={onBulkUpload} />
        </div>
      )}

      <ReadySection 
        selectedPhoto={selectedPhoto} 
        isAnalyzing={isAnalyzing}
        analysisComplete={!!analysisResult}
        analysisSuccessful={analysisResult && analysisResult.confidence > 0.5}
      />

      {/* Hidden file input */}
      <input
        id="photo-input"
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />
    </div>
  );
};
