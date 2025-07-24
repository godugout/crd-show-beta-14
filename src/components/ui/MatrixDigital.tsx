import React, { useEffect, useRef, useState } from 'react';

interface MatrixDigitalProps {
  children: string;
  className?: string;
}

export const MatrixDigital: React.FC<MatrixDigitalProps> = ({ 
  children, 
  className = "" 
}) => {
  const [glitchText, setGlitchText] = useState(children);
  const [showMatrix, setShowMatrix] = useState(false);
  const matrixRef = useRef<HTMLSpanElement>(null);

  // Matrix characters for the effect
  const matrixChars = '01アカサタナハマヤラワガザダバパ';
  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  useEffect(() => {
    const interval = setInterval(() => {
      // Random glitch effect
      if (Math.random() < 0.1) {
        const glitched = children
          .split('')
          .map(char => 
            Math.random() < 0.3 
              ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
              : char
          )
          .join('');
        setGlitchText(glitched);
        
        setTimeout(() => setGlitchText(children), 100);
      }

      // Matrix wave effect
      if (Math.random() < 0.15) {
        setShowMatrix(true);
        setTimeout(() => setShowMatrix(false), 300);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [children]);

  return (
    <span 
      ref={matrixRef}
      className={`relative inline-block ${className}`}
      style={{
        filter: showMatrix ? 'contrast(1.2) brightness(1.1)' : 'none',
      }}
    >
      {/* Main text with glitch */}
      <span 
        className="relative z-10 transition-all duration-100"
        style={{
          textShadow: showMatrix 
            ? '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00'
            : '0 0 5px currentColor',
          transform: glitchText !== children ? 'translateX(1px)' : 'none',
        }}
      >
        {glitchText}
      </span>

      {/* Matrix overlay */}
      {showMatrix && (
        <span 
          className="absolute inset-0 z-0 text-green-400 animate-pulse"
          style={{
            fontSize: '0.8em',
            lineHeight: '1.2',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {Array.from({ length: children.length }, (_, i) => (
            <span
              key={i}
              className="inline-block animate-pulse"
              style={{
                animationDelay: `${i * 50}ms`,
                opacity: Math.random(),
              }}
            >
              {matrixChars[Math.floor(Math.random() * matrixChars.length)]}
            </span>
          ))}
        </span>
      )}

      {/* Glitch edges */}
      <span 
        className="absolute -inset-1 z-0 opacity-30"
        style={{
          background: showMatrix 
            ? 'linear-gradient(45deg, transparent 48%, #00ff00 50%, transparent 52%)'
            : 'none',
          animation: showMatrix 
            ? 'glitch var(--duration-glitch) var(--easing-sharp)'
            : 'none',
        }}
      />

    </span>
  );
};