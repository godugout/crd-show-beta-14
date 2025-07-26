interface ExportOptions {
  format: 'png' | 'jpg' | 'svg' | 'pdf' | 'webp' | 'ar' | 'social';
  quality: number;
  dimensions: { width: number; height: number };
  dpi?: number;
  transparent?: boolean;
  includeMetadata?: boolean;
  socialPlatform?: 'instagram' | 'twitter' | 'facebook' | 'tiktok' | 'linkedin';
  arFeatures?: {
    animation: boolean;
    interaction: boolean;
    lighting: boolean;
  };
}

interface SocialPreset {
  platform: string;
  name: string;
  dimensions: { width: number; height: number };
  aspectRatio: string;
  description: string;
}

interface ARExportData {
  model: string; // GLB format
  textures: string[];
  animations?: string[];
  metadata: {
    title: string;
    creator: string;
    description: string;
    interactionPoints: Array<{
      position: [number, number, number];
      action: string;
      data: any;
    }>;
  };
}

export class EnhancedExportService {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  public async exportCard(
    cardElement: HTMLElement,
    options: ExportOptions
  ): Promise<{ data: string | Blob; metadata?: any }> {
    
    switch (options.format) {
      case 'ar':
        return this.exportAsAR(cardElement, options);
      case 'social':
        return this.exportForSocial(cardElement, options);
      case 'pdf':
        return this.exportAsPDF(cardElement, options);
      default:
        return this.exportAsImage(cardElement, options);
    }
  }

  private async exportAsImage(
    element: HTMLElement,
    options: ExportOptions
  ): Promise<{ data: string; metadata?: any }> {
    const { width, height } = options.dimensions;
    
    // Set canvas dimensions
    this.canvas.width = width;
    this.canvas.height = height;

    // Apply DPI scaling if specified
    if (options.dpi && options.dpi > 96) {
      const scale = options.dpi / 96;
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;
      this.canvas.width = width * scale;
      this.canvas.height = height * scale;
      this.ctx.scale(scale, scale);
    }

    // Use html2canvas for rendering
    const html2canvas = await import('html2canvas');
    const canvas = await html2canvas.default(element, {
      canvas: this.canvas,
      width: width,
      height: height,
      scale: 1,
      backgroundColor: options.transparent ? null : '#ffffff',
      useCORS: true,
      allowTaint: true
    });

    // Convert to desired format
    const mimeType = this.getMimeType(options.format);
    const dataUrl = canvas.toDataURL(mimeType, options.quality / 100);

    const metadata = options.includeMetadata ? {
      format: options.format,
      dimensions: options.dimensions,
      quality: options.quality,
      dpi: options.dpi,
      createdAt: new Date().toISOString(),
      creator: 'Cardshow App'
    } : undefined;

    return { data: dataUrl, metadata };
  }

  private async exportForSocial(
    element: HTMLElement,
    options: ExportOptions
  ): Promise<{ data: string; metadata?: any }> {
    const presets = this.getSocialPresets();
    const preset = presets.find(p => p.platform === options.socialPlatform);
    
    if (!preset) {
      throw new Error(`Unsupported social platform: ${options.socialPlatform}`);
    }

    // Create optimized version for social platform
    const socialOptions: ExportOptions = {
      ...options,
      dimensions: preset.dimensions,
      format: 'jpg', // Most social platforms prefer JPG
      quality: 85, // Optimize for web
      transparent: false
    };

    const result = await this.exportAsImage(element, socialOptions);
    
    return {
      ...result,
      metadata: {
        ...result.metadata,
        socialPlatform: options.socialPlatform,
        preset: preset.name,
        aspectRatio: preset.aspectRatio,
        optimizedFor: 'social-sharing'
      }
    };
  }

