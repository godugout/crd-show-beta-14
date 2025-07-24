import { useState, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import type { CardData } from '@/types/card';

interface Studio3DState {
  selectedCardIndex: number;
  cameraPosition: THREE.Vector3;
  convergencePoint: THREE.Vector3;
  cardPositions: Map<string, THREE.Vector3>;
  sceneSettings: {
    enableGrid: boolean;
    enableInteraction: boolean;
    backgroundImage?: string;
    ambientLighting: number;
    directionalLighting: number;
  };
}

interface UseStudio3DProps {
  cards: CardData[];
  initialSelectedIndex?: number;
  backgroundImage?: string;
}

export const useStudio3D = ({ 
  cards, 
  initialSelectedIndex = 0,
  backgroundImage 
}: UseStudio3DProps) => {
  const [state, setState] = useState<Studio3DState>({
    selectedCardIndex: initialSelectedIndex,
    cameraPosition: new THREE.Vector3(0, 5, 20),
    convergencePoint: new THREE.Vector3(0, -80, -50),
    cardPositions: new Map(),
    sceneSettings: {
      enableGrid: true,
      enableInteraction: true,
      backgroundImage,
      ambientLighting: 0.4,
      directionalLighting: 0.8
    }
  });

  // Update selected card
  const selectCard = useCallback((index: number) => {
    if (index >= 0 && index < cards.length) {
      setState(prev => ({
        ...prev,
        selectedCardIndex: index
      }));
    }
  }, [cards.length]);

  // Update card position
  const updateCardPosition = useCallback((cardId: string, position: THREE.Vector3) => {
    setState(prev => ({
      ...prev,
      cardPositions: new Map(prev.cardPositions).set(cardId, position)
    }));
  }, []);

  // Update convergence point
  const setConvergencePoint = useCallback((point: THREE.Vector3) => {
    setState(prev => ({
      ...prev,
      convergencePoint: point
    }));
  }, []);

  // Update scene settings
  const updateSceneSettings = useCallback((settings: Partial<Studio3DState['sceneSettings']>) => {
    setState(prev => ({
      ...prev,
      sceneSettings: {
        ...prev.sceneSettings,
        ...settings
      }
    }));
  }, []);

  // Navigate between cards
  const nextCard = useCallback(() => {
    selectCard((state.selectedCardIndex + 1) % cards.length);
  }, [selectCard, state.selectedCardIndex, cards.length]);

  const previousCard = useCallback(() => {
    selectCard(state.selectedCardIndex === 0 ? cards.length - 1 : state.selectedCardIndex - 1);
  }, [selectCard, state.selectedCardIndex, cards.length]);

  // Reset camera to default position
  const resetCamera = useCallback(() => {
    setState(prev => ({
      ...prev,
      cameraPosition: new THREE.Vector3(0, 5, 20)
    }));
  }, []);

  // Auto-arrange cards based on current selection and convergence point
  const autoArrangeCards = useCallback(() => {
    const newPositions = new Map<string, THREE.Vector3>();
    
    cards.forEach((card, index) => {
      const angle = (index / cards.length) * Math.PI * 2;
      const radius = 10 + (index * 2);
      const isSelected = index === state.selectedCardIndex;
      
      const position = new THREE.Vector3(
        state.convergencePoint.x + Math.cos(angle) * radius,
        state.convergencePoint.y + 5 + (index * 1.5),
        state.convergencePoint.z + Math.sin(angle) * radius
      );

      if (isSelected) {
        position.z += 15;
        position.y += 2;
      }

      newPositions.set(card.id, position);
    });

    setState(prev => ({
      ...prev,
      cardPositions: newPositions
    }));
  }, [cards, state.selectedCardIndex, state.convergencePoint]);

  // Auto-arrange when cards or selection changes
  useEffect(() => {
    autoArrangeCards();
  }, [autoArrangeCards]);

  // Update background image
  useEffect(() => {
    if (backgroundImage !== state.sceneSettings.backgroundImage) {
      updateSceneSettings({ backgroundImage });
    }
  }, [backgroundImage, state.sceneSettings.backgroundImage, updateSceneSettings]);

  return {
    // State
    selectedCardIndex: state.selectedCardIndex,
    selectedCard: cards[state.selectedCardIndex],
    cameraPosition: state.cameraPosition,
    convergencePoint: state.convergencePoint,
    cardPositions: state.cardPositions,
    sceneSettings: state.sceneSettings,
    
    // Actions
    selectCard,
    nextCard,
    previousCard,
    updateCardPosition,
    setConvergencePoint,
    updateSceneSettings,
    resetCamera,
    autoArrangeCards,
    
    // Computed
    hasMultipleCards: cards.length > 1,
    totalCards: cards.length
  };
};

export default useStudio3D;