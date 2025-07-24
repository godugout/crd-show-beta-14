
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import { ShowcaseCard } from './ShowcaseCard';
import { ShowcaseErrorBoundary } from './ShowcaseErrorBoundary';
import type { CardData } from '@/types/card';
import type { SlabPresetConfig } from './SlabPresets';

interface ShowcaseCanvasProps {
  card: CardData;
  slabConfig: SlabPresetConfig;
  exploded: boolean;
  onExplodedChange: (exploded: boolean) => void;
}

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-white text-lg">Loading 3D showcase...</div>
  </div>
);

export const ShowcaseCanvas: React.FC<ShowcaseCanvasProps> = ({
  card,
  slabConfig,
  exploded,
  onExplodedChange
}) => {
  return (
    <div className="w-full h-full">
      <ShowcaseErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          shadows
          dpr={[1, 2]}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
          }}
          onError={(error) => {
            console.error('Canvas error:', error);
          }}
        >
          {/* Enhanced Environment */}
          <Environment preset="studio" />
          
          {/* Enhanced Lighting Setup */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4f46e5" />
          <spotLight
            position={[0, 10, 0]}
            angle={0.3}
            penumbra={1}
            intensity={0.8}
            castShadow
            color="#ffffff"
          />
          
          {/* Contact Shadows for realism */}
          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />
          
          {/* Presentation Controls for better interaction */}
          <PresentationControls
            enabled={true}
            global={false}
            cursor={true}
            snap={false}
            speed={1}
            zoom={1}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
          >
            <Suspense fallback={null}>
              <ShowcaseCard
                card={card}
                slabConfig={slabConfig}
                exploded={exploded}
              />
            </Suspense>
          </PresentationControls>

          {/* Fallback orbit controls */}
          <OrbitControls
            enabled={false} // Disabled in favor of PresentationControls
            enablePan={false}
            enableZoom={true}
            autoRotate={slabConfig.type === 'museum' && slabConfig.autoRotate}
            autoRotateSpeed={0.5}
            minDistance={5}
            maxDistance={15}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
          />
        </Canvas>
      </ShowcaseErrorBoundary>
    </div>
  );
};
