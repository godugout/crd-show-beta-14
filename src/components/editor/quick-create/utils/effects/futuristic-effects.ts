// Futuristic style effects with holographic patterns and neon glows

interface FuturisticEffectParams {
  intensity: number;
  holographicShift: number;
  neonColor: string;
  scanlineFrequency: number;
  glitchIntensity: number;
}

interface FuturisticEffect {
  type: 'futuristic';
  params: FuturisticEffectParams;
  animationFrame: number;
  lastUpdate: number;
  render: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => void;
  cleanup: () => void;
}

class FuturisticEffects {
  createEffect(params: FuturisticEffectParams): FuturisticEffect {
    return {
      type: 'futuristic',
      params,
      animationFrame: 0,
      lastUpdate: Date.now(),
      render: this.createRenderFunction(params),
      cleanup: () => {
        // Cleanup any resources
      }
    };
  }

  updateEffect(effect: FuturisticEffect, newParams: Partial<FuturisticEffectParams>): FuturisticEffect {
    const updatedParams = { ...effect.params, ...newParams };
    effect.params = updatedParams;
    effect.render = this.createRenderFunction(updatedParams);
    return effect;
  }

  destroyEffect(effect: FuturisticEffect): void {
    effect.cleanup();
  }

  private createRenderFunction(params: FuturisticEffectParams) {
    return (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      const width = canvas.width;
      const height = canvas.height;
      const time = Date.now() * 0.001;
      
      // Dark futuristic background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);
      
      // Neon grid pattern
      this.renderNeonGrid(ctx, width, height, params, time);
      
      // Holographic color shift effect
      if (params.holographicShift > 0) {
        this.renderHolographicShift(ctx, width, height, params, time);
      }
      
      // Scanlines
      this.renderScanlines(ctx, width, height, params, time);
      
      // Digital glitch effects
      if (params.glitchIntensity > 0) {
        this.renderGlitchEffect(ctx, width, height, params, time);
      }
      
      // Neon border glow
      this.renderNeonBorder(ctx, width, height, params, time);
      
      // Data stream effect
      this.renderDataStream(ctx, width, height, params, time);
    };
  }

  private renderNeonGrid(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    params: FuturisticEffectParams,
    time: number
  ) {
    const gridSize = 25;
    const opacity = 0.2 + Math.sin(time * 2) * 0.1;
    
    ctx.strokeStyle = `${params.neonColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x < width; x += gridSize) {
      const offset = Math.sin(time + x * 0.01) * 2;
      ctx.beginPath();
      ctx.moveTo(x + offset, 0);
      ctx.lineTo(x + offset, height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y < height; y += gridSize) {
      const offset = Math.cos(time + y * 0.01) * 2;
      ctx.beginPath();
      ctx.moveTo(0, y + offset);
      ctx.lineTo(width, y + offset);
      ctx.stroke();
    }
  }

  private renderHolographicShift(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    params: FuturisticEffectParams,
    time: number
  ) {
    const shiftAmount = params.holographicShift * Math.sin(time * 3) * 5;
    
    // Create chromatic aberration effect
    ctx.globalCompositeOperation = 'screen';
    
    // Red channel shift
    ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
    ctx.fillRect(shiftAmount, 0, width, height);
    
    // Green channel
    ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    // Blue channel shift
    ctx.fillStyle = 'rgba(0, 0, 255, 0.1)';
    ctx.fillRect(-shiftAmount, 0, width, height);
    
    ctx.globalCompositeOperation = 'source-over';
  }

  private renderScanlines(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    params: FuturisticEffectParams,
    time: number
  ) {
    const lineHeight = 4;
    const speed = time * 100;
    
    for (let y = 0; y < height; y += lineHeight) {
      const opacity = 0.05 + Math.sin((y + speed) * params.scanlineFrequency) * 0.03;
      ctx.fillStyle = `rgba(0, 255, 255, ${opacity})`;
      ctx.fillRect(0, y, width, 1);
    }
  }

  private renderGlitchEffect(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    params: FuturisticEffectParams,
    time: number
  ) {
    if (Math.random() > 0.95) { // Random glitch trigger
      const glitchHeight = height * 0.1;
      const glitchY = Math.random() * (height - glitchHeight);
      const offset = (Math.random() - 0.5) * 20 * params.glitchIntensity;
      
      // Digital noise pattern
      ctx.fillStyle = `rgba(255, 0, 255, ${params.glitchIntensity * 0.3})`;
      ctx.fillRect(offset, glitchY, width, glitchHeight);
      
      // Horizontal lines
      for (let i = 0; i < 5; i++) {
        const lineY = glitchY + (i * glitchHeight / 5);
        const lineOffset = (Math.random() - 0.5) * 40 * params.glitchIntensity;
        
        ctx.fillStyle = `rgba(0, 255, 255, ${params.glitchIntensity * 0.5})`;
        ctx.fillRect(lineOffset, lineY, width, 2);
      }
    }
  }

  private renderNeonBorder(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    params: FuturisticEffectParams,
    time: number
  ) {
    const glowIntensity = 0.5 + Math.sin(time * 4) * 0.3;
    const borderOffset = 5;
    
    // Outer glow
    ctx.shadowColor = params.neonColor;
    ctx.shadowBlur = 20 * glowIntensity;
    ctx.strokeStyle = params.neonColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(borderOffset, borderOffset, width - borderOffset * 2, height - borderOffset * 2);
    
    // Inner border
    ctx.shadowBlur = 10 * glowIntensity;
    ctx.lineWidth = 1;
    ctx.strokeRect(borderOffset + 3, borderOffset + 3, width - (borderOffset + 3) * 2, height - (borderOffset + 3) * 2);
    
    // Reset shadow
    ctx.shadowBlur = 0;
  }

  private renderDataStream(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    params: FuturisticEffectParams,
    time: number
  ) {
    const streamCount = 3;
    const streamWidth = 2;
    
    for (let i = 0; i < streamCount; i++) {
      const x = (width / streamCount) * i + width / (streamCount * 2);
      const streamHeight = 50 + Math.sin(time * 2 + i) * 20;
      const y = ((time * 100 + i * 50) % (height + streamHeight)) - streamHeight;
      
      // Create stream gradient
      const streamGradient = ctx.createLinearGradient(0, y, 0, y + streamHeight);
      streamGradient.addColorStop(0, 'transparent');
      streamGradient.addColorStop(0.3, `${params.neonColor}80`);
      streamGradient.addColorStop(0.7, params.neonColor);
      streamGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = streamGradient;
      ctx.fillRect(x - streamWidth / 2, y, streamWidth, streamHeight);
      
      // Add binary digits
      if (Math.random() > 0.8) {
        ctx.fillStyle = params.neonColor;
        ctx.font = '8px monospace';
        ctx.fillText(
          Math.random() > 0.5 ? '1' : '0',
          x - 4,
          y + streamHeight / 2
        );
      }
    }
  }
}

const futuristicEffects = new FuturisticEffects();
export default futuristicEffects;