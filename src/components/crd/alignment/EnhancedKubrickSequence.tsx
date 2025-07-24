import React, { useState, useEffect, useCallback } from 'react';
import { MonolithTransformation } from './MonolithTransformation';
import { HyperspaceEffect } from '../effects/HyperspaceEffect';
import { InteractiveDropzone } from './InteractiveDropzone';

interface EnhancedKubrickSequenceProps {
  isAlignmentComplete: boolean;
  onSequenceComplete?: () => void;
  className?: string;
}

type SequencePhase = 'waiting' | 'dropzone' | 'transformation' | 'sun-rise' | 'moon-descent' | 'alignment' | 'climax' | 'hyperspace' | 'complete';

export const EnhancedKubrickSequence: React.FC<EnhancedKubrickSequenceProps> = ({
  isAlignmentComplete,
  onSequenceComplete,
  className = ''
}) => {
  const [currentPhase, setCurrentPhase] = useState<SequencePhase>('waiting');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Reset sequence when alignment changes
  useEffect(() => {
    if (!isAlignmentComplete) {
      setCurrentPhase('waiting');
      setPhaseProgress(0);
      setUploadedFile(null);
    } else {
      setCurrentPhase('dropzone');
    }
  }, [isAlignmentComplete]);

  // Handle file upload to trigger sequence
  const handleFileUpload = useCallback((file: File) => {
    setUploadedFile(file);
    setCurrentPhase('transformation');
    setPhaseProgress(0);
  }, []);

  // Phase progression logic
  useEffect(() => {
    if (currentPhase === 'waiting' || currentPhase === 'dropzone' || currentPhase === 'complete') {
      return;
    }

    const phaseDurations = {
      transformation: 2000,
      'sun-rise': 3000,
      'moon-descent': 3000,
      alignment: 2000,
      climax: 2000,
      hyperspace: 3000
    };

    const duration = phaseDurations[currentPhase as keyof typeof phaseDurations];
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setPhaseProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Move to next phase
        const phases: SequencePhase[] = ['transformation', 'sun-rise', 'moon-descent', 'alignment', 'climax', 'hyperspace', 'complete'];
        const currentIndex = phases.indexOf(currentPhase);
        const nextPhase = phases[currentIndex + 1];
        
        if (nextPhase) {
          setCurrentPhase(nextPhase);
          setPhaseProgress(0);
        }
      }
    };

    requestAnimationFrame(animate);
  }, [currentPhase]);

  // Handle sequence completion
  useEffect(() => {
    if (currentPhase === 'complete') {
      setTimeout(() => {
        onSequenceComplete?.();
      }, 1000);
    }
  }, [currentPhase, onSequenceComplete]);

  const getTransformIntensity = () => {
    switch (currentPhase) {
      case 'transformation':
        return phaseProgress * 0.3;
      case 'sun-rise':
        return 0.3 + (phaseProgress * 0.2);
      case 'moon-descent':
        return 0.5 + (phaseProgress * 0.2);
      case 'alignment':
        return 0.7 + (phaseProgress * 0.2);
      case 'climax':
        return 0.9 + (phaseProgress * 0.1);
      default:
        return 0;
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Dropzone - shown when alignment is complete but sequence hasn't started */}
      <InteractiveDropzone
        isVisible={currentPhase === 'dropzone'}
        onFileUpload={handleFileUpload}
      />

      {/* Monolith Transformation Overlay */}
      {currentPhase !== 'waiting' && currentPhase !== 'dropzone' && currentPhase !== 'complete' && (
        <MonolithTransformation
          phase={currentPhase as any}
          progress={phaseProgress}
        />
      )}

      {/* Sun Effect */}
      {(currentPhase === 'sun-rise' || (currentPhase === 'moon-descent' && phaseProgress < 0.5)) && (
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full transition-all duration-1000"
            style={{
              background: `radial-gradient(circle, 
                rgba(255, 220, 100, ${0.8 * phaseProgress}) 0%, 
                rgba(255, 180, 50, ${0.6 * phaseProgress}) 30%, 
                rgba(255, 140, 0, ${0.4 * phaseProgress}) 60%, 
                transparent 100%)`,
              transform: `translate(-50%, ${-50 + (currentPhase === 'sun-rise' ? -phaseProgress * 20 : -20)}px) scale(${1 + phaseProgress * 0.5})`,
              filter: `blur(${2 - phaseProgress}px)`,
              boxShadow: `0 0 ${40 + phaseProgress * 60}px rgba(255, 200, 100, ${0.6 * phaseProgress})`
            }}
          />
          
          {/* Sun rays */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 left-1/2 origin-bottom"
              style={{
                width: '2px',
                height: `${50 + phaseProgress * 30}px`,
                background: `linear-gradient(to top, rgba(255, 220, 100, ${0.3 * phaseProgress}), transparent)`,
                transform: `translate(-50%, ${-50 + (currentPhase === 'sun-rise' ? -phaseProgress * 20 : -20)}px) rotate(${i * 30}deg)`,
                transformOrigin: 'center bottom'
              }}
            />
          ))}
        </div>
      )}

      {/* Moon Effect */}
      {(currentPhase === 'moon-descent' || currentPhase === 'alignment') && (
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full transition-all duration-1000"
            style={{
              background: `radial-gradient(circle at 30% 30%, 
                rgba(220, 220, 240, ${0.9 * phaseProgress}) 0%, 
                rgba(180, 180, 200, ${0.7 * phaseProgress}) 40%, 
                rgba(140, 140, 160, ${0.5 * phaseProgress}) 70%, 
                transparent 100%)`,
              transform: `translate(-50%, ${-100 + phaseProgress * 150}px) scale(${0.8 + phaseProgress * 0.3})`,
              filter: `blur(${1 - phaseProgress * 0.5}px)`,
              boxShadow: `0 0 ${20 + phaseProgress * 30}px rgba(200, 200, 240, ${0.4 * phaseProgress})`
            }}
          />
          
          {/* Moon craters (static detail) */}
          <div 
            className="absolute w-2 h-2 bg-gray-600/30 rounded-full"
            style={{
              left: 'calc(50% - 4px)',
              top: `${-100 + phaseProgress * 150 + 15}px`,
              opacity: phaseProgress * 0.6
            }}
          />
          <div 
            className="absolute w-1 h-1 bg-gray-700/40 rounded-full"
            style={{
              left: 'calc(50% + 8px)',
              top: `${-100 + phaseProgress * 150 + 8}px`,
              opacity: phaseProgress * 0.8
            }}
          />
        </div>
      )}

      {/* Light Beam Effect */}
      {(currentPhase === 'alignment' || currentPhase === 'climax') && (
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 transition-all duration-1000"
            style={{
              width: `${2 + phaseProgress * 8}px`,
              height: '100%',
              background: `linear-gradient(to bottom, 
                rgba(255, 255, 255, ${0.8 * phaseProgress}) 0%, 
                rgba(200, 200, 255, ${0.6 * phaseProgress}) 30%, 
                rgba(150, 150, 255, ${0.4 * phaseProgress}) 60%, 
                rgba(100, 100, 255, ${0.2 * phaseProgress}) 80%, 
                transparent 100%)`,
              filter: `blur(${1 - phaseProgress * 0.5}px)`,
              boxShadow: `0 0 ${10 + phaseProgress * 20}px rgba(255, 255, 255, ${0.3 * phaseProgress})`
            }}
          />
          
          {/* Beam particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `calc(50% + ${(Math.random() - 0.5) * 20}px)`,
                top: `${Math.random() * 100}%`,
                width: '1px',
                height: '1px',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '50%',
                boxShadow: '0 0 4px rgba(255, 255, 255, 0.6)',
                animationDelay: `${i * 100}ms`,
                opacity: phaseProgress
              }}
            />
          ))}
        </div>
      )}

      {/* Environmental Stars Reflection */}
      {(currentPhase === 'climax' || currentPhase === 'hyperspace') && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '50%',
                boxShadow: `0 0 ${2 + Math.random() * 4}px rgba(255, 255, 255, 0.6)`,
                animationDelay: `${i * 50}ms`,
                animationDuration: `${2 + Math.random() * 2}s`,
                opacity: phaseProgress * (0.3 + Math.random() * 0.7)
              }}
            />
          ))}
        </div>
      )}

      {/* Hyperspace Effect */}
      <HyperspaceEffect
        isActive={currentPhase === 'hyperspace'}
        variant="star-wars"
        duration={3000}
        onComplete={() => setCurrentPhase('complete')}
      />

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};