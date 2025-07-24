import React, { useMemo, useState, useCallback } from 'react';
import type { CRDFrame, CRDRegion, CropResult, CropToolConfig } from '@/types/crd-frame';
import { CRDAdvancedCropper } from './CRDAdvancedCropper';
interface CRDFrameEngineProps {
  frame: CRDFrame;
  content: Record<string, any>;
  selectedVisualStyle?: string;
  onContentChange: (regionId: string, content: any) => void;
  onCropComplete: (result: CropResult) => void;
  className?: string;
}
export const CRDFrameEngine: React.FC<CRDFrameEngineProps> = ({
  frame,
  content,
  selectedVisualStyle = 'classic_matte',
  onContentChange,
  onCropComplete,
  className = ''
}) => {
  const [activeCropRegion, setActiveCropRegion] = useState<string | null>(null);
  const [cropConfig, setCropConfig] = useState<CropToolConfig | null>(null);

  // Parse frame configuration
  const frameConfig = useMemo(() => {
    return frame.frame_config;
  }, [frame.frame_config]);

  // Calculate scaled dimensions for display
  const displayDimensions = useMemo(() => {
    const maxWidth = 400;
    const maxHeight = 600;
    const {
      width,
      height
    } = frameConfig.dimensions;
    const widthRatio = maxWidth / width;
    const heightRatio = maxHeight / height;
    const scale = Math.min(widthRatio, heightRatio, 1);
    return {
      width: width * scale,
      height: height * scale,
      scale
    };
  }, [frameConfig.dimensions]);

  // Handle region click for photo regions
  const handleRegionClick = useCallback((region: CRDRegion) => {
    if (region.type === 'photo' && region.cropSettings?.enabled) {
      setActiveCropRegion(region.id);
      setCropConfig({
        enabled: true,
        regionId: region.id,
        aspectRatio: region.constraints.aspectRatio,
        minCropSize: region.constraints.minSize,
        allowRotation: region.cropSettings.allowRotation || false,
        allowBackgroundRemoval: region.cropSettings.allowBackgroundRemoval || false,
        cropHandles: {
          corner: true,
          edge: true,
          rotate: region.cropSettings.allowRotation || false
        },
        snapToGrid: true,
        gridSize: 10
      });
    }
  }, []);


  // Render individual region
  const renderRegion = useCallback((region: CRDRegion) => {
    // Safety check for bounds
    if (!region.bounds) {
      console.warn('Region missing bounds:', region);
      return null;
    }
    const {
      x,
      y,
      width,
      height
    } = region.bounds;
    const {
      scale
    } = displayDimensions;
    const scaledBounds = {
      left: x * scale,
      top: y * scale,
      width: width * scale,
      height: height * scale
    };
    const regionContent = content[region.id];
    const hasContent = regionContent && regionContent.src;
    const regionStyle: React.CSSProperties = {
      position: 'absolute',
      ...scaledBounds,
      borderRadius: region.styling?.border?.radius || 0,
      border: region.styling?.border && region.styling.border.width > 0 ? `${region.styling.border.width}px ${region.styling.border.style} ${region.styling.border.color}` : 'none',
      background: region.styling?.background?.value || 'transparent',
      clipPath: region.styling?.clipPath,
      cursor: 'default',
      overflow: 'hidden'
    };
    return <div key={region.id} style={regionStyle} onClick={() => {
      if (region.type === 'photo' && hasContent) {
        handleRegionClick(region);
      }
    }}>
        {/* Region Content */}
        {hasContent ? <div className="relative w-full h-full">
            <img src={regionContent.src} alt={regionContent.alt || region.name} className="w-full h-full object-cover" style={{
          transform: regionContent.transform || 'none'
        }} />
            {/* Auto-crop indicator */}
            {regionContent.autoCropped && <div className="absolute top-2 left-2 bg-primary/90 text-white text-xs px-2 py-1 rounded">
                Auto-cropped
              </div>}
            {/* Print quality warning */}
            {regionContent.printQuality && !regionContent.printQuality.sufficient && <div className="absolute top-2 right-2 bg-yellow-500/90 text-white text-xs px-2 py-1 rounded">
                Low DPI
              </div>}
          </div> : <div className="w-full h-full flex items-center justify-center bg-transparent">
          </div>}

        {/* Crop indicator */}
        {region.type === 'photo' && hasContent && region.cropSettings?.enabled && <div className="absolute top-1 right-1 bg-primary/80 text-white text-xs px-1.5 py-0.5 rounded">
            Crop
          </div>}
      </div>;
  }, [content, displayDimensions, handleRegionClick]);

  // Render frame elements (decorative elements, text, etc.)
  const renderElements = useCallback(() => {
    // Safety check for elements array
    if (!frameConfig.elements || !Array.isArray(frameConfig.elements)) {
      return [];
    }
    return frameConfig.elements.map(element => {
      const {
        scale
      } = displayDimensions;

      // Add safety checks for element properties
      if (!element?.properties?.position) return null;
      const elementStyle: React.CSSProperties = {
        position: 'absolute',
        left: element.properties.position.x * scale,
        top: element.properties.position.y * scale,
        transform: element.properties.rotation ? `rotate(${element.properties.rotation}deg)` : 'none',
        opacity: element.properties.opacity || 1
      };
      switch (element.type) {
        case 'text':
          return <div key={element.id} style={{
            ...elementStyle,
            fontSize: (element.properties.font?.size || 16) * scale,
            fontFamily: element.properties.font?.family || 'inherit',
            fontWeight: element.properties.font?.weight || 400,
            color: element.properties.color || '#ffffff'
          }}>
              {element.properties.content || element.name}
            </div>;
        case 'image':
        case 'svg':
          return <img key={element.id} src={element.properties.src} alt={element.properties.alt || element.name} style={{
            ...elementStyle,
            width: element.properties.size ? element.properties.size.width * scale : 'auto',
            height: element.properties.size ? element.properties.size.height * scale : 'auto'
          }} />;
        default:
          return null;
      }
    });
  }, [frameConfig.elements, displayDimensions]);
  return <div className={`relative ${className}`}>
      {/* Main Frame Container */}
      <div className="relative bg-transparent rounded-lg overflow-hidden" style={{
      width: displayDimensions.width,
      height: displayDimensions.height
    }}>
        {/* Background */}
        <div className="absolute inset-0" style={{
        background: 'transparent'
      }} />

        {/* Regions */}
        {frameConfig.regions.map(renderRegion)}

        {/* Frame Elements */}
        {renderElements()}

        {/* Visual Style Overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
        background: selectedVisualStyle === 'holographic' ? 'linear-gradient(45deg, rgba(255,0,128,0.1) 0%, rgba(0,255,128,0.1) 50%, rgba(0,128,255,0.1) 100%)' : 'none',
        mixBlendMode: selectedVisualStyle === 'holographic' ? 'overlay' : 'normal'
      }} />
      </div>

      {/* Advanced Cropper Modal */}
      {activeCropRegion && cropConfig && <CRDAdvancedCropper isOpen={!!activeCropRegion} imageUrl={content[activeCropRegion]?.src} config={cropConfig} onClose={() => {
      setActiveCropRegion(null);
      setCropConfig(null);
    }} onCropComplete={result => {
      onCropComplete(result);
      setActiveCropRegion(null);
      setCropConfig(null);
    }} />}

    </div>;
};