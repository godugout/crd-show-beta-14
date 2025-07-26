// Basic fallback effects for low-performance devices

interface BasicEffectParams {
  intensity: number;
  color: string;
  borderWidth: number;
  gradientStrength: number;
}

interface BasicEffect {
  type: 'basic';
  params: BasicEffectParams;
  render: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => void;
  cleanup: () => void;
}

class BasicEffects {
  createEffect(params: BasicEffectParams): BasicEffect {
    return {
      type: 'basic',
      params,
      render: this.createRenderFunction(params),
      cleanup: () => {
        // Cleanup any resources
      }
    };
  }

  updateEffect(effect: BasicEffect, newParams: Partial<BasicEffectParams>): BasicEffect {
    const updatedParams = { ...effect.params, ...newParams };
    effect.params = updatedParams;
    effect.render = this.createRenderFunction(updatedParams);
    return effect;
  }

  destroyEffect(effect: BasicEffect): void {
    effect.cleanup();
  }

  private createRenderFunction(params: BasicEffectParams) {
    return (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      const width = canvas.width;
      const height = canvas.height;
      
      // Simple gradient background
      if (params.gradientStrength > 0) {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.5, '#f8f9fa');
        gradient.addColorStop(1, '#e9ecef');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      } else {
        // Solid background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }
      
      // Simple border
      if (params.borderWidth > 0) {
        ctx.strokeStyle = params.color;
        ctx.lineWidth = params.borderWidth;
        ctx.strokeRect(
          params.borderWidth / 2,
          params.borderWidth / 2,
          width - params.borderWidth,
          height - params.borderWidth
        );
      }
      
      // Subtle inner highlight for depth
      if (params.intensity > 0.5) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(
          params.borderWidth + 1,
          params.borderWidth + 1,
          width - (params.borderWidth + 1) * 2,
          height - (params.borderWidth + 1) * 2
        );
      }
      
      // Optional corner decorations
      if (params.intensity > 0.7) {
        this.renderSimpleCorners(ctx, width, height, params);
      }
    };
  }

  private renderSimpleCorners(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    params: BasicEffectParams
  ) {
    const cornerSize = 8;
    const margin = params.borderWidth + 4;
    
    ctx.fillStyle = params.color;
    
    // Top-left corner
    ctx.fillRect(margin, margin, cornerSize, 2);
    ctx.fillRect(margin, margin, 2, cornerSize);
    
    // Top-right corner
    ctx.fillRect(width - margin - cornerSize, margin, cornerSize, 2);
    ctx.fillRect(width - margin - 2, margin, 2, cornerSize);
    
    // Bottom-left corner
    ctx.fillRect(margin, height - margin - 2, cornerSize, 2);
    ctx.fillRect(margin, height - margin - cornerSize, 2, cornerSize);
    
    // Bottom-right corner
    ctx.fillRect(width - margin - cornerSize, height - margin - 2, cornerSize, 2);
    ctx.fillRect(width - margin - 2, height - margin - cornerSize, 2, cornerSize);
  }
}

const basicEffects = new BasicEffects();
export default basicEffects;