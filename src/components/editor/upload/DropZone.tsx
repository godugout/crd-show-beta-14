
import React from 'react';
import { UniversalUploadComponent } from '@/components/media/UniversalUploadComponent';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
}

export const DropZone = ({ onFileSelect }: DropZoneProps) => {
  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <UniversalUploadComponent
      onFilesSelected={handleFilesSelected}
      accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] }}
      maxSize={10 * 1024 * 1024} // 10MB
      maxFiles={1}
      multiple={false}
    />
  );
};
