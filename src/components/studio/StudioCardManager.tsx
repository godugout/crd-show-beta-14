import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import type { CardData } from '@/types/card';
import { Card3DPositioned } from './components/Card3DPositioned';
import { StudioScene } from './components/StudioScene';
import { BackgroundAnalyzer } from './utils/BackgroundAnalyzer';
import { StudioViewControls } from './components/StudioViewControls';
import { StudioCardInfoPanel } from './components/StudioCardInfoPanel';
import { StudioCaseSelector, type CaseStyle, getCaseStyles } from './components/StudioCaseSelector';

interface StudioCardManagerProps {
  cards: CardData[];
  selectedCardIndex: number;
  backgroundImage?: string;
  onCardSelect: (index: number) => void;
  onPositionChange?: (cardId: string, position: THREE.Vector3) => void;
  enableInteraction?: boolean;
  showGrid?: boolean;
  cameraControls?: boolean;
}

interface CardPosition {
  id: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  isSelected: boolean;
}

const FOREST_CONVERGENCE_POINT = new THREE.Vector3(0, -20, -30);
const DEFAULT_CARD_SPACING = 8;
const SELECTED_CARD_SCALE = 1.4;
const DEFAULT_CARD_SCALE = 1.0;

// Arrangement presets
const ARRANGEMENT_PRESETS = {
  CIRCLE: 'circle',
  GRID: 'grid',
  LINE: 'line',
  SPIRAL: 'spiral',
  SCATTER: 'scatter'
} as const;

type ArrangementType = typeof ARRANGEMENT_PRESETS[keyof typeof ARRANGEMENT_PRESETS];

// Camera controller component
const CameraController: React.FC<{
  targetPosition: THREE.Vector3;
  selectedCardPosition: THREE.Vector3;
}> = ({ targetPosition, selectedCardPosition }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    // Smoothly move camera to focus on selected card
    const idealPosition = selectedCardPosition.clone().add(new THREE.Vector3(0, 2, 8));
    camera.position.lerp(idealPosition, 0.05);
    camera.lookAt(selectedCardPosition);
  });

  return null;
};

