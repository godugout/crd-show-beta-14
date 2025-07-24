// Main CRD System Exports
export { CRDViewer } from './CRDViewer';
export { Card3DCore } from './core/Card3DCore';
export { MaterialSystem } from './materials/MaterialSystem';
export { AnimationController } from './animation/AnimationController';
export { LightingRig } from './lighting/LightingRig';
export { CRDControlPanel } from './controls/CRDControlPanel';
export { CRDStickyFooter } from './controls/CRDStickyFooter';

// Orbital Material System
export { OrbitalMaterialSystem } from './orbital/OrbitalMaterialSystem';
export { OrbitalRing } from './orbital/OrbitalRing';
export { MaterialSatellite } from './orbital/MaterialSatellite';

// Premium Styles System
export { StyleSelector, StyleTile } from './styles/StyleSelector';
export { StyleRegistry, CRDVisualStyles } from './styles/StyleRegistry';
export type { CRDVisualStyle } from './styles/StyleRegistry';

// Types
export type {
  AnimationMode,
  MaterialMode,
  LightingPreset,
  PathTheme,
  CRDTransform,
  CRDViewerConfig,
  PetInteractionEvent,
  VirtualSpaceConfig
} from './types/CRDTypes';

// Future: Achievement Pet System Integration
// export { AchievementPet } from './pet/AchievementPet';
// export { PetEvolution } from './pet/PetEvolution';

// Future: Virtual Spaces Integration  
// export { SportsArenaSpace } from './spaces/SportsArenaSpace';
// export { SciFiArcadeSpace } from './spaces/SciFiArcadeSpace';
// export { NaturePreserveSpace } from './spaces/NaturePreserveSpace';

// Future: Duel System Integration
// export { CardDuelViewer } from './duel/CardDuelViewer';
// export { DuelAnimations } from './duel/DuelAnimations';