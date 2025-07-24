// Complete PSD types for Cardshow platform - SINGLE SOURCE OF TRUTH

export interface PSDFile {
  id: string;
  name: string;
  originalUrl: string;
  width: number;
  height: number;
  layerCount: number;
  fileSize: number;
  uploadedAt: Date;
  metadata?: Record<string, any>;
}

export interface CRDElement {
  id: string;
  name: string;
  elementType: 'image' | 'text' | 'shape' | 'background';
  imageUrl: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
  config: {
    position?: { x: number; y: number };
    scale?: number;
    rotation?: number;
    opacity?: number;
    blendMode?: string;
  };
  metadata: {
    sourceFile?: string;
    layerName?: string;
    extractedAt: Date;
    tags?: string[];
  };
  creatorId: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CRDFrame {
  id: string;
  name: string;
  category: string;
  description?: string;
  frameConfig: {
    width: number;
    height: number;
    elements: {
      elementId: string;
      position: { x: number; y: number };
      scale: number;
      rotation: number;
      opacity: number;
      zIndex: number;
      locked?: boolean;
    }[];
    background?: {
      type: 'color' | 'gradient' | 'image';
      value: string;
    };
    effects?: {
      type: string;
      settings: Record<string, any>;
    }[];
  };
  isPublic: boolean;
  priceCents?: number;
  ratingAverage?: number;
  ratingCount?: number;
  downloadCount?: number;
  tags?: string[];
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LayerExportOptions {
  format: 'png' | 'jpg' | 'webp';
  quality?: number;
  transparency?: boolean;
  scale?: number;
}

// Re-export PSD Layer and processing types from unified source
export type { PSDLayer, PSDProcessingResult } from '@/components/editor/crd/import/CRDPSDProcessor';