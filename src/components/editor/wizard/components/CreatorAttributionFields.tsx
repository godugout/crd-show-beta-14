
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Lock, Users } from 'lucide-react';
import type { CardData, CardVisibility, CreatorAttribution } from '@/types/card';

interface CreatorAttributionFieldsProps {
  cardData: Partial<CardData>;
  onFieldUpdate: <K extends keyof CardData>(field: K, value: any) => void;
  onCreatorAttributionUpdate: (key: keyof CreatorAttribution, value: any) => void;
}

export const CreatorAttributionFields = ({
  cardData,
  onFieldUpdate,
  onCreatorAttributionUpdate
}: CreatorAttributionFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-white mb-2">Creator Attribution</Label>
        <Select 
          value={cardData.creator_attribution?.collaboration_type || 'solo'} 
          onValueChange={(value) => onCreatorAttributionUpdate('collaboration_type', value)}
        >
          <SelectTrigger className="bg-crd-darkGray border-crd-mediumGray text-white">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="bg-crd-darkGray border-crd-mediumGray">
            <SelectItem value="solo">Solo Creation</SelectItem>
            <SelectItem value="collaboration">Collaboration</SelectItem>
            <SelectItem value="commission">Commission</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-white mb-2">Visibility</Label>
        <Select value={cardData.visibility} onValueChange={(value) => onFieldUpdate('visibility', value as CardVisibility)}>
          <SelectTrigger className="bg-crd-darkGray border-crd-mediumGray text-white">
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent className="bg-crd-darkGray border-crd-mediumGray">
            <SelectItem value="private">
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Private
              </div>
            </SelectItem>
            <SelectItem value="public">
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Public
              </div>
            </SelectItem>
            <SelectItem value="shared">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Shared
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
