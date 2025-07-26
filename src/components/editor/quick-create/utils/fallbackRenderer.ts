import type { PerformanceLevel } from '../hooks/useAdaptiveStylePerformance';

interface FallbackOptions {
  width: number;
  height: number;
  styleId: string;
  performanceLevel: PerformanceLevel;
}

export class FallbackRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  // CSS-only fallback for when WebGL is not available
  generateCSSFallback(styleId: string): string {
    switch (styleId) {
      case 'epic':
        return `
          .fallback-epic {
            background: linear-gradient(135deg, #ff6b00, #ff0000);
            box-shadow: 
              0 0 20px rgba(255, 107, 0, 0.3),
              inset 0 0 20px rgba(255, 255, 255, 0.1);
            border: 2px solid #ff6b00;
            animation: epic-pulse 2s ease-in-out infinite alternate;
          }
          
          @keyframes epic-pulse {
            from { 
              box-shadow: 0 0 20px rgba(255, 107, 0, 0.3);
              transform: scale(1);
            }
            to { 
              box-shadow: 0 0 30px rgba(255, 107, 0, 0.6);
              transform: scale(1.02);
            }
          }
        `;

      case 'classic':
        return `
          .fallback-classic {
            background: linear-gradient(145deg, #f4f1e8, #e8e3d3);
            border: 3px solid #2c3e50;
            border-radius: 8px;
            box-shadow: 
              inset 0 2px 4px rgba(255, 255, 255, 0.5),
              0 4px 8px rgba(0, 0, 0, 0.2);
            position: relative;
          }
          
          .fallback-classic::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1), transparent 50%);
            border-radius: inherit;
          }
        `;

      case 'futuristic':
        return `
          .fallback-futuristic {
            background: linear-gradient(135deg, #0a0a0a, #1a1a2e);
            border: 1px solid #00ffff;
            box-shadow: 
              0 0 20px rgba(0, 255, 255, 0.3),
              inset 0 0 20px rgba(255, 0, 255, 0.1);
            position: relative;
            overflow: hidden;
          }
          
          .fallback-futuristic::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.1), transparent);
            animation: scan 2s linear infinite;
          }
          
          @keyframes scan {
            0% { left: -100%; }
            100% { left: 100%; }
          }
        `;

      default:
        return `
          .fallback-default {
            background: linear-gradient(145deg, #ffffff, #f0f0f0);
            border: 1px solid #e0e0e0;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
        `;
    }
  }

  // Generate static preview image for very low-end devices
  generateStaticPreview(options: FallbackOptions): Promise<string> {
    return new Promise((resolve) => {
      const { width, height, styleId } = options;
      
      this.canvas.width = width;
      this.canvas.height = height;

      // Clear canvas
      this.ctx.clearRect(0, 0, width, height);

      switch (styleId) {
        case 'epic':
          this.renderEpicPreview(width, height);
          break;
        case 'classic':
          this.renderClassicPreview(width, height);
          break;
        case 'futuristic':
          this.renderFuturisticPreview(width, height);
          break;
        default:
          this.renderDefaultPreview(width, height);
      }

      resolve(this.canvas.toDataURL('image/png'));
    });
  }

  private renderEpicPreview(width: number, height: number) {
    // Create epic gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#ff6b00');
    gradient.addColorStop(0.5, '#ff0000');
    gradient.addColorStop(1, '#ffaa00');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);

    // Add glow effect with multiple layers
    this.ctx.shadowColor = '#ff6b00';
    this.ctx.shadowBlur = 20;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.fillRect(width * 0.1, height * 0.1, width * 0.8, height * 0.8);

    // Add border
    this.ctx.strokeStyle = '#ff6b00';
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(5, 5, width - 10, height - 10);
  }

  private renderClassicPreview(width: number, height: number) {
    // Classic paper-like background
    const gradient = this.ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f4f1e8');
    gradient.addColorStop(1, '#e8e3d3');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);

    // Add subtle texture
    for (let i = 0; i < 100; i++) {
      this.ctx.fillStyle = `rgba(139, 126, 102, ${Math.random() * 0.05})`;
      this.ctx.fillRect(
        Math.random() * width,
        Math.random() * height,
        2, 2
      );
    }

    // Classic border
    this.ctx.strokeStyle = '#2c3e50';
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(8, 8, width - 16, height - 16);

    // Inner highlight
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(10, 10, width - 20, height - 20);
  }

  private renderFuturisticPreview(width: number, height: number) {
    // Dark futuristic background
    this.ctx.fillStyle = '#0a0a0a';
    this.ctx.fillRect(0, 0, width, height);

    // Neon grid pattern
    this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
    this.ctx.lineWidth = 1;

    const gridSize = 20;
    for (let x = 0; x < width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();
    }

    for (let y = 0; y < height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }

    // Glowing border
    this.ctx.shadowColor = '#00ffff';
    this.ctx.shadowBlur = 15;
    this.ctx.strokeStyle = '#00ffff';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(3, 3, width - 6, height - 6);

    // Add scanline effect
    for (let y = 0; y < height; y += 4) {
      this.ctx.fillStyle = `rgba(0, 255, 255, ${0.05 + Math.sin(y * 0.1) * 0.02})`;
      this.ctx.fillRect(0, y, width, 1);
    }
  }

  private renderDefaultPreview(width: number, height: number) {
    // Simple clean design
    const gradient = this.ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#f0f0f0');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);

    // Simple border
    this.ctx.strokeStyle = '#e0e0e0';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(0, 0, width, height);
  }

  // Graceful degradation of effects based on device capabilities
  degradeEffectsGracefully(
    originalEffect: any, 
    performanceLevel: PerformanceLevel,
    deviceCapabilities: {
      webgl: boolean;
      mobile: boolean;
      memory: number;
      reducedMotion: boolean;
    }
  ) {
    if (!deviceCapabilities.webgl) {
      // No WebGL - return CSS-only version
      return {
        type: 'css',
        styles: this.generateCSSFallback(originalEffect.styleId)
      };
    }

    if (deviceCapabilities.reducedMotion) {
      // Reduce or eliminate animations
      return {
        ...originalEffect,
        animations: {
          ...originalEffect.animations,
          enabled: false
        },
        particles: {
          ...originalEffect.particles,
          enabled: false
        }
      };
    }

    if (performanceLevel === 'low') {
      // Minimal effects for low-end devices
      return {
        type: 'minimal',
        effect: {
          ...originalEffect,
          particles: { enabled: false },
          postProcessing: {
            bloom: 0.1,
            contrast: 1.0,
            saturation: 1.0
          }
        }
      };
    }

    return originalEffect;
  }
}

export const fallbackRenderer = new FallbackRenderer();