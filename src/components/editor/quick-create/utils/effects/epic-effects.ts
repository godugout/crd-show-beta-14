// Epic style effects with fire particles and dynamic lighting

interface EpicEffectParams {
  intensity: number;
  color: string;
  particleCount: number;
  animationSpeed: number;
}

interface EpicEffect {
  type: 'epic';
  params: EpicEffectParams;
  particles: Particle[];
  lastUpdate: number;
  render: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => void;
  cleanup: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

class EpicEffects {
  createEffect(params: EpicEffectParams): EpicEffect {
    const particles = this.generateParticles(params.particleCount);
    
    return {
      type: 'epic',
      params,
      particles,
      lastUpdate: Date.now(),
      render: this.createRenderFunction(params),
      cleanup: () => {
        // Cleanup any resources
        particles.length = 0;
      }
    };
  }

  updateEffect(effect: EpicEffect, newParams: Partial<EpicEffectParams>): EpicEffect {
    const updatedParams = { ...effect.params, ...newParams };
    
    // Adjust particle count if needed
    if (newParams.particleCount && newParams.particleCount !== effect.params.particleCount) {
      effect.particles = this.generateParticles(newParams.particleCount);
    }
    
    effect.params = updatedParams;
    effect.render = this.createRenderFunction(updatedParams);
    
    return effect;
  }

  destroyEffect(effect: EpicEffect): void {
    effect.cleanup();
  }

  private generateParticles(count: number): Particle[] {
    const particles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: Math.random(),
        maxLife: 1 + Math.random(),
        size: 2 + Math.random() * 4,
        color: this.getFireColor(Math.random())
      });
    }
    
    return particles;
  }

  private getFireColor(intensity: number): string {
    if (intensity > 0.8) return '#FFD700'; // Gold
    if (intensity > 0.6) return '#FF6B00'; // Orange
    if (intensity > 0.4) return '#FF0000'; // Red
    return '#FF4500'; // Red-orange
  }

  private createRenderFunction(params: EpicEffectParams) {
    return (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      const width = canvas.width;
      const height = canvas.height;
      
      // Create epic gradient background
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) / 2
      );
      gradient.addColorStop(0, `${params.color}40`); // 25% opacity
      gradient.addColorStop(0.7, `${params.color}20`); // 12% opacity
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Render glow effect
      ctx.shadowColor = params.color;
      ctx.shadowBlur = 20 * params.intensity;
      ctx.fillStyle = `${params.color}10`;
      ctx.fillRect(0, 0, width, height);
      
      // Reset shadow for particles
      ctx.shadowBlur = 0;
      
      // Render fire particles (if performance allows)
      if (params.particleCount > 0) {
        this.renderFireParticles(ctx, width, height, params);
      }
      
      // Epic border glow
      ctx.strokeStyle = params.color;
      ctx.lineWidth = 3;
      ctx.shadowColor = params.color;
      ctx.shadowBlur = 15;
      ctx.strokeRect(5, 5, width - 10, height - 10);
    };
  }

  private renderFireParticles(
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    params: EpicEffectParams
  ) {
    const time = Date.now() * 0.001 * params.animationSpeed;
    
    for (let i = 0; i < params.particleCount; i++) {
      const angle = (i / params.particleCount) * Math.PI * 2;
      const radius = 50 + Math.sin(time + i) * 20;
      
      const x = width / 2 + Math.cos(angle + time * 0.5) * radius;
      const y = height / 2 + Math.sin(angle + time * 0.5) * radius;
      
      const size = 3 + Math.sin(time * 2 + i) * 2;
      const alpha = 0.5 + Math.sin(time * 3 + i) * 0.3;
      
      ctx.globalAlpha = alpha;
      ctx.fillStyle = this.getFireColor(Math.sin(time + i) * 0.5 + 0.5);
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.globalAlpha = 1;
  }
}

const epicEffects = new EpicEffects();
export default epicEffects;