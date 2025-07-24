// Premium Visual Styles Registry
export interface CRDVisualStyle {
  id: string;
  displayName: string;
  locked: boolean;
  isActive: boolean;
  category: 'signature' | 'material' | 'effect' | 'premium' | 'legendary';
  baseMaterial: string;
  secondaryFinish?: string;
  textureProfile: string;
  particleEffect?: string;
  lighting: string;
  animationProfile?: string;
  uiPreviewGradient: string;
  visualVibe: string;
  unlockMethod: 'free' | 'points' | 'premium' | 'achievement';
  unlockCost?: number;
  performance: {
    renderCost: 'low' | 'medium' | 'high' | 'very-high';
    particleCount: number;
    shaderComplexity: number;
  };
}

// Premium Visual Styles Database - Ordered by color progression (warm to cool)
export const CRDVisualStyles: CRDVisualStyle[] = [
  // Warm Colors (Red/Orange)
  {
    id: 'rubyGem',
    displayName: 'Ruby Gem',
    locked: true,
    isActive: false,
    category: 'premium',
    baseMaterial: 'RubyGem',
    secondaryFinish: 'GemCuts',
    textureProfile: 'CrystalFacets',
    particleEffect: 'RubySparkle',
    lighting: 'JewelHDR',
    animationProfile: 'GemShine',
    uiPreviewGradient: 'linear-gradient(135deg, #e0115f, #dc143c, #ff69b4)',
    visualVibe: 'Passionate & regal',
    unlockMethod: 'points',
    unlockCost: 950,
    performance: {
      renderCost: 'medium',
      particleCount: 85,
      shaderComplexity: 6
    }
  },
  {
    id: 'goldLeaf',
    displayName: 'Gold Leaf',
    locked: false,
    isActive: false,
    category: 'material',
    baseMaterial: 'GoldLeaf',
    secondaryFinish: 'MetallicSheen',
    textureProfile: 'LeafTexture',
    particleEffect: 'GoldFlakes',
    lighting: 'WarmMetalHDR',
    animationProfile: 'MetalShimmer',
    uiPreviewGradient: 'linear-gradient(135deg, #ffd700, #ffb300, #daa520)',
    visualVibe: 'Rich & opulent',
    unlockMethod: 'free',
    performance: {
      renderCost: 'medium',
      particleCount: 60,
      shaderComplexity: 4
    }
  },
  {
    id: 'vintageBoil',
    displayName: 'Vintage Foil',
    locked: true,
    isActive: false,
    category: 'signature',
    baseMaterial: 'AgedFoil',
    secondaryFinish: 'PatinaClear',
    textureProfile: 'VintageWear',
    lighting: 'WarmHDR',
    animationProfile: 'SubtleShimmer',
    uiPreviewGradient: 'linear-gradient(135deg, #d4af37, #b8860b, #cd853f)',
    visualVibe: 'Nostalgic & timeless',
    unlockMethod: 'points',
    unlockCost: 300,
    performance: {
      renderCost: 'medium',
      particleCount: 20,
      shaderComplexity: 4
    }
  },
  {
    id: 'woodGrain',
    displayName: 'Wood Grain',
    locked: false,
    isActive: false,
    category: 'material',
    baseMaterial: 'WoodGrain',
    textureProfile: 'WoodTexture',
    lighting: 'WarmHDR',
    uiPreviewGradient: 'linear-gradient(135deg, #8b4513, #a0522d, #cd853f)',
    visualVibe: 'Natural & warm',
    unlockMethod: 'free',
    performance: {
      renderCost: 'medium',
      particleCount: 0,
      shaderComplexity: 3
    }
  },

  // Neutral Colors (Black/Gray/White)
  {
    id: 'obsidian',
    displayName: 'Obsidian',
    locked: false,
    isActive: false,
    category: 'material',
    baseMaterial: 'Obsidian',
    secondaryFinish: 'VolcanicGlass',
    textureProfile: 'SmoothGlass',
    particleEffect: 'DarkSparkles',
    lighting: 'DarkReflectiveHDR',
    animationProfile: 'StealthShine',
    uiPreviewGradient: 'linear-gradient(135deg, #0a0a0a, #1a1a1a, #2d2d2d)',
    visualVibe: 'Mysterious & sleek',
    unlockMethod: 'free',
    performance: {
      renderCost: 'low',
      particleCount: 20,
      shaderComplexity: 3
    }
  },
  {
    id: 'basicFoil',
    displayName: 'Basic Foil',
    locked: false,
    isActive: false,
    category: 'material',
    baseMaterial: 'StandardFoil',
    textureProfile: 'Smooth',
    lighting: 'StudioHDR',
    uiPreviewGradient: 'linear-gradient(135deg, #c9c9c9, #f0f0f0)',
    visualVibe: 'Clean & professional',
    unlockMethod: 'free',
    performance: {
      renderCost: 'low',
      particleCount: 0,
      shaderComplexity: 1
    }
  },
  {
    id: 'matte',
    displayName: 'Matte Finish',
    locked: false,
    isActive: true, // Default active
    category: 'material',
    baseMaterial: 'MattePaper',
    textureProfile: 'Textured',
    lighting: 'SoftHDR',
    uiPreviewGradient: 'linear-gradient(135deg, #8e8e8e, #b8b8b8)',
    visualVibe: 'Subtle & elegant',
    unlockMethod: 'free',
    performance: {
      renderCost: 'low',
      particleCount: 0,
      shaderComplexity: 1
    }
  },
  {
    id: 'classicGloss',
    displayName: 'Classic Gloss',
    locked: false,
    isActive: false,
    category: 'material',
    baseMaterial: 'GlossyCard',
    secondaryFinish: 'HighGlossClear',
    textureProfile: 'Smooth',
    lighting: 'StudioHDRBright',
    uiPreviewGradient: 'linear-gradient(135deg, #ffffff, #e8e8e8)',
    visualVibe: 'Traditional & polished',
    unlockMethod: 'free',
    performance: {
      renderCost: 'low',
      particleCount: 0,
      shaderComplexity: 2
    }
  },
  {
    id: 'chromeBurst',
    displayName: 'Chrome Burst',
    locked: true,
    isActive: false,
    category: 'premium',
    baseMaterial: 'ChromeMetal',
    secondaryFinish: 'MirrorFinish',
    textureProfile: 'PolishedMetal',
    particleEffect: 'MetalSpark',
    lighting: 'DramaticHDR',
    animationProfile: 'ChromeFlare',
    uiPreviewGradient: 'linear-gradient(90deg, #434343, #000000, #2c2c2c)',
    visualVibe: 'Bold & industrial',
    unlockMethod: 'achievement',
    unlockCost: 1000,
    performance: {
      renderCost: 'medium',
      particleCount: 60,
      shaderComplexity: 6
    }
  },

  // Cool Colors (Green to Blue)
  {
    id: 'emeraldGem',
    displayName: 'Emerald Gem',
    locked: true,
    isActive: false,
    category: 'premium',
    baseMaterial: 'EmeraldGem',
    secondaryFinish: 'GemCuts',
    textureProfile: 'CrystalFacets',
    particleEffect: 'EmeraldSparkle',
    lighting: 'JewelHDR',
    animationProfile: 'GemShine',
    uiPreviewGradient: 'linear-gradient(135deg, #50c878, #228b22, #00ff7f)',
    visualVibe: 'Precious & luxurious',
    unlockMethod: 'points',
    unlockCost: 900,
    performance: {
      renderCost: 'medium',
      particleCount: 80,
      shaderComplexity: 6
    }
  },
  {
    id: 'liquidSwirl',
    displayName: 'Liquid Swirl',
    locked: false,
    isActive: false,
    category: 'material',
    baseMaterial: 'LiquidSwirl',
    secondaryFinish: 'FluidMotion',
    textureProfile: 'FluidTurbulence',
    particleEffect: 'FluidRipples',
    lighting: 'AquaticHDR',
    animationProfile: 'TurbulentFlow',
    uiPreviewGradient: 'linear-gradient(135deg, #1e40af, #3b82f6, #06b6d4, #0891b2)',
    visualVibe: 'Fluid & hypnotic',
    unlockMethod: 'free',
    performance: {
      renderCost: 'high',
      particleCount: 0,
      shaderComplexity: 8
    }
  },
  {
    id: 'oceanWaves',
    displayName: 'Ocean Waves',
    locked: true,
    isActive: false,
    category: 'effect',
    baseMaterial: 'FluidFoil',
    secondaryFinish: 'WaveRefraction',
    textureProfile: 'FlowingRipple',
    particleEffect: 'WaterDroplets',
    lighting: 'AquaticHDR',
    animationProfile: 'FlowingWaves',
    uiPreviewGradient: 'linear-gradient(135deg, #007acc, #0099e6, #33ccff)',
    visualVibe: 'Fluid & dynamic',
    unlockMethod: 'premium',
    unlockCost: 800,
    performance: {
      renderCost: 'high',
      particleCount: 120,
      shaderComplexity: 7
    }
  },
  {
    id: 'sapphireGem',
    displayName: 'Sapphire Gem',
    locked: true,
    isActive: false,
    category: 'premium',
    baseMaterial: 'SapphireGem',
    secondaryFinish: 'GemCuts',
    textureProfile: 'CrystalFacets',
    particleEffect: 'SapphireSparkle',
    lighting: 'JewelHDR',
    animationProfile: 'GemShine',
    uiPreviewGradient: 'linear-gradient(135deg, #0f52ba, #4169e1, #87ceeb)',
    visualVibe: 'Noble & serene',
    unlockMethod: 'points',
    unlockCost: 925,
    performance: {
      renderCost: 'medium',
      particleCount: 80,
      shaderComplexity: 6
    }
  },
  {
    id: 'crystalInterference',
    displayName: 'Crystal Interference',
    locked: true,
    isActive: false,
    category: 'premium',
    baseMaterial: 'CrystalClear',
    secondaryFinish: 'IridescentFilm',
    textureProfile: 'MicroEtchSmooth',
    particleEffect: 'RefractionBloom',
    lighting: 'CoolBacklitHDR',
    animationProfile: 'RefractionShift',
    uiPreviewGradient: 'linear-gradient(120deg, #6de4dc, #c5b7ff, #ff9de6)',
    visualVibe: 'Ethereal & high-tech',
    unlockMethod: 'points',
    unlockCost: 750,
    performance: {
      renderCost: 'high',
      particleCount: 80,
      shaderComplexity: 9
    }
  },

  // Spectrum/Rainbow Effects
  {
    id: 'holoBurst',
    displayName: 'Holographic Burst',
    locked: true,
    isActive: false,
    category: 'premium',
    baseMaterial: 'PrismaticFoil',
    secondaryFinish: 'HighGlossClear',
    textureProfile: 'EmbossedLight',
    particleEffect: 'RainbowSparkle',
    lighting: 'StudioHDRBright',
    animationProfile: 'ShimmerPulse',
    uiPreviewGradient: 'linear-gradient(45deg, #e4d00a, #d95eff, #00d4ff)',
    visualVibe: 'Futuristic & eye-catching',
    unlockMethod: 'premium',
    unlockCost: 500,
    performance: {
      renderCost: 'high',
      particleCount: 150,
      shaderComplexity: 8
    }
  },
  {
    id: 'spectralPrism',
    displayName: 'Spectral Prism',
    locked: true,
    isActive: false,
    category: 'premium',
    baseMaterial: 'SpectralPrism',
    secondaryFinish: 'RainbowFlow',
    textureProfile: 'FluidSpectrum',
    particleEffect: 'ColorSwirls',
    lighting: 'PrismaticHDR',
    animationProfile: 'LavaLampFlow',
    uiPreviewGradient: 'linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #00ff00, #0080ff, #8000ff, #ff00ff)',
    visualVibe: 'Hypnotic & mesmerizing',
    unlockMethod: 'premium',
    unlockCost: 1200,
    performance: {
      renderCost: 'high',
      particleCount: 200,
      shaderComplexity: 10
    }
  },
  {
    id: 'opalescent',
    displayName: 'Opalescent',
    locked: true,
    isActive: false,
    category: 'premium',
    baseMaterial: 'Opalescent',
    secondaryFinish: 'NacreSheen',
    textureProfile: 'OpalPatterns',
    particleEffect: 'ColorShifts',
    lighting: 'IridescentHDR',
    animationProfile: 'FlowingColors',
    uiPreviewGradient: 'linear-gradient(45deg, #ff69b4, #ffd700, #00ced1, #9370db, #ff1493)',
    visualVibe: 'Ethereal & shifting',
    unlockMethod: 'points',
    unlockCost: 800,
    performance: {
      renderCost: 'high',
      particleCount: 120,
      shaderComplexity: 8
    }
  },

  // Ultimate Luxury
  {
    id: 'diamondGem',
    displayName: 'Diamond',
    locked: true,
    isActive: false,
    category: 'legendary',
    baseMaterial: 'DiamondGem',
    secondaryFinish: 'PerfectCuts',
    textureProfile: 'DiamondFacets',
    particleEffect: 'DiamondSparkle',
    lighting: 'BrilliantHDR',
    animationProfile: 'BrilliantShine',
    uiPreviewGradient: 'linear-gradient(135deg, #ffffff, #f0f8ff, #e6e6fa)',
    visualVibe: 'Ultimate luxury',
    unlockMethod: 'premium',
    unlockCost: 2500,
    performance: {
      renderCost: 'very-high',
      particleCount: 300,
      shaderComplexity: 12
    }
  }
];

