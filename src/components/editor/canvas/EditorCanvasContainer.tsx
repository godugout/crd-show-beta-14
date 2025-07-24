
import React, { useState, useEffect } from 'react';
import { useCardEditor } from '@/hooks/useCardEditor';

interface CardState {
  effects: {
    brightness: number;
    contrast: number;
    saturation: number;
    filter: string;
    holographic: boolean;
    neonGlow: boolean;
    vintage: boolean;
    // Add advanced effects
    holographicIntensity: number;
    refractorIntensity: number;
    foilIntensity: number;
    prizmIntensity: number;
    rainbowIntensity: number;
    chromeIntensity: number;
    goldIntensity: number;
    blackIntensity: number;
  };
  template: {
    id: string;
    colors: {
      primary: string;
      accent: string;
      background: string;
    };
  };
  photo: {
    crop: { scale: number; rotation: number; offsetX: number; offsetY: number };
    filter: string;
  };
}

interface EditorCanvasContainerProps {
  cardEditor?: ReturnType<typeof useCardEditor>;
  children: (props: {
    cardState: CardState;
    currentPhoto: {file: File, preview: string} | null;
    selectedElement: string | null;
    setSelectedElement: (element: string | null) => void;
    handlePhotoSelect: (file: File, preview: string) => void;
  }) => React.ReactNode;
}

export const EditorCanvasContainer = ({ cardEditor, children }: EditorCanvasContainerProps) => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState<{file: File, preview: string} | null>(null);
  
  // Card state that responds to all sidebar changes
  const [cardState, setCardState] = useState<CardState>({
    effects: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      filter: 'none',
      holographic: false,
      neonGlow: false,
      vintage: false,
      // Initialize advanced effects
      holographicIntensity: 0,
      refractorIntensity: 0,
      foilIntensity: 0,
      prizmIntensity: 0,
      rainbowIntensity: 0,
      chromeIntensity: 0,
      goldIntensity: 0,
      blackIntensity: 0
    },
    template: {
      id: 'template1',
      colors: {
        primary: '#16a085',
        accent: '#eee',
        background: '#1a1a2e'
      }
    },
    photo: {
      crop: { scale: 1, rotation: 0, offsetX: 0, offsetY: 0 },
      filter: 'original'
    }
  });

  // Sync card editor effects with card state
  useEffect(() => {
    if (cardEditor?.cardData?.design_metadata?.effects) {
      const effects = cardEditor.cardData.design_metadata.effects;
      setCardState(prev => ({
        ...prev,
        effects: {
          ...prev.effects,
          holographic: typeof effects.holographic === 'boolean' ? effects.holographic : false,
          chrome: typeof effects.chrome === 'boolean' ? effects.chrome : false,
          vintage: typeof effects.foil === 'boolean' ? effects.foil : false
        }
      }));
    }
  }, [cardEditor?.cardData?.design_metadata?.effects]);

  // Listen for all sidebar events
  useEffect(() => {
    const handlePhotoAction = (event: CustomEvent) => {
      const { action } = event.detail;
      if (action.startsWith('filter-')) {
        const filterName = action.replace('filter-', '');
        setCardState(prev => ({
          ...prev,
          photo: { ...prev.photo, filter: filterName }
        }));
      }
    };

    const handleEffectChange = (event: CustomEvent) => {
      const { effectType, value, enabled, effects } = event.detail;
      
      // Handle advanced effects object update
      if (effects) {
        setCardState(prev => ({
          ...prev,
          effects: {
            ...prev.effects,
            holographic: typeof effects.holographic === 'boolean' ? effects.holographic : false,
            chrome: typeof effects.chrome === 'boolean' ? effects.chrome : false,
            vintage: typeof effects.foil === 'boolean' ? effects.foil : false
          }
        }));
      } else {
        // Handle individual effect updates
        setCardState(prev => ({
          ...prev,
          effects: { ...prev.effects, [effectType]: enabled !== undefined ? enabled : value }
        }));
      }
    };

    const handleTemplateChange = (event: CustomEvent) => {
      const { templateId, colors } = event.detail;
      setCardState(prev => ({
        ...prev,
        template: { id: templateId, colors: colors || prev.template.colors }
      }));
    };

    const handlePhotoCrop = (event: CustomEvent) => {
      const { cropSettings } = event.detail;
      setCardState(prev => ({
        ...prev,
        photo: { ...prev.photo, crop: cropSettings }
      }));
    };

    window.addEventListener('photoAction' as any, handlePhotoAction);
    window.addEventListener('effectChange' as any, handleEffectChange);
    window.addEventListener('templateChange' as any, handleTemplateChange);
    window.addEventListener('photoCropChange' as any, handlePhotoCrop);
    
    return () => {
      window.removeEventListener('photoAction' as any, handlePhotoAction);
      window.removeEventListener('effectChange' as any, handleEffectChange);
      window.removeEventListener('templateChange' as any, handleTemplateChange);
      window.removeEventListener('photoCropChange' as any, handlePhotoCrop);
    };
  }, []);

  const handlePhotoSelect = (file: File, preview: string) => {
    setCurrentPhoto({ file, preview });
    if (cardEditor) {
      cardEditor.updateCardField('image_url', preview);
    }
  };

  return (
    <>
      {children({
        cardState,
        currentPhoto,
        selectedElement,
        setSelectedElement,
        handlePhotoSelect
      })}
    </>
  );
};
