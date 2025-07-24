
import React from 'react';
import { Button } from '@/components/ui/button';
import { Scissors } from 'lucide-react';

interface UploadActionsProps {
  selectedPhoto: string;
  isAnalyzing: boolean;
  onChooseFile: () => void;
  onAdvancedCrop: () => void;
}

export const UploadActions = ({ 
  selectedPhoto, 
  isAnalyzing, 
  onChooseFile, 
  onAdvancedCrop 
}: UploadActionsProps) => {
  return (
    <div className="flex justify-center gap-4 mb-8">
      <Button
        onClick={onChooseFile}
        className="bg-crd-darkGray border border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray hover:text-white hover:border-crd-lightGray transition-all"
        disabled={isAnalyzing}
      >
        Choose File
      </Button>
      {selectedPhoto && (
        <Button
          onClick={onAdvancedCrop}
          className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
          disabled={isAnalyzing}
        >
          <Scissors className="w-4 h-4 mr-2" />
          Advanced Crop
        </Button>
      )}
    </div>
  );
};
