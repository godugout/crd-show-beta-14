
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { CropArea } from './types';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';

interface CropperSidebarProps {
  cropAreas: CropArea[];
  imageLoaded: boolean;
  selectedCropId: string | null;
  onAddCropArea: (type: 'frame' | 'element') => void;
  onSelectCrop: (cropId: string) => void;
  onRemoveCrop: (cropId: string) => void;
}

export const CropperSidebar: React.FC<CropperSidebarProps> = ({
  cropAreas,
  imageLoaded,
  selectedCropId,
  onAddCropArea,
  onSelectCrop,
  onRemoveCrop
}) => {
  return (
    <div className="w-80 bg-crd-darker border-l border-crd-mediumGray/30 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-crd-mediumGray/30">
        <h3 className="text-white font-semibold text-lg mb-2">Crop Areas</h3>
        <p className="text-crd-lightGray text-sm">
          Add and manage your card crop areas
        </p>
      </div>

      {/* Add New Area */}
      <div className="p-4 border-b border-crd-mediumGray/30">
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => onAddCropArea('frame')}
            disabled={!imageLoaded}
            className="bg-crd-blue hover:bg-crd-blue/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Frame
          </Button>
          <Button
            onClick={() => onAddCropArea('element')}
            disabled={!imageLoaded}
            className="bg-crd-orange hover:bg-crd-orange/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Element
          </Button>
        </div>
      </div>

      {/* Crop Areas List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {cropAreas.map((crop) => (
            <Card
              key={crop.id}
              className={`p-3 cursor-pointer transition-all border-2 ${
                selectedCropId === crop.id 
                  ? 'border-crd-green bg-crd-green/10' 
                  : 'border-crd-mediumGray bg-crd-darkGray hover:border-crd-lightGray'
              }`}
              onClick={() => onSelectCrop(crop.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-sm border"
                    style={{ backgroundColor: crop.color }}
                  />
                  <div>
                    <p className="text-white font-medium text-sm">{crop.label}</p>
                    <p className="text-crd-lightGray text-xs">
                      {Math.round(crop.width)}×{Math.round(crop.height)}
                      {crop.rotation !== 0 && ` • ${crop.rotation}°`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {crop.selected && <Eye className="w-4 h-4 text-crd-green" />}
                  {crop.id !== 'main' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveCrop(crop.id);
                      }}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Quick Tips */}
      <div className="p-4 border-t border-crd-mediumGray/30">
        <div className="bg-crd-darkGray rounded-lg p-3">
          <h4 className="text-white font-medium text-sm mb-2">Quick Tips</h4>
          <ul className="text-crd-lightGray text-xs space-y-1">
            <li>• Drag corners to resize</li>
            <li>• Use rotation handle to rotate</li>
            <li>• Hold Ctrl to multi-select</li>
            <li>• Right-click for options</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