  private async exportAsPDF(
    element: HTMLElement,
    options: ExportOptions
  ): Promise<{ data: Blob; metadata?: any }> {
    // First render as high-quality image
    const imageOptions: ExportOptions = {
      ...options,
      format: 'png',
      quality: 100,
      dpi: 300 // High DPI for print
    };

    const imageResult = await this.exportAsImage(element, imageOptions);
    
    // Create PDF blob directly from image data
    const canvas = document.createElement('canvas');
    canvas.width = options.dimensions.width;
    canvas.height = options.dimensions.height;
    const ctx = canvas.getContext('2d')!;
    
    const img = new Image();
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = imageResult.data;
    });
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const pdfBlob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/png');
    });
    
    return {
      data: pdfBlob,
      metadata: {
        format: 'pdf',
        dimensions: options.dimensions,
        dpi: 300,
        pages: 1,
        createdAt: new Date().toISOString()
      }
    };
  }

  private async exportAsAR(
    element: HTMLElement,
    options: ExportOptions
  ): Promise<{ data: Blob; metadata: ARExportData }> {
    // This would integrate with a 3D rendering engine to create AR content
    // For now, we'll create a placeholder AR export
    
    const imageResult = await this.exportAsImage(element, {
      ...options,
      format: 'png',
      quality: 100,
      transparent: true
    });

    // Create AR-ready metadata
    const arData: ARExportData = {
      model: '', // Would contain GLB model data
      textures: [imageResult.data],
      animations: options.arFeatures?.animation ? ['rotate', 'pulse'] : undefined,
      metadata: {
        title: 'Cardshow AR Card',
        creator: 'Cardshow User',
        description: 'Interactive AR card created with Cardshow',
        interactionPoints: options.arFeatures?.interaction ? [
          {
            position: [0, 0, 0.1],
            action: 'flip',
            data: { animation: 'flip-card' }
          }
        ] : []
      }
    };

    // Create a zip file with AR assets
    const zip = await this.createARPackage(arData);
    
    return {
      data: zip,
      metadata: arData
    };
  }

  private async createARPackage(arData: ARExportData): Promise<Blob> {
    // This would create a proper AR package (like .usdz for iOS or .glb for web AR)
    // For now, return a JSON representation
    const json = JSON.stringify(arData, null, 2);
    return new Blob([json], { type: 'application/json' });
  }

  private getMimeType(format: string): string {
    switch (format) {
      case 'jpg': return 'image/jpeg';
      case 'png': return 'image/png';
      case 'webp': return 'image/webp';
      case 'svg': return 'image/svg+xml';
      default: return 'image/png';
    }
  }

  public getSocialPresets(): SocialPreset[] {
    return [
      {
        platform: 'instagram',
        name: 'Instagram Post',
        dimensions: { width: 1080, height: 1080 },
        aspectRatio: '1:1',
        description: 'Square format for Instagram feed'
      },
      {
        platform: 'instagram',
        name: 'Instagram Story',
        dimensions: { width: 1080, height: 1920 },
        aspectRatio: '9:16',
        description: 'Vertical format for Instagram stories'
      },
      {
        platform: 'twitter',
        name: 'Twitter Post',
        dimensions: { width: 1200, height: 675 },
        aspectRatio: '16:9',
        description: 'Landscape format for Twitter'
      },
      {
        platform: 'facebook',
        name: 'Facebook Post',
        dimensions: { width: 1200, height: 630 },
        aspectRatio: '1.91:1',
        description: 'Recommended for Facebook sharing'
      },
      {
        platform: 'linkedin',
        name: 'LinkedIn Post',
        dimensions: { width: 1200, height: 627 },
        aspectRatio: '1.91:1',
        description: 'Professional format for LinkedIn'
      },
      {
        platform: 'tiktok',
        name: 'TikTok Video',
        dimensions: { width: 1080, height: 1920 },
        aspectRatio: '9:16',
        description: 'Vertical format for TikTok'
      }
    ];
  }

  public getPrintPresets() {
    return [
      {
        name: 'Trading Card',
        dimensions: { width: 252, height: 352 }, // 2.5" x 3.5" at 300 DPI
        dpi: 300,
        description: 'Standard trading card size'
      },
      {
        name: 'Postcard',
        dimensions: { width: 1500, height: 1050 }, // 5" x 3.5" at 300 DPI
        dpi: 300,
        description: 'Standard postcard size'
      },
      {
        name: 'Poster (Small)',
        dimensions: { width: 2550, height: 3300 }, // 8.5" x 11" at 300 DPI
        dpi: 300,
        description: 'Letter size poster'
      },
      {
        name: 'Poster (Large)',
        dimensions: { width: 5100, height: 6600 }, // 17" x 22" at 300 DPI
        dpi: 300,
        description: 'Large format poster'
      }
    ];
  }

  public async generateMultipleFormats(
    element: HTMLElement,
    baseOptions: Partial<ExportOptions> = {}
  ): Promise<{ [format: string]: { data: string | Blob; metadata?: any } }> {
    const formats = ['png', 'jpg', 'pdf'];
    const socialPlatforms = ['instagram', 'twitter', 'facebook'];
    const results: { [format: string]: { data: string | Blob; metadata?: any } } = {};

    // Generate standard formats
    for (const format of formats) {
      const options: ExportOptions = {
        format: format as any,
        quality: 90,
        dimensions: { width: 1080, height: 1080 },
        ...baseOptions
      };
      
      results[format] = await this.exportCard(element, options);
    }

    // Generate social media optimized versions
    for (const platform of socialPlatforms) {
      const options: ExportOptions = {
        format: 'social',
        quality: 85,
        dimensions: { width: 1080, height: 1080 }, // Will be overridden by preset
        socialPlatform: platform as any,
        ...baseOptions
      };
      
      results[`social_${platform}`] = await this.exportCard(element, options);
    }

    return results;
  }
}

export const enhancedExportService = new EnhancedExportService();