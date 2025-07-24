// Editor-specific TypeScript interfaces

import type { Point, Size, Rect, ColorValue, LayerData, LayerEffect } from './common';

export interface CanvasElementManager {
  addShape(canvas: unknown, shapeType: string, options?: Record<string, unknown>): void;
  addText(canvas: unknown, textType: string, options?: Record<string, unknown>): void;
  addBackground(canvas: unknown, gradientName: string): void;
  removeElement(canvas: unknown, elementId: string): void;
  clearAll(canvas: unknown): void;
}

export interface CropCompleteResult {
  croppedImageDataUrl: string;
  cropArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface CardState {
  elements: EditorElement[];
  selectedElementId?: string;
  zoom: number;
  viewportOffset: Point;
  canvasSize: Size;
}

export interface EditorElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'group';
  properties: ElementProperties;
  position: Point;
  dimensions: Size;
  rotation?: number;
  opacity?: number;
  visible: boolean;
  locked?: boolean;
}

export interface ElementProperties {
  // Text properties
  content?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number | string;
  fontStyle?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  
  // Image properties
  src?: string;
  alt?: string;
  filters?: ImageFilter[];
  
  // Shape properties
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number;
  
  // Common properties
  [key: string]: unknown;
}

export interface ImageFilter {
  type: 'blur' | 'brightness' | 'contrast' | 'saturation' | 'hue';
  value: number;
}

// PSD Layer types moved to @/components/editor/crd/import/CRDPSDProcessor

export interface PSDTextData {
  content: string;
  fontFamily: string;
  fontSize: number;
  color: ColorValue;
  alignment: 'left' | 'center' | 'right';
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface PSDImageData {
  src: string;
  width: number;
  height: number;
  format: string;
}

export interface PSDShapeData {
  type: 'rectangle' | 'ellipse' | 'path';
  fill?: ColorValue;
  stroke?: {
    color: ColorValue;
    width: number;
  };
  path?: string; // SVG path for complex shapes
}

export interface FrameData {
  id: string;
  name: string;
  config: FrameConfig;
  previewUrl?: string;
  thumbnail?: string;
}

export interface FrameConfig {
  width: number;
  height: number;
  regions: FrameRegion[];
  background?: BackgroundConfig;
  effects?: FrameEffect[];
}

export interface FrameRegion {
  id: string;
  name: string;
  type: 'text' | 'image' | 'placeholder';
  bounds: Rect;
  constraints?: FrameConstraints;
  defaultContent?: FrameRegionContent;
}

export interface FrameConstraints {
  maintainAspectRatio?: boolean;
  allowResize?: boolean;
  allowMove?: boolean;
  minSize?: Size;
  maxSize?: Size;
}

export interface FrameRegionContent {
  text?: string;
  imageUrl?: string;
  placeholder?: string;
}

export interface BackgroundConfig {
  type: 'solid' | 'gradient' | 'image';
  color?: string;
  gradient?: GradientConfig;
  imageUrl?: string;
}

export interface GradientConfig {
  type: 'linear' | 'radial';
  colors: Array<{
    color: string;
    position: number; // 0-1
  }>;
  angle?: number; // for linear gradients
  center?: Point; // for radial gradients
}

export interface FrameEffect {
  id: string;
  type: 'shadow' | 'glow' | 'stroke' | 'blur';
  enabled: boolean;
  settings: EffectSettings;
}

export interface EffectSettings {
  // Shadow/Glow
  color?: string;
  blur?: number;
  offsetX?: number;
  offsetY?: number;
  spread?: number;
  
  // Stroke
  width?: number;
  position?: 'inside' | 'outside' | 'center';
  
  // Blur
  radius?: number;
  
  [key: string]: unknown;
}

export interface ExportSettings {
  format: 'png' | 'jpg' | 'pdf' | 'svg';
  quality?: number; // 0-100 for jpg
  width?: number;
  height?: number;
  dpi?: number;
  includeBleed?: boolean;
  includeMarks?: boolean;
  backgroundColor?: string;
}

export interface AssetData {
  id: string;
  name: string;
  type: 'image' | 'texture' | 'pattern' | 'icon' | 'font';
  url: string;
  thumbnailUrl?: string;
  category: string;
  tags: string[];
  metadata: AssetMetadata;
}

export interface AssetMetadata {
  width?: number;
  height?: number;
  format?: string;
  fileSize?: number;
  license?: string;
  author?: string;
  description?: string;
  [key: string]: unknown;
}

export interface ToolConfig {
  tool: EditorTool;
  options: ToolOptions;
}

export type EditorTool = 
  | 'select'
  | 'text'
  | 'shape'
  | 'image'
  | 'crop'
  | 'brush'
  | 'eraser'
  | 'eyedropper';

export interface ToolOptions {
  [key: string]: unknown;
}

// Event handlers for editor
export interface EditorEventHandlers {
  onElementSelect?: (elementId: string | null) => void;
  onElementCreate?: (element: EditorElement) => void;
  onElementUpdate?: (elementId: string, properties: Partial<ElementProperties>) => void;
  onElementDelete?: (elementId: string) => void;
  onCanvasChange?: (state: CardState) => void;
  onExport?: (settings: ExportSettings) => void;
}

// History management
export interface HistoryState {
  canUndo: boolean;
  canRedo: boolean;
  currentIndex: number;
  states: CardState[];
}

export interface HistoryAction {
  type: 'element_create' | 'element_update' | 'element_delete' | 'canvas_change';
  elementId?: string;
  before?: unknown;
  after?: unknown;
  timestamp: number;
}