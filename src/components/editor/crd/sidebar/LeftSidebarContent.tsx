import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CRDLayoutTab } from '../tabs/CRDLayoutTab';
import { CRDDesignTab } from '../tabs/CRDDesignTab';
import { CRDContentTab } from '../tabs/CRDContentTab';
import { CRDExportTab } from '../tabs/CRDExportTab';
import { CRDImportTab } from '../tabs/CRDImportTab';
import { InteractiveCardData } from '@/types/interactiveCard';
import { Layers, Palette, Type, Download, Upload } from 'lucide-react';

interface LeftSidebarContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedTemplate: string;
  onTemplateSelect: (template: string) => void;
  colorPalette: string;
  onColorPaletteChange: (palette: string) => void;
  typography: string;
  onTypographyChange: (typography: string) => void;
  effects: string[];
  onEffectsChange: (effects: string[]) => void;
  cardData: InteractiveCardData;
  updateCardData: (updates: Partial<InteractiveCardData>) => void;
  playerImage: string | null;
  setPlayerImage: (image: string | null) => void;
  playerStats: Record<string, string>;
  setPlayerStats: (stats: Record<string, string>) => void;
  onExport: (format: string, options: any) => void;
  onFrameGenerated?: (frameData: any) => void;
  onCardGenerated?: (cardData: any) => void;
  onApplyToCanvas?: (layers: any[], visibleLayers: Set<string>) => void;
  isPSDMode?: boolean;
  psdLayers?: any[];
  onPSDModeChange?: (isActive: boolean, layers?: any[], thumbnail?: string) => void;
  // Frame props
  selectedFrame?: any;
  onFrameSelect?: (frame: any) => void;
  frameContent?: Record<string, any>;
  onFrameContentChange?: (content: Record<string, any>) => void;
}

export const LeftSidebarContent: React.FC<LeftSidebarContentProps> = ({
  activeTab,
  setActiveTab,
  selectedTemplate,
  onTemplateSelect,
  colorPalette,
  onColorPaletteChange,
  typography,
  onTypographyChange,
  effects,
  onEffectsChange,
  cardData,
  updateCardData,
  playerImage,
  setPlayerImage,
  playerStats,
  setPlayerStats,
  onExport,
  onFrameGenerated,
  onCardGenerated,
  onPSDModeChange,
  selectedFrame,
  onFrameSelect,
  frameContent,
  onFrameContentChange
}) => {
  const onApplyToCanvas = (layers: any[], visibleLayers: Set<string>) => {
    console.log('Apply PSD layers to canvas:', { layers, visibleLayers });
  };

  const handlePSDModeActivate = (layers: any[], thumbnail?: string) => {
    onPSDModeChange?.(true, layers, thumbnail);
  };
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
      <TabsList className="grid grid-cols-5 w-full bg-crd-mediumGray/20 p-1 mx-3 mt-3 mb-0">
        <TabsTrigger value="import" className="text-xs">Import</TabsTrigger>
        <TabsTrigger value="layout" className="text-xs">Layout</TabsTrigger>
        <TabsTrigger value="design" className="text-xs">Design</TabsTrigger>
        <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
        <TabsTrigger value="export" className="text-xs">Export</TabsTrigger>
      </TabsList>
      
      <div className="p-3 space-y-4 flex-1 overflow-y-auto">
        <TabsContent value="import" className="mt-0">
          <CRDImportTab 
            onFrameGenerated={onFrameGenerated}
            onCardGenerated={onCardGenerated}
            onApplyToCanvas={onApplyToCanvas}
            onPSDModeActivate={handlePSDModeActivate}
          />
        </TabsContent>
        
        <TabsContent value="layout" className="mt-0">
            <CRDLayoutTab 
              selectedTemplate={selectedTemplate} 
              onTemplateSelect={onTemplateSelect}
              cardData={cardData}
              updateCardData={updateCardData}
              selectedFrame={selectedFrame}
              onFrameSelect={onFrameSelect}
              frameContent={frameContent}
              onFrameContentChange={onFrameContentChange}
            />
        </TabsContent>
        
        <TabsContent value="design" className="mt-0">
          <CRDDesignTab 
            colorPalette={colorPalette} 
            onColorPaletteChange={onColorPaletteChange} 
            typography={typography} 
            onTypographyChange={onTypographyChange} 
            effects={effects} 
            onEffectsChange={onEffectsChange} 
          />
        </TabsContent>
        
        <TabsContent value="content" className="mt-0">
          <CRDContentTab 
            cardTitle={cardData.title} 
            onCardTitleChange={title => updateCardData({ title })} 
            cardDescription={cardData.description || ''} 
            onCardDescriptionChange={description => updateCardData({ description })} 
            playerImage={playerImage} 
            onPlayerImageChange={setPlayerImage} 
            playerStats={playerStats} 
            onPlayerStatsChange={setPlayerStats} 
          />
        </TabsContent>
        
        <TabsContent value="export" className="mt-0">
          <CRDExportTab onExport={onExport} />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export const LeftSidebarCollapsedContent: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const getIconForTab = (tab: string) => {
    switch (tab) {
      case 'import': return <Upload className="w-4 h-4" />;
      case 'layout': return <Layers className="w-4 h-4" />;
      case 'design': return <Palette className="w-4 h-4" />;
      case 'content': return <Type className="w-4 h-4" />;
      case 'export': return <Download className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  const tabs = [
    { id: 'import', label: 'Import', icon: <Upload className="w-4 h-4" /> },
    { id: 'layout', label: 'Layout', icon: <Layers className="w-4 h-4" /> },
    { id: 'design', label: 'Design', icon: <Palette className="w-4 h-4" /> },
    { id: 'content', label: 'Content', icon: <Type className="w-4 h-4" /> },
    { id: 'export', label: 'Export', icon: <Download className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-2">
      {tabs.map((tab) => (
        <div 
          key={tab.id}
          className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
            activeTab === tab.id 
              ? 'bg-crd-blue/20 text-crd-blue' 
              : 'text-crd-lightGray hover:text-crd-white hover:bg-crd-mediumGray/20'
          }`}
          title={tab.label}
        >
          {tab.icon}
        </div>
      ))}
    </div>
  );
};