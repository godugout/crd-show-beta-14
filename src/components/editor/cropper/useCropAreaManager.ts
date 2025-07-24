
import { useState, useCallback, useRef } from 'react';
import { CropArea } from './types';
import { toast } from 'sonner';

export const useCropAreaManager = (aspectRatio: number) => {
  const [cropAreas, setCropAreas] = useState<CropArea[]>([]);
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showPreview, setShowPreview] = useState(true);
  const [isExtracting, setIsExtracting] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);

  const initializeCrops = useCallback(() => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const displayWidth = img.clientWidth;
    const displayHeight = img.clientHeight;

    const cropWidth = Math.min(displayWidth * 0.7, displayHeight * aspectRatio * 0.7);
    const cropHeight = cropWidth / aspectRatio;

    const mainCrop: CropArea = {
      id: 'main',
      label: 'Main Card Image',
      x: (displayWidth - cropWidth) / 2,
      y: (displayHeight - cropHeight) / 2,
      width: cropWidth,
      height: cropHeight,
      rotation: 0,
      type: 'main',
      color: '#10b981',
      selected: true
    };

    setCropAreas([mainCrop]);
    setSelectedCropId('main');
  }, [aspectRatio]);

  const addCropArea = useCallback((type: 'frame' | 'element') => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const displayWidth = img.clientWidth;
    const displayHeight = img.clientHeight;

    const newId = `${type}_${Date.now()}`;
    const size = type === 'frame' ? 0.4 : 0.3;
    const cropWidth = displayWidth * size;
    const cropHeight = displayHeight * size;

    const newCrop: CropArea = {
      id: newId,
      label: type === 'frame' ? 'Frame Element' : 'Custom Element',
      x: Math.random() * (displayWidth - cropWidth),
      y: Math.random() * (displayHeight - cropHeight),
      width: cropWidth,
      height: cropHeight,
      rotation: 0,
      type,
      color: type === 'frame' ? '#3b82f6' : '#f59e0b',
      selected: false
    };

    setCropAreas(prev => [...prev, newCrop]);
    setSelectedCropId(newId);
  }, []);

  const removeCropArea = useCallback((cropId: string) => {
    if (cropId === 'main') {
      toast.error('Cannot remove main card image');
      return;
    }
    setCropAreas(prev => prev.filter(crop => crop.id !== cropId));
    if (selectedCropId === cropId) {
      setSelectedCropId('main');
    }
  }, [selectedCropId]);

  const selectCrop = useCallback((cropId: string) => {
    setSelectedCropId(cropId);
    setCropAreas(prev => prev.map(crop => ({
      ...crop,
      selected: crop.id === cropId
    })));
  }, []);

  return {
    cropAreas,
    setCropAreas,
    selectedCropId,
    setSelectedCropId,
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
    imageRef,
    initializeCrops,
    addCropArea,
    removeCropArea,
    selectCrop
  };
};
