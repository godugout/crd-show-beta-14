import React, { useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitalRing } from './OrbitalRing';
import { CRDVisualStyles, type CRDVisualStyle } from '../styles/StyleRegistry';

interface OrbitalMaterialSystemProps {
  cardRotation: THREE.Euler;
  onStyleChange: (styleId: string) => void;
  selectedStyleId: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  showRing?: boolean;
  showLockIndicators?: boolean;
  isPaused?: boolean;
  cardPaused?: boolean;
}

export const OrbitalMaterialSystem: React.FC<OrbitalMaterialSystemProps> = ({
  cardRotation,
  onStyleChange,
  selectedStyleId,
  autoRotate = true,
  rotationSpeed = 1,
  showRing = true,
  showLockIndicators = true,
  isPaused = false,
  cardPaused = false
}) => {
  const [currentStyle, setCurrentStyle] = useState<CRDVisualStyle>(
    CRDVisualStyles.find(s => s.id === selectedStyleId) || CRDVisualStyles[1]
  );

  const handleStyleChange = useCallback((style: CRDVisualStyle) => {
    console.log('🌟 Orbital System: Style change requested:', style.displayName, 'ID:', style.id);
    if (style.id !== selectedStyleId) {
      setCurrentStyle(style);
      onStyleChange(style.id);
      console.log('✅ Orbital system changed style to:', style.displayName);
    }
  }, [selectedStyleId, onStyleChange]);

  // Combine both pause states - pause if either is true
  const effectivelyPaused = isPaused || cardPaused;

  return (
    <group>
      {/* Single Orbital Ring - no duplicate rings */}
      <OrbitalRing
        radius={4.5}
        cardRotation={cardRotation}
        onStyleChange={handleStyleChange}
        selectedStyleId={selectedStyleId}
        autoRotate={autoRotate}
        rotationSpeed={rotationSpeed}
        showRing={showRing}
        showLockIndicators={showLockIndicators}
        isPaused={effectivelyPaused}
        cardPaused={effectivelyPaused}
      />
    </group>
  );
};