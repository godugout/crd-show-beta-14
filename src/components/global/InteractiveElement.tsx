
import React, { forwardRef } from 'react';
import { useInteractiveElements } from '@/hooks/useInteractiveElements';
import { useGlobalSecretEffects } from '@/contexts/GlobalSecretEffectsContext';
import { TextEffects3D } from '@/components/hero/TextEffects3D';

interface InteractiveElementProps {
  children: React.ReactNode;
  elementId: string;
  effectType?: 'text' | 'visual' | 'both';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  customEffects?: Record<string, any>;
}

export const InteractiveElement = forwardRef<HTMLElement, InteractiveElementProps>(({
  children,
  elementId,
  effectType = 'both',
  className = '',
  as: Component = 'div',
  customEffects = {},
  ...props
}, ref) => {
  const elementRef = useInteractiveElements({ elementId, effectType, customEffects });
  const {
    isEnabled,
    interactiveMode,
    textStyle,
    animation,
    intensity,
    speed,
    glowEnabled,
    hoveredElement
  } = useGlobalSecretEffects();

  const isHovered = hoveredElement === elementId;
  const shouldApplyEffects = isEnabled && (interactiveMode || isHovered);

  // Merge refs
  const mergedRef = (element: HTMLElement | null) => {
    if (elementRef.current !== element) {
      (elementRef as React.MutableRefObject<HTMLElement | null>).current = element;
    }
    if (typeof ref === 'function') {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };

  // Apply text effects if enabled and applicable
  const renderContent = () => {
    if (shouldApplyEffects && (effectType === 'text' || effectType === 'both') && typeof children === 'string') {
      return (
        <TextEffects3D
          style={textStyle}
          animation={animation}
          intensity={intensity}
          speed={speed}
          glowEnabled={glowEnabled}
        >
          {children}
        </TextEffects3D>
      );
    }
    return children;
  };

  return React.createElement(
    Component,
    {
      ref: mergedRef,
      className: `${className} ${shouldApplyEffects ? 'interactive-element-active' : ''}`,
      'data-interactive-id': elementId,
      ...props
    },
    renderContent()
  );
});

InteractiveElement.displayName = 'InteractiveElement';
