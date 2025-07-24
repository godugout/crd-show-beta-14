import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, HelpCircle, Play, Pause, RefreshCw, Package, PackageOpen, Globe } from 'lucide-react';
import { EnvironmentSwitcher, type SpaceEnvironment } from '../../studio/EnvironmentSwitcher';

interface GalacticCompassProps {
  onReset: () => void;
  isResetting?: boolean;
  onShowTutorial?: () => void;
  cardRotation?: { x: number; y: number; z: number };
  cameraDistance?: number;
  isPaused?: boolean;
  onTogglePause?: () => void;
  enableGlassCase?: boolean;
  onToggleGlassCase?: () => void;
  spaceEnvironment?: SpaceEnvironment;
  onSpaceEnvironmentChange?: (environment: SpaceEnvironment) => void;
}

export const GalacticCompass: React.FC<GalacticCompassProps> = ({
  onReset,
  isResetting = false,
  onShowTutorial,
  cardRotation,
  cameraDistance,
  isPaused = false,
  onTogglePause,
  enableGlassCase = true,
  onToggleGlassCase,
  spaceEnvironment = 'starfield',
  onSpaceEnvironmentChange
}) => {
  const [compassAngle, setCompassAngle] = useState(0); // 0 = pointing up
  const [isTracking, setIsTracking] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Update compass needles based on real card rotation
  useEffect(() => {
    if (!cardRotation || isResetting) return;
    
    // Main needle follows Y rotation (horizontal spin)
    const needleAngle = cardRotation.y;
    setCompassAngle(needleAngle);
  }, [cardRotation, isResetting]);

  // Reset animation
  useEffect(() => {
    if (isResetting) {
      setIsTracking(false);
      setCompassAngle(0); // Point straight up
      
      // Resume tracking after reset animation
      setTimeout(() => {
        setIsTracking(true);
      }, 1500);
    }
  }, [isResetting]);

  const handleCompassClick = () => {
    console.log('🧭 Galactic compass reset triggered');
    onReset();
  };

  return (
    <>
      {/* Left Side - Creating Tools Bar */}
      <div className="fixed bottom-6 left-6 galactic-compass">
        <div className="flex flex-col items-start gap-2">
          {/* Future creating tools will go here */}
          <div className="flex flex-col items-start gap-2">

            {/* Glass Case Toggle Button */}
            {onToggleGlassCase && (
              <button
                onClick={onToggleGlassCase}
                className="group text-white/40 hover:text-[#3772FF] p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center border"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.12) 100%)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(12px) saturate(180%)'
                }}
                title={enableGlassCase ? 'Remove Case' : 'Add Case'}
              >
                {enableGlassCase ? (
                  <PackageOpen className="w-4 h-4 transition-transform group-hover:scale-110" />
                ) : (
                  <Package className="w-4 h-4 transition-transform group-hover:scale-110" />
                )}
              </button>
            )}

            {/* Space Environment Button */}
            <EnvironmentSwitcher
              currentEnvironment={spaceEnvironment}
              onEnvironmentChange={onSpaceEnvironmentChange || (() => console.log('No environment change handler'))}
            />

            {/* Tutorial Button */}
            {onShowTutorial && (
              <button
                onClick={onShowTutorial}
                className="group text-white/40 hover:text-[#3772FF] p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center border"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.12) 100%)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(12px) saturate(180%)'
                }}
                title="Tutorial"
              >
                <HelpCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
              </button>
            )}

            {/* Refresh Button - Moved to bottom of left stack */}
            <button
              onClick={() => window.location.reload()}
            className="group text-white/40 hover:text-[#3772FF] p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center border"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.12) 100%)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(12px) saturate(180%)'
              }}
              title="Refresh Page"
            >
              <RefreshCw className="w-4 h-4 transition-transform group-hover:scale-110" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Playing Controls Bar */}
      <div className="fixed bottom-6 right-6 galactic-compass">
        <div className="flex flex-col items-end gap-3">
          {/* Control Buttons - Pause/Play and Refresh above compass */}
          <div className="flex flex-col items-end gap-3">
            {/* Pause/Play Button */}
            {onTogglePause && (
              <button
                onClick={onTogglePause}
            className="group text-white/40 hover:text-[#3772FF] p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center border"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.12) 100%)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(12px) saturate(180%)'
                }}
                title={isPaused ? "Resume" : "Pause"}
              >
                {isPaused ? (
                  <Play className="w-4 h-4 transition-transform group-hover:scale-110" />
                ) : (
                  <Pause className="w-4 h-4 transition-transform group-hover:scale-110" />
                )}
              </button>
            )}
          </div>
          
          {/* Compass and data below buttons */}
          <div className="flex flex-col items-end gap-3">
            {/* Compass housing - smaller design */}
            <div 
              className="relative w-12 h-12 cursor-pointer group transition-all duration-300 hover:scale-110"
              onClick={handleCompassClick}
            >
              {/* Outer ring with minimal markings */}
              <div className="absolute inset-0 rounded-full border"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.12) 100%)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(12px) saturate(180%)'
                }}
              >
                {/* Cardinal direction markers - smaller */}
                {[0, 90, 180, 270].map((angle) => (
                  <div
                    key={angle}
                    className="absolute w-0.5 h-2 bg-blue-300/60"
                    style={{
                      top: '1px',
                      left: '50%',
                      transformOrigin: '50% 23px',
                      transform: `translateX(-50%) rotate(${angle}deg)`
                    }}
                  />
                ))}
              </div>

              {/* Inner compass face */}
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-slate-800 to-black border border-blue-500/20">
                {/* Central dot */}
                <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                
                {/* Main needle - Y rotation (horizontal spin) */}
                <div
                  className="absolute top-1/2 left-1/2 origin-bottom transition-transform duration-300 ease-out"
                  style={{
                    transform: `translate(-50%, -100%) rotate(${compassAngle}deg)`,
                    height: '16px',
                    width: '1px'
                  }}
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-blue-600 to-blue-300" />
                  <div className="absolute -top-0.5 left-1/2 w-1 h-1 bg-blue-300 rounded-full transform -translate-x-1/2" />
                </div>
                
                {/* X rotation needle (pitch - up/down tilt) */}
                {cardRotation && (
                  <div
                    className="absolute top-1/2 left-1/2 origin-bottom transition-transform duration-300 ease-out"
                    style={{
                      transform: `translate(-50%, -100%) rotate(${cardRotation.x + 90}deg)`,
                      height: '12px',
                      width: '1px'
                    }}
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-orange-600 to-orange-300" />
                    <div className="absolute -top-0.5 left-1/2 w-0.5 h-0.5 bg-orange-300 rounded-full transform -translate-x-1/2" />
                  </div>
                )}
                
                {/* Z rotation needle (roll - clockwise/counterclockwise) */}
                {cardRotation && (
                  <div
                    className="absolute top-1/2 left-1/2 origin-bottom transition-transform duration-300 ease-out"
                    style={{
                      transform: `translate(-50%, -100%) rotate(${cardRotation.z}deg)`,
                      height: '10px',
                      width: '1px'
                    }}
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-green-600 to-green-300" />
                    <div className="absolute -top-0.5 left-1/2 w-0.5 h-0.5 bg-green-300 rounded-full transform -translate-x-1/2" />
                  </div>
                )}
              </div>

              {/* Hover glow effect - slower animation */}
              <div className="absolute inset-0 rounded-full bg-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                   style={{ animation: cardRotation && !isResetting ? 'pulse 3s ease-in-out infinite' : 'none' }} />

              {/* Reset icon overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <RotateCcw className="w-3 h-3 text-blue-300" />
              </div>
            </div>

            {/* Status and coordinates only */}
            <div className="flex flex-col items-end gap-1">
              {/* Status indicator */}
              <div className="flex items-center justify-end gap-1 text-xs text-blue-400/70 font-mono text-right">
                <span>
                  {isResetting ? 'RESET' : cardRotation ? 'TRACK' : 'OFF'}
                </span>
                <div 
                  className={`w-1 h-1 rounded-full ${
                    cardRotation && !isResetting ? 'bg-green-400' : 'bg-red-400'
                  }`}
                  style={{ 
                    animation: cardRotation && !isResetting ? 'pulse 2s ease-in-out infinite' : 'none' 
                  }}
                />
              </div>

              {/* Multi-axis coordinates display */}
              <div className="text-xs text-blue-300/50 font-mono space-y-0.5 text-right">
                <div className="flex items-center justify-end gap-1">
                  <span>{compassAngle.toFixed(1)}°</span>
                  <span>Y</span>
                  <div className="w-2 h-0.5 bg-gradient-to-r from-blue-600 to-blue-300"></div>
                </div>
                {cardRotation && (
                  <>
                    <div className="flex items-center justify-end gap-1">
                      <span>{cardRotation.x.toFixed(1)}°</span>
                      <span>X</span>
                      <div className="w-2 h-0.5 bg-gradient-to-r from-orange-600 to-orange-300"></div>
                    </div>
                     <div className="flex items-center justify-end gap-1">
                       <span>{cameraDistance ? (10 - cameraDistance).toFixed(1) : '0.0'}</span>
                       <span>Z</span>
                       <div className="w-2 h-0.5 bg-gradient-to-r from-green-600 to-green-300"></div>
                     </div>
                   </>
                 )}
               </div>
            </div>
          </div>
          
          {/* Future playing controls will go here */}
        </div>
      </div>
    </>
  );
};
