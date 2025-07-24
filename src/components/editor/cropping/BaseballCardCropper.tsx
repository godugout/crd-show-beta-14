
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Crop, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Check, 
  X,
  Target,
  User,
  Activity
} from 'lucide-react';
import type { DesignTemplate } from '@/types/card';

interface CropRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  shape?: 'rectangle' | 'ellipse';
}

interface BaseballCardCropperProps {
  imageUrl: string;
  template: DesignTemplate;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
  className?: string;
}

export const BaseballCardCropper: React.FC<BaseballCardCropperProps> = ({
  imageUrl,
  template,
  onCropComplete,
  onCancel,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [cropSettings, setCropSettings] = useState({
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cropPreset, setCropPreset] = useState<'full-body' | 'portrait' | 'action'>('portrait');

  // Get photo region from template
  const photoRegion: CropRegion = template.template_data?.photoRegion || {
    x: 15,
    y: 50,
    width: 220,
    height: 180,
    shape: 'rectangle'
  };

  // Load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImageElement(img);
      // Auto-center the image
      setCropSettings(prev => ({
        ...prev,
        x: 0,
        y: 0,
        scale: Math.max(photoRegion.width / img.width, photoRegion.height / img.height)
      }));
    };
    img.src = imageUrl;
  }, [imageUrl, photoRegion]);

  // Draw preview on canvas
  const drawPreview = useCallback(() => {
    if (!canvasRef.current || !imageElement) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match template photo region
    canvas.width = photoRegion.width;
    canvas.height = photoRegion.height;

    // Clear canvas
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save context for transformations
    ctx.save();

    // Apply transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((cropSettings.rotation * Math.PI) / 180);
    ctx.scale(cropSettings.scale, cropSettings.scale);
    ctx.translate(-canvas.width / 2 + cropSettings.x, -canvas.height / 2 + cropSettings.y);

    // Draw image
    ctx.drawImage(
      imageElement,
      (canvas.width - imageElement.width) / 2,
      (canvas.height - imageElement.height) / 2,
      imageElement.width,
      imageElement.height
    );

    ctx.restore();

    // Draw crop overlay if ellipse shape
    if (photoRegion.shape === 'ellipse') {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      ctx.ellipse(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2,
        canvas.height / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();
    }
  }, [imageElement, cropSettings, photoRegion]);

  // Redraw when settings change
  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  // Crop presets for baseball photos
  const applyCropPreset = (preset: 'full-body' | 'portrait' | 'action') => {
    setCropPreset(preset);
    
    switch (preset) {
      case 'portrait':
        setCropSettings(prev => ({ ...prev, scale: 1.5, y: -20 }));
        break;
      case 'full-body':
        setCropSettings(prev => ({ ...prev, scale: 0.8, y: 0 }));
        break;
      case 'action':
        setCropSettings(prev => ({ ...prev, scale: 1.2, x: 10, y: -10 }));
        break;
    }
  };

  // Handle mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropSettings.x, y: e.clientY - cropSettings.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setCropSettings(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Generate cropped image
  const handleCropComplete = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    onCropComplete(dataUrl);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader>
          <CardTitle className="text-crd-white flex items-center gap-2">
            <Crop className="w-5 h-5" />
            Baseball Card Photo Cropper
          </CardTitle>
          <p className="text-crd-lightGray text-sm">
            Adjust your photo to fit perfectly in the {template.name} template
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Crop Presets */}
          <div>
            <h4 className="text-crd-white font-medium mb-3">Photo Type</h4>
            <div className="flex gap-2">
              {[
                { id: 'portrait', label: 'Portrait', icon: User },
                { id: 'full-body', label: 'Full Body', icon: Target },
                { id: 'action', label: 'Action Shot', icon: Activity }
              ].map(({ id, label, icon: Icon }) => (
                <CRDButton
                  key={id}
                  variant={cropPreset === id ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => applyCropPreset(id as any)}
                  className={cropPreset === id ? 'bg-crd-green text-black' : 'border-crd-mediumGray/20'}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {label}
                </CRDButton>
              ))}
            </div>
          </div>

          {/* Canvas Preview */}
          <div className="text-center">
            <div className="inline-block border-2 border-crd-mediumGray/30 rounded-lg p-2 bg-white">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-64 cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              />
            </div>
            <p className="text-crd-lightGray text-sm mt-2">
              Click and drag to reposition • Use controls below to adjust
            </p>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scale Control */}
            <div className="space-y-2">
              <label className="text-crd-white text-sm font-medium flex items-center gap-2">
                <ZoomIn className="w-4 h-4" />
                Scale: {cropSettings.scale.toFixed(1)}x
              </label>
              <Slider
                value={[cropSettings.scale]}
                onValueChange={(value) => setCropSettings(prev => ({ ...prev, scale: value[0] }))}
                min={0.1}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Rotation Control */}
            <div className="space-y-2">
              <label className="text-crd-white text-sm font-medium flex items-center gap-2">
                <RotateCw className="w-4 h-4" />
                Rotation: {cropSettings.rotation}°
              </label>
              <Slider
                value={[cropSettings.rotation]}
                onValueChange={(value) => setCropSettings(prev => ({ ...prev, rotation: value[0] }))}
                min={-180}
                max={180}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Template Info */}
          <div className="bg-crd-mediumGray/10 p-4 rounded-lg">
            <h4 className="text-crd-white font-medium mb-2">Template: {template.name}</h4>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="text-crd-lightGray border-crd-mediumGray/30">
                {photoRegion.width}×{photoRegion.height}px
              </Badge>
              <Badge variant="outline" className="text-crd-lightGray border-crd-mediumGray/30">
                {photoRegion.shape || 'rectangle'}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <CRDButton
              variant="outline"
              onClick={onCancel}
              className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </CRDButton>

            <CRDButton
              variant="primary"
              onClick={handleCropComplete}
              className="bg-crd-green hover:bg-crd-green/80 text-black"
            >
              <Check className="w-4 h-4 mr-2" />
              Apply Crop
            </CRDButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
