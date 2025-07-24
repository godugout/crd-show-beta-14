// CRD Frame Type Definitions
export interface CRDFrame {
  id: string;
  name: string;
  category: string;
  version: string;
  description?: string;
  preview_image_url?: string;
  frame_config: CRDFrameConfig;
  included_elements: string[];
  is_public: boolean;
  price_cents: number;
  rating_average: number;
  rating_count: number;
  download_count: number;
  tags: string[];
  creator_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CRDFrameConfig {
  dimensions: {
    width: number;
    height: number;
  };
  regions: CRDRegion[];
  elements: CRDFrameElement[];
}

export interface CRDRegion {
  id: string;
  type: 'photo' | 'text' | 'logo' | 'decoration' | 'stats' | 'background';
  name: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  shape: 'rectangle' | 'circle' | 'ellipse' | 'polygon' | 'path';
  constraints: {
    aspectRatio?: number;
    minSize?: { width: number; height: number };
    maxSize?: { width: number; height: number };
    position?: 'fixed' | 'flexible';
    rotation?: boolean;
    scalable?: boolean;
  };
  styling: {
    border?: BorderStyle;
    background?: BackgroundStyle;
    effects?: VisualEffect[];
    clipPath?: string;
  };
  cropSettings?: {
    enabled: boolean;
    aspectRatio?: number;
    minCropSize?: { width: number; height: number };
    allowRotation?: boolean;
    allowBackgroundRemoval?: boolean;
  };
}

export interface CRDFrameElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'pattern' | 'gradient' | 'svg';
  name: string;
  region_id?: string;
  properties: ElementProperties;
  behavior: ElementBehavior;
  variations: ElementVariation[];
}

export interface ElementProperties {
  content?: string;
  font?: FontStyle;
  color?: string;
  size?: { width: number; height: number };
  position?: { x: number; y: number };
  rotation?: number;
  opacity?: number;
  src?: string;
  alt?: string;
}

export interface ElementBehavior {
  responsive?: boolean;
  interactive?: boolean;
  animated?: boolean;
  conditional?: {
    showIf?: string;
    hideIf?: string;
  };
}

export interface ElementVariation {
  name: string;
  properties: Partial<ElementProperties>;
  conditions?: string[];
}

export interface CRDConstraints {
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  aspectRatioLocked: boolean;
  printSafe: boolean;
  bleedArea?: number;
}

export interface CRDCustomization {
  colors: ColorScheme[];
  fonts: FontScheme[];
  layouts: LayoutVariant[];
  effects: VisualEffect[];
}

export interface CRDFrameMetadata {
  sport?: string;
  era?: string;
  style?: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  tags: string[];
  is_premium: boolean;
}

// Supporting interfaces
export interface BorderStyle {
  width: number;
  style: 'solid' | 'dashed' | 'dotted';
  color: string;
  radius?: number;
}

export interface BackgroundStyle {
  type: 'color' | 'gradient' | 'image' | 'pattern';
  value: string;
  opacity?: number;
}

export interface VisualEffect {
  type: 'shadow' | 'glow' | 'blur' | 'inset' | 'emboss';
  parameters: Record<string, any>;
}

export interface FontStyle {
  family: string;
  size: number;
  weight: number;
  style: 'normal' | 'italic';
  lineHeight?: number;
  letterSpacing?: number;
}

export interface ColorScheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

export interface FontScheme {
  name: string;
  heading: FontStyle;
  body: FontStyle;
  caption: FontStyle;
}

export interface LayoutVariant {
  name: string;
  regions: Partial<CRDRegion>[];
}

// CRD Element standalone definition
export interface CRDElement {
  id: string;
  name: string;
  element_type: string;
  category?: string;
  description?: string;
  config: any;
  asset_urls?: any;
  is_public: boolean;
  is_free: boolean;
  price_cents: number;
  tags: string[];
  rating_average: number;
  rating_count: number;
  download_count: number;
  preview_image_url?: string;
  creator_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Visual Style definition
export interface CRDVisualStyle {
  id: string;
  display_name: string;
  category: 'base' | 'finish' | 'effect' | 'animation';
  visual_vibe: string;
  ui_preview_gradient: string;
  base_material: any;
  shader_config: any;
  texture_profile: any;
  lighting_preset: any;
  performance_budget: any;
  secondary_finish?: any;
  particle_effect?: any;
  animation_profile?: any;
  is_active: boolean;
  is_locked: boolean;
  unlock_method: 'free' | 'purchase' | 'achievement' | 'premium';
  unlock_cost?: number;
  sort_order?: number;
}

// Crop Tool Integration
export interface CropToolConfig {
  enabled: boolean;
  regionId: string;
  aspectRatio?: number;
  minCropSize?: { width: number; height: number };
  maxCropSize?: { width: number; height: number };
  allowRotation: boolean;
  allowBackgroundRemoval: boolean;
  cropHandles: {
    corner: boolean;
    edge: boolean;
    rotate: boolean;
  };
  snapToGrid: boolean;
  gridSize?: number;
}

export interface CropResult {
  regionId: string;
  cropData: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
  };
  originalImage: string;
  croppedImage: string;
  backgroundRemoved?: boolean;
  metadata?: {
    quality: number;
    format: string;
    size: { width: number; height: number };
  };
}