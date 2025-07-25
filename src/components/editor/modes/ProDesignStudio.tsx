import React, { useState, useRef, useEffect } from 'react';
import { ProfessionalWorkspace } from '@/components/studio/workspace/ProfessionalWorkspace';
import { Canvas } from '@/components/editor/canvas/Canvas';
import { ProDesignToolbar } from './ProDesignToolbar';
import { LayerManagementPanel } from './LayerManagementPanel';
import { AdvancedPropertiesPanel } from './AdvancedPropertiesPanel';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import type { CardData } from '@/hooks/useCardEditor';

interface ProDesignStudioProps {
  cardData: CardData;
  onComplete: (cardData: CardData) => void;
  onBack: () => void;
  className?: string;
  hideNavbar?: boolean;
}

export const ProDesignStudio: React.FC<ProDesignStudioProps> = ({
  cardData,
  onComplete,
  onBack,
  className = "",
  hideNavbar = true
}) => {
  const [currentCard, setCurrentCard] = useState(cardData);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Layer management state
  const [layers, setLayers] = useState([
    { id: 'background', name: 'Background', visible: true, locked: false, type: 'background' },
    { id: 'image', name: 'Main Image', visible: true, locked: false, type: 'image' },
    { id: 'text', name: 'Text Layer', visible: true, locked: false, type: 'text' }
  ]);

  // Hide/show navbar effect with improved detection
  useEffect(() => {
    const selectors = [
      '[data-navbar]',
      'nav',
      '.navbar',
      '[class*="navbar"]',
      '[class*="Navbar"]',
      'header[class*="nav"]'
    ];
    
    let navbar: HTMLElement | null = null;
    
    // Try multiple selectors to find the navbar
    for (const selector of selectors) {
      navbar = document.querySelector(selector) as HTMLElement;
      if (navbar) break;
    }
    
    if (hideNavbar && navbar) {
      // Store original display value
      const originalDisplay = navbar.style.display || '';
      navbar.setAttribute('data-pro-mode-original-display', originalDisplay);
      navbar.style.display = 'none';
      console.log('🎨 Pro Mode: Navbar hidden');
    }

    // Cleanup: restore navbar when component unmounts
    return () => {
      if (navbar) {
        const originalDisplay = navbar.getAttribute('data-pro-mode-original-display') || '';
        navbar.style.display = originalDisplay;
        navbar.removeAttribute('data-pro-mode-original-display');
        console.log('🎨 Pro Mode: Navbar restored');
      }
    };
  }, [hideNavbar]);

  // Add CSS class to body to manage overflow and positioning
  useEffect(() => {
    document.body.classList.add('pro-mode-active');
    
    return () => {
      document.body.classList.remove('pro-mode-active');
    };
  }, []);

  const handleSave = () => {
    console.log('💾 Saving Pro Design card');
    onComplete(currentCard);
  };

  const handleAddText = () => {
    const newLayer = {
      id: `text-${Date.now()}`,
      name: 'New Text',
      visible: true,
      locked: false,
      type: 'text'
    };
    setLayers(prev => [...prev, newLayer]);
  };

  const handleAddShape = (shapeType: string) => {
    const newLayer = {
      id: `shape-${Date.now()}`,
      name: `${shapeType} Shape`,
      visible: true,
      locked: false,
      type: 'shape'
    };
    setLayers(prev => [...prev, newLayer]);
  };

  const handleLayerVisibilityToggle = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const handleLayerSelect = (layerId: string) => {
    setSelectedElement(layerId);
  };

  if (isPreviewMode) {
    return (
      <div className="fixed inset-0 bg-black/90 z-[9999]">
        <div className="absolute top-4 right-4 space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsPreviewMode(false)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Editor
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Design
          </Button>
        </div>
        <div className="h-full flex items-center justify-center">
          <div className="max-w-md aspect-[2.5/3.5] bg-white rounded-lg shadow-2xl">
            <Canvas 
              ref={canvasRef}
              cardData={currentCard}
              selectedElement={selectedElement}
              onElementSelect={setSelectedElement}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 bg-background flex flex-col z-[9998] ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Standard
          </Button>
          <h2 className="text-lg font-semibold">Pro Design Studio</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewMode(true)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Design
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools & Layers */}
        <div className="w-80 border-r border-border flex flex-col">
          <ProDesignToolbar 
            onAddText={handleAddText}
            onAddShape={handleAddShape}
            selectedTool="select"
            onToolSelect={() => {}}
          />
          <LayerManagementPanel
            layers={layers}
            selectedLayer={selectedElement}
            onLayerSelect={handleLayerSelect}
            onLayerVisibilityToggle={handleLayerVisibilityToggle}
            onLayerDelete={(layerId) => {
              setLayers(prev => prev.filter(layer => layer.id !== layerId));
            }}
          />
        </div>

        {/* Center Canvas */}
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <div className="max-w-2xl aspect-[2.5/3.5] bg-white rounded-lg shadow-lg">
            <Canvas 
              ref={canvasRef}
              cardData={currentCard}
              selectedElement={selectedElement}
              onElementSelect={setSelectedElement}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 border-l border-border">
          <AdvancedPropertiesPanel
            selectedElement={selectedElement}
            cardData={currentCard}
            onPropertyChange={(elementId, property, value) => {
              console.log('Property change:', elementId, property, value);
              // Update card data with new property values
            }}
          />
        </div>
      </div>
    </div>
  );
};