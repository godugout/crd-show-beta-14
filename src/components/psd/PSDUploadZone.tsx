import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { parsePSD, type PSDLayer } from '@/components/editor/crd/import/CRDPSDProcessor';
import { uploadPSDToStorage } from '@/services/psd/psdStorage';

interface PSDUploadZoneProps {
  onPSDParsed: (fileName: string, layers: PSDLayer[]) => void;
  onError: (error: string) => void;
  className?: string;
}

export const PSDUploadZone: React.FC<PSDUploadZoneProps> = ({
  onPSDParsed,
  onError,
  className = ""
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.psd')) {
      onError('Please upload a valid PSD file');
      return;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      onError('PSD file must be smaller than 50MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Step 1: Parse PSD file
      setCurrentStep("Parsing PSD file...");
      setUploadProgress(20);
      
      const result = await parsePSD(file);
      
      setCurrentStep("Finalizing...");
      setUploadProgress(100);
      
      onPSDParsed(file.name.replace('.psd', ''), result.layers);
      
    } catch (error) {
      console.error('Error processing PSD:', error);
      onError(error instanceof Error ? error.message : 'Failed to process PSD file');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentStep("");
    }
  }, [onPSDParsed, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/vnd.adobe.photoshop': ['.psd']
    },
    multiple: false,
    disabled: isUploading
  });

  return (
    <div className={`w-full ${className}`}>
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 min-h-[200px] flex flex-col items-center justify-center
          ${isDragActive 
            ? 'border-crd-primary bg-crd-primary/5' 
            : 'border-muted-foreground/25 hover:border-crd-primary/50 hover:bg-muted/50'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="space-y-4 w-full max-w-sm">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-crd-primary" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{currentStep}</p>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              {isDragActive ? (
                <FileImage className="h-12 w-12 text-crd-primary" />
              ) : (
                <Upload className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {isDragActive ? 'Drop your PSD file here' : 'Upload PSD File'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop a Photoshop file, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: .psd files up to 50MB
              </p>
            </div>

            <Button 
              variant="outline" 
              size="sm"
              className="mt-4"
              type="button"
            >
              Browse Files
            </Button>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Tips for best results:</strong>
            <ul className="mt-1 space-y-1 text-xs">
              <li>• Use named layers for better organization</li>
              <li>• Flatten complex layer styles for compatibility</li>
              <li>• Keep text layers as vector when possible</li>
              <li>• Use folders to group related elements</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};