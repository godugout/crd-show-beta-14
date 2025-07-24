import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Camera, Image as ImageIcon, Sparkles } from 'lucide-react';
import { UniversalUploadComponent } from '@/components/media/UniversalUploadComponent';
import type { CardData } from '@/hooks/useCardEditor';
import type { CreationMode } from '../../types';

interface MobileCreateStepProps {
  mode: CreationMode;
  cardData: CardData;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
}

export const MobileCreateStep: React.FC<MobileCreateStepProps> = ({
  mode,
  cardData,
  onFieldUpdate
}) => {
  const [activeSection, setActiveSection] = useState<'photo' | 'details'>('photo');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onFieldUpdate('image_url', result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex bg-crd-mediumGray/20 rounded-lg p-1">
        <button
          onClick={() => setActiveSection('photo')}
          className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
            activeSection === 'photo'
              ? 'bg-crd-green text-black'
              : 'text-crd-lightGray hover:text-crd-white'
          }`}
        >
          <Camera className="w-4 h-4 mr-2 inline" />
          Photo
        </button>
        <button
          onClick={() => setActiveSection('details')}
          className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
            activeSection === 'details'
              ? 'bg-crd-green text-black'
              : 'text-crd-lightGray hover:text-crd-white'
          }`}
        >
          <Sparkles className="w-4 h-4 mr-2 inline" />
          Details
        </button>
      </div>

      {/* Photo Section */}
      {activeSection === 'photo' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-crd-white">Add Your Photo</h3>
          
          <UniversalUploadComponent
            onFilesSelected={(files) => {
              if (files.length > 0) {
                const file = files[0];
                const reader = new FileReader();
                reader.onload = () => {
                  onFieldUpdate('image_url', reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
            onError={(error) => {
              console.error('Upload error:', error);
            }}
            accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] }}
            maxSize={10 * 1024 * 1024} // 10MB
            maxFiles={1}
            multiple={false}
          />
        </div>
      )}

      {/* Details Section */}
      {activeSection === 'details' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-crd-white">Card Details</h3>
          
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-crd-white mb-2">
                Card Title *
              </label>
              <Input
                type="text"
                value={cardData.title || ''}
                onChange={(e) => onFieldUpdate('title', e.target.value)}
                placeholder="Enter card title"
                className="w-full bg-crd-mediumGray/20 border-crd-mediumGray/30 text-crd-white min-h-[44px]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-crd-white mb-2">
                Description
              </label>
              <Textarea
                value={cardData.description || ''}
                onChange={(e) => onFieldUpdate('description', e.target.value)}
                placeholder="Describe your card..."
                className="w-full bg-crd-mediumGray/20 border-crd-mediumGray/30 text-crd-white min-h-[100px] resize-none"
                rows={4}
              />
            </div>

            {/* Rarity */}
            <div>
              <label className="block text-sm font-medium text-crd-white mb-2">
                Rarity
              </label>
              <Select
                value={cardData.rarity || 'common'}
                onValueChange={(value) => onFieldUpdate('rarity', value)}
              >
                <SelectTrigger className="w-full bg-crd-mediumGray/20 border-crd-mediumGray/30 text-crd-white min-h-[44px]">
                  <SelectValue placeholder="Select rarity" />
                </SelectTrigger>
                <SelectContent className="bg-crd-dark border-crd-mediumGray">
                  <SelectItem value="common" className="text-crd-white hover:bg-crd-mediumGray">Common</SelectItem>
                  <SelectItem value="uncommon" className="text-crd-white hover:bg-crd-mediumGray">Uncommon</SelectItem>
                  <SelectItem value="rare" className="text-crd-white hover:bg-crd-mediumGray">Rare</SelectItem>
                  <SelectItem value="epic" className="text-crd-white hover:bg-crd-mediumGray">Epic</SelectItem>
                  <SelectItem value="legendary" className="text-crd-white hover:bg-crd-mediumGray">Legendary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quick Tips for Mobile */}
            <Card className="bg-crd-mediumGray/10 border-crd-green/20">
              <CardContent className="p-4">
                <h4 className="text-crd-green font-medium mb-2 text-sm">💡 Mobile Tips</h4>
                <ul className="text-crd-lightGray text-xs space-y-1">
                  <li>• Upload high-quality photos for best results</li>
                  <li>• Keep titles short and memorable</li>
                  <li>• Choose rarity based on card uniqueness</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};