import { useState, useCallback, useEffect } from 'react';

interface UseFirstMaterialSelectionReturn {
  hasSelectedFirstMaterial: boolean;
  shouldShowBoxGlow: boolean;
  onMaterialSelect: (styleId: string) => void;
  resetSelection: () => void;
}

export const useFirstMaterialSelection = (): UseFirstMaterialSelectionReturn => {
  const [hasSelectedFirstMaterial, setHasSelectedFirstMaterial] = useState(false);
  const [initialStyleId, setInitialStyleId] = useState<string | null>(null);
  const [showGlow, setShowGlow] = useState(false);

  // Track if this is the first material selection
  const onMaterialSelect = useCallback((styleId: string) => {
    if (!initialStyleId) {
      setInitialStyleId(styleId);
      return; // This is just the initial load, not a user selection
    }

    if (!hasSelectedFirstMaterial && styleId !== initialStyleId) {
      console.log('🎨 First material selection detected:', styleId);
      setHasSelectedFirstMaterial(true);
      setShowGlow(true);
      
      // Show glow for 3 seconds then fade
      setTimeout(() => {
        setShowGlow(false);
      }, 3000);
    }
  }, [hasSelectedFirstMaterial, initialStyleId]);

  const resetSelection = useCallback(() => {
    setHasSelectedFirstMaterial(false);
    setInitialStyleId(null);
    setShowGlow(false);
  }, []);

  // Initialize with first style ID on mount
  useEffect(() => {
    if (!initialStyleId) {
      // Default matte style as initial
      setInitialStyleId('matte');
    }
  }, [initialStyleId]);

  return {
    hasSelectedFirstMaterial,
    shouldShowBoxGlow: showGlow,
    onMaterialSelect,
    resetSelection
  };
};