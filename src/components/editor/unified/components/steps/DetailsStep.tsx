
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { CreationMode } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';

interface DetailsStepProps {
  mode: CreationMode;
  cardData: CardData;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
}

export const DetailsStep = ({ mode, cardData, onFieldUpdate }: DetailsStepProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-crd-white mb-2">Card Details</h2>
        <p className="text-crd-lightGray">
          {mode === 'quick' 
            ? 'Add basic information for your card'
            : 'Provide detailed information about your card'
          }
        </p>
      </div>

      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader>
          <CardTitle className="text-crd-white">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-crd-white">Card Title *</Label>
            <Input
              id="title"
              value={cardData.title || ''}
              onChange={(e) => onFieldUpdate('title', e.target.value)}
              placeholder="Enter a memorable title for your card"
              className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-crd-white">Description</Label>
            <Textarea
              id="description"
              value={cardData.description || ''}
              onChange={(e) => onFieldUpdate('description', e.target.value)}
              placeholder="Describe your card..."
              rows={3}
              className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white"
            />
          </div>

          {/* Rarity */}
          <div className="space-y-2">
            <Label className="text-crd-white">Card Rarity</Label>
            <Select value={cardData.rarity || 'common'} onValueChange={(value) => onFieldUpdate('rarity', value)}>
              <SelectTrigger className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-crd-darker border-crd-mediumGray/30">
                <SelectItem value="common" className="text-crd-white">Common</SelectItem>
                <SelectItem value="uncommon" className="text-crd-white">Uncommon</SelectItem>
                <SelectItem value="rare" className="text-crd-white">Rare</SelectItem>
                <SelectItem value="epic" className="text-crd-white">Epic</SelectItem>
                <SelectItem value="legendary" className="text-crd-white">Legendary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mode !== 'quick' && (
            <>
              {/* Series */}
              <div className="space-y-2">
                <Label htmlFor="series" className="text-crd-white">Series</Label>
                <Input
                  id="series"
                  value={cardData.type || ''}
                  onChange={(e) => onFieldUpdate('type', e.target.value)}
                  placeholder="Card series or collection name"
                  className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags" className="text-crd-white">Tags</Label>
                <Input
                  id="tags"
                  value={cardData.tags?.join(', ') || ''}
                  onChange={(e) => {
                    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                    onFieldUpdate('tags', tags);
                  }}
                  placeholder="Enter tags separated by commas"
                  className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
