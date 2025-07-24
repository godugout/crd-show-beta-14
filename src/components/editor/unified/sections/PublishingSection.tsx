
import React, { useState } from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Share2, 
  Globe, 
  DollarSign, 
  Pin, 
  Users,
  Star,
  Trophy,
  Eye,
  Heart,
  MessageCircle,
  Lock,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useCardEditor } from '@/hooks/useCardEditor';

interface PublishingSectionProps {
  cardEditor: ReturnType<typeof useCardEditor>;
  onPublish: () => Promise<void>;
  onPrevious: () => void;
}

export const PublishingSection = ({ 
  cardEditor,
  onPublish,
  onPrevious
}: PublishingSectionProps) => {
  const { cardData, updateCardField } = cardEditor;
  const [isCreating, setIsCreating] = useState(false);

  const updatePublishingOptions = (field: string, value: any) => {
    updateCardField('publishing_options', {
      ...cardData.publishing_options,
      [field]: value
    });
  };

  const handlePublish = async () => {
    setIsCreating(true);
    try {
      await onPublish();
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Publishing Status */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Ready to Publish
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Configure how your card will be shared with the community
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              cardData.visibility === 'public' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
            }`}>
              {cardData.visibility === 'public' ? 'Public' : 'Private'}
            </div>
          </div>
        </div>

        {/* Visibility Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => updateCardField('visibility', 'private')}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              cardData.visibility === 'private'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center mb-2">
              <Lock className="w-5 h-5 mr-2 text-gray-500" />
              <span className="font-semibold text-gray-900 dark:text-white">Private</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Only you can see this card
            </p>
          </button>

          <button
            onClick={() => updateCardField('visibility', 'shared')}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              cardData.visibility === 'shared'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 mr-2 text-gray-500" />
              <span className="font-semibold text-gray-900 dark:text-white">Shared</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Share with specific people
            </p>
          </button>

          <button
            onClick={() => updateCardField('visibility', 'public')}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              cardData.visibility === 'public'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center mb-2">
              <Globe className="w-5 h-5 mr-2 text-gray-500" />
              <span className="font-semibold text-gray-900 dark:text-white">Public</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Everyone can discover your card
            </p>
          </button>
        </div>

        {/* Publishing Options */}
        {cardData.visibility === 'public' && (
          <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Publishing Options
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    CRD Catalog Inclusion
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Include in the public CRD catalog for discovery
                  </div>
                </div>
                <Switch
                  checked={cardData.publishing_options?.crd_catalog_inclusion || false}
                  onCheckedChange={(checked) => updatePublishingOptions('crd_catalog_inclusion', checked)}
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Marketplace Listing
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Allow others to purchase or trade this card
                  </div>
                </div>
                <Switch
                  checked={cardData.publishing_options?.marketplace_listing || false}
                  onCheckedChange={(checked) => updatePublishingOptions('marketplace_listing', checked)}
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Print Available
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Allow physical printing of this card
                  </div>
                </div>
                <Switch
                  checked={cardData.publishing_options?.print_available || false}
                  onCheckedChange={(checked) => updatePublishingOptions('print_available', checked)}
                />
              </label>
            </div>
          </div>
        )}

        {/* Rarity and Edition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Card Rarity
            </Label>
            <Select 
              value={cardData.rarity} 
              onValueChange={(value) => updateCardField('rarity', value as any)}
            >
              <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="common">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                    Common
                  </div>
                </SelectItem>
                <SelectItem value="uncommon">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    Uncommon
                  </div>
                </SelectItem>
                <SelectItem value="rare">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    Rare
                  </div>
                </SelectItem>
                <SelectItem value="epic">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                    Epic
                  </div>
                </SelectItem>
                <SelectItem value="legendary">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                    Legendary
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Edition Type
            </Label>
            <Select 
              value={cardData.publishing_options?.distribution?.limited_edition ? "limited" : "unlimited"} 
              onValueChange={(value) => updatePublishingOptions('distribution', {
                ...cardData.publishing_options?.distribution,
                limited_edition: value === "limited"
              })}
            >
              <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unlimited">Unlimited Edition</SelectItem>
                <SelectItem value="limited">Limited Edition</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Limited Edition Settings */}
        {cardData.publishing_options?.distribution?.limited_edition && (
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <Label className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2 block">
              Edition Size
            </Label>
            <Input
              type="number"
              min="1"
              max="10000"
              value={cardData.publishing_options?.distribution?.edition_size || ''}
              onChange={(e) => updatePublishingOptions('distribution', {
                ...cardData.publishing_options?.distribution,
                edition_size: parseInt(e.target.value) || undefined
              })}
              placeholder="Enter number of copies (e.g., 100)"
              className="bg-white dark:bg-gray-800 border-amber-300 dark:border-amber-700"
            />
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
              Limited to maximum 10,000 copies
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button
          size="lg"
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
          disabled={isCreating}
          onClick={handlePublish}
        >
          {isCreating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Creating Card...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Create Card
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
