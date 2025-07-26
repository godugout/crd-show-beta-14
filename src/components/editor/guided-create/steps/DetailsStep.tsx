import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface DetailsStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

const rarityOptions = [
  { value: 'common', label: 'Common', color: 'bg-gray-500' },
  { value: 'uncommon', label: 'Uncommon', color: 'bg-green-500' },
  { value: 'rare', label: 'Rare', color: 'bg-blue-500' },
  { value: 'epic', label: 'Epic', color: 'bg-purple-500' },
  { value: 'legendary', label: 'Legendary', color: 'bg-yellow-500' },
  { value: 'mythic', label: 'Mythic', color: 'bg-red-500' },
];

export const DetailsStep: React.FC<DetailsStepProps> = ({
  data,
  onUpdate
}) => {
  const updateDetail = (key: string, value: any) => {
    onUpdate({
      ...data,
      [key]: value
    });
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !(data.tags || []).includes(tag.trim())) {
      updateDetail('tags', [...(data.tags || []), tag.trim()]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateDetail('tags', (data.tags || []).filter((tag: string) => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      addTag(input.value);
      input.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Card Title *</Label>
            <Input
              id="title"
              placeholder="Enter card title"
              value={data.title || ''}
              onChange={(e) => updateDetail('title', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your card..."
              value={data.description || ''}
              onChange={(e) => updateDetail('description', e.target.value)}
              className="mt-1 min-h-[80px]"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="series">Series</Label>
              <Input
                id="series"
                placeholder="e.g. Season 2024, Set 1"
                value={data.series || ''}
                onChange={(e) => updateDetail('series', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="rarity">Rarity</Label>
              <Select 
                value={data.rarity || 'common'} 
                onValueChange={(value) => updateDetail('rarity', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select rarity" />
                </SelectTrigger>
                <SelectContent>
                  {rarityOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${option.color}`} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Tags & Categories</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Type a tag and press Enter"
              onKeyPress={handleTagKeyPress}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Add tags to help others discover your card
            </p>
          </div>

          {(data.tags || []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(data.tags || []).map((tag: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Stats & Attributes</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="power">Power</Label>
            <Input
              id="power"
              type="number"
              placeholder="0"
              value={data.power || ''}
              onChange={(e) => updateDetail('power', parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="toughness">Toughness</Label>
            <Input
              id="toughness"
              type="number"
              placeholder="0"
              value={data.toughness || ''}
              onChange={(e) => updateDetail('toughness', parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="manaCost">Mana Cost</Label>
            <Input
              id="manaCost"
              placeholder="e.g. 3RG"
              value={data.manaCost || ''}
              onChange={(e) => updateDetail('manaCost', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="cardType">Card Type</Label>
            <Select 
              value={data.cardType || 'character'} 
              onValueChange={(value) => updateDetail('cardType', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="character">Character</SelectItem>
                <SelectItem value="spell">Spell</SelectItem>
                <SelectItem value="artifact">Artifact</SelectItem>
                <SelectItem value="enchantment">Enchantment</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Preview Summary */}
      <Card className="p-6 bg-muted/30">
        <h3 className="text-lg font-semibold mb-4">Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Title:</span>
            <span className="font-medium">{data.title || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rarity:</span>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                rarityOptions.find(r => r.value === (data.rarity || 'common'))?.color || 'bg-gray-500'
              }`} />
              <span className="font-medium capitalize">{data.rarity || 'Common'}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Series:</span>
            <span className="font-medium">{data.series || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tags:</span>
            <span className="font-medium">{(data.tags || []).length || 0}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};