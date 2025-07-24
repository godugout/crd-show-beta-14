
import React from 'react';

interface Card3DTransformProps {
  children: React.ReactNode;
  rotation: { x: number; y: number };
  mousePosition: { x: number; y: number };
  isDragging: boolean;
  interactiveLighting?: boolean;
  isHovering: boolean;
}

export const Card3DTransform: React.FC<Card3DTransformProps> = ({
  children,
  rotation,
  mousePosition,
  isDragging,
  interactiveLighting = false,
  isHovering,
}) => {
  // Calculate dynamic transform with full 360° Y-axis rotation support
  const getDynamicTransform = () => {
    // Debug logging for rotation tracking
    console.log('🎯 Card3DTransform - Rotation X:', rotation.x.toFixed(1), 'Y:', rotation.y.toFixed(1));
    
    let baseTransform = `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
    
    // Add subtle interactive lighting-based depth effect
    if (interactiveLighting && isHovering) {
      const lightDepth = (mousePosition.x - 0.5) * 2; // -1 to 1
      const additionalRotateY = lightDepth * 2; // Max 2 degrees
      baseTransform = `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y + additionalRotateY}deg)`;
    }
    
    return baseTransform;
  };

  return (
    <div
      className="relative"
      style={{
        width: '400px',
        height: '560px',
        transform: getDynamicTransform(),
        transformStyle: 'preserve-3d',
        transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
        filter: `drop-shadow(0 25px 50px rgba(0,0,0,${interactiveLighting && isHovering ? 0.9 : 0.8}))`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      data-rotation-x={rotation.x.toFixed(1)}
      data-rotation-y={rotation.y.toFixed(1)}
    >
      {children}
    </div>
  );
};

