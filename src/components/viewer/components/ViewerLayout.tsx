
import React from 'react';
import { ViewerHeader } from './ViewerHeader';
import { CompactCardDetails } from './CompactCardDetails';
import { ViewerControls } from './ViewerControls';
import { CardNavigationHandler } from './CardNavigationHandler';
import { ViewerInfoPanel } from './ViewerInfoPanel';
import { BackgroundRenderer } from './BackgroundRenderer';
import { EnhancedCardContainer } from './EnhancedCardContainer';
import { ViewerStatusIndicators } from './ViewerStatusIndicators';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import type { CardData } from '@/types/card';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { useDoubleClick } from '@/hooks/useDoubleClick';
import { useSafeZones } from '../hooks/useSafeZones';

interface ViewerLayoutProps {
  card: CardData;
  cards: any[];
  currentCardIndex: number;
  onCardChange?: (index: number) => void;
  onClose?: () => void;
  isFullscreen: boolean;
  showCustomizePanel: boolean;
  setShowCustomizePanel: (show: boolean) => void;
  isHovering: boolean;
  setIsHovering: (hover: boolean) => void;
  isHoveringControls: boolean;
  showEffects: boolean;
  setShowEffects: (show: boolean) => void;
  autoRotate: boolean;
  setAutoRotate: (rotate: boolean) => void;
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
  showStats: boolean;
  effectValues: EffectValues;
  selectedScene: any;
  selectedLighting: any;
  materialSettings: any;
  overallBrightness: number[];
  interactiveLighting: boolean;
  mousePosition: { x: number; y: number };
  rotation: { x: number; y: number };
  zoom: number;
  isDragging: boolean;
  frameStyles: any;
  enhancedEffectStyles: any;
  SurfaceTexture: any;
  environmentControls: any;
  containerRef: React.RefObject<HTMLDivElement>;
  cardContainerRef: React.RefObject<HTMLDivElement>;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleDragStart: (e: React.MouseEvent) => void;
  handleDrag: (e: React.MouseEvent) => void;
  handleDragEnd: () => void;
  handleZoom: (delta: number) => void;
  handleResetWithEffects: () => void;
  handleResetCamera: () => void;
  onCardClick: (event: React.MouseEvent) => void;
  hasMultipleCards: boolean;
  solidCardTransition?: boolean;
  selectedPresetId?: string;
}

