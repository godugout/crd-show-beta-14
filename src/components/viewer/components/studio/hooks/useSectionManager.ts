
import { useState } from 'react';

export interface SectionStates {
  styles: boolean;
  effects: boolean;
  spaces: boolean;
  materials: boolean;
  lighting: boolean;
  animation: boolean;
}

export const useSectionManager = () => {
  const [sectionStates, setSectionStates] = useState<SectionStates>({
    styles: true, // Default open
    effects: false,
    spaces: true, // Default open to match screenshot
    materials: false,
    lighting: false,
    animation: false,
  });

  const setSectionState = (section: keyof SectionStates, isOpen: boolean) => {
    setSectionStates(prev => ({
      ...prev,
      [section]: isOpen
    }));
  };

  return {
    sectionStates,
    setSectionState
  };
};
