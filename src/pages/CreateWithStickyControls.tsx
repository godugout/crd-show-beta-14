import React, { useState } from 'react';
import { CRDViewer } from '@/components/crd/CRDViewer';
import { CRDStickyFooter } from '@/components/crd/controls/CRDStickyFooter';
import { type AnimationMode, type LightingPreset } from '@/components/crd/types/CRDTypes';
import { useCardAngle } from '@/components/crd/hooks/useCardAngle';
import { type SpaceEnvironment } from '@/components/studio/EnvironmentSwitcher';

const CreateWithStickyControls = () => {
  // Animation State
  const [animationMode, setAnimationMode] = useState<AnimationMode>('monolith');
  const [animationIntensity, setAnimationIntensity] = useState(1);

  // Visual Style State
  const [selectedStyleId, setSelectedStyleId] = useState('matte');

  // Rotation State
  const [autoRotate, setAutoRotate] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0.5);

  // Lighting State
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('studio');
  const [lightingIntensity, setLightingIntensity] = useState(1);

  // Orbital controls
  const [orbitalAutoRotate, setOrbitalAutoRotate] = useState(true);
  const [orbitalRotationSpeed, setOrbitalRotationSpeed] = useState(1);
  const [showOrbitalRing, setShowOrbitalRing] = useState(true);
  const [showLockIndicators, setShowLockIndicators] = useState(false);

  // Case control
  const [enableGlassCase, setEnableGlassCase] = useState(true);

  // User tracking control
  const [enableUserTracking, setEnableUserTracking] = useState(false);

  // Space environment control
  const [spaceEnvironment, setSpaceEnvironment] = useState<SpaceEnvironment>('starfield');

  // Get card angle and camera data for tracking
  const { cardAngle, cameraDistance } = useCardAngle();

  // Cosmic event handler to reset UI state
  const handleCosmicEventComplete = () => {
    // Close any open tracking windows/UI panels after cosmic event
    setEnableUserTracking(false);
    // Could add more UI cleanup here if needed
  };

  console.log('🔍 DEBUG: CreateWithStickyControls rendering', { spaceEnvironment });

  return (
    <div className="fixed inset-0 bg-crd-darkest overflow-hidden flex flex-col">
      {/* 3D Card Viewer - Takes remaining space */}
      <div className="flex-1 relative">
        <CRDViewer
          mode={animationMode}
          intensity={animationIntensity}
          lightingPreset={lightingPreset}
          pathTheme="neutral"
          autoRotate={autoRotate}
          rotationSpeed={rotationSpeed}
          lightingIntensity={lightingIntensity}
          orbitalAutoRotate={orbitalAutoRotate}
          orbitalRotationSpeed={orbitalRotationSpeed}
          showOrbitalRing={showOrbitalRing}
          showLockIndicators={showLockIndicators}
          enableControls={true}
          enableGlassCase={enableGlassCase}
          showModeText={true}
          showPauseButton={true}
          className="w-full h-full"
          onModeChange={setAnimationMode}
          onIntensityChange={setAnimationIntensity}
          spaceEnvironment={spaceEnvironment}
          onSpaceEnvironmentChange={setSpaceEnvironment}
        />
      </div>

      {/* Sticky Footer Controls */}
      <CRDStickyFooter
        animationMode={animationMode}
        animationIntensity={animationIntensity}
        onAnimationModeChange={setAnimationMode}
        onAnimationIntensityChange={setAnimationIntensity}
        selectedStyleId={selectedStyleId}
        onStyleChange={setSelectedStyleId}
        autoRotate={autoRotate}
        rotationSpeed={rotationSpeed}
        onAutoRotateChange={setAutoRotate}
        onRotationSpeedChange={setRotationSpeed}
        lightingPreset={lightingPreset}
        lightingIntensity={lightingIntensity}
        onLightingPresetChange={setLightingPreset}
        onLightingIntensityChange={setLightingIntensity}
        orbitalAutoRotate={orbitalAutoRotate}
        orbitalRotationSpeed={orbitalRotationSpeed}
        showOrbitalRing={showOrbitalRing}
        showLockIndicators={showLockIndicators}
        onOrbitalAutoRotateChange={setOrbitalAutoRotate}
        onOrbitalRotationSpeedChange={setOrbitalRotationSpeed}
        onShowOrbitalRingChange={setShowOrbitalRing}
        onShowLockIndicatorsChange={setShowLockIndicators}
        enableGlassCase={enableGlassCase}
        onEnableGlassCaseChange={setEnableGlassCase}
        enableUserTracking={enableUserTracking}
        onEnableUserTrackingChange={setEnableUserTracking}
        cardAngle={cardAngle}
        cameraDistance={cameraDistance}
        animationProgress={animationIntensity}
      />
    </div>
  );
};

export default CreateWithStickyControls;