
import React from 'react';
import { UniversalUploadComponent } from '@/components/media/UniversalUploadComponent';

interface DropZoneProps {
  onBrowse: () => void;
  onCamera: () => void;
  onFileSelect: (files: File[]) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onBrowse, onCamera, onFileSelect }) => {
  return (
    <UniversalUploadComponent
      onFilesSelected={onFileSelect}
      accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'], 'video/*': ['.mp4', '.mov', '.avi'] }}
      maxSize={50 * 1024 * 1024} // 50MB
      maxFiles={10}
      multiple={true}
    />
  );
};
