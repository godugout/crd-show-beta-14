import React, { useEffect, useState } from 'react';

interface ThemedRansomNoteProps {
  children: string;
  theme: 'craft' | 'collect' | 'connect';
  className?: string;
  isPaused?: boolean;
  showTypographyControls?: boolean;
}

interface LetterState {
  char: string;
  isAnimating: boolean;
  animationType: 'spell' | 'spin' | 'float' | 'glow';
  animationProgress: number;
  rotation: number;
  float: number;
  lean: number;
  glowIntensity: number;
  style: LetterStyle;
  shape: 'square' | 'wide' | 'tall' | 'skew';
  size: 'small' | 'medium' | 'large' | 'extra-large';
  isThemeWord: boolean;
  isTransparent: boolean;
  letterType: 'card' | 'transparent' | 'jersey';
  backgroundOffset: number;
  isTransitioningToTypography: boolean;
  typographyTransitionProgress: number;
  // New slide animation properties
  isSliding: boolean;
  slideDirection: 'left' | 'right';
  slideProgress: number;
  settlingProgress: number;
}

interface LetterStyle {
  color: string;
  fontFamily: string;
  fontSize: string;
  backgroundColor: string;
  textShadow: string;
}

export const ThemedRansomNote: React.FC<ThemedRansomNoteProps> = ({ 
  children, 
  theme,
  className = "",
  isPaused = false,
  showTypographyControls = false
}) => {
  const [letters, setLetters] = useState<LetterState[]>([]);
  const [animPhase, setAnimPhase] = useState(0);
  const [activeAnimations, setActiveAnimations] = useState<number[]>([]);
  const [animationKey, setAnimationKey] = useState(0);
  const [isSpellingOut, setIsSpellingOut] = useState(false);
  const [spellIndex, setSpellIndex] = useState(0);
  const [flippingLetters, setFlippingLetters] = useState<number[]>([]);
  const [goldLetterIndex, setGoldLetterIndex] = useState<number>(-1); // Track which letter has gold background
  const [isReturningToTypography, setIsReturningToTypography] = useState(false);
  const [typographyTransitionPhase, setTypographyTransitionPhase] = useState<'idle' | 'background-fade' | 'color-transition' | 'font-normalize' | 'typography'>('idle');
  const [typographyProgress, setTypographyProgress] = useState(0);
  // New slide animation state
  const [isSliding, setIsSliding] = useState(false);

  // Theme-specific configurations
  const getThemeConfig = (theme: 'craft' | 'collect' | 'connect') => {
    switch (theme) {
      case 'craft':
        return {
          colors: [
            '#ff1744', '#00e676', '#2196f3', '#ffeb3b', '#e91e63', '#9c27b0',
            '#ff5722', '#00bcd4', '#ff0080', '#00ff80', '#8000ff', '#ff4000',
            '#ffd700', '#ff6b35', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
            '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#a55eea',
            '#2ed573', '#ff4757', '#3742fa', '#2f3542', '#57606f', '#ffffff'
          ],
          backgrounds: [
            { background: '#ff1744', pattern: 'electric-red' },
            { background: '#00e676', pattern: 'neon-green' },
            { background: '#2196f3', pattern: 'electric-blue' },
            { background: '#ffeb3b', pattern: 'neon-yellow' },
            { background: '#e91e63', pattern: 'hot-pink' },
            { background: '#ffd700', pattern: 'gold' },
            { background: '#ff6b35', pattern: 'orange' },
            { background: '#4ecdc4', pattern: 'turquoise' },
            { background: '#ffffff', pattern: 'white' },
            { background: 'linear-gradient(45deg, #ff6b6b 0%, #ff8e53 100%)', pattern: 'vibrant-1' },
            { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', pattern: 'electric-purple' },
            { background: 'linear-gradient(45deg, #fa709a 0%, #fee140 100%)', pattern: 'sunset' }
          ],
          jerseyPatterns: [
            // Cotton jersey textures
            { background: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 1px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(0,0,0,0.1) 1px, transparent 1px)', pattern: 'cotton-texture', color: '#ff1744' },
            // Perforated material
            { background: 'radial-gradient(circle at 30% 30%, transparent 2px, #2196f3 2px, #2196f3 4px, transparent 4px), radial-gradient(circle at 70% 70%, transparent 2px, #2196f3 2px, #2196f3 4px, transparent 4px)', pattern: 'perforated-blue', color: '#ffffff' },
            // Wool texture
            { background: 'repeating-linear-gradient(45deg, #8b4513 0px, #8b4513 2px, #a0522d 2px, #a0522d 4px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 2px)', pattern: 'wool-texture', color: '#ffffff' },
            // Nike Dri-FIT style
            { background: 'linear-gradient(90deg, #00e676 0%, #00d2d3 50%, #00e676 100%), repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 4px)', pattern: 'dri-fit-green', color: '#000000' },
            // Athletic mesh
            { background: 'repeating-conic-gradient(from 0deg at 50% 50%, #ff5722 0deg 60deg, transparent 60deg 120deg, #ff5722 120deg 180deg, transparent 180deg 240deg, #ff5722 240deg 300deg, transparent 300deg 360deg)', pattern: 'athletic-mesh', color: '#ffffff' },
            // Compression fabric
            { background: 'linear-gradient(45deg, #9c27b0 25%, transparent 25%), linear-gradient(-45deg, #9c27b0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #9c27b0 75%), linear-gradient(-45deg, transparent 75%, #9c27b0 75%)', pattern: 'compression-fabric', color: '#ffffff' },
            // Polyester blend
            { background: 'repeating-linear-gradient(0deg, #ffeb3b 0px, #ffeb3b 3px, #ffd700 3px, #ffd700 6px), repeating-linear-gradient(90deg, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 1px, transparent 1px, transparent 2px)', pattern: 'polyester-blend', color: '#000000' },
            // Jersey knit texture
            { background: 'repeating-radial-gradient(circle at 25% 25%, #e91e63 0px, #e91e63 1px, transparent 1px, transparent 3px), repeating-radial-gradient(circle at 75% 75%, #e91e63 0px, #e91e63 1px, transparent 1px, transparent 3px)', pattern: 'jersey-knit', color: '#ffffff' }
          ],
          fonts: [
            'Impact', 'Arial Black', 'Helvetica Bold', 'Bebas Neue', 'Anton',
            'Oswald', 'Squada One', 'Russo One', 'Exo 2', 'Orbitron'
          ]
        };
      
      case 'collect':
        return {
          colors: [
            '#8b4513', '#daa520', '#cd853f', '#d2691e', '#a0522d', '#f4a460',
            '#000000', '#1a1a1a', '#333333', '#4a4a4a', '#696969', '#ffffff',
            '#f5f5dc', '#faebd7', '#fff8dc'
          ],
          backgrounds: [
            { background: '#f5f5dc', pattern: 'vintage-paper' },
            { background: '#faebd7', pattern: 'antique-white' },
            { background: '#daa520', pattern: 'golden' },
            { background: '#cd853f', pattern: 'peru' },
            { background: '#8b4513', pattern: 'saddle-brown' },
            // Wood textures
            { background: 'repeating-linear-gradient(90deg, #8b4513 0px, #8b4513 8px, #a0522d 8px, #a0522d 16px, #d2691e 16px, #d2691e 24px)', pattern: 'oak-grain' },
            { background: 'repeating-linear-gradient(45deg, #654321 0px, #654321 4px, #8b4513 4px, #8b4513 8px, #a0522d 8px, #a0522d 12px)', pattern: 'walnut-grain' },
            { background: 'linear-gradient(180deg, #deb887 0%, #d2691e 25%, #cd853f 50%, #bc8f8f 75%, #f4a460 100%), repeating-linear-gradient(90deg, rgba(139,69,19,0.3) 0px, rgba(139,69,19,0.3) 2px, transparent 2px, transparent 6px)', pattern: 'pine-wood' },
            { background: 'repeating-conic-gradient(from 0deg at 50% 50%, #654321 0deg 30deg, #8b4513 30deg 60deg, #a0522d 60deg 90deg, #d2691e 90deg 120deg)', pattern: 'wood-rings' },
            // Gold and chrome metals
            { background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 25%, #ffd700 50%, #b8860b 75%, #daa520 100%), repeating-linear-gradient(45deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 2px, transparent 2px, transparent 4px)', pattern: 'brushed-gold' },
            { background: 'linear-gradient(90deg, #c0c0c0 0%, #ffffff 25%, #c0c0c0 50%, #808080 75%, #c0c0c0 100%), repeating-linear-gradient(0deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 3px)', pattern: 'brushed-chrome' },
            { background: 'radial-gradient(circle at 30% 30%, #ffd700 0%, #ffed4e 25%, #b8860b 50%, #daa520 75%, #ffd700 100%)', pattern: 'polished-gold' },
            { background: 'conic-gradient(from 45deg, #c0c0c0 0deg, #ffffff 90deg, #808080 180deg, #c0c0c0 270deg, #ffffff 360deg)', pattern: 'chrome-reflection' },
            { background: 'linear-gradient(45deg, #b8860b 0%, #ffd700 25%, #ffed4e 50%, #daa520 75%, #b8860b 100%), repeating-radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 1px, transparent 1px)', pattern: 'antique-gold' },
            // Enhanced vintage patterns
            { background: 'linear-gradient(45deg, #f5f5dc 0%, #f0f0f0 25%, #f5f5dc 50%, #e8e8e8 75%, #f5f5dc 100%)', pattern: 'newspaper' },
            { background: 'linear-gradient(90deg, #fff8dc 0%, #faebd7 50%, #fff8dc 100%)', pattern: 'vintage-paper' },
            { background: 'linear-gradient(180deg, #fffacd 0%, #f0e68c 100%)', pattern: 'aged-paper' },
            { background: '#2f2f2f', pattern: 'dark-vintage' },
            { background: '#1a1a1a', pattern: 'old-black' },
            // Mail stamp patterns
            { background: 'repeating-linear-gradient(0deg, #dc143c 0px, #dc143c 2px, #ffffff 2px, #ffffff 8px, #dc143c 8px, #dc143c 10px, #ffffff 10px, #ffffff 16px), repeating-linear-gradient(90deg, #dc143c 0px, #dc143c 2px, #ffffff 2px, #ffffff 8px)', pattern: 'postage-stamp-red' },
            { background: 'repeating-linear-gradient(0deg, #1e90ff 0px, #1e90ff 2px, #ffffff 2px, #ffffff 8px, #1e90ff 8px, #1e90ff 10px, #ffffff 10px, #ffffff 16px), repeating-linear-gradient(90deg, #1e90ff 0px, #1e90ff 2px, #ffffff 2px, #ffffff 8px)', pattern: 'postage-stamp-blue' },
            { background: 'radial-gradient(circle at 50% 50%, #8b4513 0%, #a0522d 30%, #daa520 60%, #f4a460 100%), repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg 15deg, rgba(255,255,255,0.2) 15deg 30deg)', pattern: 'vintage-stamp' }
          ],
          fonts: [
            'Georgia', 'Times New Roman', 'Garamond', 'Palatino', 'Book Antiqua',
            'Courier New', 'Monaco', 'Rockwell', 'Century', 'Minion Pro'
          ]
        };
      
      case 'connect':
        return {
          colors: [
            // Classic 90s neon colors
            '#ff1493', '#00ffff', '#ff00ff', '#39ff14', '#ffff00', '#ff6600',
            '#ff073a', '#9400d3', '#00ced1', '#ff4500', '#adff2f', '#ff69b4',
            '#00ff7f', '#1e90ff', '#ff1493', '#7fff00', '#ff4500', '#da70d6',
            // Retro tech colors
            '#ffffff', '#000000', '#c0c0c0', '#808080', '#ff8c00', '#32cd32',
            // Memphis design inspired colors
            '#ff3030', '#30ff30', '#3030ff', '#ffff30', '#ff30ff', '#30ffff'
          ],
          backgrounds: [
            // 90s geometric patterns
            { background: '#ff1493', pattern: '90s-hot-pink' },
            { background: '#00ffff', pattern: '90s-cyan' },
            { background: '#39ff14', pattern: '90s-electric-lime' },
            { background: '#ff00ff', pattern: '90s-magenta' },
            { background: '#ffff00', pattern: '90s-yellow' },
            { background: '#ff6600', pattern: '90s-orange' },
            // Retro gradients
            { background: 'linear-gradient(45deg, #ff1493 0%, #00ffff 50%, #39ff14 100%)', pattern: '90s-rainbow' },
            { background: 'linear-gradient(90deg, #ff00ff 0%, #00ffff 25%, #ffff00 50%, #ff1493 75%, #9400d3 100%)', pattern: '90s-spectrum' },
            { background: 'linear-gradient(135deg, #ff073a 0%, #ff8c00 50%, #ffff00 100%)', pattern: '90s-sunset' },
            { background: 'linear-gradient(180deg, #1e90ff 0%, #9400d3 50%, #ff1493 100%)', pattern: '90s-vaporwave' },
            // Memphis design patterns
            { background: 'repeating-linear-gradient(45deg, #ff1493 0px, #ff1493 10px, #00ffff 10px, #00ffff 20px)', pattern: 'memphis-stripes' },
            { background: 'repeating-conic-gradient(from 0deg at 50% 50%, #ff00ff 0deg 72deg, #ffff00 72deg 144deg, #00ffff 144deg 216deg, #ff1493 216deg 288deg, #39ff14 288deg 360deg)', pattern: 'memphis-wheel' },
            // Pixelated/digital patterns
            { background: 'repeating-linear-gradient(90deg, #ff1493 0px, #ff1493 4px, #000000 4px, #000000 8px)', pattern: 'pixel-pink' },
            { background: 'repeating-linear-gradient(45deg, #00ffff 0px, #00ffff 3px, #ff00ff 3px, #ff00ff 6px)', pattern: 'pixel-diagonal' },
            // Chrome/metallic 90s effect
            { background: 'linear-gradient(90deg, #c0c0c0 0%, #ffffff 25%, #c0c0c0 50%, #808080 75%, #c0c0c0 100%)', pattern: 'chrome-90s' },
            // Solid retro blocks
            { background: '#000000', pattern: 'retro-black' },
            { background: '#ffffff', pattern: 'retro-white' }
          ],
          jerseyPatterns: [
            // 90s sports aesthetics
            { background: 'radial-gradient(circle at 30% 30%, #ff1493 2px, transparent 2px), radial-gradient(circle at 70% 70%, #ff1493 2px, transparent 2px)', pattern: '90s-basketball', color: '#ff1493' },
            // Windbreaker pattern
            { background: 'repeating-linear-gradient(45deg, #ff073a 0px, #ff073a 8px, #00ffff 8px, #00ffff 16px, #ffff00 16px, #ffff00 24px)', pattern: '90s-windbreaker', color: '#ff073a' },
            // Black and white checkers
            { background: 'repeating-conic-gradient(from 0deg at 0% 0%, #000000 0deg 90deg, #ffffff 90deg 180deg, #000000 180deg 270deg, #ffffff 270deg 360deg)', pattern: 'checkers-large', color: '#ff1493' },
            { background: 'repeating-linear-gradient(45deg, #000000 0px, #000000 10px, #ffffff 10px, #ffffff 20px), repeating-linear-gradient(-45deg, #000000 0px, #000000 10px, #ffffff 10px, #ffffff 20px)', pattern: 'checkers-diagonal', color: '#00ffff' },
            { background: 'repeating-conic-gradient(from 0deg at 0% 0%, #000000 0deg 45deg, #ffffff 45deg 90deg, #000000 90deg 135deg, #ffffff 135deg 180deg, #000000 180deg 225deg, #ffffff 225deg 270deg, #000000 270deg 315deg, #ffffff 315deg 360deg)', pattern: 'checkers-small', color: '#39ff14' },
            { background: 'linear-gradient(90deg, #000000 50%, #ffffff 50%), linear-gradient(0deg, #000000 50%, #ffffff 50%)', pattern: 'checkers-quad', color: '#ff00ff' },
            // Zebra print patterns
            { background: 'repeating-linear-gradient(30deg, #000000 0px, #000000 8px, #ffffff 8px, #ffffff 16px, #000000 16px, #000000 32px, #ffffff 32px, #ffffff 40px)', pattern: 'zebra-stripe-1', color: '#ff1493' },
            { background: 'repeating-conic-gradient(from 45deg at 50% 50%, #000000 0deg 30deg, #ffffff 30deg 60deg, #000000 60deg 90deg, #ffffff 90deg 120deg)', pattern: 'zebra-radial', color: '#00ffff' },
            { background: 'repeating-linear-gradient(75deg, #000000 0px, #000000 6px, #ffffff 6px, #ffffff 14px, #000000 14px, #000000 22px, #ffffff 22px, #ffffff 28px)', pattern: 'zebra-diagonal', color: '#39ff14' },
            // Nike fluorescent materials
            { background: 'linear-gradient(90deg, #39ff14 0%, #7fff00 25%, #39ff14 50%, #adff2f 75%, #39ff14 100%), repeating-linear-gradient(45deg, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 2px, transparent 2px, transparent 4px)', pattern: 'nike-volt', color: '#000000' },
            { background: 'linear-gradient(45deg, #ff073a 0%, #ff1493 25%, #ff073a 50%, #ff4500 75%, #ff073a 100%), repeating-radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 1px, transparent 1px)', pattern: 'nike-bright-crimson', color: '#ffffff' },
            { background: 'linear-gradient(135deg, #00ffff 0%, #1e90ff 25%, #00ffff 50%, #00ced1 75%, #00ffff 100%), repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 3px, transparent 3px, transparent 6px)', pattern: 'nike-blue-fury', color: '#000000' },
            { background: 'linear-gradient(180deg, #ff00ff 0%, #da70d6 25%, #ff00ff 50%, #9400d3 75%, #ff00ff 100%), repeating-conic-gradient(from 0deg at 30% 70%, rgba(255,255,255,0.2) 0deg 45deg, transparent 45deg 90deg)', pattern: 'nike-vivid-purple', color: '#ffffff' },
            { background: 'linear-gradient(0deg, #ffff00 0%, #ffd700 25%, #ffff00 50%, #ffb347 75%, #ffff00 100%), repeating-linear-gradient(60deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 2px, transparent 2px, transparent 4px)', pattern: 'nike-opti-yellow', color: '#000000' },
            // Geometric 90s pattern
            { background: 'repeating-conic-gradient(from 0deg, #ff00ff 0deg 45deg, #39ff14 45deg 90deg, #00ffff 90deg 135deg, #ff1493 135deg 180deg)', pattern: '90s-geometric', color: '#ff00ff' },
            // Neon mesh texture
            { background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,20,147,0.3) 2px, rgba(255,20,147,0.3) 4px)', pattern: '90s-neon-mesh', color: '#ff1493' },
            // Retro stripes
            { background: 'repeating-linear-gradient(90deg, #ff073a 0px, #ff073a 12px, #39ff14 12px, #39ff14 24px, #00ffff 24px, #00ffff 36px)', pattern: '90s-retro-stripes', color: '#ff073a' },
            // Holographic effect
            { background: 'linear-gradient(45deg, #ff1493 0%, #00ffff 25%, #39ff14 50%, #ff00ff 75%, #ffff00 100%)', pattern: '90s-holographic', color: '#ffffff' },
            // Digital camouflage
            { background: 'repeating-linear-gradient(30deg, #ff1493 0px, #ff1493 6px, #000000 6px, #000000 12px, #00ffff 12px, #00ffff 18px)', pattern: '90s-digi-camo', color: '#ffffff' },
            // Cyberpunk grid
            { background: 'linear-gradient(rgba(255,20,147,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)', pattern: '90s-cyber-grid', color: '#39ff14' }
          ],
          fonts: [
            // Digital/tech fonts
            'Courier New', 'Monaco', 'Consolas', 'Lucida Console', 'Menlo',
            // Futuristic fonts
            'Orbitron', 'Rajdhani', 'Russo One', 'Quantico', 'Michroma',
            // Bold 90s style fonts
            'Impact', 'Arial Black', 'Bebas Neue', 'Anton', 'Squada One',
            // Retro gaming inspired
            'Press Start 2P', 'VT323', 'Share Tech Mono'
          ]
        };
    }
  };

  const themeConfig = getThemeConfig(theme);

  // Generate letter shape
  const generateLetterShape = (): 'square' | 'wide' | 'tall' | 'skew' => {
    const shapes = ['square', 'wide', 'tall', 'skew'] as const;
    return shapes[Math.floor(Math.random() * shapes.length)];
  };

  // Generate transparency pattern - 2-3 letters per word
  const generateTransparencyPattern = (text: string): boolean[] => {
    const words = text.split(' ');
    const pattern: boolean[] = [];
    
    words.forEach(word => {
      const wordLength = word.length;
      const transparentCount = Math.min(3, Math.max(2, Math.floor(wordLength * 0.3)));
      const transparentIndices = new Set<number>();
      
      // Select random positions for transparent letters
      while (transparentIndices.size < transparentCount && transparentIndices.size < wordLength) {
        transparentIndices.add(Math.floor(Math.random() * wordLength));
      }
      
      for (let i = 0; i < wordLength; i++) {
        pattern.push(transparentIndices.has(i));
      }
      
      // Add space
      if (word !== words[words.length - 1]) {
        pattern.push(false);
      }
    });
    
    return pattern;
  };

  // Generate letter type (card, transparent, jersey)
  const generateLetterType = (index: number, isTransparent: boolean): 'card' | 'transparent' | 'jersey' => {
    if (isTransparent) return 'transparent';
    
    // For connect theme, add jersey materials
    if (theme === 'connect' && Math.random() < 0.25) {
      return 'jersey';
    }
    
    return 'card';
  };

  // Generate background vertical offset for card positioning
  const generateBackgroundOffset = (): number => {
    const random = Math.random();
    // Random vertical offset for card backgrounds: -0.3em to 0.3em
    if (random < 0.2) return -0.3; // top
    if (random < 0.4) return -0.15; // slightly above
    if (random < 0.6) return 0; // middle
    if (random < 0.8) return 0.15; // slightly below
    return 0.3; // bottom
  };

  // Generate letter size with mixed distribution
  const generateLetterSize = (index: number, totalLetters: number): 'small' | 'medium' | 'large' | 'extra-large' => {
    // Limit extra-large letters to 1-2 per word
    const extraLargeChance = Math.random() < 0.15 && index % 3 === 0 ? 'extra-large' : null;
    if (extraLargeChance) return 'extra-large';
    
    const sizes = ['small', 'medium', 'large'] as const;
    const weights = [0.3, 0.5, 0.2]; // More medium, some small, fewer large
    const random = Math.random();
    
    if (random < weights[0]) return 'small';
    if (random < weights[0] + weights[1]) return 'medium';
    return 'large';
  };

  // Detect theme words for special highlighting
  const detectThemeWord = (text: string, index: number): boolean => {
    const lowerText = text.toLowerCase();
    const themeWords = {
      craft: ['craft', 'reality'],
      collect: ['collect', 'memories'],
      connect: ['connect', 'creators']
    };
    
    const targetWords = themeWords[theme];
    for (const word of targetWords) {
      const wordIndex = lowerText.indexOf(word);
      if (wordIndex !== -1 && index >= wordIndex && index < wordIndex + word.length) {
        return true;
      }
    }
    return false;
  };

  // Get theme-specific highlight color for special words
  const getThemeHighlightColor = (): string => {
    switch (theme) {
      case 'craft':
        return ['#ff1744', '#00e676', '#2196f3'][Math.floor(Math.random() * 3)];
      case 'collect':
        return ['#daa520', '#8b4513', '#cd853f'][Math.floor(Math.random() * 3)];
      case 'connect':
        return ['#00ffff', '#ff00ff', '#39ff14'][Math.floor(Math.random() * 3)];
    }
  };

  // Use colored letters directly instead of just black/white
  const getRandomColor = (): string => {
    return themeConfig.colors[Math.floor(Math.random() * themeConfig.colors.length)];
  };

  const getContrastingColor = (bgColor: string): string => {
    // 60% chance to use colored letters, 40% chance for contrast
    if (Math.random() < 0.6) {
      return getRandomColor();
    }
    
    if (bgColor.includes('gradient') || bgColor.includes('repeating')) {
      return Math.random() > 0.5 ? '#ffffff' : '#000000';
    }
    
    // Theme-specific contrast logic
    if (theme === 'collect') {
      const lightBgs = ['#f5f5dc', '#faebd7', '#fff8dc', '#fffacd', '#f0e68c'];
      const isDark = !lightBgs.some(color => bgColor.includes(color));
      return isDark ? '#ffffff' : '#000000';
    }
    
    if (theme === 'connect') {
      const darkBgs = ['#000000', '#1a1a1a', '#404040'];
      const isDark = darkBgs.some(color => bgColor.includes(color));
      return isDark ? '#00ffff' : '#000000';
    }
    
    // Default craft theme
    return Math.random() > 0.5 ? '#ffffff' : '#000000';
  };

  // Helper function to check if a background is gold-related for collect theme
  const isGoldBackground = (bgStyle: { background: string; pattern: string }): boolean => {
    if (theme !== 'collect') return false;
    const goldPatterns = ['golden', 'brushed-gold', 'polished-gold', 'antique-gold'];
    return goldPatterns.includes(bgStyle.pattern);
  };

  const generateLetterStyle = (letterType: 'card' | 'transparent' | 'jersey' = 'card', forceGold: boolean = false, avoidGold: boolean = false): LetterStyle => {
    let bgStyle, textColor;
    
    if (letterType === 'transparent') {
      // Transparent letters have no background
      bgStyle = { background: 'transparent', pattern: 'transparent' };
      textColor = getRandomColor();
    } else if (letterType === 'jersey' && theme === 'connect' && themeConfig.jerseyPatterns) {
      // Jersey patterns for connect theme
      bgStyle = themeConfig.jerseyPatterns[Math.floor(Math.random() * themeConfig.jerseyPatterns.length)];
      textColor = getContrastingColor(bgStyle.background);
    } else {
      // Regular card backgrounds with gold constraint for collect theme
      if (theme === 'collect') {
        if (forceGold) {
          // Select only gold backgrounds
          const goldBackgrounds = themeConfig.backgrounds.filter(bg => isGoldBackground(bg));
          bgStyle = goldBackgrounds[Math.floor(Math.random() * goldBackgrounds.length)];
        } else if (avoidGold) {
          // Select only non-gold backgrounds
          const nonGoldBackgrounds = themeConfig.backgrounds.filter(bg => !isGoldBackground(bg));
          bgStyle = nonGoldBackgrounds[Math.floor(Math.random() * nonGoldBackgrounds.length)];
        } else {
          // Default random selection (fallback)
          bgStyle = themeConfig.backgrounds[Math.floor(Math.random() * themeConfig.backgrounds.length)];
        }
      } else {
        // Other themes use regular random selection
        bgStyle = themeConfig.backgrounds[Math.floor(Math.random() * themeConfig.backgrounds.length)];
      }
      textColor = getContrastingColor(bgStyle.background);
    }
    
    // Enhanced shadow effects with depth layering
    const getTextShadowForType = (type: 'card' | 'transparent' | 'jersey') => {
      if (type === 'transparent') {
        // Layered shadows for transparent letters to create depth
        return [
          '2px 2px 4px rgba(0,0,0,0.8), 4px 4px 8px rgba(0,0,0,0.6), 6px 6px 12px rgba(0,0,0,0.4)',
          '1px 1px 3px rgba(0,0,0,0.9), 3px 3px 6px rgba(0,0,0,0.7), 5px 5px 10px rgba(0,0,0,0.5)',
          '3px 3px 0px rgba(0,0,0,0.8), 6px 6px 8px rgba(0,0,0,0.6), 9px 9px 15px rgba(0,0,0,0.4)'
        ];
      }
      
      return [
        'none',
        '2px 2px 4px rgba(0,0,0,0.3)',
        '1px 1px 2px rgba(255,255,255,0.8)',
        '0 0 3px rgba(0,0,0,0.5)',
        'inset 0 1px 0 rgba(255,255,255,0.2)',
        '3px 3px 0px rgba(0,0,0,0.4), 6px 6px 8px rgba(0,0,0,0.2)',
        '2px 2px 0px rgba(255,255,255,0.3), 4px 4px 6px rgba(0,0,0,0.3)',
        '1px 1px 0px rgba(0,0,0,0.5), 2px 2px 0px rgba(0,0,0,0.3), 3px 3px 0px rgba(0,0,0,0.2)',
      ];
    };

    const shadowOptions = getTextShadowForType(letterType);

    return {
      color: textColor,
      fontFamily: themeConfig.fonts[Math.floor(Math.random() * themeConfig.fonts.length)],
      fontSize: `${1.0 + Math.random() * 0.5}em`,
      backgroundColor: bgStyle.background,
      textShadow: shadowOptions[Math.floor(Math.random() * shadowOptions.length)]
    };
  };

  useEffect(() => {
    const initializeLetters = () => {
      // Make letters case agnostic - randomly mix uppercase and lowercase
      const processedText = children.split('').map(char => {
        if (char === ' ') return char;
        return Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase();
      }).join('');
      
      // Generate transparency pattern
      const transparencyPattern = generateTransparencyPattern(children);
      
      // Only allow 1-2 letters to have sharp angles (>10 degrees)
      const totalLetters = processedText.length;
      const sharpAngleIndices = new Set<number>();
      const numSharpAngles = Math.min(2, Math.max(1, Math.floor(totalLetters * 0.2))); // 1-2 letters
      
      while (sharpAngleIndices.size < numSharpAngles) {
        const randomIndex = Math.floor(Math.random() * totalLetters);
        if (processedText[randomIndex] !== ' ') {
          sharpAngleIndices.add(randomIndex);
        }
      }
      
      // For collect theme, pick one letter to have gold background
      let selectedGoldIndex = -1;
      if (theme === 'collect') {
        const validIndices = processedText.split('').map((char, i) => char !== ' ' ? i : -1).filter(i => i !== -1);
        if (validIndices.length > 0) {
          selectedGoldIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
          setGoldLetterIndex(selectedGoldIndex);
        }
      }
      
      const newLetters = processedText.split('').map((char, index) => {
        const hasSharpAngle = sharpAngleIndices.has(index);
        const isThemeWord = detectThemeWord(children, index);
        const isTransparent = transparencyPattern[index] || false;
        const letterType = generateLetterType(index, isTransparent);
        
        // For collect theme, enforce gold constraint
        let forceGold = false;
        let avoidGold = false;
        if (theme === 'collect' && !isTransparent && letterType === 'card') {
          forceGold = index === selectedGoldIndex;
          avoidGold = index !== selectedGoldIndex;
        }
        
        return {
          char,
          isAnimating: false,
          animationType: 'float' as const,
          animationProgress: 0,
          rotation: hasSharpAngle ? (Math.random() * 30 - 15) : (Math.random() * 6 - 3), // Sharp: ±15°, Normal: ±3°
          float: Math.random() * 2,
          lean: hasSharpAngle ? (Math.random() * 12 - 6) : (Math.random() * 4 - 2), // Controlled lean
          glowIntensity: 0.5 + Math.random() * 0.5,
          style: generateLetterStyle(letterType, forceGold, avoidGold),
          shape: generateLetterShape(),
          size: generateLetterSize(index, totalLetters),
          isThemeWord,
          isTransparent,
          letterType,
          backgroundOffset: char === ' ' ? 0 : generateBackgroundOffset(),
          isTransitioningToTypography: false,
          typographyTransitionProgress: 0,
          // Initialize slide animation properties
          isSliding: false,
          slideDirection: 'left' as const,
          slideProgress: 0,
          settlingProgress: 1
        };
      });
      setLetters(newLetters);
    };

    initializeLetters();
  }, [children, theme]);

  // Dynamic slide animation system
  const performSlideAnimation = (updateFunction: () => void) => {
    if (isSliding) return;
    
    console.log('🎭 Starting slide animation');
    setIsSliding(true);
    const slideDirection = Math.random() > 0.5 ? 'left' : 'right';
    console.log(`📤 Slide direction: ${slideDirection}`);
    
    // Phase 1: Slide off screen (0.3s, fast)
    setLetters(prev => prev.map(letter => ({
      ...letter,
      isSliding: true,
      slideDirection: slideDirection as 'left' | 'right',
      slideProgress: 0
    })));
    
    const slideOffDuration = 300;
    const slideOffStart = Date.now();
    
    const slideOffInterval = setInterval(() => {
      const elapsed = Date.now() - slideOffStart;
      const progress = Math.min(elapsed / slideOffDuration, 1);
      
      setLetters(prev => prev.map(letter => ({
        ...letter,
        slideProgress: progress
      })));
      
      if (progress >= 1) {
        clearInterval(slideOffInterval);
        
        // Phase 2: Update styles while off-screen (instant)
        updateFunction();
        
        // Phase 3: Slide in from opposite side (0.4s, fast)
        const oppositeDirection = slideDirection === 'left' ? 'right' : 'left';
        setLetters(prev => prev.map(letter => ({
          ...letter,
          slideDirection: oppositeDirection as 'left' | 'right',
          slideProgress: 1
        })));
        
        const slideInDuration = 400;
        const slideInStart = Date.now();
        
        const slideInInterval = setInterval(() => {
          const elapsed = Date.now() - slideInStart;
          const progress = Math.min(elapsed / slideInDuration, 1);
          
          setLetters(prev => prev.map(letter => ({
            ...letter,
            slideProgress: 1 - progress
          })));
          
          if (progress >= 1) {
            clearInterval(slideInInterval);
            
            // Phase 4: Settle into floating baseline positions (0.8s, ease-out)
            const settleDuration = 800;
            const settleStart = Date.now();
            
            const settleInterval = setInterval(() => {
              const elapsed = Date.now() - settleStart;
              const settleProgress = Math.min(elapsed / settleDuration, 1);
              const easeOut = 1 - Math.pow(1 - settleProgress, 3);
              
              setLetters(prev => prev.map(letter => ({
                ...letter,
                settlingProgress: easeOut,
                float: letter.float * (1 - easeOut) + (Math.random() * 0.8 - 0.4) * easeOut // Settle around baseline
              })));
              
              if (settleProgress >= 1) {
                clearInterval(settleInterval);
                setLetters(prev => prev.map(letter => ({
                  ...letter,
                  isSliding: false,
                  slideProgress: 0,
                  settlingProgress: 1
                })));
                setIsSliding(false);
              }
            }, 16);
          }
        }, 16);
      }
    }, 16);
  };

  // Typography transition function
  const transitionToTypography = () => {
    if (typographyTransitionPhase !== 'idle') return;
    
    setIsReturningToTypography(true);
    setTypographyTransitionPhase('background-fade');
    setTypographyProgress(0);
    
    // Phase 1: Background fade-out (0.5s)
    setTimeout(() => {
      setTypographyTransitionPhase('color-transition');
      
      // Phase 2: Color transition (1.0s)
      setTimeout(() => {
        setTypographyTransitionPhase('font-normalize');
        
        // Phase 3: Font normalization (1.0s)
        setTimeout(() => {
          setTypographyTransitionPhase('typography');
          
          // Apply final typography state
          setLetters(prev => prev.map(letter => ({
            ...letter,
            isTransitioningToTypography: true,
            typographyTransitionProgress: 1,
            style: {
              ...letter.style,
              backgroundColor: 'transparent',
              fontFamily: 'Impact',
              fontSize: '1em',
              textShadow: 'none'
            },
            rotation: 0,
            float: 0,
            lean: 0,
            shape: 'square' as const,
            size: 'medium' as const
          })));
          
          // Phase 4: Hold in typography state (0.8s)
          setTimeout(() => {
            setTypographyTransitionPhase('idle');
          }, 800);
          
        }, 1000);
      }, 1000);
    }, 500);
  };

  // Return to ransom note function
  const returnToRansomNote = () => {
    setIsReturningToTypography(false);
    setTypographyTransitionPhase('idle');
    setTypographyProgress(0);
    
    // Reinitialize letters with ransom note styles
    setLetters(prev => prev.map(letter => ({
      ...letter,
      isTransitioningToTypography: false,
      typographyTransitionProgress: 0
    })));
    
    // Trigger a refresh of the ransom note styles
    setAnimationKey(prev => prev + 1);
  };

  useEffect(() => {
    if (isPaused) return; // Pause main variation loop
    
    const variationInterval = setInterval(() => {
      console.log('🎨 ThemedRansomNote: Starting new variation cycle, theme:', theme);
      
      performSlideAnimation(() => {
        if (Math.random() < 0.3) {
          setIsSpellingOut(true);
          setSpellIndex(0);
          setActiveAnimations([]);
          
          // Pick new gold letter for collect theme
          let newGoldIndex = goldLetterIndex;
          if (theme === 'collect') {
            setLetters(currentLetters => {
              const validIndices = currentLetters.map((letter, i) => letter.char !== ' ' && !letter.isTransparent && letter.letterType === 'card' ? i : -1).filter(i => i !== -1);
              if (validIndices.length > 0) {
                newGoldIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
                setGoldLetterIndex(newGoldIndex);
              }
              
              return currentLetters.map((letter, index) => {
                // For collect theme, enforce gold constraint
                let forceGold = false;
                let avoidGold = false;
                if (theme === 'collect' && !letter.isTransparent && letter.letterType === 'card') {
                  forceGold = index === newGoldIndex;
                  avoidGold = index !== newGoldIndex;
                }
                
                return {
                  ...letter,
                  style: generateLetterStyle(letter.letterType, forceGold, avoidGold),
                  backgroundOffset: letter.char === ' ' ? 0 : (Math.random() < 0.3 ? generateBackgroundOffset() : letter.backgroundOffset)
                };
              });
            });
          } else {
            setLetters(prev => prev.map(letter => ({
              ...letter,
              style: generateLetterStyle(letter.letterType),
              backgroundOffset: letter.char === ' ' ? 0 : (Math.random() < 0.3 ? generateBackgroundOffset() : letter.backgroundOffset)
            })));
          }
        } else {
          setAnimationKey(prev => prev + 1);
          setActiveAnimations([]);
          setIsSpellingOut(false);
          
          // Pick new gold letter for collect theme
          let newGoldIndex = goldLetterIndex;
          if (theme === 'collect') {
            setLetters(currentLetters => {
              const validIndices = currentLetters.map((letter, i) => letter.char !== ' ' && !letter.isTransparent && letter.letterType === 'card' ? i : -1).filter(i => i !== -1);
              if (validIndices.length > 0) {
                newGoldIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
                setGoldLetterIndex(newGoldIndex);
              }
              
              return currentLetters.map((letter, index) => {
                // For collect theme, enforce gold constraint
                let forceGold = false;
                let avoidGold = false;
                if (theme === 'collect' && !letter.isTransparent && letter.letterType === 'card') {
                  forceGold = index === newGoldIndex;
                  avoidGold = index !== newGoldIndex;
                }
                
                return {
                  ...letter,
                  style: generateLetterStyle(letter.letterType, forceGold, avoidGold),
                  backgroundOffset: letter.char === ' ' ? 0 : (Math.random() < 0.3 ? generateBackgroundOffset() : letter.backgroundOffset)
                };
              });
            });
          } else {
            setLetters(prev => prev.map(letter => ({
              ...letter,
              style: generateLetterStyle(letter.letterType),
              backgroundOffset: letter.char === ' ' ? 0 : (Math.random() < 0.3 ? generateBackgroundOffset() : letter.backgroundOffset)
            })));
          }
        }
      });
    }, 18000); // Increased from 12000 to 18000 (slower pace)

    const phaseInterval = setInterval(() => {
      setAnimPhase(prev => prev + 1);
    }, 4000); // Increased from 2500 to 4000 (longer individual transitions)

    return () => {
      clearInterval(variationInterval);
      clearInterval(phaseInterval);
    };
  }, [theme, isPaused, goldLetterIndex, isSliding]); // Updated dependencies

  useEffect(() => {
    if (isSpellingOut) {
      const spellInterval = setInterval(() => {
        setSpellIndex(prev => {
          const nextIndex = prev + 1;
          if (nextIndex >= children.length) {
            setIsSpellingOut(false);
            return 0;
          }
          return nextIndex;
        });
      }, 400);

      return () => clearInterval(spellInterval);
    }
  }, [isSpellingOut, children.length]);

  useEffect(() => {
    if (isPaused) return; // Pause letter animations when paused
    
    const letterInterval = setInterval(() => {
      setLetters(prev => prev.map((letter, index) => ({
        ...letter,
        rotation: letter.rotation + (Math.sin(animPhase * 0.015 + index) * 0.2), // Gentler rotation changes
        float: 0.5 + Math.sin(animPhase * 0.02 + index * 0.5) * 1.5, // Smaller float range
        lean: Math.sin(animPhase * 0.018 + index * 0.3) * 2, // Much smaller lean movement
        glowIntensity: 0.5 + Math.sin(animPhase * 0.03 + index * 0.7) * 0.5
      })));

      if (Math.random() < 0.4) {
        const availableLetters = letters.map((_, i) => i).filter(i => 
          !activeAnimations.includes(i) && 
          !flippingLetters.includes(i) && 
          letters[i]?.char !== ' '
        );
        
        if (availableLetters.length > 0) {
          const numToFlip = Math.min(1 + Math.floor(Math.random() * 3), availableLetters.length);
          const newFlipping = [];
          
          for (let i = 0; i < numToFlip; i++) {
            const randomIndex = availableLetters[Math.floor(Math.random() * availableLetters.length)];
            newFlipping.push(randomIndex);
            availableLetters.splice(availableLetters.indexOf(randomIndex), 1);
          }
          
          setFlippingLetters(newFlipping);
          
          setTimeout(() => {
            setLetters(prev => prev.map((letter, index) => {
              if (newFlipping.includes(index)) {
                // For collect theme, maintain gold constraint
                let forceGold = false;
                let avoidGold = false;
                if (theme === 'collect' && !letter.isTransparent && letter.letterType === 'card') {
                  forceGold = index === goldLetterIndex;
                  avoidGold = index !== goldLetterIndex;
                }
                
                return { 
                  ...letter, 
                  style: generateLetterStyle(letter.letterType, forceGold, avoidGold),
                  backgroundOffset: letter.char === ' ' ? 0 : (Math.random() < 0.4 ? generateBackgroundOffset() : letter.backgroundOffset)
                };
              } else {
                return letter;
              }
            }));
          }, 800);
          
          setTimeout(() => {
            setFlippingLetters(prev => prev.filter(i => !newFlipping.includes(i)));
          }, 1600);
        }
      }

      if (Math.random() < 0.1) {
        const availableLetters = letters.map((_, i) => i).filter(i => 
          !activeAnimations.includes(i) && 
          !flippingLetters.includes(i)
        );
        if (availableLetters.length > 0) {
          const numToAnimate = Math.min(1 + Math.floor(Math.random() * 2), availableLetters.length);
          const newActive = [];
          for (let i = 0; i < numToAnimate; i++) {
            const randomIndex = availableLetters[Math.floor(Math.random() * availableLetters.length)];
            newActive.push(randomIndex);
            availableLetters.splice(availableLetters.indexOf(randomIndex), 1);
          }
          setActiveAnimations(newActive);
          
          setTimeout(() => {
            setActiveAnimations(prev => prev.filter(i => !newActive.includes(i)));
          }, 4000 + Math.random() * 2000);
        }
      }
    }, 300);

    return () => clearInterval(letterInterval);
  }, [animPhase, activeAnimations, letters, flippingLetters, theme, isPaused]); // Added isPaused dependency

  const getLetterStyle = (letter: LetterState, index: number) => {
    const isActive = activeAnimations.includes(index);
    const isFlipping = flippingLetters.includes(index);
    const specialEffectMultiplier = isActive ? letter.glowIntensity * 2 : 1;
    
    const isVisible = !isSpellingOut || index < spellIndex;
    
    // Get size-based scaling - constrained to prevent overgrowth
    const getSizeScale = (size: string): number => {
      switch (size) {
        case 'small': return 0.8;
        case 'medium': return 1.0;
        case 'large': return 1.2; // Reduced from 1.3
        case 'extra-large': return 1.3; // Reduced from 1.6
        default: return 1.0;
      }
    };
    
    // Get shape-specific styles
    const getShapeStyles = (shape: string) => {
      switch (shape) {
        case 'square':
          return {
            aspectRatio: '1',
            borderRadius: '6px',
            clipPath: 'none'
          };
        case 'wide':
          return {
            width: '1.4em',
            height: '1em',
            borderRadius: '4px',
            clipPath: 'none'
          };
        case 'tall':
          return {
            width: '0.8em',
            height: '1.3em',
            borderRadius: '8px',
            clipPath: 'none'
          };
        case 'skew':
          return {
            borderRadius: '4px',
            clipPath: 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)'
          };
        default:
          return {
            borderRadius: '4px',
            clipPath: 'none'
          };
      }
    };
    
    const shapeStyles = getShapeStyles(letter.shape);
    const sizeScale = getSizeScale(letter.size);
    
    // Theme word highlighting and transparent letter handling
    const isThemeWord = letter.isThemeWord;
    const isTransparent = letter.isTransparent;
    const themeColor = isThemeWord ? getThemeHighlightColor() : letter.style.color;
    const themeWeight = isThemeWord ? 'bold' : (Math.random() > 0.4 ? 'bold' : Math.random() > 0.7 ? '900' : 'normal');
    
    // Enhanced styles for transparent letters
    const transparentStyles = isTransparent ? {
      background: 'transparent',
      fontSize: `${parseFloat(letter.style.fontSize) * sizeScale * 1.1}em`, // Slightly larger
      zIndex: 10,
      textShadow: isThemeWord 
        ? `0 0 8px ${themeColor}, 0 0 16px ${themeColor}, ${letter.style.textShadow}`
        : letter.style.textShadow
    } : {};
    
    // Equatorial gravity system - invisible horizontal center line
    const equatorCenter = 0; // Center line at 0em
    const maxDrift = 0.4; // Maximum distance from equator (±0.4em)
    const currentFloat = -letter.float + letter.backgroundOffset;
    
    // Apply equatorial gravity - pull letters back to center if they drift too far
    let constrainedFloat = currentFloat;
    if (Math.abs(currentFloat) > maxDrift) {
      const gravityStrength = 0.7; // How strong the pull back is
      const distanceFromEquator = Math.abs(currentFloat) - maxDrift;
      const pullDirection = currentFloat > 0 ? -1 : 1;
      constrainedFloat = currentFloat + (pullDirection * distanceFromEquator * gravityStrength);
    }
    
    // Pre-calculated stable values to prevent layout shifts
    const stableOffsets = {
      rotation: letter.rotation,
      float: Math.max(-maxDrift, Math.min(maxDrift, constrainedFloat)), // Constrained to equatorial range
      lean: letter.lean,
      padding: letter.char === ' ' ? '0' : '5px 6px',
      margin: letter.char === ' ' ? '0 0.3em' : '0 2px'
    };
    
    return {
      color: themeColor,
      fontFamily: letter.style.fontFamily,
      fontSize: transparentStyles.fontSize || `${parseFloat(letter.style.fontSize) * sizeScale}em`,
      background: transparentStyles.background || letter.style.backgroundColor,
      textShadow: isActive ? `
        ${letter.style.textShadow},
        0 0 ${15 * specialEffectMultiplier}px currentColor,
        0 0 ${25 * specialEffectMultiplier}px currentColor
      ` : (transparentStyles.textShadow || letter.style.textShadow),
      zIndex: transparentStyles.zIndex || 'auto',
      // Use transforms only - no layout-affecting properties
      transform: (() => {
        let baseTransform = `
          translateY(${stableOffsets.float}px)
          rotateZ(${stableOffsets.rotation}deg)
          rotateX(${stableOffsets.lean}deg)
          ${isFlipping ? `rotateY(${Math.sin(animPhase * 0.2) * 180}deg) rotateZ(${Math.sin(animPhase * 0.3) * 5}deg)` : ''}
          ${isActive ? `rotateY(${Math.sin(animPhase * 0.05 + index) * 45}deg)` : ''}
          ${isActive ? `rotateZ(${Math.sin(animPhase * 0.04 + index) * 15}deg)` : ''}
          ${isActive ? `scale(${1 + Math.sin(animPhase * 0.03 + index) * 0.2})` : ''}
          ${isSpellingOut && index === spellIndex - 1 ? 'scale(1.2)' : ''}
        `;
        
        // Add slide animation transform
        if (letter.isSliding) {
          const slideDistance = 300; // Fixed visible slide distance
          const direction = letter.slideDirection === 'left' ? -1 : 1;
          const slideX = direction * slideDistance * letter.slideProgress;
          console.log(`🎭 Letter "${letter.char}" sliding: direction=${letter.slideDirection}, progress=${letter.slideProgress.toFixed(2)}, slideX=${slideX}px`);
          baseTransform = `translateX(${slideX}px) ${baseTransform}`;
        } else {
          baseTransform = `translateX(0px) ${baseTransform}`;
        }
        
        return baseTransform;
      })(),
      filter: `brightness(${1 + (isActive ? 0.5 : 0) * Math.sin(animPhase * 0.06 + index)})`,
      padding: stableOffsets.padding,
      margin: stableOffsets.margin,
      border: 'none',
      boxShadow: 'none',
      opacity: (() => {
        if (!isVisible) return 0;
        if (letter.char === ' ') return 1;
        
        // Apply slide animation opacity
        if (letter.isSliding) {
          // During slide-off: fade out as letters move off screen
          // During slide-in: fade in as letters arrive
          if (letter.slideProgress < 0.5) {
            return 0.9 * (1 - letter.slideProgress * 2); // Fade out during first half of slide
          } else {
            return 0.9 * ((letter.slideProgress - 0.5) * 2); // Fade in during second half
          }
        }
        
        return 0.9;
      })(),
      display: letter.char === ' ' ? 'inline' : 'inline-block',
      fontWeight: themeWeight,
      fontStyle: Math.random() > 0.8 ? 'italic' : 'normal',
      textDecoration: Math.random() > 0.85 ? (Math.random() > 0.5 ? 'underline' : 'overline') : 'none',
      letterSpacing: Math.random() > 0.7 ? '0.1em' : 'normal',
      // Apply shape styles
      ...shapeStyles,
      // Layout containment to prevent shifts
      contain: 'layout style',
      willChange: 'transform',
      transition: isSpellingOut ? 'opacity 0.2s ease-in-out, transform 0.3s ease-out' : 'all 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      transformOrigin: 'center center',
    };
  };

  return (
    <div className="relative">
      {/* Typography Control */}
      {showTypographyControls && (
        <div className="absolute -top-8 right-0 z-20">
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded px-2 py-1">
            <span className="text-xs opacity-70 text-white">Typography:</span>
            {isReturningToTypography ? (
              <button
                onClick={returnToRansomNote}
                className="p-1 hover:bg-white/20 rounded transition-colors text-white"
                title="Return to ransom note"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3h18v18H3z"/>
                  <path d="M8 12h8"/>
                  <path d="M12 8v8"/>
                </svg>
              </button>
            ) : (
              <button
                onClick={transitionToTypography}
                className="p-1 hover:bg-white/20 rounded transition-colors text-white"
                title="Convert to typography"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7V4h16v3"/>
                  <path d="M9 20h6"/>
                  <path d="M12 4v16"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className={`inline-block mt-4 mb-4 ${className}`} style={{ 
        letterSpacing: '-0.05em', 
        transform: 'scale(1.0)',
        lineHeight: '1.4',
        contain: 'layout',
        height: '1.5em', // Fixed baseline height to prevent layout shifts
        overflow: 'visible',
        position: 'relative'
      }}>
        {letters.map((letter, index) => (
          <span
            key={`${index}-${animationKey}-${theme}`}
            className={`inline-block ${isReturningToTypography ? 'gradient-text-green-blue-purple font-bold' : ''}`}
            style={{
              position: 'relative',
              minWidth: letter.char === ' ' ? '0.25em' : '0.8em',
              minHeight: '1.3em',
              maxHeight: '2.5em', // Baseline constraint
              verticalAlign: 'top',
              contain: 'layout style',
              textAlign: 'center',
              ...getLetterStyle(letter, index)
            }}
          >
            {letter.char}
          </span>
        ))}
      </div>
    </div>
  );
};