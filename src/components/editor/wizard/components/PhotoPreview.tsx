
import React from 'react';
import { Upload, Check } from 'lucide-react';

interface PhotoPreviewProps {
  selectedPhoto: string;
  imageDetails: {
    dimensions: { width: number; height: number };
    aspectRatio: number;
    fileSize: string;
  } | null;
}

export const PhotoPreview = ({ selectedPhoto, imageDetails }: PhotoPreviewProps) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-crd-darkGray rounded-lg p-8 border-2 border-dashed border-crd-lightGray/30 max-w-md">
        {selectedPhoto ? (
          <div className="space-y-4">
            <div className="relative bg-white p-2 rounded-lg shadow-lg" style={{ width: 200, height: 280 }}>
              <img 
                src={selectedPhoto} 
                alt="Card preview" 
                className="w-full h-full object-cover rounded"
              />
              <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1 rounded">
                Card Preview
              </div>
            </div>
            
            <div className="text-crd-green text-sm flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              Photo optimized for card format!
            </div>
            
            {imageDetails && (
              <div className="text-crd-lightGray text-xs space-y-1">
                <div>Original: {imageDetails.dimensions.width}×{imageDetails.dimensions.height}</div>
                <div>Size: {imageDetails.fileSize}</div>
                <div>Ratio: {imageDetails.aspectRatio.toFixed(2)}:1</div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center" style={{ width: 200, height: 280 }}>
            <div className="flex flex-col items-center justify-center h-full">
              <Upload className="w-16 h-16 text-crd-lightGray mb-4" />
              <p className="text-white text-lg mb-2">Drop your image here</p>
              <p className="text-crd-lightGray text-sm">or click to browse</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
