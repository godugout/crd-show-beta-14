
import { useEffect, useRef } from 'react';
import { useGlobalSecretEffects } from '@/contexts/GlobalSecretEffectsContext';

interface InteractiveElementOptions {
  elementId: string;
  effectType?: 'text' | 'visual' | 'both';
  customEffects?: Record<string, any>;
}

export const useInteractiveElements = ({
  elementId,
  effectType = 'both',
  customEffects = {}
}: InteractiveElementOptions) => {
  const elementRef = useRef<HTMLElement>(null);
  const {
    interactiveMode,
    setHoveredElement,
    textStyle,
    animation,
    intensity,
    speed,
    glowEnabled,
    visualEffects
  } = useGlobalSecretEffects();

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !interactiveMode) return;

    const handleMouseEnter = () => {
      setHoveredElement(elementId);
      
      // Add glow outline
      element.style.transition = 'all 0.3s ease';
      element.style.outline = '2px solid hsl(var(--crd-green))';
      element.style.outlineOffset = '2px';
      element.style.boxShadow = '0 0 20px hsl(var(--crd-green) / 0.5)';
      
      // Apply text effects if applicable
      if ((effectType === 'text' || effectType === 'both') && element.textContent) {
        if (glowEnabled) {
          element.style.textShadow = '0 0 10px hsl(var(--crd-green)), 0 0 20px hsl(var(--crd-green))';
        }
        
        // Apply animation classes based on current settings
        const animationClass = animation !== 'none' ? `animate-${animation}` : '';
        if (animationClass) {
          element.classList.add(animationClass);
        }
      }
      
      // Apply visual effects if applicable
      if (effectType === 'visual' || effectType === 'both') {
        if (visualEffects.holographic?.enabled) {
          element.style.background = 'linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #ff0080)';
          element.style.backgroundSize = '400% 400%';
          element.style.animation = 'gradient-shift 3s ease infinite';
        }
      }
    };

    const handleMouseLeave = () => {
      setHoveredElement(null);
      
      // Remove effects
      element.style.outline = '';
      element.style.outlineOffset = '';
      element.style.boxShadow = '';
      element.style.textShadow = '';
      element.style.background = '';
      element.style.backgroundSize = '';
      element.style.animation = '';
      
      // Remove animation classes
      element.classList.remove('animate-glow', 'animate-pulse', 'animate-shimmer', 'animate-wave');
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [interactiveMode, elementId, effectType, textStyle, animation, intensity, speed, glowEnabled, visualEffects, setHoveredElement]);

  return elementRef;
};
