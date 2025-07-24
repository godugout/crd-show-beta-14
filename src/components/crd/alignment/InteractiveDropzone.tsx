import React, { useState, useCallback } from 'react';
import { Upload, Image, FileImage, Sparkles } from 'lucide-react';

interface InteractiveDropzoneProps {
  isVisible: boolean;
  onFileUpload: (file: File) => void;
  className?: string;
}

export const InteractiveDropzone: React.FC<InteractiveDropzoneProps> = ({
  isVisible,
  onFileUpload,
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      setIsUploading(true);
      setTimeout(() => {
        onFileUpload(imageFile);
        setIsUploading(false);
      }, 500);
    }
  }, [onFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true);
      setTimeout(() => {
        onFileUpload(file);
        setIsUploading(false);
      }, 500);
    }
  }, [onFileUpload]);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 z-30 ${className}`}>
      {/* Floating Platform */}
      <div 
        className={`
          relative w-64 h-32 rounded-xl transition-all duration-700 ease-out
          ${isDragOver 
            ? 'bg-gradient-to-br from-cyan-500/30 via-blue-500/20 to-purple-500/30 scale-105 shadow-2xl shadow-cyan-500/50' 
            : 'bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 hover:scale-102'
          }
          backdrop-blur-lg border
          ${isDragOver 
            ? 'border-cyan-400/60 shadow-lg shadow-cyan-400/30' 
            : 'border-white/20 hover:border-white/40'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Animated Background Glow */}
        <div className={`
          absolute inset-0 rounded-xl opacity-50 transition-opacity duration-500
          ${isDragOver ? 'opacity-100' : 'opacity-0'}
        `}>
          <div className="absolute inset-0 bg-gradient-radial from-cyan-400/20 via-blue-400/10 to-transparent animate-pulse" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
          {isUploading ? (
            <>
              <Sparkles className="w-8 h-8 text-cyan-400 animate-spin mb-2" />
              <p className="text-sm text-cyan-400 font-medium">Initiating Sequence...</p>
            </>
          ) : (
            <>
              {/* Icon */}
              <div className={`
                mb-3 p-3 rounded-full transition-all duration-300
                ${isDragOver 
                  ? 'bg-cyan-400/20 text-cyan-400 scale-110' 
                  : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                }
              `}>
                {isDragOver ? (
                  <FileImage className="w-6 h-6" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>

              {/* Text */}
              <p className={`
                text-sm font-medium transition-colors duration-300 mb-1
                ${isDragOver ? 'text-cyan-400' : 'text-white/90'}
              `}>
                {isDragOver ? 'Release to Begin' : 'Upload Image'}
              </p>
              
              <p className={`
                text-xs transition-colors duration-300
                ${isDragOver ? 'text-cyan-300/80' : 'text-white/60'}
              `}>
                {isDragOver ? 'Kubrick Sequence' : 'Drag & drop or click to upload'}
              </p>

              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Upload image file"
              />
            </>
          )}
        </div>

        {/* Floating Particles */}
        {isDragOver && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping"
                style={{
                  left: `${20 + (i * 10)}%`,
                  top: `${30 + Math.sin(i) * 40}%`,
                  animationDelay: `${i * 200}ms`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
          </div>
        )}

        {/* Corner Indicators */}
        <div className={`
          absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 transition-all duration-300
          ${isDragOver ? 'border-cyan-400 scale-110' : 'border-white/30'}
        `} />
        <div className={`
          absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 transition-all duration-300
          ${isDragOver ? 'border-cyan-400 scale-110' : 'border-white/30'}
        `} />
        <div className={`
          absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 transition-all duration-300
          ${isDragOver ? 'border-cyan-400 scale-110' : 'border-white/30'}
        `} />
        <div className={`
          absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 transition-all duration-300
          ${isDragOver ? 'border-cyan-400 scale-110' : 'border-white/30'}
        `} />
      </div>

      {/* Subtle Ring Indicator */}
      <div className={`
        absolute inset-0 rounded-xl border-2 transition-all duration-500 pointer-events-none
        ${isDragOver 
          ? 'border-cyan-400/50 scale-110 animate-pulse' 
          : 'border-transparent scale-100'
        }
      `} />
    </div>
  );
};