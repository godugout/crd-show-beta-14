
import { useState, useCallback } from 'react';
import type { Animated3DVariant } from '@/components/hero/Animated3DBackground';

const presets = {
  subtle: { opacity: [15], speed: [0.5], scale: [80], blur: [2] },
  normal: { opacity: [25], speed: [1], scale: [100], blur: [0] },
  dramatic: { opacity: [40], speed: [1.5], scale: [120], blur: [0] },
  ethereal: { opacity: [20], speed: [0.8], scale: [90], blur: [5] },
};

export const useStyleTesterState = () => {
  const [activeVariant, setActiveVariant] = useState<Animated3DVariant>('panels');
  const [opacity, setOpacity] = useState([25]);
  const [speed, setSpeed] = useState([1]);
  const [scale, setScale] = useState([100]);
  const [blur, setBlur] = useState([0]);
  const [mouseInteraction, setMouseInteraction] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);

  const applyPreset = useCallback((preset: keyof typeof presets) => {
    const settings = presets[preset];
    setOpacity(settings.opacity);
    setSpeed(settings.speed);
    setScale(settings.scale);
    setBlur(settings.blur);
  }, []);

  const resetToDefaults = useCallback(() => {
    setOpacity([25]);
    setSpeed([1]);
    setScale([100]);
    setBlur([0]);
    setMouseInteraction(true);
    setAutoRotate(false);
  }, []);

  return {
    activeVariant,
    setActiveVariant,
    opacity,
    setOpacity,
    speed,
    setSpeed,
    scale,
    setScale,
    blur,
    setBlur,
    mouseInteraction,
    setMouseInteraction,
    autoRotate,
    setAutoRotate,
    applyPreset,
    resetToDefaults
  };
};
