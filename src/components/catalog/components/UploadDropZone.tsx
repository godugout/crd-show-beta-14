
import React from 'react';
import { UniversalUploadComponent } from '@/components/media/UniversalUploadComponent';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface UploadDropZoneProps {
  onFilesAdded: (files: File[]) => void;
}

export const UploadDropZone = ({ onFilesAdded }: UploadDropZoneProps) => {
  const handleFilesSelected = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      toast.warning(`${files.length - imageFiles.length} non-image files were skipped`);
    }

    if (imageFiles.length > 0) {
      onFilesAdded(imageFiles);
      toast.success(`Added ${imageFiles.length} images for processing`);
    }
  };

  const handleError = (error: Error) => {
    toast.error(`Upload error: ${error.message}`);
  };

  return (
    <Card className="bg-crd-base border-crd-border">
      <CardContent className="p-6">
        <UniversalUploadComponent
          onFilesSelected={handleFilesSelected}
          onError={handleError}
          accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'] }}
          maxSize={15 * 1024 * 1024} // 15MB per file
          maxFiles={50} // Allow bulk uploads
          multiple={true}
        />
      </CardContent>
    </Card>
  );
};
