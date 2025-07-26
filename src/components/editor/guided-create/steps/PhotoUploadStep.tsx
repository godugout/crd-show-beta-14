import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, Link, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface PhotoUploadStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

export const PhotoUploadStep: React.FC<PhotoUploadStepProps> = ({
  data,
  onUpdate
}) => {
  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      // Create a temporary URL for preview
      const imageUrl = URL.createObjectURL(file);
      onUpdate({ imageUrl, file });
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    }
  }, [onUpdate]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files[0]) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const files = Array.from(e.clipboardData.files);
    if (files[0]) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleUrlInput = (url: string) => {
    if (url) {
      onUpdate({ imageUrl: url });
      toast.success('Image URL added!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card
        className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onPaste={handlePaste}
        tabIndex={0}
      >
        <div className="p-12 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4"
          >
            <Upload className="w-8 h-8 text-primary" />
          </motion.div>
          <h3 className="text-xl font-semibold mb-2">Upload Your Photo</h3>
          <p className="text-muted-foreground mb-6">
            Drag and drop an image, paste from clipboard, or click to browse
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
            id="file-upload"
          />
          <Button asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </label>
          </Button>
        </div>
      </Card>

      {/* Alternative Options */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-center">
            <Camera className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="font-medium mb-2">Take Photo</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Use your camera to capture
            </p>
            <Button variant="outline" size="sm">
              Open Camera
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <Link className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="font-medium mb-2">Image URL</h4>
            <Input
              placeholder="Paste image URL"
              onBlur={(e) => handleUrlInput(e.target.value)}
              className="mb-4"
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="font-medium mb-2">AI Generate</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Describe what you want
            </p>
            <Button variant="outline" size="sm">
              Coming Soon
            </Button>
          </div>
        </Card>
      </div>

      {/* Preview */}
      {data.imageUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h4 className="font-medium mb-4">Preview</h4>
          <div className="relative inline-block">
            <img
              src={data.imageUrl}
              alt="Preview"
              className="max-w-xs max-h-64 rounded-lg shadow-lg"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2"
              onClick={() => onUpdate({ imageUrl: null, file: null })}
            >
              ×
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};