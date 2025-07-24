
import React, { useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { CropperProps, DragHandle } from './cropper/types';
import { StreamlinedCropperToolbar } from './cropper/StreamlinedCropperToolbar';
import { StreamlinedCropOverlay } from './cropper/StreamlinedCropOverlay';
import { CropperSidebar } from './cropper/CropperSidebar';
import { useEnhancedCropAreaManager } from './cropper/useEnhancedCropAreaManager';

export const StreamlinedAdvancedCropper: React.FC<CropperProps> = ({
  imageUrl,
  onCropComplete,
  onCancel,
  aspectRatio = 2.5 / 3.5,
  className = ''
}) => {
  const {
    cropAreas,
    setCropAreas,
    selectedCropIds,
    selectedCount,
    isDragging,
    setIsDragging,
    dragHandle,
    setDragHandle,
    dragStart,
    setDragStart,
    imageLoaded,
    setImageLoaded,
    zoom,
    setZoom,
    showPreview,
    setShowPreview,
    isExtracting,
    setIsExtracting,
    showGrid,
    setShowGrid,
    snapToGrid,
    setSnapToGrid,
    gridSize,
    activeTool,
    setActiveTool,
    imageRef,
    initializeCrops,
    addCropArea,
    removeCropArea,
    selectCrop,
    undo,
    redo,
    zoomFit,
    saveToHistory,
    snapToGridHelper,
    canUndo,
    canRedo
  } = useEnhancedCropAreaManager(aspectRatio);

  const handleImageLoad = useCallback(() => {
    initializeCrops();
    setImageLoaded(true);
  }, [initializeCrops, setImageLoaded]);

  // Enhanced mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent, cropId: string, handle?: DragHandle) => {
    e.preventDefault();
    setIsDragging(true);
    setDragHandle(handle || 'move');
    setDragStart({ x: e.clientX, y: e.clientY });
    selectCrop(cropId);
  }, [setIsDragging, setDragHandle, setDragStart, selectCrop]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || selectedCropIds.length === 0 || !imageRef.current) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    const img = imageRef.current;
    const selectedCropId = selectedCropIds[0];

    setCropAreas(prev => prev.map(crop => {
      if (crop.id !== selectedCropId) return crop;

      let newCrop = { ...crop };

      switch (dragHandle) {
        case 'move':
          newCrop.x = snapToGridHelper(Math.max(0, Math.min(crop.x + deltaX, img.clientWidth - crop.width)));
          newCrop.y = snapToGridHelper(Math.max(0, Math.min(crop.y + deltaY, img.clientHeight - crop.height)));
          break;
        
        case 'rotate':
          const centerX = crop.x + crop.width / 2;
          const centerY = crop.y + crop.height / 2;
          const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
          newCrop.rotation = Math.round((angle * 180 / Math.PI) / 15) * 15;
          break;
        
        case 'tl':
          newCrop.x = snapToGridHelper(Math.max(0, crop.x + deltaX));
          newCrop.y = snapToGridHelper(Math.max(0, crop.y + deltaY));
          newCrop.width = crop.width - deltaX;
          newCrop.height = crop.height - deltaY;
          break;
        
        case 'tr':
          newCrop.y = snapToGridHelper(Math.max(0, crop.y + deltaY));
          newCrop.width = crop.width + deltaX;
          newCrop.height = crop.height - deltaY;
          break;
        
        case 'bl':
          newCrop.x = snapToGridHelper(Math.max(0, crop.x + deltaX));
          newCrop.width = crop.width - deltaX;
          newCrop.height = crop.height + deltaY;
          break;
        
        case 'br':
          newCrop.width = crop.width + deltaX;
          newCrop.height = crop.height + deltaY;
          break;
      }

      // Ensure minimum size
      newCrop.width = Math.max(30, newCrop.width);
      newCrop.height = Math.max(30, newCrop.height);

      // Ensure within bounds
      newCrop.width = Math.min(newCrop.width, img.clientWidth - newCrop.x);
      newCrop.height = Math.min(newCrop.height, img.clientHeight - newCrop.y);

      // Maintain aspect ratio for main card when resizing
      if (crop.type === 'main' && dragHandle !== 'move' && dragHandle !== 'rotate') {
        if (dragHandle?.includes('r') || dragHandle === 'l') {
          newCrop.height = newCrop.width / aspectRatio;
        } else if (dragHandle?.includes('t') || dragHandle?.includes('b')) {
          newCrop.width = newCrop.height * aspectRatio;
        }
      }

      return newCrop;
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, selectedCropIds, dragHandle, dragStart, aspectRatio, setCropAreas, setDragStart, snapToGridHelper]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      saveToHistory(`${dragHandle === 'rotate' ? 'Rotate' : dragHandle === 'move' ? 'Move' : 'Resize'} crop area`);
    }
    setIsDragging(false);
    setDragHandle(null);
  }, [isDragging, dragHandle, saveToHistory, setIsDragging, setDragHandle]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Extract all crops
  const extractAllCrops = useCallback(async () => {
    if (!imageRef.current || !imageLoaded) {
      toast.error('Image not ready');
      return;
    }

    setIsExtracting(true);
    
    try {
      const img = imageRef.current;
      const scaleX = img.naturalWidth / img.clientWidth;
      const scaleY = img.naturalHeight / img.clientHeight;

      const results: { main?: string; frame?: string; elements?: string[] } = {};
      const elements: string[] = [];

      for (const crop of cropAreas) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) continue;

        const sourceX = crop.x * scaleX;
        const sourceY = crop.y * scaleY;
        const sourceWidth = crop.width * scaleX;
        const sourceHeight = crop.height * scaleY;

        const outputWidth = Math.min(1200, sourceWidth);
        const outputHeight = Math.min(1600, sourceHeight);
        
        canvas.width = outputWidth;
        canvas.height = outputHeight;

        if (crop.rotation !== 0) {
          ctx.save();
          ctx.translate(outputWidth / 2, outputHeight / 2);
          ctx.rotate((crop.rotation * Math.PI) / 180);
          ctx.translate(-outputWidth / 2, -outputHeight / 2);
        }

        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, outputWidth, outputHeight
        );

        if (crop.rotation !== 0) {
          ctx.restore();
        }

        const dataUrl = canvas.toDataURL('image/png', 0.95);

        if (crop.type === 'main') {
          results.main = dataUrl;
        } else if (crop.type === 'frame') {
          results.frame = dataUrl;
        } else {
          elements.push(dataUrl);
        }
      }

      if (elements.length > 0) {
        results.elements = elements;
      }

      onCropComplete(results);
      toast.success(`Successfully extracted ${cropAreas.length} crop areas!`);
    } catch (error) {
      console.error('Extraction failed:', error);
      toast.error('Failed to extract crops');
    } finally {
      setIsExtracting(false);
    }
  }, [cropAreas, imageLoaded, onCropComplete, setIsExtracting]);

  return (
    <div className={`h-full flex flex-col bg-crd-darkest ${className}`}>
      <StreamlinedCropperToolbar
        cropCount={cropAreas.length}
        showPreview={showPreview}
        showGrid={showGrid}
        canUndo={canUndo}
        canRedo={canRedo}
        onTogglePreview={() => setShowPreview(!showPreview)}
        onToggleGrid={() => setShowGrid(!showGrid)}
        zoom={zoom}
        onZoomIn={() => setZoom(Math.min(3, zoom + 0.25))}
        onZoomOut={() => setZoom(Math.max(0.5, zoom - 0.25))}
        onZoomFit={zoomFit}
        onUndo={undo}
        onRedo={redo}
        onExtractAll={extractAllCrops}
        onCancel={onCancel}
        imageLoaded={imageLoaded}
        isExtracting={isExtracting}
      />

      <div className="flex-1 flex">
        {/* Main Canvas Area */}
        <div className="flex-1 p-6 overflow-auto bg-crd-darkest">
          <Card className="relative overflow-hidden bg-crd-darkGray border-crd-mediumGray/30 max-w-fit mx-auto shadow-xl">
            <div className="relative">
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Crop source"
                className="max-w-full max-h-[600px] w-auto h-auto rounded-lg"
                onLoad={handleImageLoad}
                draggable={false}
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
              />
              
              <StreamlinedCropOverlay
                cropAreas={cropAreas}
                selectedCropIds={selectedCropIds}
                zoom={zoom}
                imageLoaded={imageLoaded}
                showGrid={showGrid}
                gridSize={gridSize}
                onMouseDown={handleMouseDown}
                onCropSelect={selectCrop}
                onRemoveCrop={removeCropArea}
              />
            </div>
          </Card>
        </div>

        <CropperSidebar
          cropAreas={cropAreas}
          imageLoaded={imageLoaded}
          selectedCropId={selectedCropIds[0] || null}
          onAddCropArea={addCropArea}
          onSelectCrop={selectCrop}
          onRemoveCrop={removeCropArea}
        />
      </div>
    </div>
  );
};
