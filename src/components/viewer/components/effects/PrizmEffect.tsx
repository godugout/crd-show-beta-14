
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface PrizmEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const PrizmEffect: React.FC<PrizmEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const prizmIntensity = getEffectParam('prizm', 'intensity', 0);
  const complexity = getEffectParam('prizm', 'complexity', 5);
  const colorSeparation = getEffectParam('prizm', 'colorSeparation', 60);

  if (prizmIntensity <= 0) return null;

  // Much more subtle opacity for glass refraction look
  const baseOpacity = Math.min(0.15, (prizmIntensity / 100) * 0.12);
  const secondaryOpacity = Math.min(0.08, (prizmIntensity / 100) * 0.06);

  // Subtle refraction colors - like light passing through glass
  const refractionColors = [
    `rgba(255, 220, 220, ${baseOpacity * 0.8})`,    // Soft red
    `rgba(255, 240, 200, ${baseOpacity})`,          // Warm yellow
    `rgba(220, 255, 220, ${baseOpacity})`,          // Soft green
    `rgba(200, 240, 255, ${baseOpacity})`,          // Light blue
    `rgba(230, 220, 255, ${baseOpacity * 0.7})`     // Gentle violet
  ];

  // Mouse influence for subtle directional refraction
  const lightAngle = Math.atan2(mousePosition.y - 0.5, mousePosition.x - 0.5) * (180 / Math.PI);
  const dispersal = (complexity / 10) * 30; // Spread based on complexity

  return (
    <>
      {/* Primary Refraction Layer - Soft spectrum dispersal */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            radial-gradient(
              ellipse 80% 60% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              ${refractionColors[0]} 0%,
              ${refractionColors[1]} 25%,
              ${refractionColors[2]} 50%,
              ${refractionColors[3]} 75%,
              transparent 100%
            )
          `,
          mixBlendMode: 'overlay',
          filter: 'blur(0.5px)'
        }}
      />

      {/* Secondary Dispersal Layer - Color separation effect */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            linear-gradient(
              ${lightAngle + dispersal}deg,
              transparent 30%,
              ${refractionColors[1]} 45%,
              ${refractionColors[2]} 50%,
              ${refractionColors[3]} 55%,
              transparent 70%
            )
          `,
          opacity: secondaryOpacity * (colorSeparation / 100),
          mixBlendMode: 'soft-light'
        }}
      />

      {/* Tertiary Layer - Gentle color bleeding */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            radial-gradient(
              circle at ${30 + mousePosition.x * 40}% ${30 + mousePosition.y * 40}%,
              ${refractionColors[2]} 0%,
              transparent 40%
            ),
            radial-gradient(
              circle at ${70 + mousePosition.x * 20}% ${70 + mousePosition.y * 20}%,
              ${refractionColors[3]} 0%,
              transparent 35%
            )
          `,
          opacity: baseOpacity * 0.6,
          mixBlendMode: 'color-dodge',
          filter: `blur(${Math.max(0.5, (10 - complexity) * 0.3)}px)`
        }}
      />

      {/* Subtle Edge Refraction - Like light bending at glass edges */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            linear-gradient(
              ${lightAngle - dispersal * 0.5}deg,
              transparent 0%,
              ${refractionColors[0]} 20%,
              transparent 25%,
              ${refractionColors[4]} 75%,
              transparent 80%
            )
          `,
          opacity: secondaryOpacity * 0.8,
          mixBlendMode: 'multiply'
        }}
      />
    </>
  );
};
