import React, { useState, useEffect } from 'react';
import { DebugOverlay } from './DebugOverlay';
import { EnhancedKubrickSequence } from '../alignment/EnhancedKubrickSequence';
import { GalacticCompass } from '../alignment/GalacticCompass';

interface AlignmentStateMonitorProps {
  isDebugMode?: boolean;
  className?: string;
}

export const AlignmentStateMonitor: React.FC<AlignmentStateMonitorProps> = ({
  isDebugMode = false,
  className = ''
}) => {
  const [alignmentState, setAlignmentState] = useState({
    zoom: 100,
    tilt: 0,
    coverage: 0,
    isTriggered: false,
    phase: 'idle' as 'idle' | 'transformation' | 'sun-rise' | 'moon-descent' | 'alignment' | 'climax',
    progress: 0
  });

  const [isDebugVisible, setIsDebugVisible] = useState(isDebugMode);
  const [isAlignmentComplete, setIsAlignmentComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Simulate alignment monitoring (replace with real monitoring logic)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setAlignmentState(prev => {
        // Check if alignment is complete (all thresholds met)
        const zoomMet = prev.zoom >= 400;
        const tiltMet = prev.tilt >= 45;
        const coverageMet = prev.coverage >= 100;
        
        const newIsTriggered = zoomMet && tiltMet && coverageMet;
        setIsAlignmentComplete(newIsTriggered);

        return {
          ...prev,
          isTriggered: newIsTriggered
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Mock alignment data updates (replace with real camera/card monitoring)
  useEffect(() => {
    if (isPaused) return;

    const mockInterval = setInterval(() => {
      setAlignmentState(prev => ({
        ...prev,
        zoom: Math.max(100, prev.zoom + (Math.random() - 0.5) * 20),
        tilt: Math.max(0, Math.min(90, prev.tilt + (Math.random() - 0.5) * 5)),
        coverage: Math.max(0, Math.min(120, prev.coverage + (Math.random() - 0.5) * 10))
      }));
    }, 200);

    return () => clearInterval(mockInterval);
  }, [isPaused]);

  const handleManualTrigger = () => {
    setAlignmentState(prev => ({
      ...prev,
      zoom: 400,
      tilt: 45,
      coverage: 100,
      isTriggered: true
    }));
    setIsAlignmentComplete(true);
  };

  const handleReset = () => {
    setAlignmentState({
      zoom: 100,
      tilt: 0,
      coverage: 0,
      isTriggered: false,
      phase: 'idle',
      progress: 0
    });
    setIsAlignmentComplete(false);
  };

  const handlePhaseSkip = (phase: string) => {
    setAlignmentState(prev => ({
      ...prev,
      phase: phase as any,
      progress: 0
    }));
  };

  const handleTogglePause = () => {
    setIsPaused(prev => !prev);
  };

  const handleCompassReset = () => {
    handleReset();
  };

  const handleSequenceComplete = () => {
    console.log('Kubrick sequence completed!');
    // Handle sequence completion (e.g., navigate to next step)
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Enhanced Kubrick Sequence - Main cinematic experience */}
      <EnhancedKubrickSequence
        isAlignmentComplete={isAlignmentComplete}
        onSequenceComplete={handleSequenceComplete}
        className="absolute inset-0"
      />

      {/* Galactic Compass - User controls */}
      <GalacticCompass
        onReset={handleCompassReset}
        isPaused={isPaused}
        onTogglePause={handleTogglePause}
      />

      {/* Debug Overlay - Developer tools */}
      {(isDebugMode || isDebugVisible) && (
        <DebugOverlay
          alignmentState={alignmentState}
          onManualTrigger={handleManualTrigger}
          onReset={handleReset}
          onPhaseSkip={handlePhaseSkip}
          isVisible={isDebugVisible}
          onToggleVisibility={() => setIsDebugVisible(!isDebugVisible)}
        />
      )}

      {/* Debug Toggle for Production (hidden keyboard shortcut) */}
      {!isDebugMode && (
        <div className="absolute top-4 right-4 z-50">
          <button
            onDoubleClick={() => setIsDebugVisible(!isDebugVisible)}
            className="opacity-0 w-4 h-4"
            title="Double-click to toggle debug mode"
          />
        </div>
      )}
    </div>
  );
};