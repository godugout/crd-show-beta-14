import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, Type, Sparkles, Image, FileImage } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { CRDButton } from '@/components/ui/design-system/Button';

interface QuickCreateCaptureProps {
  onImageCapture: (file: File, imageUrl: string) => void;
  isAnalyzing: boolean;
}

export const QuickCreateCapture: React.FC<QuickCreateCaptureProps> = ({
  onImageCapture,
  isAnalyzing
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [textPrompt, setTextPrompt] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      onImageCapture(file, imageUrl);
    }
  }, [onImageCapture]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    },
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  });

  const handleCameraCapture = () => {
    // Create a file input for camera capture
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        onImageCapture(file, imageUrl);
      }
    };
    input.click();
  };

  const handleTextPrompt = () => {
    if (textPrompt.trim()) {
      // For now, we'll simulate generating an image from text
      // In the future, this would connect to an AI image generation service
      console.log('🎨 Generating image from prompt:', textPrompt);
      
      // Create a placeholder/mock generated image
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 500;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Create a gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, 500);
        gradient.addColorStop(0, '#1e40af');
        gradient.addColorStop(1, '#7c3aed');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 500);
        
        // Add text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('AI Generated', 200, 250);
        ctx.font = '16px Arial';
        ctx.fillText(textPrompt, 200, 280);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'ai-generated.png', { type: 'image/png' });
            const imageUrl = URL.createObjectURL(file);
            onImageCapture(file, imageUrl);
          }
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="text-center pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Quick Create Magic
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Drop an image, snap a photo, or describe your vision. Our AI will transform it into an amazing trading card instantly.
          </p>
        </motion.div>
      </div>

      {/* Main capture area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Image upload/drop zone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div
              {...getRootProps()}
              className={`
                relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
                transition-all duration-300 group min-h-[300px] flex flex-col items-center justify-center
                ${isDragActive || dragActive 
                  ? 'border-primary bg-primary/5 scale-105' 
                  : 'border-border hover:border-primary/50 hover:bg-primary/2'
                }
                ${isAnalyzing ? 'pointer-events-none opacity-50' : ''}
              `}
            >
              <input {...getInputProps()} />
              
              {isAnalyzing ? (
                <motion.div
                  className="text-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-16 h-16 text-primary mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">AI Magic in Progress...</h3>
                  <p className="text-muted-foreground">Analyzing your image with advanced AI</p>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    className="mb-6"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Upload className="w-16 h-16 text-primary group-hover:text-primary-glow transition-colors" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold mb-2">Drop your image here</h3>
                  <p className="text-muted-foreground mb-4">or click to browse files</p>
                  <div className="text-sm text-muted-foreground/70">
                    Supports JPG, PNG, WebP, GIF
                  </div>
                </>
              )}
            </div>

            {/* Camera button */}
            <CRDButton
              onClick={handleCameraCapture}
              variant="outline"
              size="lg"
              className="w-full"
              disabled={isAnalyzing}
            >
              <Camera className="w-5 h-5 mr-3" />
              Take Photo
            </CRDButton>
          </motion.div>

          {/* Text prompt option */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
              <div className="text-center mb-6">
                <Type className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Describe Your Card</h3>
                <p className="text-muted-foreground">Let AI generate the perfect image for you</p>
              </div>

              <div className="space-y-4">
                <textarea
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                  placeholder="A dynamic basketball player dunking in a retro 90s style card..."
                  className="w-full h-32 p-4 rounded-xl border border-border bg-background/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  disabled={isAnalyzing}
                />

                <CRDButton
                  onClick={handleTextPrompt}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={!textPrompt.trim() || isAnalyzing}
                >
                  <Sparkles className="w-5 h-5 mr-3" />
                  Generate with AI
                </CRDButton>
              </div>
            </div>

            {/* Quick examples */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Quick Examples:</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Basketball legend poster",
                  "Anime warrior card",
                  "Vintage baseball player",
                  "Cyberpunk character"
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setTextPrompt(example)}
                    className="px-3 py-1 text-xs bg-primary/10 hover:bg-primary/20 rounded-full transition-colors"
                    disabled={isAnalyzing}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};