
export interface CardElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  src?: string;
  style?: Record<string, any>;
}

export interface CardTemplate {
  id: string;
  name: string;
  category: string;
  elements: CardElement[];
  thumbnail?: string;
}

export interface EditorState {
  selectedElement: string | null;
  zoom: number;
  canvasSize: { width: number; height: number };
  isPreviewMode: boolean;
}
