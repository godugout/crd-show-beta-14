import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Settings, Share2, Download, MoreHorizontal } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card, CardContent } from '@/components/ui/card';
import { StudioCaseSelector, type CaseStyle } from './StudioCaseSelector';
import type { CardData } from '@/types/card';

interface MobileStudioControlsProps {
  selectedCard: CardData;
  selectedCase: CaseStyle;
  onCaseChange: (caseStyle: CaseStyle) => void;
  onShare: (card: CardData) => void;
  onDownload: (card: CardData) => void;
  onClose: () => void;
}

export const MobileStudioControls: React.FC<MobileStudioControlsProps> = ({
  selectedCard,
  selectedCase,
  onCaseChange,
  onShare,
  onDownload,
  onClose
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <>
      {/* Mobile Card Info Panel - Fixed at bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-crd-darker border-t border-crd-mediumGray/20 z-50 safe-area-bottom">
        {/* Quick Actions Bar */}
        <div className="flex items-center justify-between p-4 border-b border-crd-mediumGray/20">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-16 bg-crd-mediumGray/20 rounded-lg overflow-hidden">
              <img 
                src={selectedCard.image_url || '/placeholder.svg'} 
                alt={selectedCard.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-crd-white font-semibold text-sm truncate">{selectedCard.title}</h3>
              <p className="text-crd-lightGray text-xs truncate">{selectedCard.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <CRDButton
              variant="outline"
              size="sm"
              onClick={() => onShare(selectedCard)}
              className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white min-h-[44px] min-w-[44px] p-0"
            >
              <Share2 className="w-4 h-4" />
            </CRDButton>
            
            <CRDButton
              variant="outline"
              size="sm"
              onClick={() => onDownload(selectedCard)}
              className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white min-h-[44px] min-w-[44px] p-0"
            >
              <Download className="w-4 h-4" />
            </CRDButton>
            
            <CRDButton
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white min-h-[44px] min-w-[44px] p-0"
            >
              <MoreHorizontal className="w-4 h-4" />
            </CRDButton>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-crd-lightGray hover:text-crd-white transition-colors"
            >
              {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="p-4 max-h-[50vh] overflow-y-auto">
            <div className="space-y-4">
              {/* Card Details */}
              <div>
                <h4 className="text-crd-white font-medium mb-2">Card Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-crd-lightGray">Rarity:</span>
                    <span className="text-crd-white ml-2 capitalize">{selectedCard.rarity || 'common'}</span>
                  </div>
                  <div>
                    <span className="text-crd-lightGray">Type:</span>
                    <span className="text-crd-white ml-2">Digital Card</span>
                  </div>
                </div>
              </div>

              {/* Case Selection */}
              <div>
                <h4 className="text-crd-white font-medium mb-2">Display Case</h4>
                <StudioCaseSelector
                  selectedCase={selectedCase}
                  onCaseChange={onCaseChange}
                />
              </div>

              {/* Advanced Controls */}
              {showAdvanced && (
                <div>
                  <h4 className="text-crd-white font-medium mb-2">Advanced Options</h4>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-crd-mediumGray/20 rounded-lg text-crd-white text-left text-sm min-h-[44px]">
                      Export Settings
                    </button>
                    <button className="w-full px-4 py-3 bg-crd-mediumGray/20 rounded-lg text-crd-white text-left text-sm min-h-[44px]">
                      Lighting Controls
                    </button>
                    <button className="w-full px-4 py-3 bg-crd-mediumGray/20 rounded-lg text-crd-white text-left text-sm min-h-[44px]">
                      Background Options
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Info Panel (hidden on mobile) */}
      <div className="hidden lg:block absolute top-4 right-4 w-80 z-10">
        <Card className="bg-crd-dark/90 backdrop-blur-sm border-crd-mediumGray/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-crd-white font-semibold">{selectedCard.title}</h3>
                <p className="text-crd-lightGray text-sm">{selectedCard.description}</p>
              </div>
              <button 
                onClick={onClose}
                className="text-crd-lightGray hover:text-crd-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <StudioCaseSelector
                selectedCase={selectedCase}
                onCaseChange={onCaseChange}
              />

              <div className="flex gap-2">
                <CRDButton
                  variant="outline"
                  size="sm"
                  onClick={() => onShare(selectedCard)}
                  className="flex-1"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </CRDButton>
                
                <CRDButton
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload(selectedCard)}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </CRDButton>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};