import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Link, Camera, Wand2, RotateCcw, ZoomIn, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useDropzone } from 'react-dropzone';
import type { WizardData } from '../InteractiveWizard';

interface ImageMagicStepProps {
  data: WizardData;
  onUpdate: (data: Partial<WizardData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

interface Enhancement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  value: number;
}

export const ImageMagicStep: React.FC<ImageMagicStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(data.image || null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState([100]);
  const [showEnhancements, setShowEnhancements] = useState(false);
  const [enhancements, setEnhancements] = useState<Enhancement[]>([
    { id: 'brightness', name: 'Brightness', description: 'Adjust image brightness', icon: <Sparkles className="w-4 h-4" />, value: 0 },
    { id: 'contrast', name: 'Contrast', description: 'Enhance image contrast', icon: <ZoomIn className="w-4 h-4" />, value: 0 },
    { id: 'saturation', name: 'Saturation', description: 'Boost color saturation', icon: <Wand2 className="w-4 h-4" />, value: 0 },
    { id: 'sharpness', name: 'Sharpness', description: 'Sharpen image details', icon: <Sparkles className="w-4 h-4" />, value: 0 }
  ]);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
        onUpdate({ image: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  }, [onUpdate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

  const handleMagicEnhance = async () => {
    if (!selectedImage) return;
    
    setIsEnhancing(true);
    
    // Simulate AI enhancement
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Apply random enhancements for demo
    setEnhancements(prev => prev.map(enhancement => ({
      ...enhancement,
      value: Math.random() * 50 + 25 // Random value between 25-75
    })));
    
    setIsEnhancing(false);
    setShowEnhancements(true);
  };

  const handleImageDrag = (e: React.MouseEvent) => {
    if (!isDragging || !previewRef.current) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 100;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 100;
    
    setDragPosition({ x: Math.max(-50, Math.min(50, x)), y: Math.max(-50, Math.min(50, y)) });
  };

  const resetPosition = () => {
    setDragPosition({ x: 0, y: 0 });
    setZoom([100]);
  };

  const getEnhancementStyle = (): React.CSSProperties => {
    if (!showEnhancements) return {};
    
    return {
      filter: `
        brightness(${100 + enhancements[0].value}%) 
        contrast(${100 + enhancements[1].value}%) 
        saturate(${100 + enhancements[2].value}%)
      `,
      imageRendering: enhancements[3].value > 0 ? 'crisp-edges' : 'auto' as React.CSSProperties['imageRendering']
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-4">
            Image Magic
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your image and let AI enhance it to perfection. Drag to position and zoom to frame your shot.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Upload Zone */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-background/50 backdrop-blur-sm border-white/10">
              <h3 className="text-2xl font-bold mb-6">Upload Your Image</h3>
              
              {!selectedImage ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive 
                      ? 'border-primary bg-primary/5 scale-105' 
                      : 'border-white/20 hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  <input {...getInputProps()} />
                  <motion.div
                    animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h4 className="text-xl font-semibold mb-2">
                      {isDragActive ? 'Drop your image here' : 'Drag & drop your image'}
                    </h4>
                    <p className="text-muted-foreground mb-4">
                      Or click to browse your files
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports: JPEG, PNG, GIF, WebP
                    </p>
                  </motion.div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Image uploaded successfully</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedImage(null);
                        onUpdate({ image: undefined });
                      }}
                    >
                      Change Image
                    </Button>
                  </div>
                  
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={selectedImage}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                      style={getEnhancementStyle()}
                    />
                  </div>
                </div>
              )}

              {/* Alternative Upload Methods */}
              <div className="mt-6 space-y-3">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Link className="w-4 h-4 mr-2" />
                    From URL
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onDrop([file]);
                  }}
                />
              </div>
            </Card>
          </motion.div>

          {/* Live Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-background/50 backdrop-blur-sm border-white/10 h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Live Preview</h3>
                {selectedImage && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetPosition}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {selectedImage ? (
                  <>
                    {/* Preview Area */}
                    <div
                      ref={previewRef}
                      className="aspect-[3/4] bg-muted rounded-lg overflow-hidden relative cursor-move border-2 border-dashed border-primary/30"
                      onMouseDown={() => setIsDragging(true)}
                      onMouseUp={() => setIsDragging(false)}
                      onMouseMove={handleImageDrag}
                      onMouseLeave={() => setIsDragging(false)}
                    >
                      <motion.img
                        src={selectedImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        style={{
                          ...getEnhancementStyle(),
                          transform: `translate(${dragPosition.x}px, ${dragPosition.y}px) scale(${zoom[0]/100})`
                        }}
                        animate={{
                          scale: isDragging ? 1.05 : 1
                        }}
                      />
                      
                      {/* Smart Guides */}
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/3 left-0 right-0 h-px bg-primary/50" />
                        <div className="absolute bottom-1/3 left-0 right-0 h-px bg-primary/50" />
                        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-primary/50" />
                        <div className="absolute right-1/3 top-0 bottom-0 w-px bg-primary/50" />
                      </div>

                      {/* Corner Indicators */}
                      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary" />
                      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-primary" />
                      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-primary" />
                      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary" />
                    </div>

                    {/* Zoom Control */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Zoom: {zoom[0]}%</label>
                      <Slider
                        value={zoom}
                        onValueChange={setZoom}
                        min={50}
                        max={200}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    {/* Magic Enhance Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleMagicEnhance}
                        disabled={isEnhancing}
                        className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 relative overflow-hidden"
                      >
                        <AnimatePresence>
                          {isEnhancing ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center"
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Sparkles className="w-4 h-4 mr-2" />
                              </motion.div>
                              Enhancing...
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex items-center"
                            >
                              <Wand2 className="w-4 h-4 mr-2" />
                              Magic Enhance
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Sparkle Effect */}
                        <div className="absolute inset-0 pointer-events-none">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-white rounded-full"
                              style={{
                                left: `${20 + i * 15}%`,
                                top: '50%'
                              }}
                              animate={{
                                y: [0, -10, 0],
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0]
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2
                              }}
                            />
                          ))}
                        </div>
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-white/20">
                    <div className="text-center text-muted-foreground">
                      <Camera className="w-16 h-16 mx-auto mb-4" />
                      <p>Upload an image to see the preview</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Enhancement Controls */}
        <AnimatePresence>
          {showEnhancements && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="mb-8"
            >
              <Card className="p-6 bg-background/50 backdrop-blur-sm border-white/10">
                <h3 className="text-xl font-bold mb-4">Fine-tune Enhancements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {enhancements.map(enhancement => (
                    <div key={enhancement.id} className="space-y-3">
                      <div className="flex items-center gap-2">
                        {enhancement.icon}
                        <span className="font-medium">{enhancement.name}</span>
                      </div>
                      <Slider
                        value={[enhancement.value]}
                        onValueChange={([value]) => {
                          setEnhancements(prev => prev.map(e => 
                            e.id === enhancement.id ? { ...e, value } : e
                          ));
                        }}
                        min={-50}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        {enhancement.description}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            variant="outline"
            onClick={onPrevious}
            className="bg-background/80 backdrop-blur-sm border-white/10"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {selectedImage ? 'Image ready for customization' : 'Upload an image to continue'}
            </p>
          </div>

          <Button
            onClick={onNext}
            disabled={!selectedImage}
            className="bg-primary hover:bg-primary/90"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};