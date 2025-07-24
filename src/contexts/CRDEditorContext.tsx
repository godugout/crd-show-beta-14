
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { InteractiveCardData } from '@/types/interactiveCard';
import AssetPreloaderManager from '@/utils/AssetPreloaderSingleton';

interface CRDEditorState {
  isPreloaded: boolean;
  currentCard: InteractiveCardData | null;
  editorInstance: React.RefObject<any> | null;
  preloadedAssets: Set<string>;
}

interface CRDEditorContextType {
  state: CRDEditorState;
  setPreloaded: (isPreloaded: boolean) => void;
  setCurrentCard: (card: InteractiveCardData | null) => void;
  setEditorInstance: (instance: React.RefObject<any>) => void;
  addPreloadedAsset: (assetUrl: string) => void;
  isAssetPreloaded: (assetUrl: string) => boolean;
  showEditor: () => void;
  hideEditor: () => void;
  stopAllPreloading: () => void;
}

const CRDEditorContext = createContext<CRDEditorContextType | undefined>(undefined);

export const CRDEditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CRDEditorState>({
    isPreloaded: false,
    currentCard: null,
    editorInstance: null,
    preloadedAssets: new Set()
  });

  const setPreloaded = (isPreloaded: boolean) => {
    setState(prev => {
      if (prev.isPreloaded === isPreloaded) {
        return prev; // Prevent unnecessary updates
      }
      return { ...prev, isPreloaded };
    });
  };

  const setCurrentCard = (card: InteractiveCardData | null) => {
    setState(prev => ({ ...prev, currentCard: card }));
  };

  const setEditorInstance = (instance: React.RefObject<any>) => {
    setState(prev => ({ ...prev, editorInstance: instance }));
  };

  const addPreloadedAsset = (assetUrl: string) => {
    setState(prev => {
      if (prev.preloadedAssets.has(assetUrl)) {
        return prev; // Asset already added, prevent unnecessary updates
      }
      return {
        ...prev,
        preloadedAssets: new Set([...prev.preloadedAssets, assetUrl])
      };
    });
  };

  const isAssetPreloaded = (assetUrl: string) => {
    return state.preloadedAssets.has(assetUrl);
  };

  const showEditor = () => {
    console.log('🚀 Showing pre-loaded CRD editor');
  };

  const hideEditor = () => {
    console.log('🔒 Hiding CRD editor');
  };

  const stopAllPreloading = () => {
    const manager = AssetPreloaderManager.getInstance();
    manager.stopAllPreloading();
    console.log('🛑 All CRD asset preloading stopped');
  };

  return (
    <CRDEditorContext.Provider value={{
      state,
      setPreloaded,
      setCurrentCard,
      setEditorInstance,
      addPreloadedAsset,
      isAssetPreloaded,
      showEditor,
      hideEditor,
      stopAllPreloading
    }}>
      {children}
    </CRDEditorContext.Provider>
  );
};

export const useCRDEditor = () => {
  const context = useContext(CRDEditorContext);
  if (context === undefined) {
    throw new Error('useCRDEditor must be used within a CRDEditorProvider');
  }
  return context;
};
