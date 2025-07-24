import React from 'react';
import { CRDFrameSelector } from '../frame/CRDFrameSelector';

interface CRDLayoutTabProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  cardData?: any;
  updateCardData?: (data: any) => void;
  selectedFrame?: any;
  onFrameSelect?: (frame: any) => void;
  frameContent?: Record<string, any>;
  onFrameContentChange?: (content: Record<string, any>) => void;
}

export const CRDLayoutTab: React.FC<CRDLayoutTabProps> = ({
  selectedTemplate,
  onTemplateSelect,
  cardData,
  updateCardData,
  selectedFrame,
  onFrameSelect,
  frameContent,
  onFrameContentChange
}) => {
  const handleCardComplete = (cardData: any) => {
    if (updateCardData) {
      updateCardData(cardData);
    }
  };

  return (
    <div className="h-full space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-crd-white mb-3">Select Your Frame</h3>
        <p className="text-sm text-crd-lightGray mb-4">Choose from professional frame designs</p>
        <CRDFrameSelector 
          selectedFrameId={selectedFrame?.id}
          onFrameSelect={(frame) => {
            onFrameSelect?.(frame);
            // Initialize frame content with current card data
            if (onFrameContentChange) {
              onFrameContentChange({
                catalogNumber: 'CRD-001',
                seriesNumber: '#001',
                available: '1:1',
                crdName: cardData?.title || 'New Card',
                creator: 'Creator Name',
                rarity: cardData?.rarity || 'common'
              });
            }
          }}
          className="w-full"
        />
      </div>
    </div>
  );
};