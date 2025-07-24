// Premium Visual Styles Type System
// Based on CRD Premium Visual Styles Specification

export type VisualStyleCategory = 
  | 'premium' 
  | 'metallic' 
  | 'specialty' 
  | 'atmospheric' 
  | 'classic' 
  | 'experimental';

export type UnlockMethod = 
  | 'free' 
  | 'subscription' 
  | 'points' 
  | 'marketplace' 
  | 'premium_template' 
  | 'achievement';

export interface MaterialPreset {
  type: string;
  roughness: number;
  metalness: number;
  transmission?: number;
  iridescence?: number;
  reflectivity?: number;
  goldTone?: string;
  flow?: boolean;
}

export interface EffectLayer {
  type: string;
  intensity: number;
  blendMode?: string;
  opacity?: number;
}

export interface TextureProfile {
  emboss: number;
  grain: number;
  holographic?: boolean;
  interference?: boolean;
  chrome?: boolean;
  shimmer?: boolean;
  waves?: boolean;
}

export interface ParticlePreset {
  type: string;
  count: number;
  intensity: number;
  animation?: string;
}

export interface LightingPreset {
  type: string;
  intensity: number;
  color?: string;
  direction?: number[];
}

export interface AnimationProfile {
  type: string;
  speed: number;
  amplitude: number;
  loop?: boolean;
}

export interface PerformanceBudget {
  shaderCost: number;
  particleLimit: number;
  renderPasses: number;
  maxFPS?: number;
}

export interface CRDVisualStyle {
  id: string;
  displayName: string;
  category: VisualStyleCategory;
  isLocked: boolean;
  unlockMethod: UnlockMethod;
  unlockCost: number;
  baseMaterial: MaterialPreset;
  secondaryFinish?: EffectLayer;
  textureProfile: TextureProfile;
  particleEffect?: ParticlePreset;
  lightingPreset: LightingPreset;
  animationProfile?: AnimationProfile;
  uiPreviewGradient: string;
  visualVibe: string;
  performanceBudget: PerformanceBudget;
  shaderConfig: Record<string, any>; // Obfuscated parameters
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserStyleUnlock {
  id: string;
  userId: string;
  styleId: string;
  unlockedAt: string;
  unlockMethod: UnlockMethod;
  unlockMetadata: Record<string, any>;
}

export interface UserStylePreferences {
  id: string;
  userId: string;
  styleId: string;
  customParameters: Record<string, any>;
  usageCount: number;
  lastUsedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface StyleUnlockResult {
  success: boolean;
  message: string;
  styleId?: string;
}

export interface StyleApplicationState {
  appliedStyleId?: string;
  isApplying: boolean;
  customParameters: Record<string, any>;
  performanceMetrics?: {
    fps: number;
    renderTime: number;
    memoryUsage: number;
  };
}

// Security and obfuscation interfaces
export interface ObfuscatedShaderConfig {
  vertex: string; // Base64 encoded vertex shader
  fragment: string; // Base64 encoded fragment shader
  uniforms: Record<string, any>; // Encrypted uniform values
  defines: string[]; // Shader compilation defines
}

export interface StyleSecurityContext {
  userId: string;
  sessionToken: string;
  unlockValidation: boolean;
  lastValidated: number;
}