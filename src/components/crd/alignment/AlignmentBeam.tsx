import React from 'react';

interface AlignmentBeamProps {
  phase: 'alignment' | 'climax';
  progress: number;
}

export const AlignmentBeam: React.FC<AlignmentBeamProps> = ({
  phase,
  progress
}) => {
  const getBeamProperties = () => {
    switch (phase) {
      case 'alignment':
        return {
          opacity: Math.min(progress * 2, 1),
          intensity: Math.min(progress * 1.5, 1),
          width: 2 + (progress * 3)
        };
      case 'climax':
        return {
          opacity: 1,
          intensity: 1.5,
          width: 6
        };
      default:
        return { opacity: 0, intensity: 0, width: 2 };
    }
  };

  const { opacity, intensity, width } = getBeamProperties();

  if (opacity <= 0) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Vertical alignment beam */}
      <div 
        className="absolute"
        style={{
          top: '0',
          left: '50%',
          width: `${width}px`,
          height: '100vh',
          transform: 'translateX(-50%)',
          opacity
        }}
      >
        {/* Main beam */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, 
              transparent 0%, 
              rgba(255,255,255,${intensity * 0.8}) 20%, 
              rgba(200,220,255,${intensity * 0.6}) 40%, 
              rgba(255,255,255,${intensity * 0.8}) 60%, 
              rgba(200,220,255,${intensity * 0.6}) 80%, 
              transparent 100%)`,
            filter: 'blur(1px)'
          }}
        />

        {/* Inner bright core */}
        <div 
          className="absolute top-0 left-1/2"
          style={{
            width: '1px',
            height: '100%',
            background: `linear-gradient(to bottom, 
              transparent 0%, 
              rgba(255,255,255,${intensity}) 20%, 
              rgba(255,255,255,${intensity * 0.8}) 50%, 
              rgba(255,255,255,${intensity}) 80%, 
              transparent 100%)`,
            transform: 'translateX(-50%)'
          }}
        />

        {/* Particle effects along beam */}
        {phase === 'climax' && (
          <>
            {[...Array(12)].map((_, i) => (
              <div 
                key={i}
                className="absolute left-1/2"
                style={{
                  width: '4px',
                  height: '4px',
                  top: `${10 + (i * 7)}%`,
                  background: 'rgba(255,255,255,0.8)',
                  borderRadius: '50%',
                  transform: 'translateX(-50%)',
                  animation: `beam-particle 2s ease-in-out infinite ${i * 0.2}s`,
                  filter: 'blur(0.5px)'
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Convergence points at celestial objects */}
      {/* Sun convergence */}
      <div 
        className="absolute"
        style={{
          top: '30%',
          left: '50%',
          width: '20px',
          height: '20px',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, 
            rgba(255,255,255,${intensity}) 0%, 
            rgba(255,220,100,${intensity * 0.8}) 30%, 
            transparent 70%)`,
          borderRadius: '50%',
          opacity,
          filter: 'blur(2px)'
        }}
      />

      {/* Moon convergence */}
      <div 
        className="absolute"
        style={{
          top: '45%',
          left: '50%',
          width: '16px',
          height: '16px',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, 
            rgba(255,255,255,${intensity}) 0%, 
            rgba(200,220,255,${intensity * 0.8}) 30%, 
            transparent 70%)`,
          borderRadius: '50%',
          opacity,
          filter: 'blur(1px)'
        }}
      />

      {/* Monolith convergence */}
      <div 
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          width: '12px',
          height: '12px',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, 
            rgba(255,255,255,${intensity}) 0%, 
            rgba(150,200,255,${intensity * 0.8}) 30%, 
            transparent 70%)`,
          borderRadius: '50%',
          opacity,
          filter: 'blur(1px)'
        }}
      />

      {/* Animation styles handled via Tailwind animate classes */}
    </div>
  );
};