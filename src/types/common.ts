// Common TypeScript interfaces and types for strict mode compliance

export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface APIResponse<T = unknown> {
  data: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends APIResponse<T> {
  page: number;
  totalPages: number;
  totalItems: number;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

export interface FormFieldProps extends BaseProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface CropResult {
  croppedImageDataUrl: string;
  cropArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface AssetIntegrationData {
  id: string;
  name: string;
  type: 'image' | 'texture' | 'pattern' | 'icon';
  url: string;
  category: string;
  metadata: Record<string, unknown>;
}

export interface ExportOptions {
  format: 'png' | 'jpg' | 'pdf' | 'svg';
  quality?: number;
  width?: number;
  height?: number;
  includeBleed?: boolean;
  includeMarks?: boolean;
}

export interface EditorElement {
  id: string;
  type: string;
  properties: Record<string, unknown>;
  position: {
    x: number;
    y: number;
  };
  dimensions: {
    width: number;
    height: number;
  };
  zIndex: number;
  visible: boolean;
}

export interface CanvasState {
  elements: EditorElement[];
  selectedElementId?: string;
  zoom: number;
  viewportOffset: {
    x: number;
    y: number;
  };
}

export interface LayerData {
  id: string;
  name: string;
  type: 'text' | 'image' | 'shape' | 'group';
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: string;
  effects: LayerEffect[];
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface LayerEffect {
  id: string;
  type: 'shadow' | 'glow' | 'bevel' | 'stroke';
  enabled: boolean;
  settings: Record<string, unknown>;
}

export interface TextData {
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  alignment: 'left' | 'center' | 'right' | 'justify';
  lineHeight: number;
  letterSpacing: number;
}

export interface ColorValue {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect extends Point, Size {}

export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  category?: string;
  search?: string;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean | string;
}

export interface ValidationErrors {
  [field: string]: string;
}

export interface FormState<T> {
  values: T;
  errors: ValidationErrors;
  touched: Set<string>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Missing types that were imported elsewhere
export type Visibility = 'public' | 'private' | 'shared' | 'unlisted';

export interface Location {
  id?: string;
  name?: string;
  latitude: number;
  longitude: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  address?: string;
}

// Utility types
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Event types
export type MouseEventHandler = EventHandler<React.MouseEvent>;
export type KeyboardEventHandler = EventHandler<React.KeyboardEvent>;
export type FormEventHandler = EventHandler<React.FormEvent>;
export type ChangeEventHandler = EventHandler<React.ChangeEvent<HTMLInputElement>>;

// Component ref types
export type DivRef = React.RefObject<HTMLDivElement>;
export type InputRef = React.RefObject<HTMLInputElement>;
export type ButtonRef = React.RefObject<HTMLButtonElement>;
export type CanvasRef = React.RefObject<HTMLCanvasElement>;