export const StudioCardManager: React.FC<StudioCardManagerProps> = ({
  cards,
  selectedCardIndex = 0,
  backgroundImage,
  onCardSelect,
  onPositionChange,
  enableInteraction = true,
  showGrid = true,
  cameraControls = true
}) => {
  const [cardPositions, setCardPositions] = useState<CardPosition[]>([]);
  const [convergencePoint, setConvergencePoint] = useState<THREE.Vector3>(FOREST_CONVERGENCE_POINT);
  const [currentArrangement, setCurrentArrangement] = useState<ArrangementType>(ARRANGEMENT_PRESETS.CIRCLE);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseStyle>('none');
  const [isLiked, setIsLiked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbitControlsRef = useRef<any>(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate positions based on arrangement type
  const generateArrangementPositions = (arrangement: ArrangementType, convergence: THREE.Vector3) => {
    switch (arrangement) {
      case ARRANGEMENT_PRESETS.CIRCLE:
        return cards.map((card, index) => {
          const angle = (index / cards.length) * Math.PI * 2;
          const radius = 12;
          return new THREE.Vector3(
            convergence.x + Math.cos(angle) * radius,
            convergence.y + 3,
            convergence.z + Math.sin(angle) * radius
          );
        });

      case ARRANGEMENT_PRESETS.GRID:
        const cols = Math.ceil(Math.sqrt(cards.length));
        return cards.map((card, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;
          return new THREE.Vector3(
            convergence.x + (col - cols/2) * DEFAULT_CARD_SPACING,
            convergence.y + 3,
            convergence.z + (row - Math.ceil(cards.length/cols)/2) * DEFAULT_CARD_SPACING
          );
        });

      case ARRANGEMENT_PRESETS.LINE:
        return cards.map((card, index) => {
          return new THREE.Vector3(
            convergence.x + (index - cards.length/2) * DEFAULT_CARD_SPACING,
            convergence.y + 3,
            convergence.z
          );
        });

      case ARRANGEMENT_PRESETS.SPIRAL:
        return cards.map((card, index) => {
          const angle = index * 0.5;
          const radius = 5 + index * 2;
          return new THREE.Vector3(
            convergence.x + Math.cos(angle) * radius,
            convergence.y + 3 + index * 0.5,
            convergence.z + Math.sin(angle) * radius
          );
        });

      case ARRANGEMENT_PRESETS.SCATTER:
        return cards.map((card, index) => {
          const angle1 = (index * 2.4) % (Math.PI * 2);
          const angle2 = (index * 1.7) % (Math.PI * 2);
          const radius = 8 + (index % 3) * 4;
          return new THREE.Vector3(
            convergence.x + Math.cos(angle1) * radius,
            convergence.y + 3 + Math.sin(angle2) * 2,
            convergence.z + Math.sin(angle1) * radius
          );
        });

      default:
        return cards.map(() => convergence.clone());
    }
  };

  // Calculate optimal card positions based on arrangement and background analysis
  const calculateCardPositions = useMemo(() => {
    if (!cards.length) return [];

    const analyzer = new BackgroundAnalyzer();
    let convergence = convergencePoint;

    // Analyze background image if provided
    if (backgroundImage) {
      const analysisResult = analyzer.analyzeImage(backgroundImage);
      if (analysisResult.convergencePoint) {
        convergence = new THREE.Vector3(
          analysisResult.convergencePoint.x,
          analysisResult.convergencePoint.y,
          analysisResult.convergencePoint.z
        );
        setConvergencePoint(convergence);
      }
    }

    // Generate base positions using selected arrangement
    const basePositions = generateArrangementPositions(currentArrangement, convergence);
    
    // Create card position objects with proper rotations and scales
    return cards.map((card, index) => {
      const isSelected = index === selectedCardIndex;
      const basePosition = basePositions[index] || convergence.clone();
      
      // Selected card enhancement - move closer and up
      const position = basePosition.clone();
      if (isSelected) {
        position.z += 8;
        position.y += 3;
      }

      // Calculate rotation to face camera or center based on arrangement
      let rotation = new THREE.Euler(0, 0, 0);
      if (currentArrangement === ARRANGEMENT_PRESETS.CIRCLE || currentArrangement === ARRANGEMENT_PRESETS.SPIRAL) {
        const angle = Math.atan2(
          position.x - convergence.x,
          position.z - convergence.z
        );
        rotation = new THREE.Euler(0, angle + Math.PI, 0);
      }

      return {
        id: card.id,
        position,
        rotation,
        scale: isSelected ? SELECTED_CARD_SCALE : DEFAULT_CARD_SCALE,
        isSelected
      };
    });
  }, [cards, selectedCardIndex, backgroundImage, convergencePoint, currentArrangement]);

  // Update card positions when cards or selection changes
  useEffect(() => {
    setCardPositions(calculateCardPositions);
  }, [calculateCardPositions]);

  // Handle card click
  const handleCardClick = (cardIndex: number) => {
    if (!enableInteraction) return;
    
    console.log(`🎯 StudioCardManager: Card ${cardIndex} clicked`);
    onCardSelect(cardIndex);
  };

  // Get selected card position for camera control
  const selectedCardPosition = useMemo(() => {
    const selectedCard = cardPositions.find(pos => pos.isSelected);
    return selectedCard?.position || new THREE.Vector3(0, 0, 0);
  }, [cardPositions]);

  // View control handlers
  const handleResetView = () => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.reset();
    }
  };

  const handleToggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
  };

  const handleZoomIn = () => {
    if (orbitControlsRef.current) {
      const camera = orbitControlsRef.current.object;
      camera.position.multiplyScalar(0.8);
    }
  };

  const handleZoomOut = () => {
    if (orbitControlsRef.current) {
      const camera = orbitControlsRef.current.object;
      camera.position.multiplyScalar(1.2);
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    const selectedCard = cards[selectedCardIndex];
    if (selectedCard && navigator.share) {
      navigator.share({
        title: selectedCard.title,
        text: `Check out this card: ${selectedCard.title}`,
        url: window.location.href
      });
    }
  };

  // Get current selected card
  const selectedCard = cards[selectedCardIndex];

  // Enhanced lighting setup
  const lightingSetup = useMemo(() => (
    <>
      {/* Enhanced ambient lighting */}
      <ambientLight intensity={0.3} color={0x404080} />
      
      {/* Main directional light with warmer tone */}
      <directionalLight
        position={[15, 20, 10]}
        intensity={0.8}
        color={0xffeedd}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      
      {/* Fill light from opposite side */}
      <directionalLight
        position={[-10, 10, -5]}
        intensity={0.3}
        color={0x8899ff}
      />
      
      {/* Subtle rim light */}
      <pointLight
        position={[0, 5, -20]}
        intensity={0.5}
        color={0x66ccff}
        distance={50}
      />
    </>
  ), []);

  return (
    <div className="relative w-full h-screen">
      <Canvas
        ref={canvasRef}
        camera={{ 
          position: [0, 5, 20], 
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Enhanced Lighting Setup */}
        {lightingSetup}

        {/* Environment */}
        <Environment preset="studio" />

        {/* Studio Scene Background */}
        <StudioScene 
          backgroundImage={backgroundImage}
          convergencePoint={convergencePoint}
          showGrid={showGrid}
        />

        {/* Render Cards in 3D Space */}
        {cardPositions.map((cardPos, index) => (
          <Card3DPositioned
            key={cardPos.id}
            card={cards[index]}
            position={cardPos.position}
            rotation={cardPos.rotation}
            scale={cardPos.scale}
            isSelected={cardPos.isSelected}
            onClick={() => handleCardClick(index)}
            onPositionChange={(newPosition) => {
              onPositionChange?.(cardPos.id, newPosition);
            }}
            enableDrag={enableInteraction}
            caseStyle={selectedCase}
          />
        ))}

        {/* Camera Controls */}
        {cameraControls && (
          <OrbitControls
            ref={orbitControlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={autoRotate}
            autoRotateSpeed={2}
            minDistance={5}
            maxDistance={50}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
            target={selectedCardPosition}
          />
        )}

        <CameraController
          targetPosition={convergencePoint}
          selectedCardPosition={selectedCardPosition}
        />
      </Canvas>

      {/* Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && cards.length > 0 && (
        <div className="absolute top-4 right-4 bg-black/80 text-white p-2 rounded text-xs">
          <div>Cards: {cards.length}</div>
          <div>Selected: {selectedCardIndex}</div>
          <div>Convergence: {convergencePoint.toArray().map(n => n.toFixed(1)).join(', ')}</div>
        </div>
      )}

      {/* Arrangement Controls */}
      <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg">
        <h3 className="text-sm font-semibold mb-3 text-crd-blue">Card Arrangement</h3>
        <div className="flex flex-col gap-2">
          {Object.entries(ARRANGEMENT_PRESETS).map(([key, value]) => (
            <button
              key={value}
              onClick={() => setCurrentArrangement(value)}
              className={`px-3 py-2 rounded text-xs font-medium transition-all ${
                currentArrangement === value
                  ? 'bg-crd-blue text-white shadow-lg shadow-crd-blue/30'
                  : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
              }`}
            >
              {key.charAt(0) + key.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Card Navigation */}
      {cards.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === selectedCardIndex
                  ? 'bg-crd-blue scale-125'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Studio View Controls */}
      <StudioViewControls
        onResetView={handleResetView}
        autoRotate={autoRotate}
        onToggleAutoRotate={handleToggleAutoRotate}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onToggleFullscreen={handleToggleFullscreen}
        isFullscreen={isFullscreen}
      />

      {/* Card Information Panel */}
      {selectedCard && (
        <div className="absolute top-6 right-6 w-80 max-h-[50vh] overflow-y-auto">
          <StudioCardInfoPanel
            card={selectedCard}
            onLike={handleLike}
            onShare={handleShare}
            isLiked={isLiked}
          />
        </div>
      )}

      {/* Case Selector */}
      <div className="absolute bottom-6 left-6 w-60">
        <StudioCaseSelector
          selectedCase={selectedCase}
          onCaseChange={setSelectedCase}
        />
      </div>
    </div>
  );
};

export default StudioCardManager;