import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useTouchGestures } from '@/hooks/useTouchGestures';
import * as THREE from 'three';

interface TouchResponsive3DCanvasProps {
  children: React.ReactNode;
  enableTouch?: boolean;
  onTouchInteraction?: (type: 'tap' | 'pinch' | 'rotate' | 'pan', data: any) => void;
}

// Touch-responsive camera controller
const TouchCameraController: React.FC<{
  onTouchInteraction?: (type: 'tap' | 'pinch' | 'rotate' | 'pan', data: any) => void;
}> = ({ onTouchInteraction }) => {
  const { camera, gl } = useThree();
  const orbitControlsRef = useRef<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Touch gesture handlers
  const touchHandlers = {
    onPinch: (scale: number, centerX: number, centerY: number) => {
      if (orbitControlsRef.current) {
        // Zoom based on pinch
        const zoomDelta = (scale - 1) * 2;
        const newDistance = Math.max(5, Math.min(50, camera.position.length() - zoomDelta));
        
        const direction = camera.position.clone().normalize();
        camera.position.copy(direction.multiplyScalar(newDistance));
        
        onTouchInteraction?.('pinch', { scale, center: { x: centerX, y: centerY } });
      }
    },

    onRotate: (angle: number, centerX: number, centerY: number) => {
      if (orbitControlsRef.current) {
        // Rotate camera around target
        const spherical = new THREE.Spherical();
        spherical.setFromVector3(camera.position.clone().sub(orbitControlsRef.current.target));
        spherical.theta += angle * 2;
        
        camera.position.setFromSpherical(spherical).add(orbitControlsRef.current.target);
        camera.lookAt(orbitControlsRef.current.target);
        
        onTouchInteraction?.('rotate', { angle, center: { x: centerX, y: centerY } });
      }
    },

    onPan: (deltaX: number, deltaY: number) => {
      if (orbitControlsRef.current) {
        const panSpeed = 0.01;
        const offset = new THREE.Vector3(
          -deltaX * panSpeed,
          deltaY * panSpeed,
          0
        );
        
        // Apply camera rotation to offset
        offset.applyQuaternion(camera.quaternion);
        
        camera.position.add(offset);
        orbitControlsRef.current.target.add(offset);
        
        onTouchInteraction?.('pan', { deltaX, deltaY });
      }
    },

    onTap: (x: number, y: number) => {
      onTouchInteraction?.('tap', { x, y });
    },

    onDoubleTap: (x: number, y: number) => {
      // Reset camera position on double tap
      if (orbitControlsRef.current) {
        orbitControlsRef.current.reset();
      }
      onTouchInteraction?.('tap', { x, y, type: 'double' });
    }
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Use touch gestures only on mobile
  useTouchGestures(
    { current: gl.domElement }, 
    isMobile ? touchHandlers : {}
  );

  return (
    <OrbitControls
      ref={orbitControlsRef}
      enabled={!isMobile} // Disable default controls on mobile
      enablePan={!isMobile}
      enableZoom={!isMobile}
      enableRotate={!isMobile}
      dampingFactor={0.05}
      enableDamping
      maxDistance={50}
      minDistance={5}
      maxPolarAngle={Math.PI * 0.8}
      minPolarAngle={Math.PI * 0.2}
    />
  );
};

export const TouchResponsive3DCanvas: React.FC<TouchResponsive3DCanvasProps> = ({
  children,
  enableTouch = true,
  onTouchInteraction
}) => {
  return (
    <Canvas
      camera={{ 
        position: [0, 5, 15], 
        fov: 45,
        near: 0.1,
        far: 1000
      }}
      className="w-full h-full touch-none"
      gl={{ 
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      }}
      onCreated={({ gl }) => {
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }}
    >
      {enableTouch && (
        <TouchCameraController onTouchInteraction={onTouchInteraction} />
      )}
      
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {children}
    </Canvas>
  );
};