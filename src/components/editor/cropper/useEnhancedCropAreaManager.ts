import { useState, useCallback, useRef, useEffect } from 'react';
import { CropArea, CropperState, HistoryEntry, DragHandle } from './types';
import { toast } from 'sonner';

export const useEnhancedCropAreaManager = (aspectRatio: number) => {
  const [cropAreas, setCropAreas] = useState<CropArea[]>([]);
  const [selectedCropIds, setSelectedCropIds] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<DragHandle | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showPreview, setShowPreview] = useState(true);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [gridSize] = useState(20);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [clipboard, setClipboard] = useState<CropArea | null>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'crop' | 'rotate' | 'zoom'>('select');

  const imageRef = useRef<HTMLImageElement>(null);

  // Save state to history
  const saveToHistory = useCallback((description: string, newCropAreas?: CropArea[]) => {
    const areasToSave = newCropAreas || cropAreas;
    const entry: HistoryEntry = {
      id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      description,
      cropAreas: JSON.parse(JSON.stringify(areasToSave))
    };

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(entry);
      // Keep only last 50 entries
      return newHistory.slice(-50);
    });
    setHistoryIndex(prev => prev + 1);
  }, [cropAreas, historyIndex]);

  // Snap to grid helper
  const snapToGridHelper = useCallback((value: number) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  }, [snapToGrid, gridSize]);

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
      x: snapToGridHelper((displayWidth - cropWidth) / 2),
      y: snapToGridHelper((displayHeight - cropHeight) / 2),
      width: cropWidth,
      height: cropHeight,
      rotation: 0,
      type: 'main',
      color: '#10b981',
      selected: true
    };

    setCropAreas([mainCrop]);
    setSelectedCropIds(['main']);
    saveToHistory('Initialize main crop area', [mainCrop]);
  }, [aspectRatio, snapToGridHelper, saveToHistory]);

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
      x: snapToGridHelper(Math.random() * (displayWidth - cropWidth)),
      y: snapToGridHelper(Math.random() * (displayHeight - cropHeight)),
      width: cropWidth,
      height: cropHeight,
      rotation: 0,
      type,
      color: type === 'frame' ? '#3b82f6' : '#f59e0b',
      selected: false
    };

    const newAreas = [...cropAreas, newCrop];
    setCropAreas(newAreas);
    setSelectedCropIds([newId]);
    saveToHistory(`Add ${type} crop area`, newAreas);
  }, [cropAreas, snapToGridHelper, saveToHistory]);

  const removeCropArea = useCallback((cropId: string) => {
    if (cropId === 'main') {
      toast.error('Cannot remove main card image');
      return;
    }
    const newAreas = cropAreas.filter(crop => crop.id !== cropId);
    setCropAreas(newAreas);
    setSelectedCropIds(prev => prev.filter(id => id !== cropId));
    saveToHistory(`Remove crop area`, newAreas);
  }, [cropAreas, saveToHistory]);

  const selectCrop = useCallback((cropId: string, multiSelect = false) => {
    if (multiSelect) {
      setSelectedCropIds(prev => 
        prev.includes(cropId) 
          ? prev.filter(id => id !== cropId)
          : [...prev, cropId]
      );
    } else {
      setSelectedCropIds([cropId]);
    }
  }, []);

  const selectAll = useCallback(() => {
    setSelectedCropIds(cropAreas.map(crop => crop.id));
  }, [cropAreas]);

  const clearSelection = useCallback(() => {
    setSelectedCropIds([]);
  }, []);

  // Clipboard operations
  const copyCrop = useCallback(() => {
    if (selectedCropIds.length === 1) {
      const crop = cropAreas.find(c => c.id === selectedCropIds[0]);
      if (crop) {
        setClipboard(JSON.parse(JSON.stringify(crop)));
        toast.success('Crop area copied to clipboard');
      }
    }
  }, [selectedCropIds, cropAreas]);

  const cutCrop = useCallback(() => {
    if (selectedCropIds.length === 1) {
      const crop = cropAreas.find(c => c.id === selectedCropIds[0]);
      if (crop && crop.id !== 'main') {
        setClipboard(JSON.parse(JSON.stringify(crop)));
        removeCropArea(crop.id);
        toast.success('Crop area cut to clipboard');
      }
    }
  }, [selectedCropIds, cropAreas, removeCropArea]);

  const pasteCrop = useCallback(() => {
    if (clipboard && imageRef.current) {
      const img = imageRef.current;
      const newId = `${clipboard.type}_${Date.now()}`;
      const newCrop: CropArea = {
        ...clipboard,
        id: newId,
        x: snapToGridHelper(Math.min(clipboard.x + 20, img.clientWidth - clipboard.width)),
        y: snapToGridHelper(Math.min(clipboard.y + 20, img.clientHeight - clipboard.height)),
        selected: false
      };

      const newAreas = [...cropAreas, newCrop];
      setCropAreas(newAreas);
      setSelectedCropIds([newId]);
      saveToHistory('Paste crop area', newAreas);
      toast.success('Crop area pasted');
    }
  }, [clipboard, cropAreas, snapToGridHelper, saveToHistory]);

  const duplicateCrop = useCallback(() => {
    if (selectedCropIds.length === 1) {
      const crop = cropAreas.find(c => c.id === selectedCropIds[0]);
      if (crop && imageRef.current) {
        const img = imageRef.current;
        const newId = `${crop.type}_${Date.now()}`;
        const newCrop: CropArea = {
          ...crop,
          id: newId,
          x: snapToGridHelper(Math.min(crop.x + 20, img.clientWidth - crop.width)),
          y: snapToGridHelper(Math.min(crop.y + 20, img.clientHeight - crop.height)),
          selected: false
        };

        const newAreas = [...cropAreas, newCrop];
        setCropAreas(newAreas);
        setSelectedCropIds([newId]);
        saveToHistory('Duplicate crop area', newAreas);
        toast.success('Crop area duplicated');
      }
    }
  }, [selectedCropIds, cropAreas, snapToGridHelper, saveToHistory]);

  // History operations
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevEntry = history[historyIndex - 1];
      setCropAreas(JSON.parse(JSON.stringify(prevEntry.cropAreas)));
      setHistoryIndex(prev => prev - 1);
      setSelectedCropIds([]);
      toast.success(`Undone: ${prevEntry.description}`);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextEntry = history[historyIndex + 1];
      setCropAreas(JSON.parse(JSON.stringify(nextEntry.cropAreas)));
      setHistoryIndex(prev => prev + 1);
      setSelectedCropIds([]);
      toast.success(`Redone: ${nextEntry.description}`);
    }
  }, [history, historyIndex]);

  // Zoom operations
  const zoomFit = useCallback(() => {
    setZoom(1);
    toast.success('Zoom fit to window');
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 'c':
            e.preventDefault();
            copyCrop();
            break;
          case 'x':
            e.preventDefault();
            cutCrop();
            break;
          case 'v':
            e.preventDefault();
            pasteCrop();
            break;
          case 'd':
            e.preventDefault();
            duplicateCrop();
            break;
          case 'a':
            e.preventDefault();
            selectAll();
            break;
        }
      } else {
        switch (e.key) {
          case 'Delete':
          case 'Backspace':
            e.preventDefault();
            selectedCropIds.forEach(id => {
              if (id !== 'main') removeCropArea(id);
            });
            break;
          case 'Escape':
            e.preventDefault();
            clearSelection();
            break;
          case 'r':
            e.preventDefault();
            setActiveTool('rotate');
            break;
          case 's':
            e.preventDefault();
            setActiveTool('select');
            break;
          case 'c':
            e.preventDefault();
            setActiveTool('crop');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, copyCrop, cutCrop, pasteCrop, duplicateCrop, selectAll, clearSelection, selectedCropIds, removeCropArea]);

  return {
    // State
    cropAreas,
    setCropAreas,
    selectedCropIds,
    setSelectedCropIds,
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
    history,
    historyIndex,
    clipboard,
    activeTool,
    setActiveTool,
    imageRef,

    // Operations
    initializeCrops,
    addCropArea,
    removeCropArea,
    selectCrop,
    selectAll,
    clearSelection,
    copyCrop,
    cutCrop,
    pasteCrop,
    duplicateCrop,
    undo,
    redo,
    zoomFit,
    saveToHistory,
    snapToGridHelper,

    // Computed
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    selectedCount: selectedCropIds.length,
  };
};
