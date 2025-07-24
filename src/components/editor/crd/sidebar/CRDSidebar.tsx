import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { DustyAssistant } from '../assistant/DustyAssistant';
import { InteractiveCardData } from '@/types/interactiveCard';
import { 
  FileText, 
  MessageSquare, 
  Sparkles, 
  Hash, 
  Printer, 
  Monitor, 
  Palette, 
  Clock,
  Settings
} from 'lucide-react';

interface CRDSidebarProps {
  cardData: InteractiveCardData;
  onCardDataUpdate: (updates: Partial<InteractiveCardData>) => void;
  cardTitle: string;
  playerImage: string | null;
  selectedTemplate: string;
  colorPalette: string;
  effects: string[];
  previewMode: 'edit' | 'preview' | 'print';
}

export const CRDSidebar: React.FC<CRDSidebarProps> = ({
  cardData,
  onCardDataUpdate,
  cardTitle,
  playerImage,
  selectedTemplate,
  colorPalette,
  effects,
  previewMode
}) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      case 'epic': return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30';
      case 'rare': return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      case 'uncommon': return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30';
      default: return 'bg-crd-darkest/80 border-crd-mediumGray/20';
    }
  };

  return (
    <div className="w-full h-full bg-crd-darker/60 backdrop-blur-md overflow-y-auto flex-col flex border-r border-crd-mediumGray/20">
      {/* Enhanced Dusty Assistant Section */}
      <div className="p-6 border-b border-crd-mediumGray/30 bg-gradient-to-b from-crd-darker/80 to-crd-darker/60">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-crd-blue/20 border border-crd-blue/30">
            <Sparkles className="w-4 h-4 text-crd-blue" />
          </div>
          <div>
            <h2 className="text-crd-white font-medium text-sm">AI Assistant</h2>
            <p className="text-crd-lightGray text-xs">Creative guidance & feedback</p>
          </div>
        </div>
        <DustyAssistant
          cardTitle={cardTitle}
          playerImage={playerImage}
          selectedTemplate={selectedTemplate}
          colorPalette={colorPalette}
          effects={effects}
          previewMode={previewMode}
        />
      </div>

      {/* Enhanced Card Properties Section */}
      <div className="p-6 space-y-6 flex-1">
        {/* Card Details */}
        <Card className="bg-crd-darker/80 border-crd-mediumGray/30 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-crd-blue/20 border border-crd-blue/30">
                <FileText className="w-4 h-4 text-crd-blue" />
              </div>
              <CardTitle className="text-crd-white text-base font-medium">Card Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title Field */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3 h-3 text-crd-lightGray" />
                <label className="text-xs text-crd-lightGray font-medium">Title</label>
              </div>
              <input 
                type="text" 
                value={cardData.title}
                onChange={(e) => onCardDataUpdate({ title: e.target.value })}
                className="w-full bg-crd-darkest/90 border border-crd-mediumGray/30 rounded-lg px-3 py-2 text-sm text-crd-white backdrop-blur-sm focus:border-crd-blue/50 focus:ring-1 focus:ring-crd-blue/20 transition-all duration-200"
                placeholder="Enter card title..."
              />
            </div>
            
            {/* Description Field */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-3 h-3 text-crd-lightGray" />
                <label className="text-xs text-crd-lightGray font-medium">Description</label>
              </div>
              <textarea 
                value={cardData.description || ''}
                onChange={(e) => onCardDataUpdate({ description: e.target.value })}
                className="w-full bg-crd-darkest/90 border border-crd-mediumGray/30 rounded-lg px-3 py-2 text-sm text-crd-white backdrop-blur-sm resize-none focus:border-crd-blue/50 focus:ring-1 focus:ring-crd-blue/20 transition-all duration-200"
                rows={3}
                placeholder="Enter card description..."
              />
            </div>
            
            <Separator className="bg-crd-mediumGray/20 my-4" />
            
            {/* Rarity Field */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-crd-lightGray" />
                <label className="text-xs text-crd-lightGray font-medium">Rarity</label>
              </div>
              <div className="relative">
                <select 
                  value={cardData.rarity}
                  onChange={(e) => onCardDataUpdate({ rarity: e.target.value as any })}
                  className={`w-full ${getRarityColor(cardData.rarity)} rounded-lg px-3 py-2 text-sm text-crd-white backdrop-blur-sm focus:border-crd-blue/50 focus:ring-1 focus:ring-crd-blue/20 transition-all duration-200 appearance-none`}
                >
                  <option value="common">Common</option>
                  <option value="uncommon">Uncommon</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
                <Badge 
                  variant="outline" 
                  className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs ${
                    cardData.rarity === 'legendary' ? 'border-yellow-500/50 text-yellow-300' :
                    cardData.rarity === 'epic' ? 'border-purple-500/50 text-purple-300' :
                    cardData.rarity === 'rare' ? 'border-blue-500/50 text-blue-300' :
                    cardData.rarity === 'uncommon' ? 'border-green-500/50 text-green-300' :
                    'border-crd-mediumGray/50 text-crd-lightGray'
                  }`}
                >
                  {cardData.rarity.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Card Code */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash className="w-3 h-3 text-crd-lightGray" />
                <label className="text-xs text-crd-lightGray font-medium">Unique Code</label>
              </div>
              <div className="bg-crd-darkest/90 border border-crd-mediumGray/30 rounded-lg px-3 py-2 backdrop-blur-sm">
                <div className="text-crd-white text-sm font-mono tracking-wider">
                  CRD-{cardData.id.slice(-8).toUpperCase()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Print Settings */}
        <Card className="bg-crd-darker/80 border-crd-mediumGray/30 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30">
                <Printer className="w-4 h-4 text-green-400" />
              </div>
              <CardTitle className="text-crd-white text-base font-medium">Print Specifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {/* Technical Specs Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-crd-darkest/60 rounded-lg p-3 border border-crd-mediumGray/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Monitor className="w-3 h-3 text-crd-lightGray" />
                    <span className="text-xs text-crd-lightGray font-medium">Dimensions</span>
                  </div>
                  <div className="text-crd-white text-sm font-medium">2.5" × 3.5"</div>
                </div>
                
                <div className="bg-crd-darkest/60 rounded-lg p-3 border border-crd-mediumGray/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Settings className="w-3 h-3 text-crd-lightGray" />
                    <span className="text-xs text-crd-lightGray font-medium">Resolution</span>
                  </div>
                  <div className="text-crd-white text-sm font-medium">300 DPI</div>
                </div>
                
                <div className="bg-crd-darkest/60 rounded-lg p-3 border border-crd-mediumGray/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Palette className="w-3 h-3 text-crd-lightGray" />
                    <span className="text-xs text-crd-lightGray font-medium">Color Mode</span>
                  </div>
                  <div className="text-crd-white text-sm font-medium">CMYK</div>
                </div>
                
                <div className="bg-crd-darkest/60 rounded-lg p-3 border border-crd-mediumGray/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3 h-3 text-crd-lightGray" />
                    <span className="text-xs text-crd-lightGray font-medium">Version</span>
                  </div>
                  <div className="text-crd-white text-sm font-medium">v{cardData.version}</div>
                </div>
              </div>
              
              {/* Print Ready Status */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-3 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 text-xs font-medium">Print Ready</span>
                </div>
                <p className="text-green-200/80 text-xs mt-1">Card meets all print specifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};