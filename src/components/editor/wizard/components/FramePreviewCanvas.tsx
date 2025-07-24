
import React, { useRef, useEffect } from 'react';
import type { DesignTemplate } from '@/types/card';

interface FramePreviewCanvasProps {
  imageUrl?: string;
  selectedFrame?: DesignTemplate;
  className?: string;
}

export const FramePreviewCanvas = ({ 
  imageUrl, 
  selectedFrame, 
  className = "w-full max-w-sm mx-auto" 
}: FramePreviewCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions (trading card aspect ratio 2.5:3.5)
    const width = 300;
    const height = 420;
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background (white for blank card)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // If we have an image, draw it
    if (imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Draw image to fit canvas while maintaining aspect ratio
        const imgAspect = img.width / img.height;
        const canvasAspect = width / height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (imgAspect > canvasAspect) {
          // Image is wider - fit to height
          drawHeight = height;
          drawWidth = height * imgAspect;
          offsetX = (width - drawWidth) / 2;
          offsetY = 0;
        } else {
          // Image is taller - fit to width
          drawWidth = width;
          drawHeight = width / imgAspect;
          offsetX = 0;
          offsetY = (height - drawHeight) / 2;
        }
        
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        
        // Apply frame overlay if selected and not blank
        if (selectedFrame && selectedFrame.id !== 'blank-card') {
          drawFrameOverlay(ctx, selectedFrame, width, height);
        }
      };
      img.src = imageUrl;
    } else {
      // No image - show placeholder with frame if selected
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(20, 20, width - 40, height - 40);
      ctx.fillStyle = '#9ca3af';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Upload Image', width / 2, height / 2);
      
      if (selectedFrame && selectedFrame.id !== 'blank-card') {
        drawFrameOverlay(ctx, selectedFrame, width, height);
      }
    }
  }, [imageUrl, selectedFrame]);

  const drawFrameOverlay = (ctx: CanvasRenderingContext2D, frame: DesignTemplate, width: number, height: number) => {
    // Draw frame based on template data
    const templateData = frame.template_data;
    if (!templateData) return;

    // Apply colors from template
    const colors = templateData.colors || {};
    
    // Draw border
    ctx.strokeStyle = colors.primary || '#000000';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, width - 4, height - 4);
    
    // Draw title area if template has one
    if (templateData.regions?.title) {
      const titleRegion = templateData.regions.title;
      ctx.fillStyle = colors.background || '#1e293b';
      ctx.fillRect(titleRegion.x, titleRegion.y, titleRegion.width, titleRegion.height);
      
      // Add sample title text
      ctx.fillStyle = colors.text || '#ffffff';
      ctx.font = '14px bold sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        frame.name, 
        titleRegion.x + titleRegion.width / 2, 
        titleRegion.y + titleRegion.height / 2 + 5
      );
    }
    
    // Draw stats area for gaming cards
    if (templateData.regions?.stats) {
      const statsRegion = templateData.regions.stats;
      ctx.fillStyle = colors.background || '#1e293b';
      ctx.fillRect(statsRegion.x, statsRegion.y, statsRegion.width, statsRegion.height);
    }
  };

  return (
    <div className={className}>
      <canvas 
        ref={canvasRef}
        className="w-full h-auto rounded-lg border border-crd-mediumGray/30 shadow-lg bg-white"
        style={{ aspectRatio: '2.5/3.5' }}
      />
    </div>
  );
};
