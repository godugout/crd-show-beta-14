import React, { useEffect, useState } from 'react';

interface GlitchyArtProps {
  children: string;
  className?: string;
}

export const GlitchyArt: React.FC<GlitchyArtProps> = ({ 
  children, 
  className = "" 
}) => {
  const [currentVariation, setCurrentVariation] = useState(0);
  const [animPhase, setAnimPhase] = useState(0);

  useEffect(() => {
    // Switch variations every 5 seconds
    const variationInterval = setInterval(() => {
      setCurrentVariation(prev => (prev + 1) % 4);
    }, 5000);

    // Fast animation phases for glitch effects
    const phaseInterval = setInterval(() => {
      setAnimPhase(prev => prev + 1);
    }, 100);

    return () => {
      clearInterval(variationInterval);
      clearInterval(phaseInterval);
    };
  }, []);

  // Variation 1: Matrix Green - Gentle pulse and glow
  const matrixStyle = () => {
    const glow = Math.sin(animPhase * 0.03) * 1 + 4; // Reduced glow
    return {
      color: '#00ff00',
      fontFamily: "'Fira Code', 'Source Code Pro', monospace",
      fontSize: '1.05em', // Slight increase for monospace
      textShadow: `
        0 0 ${glow}px #00ff00,
        0 0 ${glow * 1.5}px #00dd00,
        0 0 ${glow * 2}px rgba(0, 255, 0, 0.2)
      `,
      filter: `brightness(1) contrast(1.02)`,
      transform: `scale(1)`,
      transformOrigin: 'center',
    };
  };

  // Variation 2: Cyberpunk Neon - Slow color breathing
  const cyberpunkStyle = () => {
    const hue = (animPhase * 0.5) % 360; // Slower color cycling
    const saturation = 85 + Math.sin(animPhase * 0.06) * 8; // Gentle saturation
    return {
      color: `hsl(${hue}, ${saturation}%, 70%)`,
      fontFamily: "'Exo 2', sans-serif",
      fontSize: '0.9em', // Reduce sans-serif size
      textShadow: `
        0 0 6px hsl(${hue}, 100%, 50%),
        0 0 10px hsl(${(hue + 30) % 360}, 80%, 60%),
        0 0 15px rgba(255, 255, 255, 0.1)
      `,
      filter: `saturate(1.2) brightness(1)`,
      transform: `scale(1)`,
    };
  };

  // Variation 3: Holographic Rainbow - Gentle shimmer
  const holographicStyle = () => {
    const shift = Math.sin(animPhase * 0.02) * 0.5; // Subtle shift
    return {
      color: '#ffffff',
      fontFamily: "'Audiowide', cursive",
      fontSize: '0.85em', // Reduce display font size
      textShadow: `
        ${shift}px 0 0 rgba(255, 0, 0, 0.7),
        ${shift * 1.2}px 0 0 rgba(255, 119, 0, 0.6),
        ${shift * 1.5}px 0 0 rgba(255, 255, 0, 0.5),
        ${shift * 1.8}px 0 0 rgba(0, 255, 0, 0.4),
        ${shift * 2}px 0 0 rgba(0, 119, 255, 0.5),
        ${shift * 2.2}px 0 0 rgba(136, 0, 255, 0.4),
        0 0 8px rgba(255, 255, 255, 0.5)
      `,
      filter: `brightness(1.1) contrast(1.02)`,
      transform: `translateX(${shift * 0.3}px) scale(1)`,
    };
  };

  // Variation 4: 8-bit Retro - Gentle vibration
  const retro8BitStyle = () => {
    const vibration = Math.sin(animPhase * 0.3) * 0.1; // Reduced vibration
    const chromatic = Math.sin(animPhase * 0.07) * 0.2; // Reduced chromatic aberration
    return {
      color: '#00ff00',
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '0.75em', // Much smaller pixel font to match others
      textShadow: `
        ${chromatic}px 0 0 rgba(255, 0, 64, 0.4),
        ${-chromatic * 0.5}px 0 0 rgba(0, 255, 255, 0.3),
        0 0 4px rgba(0, 255, 0, 0.6)
      `,
      filter: `contrast(1) brightness(1) saturate(1)`,
      transform: `
        translateX(${vibration}px)
        translateY(${vibration * 0.5}px)
        scale(1)
      `,
      transformOrigin: 'center',
    };
  };

  const variations = [matrixStyle, cyberpunkStyle, holographicStyle, retro8BitStyle];
  const currentStyle = variations[currentVariation]();

  return (
    <span 
      className={`relative inline-block tracking-wider font-bold transition-all duration-300 ${className}`}
      style={{
        ...currentStyle,
        transitionProperty: 'color, text-shadow, filter, transform',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        lineHeight: '1',
        verticalAlign: 'baseline',
        display: 'inline-block',
        height: '1em',
        width: 'auto',
        boxSizing: 'border-box',
        overflow: 'visible',
      }}
    >
      {children}
    </span>
  );
};