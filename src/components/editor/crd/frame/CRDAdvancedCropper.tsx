import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Crop, RotateCw, Move, ZoomIn, ZoomOut, Download, Scissors } from 'lucide-react';
import type { CropResult, CropToolConfig } from '@/types/crd-frame';
import { removeBackground, loadImage } from '@/utils/backgroundRemoval';

interface CRDAdvancedCropperProps {
  isOpen: boolean;
  imageUrl: string;
  config: CropToolConfig;
  onClose: () => void;
  onCropComplete: (result: CropResult) => void;
}

export const CRDAdvancedCropper: React.FC<CRDAdvancedCropperProps> = ({
  isOpen,
  imageUrl,
  config,
  onClose,
  onCropComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [cropData, setCropData] = useState({
    x: 0,
    y: 0,
    width: 200,
    height: 200,
    rotation: 0
  });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [backgroundRemoved, setBackgroundRemoved] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Load image
  useEffect(() => {
    if (imageUrl && isOpen) {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        // Initialize crop to center
        const aspectRatio = config.aspectRatio || 1;
        const size = Math.min(img.width, img.height) * 0.8;
        setCropData({
          x: (img.width - size) / 2,
          y: (img.height - size / aspectRatio) / 2,
          width: size,
          height: size / aspectRatio,
          rotation: 0
        });
      };
      img.src = imageUrl;
    }
  }, [imageUrl, isOpen, config.aspectRatio]);

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate display scale
    const scale = Math.min(
      canvas.width / image.width,
      canvas.height / image.height
    ) * zoom;

    const displayWidth = image.width * scale;
    const displayHeight = image.height * scale;
    const offsetX = (canvas.width - displayWidth) / 2;
    const offsetY = (canvas.height - displayHeight) / 2;

    // Draw image
    ctx.save();
    ctx.translate(offsetX + displayWidth / 2, offsetY + displayHeight / 2);
    ctx.rotate(cropData.rotation * Math.PI / 180);
    ctx.drawImage(
      image,
      -displayWidth / 2,
      -displayHeight / 2,
      displayWidth,
      displayHeight
    );
    ctx.restore();

    // Draw crop overlay
    const cropX = offsetX + (cropData.x * scale);
    const cropY = offsetY + (cropData.y * scale);
    const cropWidth = cropData.width * scale;
    const cropHeight = cropData.height * scale;

    // Darken outside crop area
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(cropX, cropY, cropWidth, cropHeight);

    // Draw crop border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropX, cropY, cropWidth, cropHeight);

    // Draw crop handles
    const handleSize = 8;
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(cropX - handleSize/2, cropY - handleSize/2, handleSize, handleSize);
    ctx.fillRect(cropX + cropWidth - handleSize/2, cropY - handleSize/2, handleSize, handleSize);
    ctx.fillRect(cropX - handleSize/2, cropY + cropHeight - handleSize/2, handleSize, handleSize);
    ctx.fillRect(cropX + cropWidth - handleSize/2, cropY + cropHeight - handleSize/2, handleSize, handleSize);

    // Draw grid if enabled
    if (config.snapToGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      const gridSize = (config.gridSize || 10) * scale;
      
      for (let x = cropX; x < cropX + cropWidth; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, cropY);
        ctx.lineTo(x, cropY + cropHeight);
        ctx.stroke();
      }
      
      for (let y = cropY; y < cropY + cropHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(cropX, y);
        ctx.lineTo(cropX + cropWidth, y);
        ctx.stroke();
      }
    }
  }, [image, cropData, zoom, config]);

  // Redraw when data changes
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Handle mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDragging(true);
    setDragStart({ x, y });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !image) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;

    const scale = Math.min(
      canvas.width / image.width,
      canvas.height / image.height
    ) * zoom;

    setCropData(prev => ({
      ...prev,
      x: Math.max(0, Math.min(image.width - prev.width, prev.x + deltaX / scale)),
      y: Math.max(0, Math.min(image.height - prev.height, prev.y + deltaY / scale))
    }));

    setDragStart({ x, y });
  }, [isDragging, dragStart, image, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle background removal
  const handleBackgroundRemoval = useCallback(async () => {
    if (!image || !config.allowBackgroundRemoval) return;

    setProcessing(true);
    try {
      const blob = await removeBackground(image);
      const url = URL.createObjectURL(blob);
      
      const newImage = new Image();
      newImage.onload = () => {
        setImage(newImage);
        setBackgroundRemoved(true);
      };
      newImage.src = url;
    } catch (error) {
      console.error('Background removal failed:', error);
    } finally {
      setProcessing(false);
    }
  }, [image, config.allowBackgroundRemoval]);

  // Generate crop result
  const handleCropComplete = useCallback(async () => {
    if (!image) return;

    // Create a canvas for the cropped result
    const cropCanvas = document.createElement('canvas');
    const ctx = cropCanvas.getContext('2d');
    if (!ctx) return;

    cropCanvas.width = cropData.width;
    cropCanvas.height = cropData.height;

    // Apply rotation if needed
    ctx.save();
    ctx.translate(cropCanvas.width / 2, cropCanvas.height / 2);
    ctx.rotate(cropData.rotation * Math.PI / 180);
    
    ctx.drawImage(
      image,
      cropData.x,
      cropData.y,
      cropData.width,
      cropData.height,
      -cropCanvas.width / 2,
      -cropCanvas.height / 2,
      cropCanvas.width,
      cropCanvas.height
    );
    ctx.restore();

    const croppedImageUrl = cropCanvas.toDataURL('image/png', 0.9);

    const result: CropResult = {
      regionId: config.regionId,
      cropData,
      originalImage: imageUrl,
      croppedImage: croppedImageUrl,
      backgroundRemoved,
      metadata: {
        quality: 0.9,
        format: 'png',
        size: { width: cropCanvas.width, height: cropCanvas.height }
      }
    };

    onCropComplete(result);
  }, [image, cropData, imageUrl, backgroundRemoved, config.regionId, onCropComplete]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crop className="h-5 w-5" />
            Advanced Crop Tool
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 h-[70vh]">
          {/* Main Canvas */}
          <div className="flex-1 flex flex-col">
            <canvas
              ref={canvasRef}
              className="border border-border rounded cursor-crosshair"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            
            {/* Zoom Controls */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm min-w-16 text-center">{Math.round(zoom * 100)}%</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.min(3, zoom + 0.1))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="w-80 space-y-4 overflow-y-auto">
            {/* Crop Size */}
            <div className="space-y-2">
              <Label>Crop Size</Label>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">Width: {Math.round(cropData.width)}px</Label>
                  <Slider
                    value={[cropData.width]}
                    onValueChange={([width]) => setCropData(prev => ({ 
                      ...prev, 
                      width: Math.min(image?.width || 1000, width),
                      height: config.aspectRatio ? width / config.aspectRatio : prev.height
                    }))}
                    min={50}
                    max={image?.width || 1000}
                    step={1}
                  />
                </div>
                {!config.aspectRatio && (
                  <div>
                    <Label className="text-xs">Height: {Math.round(cropData.height)}px</Label>
                    <Slider
                      value={[cropData.height]}
                      onValueChange={([height]) => setCropData(prev => ({ ...prev, height }))}
                      min={50}
                      max={image?.height || 1000}
                      step={1}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Rotation */}
            {config.allowRotation && (
              <div className="space-y-2">
                <Label>Rotation: {cropData.rotation}°</Label>
                <Slider
                  value={[cropData.rotation]}
                  onValueChange={([rotation]) => setCropData(prev => ({ ...prev, rotation }))}
                  min={-180}
                  max={180}
                  step={1}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCropData(prev => ({ ...prev, rotation: 0 }))}
                  className="w-full"
                >
                  <RotateCw className="h-4 w-4 mr-2" />
                  Reset Rotation
                </Button>
              </div>
            )}

            {/* Background Removal */}
            {config.allowBackgroundRemoval && (
              <div className="space-y-2">
                <Label>Background Removal</Label>
                <Button
                  variant="outline"
                  onClick={handleBackgroundRemoval}
                  disabled={processing || backgroundRemoved}
                  className="w-full"
                >
                  <Scissors className="h-4 w-4 mr-2" />
                  {processing ? 'Processing...' : backgroundRemoved ? 'Background Removed' : 'Remove Background'}
                </Button>
                {backgroundRemoved && (
                  <p className="text-xs text-muted-foreground">
                    Background has been automatically removed using AI
                  </p>
                )}
              </div>
            )}

            {/* Aspect Ratio Lock */}
            {config.aspectRatio && (
              <div className="flex items-center space-x-2">
                <Label className="text-sm">Aspect Ratio Locked</Label>
                <span className="text-xs text-muted-foreground">
                  {config.aspectRatio.toFixed(2)}:1
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-4">
              <Button onClick={handleCropComplete} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Apply Crop
              </Button>
              <Button variant="outline" onClick={onClose} className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};