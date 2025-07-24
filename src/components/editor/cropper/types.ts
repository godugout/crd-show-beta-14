
export interface CropArea {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  type: 'main' | 'frame' | 'element';
  color: string;
  selected: boolean;
  cornerRadius?: number;
}

export interface CropperState {
  cropAreas: CropArea[];
  selectedCropIds: string[];
  isDragging: boolean;
  dragHandle: string | null;
  dragStart: { x: number; y: number };
  imageLoaded: boolean;
  zoom: number;
  showPreview: boolean;
  isExtracting: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  history: HistoryEntry[];
  historyIndex: number;
  clipboard: CropArea | null;
  activeTool: 'select' | 'crop' | 'rotate' | 'zoom';
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  description: string;
  cropAreas: CropArea[];
}

export interface CropperProps {
  imageUrl: string;
  onCropComplete: (crops: { main?: string; frame?: string; elements?: string[] }) => void;
  onCancel: () => void;
  aspectRatio?: number;
  className?: string;
}

export type DragHandle = 'move' | 'rotate' | 'tl' | 'tr' | 'bl' | 'br' | 't' | 'r' | 'b' | 'l';
