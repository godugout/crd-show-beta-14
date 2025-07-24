
import React, { useEffect, useRef, useState } from 'react';
import { CRDCardCreatorWrapper } from './CRDCardCreatorWrapper';
import { useCRDEditor } from '@/contexts/CRDEditorContext';
import { useCRDAssetPreloader } from '@/hooks/useCRDAssetPreloader';
import { CRDMKRLoader } from './CRDMKRLoader';
import type { CardData } from '@/hooks/useCardEditor';

interface PreloadedCRDEditorProps {
  onComplete: (cardData: CardData) => void;
  onCancel: () => void;
  isVisible?: boolean;
}

export const PreloadedCRDEditor: React.FC<PreloadedCRDEditorProps> = ({
  onComplete,
  onCancel,
  isVisible = false
}) => {
  const { setPreloaded, setEditorInstance } = useCRDEditor();
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Only enable preloading when component is visible
  const { isComplete: assetsLoaded, progress } = useCRDAssetPreloader({ 
    enabled: isVisible 
  });
  
  const [hasSetPreloaded, setHasSetPreloaded] = useState(false);

  useEffect(() => {
    // Only mark as preloaded once when assets are loaded and we haven't done it yet
    if (assetsLoaded && !hasSetPreloaded && isVisible) {
      const timer = setTimeout(() => {
        setPreloaded(true);
        setEditorInstance(editorRef);
        setHasSetPreloaded(true);
        console.log('✅ CRD Editor pre-loaded successfully with all assets');
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [setPreloaded, setEditorInstance, assetsLoaded, hasSetPreloaded, isVisible]);

  // Only log progress changes when visible
  useEffect(() => {
    if (isVisible && progress > 0 && progress < 100) {
      console.log(`🔄 CRD Asset preloading: ${progress}%`);
    }
  }, [progress, isVisible]);

  // Debug logging
  useEffect(() => {
    console.log('🔍 PreloadedCRDEditor state:', {
      isVisible,
      assetsLoaded,
      hasSetPreloaded,
      progress
    });
  }, [isVisible, assetsLoaded, hasSetPreloaded, progress]);

  return (
    <div 
      ref={editorRef}
      className={`${
        isVisible 
          ? 'absolute inset-x-0 top-0 bottom-0 z-40 bg-crd-darkest' 
          : 'fixed -top-[200vh] -left-[200vw] w-screen h-screen pointer-events-none opacity-0'
      }`}
      style={{
        // Ensure the hidden editor doesn't interfere with layout
        ...(isVisible ? {} : {
          position: 'fixed',
          top: '-200vh',
          left: '-200vw',
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          opacity: 0,
          overflow: 'hidden'
        })
      }}
    >
      {isVisible && (
        <>
          {!assetsLoaded ? (
            <CRDMKRLoader message="Loading CRDMKR" />
          ) : (
            <CRDCardCreatorWrapper 
              onComplete={onComplete}
              onCancel={onCancel}
            />
          )}
        </>
      )}
    </div>
  );
};
