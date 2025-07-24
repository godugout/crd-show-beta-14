
export interface CardBackMaterial {
  id: string;
  name: string;
  background: string;
  borderColor: string;
  opacity: number;
  blur?: number;
  texture?: string;
  logoTreatment: {
    filter: string;
    opacity: number;
    transform: string;
  };
}

// Enhanced material presets with more distinct visual differences
export const CARD_BACK_MATERIALS: Record<string, CardBackMaterial> = {
  holographic: {
    id: 'holographic',
    name: 'Holographic Surface',
    background: 'linear-gradient(135deg, #0f0a2e 0%, #1a0f3d 25%, #2d1b4e 50%, #3d2a5f 75%, #4a3570 100%)',
    borderColor: 'rgba(138, 43, 226, 0.6)',
    opacity: 0.85,
    blur: 1,
    logoTreatment: {
      filter: 'drop-shadow(0 6px 20px rgba(138, 43, 226, 0.7)) brightness(1.3) saturate(1.2)',
      opacity: 0.9,
      transform: 'scale(1.05)'
    }
  },
  
  crystal: {
    id: 'crystal',
    name: 'Crystal Glitter Surface',
    background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.3) 0%, rgba(241, 245, 249, 0.4) 25%, rgba(226, 232, 240, 0.5) 50%, rgba(203, 213, 225, 0.4) 75%, rgba(148, 163, 184, 0.3) 100%)',
    borderColor: 'rgba(148, 163, 184, 0.6)',
    opacity: 0.6,
    blur: 0.5,
    texture: 'glitter',
    logoTreatment: {
      filter: 'drop-shadow(0 8px 25px rgba(148, 163, 184, 0.9)) brightness(1.6) contrast(1.3)',
      opacity: 0.7,
      transform: 'scale(1.08)'
    }
  },
  
  chrome: {
    id: 'chrome',
    name: 'Chrome Surface',
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 25%, #5d6d7e 50%, #85929e 75%, #aeb6bf 100%)',
    borderColor: 'rgba(174, 182, 191, 0.7)',
    opacity: 0.9,
    logoTreatment: {
      filter: 'drop-shadow(0 6px 18px rgba(174, 182, 191, 0.9)) brightness(1.35) contrast(1.25)',
      opacity: 0.85,
      transform: 'scale(1.06)'
    }
  },
  
  gold: {
    id: 'gold',
    name: 'Gold Surface',
    background: 'linear-gradient(135deg, #7d4f00 0%, #b8860b 25%, #daa520 50%, #ffd700 75%, #ffed4e 100%)',
    borderColor: 'rgba(255, 215, 0, 0.8)',
    opacity: 0.8,
    logoTreatment: {
      filter: 'drop-shadow(0 8px 25px rgba(255, 215, 0, 0.9)) brightness(1.4) sepia(0.4) saturate(1.3)',
      opacity: 0.85,
      transform: 'scale(1.1)'
    }
  },
  
  vintage: {
    id: 'vintage',
    name: 'Vintage Surface',
    background: 'linear-gradient(135deg, #3e2723 0%, #5d4037 25%, #795548 50%, #a1887f 75%, #bcaaa4 100%)',
    borderColor: 'rgba(188, 170, 164, 0.6)',
    opacity: 0.88,
    texture: 'noise',
    logoTreatment: {
      filter: 'drop-shadow(0 5px 15px rgba(188, 170, 164, 0.7)) sepia(0.3) brightness(0.9) contrast(1.1)',
      opacity: 0.75,
      transform: 'scale(0.95)'
    }
  },
  
  prizm: {
    id: 'prizm',
    name: 'Rainbow Prizm Surface',
    background: 'linear-gradient(135deg, #ff3c3c 0%, #ff7828 12%, #ffc828 25%, #78ff3c 37%, #28c8ff 50%, #3c78ff 62%, #8c50ff 75%, #ff50b4 87%, #ff3c3c 100%)',
    borderColor: 'rgba(255, 120, 180, 0.7)',
    opacity: 0.75,
    logoTreatment: {
      filter: 'drop-shadow(0 7px 22px rgba(255, 120, 180, 0.8)) brightness(1.3) saturate(1.6)',
      opacity: 0.9,
      transform: 'scale(1.07)'
    }
  },
  
  ice: {
    id: 'ice',
    name: 'Natural Ice Surface',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 20%, #bae6fd 40%, #7dd3fc 60%, #38bdf8 80%, #0ea5e9 100%)',
    borderColor: 'rgba(14, 165, 233, 0.6)',
    opacity: 0.82,
    blur: 1,
    texture: 'ice-scratches',
    logoTreatment: {
      filter: 'drop-shadow(0 6px 20px rgba(14, 165, 233, 0.8)) brightness(1.2) contrast(1.1)',
      opacity: 0.85,
      transform: 'scale(1.04)'
    }
  },
  
  starlight: {
    id: 'starlight',
    name: 'Starlight Surface',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #e94560 75%, #f39c12 100%)',
    borderColor: 'rgba(243, 156, 18, 0.8)',
    opacity: 0.87,
    logoTreatment: {
      filter: 'drop-shadow(0 8px 24px rgba(243, 156, 18, 0.9)) brightness(1.4) saturate(1.2)',
      opacity: 0.9,
      transform: 'scale(1.06)'
    }
  },

  solar: {
    id: 'solar',
    name: 'Aurora Solar Surface',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 20%, #1475cc 40%, #059669 60%, #7c3aed 80%, #8b5cf6 100%)',
    borderColor: 'rgba(20, 184, 166, 0.8)',
    opacity: 0.85,
    logoTreatment: {
      filter: 'drop-shadow(0 8px 25px rgba(20, 184, 166, 0.9)) brightness(1.4) hue-rotate(30deg) saturate(1.4)',
      opacity: 0.9,
      transform: 'scale(1.08)'
    }
  },

  lunar: {
    id: 'lunar',
    name: 'Lunar Dust Surface',
    background: 'linear-gradient(135deg, #374151 0%, #4b5563 20%, #6b7280 40%, #9ca3af 60%, #d1d5db 80%, #e5e7eb 100%)',
    borderColor: 'rgba(156, 163, 175, 0.5)',
    opacity: 0.9,
    texture: 'moon-dust',
    logoTreatment: {
      filter: 'drop-shadow(0 4px 16px rgba(75, 85, 99, 0.8)) brightness(0.85) contrast(1.2) sepia(0.1)',
      opacity: 0.75,
      transform: 'scale(0.98)'
    }
  },
  
  default: {
    id: 'default',
    name: 'Default Surface',
    background: 'linear-gradient(135deg, #212121 0%, #424242 25%, #616161 50%, #757575 75%, #9e9e9e 100%)',
    borderColor: 'rgba(158, 158, 158, 0.4)',
    opacity: 0.85,
    logoTreatment: {
      filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5))',
      opacity: 0.8,
      transform: 'scale(1)'
    }
  }
};