export const ViewerLayout: React.FC<ViewerLayoutProps> = ({
  card,
  cards,
  currentCardIndex,
  onCardChange,
  onClose,
  isFullscreen,
  showCustomizePanel,
  setShowCustomizePanel,
  isHovering,
  setIsHovering,
  isHoveringControls,
  showEffects,
  setShowEffects,
  autoRotate,
  setAutoRotate,
  isFlipped,
  setIsFlipped,
  showStats,
  effectValues,
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness,
  interactiveLighting,
  mousePosition,
  rotation,
  zoom,
  isDragging,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  environmentControls,
  containerRef,
  cardContainerRef,
  handleMouseMove,
  handleDragStart,
  handleDrag,
  handleDragEnd,
  handleZoom,
  handleResetWithEffects,
  handleResetCamera,
  onCardClick,
  hasMultipleCards,
  solidCardTransition,
  selectedPresetId
}) => {
  const panelWidth = 320;
  const shouldShowPanel = showCustomizePanel;
  
  // Track mouse position for auto-hide functionality
  const globalMousePosition = useMousePosition(100);

  const { isInSafeZone } = useSafeZones({
    panelWidth,
    showPanel: shouldShowPanel,
    showStats,
    hasNavigation: hasMultipleCards,
  });

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onToggleEffects: () => setShowEffects(!showEffects),
    onToggleFullscreen: () => {}, // Will be implemented in parent
    onResetCard: handleResetWithEffects,
    onToggleFlip: () => setIsFlipped(!isFlipped),
    onTogglePanel: () => setShowCustomizePanel(!showCustomizePanel),
    isActive: true
  });

  const handleCanvasDoubleClick = useDoubleClick({
    onDoubleClick: (event: React.MouseEvent) => {
      // Prevent flipping if click is on the card container itself
      if (cardContainerRef.current && cardContainerRef.current.contains(event.target as Node)) {
        return;
      }

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (!isInSafeZone(event.clientX, event.clientY, rect)) {
          // Prevent flip on interactive elements within overlays
          const target = event.target as HTMLElement;
          if (!target.closest('button, a, input, [role="slider"], [data-radix-collection-item]')) {
            setIsFlipped(!isFlipped);
          }
        }
      }
    },
  });

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-50 flex items-center justify-center select-none ${
        isFullscreen ? 'p-0' : 'p-8'
      } ${shouldShowPanel ? `pr-[${panelWidth + 32}px]` : ''}`}
      style={{
        paddingRight: shouldShowPanel ? `${panelWidth + 32}px` : isFullscreen ? '0' : '32px',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onClick={handleCanvasDoubleClick}
    >
      <BackgroundRenderer
        selectedScene={selectedScene}
        mousePosition={mousePosition}
        isHovering={isHovering}
      />

      {/* Status Indicators */}
      <ViewerStatusIndicators
        effectValues={effectValues}
        selectedScene={selectedScene}
        selectedLighting={selectedLighting}
        showEffects={showEffects}
        interactiveLighting={interactiveLighting}
        showCustomizePanel={showCustomizePanel}
        selectedPresetId={selectedPresetId}
      />

      {/* Header */}
      <ViewerHeader
        onClose={onClose}
        showStudioButton={!shouldShowPanel}
        onOpenStudio={() => setShowCustomizePanel(true)}
      />

      {/* Compact Card Details */}
      <div className="absolute bottom-20 left-4 z-20 select-none">
        <CompactCardDetails 
          card={card}
          effectValues={effectValues}
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          materialSettings={materialSettings}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
        />
      </div>

      {/* Basic Controls */}
      <div className={`transition-opacity duration-200 ${isHoveringControls ? 'opacity-100 z-20' : 'opacity-100 z-10'}`}>
        <ViewerControls
          showEffects={showEffects}
          autoRotate={autoRotate}
          onToggleEffects={() => setShowEffects(!showEffects)}
          onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
          onReset={handleResetWithEffects}
          onZoomIn={() => handleZoom(0.1)}
          onZoomOut={() => handleZoom(-0.1)}
        />
      </div>

      {/* Card Navigation Controls */}
      <CardNavigationHandler
        cards={cards}
        currentCardIndex={currentCardIndex}
        onCardChange={onCardChange}
        setIsFlipped={setIsFlipped}
      />

      {/* Enhanced Card Container */}
      <div ref={cardContainerRef}>
        <EnhancedCardContainer
          card={card}
          isHovering={isHovering}
          isFlipped={isFlipped}
          showEffects={showEffects}
          effectValues={effectValues}
          mousePosition={mousePosition}
          rotation={rotation}
          zoom={zoom}
          isDragging={isDragging}
          frameStyles={frameStyles}
          enhancedEffectStyles={enhancedEffectStyles}
          SurfaceTexture={SurfaceTexture}
          interactiveLighting={interactiveLighting}
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          materialSettings={materialSettings}
          overallBrightness={overallBrightness}
          environmentControls={environmentControls}
          showBackgroundInfo={false}
          onMouseDown={handleDragStart}
          onMouseMove={handleDrag}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={onCardClick}
          solidCardTransition={solidCardTransition}
        />
      </div>

      {/* Info Panel - Auto-hide based on mouse position */}
      <ViewerInfoPanel
        showStats={showStats}
        isFlipped={isFlipped}
        shouldShowPanel={shouldShowPanel}
        hasMultipleCards={hasMultipleCards}
        isVisible={globalMousePosition.isNearBottom}
      />
    </div>
  );
};
