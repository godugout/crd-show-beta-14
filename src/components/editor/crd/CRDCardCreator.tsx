import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Layers, Image, Type, Palette, Settings, Eye, Save, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CRDGradientLogo } from '@/components/home/navbar/CRDGradientLogo';
import { InteractiveCardData } from '@/types/interactiveCard';
import { CRDLayoutTab } from './tabs/CRDLayoutTab';
import { CRDDesignTab } from './tabs/CRDDesignTab';
import { CRDContentTab } from './tabs/CRDContentTab';
import { CRDExportTab } from './tabs/CRDExportTab';
import { CRDCanvas } from './canvas/CRDCanvas';
import { CRDSidebar } from './sidebar/CRDSidebar';
import { CollapsibleSidebar } from './sidebar/CollapsibleSidebar';
import { LeftSidebarContent, LeftSidebarCollapsedContent } from './sidebar/LeftSidebarContent';
import { RightSidebarCollapsedContent } from './sidebar/RightSidebarCollapsed';
import { PSDModeRightSidebar } from './sidebar/PSDModeRightSidebar';
import { PSDFabricCanvas } from './canvas/PSDFabricCanvas';
import { PSDLayer } from '@/components/editor/crd/import/CRDPSDProcessor';
interface CRDCardCreatorProps {
  initialCard?: Partial<InteractiveCardData>;
  onSave: (card: InteractiveCardData) => void;
  onPreview: (card: InteractiveCardData) => void;
}
export const CRDCardCreator: React.FC<CRDCardCreatorProps> = ({
  initialCard,
  onSave,
  onPreview
}) => {
  const navigate = useNavigate();
  const [cardData, setCardData] = useState<InteractiveCardData>({
    id: initialCard?.id || `crd_${Date.now()}`,
    title: initialCard?.title || 'Untitled CRD Collectible',
    description: initialCard?.description || '',
    rarity: initialCard?.rarity || 'common',
    creator_id: initialCard?.creator_id || 'current_user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assets: {
      images: [],
      videos: []
    },
    version: 1
  });

  // CRDMKR State
  const [activeTab, setActiveTab] = useState('layout');
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview' | 'print'>('edit');
  const [selectedTemplate, setSelectedTemplate] = useState('baseball-classic');
  const [colorPalette, setColorPalette] = useState('classic');
  const [typography, setTypography] = useState('modern');
  const [effects, setEffects] = useState<string[]>([]);
  const [playerImage, setPlayerImage] = useState<string | null>(null);
  const [playerStats, setPlayerStats] = useState<Record<string, string>>({});
  const [showGuides, setShowGuides] = useState(false);
  
  // Frame selection state
  const [selectedFrame, setSelectedFrame] = useState<any>(null);
  const [frameContent, setFrameContent] = useState<Record<string, any>>({});
  
  // Sidebar collapse states with mobile-first logic
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  
  // PSD Integration State
  const [isPSDMode, setIsPSDMode] = useState(false);
  const [psdLayers, setPSDLayers] = useState<PSDLayer[]>([]);
  const [psdThumbnail, setPSDThumbnail] = useState<string>('');
  const [visibleLayers, setVisibleLayers] = useState<Set<string>>(new Set());
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [layerOpacity, setLayerOpacity] = useState<Map<string, number>>(new Map());
  
  // Mobile detection and responsive behavior
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768; // md breakpoint
      setIsMobile(isMobileDevice);
      
      // On mobile, default to both sidebars collapsed
      if (isMobileDevice) {
        setLeftSidebarCollapsed(true);
        setRightSidebarCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Mobile sidebar logic - only allow one sidebar open at a time
  const handleLeftSidebarToggle = useCallback(() => {
    if (isMobile && !leftSidebarCollapsed && !rightSidebarCollapsed) {
      // If both are open on mobile, close right when opening left
      setRightSidebarCollapsed(true);
    }
    setLeftSidebarCollapsed(!leftSidebarCollapsed);
  }, [leftSidebarCollapsed, rightSidebarCollapsed, isMobile]);
  
  const handleRightSidebarToggle = useCallback(() => {
    if (isMobile && !rightSidebarCollapsed && !leftSidebarCollapsed) {
      // If both are open on mobile, close left when opening right
      setLeftSidebarCollapsed(true);
    }
    setRightSidebarCollapsed(!rightSidebarCollapsed);
  }, [leftSidebarCollapsed, rightSidebarCollapsed, isMobile]);
  const updateCardData = useCallback((updates: Partial<InteractiveCardData>) => {
    setCardData(prev => ({
      ...prev,
      ...updates,
      updated_at: new Date().toISOString(),
      version: prev.version + 1
    }));
  }, []);
  const handleSave = useCallback(() => {
    onSave(cardData);
  }, [cardData, onSave]);
  const handlePreview = useCallback(() => {
    onPreview(cardData);
    setPreviewMode('preview');
  }, [cardData, onPreview]);
  const handleExport = useCallback((format: string, options: any) => {
    console.log('Exporting CRD Collectible:', {
      format,
      options,
      cardData
    });
    // Implementation for actual export functionality
  }, [cardData]);

  // PSD Integration Handlers
  const handlePSDModeChange = useCallback((isActive: boolean, layers?: PSDLayer[], thumbnail?: string) => {
    setIsPSDMode(isActive);
    if (isActive && layers) {
      console.log('🔄 Activating PSD mode with', layers.length, 'layers');
      
      // Import smart layer visibility utility
      import('@/utils/psdLayerUtils').then(({ getEssentialLayers, getLayerStats }) => {
        const stats = getLayerStats(layers);
        console.log('📊 Layer stats:', stats);
        
        const essentialLayers = getEssentialLayers(layers);
        console.log('✅ Essential layers:', Array.from(essentialLayers));
        
        setPSDLayers(layers);
        setPSDThumbnail(thumbnail || '');
        setVisibleLayers(essentialLayers);
        setLayerOpacity(new Map(layers.map(layer => [layer.id, layer.styleProperties?.opacity || 100])));
      });
    } else {
      console.log('⏹️ Exiting PSD mode');
      setPSDLayers([]);
      setPSDThumbnail('');
      setVisibleLayers(new Set());
      setSelectedLayer(null);
      setLayerOpacity(new Map());
    }
  }, []);

  const handleLayerVisibilityToggle = useCallback((layerId: string) => {
    setVisibleLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  }, []);

  const handleLayerOpacityChange = useCallback((layerId: string, opacity: number) => {
    setLayerOpacity(prev => {
      const newMap = new Map(prev);
      newMap.set(layerId, opacity);
      return newMap;
    });
  }, []);

  const handleApplyToCanvas = useCallback(() => {
    console.log('Applying PSD layers to canvas:', Array.from(visibleLayers));
    // Apply visible layers to the main canvas
  }, [visibleLayers]);

  const handleGenerateCard = useCallback(() => {
    console.log('Generating card from PSD layers:', Array.from(visibleLayers));
    // Generate a card based on current PSD layer setup
  }, [visibleLayers]);
  return (
    <div className="h-screen w-full flex flex-col relative pt-16">
      
      {/* Content with higher z-index */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 h-20 px-6 border-b border-crd-mediumGray/20 bg-crd-darker/50 flex flex-col">
          {/* Top Row: CRDMKR Logo, Centered Title with Icon, Action Buttons */}
          <div className="relative flex items-center justify-between h-12">
            {/* Left: CRDMKR Logo */}
            <div className="flex items-center">
              <CRDGradientLogo className="h-8" />
            </div>
            
            {/* Center: Blue Icon + Title (Absolutely positioned for true centering) */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
              <Layers className="w-6 h-6 text-crd-blue" />
              <input 
                type="text"
                value={cardData.title}
                onChange={(e) => updateCardData({ title: e.target.value })}
                className="text-2xl font-bold text-crd-white bg-transparent border-none outline-none focus:bg-crd-darker/30 focus:px-1 focus:py-1 focus:rounded transition-all text-center max-w-md px-1"
                placeholder="Enter CRD name..."
              />
            </div>
            
            {/* Right: Action Buttons */}
            <div className="flex items-center gap-3">
              <div className="flex bg-crd-mediumGray/20 rounded-lg p-1">
                <button onClick={() => setPreviewMode('edit')} className={`px-3 py-1 text-sm rounded transition-colors ${previewMode === 'edit' ? 'bg-crd-blue text-white' : 'text-crd-lightGray hover:text-crd-white'}`}>
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => setPreviewMode('preview')} className={`px-3 py-1 text-sm rounded transition-colors ${previewMode === 'preview' ? 'bg-crd-blue text-white' : 'text-crd-lightGray hover:text-crd-white'}`}>
                  Preview
                </button>
                <button onClick={() => setPreviewMode('print')} className={`px-3 py-1 text-sm rounded transition-colors ${previewMode === 'print' ? 'bg-crd-blue text-white' : 'text-crd-lightGray hover:text-crd-white'}`}>
                  Print
                </button>
              </div>
              
              <CRDButton onClick={handleSave} variant="secondary" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </CRDButton>
              <CRDButton onClick={handlePreview} variant="primary" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </CRDButton>
            </div>
          </div>
          
          {/* Bottom Row: Centered Tags */}
          <div className="flex items-center justify-center gap-2 h-8 text-xs text-crd-lightGray">
            <div className="bg-crd-mediumGray/20 px-2 py-1 rounded">
              v{cardData.version}
            </div>
            <div className="bg-crd-mediumGray/20 px-2 py-1 rounded">
              {cardData.rarity.charAt(0).toUpperCase() + cardData.rarity.slice(1)}
            </div>
            <div className="bg-crd-mediumGray/20 px-2 py-1 rounded">
              Print Ready
            </div>
            <div className="bg-crd-mediumGray/20 px-2 py-1 rounded">
              CRD-{cardData.id.slice(-4)}
            </div>
          </div>
        </div>

        {/* Main Content - Full Width Canvas with Overlay Sidebars */}
        <div className="flex-1 relative w-full">
          {/* Full Width Canvas */}
          <div className="w-full h-full bg-crd-darkest relative">
            {isPSDMode ? (
              <PSDFabricCanvas
                layers={psdLayers}
                visibleLayers={visibleLayers}
                thumbnail={psdThumbnail}
                onLayerSelect={setSelectedLayer}
                selectedLayer={selectedLayer}
              />
            ) : (
              <CRDCanvas 
                template={selectedTemplate} 
                colorPalette={colorPalette} 
                typography={typography} 
                effects={effects} 
                cardTitle={cardData.title} 
                cardDescription={cardData.description || ''} 
                playerImage={playerImage} 
                playerStats={playerStats} 
                previewMode={previewMode}
                leftSidebarCollapsed={leftSidebarCollapsed}
                rightSidebarCollapsed={rightSidebarCollapsed}
                isMobile={isMobile}
                selectedFrame={selectedFrame}
                frameContent={frameContent}
                onImageUpload={(files) => {
                  if (files.length > 0) {
                    const file = files[0];
                    const imageUrl = URL.createObjectURL(file);
                    setPlayerImage(imageUrl);
                    setFrameContent(prev => ({ ...prev, mainImage: imageUrl }));
                  }
                }}
              />
            )}
          </div>

          {/* Left Collapsible Sidebar - Tools */}
          <CollapsibleSidebar
            isCollapsed={leftSidebarCollapsed}
            onToggle={handleLeftSidebarToggle}
            side="left"
            collapsedContent={<LeftSidebarCollapsedContent activeTab={activeTab} />}
            className=""
            style={{ '--sidebar-width': isMobile ? '300px' : '380px' } as React.CSSProperties}
          >
            <LeftSidebarContent
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedTemplate={selectedTemplate}
              onTemplateSelect={setSelectedTemplate}
              colorPalette={colorPalette}
              onColorPaletteChange={setColorPalette}
              typography={typography}
              onTypographyChange={setTypography}
              effects={effects}
              onEffectsChange={setEffects}
              cardData={cardData}
              updateCardData={updateCardData}
              playerImage={playerImage}
              setPlayerImage={setPlayerImage}
              playerStats={playerStats}
              setPlayerStats={setPlayerStats}
              onExport={handleExport}
              isPSDMode={isPSDMode}
              psdLayers={psdLayers}
              onPSDModeChange={handlePSDModeChange}
              selectedFrame={selectedFrame}
              onFrameSelect={setSelectedFrame}
              frameContent={frameContent}
              onFrameContentChange={setFrameContent}
            />
          </CollapsibleSidebar>

          {/* PSD Mode Indicator */}
          {isPSDMode && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
              <div className="bg-crd-blue/90 backdrop-blur-sm border border-crd-blue/30 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                <Layers className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">PSD Mode Active</span>
                <CRDButton
                  variant="outline"
                  size="sm"
                  onClick={() => handlePSDModeChange(false)}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs px-2 py-1 h-6"
                >
                  Exit
                </CRDButton>
              </div>
            </div>
          )}

          {/* Right Collapsible Sidebar - Properties */}
          <CollapsibleSidebar
            isCollapsed={rightSidebarCollapsed}
            onToggle={handleRightSidebarToggle}
            side="right"
            collapsedContent={<RightSidebarCollapsedContent />}
            className=""
            style={{ '--sidebar-width': isMobile ? '300px' : '380px' } as React.CSSProperties}
          >
            {isPSDMode ? (
              <PSDModeRightSidebar
                layers={psdLayers}
                visibleLayers={visibleLayers}
                selectedLayer={selectedLayer}
                layerOpacity={layerOpacity}
                onLayerVisibilityToggle={handleLayerVisibilityToggle}
                onLayerSelect={setSelectedLayer}
                onLayerOpacityChange={handleLayerOpacityChange}
                onApplyToCanvas={handleApplyToCanvas}
                onGenerateCard={handleGenerateCard}
              />
            ) : (
              <CRDSidebar 
                cardData={cardData} 
                onCardDataUpdate={updateCardData} 
                cardTitle={cardData.title} 
                playerImage={playerImage} 
                selectedTemplate={selectedTemplate} 
                colorPalette={colorPalette} 
                effects={effects} 
                previewMode={previewMode} 
              />
            )}
          </CollapsibleSidebar>
        </div>
      </div>
    </div>
  );
};
