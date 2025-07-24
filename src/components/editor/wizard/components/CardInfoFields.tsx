
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles } from 'lucide-react';
import type { CardData, CardRarity } from '@/types/card';

interface CardInfoFieldsProps {
  cardData: Partial<CardData>;
  onFieldUpdate: <K extends keyof CardData>(field: K, value: any) => void;
  aiAnalysisComplete?: boolean;
}

export const CardInfoFields = ({ 
  cardData, 
  onFieldUpdate, 
  aiAnalysisComplete = false 
}: CardInfoFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-white flex items-center gap-2 mb-2">
          Card Title *
          {aiAnalysisComplete && <Sparkles className="w-3 h-3 text-crd-green" />}
        </Label>
        <Input
          value={cardData.title || ''}
          onChange={(e) => onFieldUpdate('title', e.target.value)}
          placeholder="Enter card title"
          className="bg-crd-darkGray border-crd-mediumGray text-white"
        />
      </div>

      <div>
        <Label className="text-white flex items-center gap-2 mb-2">
          Description
          {aiAnalysisComplete && <Sparkles className="w-3 h-3 text-crd-green" />}
        </Label>
        <Textarea
          value={cardData.description || ''}
          onChange={(e) => onFieldUpdate('description', e.target.value)}
          placeholder="Describe your card..."
          className="bg-crd-darkGray border-crd-mediumGray text-white"
          rows={3}
        />
      </div>

      <div>
        <Label className="text-white flex items-center gap-2 mb-2">
          Rarity
          {aiAnalysisComplete && <Sparkles className="w-3 h-3 text-crd-green" />}
        </Label>
        <Select value={cardData.rarity} onValueChange={(value) => onFieldUpdate('rarity', value as CardRarity)}>
          <SelectTrigger className="bg-crd-darkGray border-crd-mediumGray text-white">
            <SelectValue placeholder="Select rarity" />
          </SelectTrigger>
          <SelectContent className="bg-crd-darkGray border-crd-mediumGray">
            <SelectItem value="common">Common</SelectItem>
            <SelectItem value="uncommon">Uncommon</SelectItem>
            <SelectItem value="rare">Rare</SelectItem>
            <SelectItem value="epic">Epic</SelectItem>
            <SelectItem value="legendary">Legendary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-white flex items-center gap-2 mb-2">
          Tags
          {aiAnalysisComplete && <Sparkles className="w-3 h-3 text-crd-green" />}
        </Label>
        <Input
          value={cardData.tags?.join(', ') || ''}
          placeholder="Add tags (comma separated)"
          className="bg-crd-darkGray border-crd-mediumGray text-white"
          onChange={(e) => {
            const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
            onFieldUpdate('tags', tags);
          }}
        />
      </div>
    </div>
  );
};
