// Smart Template Service for learning user preferences

interface StyleDNA {
  colorPreferences: string[];
  layoutPreferences: string[];
  effectPreferences: string[];
  categoryPreferences: string[];
  complexity: 'simple' | 'moderate' | 'complex';
  timestamp: number;
}

interface CommunityTemplate {
  id: string;
  name: string;
  creator: string;
  creatorAvatar?: string;
  downloads: number;
  rating: number;
  tags: string[];
  thumbnail: string;
  adaptable: boolean;
  styleElements: {
    colors: string[];
    fonts: string[];
    effects: string[];
  };
}

interface ThemedSet {
  id: string;
  name: string;
  description: string;
  templates: string[];
  preview: string;
  theme: {
    era?: string;
    style: string;
    colors: string[];
    effects: string[];
  };
}

export class SmartTemplateService {
  private styleDNA: StyleDNA | null = null;

  constructor() {
    this.loadStyleDNA();
  }

  private loadStyleDNA() {
    const stored = localStorage.getItem('cardshow_style_dna');
    if (stored) {
      try {
        this.styleDNA = JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to parse style DNA from storage');
      }
    }
  }

  private saveStyleDNA(dna: StyleDNA) {
    this.styleDNA = dna;
    localStorage.setItem('cardshow_style_dna', JSON.stringify(dna));
  }

  // Learn from user choices
  public learnFromChoice(choice: {
    type: 'color' | 'layout' | 'effect' | 'category';
    value: string;
    complexity?: 'simple' | 'moderate' | 'complex';
  }) {
    const currentDNA = this.styleDNA || this.getDefaultStyleDNA();
    
    switch (choice.type) {
      case 'color':
        this.updatePreference(currentDNA.colorPreferences, choice.value);
        break;
      case 'layout':
        this.updatePreference(currentDNA.layoutPreferences, choice.value);
        break;
      case 'effect':
        this.updatePreference(currentDNA.effectPreferences, choice.value);
        break;
      case 'category':
        this.updatePreference(currentDNA.categoryPreferences, choice.value);
        break;
    }

    if (choice.complexity) {
      currentDNA.complexity = choice.complexity;
    }

    currentDNA.timestamp = Date.now();
    this.saveStyleDNA(currentDNA);
  }

  private updatePreference(preferences: string[], value: string) {
    const index = preferences.indexOf(value);
    if (index > -1) {
      // Move to front to increase preference weight
      preferences.splice(index, 1);
      preferences.unshift(value);
    } else {
      // Add new preference at front
      preferences.unshift(value);
      // Keep only top 10 preferences
      if (preferences.length > 10) {
        preferences.splice(10);
      }
    }
  }

  private getDefaultStyleDNA(): StyleDNA {
    return {
      colorPreferences: [],
      layoutPreferences: [],
      effectPreferences: [],
      categoryPreferences: [],
      complexity: 'moderate',
      timestamp: Date.now()
    };
  }

  // Adapt templates to uploaded image
  public async adaptTemplateToImage(
    template: any,
    imageData: {
      dominantColors: string[];
      brightness: number;
      contrast: number;
      composition: 'portrait' | 'landscape' | 'square';
      subject: string;
    }
  ): Promise<any> {
    const adaptedTemplate = { ...template };

    // Adapt colors based on image
    if (imageData.dominantColors.length > 0) {
      adaptedTemplate.colorScheme = this.generateHarmoniousColors(imageData.dominantColors);
    }

    // Adjust layout based on composition
    if (imageData.composition === 'portrait') {
      adaptedTemplate.layout = 'vertical-focus';
    } else if (imageData.composition === 'landscape') {
      adaptedTemplate.layout = 'horizontal-focus';
    }

    // Adapt effects based on brightness/contrast
    if (imageData.brightness < 0.3) {
      adaptedTemplate.effects = ['brighten', 'enhance-contrast'];
    } else if (imageData.brightness > 0.8) {
      adaptedTemplate.effects = ['subtle-shadow', 'depth'];
    }

    return adaptedTemplate;
  }