// Style Registry Management
export class StyleRegistry {
  private static instance: StyleRegistry;
  private styles: Map<string, CRDVisualStyle> = new Map();
  private activeStyleId: string = 'matte'; // Default

  static getInstance(): StyleRegistry {
    if (!StyleRegistry.instance) {
      StyleRegistry.instance = new StyleRegistry();
    }
    return StyleRegistry.instance;
  }

  constructor() {
    // Register all styles
    CRDVisualStyles.forEach(style => {
      this.styles.set(style.id, style);
    });
  }

  getStyle(id: string): CRDVisualStyle | undefined {
    return this.styles.get(id);
  }

  getAllStyles(): CRDVisualStyle[] {
    return Array.from(this.styles.values());
  }

  getUnlockedStyles(): CRDVisualStyle[] {
    return this.getAllStyles().filter(style => !style.locked);
  }

  getStylesByCategory(category: string): CRDVisualStyle[] {
    return this.getAllStyles().filter(style => style.category === category);
  }

  setActiveStyle(id: string): boolean {
    const style = this.getStyle(id);
    if (style && !style.locked) {
      // Deactivate all styles
      this.getAllStyles().forEach(s => s.isActive = false);
      // Activate selected style
      style.isActive = true;
      this.activeStyleId = id;
      return true;
    }
    return false;
  }

  getActiveStyle(): CRDVisualStyle | undefined {
    return this.getStyle(this.activeStyleId);
  }

  unlockStyle(id: string): boolean {
    const style = this.getStyle(id);
    if (style) {
      style.locked = false;
      return true;
    }
    return false;
  }
}