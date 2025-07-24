import React, { useEffect, useState } from 'react';

interface RansomNoteProps {
  children: string;
  className?: string;
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
}

interface LetterStyle {
  color: string;
  fontFamily: string;
  fontSize: string;
  backgroundColor: string;
  textShadow: string;
}

export const RansomNote: React.FC<RansomNoteProps> = ({ 
  children, 
  className = "" 
}) => {
  const [letters, setLetters] = useState<LetterState[]>([]);
  const [animPhase, setAnimPhase] = useState(0);
  const [activeAnimations, setActiveAnimations] = useState<number[]>([]);
  const [animationKey, setAnimationKey] = useState(0);
  const [isSpellingOut, setIsSpellingOut] = useState(false);
  const [spellIndex, setSpellIndex] = useState(0);
  const [flippingLetters, setFlippingLetters] = useState<number[]>([]);

  // Enhanced text colors with vibrant and grayscale options
  const textColors = [
    '#ffffff', '#000000', '#1a1a1a', '#f5f5f5', '#2d2d2d', '#e8e8e8',
    '#ff1744', '#00e676', '#2196f3', '#ffeb3b', '#e91e63', '#9c27b0',
    '#ff5722', '#00bcd4', '#ffd700', '#c0392b', '#34495e', '#8e44ad',
    '#666666', '#999999', '#cccccc', '#333333'
  ];

  // Enhanced font families prioritizing square/blocky typography
  const fontFamilies = [
    'Arial Black', 'Impact', 'Helvetica Bold', 'Futura Bold', 'Franklin Gothic Heavy',
    'Trebuchet MS', 'Verdana Bold', 'Century Gothic', 'Bebas Neue', 'Roboto Condensed',
    'Oswald', 'Anton', 'Squada One', 'Orbitron', 'Exo 2',
    'Rajdhani', 'Russo One', 'Play', 'Quantico', 'Michroma'
  ];

  // Enhanced background patterns and textures inspired by classic ransom notes
  const backgroundStyles = [
    // Classic solid colors with pop art vibes
    { background: 'hsl(var(--crd-green))', pattern: 'solid' },
    { background: 'hsl(var(--crd-blue))', pattern: 'solid' },
    { background: 'hsl(var(--crd-purple))', pattern: 'solid' },
    { background: 'hsl(var(--crd-orange))', pattern: 'solid' },
    
    // Ultra-vibrant electric colors
    { background: '#ff1744', pattern: 'solid' }, // Electric red
    { background: '#00e676', pattern: 'solid' }, // Neon green
    { background: '#2196f3', pattern: 'solid' }, // Electric blue
    { background: '#ffeb3b', pattern: 'solid' }, // Neon yellow
    { background: '#e91e63', pattern: 'solid' }, // Hot pink
    { background: '#9c27b0', pattern: 'solid' }, // Vivid purple
    { background: '#ff5722', pattern: 'solid' }, // Electric orange
    { background: '#00bcd4', pattern: 'solid' }, // Cyan
    { background: '#ff0080', pattern: 'solid' }, // Fluorescent pink
    { background: '#00ff80', pattern: 'solid' }, // Fluorescent green
    { background: '#8000ff', pattern: 'solid' }, // Electric violet
    { background: '#ff4000', pattern: 'solid' }, // Atomic red
    { background: '#0080ff', pattern: 'solid' }, // Electric sky blue
    { background: '#ffff00', pattern: 'solid' }, // Pure yellow
    
    // Grayscale newspaper style
    { background: '#000000', pattern: 'black' },
    { background: '#1a1a1a', pattern: 'dark-gray' },
    { background: '#333333', pattern: 'gray' },
    { background: '#666666', pattern: 'medium-gray' },
    { background: '#999999', pattern: 'light-gray' },
    { background: '#cccccc', pattern: 'very-light-gray' },
    { background: '#e8e8e8', pattern: 'newspaper-gray' },
    { background: '#f5f5f5', pattern: 'off-white' },
    { background: '#ffffff', pattern: 'white' },
    
    // Metallic and glossy effects
    { background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)', pattern: 'metallic-gold' },
    { background: 'linear-gradient(135deg, #c0392b 0%, #e74c3c 50%, #c0392b 100%)', pattern: 'metallic-red' },
    { background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)', pattern: 'metallic-dark' },
    { background: 'linear-gradient(135deg, #8e44ad 0%, #9b59b6 50%, #8e44ad 100%)', pattern: 'metallic-purple' },
    { background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 50%, #27ae60 100%)', pattern: 'metallic-green' },
    
    // Paper and magazine textures
    { background: 'linear-gradient(45deg, #f5f5dc 0%, #f0f0f0 25%, #f5f5dc 50%, #e8e8e8 75%, #f5f5dc 100%)', pattern: 'newspaper' },
    { background: 'linear-gradient(90deg, #fff8dc 0%, #faebd7 50%, #fff8dc 100%)', pattern: 'vintage-paper' },
    { background: 'linear-gradient(180deg, #fffacd 0%, #f0e68c 100%)', pattern: 'aged-paper' },
    
    // Fabric and textured patterns
    { background: 'radial-gradient(circle at 25% 25%, #ff6b6b 0%, #ff8e53 100%)', pattern: 'fabric-1' },
    { background: 'conic-gradient(from 0deg, #667eea, #764ba2, #667eea)', pattern: 'fabric-2' },
    { background: 'linear-gradient(45deg, #fa709a 0%, #fee140 100%)', pattern: 'fabric-3' },
    
    // Bold pop art patterns
    { background: 'repeating-linear-gradient(45deg, #ff1744, #ff1744 8px, #ffffff 8px, #ffffff 16px)', pattern: 'pop-stripes-1' },
    { background: 'repeating-linear-gradient(90deg, #00e676, #00e676 12px, #000000 12px, #000000 24px)', pattern: 'pop-stripes-2' },
    { background: 'repeating-linear-gradient(0deg, #2196f3, #2196f3 10px, #ffeb3b 10px, #ffeb3b 20px)', pattern: 'pop-stripes-3' },
    
    // Halftone and comic book effects
    { background: 'radial-gradient(circle at 20% 50%, #e91e63 20%, transparent 50%), radial-gradient(circle at 70% 50%, #e91e63 20%, transparent 50%), #ffffff', pattern: 'halftone-1' },
    { background: 'radial-gradient(circle at 30% 30%, #9c27b0 25%, transparent 50%), radial-gradient(circle at 80% 80%, #9c27b0 25%, transparent 50%), #f0f0f0', pattern: 'halftone-2' },
    { background: 'radial-gradient(circle at 40% 20%, #ff5722 15%, transparent 40%), radial-gradient(circle at 60% 80%, #ff5722 15%, transparent 40%), #fffde7', pattern: 'halftone-3' },
    
    // Chrome and holographic effects
    { background: 'linear-gradient(45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)', pattern: 'holographic' },
    { background: 'linear-gradient(90deg, #a8edea 0%, #fed6e3 100%)', pattern: 'pastel-dream' },
    { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', pattern: 'electric-blue' },
    
    // High contrast pop art
    { background: '#000000', pattern: 'black' },
    { background: '#ffffff', pattern: 'white' },
    { background: 'linear-gradient(45deg, #000000 25%, transparent 25%), linear-gradient(-45deg, #000000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000000 75%), linear-gradient(-45deg, transparent 75%, #000000 75%)', pattern: 'checkerboard' },
  ];

  // Enhanced contrast checking function
  const getContrastingColor = (bgColor: string): string => {
    // For dark backgrounds, use light text
    const darkBgs = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#6c5ce7', '#eb4d4b', '#f0932b'];
    const lightBgs = ['#f9ca24', '#f5f5dc', '#faf0e6', '#fff8dc', '#ffffff', '#f8f9fa'];
    
    if (bgColor.includes('gradient') || bgColor.includes('repeating')) {
      return Math.random() > 0.5 ? '#ffffff' : '#000000';
    }
    
    const isDark = darkBgs.some(color => bgColor.includes(color)) || 
                   bgColor.includes('--crd-') || 
                   (bgColor.includes('#') && !lightBgs.some(color => bgColor.includes(color)));
    
    return isDark ? '#ffffff' : '#000000';
  };

  const generateLetterStyle = (): LetterStyle => {
    const bgStyle = backgroundStyles[Math.floor(Math.random() * backgroundStyles.length)];
    const textColor = getContrastingColor(bgStyle.background);
    
    // Enhanced decorative effects
    const decorations = [
      'none',
      '2px 2px 4px rgba(0,0,0,0.3)',
      '1px 1px 2px rgba(255,255,255,0.8)',
      '0 0 3px rgba(0,0,0,0.5)',
      'inset 0 1px 0 rgba(255,255,255,0.2)',
    ];

    return {
      color: textColor,
      fontFamily: fontFamilies[Math.floor(Math.random() * fontFamilies.length)],
      fontSize: `${1.2 + Math.random() * 1.0}em`, // 1.2em to 2.2em for dramatic size variation
      backgroundColor: bgStyle.background,
      textShadow: decorations[Math.floor(Math.random() * decorations.length)]
    };
  };

  useEffect(() => {
    // Initialize letters with animation states
    const initializeLetters = () => {
      const newLetters = children.split('').map(char => ({
        char,
        isAnimating: false,
        animationType: 'float' as const,
        animationProgress: 0,
        rotation: Math.random() * 40 - 20, // Increased from ±5 to ±20 degrees
        float: Math.random() * 4,
        lean: Math.random() * 20 - 10, // Increased lean for more dramatic angles
        glowIntensity: 0.5 + Math.random() * 0.5,
        style: generateLetterStyle()
      }));
      setLetters(newLetters);
    };

    initializeLetters();
  }, [children]);

  useEffect(() => {
    // Switch variations every 8 seconds (slower transitions)
    const variationInterval = setInterval(() => {
      // Decide if we should do a spell-out animation (30% chance)
      if (Math.random() < 0.3) {
        // Start spell-out animation
        setIsSpellingOut(true);
        setSpellIndex(0);
        setActiveAnimations([]);
        
        // Hide all letters initially for spell-out
        setLetters(prev => prev.map(letter => ({
          ...letter,
          style: generateLetterStyle()
        })));
      } else {
        // Regular style change
        setAnimationKey(prev => prev + 1);
        setActiveAnimations([]);
        setIsSpellingOut(false);
        
        // Regenerate all letter styles
        setLetters(prev => prev.map(letter => ({
          ...letter,
          style: generateLetterStyle()
        })));
      }
    }, 8000);

    // Slower animation phases for effects
    const phaseInterval = setInterval(() => {
      setAnimPhase(prev => prev + 1);
    }, 200);

    return () => {
      clearInterval(variationInterval);
      clearInterval(phaseInterval);
    };
  }, []);

  // Handle spell-out animation
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
      }, 400); // 400ms between each letter

      return () => clearInterval(spellInterval);
    }
  }, [isSpellingOut, children.length]);

  // Manage individual letter animations and card flips
  useEffect(() => {
    const letterInterval = setInterval(() => {
      setLetters(prev => prev.map((letter, index) => ({
        ...letter,
        rotation: letter.rotation + (Math.sin(animPhase * 0.02 + index) * 0.5), // More dramatic rotation changes
        float: 2 + Math.sin(animPhase * 0.025 + index * 0.5) * 4, // Much more pronounced floating
        lean: Math.sin(animPhase * 0.018 + index * 0.3) * 8, // Dramatically increased lean movement
        glowIntensity: 0.5 + Math.sin(animPhase * 0.03 + index * 0.7) * 0.5
      })));

      // Card flip animations - More frequent with 1-3 letters flip and change style every loop
      if (Math.random() < 0.4) { // Increased from 0.2 to 0.4 for more frequent changes
        const availableLetters = letters.map((_, i) => i).filter(i => 
          !activeAnimations.includes(i) && 
          !flippingLetters.includes(i) && 
          letters[i]?.char !== ' '
        );
        
        if (availableLetters.length > 0) {
          const numToFlip = Math.min(1 + Math.floor(Math.random() * 3), availableLetters.length); // 1-3 letters
          const newFlipping = [];
          
          for (let i = 0; i < numToFlip; i++) {
            const randomIndex = availableLetters[Math.floor(Math.random() * availableLetters.length)];
            newFlipping.push(randomIndex);
            availableLetters.splice(availableLetters.indexOf(randomIndex), 1);
          }
          
          setFlippingLetters(newFlipping);
          
          // After 800ms (mid-flip), change the letter style
          setTimeout(() => {
            setLetters(prev => prev.map((letter, index) => 
              newFlipping.includes(index) 
                ? { ...letter, style: generateLetterStyle() }
                : letter
            ));
          }, 800);
          
          // Clear flipping state after full animation
          setTimeout(() => {
            setFlippingLetters(prev => prev.filter(i => !newFlipping.includes(i)));
          }, 1600);
        }
      }

      // Regular special effects (separate from flips)
      if (Math.random() < 0.1) {
        const availableLetters = letters.map((_, i) => i).filter(i => 
          !activeAnimations.includes(i) && 
          !flippingLetters.includes(i)
        );
        if (availableLetters.length > 0) {
          const numToAnimate = Math.min(1 + Math.floor(Math.random() * 2), availableLetters.length); // 1-2 letters max
          const newActive = [];
          for (let i = 0; i < numToAnimate; i++) {
            const randomIndex = availableLetters[Math.floor(Math.random() * availableLetters.length)];
            newActive.push(randomIndex);
            availableLetters.splice(availableLetters.indexOf(randomIndex), 1);
          }
          setActiveAnimations(newActive);
          
          // Longer duration for special animations (4-6 seconds)
          setTimeout(() => {
            setActiveAnimations(prev => prev.filter(i => !newActive.includes(i)));
          }, 4000 + Math.random() * 2000);
        }
      }
    }, 300); // Slower update interval

    return () => clearInterval(letterInterval);
  }, [animPhase, activeAnimations, letters, flippingLetters]);

  const getLetterStyle = (letter: LetterState, index: number) => {
    const isActive = activeAnimations.includes(index);
    const isFlipping = flippingLetters.includes(index);
    const specialEffectMultiplier = isActive ? letter.glowIntensity * 2 : 1;
    
    // Handle spell-out visibility
    const isVisible = !isSpellingOut || index < spellIndex;
    
    // Enhanced styling for each letter
    const randomBorder = Math.random() > 0.7 ? 
      `${Math.floor(Math.random() * 2) + 1}px ${Math.random() > 0.5 ? 'solid' : 'dashed'} rgba(0,0,0,0.3)` : 
      'none';
    const randomRadius = Math.random() > 0.6 ? 
      `${Math.floor(Math.random() * 8) + 2}px` : 
      `${Math.floor(Math.random() * 3)}px`;
    const randomShadow = Math.random() > 0.7 ? 
      `${Math.floor(Math.random() * 3) + 1}px ${Math.floor(Math.random() * 3) + 1}px ${Math.floor(Math.random() * 5) + 2}px rgba(0,0,0,0.4)` : 
      'none';
    
    return {
      color: letter.style.color,
      fontFamily: letter.style.fontFamily,
      fontSize: letter.style.fontSize,
      background: letter.style.backgroundColor,
      textShadow: isActive ? `
        ${letter.style.textShadow},
        0 0 ${15 * specialEffectMultiplier}px currentColor,
        0 0 ${25 * specialEffectMultiplier}px currentColor
      ` : letter.style.textShadow,
      transform: `
        rotateZ(${letter.rotation}deg)
        rotateX(${letter.lean}deg)
        translateY(${-letter.float}px)
        ${isFlipping ? `rotateY(${Math.sin(animPhase * 0.05) * 180}deg)` : ''}
        ${isActive ? `rotateY(${Math.sin(animPhase * 0.05 + index) * 45}deg)` : ''}
        ${isActive ? `rotateZ(${Math.sin(animPhase * 0.04 + index) * 15}deg)` : ''}
        ${isActive ? `scale(${1 + Math.sin(animPhase * 0.03 + index) * 0.2})` : ''}
        ${isActive ? `translateZ(${Math.sin(animPhase * 0.06 + index) * 10}px)` : ''}
        ${isSpellingOut && index === spellIndex - 1 ? 'scale(1.2)' : ''}
      `,
      filter: `brightness(${1 + (isActive ? 0.5 : 0) * Math.sin(animPhase * 0.06 + index)})`,
      padding: letter.char === ' ' ? '0' : `${4 + Math.floor(Math.random() * 4)}px ${6 + Math.floor(Math.random() * 4)}px`,
      margin: letter.char === ' ' ? '0 0.4em' : `0 ${2 + Math.floor(Math.random() * 3)}px`,
      borderRadius: randomRadius,
      border: randomBorder,
      boxShadow: randomShadow,
      opacity: isVisible ? (letter.char === ' ' ? 1 : 0.9) : 0,
      display: letter.char === ' ' ? 'inline' : 'inline-block',
      fontWeight: Math.random() > 0.4 ? 'bold' : Math.random() > 0.7 ? '900' : 'normal',
      fontStyle: Math.random() > 0.8 ? 'italic' : 'normal',
      textDecoration: Math.random() > 0.85 ? (Math.random() > 0.5 ? 'underline' : 'overline') : 'none',
      position: 'relative' as const,
      top: `${(Math.random() - 0.5) * 6}px`,
      left: `${(Math.random() - 0.5) * 2}px`,
      zIndex: Math.floor(Math.random() * 3) + 1,
      transition: isSpellingOut ? 'opacity 0.2s ease-in-out, transform 0.3s ease-out' : 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      transformOrigin: 'center center',
    };
  };

  return (
    <span className={`inline-block mt-8 scale-125 ${className}`} style={{ letterSpacing: '0.15em', transform: 'scale(1.3)' }}>
      {letters.map((letter, index) => (
        <span
          key={`${index}-${animationKey}`}
          className="inline-block transition-all duration-1000 ease-in-out"
          style={getLetterStyle(letter, index)}
        >
          {letter.char}
        </span>
      ))}
    </span>
  );
};