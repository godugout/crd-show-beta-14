import React from 'react';

export type TextEffectStyle = 'gradient' | 'holographic' | 'neon' | 'metallic' | 'crystalline';
export type TextAnimation = 'none' | 'glow' | 'pulse' | 'shimmer' | 'wave' | 'typing';

interface TextEffects3DProps {
  children: React.ReactNode;
  style: TextEffectStyle;
  animation: TextAnimation;
  intensity: number;
  speed: number;
  glowEnabled: boolean;
}

const textEffectStyles = {
  gradient: 'bg-gradient-to-r from-crd-green via-crd-blue to-crd-purple bg-clip-text text-transparent',
  holographic: 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent',
  neon: 'text-crd-green',
  metallic: 'bg-gradient-to-r from-gray-300 via-gray-100 to-gray-400 bg-clip-text text-transparent',
  crystalline: 'bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 bg-clip-text text-transparent'
};

const glowStyles = {
  gradient: 'drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]',
  holographic: 'drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]',
  neon: 'drop-shadow-[0_0_20px_rgba(34,197,94,0.8)] drop-shadow-[0_0_40px_rgba(34,197,94,0.4)]',
  metallic: 'drop-shadow-[0_0_15px_rgba(156,163,175,0.5)]',
  crystalline: 'drop-shadow-[0_0_25px_rgba(99,102,241,0.6)]'
};

export const TextEffects3D: React.FC<TextEffects3DProps> = ({
  children,
  style,
  animation,
  intensity,
  speed,
  glowEnabled
}) => {
  const baseClasses = textEffectStyles[style];
  const glowClass = glowEnabled ? glowStyles[style] : '';
  
  const animationClasses = {
    none: '',
    glow: 'animate-pulse',
    pulse: 'animate-pulse',
    shimmer: 'animate-shimmer',
    wave: 'animate-wave',
    typing: 'animate-typing'
  };

  const intensityOpacity = Math.max(0.3, Math.min(1, intensity));
  const animationDuration = Math.max(0.5, Math.min(3, 2 / speed));

  const customStyles = {
    opacity: intensityOpacity,
    animationDuration: animation !== 'none' ? `${animationDuration}s` : undefined,
    transform: animation === 'wave' ? 'perspective(500px) rotateX(15deg)' : undefined,
    textShadow: style === 'neon' && glowEnabled 
      ? `0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor`
      : undefined
  };

  return (
    <span 
      className={`
        ${baseClasses} 
        ${glowClass} 
        ${animationClasses[animation]}
        font-bold
        transition-all duration-300
      `}
      style={customStyles}
    >
      {children}
    </span>
  );
};