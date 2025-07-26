// Lazy loading system for complex style effects

interface EffectModule {
  createEffect: (params: any) => any;
  updateEffect: (effect: any, params: any) => any;
  destroyEffect: (effect: any) => void;
}

interface LoadedEffect {
  module: EffectModule;
  loadTime: number;
  size: number;
}

class EffectLoader {
  private loadedEffects = new Map<string, LoadedEffect>();
  private loadingPromises = new Map<string, Promise<EffectModule>>();
  private preloadQueue: string[] = [];

  // Dynamically import effect modules based on style
  async loadStyleEffects(styleId: string): Promise<EffectModule> {
    // Return cached module if available
    const cached = this.loadedEffects.get(styleId);
    if (cached) {
      return cached.module;
    }

    // Return existing loading promise if in progress
    const loadingPromise = this.loadingPromises.get(styleId);
    if (loadingPromise) {
      return loadingPromise;
    }

    // Create new loading promise
    const promise = this.importEffectModule(styleId);
    this.loadingPromises.set(styleId, promise);

    try {
      const module = await promise;
      
      // Cache the loaded module
      this.loadedEffects.set(styleId, {
        module,
        loadTime: Date.now(),
        size: this.estimateModuleSize(styleId)
      });

      this.loadingPromises.delete(styleId);
      return module;
    } catch (error) {
      this.loadingPromises.delete(styleId);
      console.error(`Failed to load effects for style ${styleId}:`, error);
      
      // Return fallback module
      return this.getFallbackModule();
    }
  }

  private async importEffectModule(styleId: string): Promise<EffectModule> {
    const startTime = performance.now();
    
    switch (styleId) {
      case 'epic':
        const epicModule = await import('./effects/epic-effects');
        console.log(`Epic effects loaded in ${performance.now() - startTime}ms`);
        return epicModule.default;
        
      case 'classic':
        const classicModule = await import('./effects/classic-effects');
        console.log(`Classic effects loaded in ${performance.now() - startTime}ms`);
        return classicModule.default;
        
      case 'futuristic':
        const futuristicModule = await import('./effects/futuristic-effects');
        console.log(`Futuristic effects loaded in ${performance.now() - startTime}ms`);
        return futuristicModule.default;
        
      default:
        const basicModule = await import('./effects/basic-effects');
        console.log(`Basic effects loaded in ${performance.now() - startTime}ms`);
        return basicModule.default;
    }
  }

  private getFallbackModule(): EffectModule {
    return {
      createEffect: (params: any) => ({
        type: 'fallback',
        params,
        render: () => {}
      }),
      updateEffect: (effect: any, params: any) => {
        effect.params = { ...effect.params, ...params };
        return effect;
      },
      destroyEffect: (effect: any) => {
        // Cleanup any resources
        if (effect.cleanup) {
          effect.cleanup();
        }
      }
    };
  }

  private estimateModuleSize(styleId: string): number {
    // Rough estimates for bundle size impact
    const sizeEstimates = {
      'epic': 15000, // 15KB
      'classic': 8000, // 8KB
      'futuristic': 20000, // 20KB
      'basic': 5000 // 5KB
    };
    
    return sizeEstimates[styleId as keyof typeof sizeEstimates] || 5000;
  }

  // Preload effects that are likely to be used
  async preloadEffects(styleIds: string[]): Promise<void> {
    this.preloadQueue = [...styleIds];
    
    // Load effects with a slight delay to avoid blocking main thread
    for (const styleId of styleIds) {
      if (!this.loadedEffects.has(styleId) && !this.loadingPromises.has(styleId)) {
        setTimeout(() => {
          this.loadStyleEffects(styleId).catch(console.error);
        }, 100);
      }
    }
  }

  // Preload the most commonly used effects
  async preloadPopularEffects(): Promise<void> {
    const popularEffects = ['epic', 'classic']; // Based on usage analytics
    return this.preloadEffects(popularEffects);
  }

  // Memory management - unload unused effects
  cleanupUnusedEffects(maxAge: number = 5 * 60 * 1000): void {
    const now = Date.now();
    
    for (const [styleId, effect] of this.loadedEffects.entries()) {
      if (now - effect.loadTime > maxAge && !this.preloadQueue.includes(styleId)) {
        this.loadedEffects.delete(styleId);
        console.log(`Unloaded unused effect: ${styleId}`);
      }
    }
  }

  // Get loading statistics
  getLoadingStats() {
    return {
      loadedCount: this.loadedEffects.size,
      loadingCount: this.loadingPromises.size,
      totalSize: Array.from(this.loadedEffects.values())
        .reduce((sum, effect) => sum + effect.size, 0),
      effects: Array.from(this.loadedEffects.entries()).map(([id, effect]) => ({
        id,
        loadTime: effect.loadTime,
        size: effect.size,
        age: Date.now() - effect.loadTime
      }))
    };
  }

  // Check if effect is already loaded
  isEffectLoaded(styleId: string): boolean {
    return this.loadedEffects.has(styleId);
  }

  // Get all loaded effect IDs
  getLoadedEffectIds(): string[] {
    return Array.from(this.loadedEffects.keys());
  }
}

export const effectLoader = new EffectLoader();