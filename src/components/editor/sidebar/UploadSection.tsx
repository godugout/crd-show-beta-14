
import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { uploadCardImage } from '@/lib/cardImageUploader';
import { useCardEditor } from '@/hooks/useCardEditor';
import { useCustomAuth } from '@/features/auth/hooks/useCustomAuth';
import { DropZone } from '../upload/DropZone';
import { FilePreview } from '../upload/FilePreview';

interface UploadSectionProps {
  cardEditor?: ReturnType<typeof useCardEditor>;
}

export const UploadSection = ({ cardEditor }: UploadSectionProps) => {
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useCustomAuth();

  const handleFileSelection = (file: File) => {
    console.log('📁 File selected:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    setFileToUpload(file);
    
    const reader = new FileReader();
    reader.onload = () => {
      setUploadPreview(reader.result as string);
      console.log('👁️ Preview generated successfully');
    };
    reader.onerror = (error) => {
      console.error('❌ FileReader error:', error);
      toast.error('Failed to generate preview');
    };
    reader.readAsDataURL(file);
    
    toast.success('File selected', { 
      description: file.name
    });
  };

  const handleUpload = async () => {
    if (!fileToUpload || !cardEditor) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to upload images');
      return;
    }

    console.log('🚀 Starting upload process...');
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadCardImage({
        file: fileToUpload,
        cardId: cardEditor.cardData.id,
        userId: user.id,
        onProgress: setUploadProgress
      });

      if (result && result.url && !result.error) {
        console.log('✅ Upload successful:', result.url);
        
        // Update card with the persistent image URL
        cardEditor.updateCardField('image_url', result.url);
        if (result.thumbnailUrl) {
          cardEditor.updateCardField('thumbnail_url', result.thumbnailUrl);
          cardEditor.updateDesignMetadata('thumbnailUrl', result.thumbnailUrl);
        }
        
        toast.success('Image uploaded successfully', {
          description: 'Your card image has been saved permanently.',
        });

        cancelUpload();
      } else {
        console.error('❌ Upload failed:', result?.error);
        toast.error('Upload failed', {
          description: result?.error || 'Unknown error occurred'
        });
      }
    } catch (error: any) {
      console.error('💥 Upload error:', error);
      toast.error('Failed to upload image', {
        description: error.message || 'Unknown error occurred'
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const cancelUpload = () => {
    console.log('❌ Upload cancelled');
    setFileToUpload(null);
    setUploadPreview(null);
    setUploadProgress(0);
  };

  return (
    <div className="space-y-4">
      {!fileToUpload ? (
        <DropZone onFileSelect={handleFileSelection} />
      ) : (
        <FilePreview
          file={fileToUpload}
          uploadPreview={uploadPreview}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          onCancel={cancelUpload}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
};
