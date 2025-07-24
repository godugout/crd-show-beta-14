import React from 'react';

interface MonolithTransformationProps {
  phase: 'transformation' | 'sun-rise' | 'moon-descent' | 'alignment' | 'climax';
  progress: number;
}

export const MonolithTransformation: React.FC<MonolithTransformationProps> = ({
  phase,
  progress
}) => {
  // Calculate transformation intensity based on phase
  const getTransformIntensity = () => {
    switch (phase) {
      case 'transformation':
        return Math.min(progress * 4, 1); // Quick ramp up
      case 'sun-rise':
      case 'moon-descent':
      case 'alignment':
        return 1; // Full transformation
      case 'climax':
        return 1; // Maintain during climax
      default:
        return 0;
    }
  };

  const intensity = getTransformIntensity();
  const isVisible = intensity > 0;

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Obsidian monolith overlay positioned over the card */}
      <div 
        className="relative"
        style={{
          width: '320px',
          height: '450px',
          opacity: intensity,
          transform: `scale(${0.8 + (intensity * 0.2)})`,
          transition: 'all 0.3s ease-out'
        }}
      >
        {/* Main obsidian surface */}
        <div 
          className="absolute inset-0 rounded-lg"
          style={{
            background: `linear-gradient(145deg, 
              hsl(0, 0%, 8%) 0%, 
              hsl(0, 0%, 2%) 30%, 
              hsl(0, 0%, 0%) 60%, 
              hsl(0, 0%, 5%) 100%)`,
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.1),
              inset 0 -1px 0 rgba(0,0,0,0.8),
              0 0 50px rgba(0,0,0,0.8),
              0 20px 40px rgba(0,0,0,0.6)
            `,
            border: '1px solid rgba(255,255,255,0.05)'
          }}
        />

        {/* Reflective highlights */}
        <div 
          className="absolute inset-0 rounded-lg opacity-30"
          style={{
            background: `linear-gradient(135deg, 
              transparent 0%, 
              rgba(255,255,255,0.1) 20%, 
              transparent 40%, 
              rgba(255,255,255,0.05) 60%, 
              transparent 80%)`
          }}
        />

        {/* Mysterious inscriptions */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center opacity-40">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                className="text-white/20 text-xs font-mono tracking-wider mb-8"
                style={{
                  transform: `translateY(${i * 60}px)`,
                  opacity: intensity * (0.6 - i * 0.1)
                }}
              >
                {'▀▄▀▄▀▄▀▄'}
              </div>
            ))}
          </div>
        </div>

        {/* Energy field around edges */}
        <div 
          className="absolute inset-0 rounded-lg"
          style={{
            background: `radial-gradient(ellipse at center, 
              transparent 60%, 
              rgba(100,150,255,0.1) 80%, 
              rgba(100,150,255,0.2) 90%, 
              transparent 100%)`,
            opacity: intensity * 0.5
          }}
        />

        {/* Rim lighting effect */}
        <div 
          className="absolute inset-0 rounded-lg"
          style={{
            boxShadow: `
              inset 0 0 20px rgba(150,200,255,${intensity * 0.2}),
              0 0 40px rgba(100,150,255,${intensity * 0.1})
            `
          }}
        />
      </div>
    </div>
  );
};