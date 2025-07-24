import React from 'react';

interface CRDCanvasGridProps {
  showGrid: boolean;
  gridType: 'standard' | 'print' | 'golden' | 'isometric' | 'blueprint' | 'photography';
  gridSize: number;
}

export const CRDCanvasGrid: React.FC<CRDCanvasGridProps> = ({
  showGrid,
  gridType,
  gridSize
}) => {
  if (!showGrid) return null;

  const getGridPattern = () => {
    switch (gridType) {
      case 'standard':
        return {
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`
        };
      case 'print':
        return {
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.15) 1px, transparent 1px),
            linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px, ${gridSize}px ${gridSize}px, ${gridSize * 8}px ${gridSize * 8}px, ${gridSize * 8}px ${gridSize * 8}px`
        };
      case 'golden':
        const goldenRatio = 1.618;
        return {
          backgroundImage: `
            linear-gradient(rgba(251, 191, 36, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 191, 36, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize * goldenRatio}px ${gridSize}px`
        };
      case 'isometric':
        return {
          backgroundImage: `
            linear-gradient(30deg, rgba(147, 51, 234, 0.12) 1px, transparent 1px),
            linear-gradient(-30deg, rgba(147, 51, 234, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 51, 234, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize * 1.732}px ${gridSize}px, ${gridSize * 1.732}px ${gridSize}px, ${gridSize}px ${gridSize}px`
        };
      case 'blueprint':
        return {
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.15) 1px, transparent 1px),
            linear-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.05) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px, ${gridSize}px ${gridSize}px, ${gridSize * 5}px ${gridSize * 5}px, ${gridSize * 5}px ${gridSize * 5}px, ${gridSize * 10}px ${gridSize * 10}px`
        };
      case 'photography':
        return {
          backgroundImage: `
            linear-gradient(rgba(236, 72, 153, 0.1) 2px, transparent 2px),
            linear-gradient(90deg, rgba(236, 72, 153, 0.1) 2px, transparent 2px),
            linear-gradient(rgba(236, 72, 153, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(236, 72, 153, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: `33.33% 33.33%, 33.33% 33.33%, ${gridSize}px ${gridSize}px, ${gridSize}px ${gridSize}px`,
          backgroundPosition: '33.33% 33.33%, 33.33% 33.33%, 0 0, 0 0'
        };
      default:
        return {};
    }
  };

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-0"
      style={getGridPattern()}
    />
  );
};