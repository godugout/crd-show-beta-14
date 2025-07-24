import React, { useState, useCallback, useEffect, useRef } from 'react';
import { CRDCanvasGrid } from './CRDCanvasGrid';
import { CRDToolbar } from '../toolbar/CRDToolbar';
import { ToolbarHotZone } from '../toolbar/ToolbarHotZone';
import { CRDFrameRenderer } from '../frame/CRDFrameRenderer';
import { CRDBottomInfoBar } from './CRDBottomInfoBar';
import { useGridPreferences } from '@/hooks/useGridPreferences';
import { useAutoHideToolbar } from '@/hooks/useAutoHideToolbar';
interface CRDCanvasProps {
  template: string;
  colorPalette: string;
  typography: string;
  effects: string[];
  cardTitle: string;
  cardDescription: string;
  playerImage: string | null;
  playerStats: Record<string, string>;
  previewMode: 'edit' | 'preview' | 'print';
  onImageUpload?: (files: File[]) => void;
  // New props for sidebar awareness
  leftSidebarCollapsed?: boolean;
  rightSidebarCollapsed?: boolean;
  isMobile?: boolean;
  // Frame props
  selectedFrame?: any;
  frameContent?: Record<string, any>;
}
export const CRDCanvas: React.FC<CRDCanvasProps> = ({
  template,
  colorPalette,
  typography,
  effects,
  cardTitle,
  cardDescription,
  playerImage,
  playerStats,
  previewMode,
  onImageUpload,
  leftSidebarCollapsed = true,
  rightSidebarCollapsed = true,
  isMobile = false,
  selectedFrame,
  frameContent = {}
}) => {
  // Canvas state - fixed optimal default zoom
  const [zoom, setZoom] = useState(150); // Single optimal default for engagement
  const [showRulers, setShowRulers] = useState(false);
  
  // Card positioning and interaction state
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Grid preferences with persistence
  const { gridType, showGrid, setGridType, setShowGrid, isLoaded } = useGridPreferences();
  
  // Auto-hide toolbar
  const { 
    getToolbarClasses, 
    getHotZoneProps, 
    onMouseEnter: onToolbarMouseEnter, 
    onMouseLeave: onToolbarMouseLeave 
  } = useAutoHideToolbar();

  // Canvas controls
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 25, 300));
  }, []);
  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 25, 25));
  }, []);
  const handleZoomReset = useCallback(() => {
    setZoom(150); // Reset to optimal default
  }, []);

  // Calculate card dimensions
  const cardAspectRatio = 2.5 / 3.5;
  const baseCardWidth = 420; // Increased from 320
  const baseCardHeight = baseCardWidth / cardAspectRatio;

  const cardWidth = baseCardWidth * zoom / 100;
  const cardHeight = baseCardHeight * zoom / 100;

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isLocked || !playerImage) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - cardPosition.x,
      y: e.clientY - cardPosition.y
    });
    e.preventDefault();
  }, [isLocked, playerImage, cardPosition]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || isLocked) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Optional: Add bounds checking to keep card within canvas
    if (canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const maxX = canvasRect.width - cardWidth;
      const maxY = canvasRect.height - cardHeight;
      
      setCardPosition({
        x: Math.max(-cardWidth / 2, Math.min(maxX / 2, newX)),
        y: Math.max(-cardHeight / 2, Math.min(maxY / 2, newY))
      });
    } else {
      setCardPosition({ x: newX, y: newY });
    }
  }, [isDragging, isLocked, dragStart, cardWidth, cardHeight]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Lock/unlock handler
  const handleLockToggle = useCallback(() => {
    setIsLocked(!isLocked);
  }, [isLocked]);
  const getBackgroundStyle = () => {
    const paletteColors = {
      classic: '#1E40AF',
      sports: '#DC2626',
      premium: '#D97706',
      modern: '#7C3AED',
      nature: '#059669'
    };
    const baseColor = paletteColors[colorPalette as keyof typeof paletteColors] || '#1E40AF';
    if (effects.includes('gradient')) {
      return {
        background: `linear-gradient(135deg, ${baseColor}, ${baseColor}80)`
      };
    }
    return {
      backgroundColor: baseColor
    };
  };
  const getGridRulerColors = () => {
    switch (gridType) {
      case 'standard':
        return {
          background: 'rgb(30, 64, 175, 0.95)',
          // blue-800
          border: 'rgb(59, 130, 246, 0.6)',
          // blue-500
          tick: 'rgb(59, 130, 246, 0.6)',
          // blue-500
          text: 'rgb(147, 197, 253)',
          // blue-300
          label: 'STD'
        };
      case 'print':
        return {
          background: 'rgb(21, 128, 61, 0.95)',
          // green-800
          border: 'rgb(34, 197, 94, 0.6)',
          // green-500
          tick: 'rgb(34, 197, 94, 0.6)',
          // green-500
          text: 'rgb(134, 239, 172)',
          // green-300
          label: 'PRT'
        };
      case 'golden':
        return {
          background: 'rgb(180, 83, 9, 0.95)',
          // amber-800
          border: 'rgb(251, 191, 36, 0.6)',
          // amber-500
          tick: 'rgb(251, 191, 36, 0.6)',
          // amber-500
          text: 'rgb(252, 211, 77)',
          // amber-300
          label: 'GLD'
        };
      case 'isometric':
        return {
          background: 'rgb(88, 28, 135, 0.95)',
          // purple-800
          border: 'rgb(147, 51, 234, 0.6)',
          // purple-500
          tick: 'rgb(147, 51, 234, 0.6)',
          // purple-500
          text: 'rgb(196, 181, 253)',
          // purple-300
          label: 'ISO'
        };
      case 'blueprint':
        return {
          background: 'rgb(14, 116, 144, 0.95)',
          // cyan-800
          border: 'rgb(6, 182, 212, 0.6)',
          // cyan-500
          tick: 'rgb(6, 182, 212, 0.6)',
          // cyan-500
          text: 'rgb(103, 232, 249)',
          // cyan-300
          label: 'BLP'
        };
      case 'photography':
        return {
          background: 'rgb(157, 23, 77, 0.95)',
          // pink-800
          border: 'rgb(236, 72, 153, 0.6)',
          // pink-500
          tick: 'rgb(236, 72, 153, 0.6)',
          // pink-500
          text: 'rgb(244, 114, 182)',
          // pink-300
          label: 'PHO'
        };
      default:
        return {
          background: 'rgb(75, 85, 99, 0.95)',
          border: 'rgb(156, 163, 175, 0.6)',
          tick: 'rgb(156, 163, 175, 0.6)',
          text: 'rgb(209, 213, 219)',
          label: 'GEN'
        };
    }
  };
  const getEffectsOverlay = () => {
    const overlayEffects = [];
    if (effects.includes('foil')) {
      overlayEffects.push('before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:opacity-60');
    }
    if (effects.includes('holographic')) {
      overlayEffects.push('before:absolute before:inset-0 before:bg-gradient-to-45 before:from-purple-500/30 before:via-blue-500/30 before:to-green-500/30');
    }
    if (effects.includes('chrome')) {
      overlayEffects.push('before:absolute before:inset-0 before:bg-gradient-to-r before:from-gray-300/40 before:via-white/60 before:to-gray-300/40');
    }
    return overlayEffects.join(' ');
  };
  return <div className="relative h-full w-full overflow-hidden bg-transparent flex flex-col">
      {/* Hot Zone for Toolbar Auto-Show */}
      <ToolbarHotZone {...getHotZoneProps()} />
      
      {/* Toolbar */}
      <CRDToolbar 
        zoom={zoom} 
        onZoomIn={handleZoomIn} 
        onZoomOut={handleZoomOut} 
        onZoomReset={handleZoomReset} 
        showGrid={showGrid} 
        onGridToggle={() => setShowGrid(!showGrid)} 
        gridType={gridType} 
        onGridTypeChange={setGridType} 
        showRulers={showRulers} 
        onRulersToggle={() => setShowRulers(!showRulers)}
        isLocked={isLocked}
        onLockToggle={handleLockToggle}
        className={getToolbarClasses()}
        onMouseEnter={onToolbarMouseEnter}
        onMouseLeave={onToolbarMouseLeave}
      />

      {/* Grid Background */}
      <CRDCanvasGrid showGrid={showGrid} gridType={gridType} gridSize={20} />

      {/* Canvas Area */}
      <div 
        ref={canvasRef}
        className="flex-1 w-full flex items-center justify-center relative z-10 pt-16 pb-20 overflow-hidden"
      >
        
        {/* Card Dropzone */}
        <div 
          className={`relative z-20 transition-transform duration-300 ease-out ${
            !isLocked && playerImage ? 'cursor-move' : ''
          } ${isDragging ? 'cursor-grabbing' : ''}`}
          style={{
            width: `${cardWidth}px`,
            height: `${cardHeight}px`,
            transform: `translate(${cardPosition.x}px, ${cardPosition.y}px)`
          }}
          onMouseDown={handleMouseDown}
        >
          {selectedFrame ? (
            // Show selected CRD frame
            <div 
              className="w-full h-full rounded-lg overflow-hidden"
              style={{
                boxShadow: `0 ${25 * zoom / 100}px ${60 * zoom / 100}px -${12 * zoom / 100}px rgba(0, 0, 0, 0.25)`
              }}
            >
              <CRDFrameRenderer 
                frame={selectedFrame}
                content={{
                  ...frameContent,
                  mainImage: playerImage
                }}
                colorTheme={{
                  primary: colorPalette === 'classic' ? 'hsl(220, 100%, 50%)' : 
                           colorPalette === 'vintage' ? 'hsl(30, 70%, 40%)' :
                           colorPalette === 'neon' ? 'hsl(280, 100%, 50%)' : 'hsl(200, 100%, 60%)',
                  secondary: colorPalette === 'classic' ? 'hsl(220, 100%, 70%)' : 
                             colorPalette === 'vintage' ? 'hsl(30, 50%, 60%)' :
                             colorPalette === 'neon' ? 'hsl(280, 80%, 70%)' : 'hsl(200, 80%, 80%)',
                  accent: 'hsl(45, 100%, 60%)',
                  neutral: 'hsl(220, 10%, 80%)'
                }}
                className="w-full h-full"
              />
            </div>
          ) : playerImage ? (
            // Show uploaded image without frame
            <div 
              className="w-full h-full rounded-lg overflow-hidden bg-white"
              style={{
                boxShadow: `0 ${25 * zoom / 100}px ${60 * zoom / 100}px -${12 * zoom / 100}px rgba(0, 0, 0, 0.25)`
              }}
            >
              <img
                src={playerImage}
                alt="Player"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            // Show upload dropzone
            <div
              className="w-full h-full border-2 border-dashed border-crd-blue/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-crd-blue transition-all duration-300 bg-crd-darker/80 backdrop-blur-sm hover:bg-crd-darker/90 group relative z-20"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file && onImageUpload) {
                    onImageUpload([file]);
                  }
                };
                input.click();
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                
                try {
                  // Check for reward card data first
                  const rewardData = e.dataTransfer.getData('application/json');
                  if (rewardData) {
                    const parsedData = JSON.parse(rewardData);
                    if (parsedData.type === 'example-card' && parsedData.imageUrl) {
                      // Create a virtual file for the example card
                      fetch(parsedData.imageUrl)
                        .then(res => res.blob())
                        .then(blob => {
                          const file = new File([blob], parsedData.name, { type: 'image/png' });
                          if (onImageUpload) {
                            onImageUpload([file]);
                          }
                        })
                        .catch(() => {
                          console.log('Using example card:', parsedData.imageUrl);
                        });
                      return;
                    }
                  }
                } catch (error) {
                  console.error('Error parsing reward data:', error);
                }
                
                // Handle regular file drops
                const files = Array.from(e.dataTransfer.files);
                if (files.length > 0 && onImageUpload) {
                  onImageUpload(files);
                }
              }}
            >
              <div className="text-center group-hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-crd-blue/20 flex items-center justify-center group-hover:bg-crd-blue/30 transition-colors">
                  <svg className="w-8 h-8 text-crd-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-crd-white mb-2">Add Player Image</h3>
                <p className="text-sm text-crd-lightGray mb-1">Click to upload or drag & drop</p>
                <p className="text-xs text-crd-lightGray/70">PNG, JPG up to 10MB</p>
              </div>
              
              {/* Card dimensions indicator */}
              <div className="absolute bottom-2 right-2 text-xs text-crd-lightGray/50 bg-crd-darkest/50 px-2 py-1 rounded">
                2.5" × 3.5"
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Info Bar */}
      <CRDBottomInfoBar
        selectedTemplate={template}
        colorPalette={colorPalette}
        effects={effects}
      />
    </div>;
};