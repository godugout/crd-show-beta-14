import { CRDBadge } from '@/components/ui/design-system/Badge';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Typography } from '@/components/ui/design-system/Typography';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, FileImage, Upload, X } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

interface PSDUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFileSize?: number; // in MB
  maxFiles?: number;
  acceptedFormats?: string[];
  className?: string;
}

export const PSDUploadZone: React.FC<PSDUploadZoneProps> = ({
  onFilesSelected,
  maxFileSize = 500, // 500MB default
  maxFiles = 10,
  acceptedFormats = ['.psd', '.psb'],
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      file: File;
      status: 'valid' | 'invalid' | 'processing';
      error?: string;
    }>
  >([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const validateFile = useCallback(
    (file: File): { isValid: boolean; error?: string } => {
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        return {
          isValid: false,
          error: `File size exceeds ${maxFileSize}MB limit`,
        };
      }

      // Check file format
      const fileExtension = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf('.'));
      if (!acceptedFormats.includes(fileExtension)) {
        return {
          isValid: false,
          error: `File format not supported. Accepted formats: ${acceptedFormats.join(', ')}`,
        };
      }

      // Check if file is actually a PSD (basic validation)
      if (file.size < 1024) {
        return {
          isValid: false,
          error: 'File appears to be too small to be a valid PSD',
        };
      }

      return { isValid: true };
    },
    [maxFileSize, acceptedFormats]
  );

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const validFiles: File[] = [];
      const fileStatuses: Array<{
        file: File;
        status: 'valid' | 'invalid' | 'processing';
        error?: string;
      }> = [];

      fileArray.forEach(file => {
        const validation = validateFile(file);
        if (validation.isValid) {
          validFiles.push(file);
          fileStatuses.push({ file, status: 'valid' });
        } else {
          fileStatuses.push({
            file,
            status: 'invalid',
            error: validation.error,
          });
        }
      });

      setUploadedFiles(prev => [...prev, ...fileStatuses]);

      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
        toast.success(`Successfully uploaded ${validFiles.length} PSD file(s)`);
      }

      if (fileStatuses.some(f => f.status === 'invalid')) {
        const invalidCount = fileStatuses.filter(
          f => f.status === 'invalid'
        ).length;
        toast.error(`${invalidCount} file(s) failed validation`);
      }
    },
    [validateFile, onFilesSelected]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles]
  );

  const removeFile = useCallback((index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <motion.div
        ref={dropZoneRef}
        className={`relative border-2 border-dashed rounded-lg transition-all duration-200 ${
          isDragOver
            ? 'border-crd-orange bg-crd-orange/10'
            : 'border-crd-mediumGray/30 hover:border-crd-orange/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className='p-12'>
          <div className='text-center space-y-6'>
            <motion.div
              className='bg-gradient-to-br from-crd-orange/20 to-crd-purple/20 p-8 rounded-full w-32 h-32 mx-auto flex items-center justify-center'
              animate={
                isDragOver ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }
              }
              transition={{ duration: 0.2 }}
            >
              <FileImage className='w-16 h-16 text-crd-orange' />
            </motion.div>

            <div>
              <Typography variant='component' className='mb-2'>
                {isDragOver
                  ? 'Drop your PSD files here'
                  : 'Drop PSD files here'}
              </Typography>
              <Typography variant='small-body'>
                Supports .psd and .psb files up to {maxFileSize}MB each
              </Typography>
            </div>

            <CRDButton
              onClick={handleBrowseClick}
              className='bg-gradient-to-r from-crd-orange to-crd-purple hover:from-crd-orange/90 hover:to-crd-purple/90 text-white px-8 py-4'
              size='lg'
            >
              Browse Files
              <Upload className='w-4 h-4 ml-2' />
            </CRDButton>

            <input
              ref={fileInputRef}
              type='file'
              multiple
              accept={acceptedFormats.join(',')}
              onChange={handleFileInput}
              className='hidden'
            />
          </div>
        </div>

        {/* Drag Overlay */}
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              className='absolute inset-0 bg-crd-orange/20 border-2 border-crd-orange rounded-lg flex items-center justify-center'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className='text-center'>
                <Upload className='w-12 h-12 text-crd-orange mx-auto mb-2' />
                <Typography variant='component'>Drop to upload</Typography>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <motion.div
          className='space-y-3'
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Typography variant='component'>
            Uploaded Files ({uploadedFiles.length})
          </Typography>

          {uploadedFiles.map((fileInfo, index) => (
            <motion.div
              key={`${fileInfo.file.name}-${index}`}
              className='flex items-center justify-between p-3 bg-crd-darker rounded-lg border border-crd-mediumGray/20'
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className='flex items-center gap-3'>
                {fileInfo.status === 'valid' ? (
                  <CheckCircle className='w-5 h-5 text-crd-green' />
                ) : fileInfo.status === 'invalid' ? (
                  <AlertCircle className='w-5 h-5 text-crd-orange' />
                ) : (
                  <div className='w-5 h-5 border-2 border-crd-blue border-t-transparent rounded-full animate-spin' />
                )}

                <div className='flex-1 min-w-0'>
                  <p className='font-medium text-sm truncate text-crd-white'>
                    {fileInfo.file.name}
                  </p>
                  <p className='text-xs text-crd-lightGray'>
                    {(fileInfo.file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                  {fileInfo.error && (
                    <p className='text-xs text-crd-orange'>{fileInfo.error}</p>
                  )}
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <CRDBadge
                  variant={
                    fileInfo.status === 'valid'
                      ? 'success'
                      : fileInfo.status === 'invalid'
                        ? 'destructive'
                        : 'secondary'
                  }
                >
                  {fileInfo.status}
                </CRDBadge>

                <CRDButton
                  variant='ghost'
                  size='sm'
                  onClick={() => removeFile(index)}
                  className='text-crd-lightGray hover:text-crd-orange'
                >
                  <X className='w-4 h-4' />
                </CRDButton>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
