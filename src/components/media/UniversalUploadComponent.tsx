import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Upload, Camera, Folder, X, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface UniversalUploadComponentProps {
  onFilesSelected: (files: File[]) => void;
  onError?: (error: Error) => void;
  accept?: Record<string, string[]>;
  maxSize?: number; // in bytes
  maxFiles?: number;
  multiple?: boolean;
}

interface FileWithPreview extends File {
  preview?: string;
  uploadProgress?: number;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export const UniversalUploadComponent: React.FC<UniversalUploadComponentProps> = ({
  onFilesSelected,
  onError,
  accept = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    'video/*': ['.mp4', '.mov', '.avi']
  },
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  multiple = true
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Validate file
  const validateFile = useCallback((file: File): string | null => {
    console.log(`Validating file: ${file.name}`);
    
    if (file.size > maxSize) {
      return `File ${file.name} is too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB`;
    }

    const fileType = file.type;
    const isValidType = Object.keys(accept).some(acceptedType => {
      if (acceptedType.endsWith('/*')) {
        const baseType = acceptedType.replace('/*', '');
        return fileType.startsWith(baseType);
      }
      return acceptedType === fileType;
    });

    if (!isValidType) {
      return `File type ${fileType} is not supported`;
    }

    return null;
  }, [accept, maxSize]);

  // Process files
  const processFiles = useCallback((newFiles: File[]) => {
    console.log(`Processing ${newFiles.length} files`);
    
    if (files.length + newFiles.length > maxFiles) {
      const error = new Error(`Cannot upload more than ${maxFiles} files`);
      onError?.(error);
      toast.error(error.message);
      return;
    }

    const validFiles: FileWithPreview[] = [];
    const errors: string[] = [];

    newFiles.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(validationError);
        return;
      }

      const fileWithPreview: FileWithPreview = {
        ...file,
        uploadProgress: 0,
        uploadStatus: 'pending'
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        fileWithPreview.preview = URL.createObjectURL(file);
      }

      validFiles.push(fileWithPreview);
    });

    if (errors.length > 0) {
      errors.forEach(error => {
        console.error('File validation error:', error);
        toast.error(error);
      });
    }

    if (validFiles.length > 0) {
      console.log(`Adding ${validFiles.length} valid files`);
      setFiles(prev => [...prev, ...validFiles]);
      onFilesSelected(validFiles);
      toast.success(`Added ${validFiles.length} file(s) successfully`);
    }
  }, [files.length, maxFiles, validateFile, onFilesSelected, onError]);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: processFiles,
    accept,
    maxSize,
    multiple,
    noClick: true, // We'll handle clicks manually
    onError: (error) => {
      console.error('Dropzone error:', error);
      onError?.(error);
      toast.error(error.message);
    }
  });

  // Handle browse files
  const handleBrowseFiles = useCallback(() => {
    console.log('Opening file browser');
    fileInputRef.current?.click();
  }, []);

  // Handle camera
  const handleCamera = useCallback(() => {
    console.log('Opening camera');
    cameraInputRef.current?.click();
  }, []);

  // Handle folder upload
  const handleFolderUpload = useCallback(() => {
    console.log('Opening folder selector');
    folderInputRef.current?.click();
  }, []);

  // Handle file input change
  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    console.log(`File input selected ${selectedFiles.length} files`);
    if (selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
    // Reset the input
    event.target.value = '';
  }, [processFiles]);

  // Remove file
  const removeFile = useCallback((index: number) => {
    console.log(`Removing file at index ${index}`);
    setFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      // Revoke object URL to prevent memory leaks
      const removedFile = prev[index];
      if (removedFile.preview) {
        URL.revokeObjectURL(removedFile.preview);
      }
      return newFiles;
    });
  }, []);

  // Clear all files
  const clearAll = useCallback(() => {
    console.log('Clearing all files');
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
  }, [files]);

  // Cleanup previews on unmount
  React.useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
          ${isDragActive 
            ? 'border-crd-accent bg-crd-accent/10' 
            : isDragReject 
            ? 'border-red-500 bg-red-500/10'
            : 'border-crd-border bg-crd-base hover:border-crd-accent hover:bg-crd-accent/5'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className={`w-12 h-12 ${isDragActive ? 'text-crd-accent' : 'text-crd-secondary'}`} />
          </div>
          
          <div>
            <p className="text-lg font-medium text-crd-bright mb-2">
              {isDragActive 
                ? 'Drop files here...' 
                : isDragReject 
                ? 'Some files are not supported'
                : 'Drag and drop files here'
              }
            </p>
            <p className="text-crd-secondary">
              or use the buttons below to select files
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleBrowseFiles}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Browse Files
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleCamera}
              className="flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Camera
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleFolderUpload}
              className="flex items-center gap-2"
            >
              <Folder className="w-4 h-4" />
              Select Folder
            </Button>
          </div>

          {/* File Info */}
          <div className="text-xs text-crd-secondary space-y-1">
            <p>Maximum file size: {Math.round(maxSize / (1024 * 1024))}MB</p>
            <p>Maximum files: {maxFiles}</p>
            <p>Accepted types: {Object.keys(accept).join(', ')}</p>
          </div>
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={Object.keys(accept).join(',')}
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      <input
        ref={folderInputRef}
        type="file"
        multiple
        {...({ webkitdirectory: "" } as any)}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* File Preview */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-crd-bright">
              Selected Files ({files.length})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="text-red-400 hover:text-red-300"
            >
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, index) => (
              <Card key={`${file.name}-${index}`} className="p-4 bg-crd-darker border-crd-border">
                <div className="space-y-3">
                  {/* Preview */}
                  {file.preview ? (
                    <div className="aspect-video bg-crd-darkest rounded overflow-hidden">
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-crd-darkest rounded flex items-center justify-center">
                      <Upload className="w-8 h-8 text-crd-secondary" />
                    </div>
                  )}

                  {/* File Info */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-crd-bright truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-crd-secondary">
                          {file.type} • {Math.round(file.size / 1024)}KB
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Upload Progress */}
                    {file.uploadStatus === 'uploading' && (
                      <div className="space-y-1">
                        <Progress value={file.uploadProgress || 0} className="h-2" />
                        <p className="text-xs text-crd-secondary">
                          Uploading... {file.uploadProgress || 0}%
                        </p>
                      </div>
                    )}

                    {/* Status Icons */}
                    <div className="flex items-center justify-end">
                      {file.uploadStatus === 'success' && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                      {file.uploadStatus === 'error' && (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>

                    {/* Error Message */}
                    {file.error && (
                      <p className="text-xs text-red-400">
                        {file.error}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};