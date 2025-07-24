
import React from 'react';
import { EnvironmentSphere } from './EnvironmentSphere';
import type { EnvironmentScene } from '../types';

interface BackgroundRendererProps {
  selectedScene: EnvironmentScene;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
}

export const BackgroundRenderer: React.FC<BackgroundRendererProps> = ({
  selectedScene,
  mousePosition,
  isHovering,
}) => {
  // Render the 2D scene background
  return (
    <div className="absolute inset-0 z-0">
      <EnvironmentSphere
        scene={selectedScene}
        mousePosition={mousePosition}
        isHovering={isHovering}
      />
    </div>
  );
};