  private generateHarmoniousColors(dominantColors: string[]): string[] {
    // Generate complementary and analogous colors
    const harmonious = [...dominantColors];
    
    dominantColors.forEach(color => {
      // Add complementary color (simplified HSL manipulation)
      const hsl = this.hexToHsl(color);
      if (hsl) {
        const complementary = this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l);
        const analogous1 = this.hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l);
        const analogous2 = this.hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l);
        
        harmonious.push(complementary, analogous1, analogous2);
      }
    });

    return harmonious.slice(0, 8); // Return max 8 colors
  }

  private hexToHsl(hex: string): { h: number; s: number; l: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;

    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  private hslToHex(h: number, s: number, l: number): string {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = hue2rgb(p, q, h + 1/3);
    const g = hue2rgb(p, q, h);
    const b = hue2rgb(p, q, h - 1/3);

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  // Get personalized template recommendations
  public getPersonalizedTemplates(availableTemplates: any[]): any[] {
    if (!this.styleDNA) return availableTemplates.slice(0, 6);

    const scored = availableTemplates.map(template => ({
      template,
      score: this.calculateTemplateScore(template)
    }));

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(item => item.template);
  }

  private calculateTemplateScore(template: any): number {
    let score = 0;
    const dna = this.styleDNA!;

    // Score based on color preferences
    if (template.colors) {
      template.colors.forEach((color: string, index: number) => {
        const prefIndex = dna.colorPreferences.indexOf(color);
        if (prefIndex > -1) {
          score += (10 - prefIndex) * (5 - index);
        }
      });
    }

    // Score based on category preferences
    if (template.category) {
      const prefIndex = dna.categoryPreferences.indexOf(template.category);
      if (prefIndex > -1) {
        score += (10 - prefIndex) * 20;
      }
    }

    // Score based on complexity match
    const templateComplexity = this.assessTemplateComplexity(template);
    if (templateComplexity === dna.complexity) {
      score += 30;
    }

    return score;
  }

  private assessTemplateComplexity(template: any): 'simple' | 'moderate' | 'complex' {
    let complexity = 0;
    
    if (template.effects?.length > 3) complexity++;
    if (template.layers?.length > 5) complexity++;
    if (template.animations?.length > 2) complexity++;
    if (template.gradients?.length > 1) complexity++;

    if (complexity <= 1) return 'simple';
    if (complexity <= 3) return 'moderate';
    return 'complex';
  }

  // Get themed template sets
  public getThemedSets(): ThemedSet[] {
    return [
      {
        id: 'nostalgia_90s',
        name: '90s Nostalgia Pack',
        description: 'Radical designs from the neon decade',
        templates: ['neon-grid', 'vhs-glitch', 'retro-arcade', 'synthwave'],
        preview: '/themed-sets/90s-preview.jpg',
        theme: {
          era: '1990s',
          style: 'retro-futuristic',
          colors: ['#ff00ff', '#00ffff', '#ffff00', '#ff6b35'],
          effects: ['neon-glow', 'scanlines', 'chromatic-aberration']
        }
      },
      {
        id: 'minimalist_zen',
        name: 'Minimalist Zen',
        description: 'Clean, peaceful, and focused',
        templates: ['clean-slate', 'zen-garden', 'paper-fold', 'negative-space'],
        preview: '/themed-sets/zen-preview.jpg',
        theme: {
          style: 'minimalist',
          colors: ['#ffffff', '#f5f5f5', '#e8e8e8', '#333333'],
          effects: ['subtle-shadow', 'soft-gradient', 'clean-lines']
        }
      },
      {
        id: 'cyberpunk_neon',
        name: 'Cyberpunk Neon',
        description: 'High-tech, low-life aesthetics',
        templates: ['cyber-grid', 'neon-city', 'matrix-code', 'hologram'],
        preview: '/themed-sets/cyberpunk-preview.jpg',
        theme: {
          era: 'future',
          style: 'cyberpunk',
          colors: ['#00ff41', '#ff073a', '#0ff0fc', '#ff9500'],
          effects: ['neon-glow', 'digital-glitch', 'holographic']
        }
      }
    ];
  }

  // Get community templates
  public async getCommunityTemplates(): Promise<CommunityTemplate[]> {
    // In a real app, this would fetch from an API
    return [
      {
        id: 'community_1',
        name: 'Golden Hour Portrait',
        creator: 'PhotoMaster',
        creatorAvatar: '/avatars/photomaster.jpg',
        downloads: 2543,
        rating: 4.8,
        tags: ['portrait', 'golden-hour', 'warm', 'professional'],
        thumbnail: '/community/golden-hour.jpg',
        adaptable: true,
        styleElements: {
          colors: ['#f4a261', '#e76f51', '#264653'],
          fonts: ['Playfair Display', 'Source Sans Pro'],
          effects: ['warm-glow', 'soft-vignette']
        }
      },
      {
        id: 'community_2',
        name: 'Cosmic Adventure',
        creator: 'StarGazer',
        creatorAvatar: '/avatars/stargazer.jpg',
        downloads: 1832,
        rating: 4.9,
        tags: ['space', 'cosmic', 'adventure', 'fantasy'],
        thumbnail: '/community/cosmic.jpg',
        adaptable: true,
        styleElements: {
          colors: ['#1a0033', '#6a0dad', '#ff6b9d', '#c7ecee'],
          fonts: ['Orbitron', 'Space Mono'],
          effects: ['star-field', 'nebula-glow', 'cosmic-dust']
        }
      }
    ];
  }
}

export const smartTemplateService = new SmartTemplateService();
