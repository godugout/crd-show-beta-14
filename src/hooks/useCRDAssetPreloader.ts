
import { useEffect, useState } from 'react';
import { useCRDEditor } from '@/contexts/CRDEditorContext';
import AssetPreloaderManager from '@/utils/AssetPreloaderSingleton';

// Only use placeholder images that actually exist
const CRITICAL_ASSETS = [
  // Use placeholder instead of non-existent assets
  '/placeholder.svg',
  '/placeholder.svg',
  '/placeholder.svg'
];

// Mock materials data in memory (no network requests)
const MOCK_MATERIALS = {
  holographic: {
    name: 'Holographic',
    type: 'special',
    effects: ['rainbow', 'shimmer'],
    intensity: 0.8
  },
  foil: {
    name: 'Foil',
    type: 'metallic', 
    effects: ['shine', 'reflection'],
    intensity: 0.6
  }
};

interface UseCRDAssetPreloaderOptions {
  enabled?: boolean;
}

export const useCRDAssetPreloader = (options: UseCRDAssetPreloaderOptions = {}) => {
  const { enabled = true } = options;
  const [loadedAssets, setLoadedAssets] = useState(0);
  const [totalAssets] = useState(CRITICAL_ASSETS.length);
  const [isComplete, setIsComplete] = useState(false);
  const { addPreloadedAsset } = useCRDEditor();
  const manager = AssetPreloaderManager.getInstance();

  useEffect(() => {
    console.log('🔄 CRD Asset preloader starting:', { enabled, isCompleteCheck: manager.isPreloadingComplete() });
    
    // If disabled or already complete, skip entirely
    if (!enabled || manager.isPreloadingComplete()) {
      console.log('✅ CRD Asset preloader: skipping (disabled or complete)');
      setIsComplete(true);
      setLoadedAssets(totalAssets);
      return;
    }

    // For simplicity, just complete immediately since we're only using placeholders
    const timer = setTimeout(() => {
      console.log('✅ CRD Asset preloader: completing immediately');
      setIsComplete(true);
      setLoadedAssets(totalAssets);
      manager.completePreloading();
    }, 500); // Small delay to show the loader briefly

    return () => clearTimeout(timer);
  }, [enabled, addPreloadedAsset, totalAssets, manager]);

  return {
    loadedAssets,
    totalAssets,
    isComplete,
    progress: Math.round((loadedAssets / totalAssets) * 100)
  };
};
