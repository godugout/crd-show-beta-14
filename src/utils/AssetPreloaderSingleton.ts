
// Global singleton pattern for asset preloading
class AssetPreloaderManager {
  private static instance: AssetPreloaderManager;
  private isPreloading = false;
  private isComplete = false;
  private abortController: AbortController | null = null;
  private preloadedAssets = new Set<string>();

  private constructor() {}

  public static getInstance(): AssetPreloaderManager {
    if (!AssetPreloaderManager.instance) {
      AssetPreloaderManager.instance = new AssetPreloaderManager();
    }
    return AssetPreloaderManager.instance;
  }

  public isCurrentlyPreloading(): boolean {
    return this.isPreloading;
  }

  public isPreloadingComplete(): boolean {
    return this.isComplete;
  }

  public startPreloading(): void {
    this.isPreloading = true;
  }

  public completePreloading(): void {
    this.isPreloading = false;
    this.isComplete = true;
  }

  public stopAllPreloading(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.isPreloading = false;
  }

  public setAbortController(controller: AbortController): void {
    this.abortController = controller;
  }

  public addPreloadedAsset(asset: string): void {
    this.preloadedAssets.add(asset);
  }

  public hasAsset(asset: string): boolean {
    return this.preloadedAssets.has(asset);
  }

  public reset(): void {
    this.stopAllPreloading();
    this.isPreloading = false;
    this.isComplete = false;
    this.preloadedAssets.clear();
  }
}

export default AssetPreloaderManager;
