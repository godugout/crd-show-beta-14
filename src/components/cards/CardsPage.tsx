
import React, { useState } from 'react';
import { CardsImageUpload } from './components/CardsImageUpload';
import { SimpleCardDetector } from './components/SimpleCardDetector';
import { DetectedCardsGrid } from './components/DetectedCardsGrid';
import { StreamlinedAdvancedCropper } from '@/components/editor/StreamlinedAdvancedCropper';
import type { CardDetectionResult } from '@/services/cardDetection';
import type { CropCompleteData } from '@/types/cards';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  processed?: boolean;
}

export const CardsPage: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [detectionResults, setDetectionResults] = useState<CardDetectionResult[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImageForCropping, setSelectedImageForCropping] = useState<string | null>(null);

  const handleImagesUploaded = (images: UploadedImage[]): void => {
    setUploadedImages(images);
    setDetectionResults([]);
  };

  const handleDetectionComplete = (results: CardDetectionResult[]): void => {
    setDetectionResults(results);
    setIsDetecting(false);
  };

  const handleAdvancedCrop = (imageUrl: string) => {
    setSelectedImageForCropping(imageUrl);
    setShowCropper(true);
  };

  const handleCropComplete = (crops: { main?: string; frame?: string; elements?: string[] }): void => {
    console.log('Crop results:', crops);
    setShowCropper(false);
    setSelectedImageForCropping(null);
    // Handle the cropped results - integrate with your card creation flow
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setSelectedImageForCropping(null);
  };

  const clearAll = (): void => {
    setUploadedImages([]);
    setDetectionResults([]);
    setIsDetecting(false);
    setShowCropper(false);
    setSelectedImageForCropping(null);
  };

  // Show cropper if active
  if (showCropper && selectedImageForCropping) {
    return (
      <div className="h-screen">
        <StreamlinedAdvancedCropper
          imageUrl={selectedImageForCropping}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={2.5 / 3.5}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="bg-crd-darker border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Create New Card</h1>
          {(uploadedImages.length > 0 || detectionResults.length > 0) && (
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
            >
              Start Over
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Step 1: Upload Images */}
        {uploadedImages.length === 0 && detectionResults.length === 0 && (
          <div className="bg-crd-darker rounded-xl border border-crd-mediumGray/20 p-8">
            <CardsImageUpload onImagesProcessed={handleImagesUploaded} />
          </div>
        )}

        {/* Step 2: Detect Cards */}
        {uploadedImages.length > 0 && detectionResults.length === 0 && (
          <div className="bg-crd-darker rounded-xl border border-crd-mediumGray/20 p-8">
            <SimpleCardDetector
              images={uploadedImages}
              onDetectionComplete={handleDetectionComplete}
              isDetecting={isDetecting}
              setIsDetecting={setIsDetecting}
            />
          </div>
        )}

        {/* Step 3: Show Results */}
        {detectionResults.length > 0 && (
          <div className="bg-crd-darker rounded-xl border border-crd-mediumGray/20 p-8">
            <DetectedCardsGrid 
              results={detectionResults}
              onStartOver={clearAll}
              onAdvancedCrop={handleAdvancedCrop}
            />
          </div>
        )}
      </div>
    </div>
  );
};
