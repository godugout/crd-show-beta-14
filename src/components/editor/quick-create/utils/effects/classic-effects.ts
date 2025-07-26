// Classic style effects with vintage paper texture and elegant borders

interface ClassicEffectParams {
  intensity: number;
  paperTexture: boolean;
  sepiaTone: number;
  vignette: number;
}

interface ClassicEffect {
  type: 'classic';
  params: ClassicEffectParams;
  texturePattern: ImageData | null;
  lastUpdate: number;
  render: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => void;
  cleanup: () => void;
}

class ClassicEffects {
  createEffect(params: ClassicEffectParams): ClassicEffect {
    return {
      type: 'classic',
      params,
      texturePattern: null,
      lastUpdate: Date.now(),
      render: this.createRenderFunction(params),
      cleanup: () => {
        // Cleanup any resources
      }
    };
  }

  updateEffect(effect: ClassicEffect, newParams: Partial<ClassicEffectParams>): ClassicEffect {
    const updatedParams = { ...effect.params, ...newParams };
    effect.params = updatedParams;
    effect.render = this.createRenderFunction(updatedParams);
    return effect;
  }

  destroyEffect(effect: ClassicEffect): void {
    effect.cleanup();
  }

  private createRenderFunction(params: ClassicEffectParams) {
    return (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      const width = canvas.width;
      const height = canvas.height;
      
      // Classic paper background
      const paperGradient = ctx.createLinearGradient(0, 0, width, height);
      paperGradient.addColorStop(0, '#f4f1e8');
      paperGradient.addColorStop(0.5, '#e8e3d3');
      paperGradient.addColorStop(1, '#ddd8c7');
      
      ctx.fillStyle = paperGradient;
      ctx.fillRect(0, 0, width, height);
      
      // Paper texture
      if (params.paperTexture) {
        this.renderPaperTexture(ctx, width, height, params.intensity);
      }
      
      // Sepia tone overlay
      if (params.sepiaTone > 0) {
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = `rgba(139, 118, 78, ${params.sepiaTone * 0.3})`;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';
      }
      
      // Vignette effect
      if (params.vignette > 0) {
        this.renderVignette(ctx, width, height, params.vignette);
      }
      
      // Classic border
      this.renderClassicBorder(ctx, width, height, params.intensity);
      
      // Subtle inner glow
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(12, 12, width - 24, height - 24);
    };
  }

  private renderPaperTexture(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: number
  ) {
    const textureSize = 2;
    const textureOpacity = intensity * 0.05;
    
    ctx.fillStyle = `rgba(139, 126, 102, ${textureOpacity})`;
    
    for (let x = 0; x < width; x += textureSize * 2) {
      for (let y = 0; y < height; y += textureSize * 2) {
        if (Math.random() > 0.7) {
          ctx.fillRect(
            x + Math.random() * textureSize,
            y + Math.random() * textureSize,
            textureSize,
            textureSize
          );
        }
      }
    }
  }

  private renderVignette(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: number
  ) {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.max(width, height) * 0.8;
    
    const vignetteGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, maxRadius
    );
    
    vignetteGradient.addColorStop(0, 'transparent');
    vignetteGradient.addColorStop(0.7, 'transparent');
    vignetteGradient.addColorStop(1, `rgba(92, 77, 64, ${intensity * 0.4})`);
    
    ctx.fillStyle = vignetteGradient;
    ctx.fillRect(0, 0, width, height);
  }

  private renderClassicBorder(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: number
  ) {
    const borderWidth = 8 * intensity;
    
    // Outer border
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(
      borderWidth / 2,
      borderWidth / 2,
      width - borderWidth,
      height - borderWidth
    );
    
    // Inner decorative border
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      borderWidth + 2,
      borderWidth + 2,
      width - (borderWidth + 2) * 2,
      height - (borderWidth + 2) * 2
    );
    
    // Corner decorations
    this.renderCornerDecorations(ctx, width, height, borderWidth);
  }

  private renderCornerDecorations(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    borderWidth: number
  ) {
    const cornerSize = borderWidth * 1.5;
    const corners = [
      { x: borderWidth, y: borderWidth }, // Top-left
      { x: width - borderWidth, y: borderWidth }, // Top-right
      { x: borderWidth, y: height - borderWidth }, // Bottom-left
      { x: width - borderWidth, y: height - borderWidth } // Bottom-right
    ];
    
    ctx.fillStyle = '#2c3e50';
    
    corners.forEach(corner => {
      ctx.save();
      ctx.translate(corner.x, corner.y);
      
      // Simple corner decoration
      ctx.beginPath();
      ctx.moveTo(-cornerSize / 2, -2);
      ctx.lineTo(cornerSize / 2, -2);
      ctx.lineTo(cornerSize / 2, 2);
      ctx.lineTo(-cornerSize / 2, 2);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(-2, -cornerSize / 2);
      ctx.lineTo(2, -cornerSize / 2);
      ctx.lineTo(2, cornerSize / 2);
      ctx.lineTo(-2, cornerSize / 2);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    });
  }
}

const classicEffects = new ClassicEffects();
export default classicEffects;