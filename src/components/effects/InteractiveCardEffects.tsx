import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import type { CardData } from '@/types/card';
import {
    useTexture
} from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Droplets,
    Flame,
    Moon,
    Palette,
    Pause,
    Play,
    RotateCcw,
    Snowflake,
    Sparkles,
    Sun,
    Wind
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface InteractiveCardEffectsProps {
  card: CardData;
  className?: string;
  showControls?: boolean;
}

// Particle Effect Types
type EffectType = 'sparkles' | 'fire' | 'water' | 'wind' | 'ice' | 'light' | 'dark' | 'rainbow';

interface EffectConfig {
  type: EffectType;
  intensity: number;
  color: string;
  speed: number;
  count: number;
  enabled: boolean;
}

// Sparkles Effect Component
const SparklesEffect: React.FC<{ 
  count: number; 
  color: string; 
  speed: number;
  enabled: boolean;
}> = ({ count, color, speed, enabled }) => {
  const sparklesRef = useRef<THREE.Points>(null);
  const positions = useRef<Float32Array>();

  useEffect(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 4;
      pos[i + 1] = (Math.random() - 0.5) * 4;
      pos[i + 2] = (Math.random() - 0.5) * 4;
    }
    positions.current = pos;
  }, [count]);

  useFrame((state) => {
    if (sparklesRef.current && positions.current && enabled) {
      const positions = sparklesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime * speed + i) * 0.02;
        positions[i] += Math.cos(state.clock.elapsedTime * speed + i) * 0.01;
      }
      sparklesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!enabled) return null;

  return (
    <points ref={sparklesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.current || new Float32Array()}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

// Fire Effect Component
const FireEffect: React.FC<{ 
  intensity: number; 
  enabled: boolean;
}> = ({ intensity, enabled }) => {
  const fireRef = useRef<THREE.Points>(null);
  const positions = useRef<Float32Array>();

  useEffect(() => {
    const pos = new Float32Array(100 * 3);
    for (let i = 0; i < 100 * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 2;
      pos[i + 1] = Math.random() * 2;
      pos[i + 2] = (Math.random() - 0.5) * 2;
    }
    positions.current = pos;
  }, []);

  useFrame((state) => {
    if (fireRef.current && positions.current && enabled) {
      const positions = fireRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime * 2 + i) * 0.05 * intensity;
        if (positions[i + 1] > 2) {
          positions[i + 1] = 0;
        }
      }
      fireRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!enabled) return null;

  return (
    <points ref={fireRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={100}
          array={positions.current || new Float32Array()}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ff6b35"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
};

// Water Effect Component
const WaterEffect: React.FC<{ 
  intensity: number; 
  enabled: boolean;
}> = ({ intensity, enabled }) => {
  const waterRef = useRef<THREE.Points>(null);
  const positions = useRef<Float32Array>();

  useEffect(() => {
    const pos = new Float32Array(80 * 3);
    for (let i = 0; i < 80 * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 3;
      pos[i + 1] = (Math.random() - 0.5) * 3;
      pos[i + 2] = (Math.random() - 0.5) * 3;
    }
    positions.current = pos;
  }, []);

  useFrame((state) => {
    if (waterRef.current && positions.current && enabled) {
      const positions = waterRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += Math.sin(state.clock.elapsedTime * 1.5 + i) * 0.02 * intensity;
        positions[i + 2] += Math.cos(state.clock.elapsedTime * 1.5 + i) * 0.02 * intensity;
      }
      waterRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!enabled) return null;

  return (
    <points ref={waterRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={80}
          array={positions.current || new Float32Array()}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#4facfe"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Enhanced Card with Effects
const InteractiveCard: React.FC<{ 
  card: CardData;
  effects: EffectConfig[];
  isHovered: boolean;
}> = ({ card, effects, isHovered }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture(card.image_url || '/placeholder-card.jpg');
  
  useFrame((state) => {
    if (meshRef.current && groupRef.current) {
      // Breathing animation
      const breathing = Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
      groupRef.current.position.y = breathing;
      
      // Hover effect
      if (isHovered) {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.15;
        groupRef.current.scale.setScalar(1.08);
      } else {
        groupRef.current.rotation.y *= 0.95;
        groupRef.current.scale.setScalar(1);
      }
      
      // Effect-based animations
      const activeEffects = effects.filter(e => e.enabled);
      if (activeEffects.length > 0) {
        const material = meshRef.current.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = 0.2 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
  });
  
  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[2.5, 3.5, 0.02]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.3}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Render active effects */}
      {effects.map((effect, index) => {
        switch (effect.type) {
          case 'sparkles':
            return (
              <SparklesEffect
                key={index}
                count={effect.count}
                color={effect.color}
                speed={effect.speed}
                enabled={effect.enabled}
              />
            );
          case 'fire':
            return (
              <FireEffect
                key={index}
                intensity={effect.intensity}
                enabled={effect.enabled}
              />
            );
          case 'water':
            return (
              <WaterEffect
                key={index}
                intensity={effect.intensity}
                enabled={effect.enabled}
              />
            );
          default:
            return null;
        }
      })}
    </group>
  );
};

export const InteractiveCardEffects: React.FC<InteractiveCardEffectsProps> = ({
  card,
  className = '',
  showControls = true
}) => {
  const [effects, setEffects] = useState<EffectConfig[]>([
    { type: 'sparkles', intensity: 1, color: '#00ff88', speed: 1, count: 50, enabled: false },
    { type: 'fire', intensity: 1, color: '#ff6b35', speed: 1, count: 100, enabled: false },
    { type: 'water', intensity: 1, color: '#4facfe', speed: 1, count: 80, enabled: false },
    { type: 'wind', intensity: 1, color: '#a8edea', speed: 1, count: 60, enabled: false },
    { type: 'ice', intensity: 1, color: '#74b9ff', speed: 1, count: 40, enabled: false },
    { type: 'light', intensity: 1, color: '#fdcb6e', speed: 1, count: 30, enabled: false },
    { type: 'dark', intensity: 1, color: '#6c5ce7', speed: 1, count: 70, enabled: false },
    { type: 'rainbow', intensity: 1, color: '#e84393', speed: 1, count: 90, enabled: false }
  ]);
  
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState<EffectType>('sparkles');

  // Toggle effect
  const toggleEffect = useCallback((type: EffectType) => {
    setEffects(prev => prev.map(effect => 
      effect.type === type 
        ? { ...effect, enabled: !effect.enabled }
        : effect
    ));
  }, []);

  // Update effect configuration
  const updateEffect = useCallback((type: EffectType, updates: Partial<EffectConfig>) => {
    setEffects(prev => prev.map(effect => 
      effect.type === type 
        ? { ...effect, ...updates }
        : effect
    ));
  }, []);

  // Get current effect config
  const currentEffect = effects.find(e => e.type === selectedEffect);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
        />
        
        <InteractiveCard 
          card={card}
          effects={effects}
          isHovered={isHovered}
        />
        
        <ContactShadows
          opacity={0.3}
          scale={10}
          blur={1}
          far={10}
          resolution={256}
          color="#000000"
        />
      </Canvas>

      {/* Effect Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 bg-crd-darkest/90 backdrop-blur-sm rounded-lg p-4 w-80">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-crd-green" />
            <h3 className="text-crd-white font-medium">Interactive Effects</h3>
          </div>

          {/* Effect Type Selector */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {effects.map((effect) => (
              <Button
                key={effect.type}
                size="sm"
                variant={selectedEffect === effect.type ? "default" : "outline"}
                onClick={() => setSelectedEffect(effect.type)}
                className="text-xs p-2"
              >
                {effect.type === 'sparkles' && <Sparkles className="w-3 h-3" />}
                {effect.type === 'fire' && <Flame className="w-3 h-3" />}
                {effect.type === 'water' && <Droplets className="w-3 h-3" />}
                {effect.type === 'wind' && <Wind className="w-3 h-3" />}
                {effect.type === 'ice' && <Snowflake className="w-3 h-3" />}
                {effect.type === 'light' && <Sun className="w-3 h-3" />}
                {effect.type === 'dark' && <Moon className="w-3 h-3" />}
                {effect.type === 'rainbow' && <Palette className="w-3 h-3" />}
              </Button>
            ))}
          </div>

          {/* Effect Configuration */}
          {currentEffect && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-crd-white text-sm capitalize">{currentEffect.type}</span>
                <Switch
                  checked={currentEffect.enabled}
                  onCheckedChange={() => toggleEffect(currentEffect.type)}
                />
              </div>

              {currentEffect.enabled && (
                <div className="space-y-3">
                  <div>
                    <label className="text-crd-lightGray text-xs mb-2 block">Intensity</label>
                    <Slider
                      value={[currentEffect.intensity]}
                      onValueChange={([value]) => updateEffect(currentEffect.type, { intensity: value })}
                      max={2}
                      min={0.1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-crd-lightGray text-xs mb-2 block">Speed</label>
                    <Slider
                      value={[currentEffect.speed]}
                      onValueChange={([value]) => updateEffect(currentEffect.type, { speed: value })}
                      max={3}
                      min={0.1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-crd-lightGray text-xs mb-2 block">Count</label>
                    <Slider
                      value={[currentEffect.count]}
                      onValueChange={([value]) => updateEffect(currentEffect.type, { count: value })}
                      max={200}
                      min={10}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-crd-lightGray text-xs mb-2 block">Color</label>
                    <input
                      type="color"
                      value={currentEffect.color}
                      onChange={(e) => updateEffect(currentEffect.type, { color: e.target.value })}
                      className="w-full h-8 rounded border border-crd-mediumGray bg-crd-darkest"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2 pt-4 border-t border-crd-mediumGray/20">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAnimating(!isAnimating)}
              className="flex-1 text-xs"
            >
              {isAnimating ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
              {isAnimating ? 'Pause' : 'Animate'}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEffects(prev => prev.map(e => ({ ...e, enabled: false })));
              }}
              className="text-xs"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Active Effects Badges */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
        {effects.filter(e => e.enabled).map((effect) => (
          <Badge
            key={effect.type}
            variant="secondary"
            className="bg-crd-green/20 text-crd-green border-crd-green/30"
          >
            {effect.type}
          </Badge>
        ))}
      </div>
    </div>
  );
}; 