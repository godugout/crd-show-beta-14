import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Upload, FileImage, Layers } from 'lucide-react';
import { PSDUploadModal } from '../psd/PSDUploadModal';
import { PSDLayer } from '@/components/editor/crd/import/CRDPSDProcessor';

interface CRDImportTabProps {
  onFrameGenerated?: (frameData: any) => void;
  onCardGenerated?: (cardData: any) => void;
  onApplyToCanvas?: (layers: any[], visibleLayers: Set<string>) => void;
  onPSDModeActivate?: (layers: PSDLayer[], thumbnail?: string) => void;
}

export const CRDImportTab: React.FC<CRDImportTabProps> = ({
  onFrameGenerated,
  onCardGenerated,
  onApplyToCanvas,
  onPSDModeActivate
}) => {
  const [showPSDModal, setShowPSDModal] = useState(false);

  const handlePSDProcessed = (layers: PSDLayer[], thumbnail: string) => {
    onPSDModeActivate?.(layers, thumbnail);
    setShowPSDModal(false);
  };

  return (
    <div className="space-y-6">
      {/* PSD Import Section */}
      <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
        <CardHeader>
          <CardTitle className="text-crd-white text-lg flex items-center gap-2">
            <FileImage className="w-5 h-5 text-crd-blue" />
            PSD Files
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-crd-blue/10 rounded-full flex items-center justify-center">
              <Layers className="w-8 h-8 text-crd-blue" />
            </div>
            <h3 className="text-crd-white text-lg font-semibold mb-2">
              Import Photoshop Files
            </h3>
            <p className="text-crd-lightGray mb-6 max-w-sm mx-auto">
              Upload PSD files to automatically extract layers and convert them into editable card elements.
            </p>
            <CRDButton 
              onClick={() => setShowPSDModal(true)}
              className="bg-crd-blue hover:bg-crd-lightBlue text-white px-6 py-3"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import PSD File
            </CRDButton>
          </div>
        </CardContent>
      </Card>

      {/* Additional Import Options */}
      <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
        <CardHeader>
          <CardTitle className="text-crd-white text-lg flex items-center gap-2">
            <Upload className="w-5 h-5 text-crd-blue" />
            Other Formats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-crd-lightGray mb-4">
              Support for additional formats coming soon
            </p>
            <div className="flex justify-center gap-4 text-sm text-crd-lightGray">
              <span>AI Files</span>
              <span>•</span>
              <span>SVG Files</span>
              <span>•</span>
              <span>Figma Import</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PSD Upload Modal */}
      <PSDUploadModal
        isOpen={showPSDModal}
        onClose={() => setShowPSDModal(false)}
        onPSDProcessed={handlePSDProcessed}
      />
    </div>
  );
};