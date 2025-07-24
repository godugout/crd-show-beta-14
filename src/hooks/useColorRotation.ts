import { useState, useCallback } from 'react';
import { useTeamTheme } from './useTeamTheme';
import type { TeamPalette } from '@/lib/teamPalettes';

export type GlassLevel = 'ultra-light' | 'light' | 'medium' | 'dark' | 'default';
export type ColorRotation = 0 | 1 | 2 | 3;
export type HueShift = 0 | 30 | 60 | 90 | 120 | 180 | 240 | 300;

interface ColorRotationState {
  glassLevel: GlassLevel;
  colorRotation: ColorRotation;
  hueShift: HueShift;
  isColorCycling: boolean;
}

export const useColorRotation = () => {
  const { currentPalette, applyTheme } = useTeamTheme();
  const [rotationState, setRotationState] = useState<ColorRotationState>({
    glassLevel: 'default',
    colorRotation: 0,
    hueShift: 0,
    isColorCycling: false
  });

  // Apply glass level to navbar
  const setGlassLevel = useCallback((level: GlassLevel) => {
    const navbar = document.querySelector('.navbar-themed, .glass-navbar, [data-navbar]');
    if (!navbar) return;

    // Remove existing glass classes
    navbar.classList.remove(
      'glass-navbar',
      'glass-navbar-ultra-light',
      'glass-navbar-light', 
      'glass-navbar-medium',
      'glass-navbar-dark'
    );

    // Apply new glass level
    if (level === 'default') {
      navbar.classList.add('glass-navbar');
    } else {
      navbar.classList.add(`glass-navbar-${level}`);
    }

    setRotationState(prev => ({ ...prev, glassLevel: level }));
    console.log(`Glass level applied: ${level}`);
  }, []);

  // Rotate colors in palette (swap primary, secondary, accent, neutral)
  const rotateColors = useCallback((rotation: ColorRotation) => {
    if (!currentPalette) return;

    const { colors, hsl } = currentPalette;
    let rotatedPalette: TeamPalette;

    switch (rotation) {
      case 1: // Rotate once: secondary -> primary, accent -> secondary, neutral -> accent, primary -> neutral
        rotatedPalette = {
          ...currentPalette,
          colors: {
            primary: colors.secondary,
            secondary: colors.accent,
            accent: colors.neutral,
            neutral: colors.primary
          },
          hsl: {
            primary: hsl.secondary,
            secondary: hsl.accent,
            accent: hsl.neutral,
            neutral: hsl.primary
          }
        };
        break;
      case 2: // Rotate twice
        rotatedPalette = {
          ...currentPalette,
          colors: {
            primary: colors.accent,
            secondary: colors.neutral,
            accent: colors.primary,
            neutral: colors.secondary
          },
          hsl: {
            primary: hsl.accent,
            secondary: hsl.neutral,
            accent: hsl.primary,
            neutral: hsl.secondary
          }
        };
        break;
      case 3: // Rotate three times
        rotatedPalette = {
          ...currentPalette,
          colors: {
            primary: colors.neutral,
            secondary: colors.primary,
            accent: colors.secondary,
            neutral: colors.accent
          },
          hsl: {
            primary: hsl.neutral,
            secondary: hsl.primary,
            accent: hsl.secondary,
            neutral: hsl.accent
          }
        };
        break;
      case 0:
      default:
        rotatedPalette = currentPalette;
        break;
    }

    applyTheme(rotatedPalette);
    setRotationState(prev => ({ ...prev, colorRotation: rotation }));
    console.log(`Color rotation applied: ${rotation}`);
  }, [currentPalette, applyTheme]);

  // Apply hue shift filter
  const setHueShift = useCallback((degrees: HueShift) => {
    const root = document.documentElement;
    
    // Remove existing hue shift classes
    root.classList.remove(
      'hue-shift-30',
      'hue-shift-60', 
      'hue-shift-90',
      'hue-shift-120',
      'hue-shift-180',
      'hue-shift-240',
      'hue-shift-300'
    );

    // Apply new hue shift
    if (degrees > 0) {
      root.classList.add(`hue-shift-${degrees}`);
    }

    setRotationState(prev => ({ ...prev, hueShift: degrees }));
    console.log(`Hue shift applied: ${degrees}deg`);
  }, []);

  // Toggle color cycling animation
  const toggleColorCycling = useCallback(() => {
    const root = document.documentElement;
    const isActive = !rotationState.isColorCycling;
    
    if (isActive) {
      root.classList.add('color-cycle');
    } else {
      root.classList.remove('color-cycle');
    }

    setRotationState(prev => ({ ...prev, isColorCycling: isActive }));
    console.log(`Color cycling: ${isActive ? 'enabled' : 'disabled'}`);
  }, [rotationState.isColorCycling]);

  // Reset all color modifications
  const resetColorState = useCallback(() => {
    const root = document.documentElement;
    const navbar = document.querySelector('.navbar-themed, .glass-navbar, [data-navbar]');

    // Reset hue shifts
    root.classList.remove(
      'hue-shift-30', 'hue-shift-60', 'hue-shift-90',
      'hue-shift-120', 'hue-shift-180', 'hue-shift-240', 'hue-shift-300',
      'color-cycle'
    );

    // Reset glass levels
    if (navbar) {
      navbar.classList.remove(
        'glass-navbar-ultra-light', 'glass-navbar-light',
        'glass-navbar-medium', 'glass-navbar-dark'
      );
      navbar.classList.add('glass-navbar');
    }

    // Reset color rotation
    if (currentPalette) {
      applyTheme(currentPalette);
    }

    setRotationState({
      glassLevel: 'default',
      colorRotation: 0,
      hueShift: 0,
      isColorCycling: false
    });

    console.log('Color rotation state reset');
  }, [currentPalette, applyTheme]);

  // Get available glass levels with descriptions
  const getGlassLevels = useCallback(() => [
    { value: 'ultra-light' as GlassLevel, label: 'Ultra Light', description: 'Maximum brightness, minimal color' },
    { value: 'light' as GlassLevel, label: 'Light', description: 'High brightness with subtle tinting' },
    { value: 'medium' as GlassLevel, label: 'Medium', description: 'Balanced brightness and color' },
    { value: 'default' as GlassLevel, label: 'Default', description: 'Standard glass effect' },
    { value: 'dark' as GlassLevel, label: 'Dark', description: 'Rich colors, lower brightness' }
  ], []);

  // Get available hue shifts
  const getHueShifts = useCallback(() => [
    { value: 0 as HueShift, label: 'Original', description: 'No color shift' },
    { value: 30 as HueShift, label: '+30°', description: 'Subtle warm shift' },
    { value: 60 as HueShift, label: '+60°', description: 'Moderate shift' },
    { value: 90 as HueShift, label: '+90°', description: 'Quarter rotation' },
    { value: 120 as HueShift, label: '+120°', description: 'Strong shift' },
    { value: 180 as HueShift, label: '+180°', description: 'Complementary colors' },
    { value: 240 as HueShift, label: '+240°', description: 'Cool shift' },
    { value: 300 as HueShift, label: '+300°', description: 'Near complementary' }
  ], []);

  return {
    // Current state
    rotationState,
    currentPalette,
    
    // Glass effects
    setGlassLevel,
    getGlassLevels,
    
    // Color rotation
    rotateColors,
    
    // Hue shifting
    setHueShift,
    getHueShifts,
    
    // Color cycling
    toggleColorCycling,
    
    // Reset
    resetColorState,
    
    // Computed values
    isModified: rotationState.glassLevel !== 'default' || 
                rotationState.colorRotation !== 0 || 
                rotationState.hueShift !== 0 || 
                rotationState.isColorCycling
  };
};