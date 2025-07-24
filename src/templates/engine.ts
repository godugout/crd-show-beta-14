// --- 1. Template Engine Interface ---
export interface TemplateEngine {
  id: string;
  name: string;
  initialCamera?: CameraConfig;
  keyframes: AnimationFrame[];
  autoTrigger?: boolean;
  transitionToStudio?: boolean;
  replayable?: boolean;
  footerHUD?: TemplateFooterHUD;
}

export interface TemplateFooterHUD {
  statusLines: string[];        // Lines to show in footer
  showReplay?: boolean;         // Show replay button
  showContinue?: boolean;       // Show "Continue to Customize" button
  compact?: boolean;            // true = 3–4 lines max
}

export interface CameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  zoom: number;
}

export interface AnimationFrame {
  progress: number; // 0 → 1
  sun?: ObjectPosition;
  moon?: ObjectPosition;
  card?: ObjectTransform;
  environment?: EnvironmentConfig;
  lighting?: LightingConfig;
}

export interface ObjectPosition {
  x?: number;
  y?: number;
  z?: number;
  scale?: number;
  opacity?: number;
  glow?: number;
  color?: string;
}

export interface ObjectTransform {
  y?: number;
  rotation?: [number, number, number];
  lean?: number;
  lock?: boolean;
}

export interface EnvironmentConfig {
  backgroundColor?: string;
  intensity?: number;
}

export interface LightingConfig {
  intensity?: number;
  color?: string;
}

// --- 2. Template Configuration ---
export interface TemplateConfig {
  templateId: string;
  mode: 'cinematic' | 'studio' | 'preview';
  triggerOnLoad?: boolean;
}

// --- 3. Registry for Templates ---
import { cosmicTemplate } from './cosmic/engine';

export const templateRegistry: Record<string, TemplateEngine> = {
  cosmic: cosmicTemplate
};

// --- 4. Template Loader ---
export function loadTemplate(config: TemplateConfig): TemplateEngine | null {
  const engine = templateRegistry[config.templateId];
  if (!engine) return null;
  return engine;
}

// --- 5. Helper Functions ---
export function interpolateFrame(frames: AnimationFrame[], progress: number): AnimationFrame {
  if (frames.length === 0) return { progress };
  
  // Find the two frames to interpolate between
  let currentFrame = frames[0];
  let nextFrame = frames[frames.length - 1];
  
  for (let i = 0; i < frames.length - 1; i++) {
    if (progress >= frames[i].progress && progress <= frames[i + 1].progress) {
      currentFrame = frames[i];
      nextFrame = frames[i + 1];
      break;
    }
  }
  
  // If progress is beyond the last frame, return the last frame
  if (progress >= frames[frames.length - 1].progress) {
    return frames[frames.length - 1];
  }
  
  // Linear interpolation
  const t = (progress - currentFrame.progress) / (nextFrame.progress - currentFrame.progress);
  
  return {
    progress,
    sun: interpolatePosition(currentFrame.sun, nextFrame.sun, t),
    moon: interpolatePosition(currentFrame.moon, nextFrame.moon, t),
    card: interpolateTransform(currentFrame.card, nextFrame.card, t),
    environment: interpolateEnvironment(currentFrame.environment, nextFrame.environment, t),
    lighting: interpolateLighting(currentFrame.lighting, nextFrame.lighting, t)
  };
}

function interpolatePosition(a: ObjectPosition | undefined, b: ObjectPosition | undefined, t: number): ObjectPosition | undefined {
  if (!a && !b) return undefined;
  if (!a) return b;
  if (!b) return a;
  
  return {
    x: lerp(a.x || 0, b.x || 0, t),
    y: lerp(a.y || 0, b.y || 0, t),
    z: lerp(a.z || 0, b.z || 0, t),
    scale: lerp(a.scale || 1, b.scale || 1, t),
    opacity: lerp(a.opacity || 1, b.opacity || 1, t),
    glow: lerp(a.glow || 0, b.glow || 0, t),
    color: a.color || b.color
  };
}

function interpolateTransform(a: ObjectTransform | undefined, b: ObjectTransform | undefined, t: number): ObjectTransform | undefined {
  if (!a && !b) return undefined;
  if (!a) return b;
  if (!b) return a;
  
  return {
    y: lerp(a.y || 0, b.y || 0, t),
    lean: lerp(a.lean || 0, b.lean || 0, t),
    rotation: a.rotation || b.rotation,
    lock: b.lock !== undefined ? b.lock : a.lock
  };
}

function interpolateEnvironment(a: EnvironmentConfig | undefined, b: EnvironmentConfig | undefined, t: number): EnvironmentConfig | undefined {
  if (!a && !b) return undefined;
  if (!a) return b;
  if (!b) return a;
  
  return {
    backgroundColor: a.backgroundColor || b.backgroundColor,
    intensity: lerp(a.intensity || 1, b.intensity || 1, t)
  };
}

function interpolateLighting(a: LightingConfig | undefined, b: LightingConfig | undefined, t: number): LightingConfig | undefined {
  if (!a && !b) return undefined;
  if (!a) return b;
  if (!b) return a;
  
  return {
    intensity: lerp(a.intensity || 1, b.intensity || 1, t),
    color: a.color || b.color
  };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}