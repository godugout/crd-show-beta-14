
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Lock, Users, Tag, FileText, Settings, ImageIcon, FolderOpen, Eye } from 'lucide-react';
import { useCollections } from '@/hooks/useCollections';
import { getRarityColor } from '@/utils/cardEffectUtils';
import type { CreationMode } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';

interface PublishStepProps {
  mode: CreationMode;
  cardData: CardData;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
}

export const PublishStep = ({ mode, cardData, onFieldUpdate }: PublishStepProps) => {
  console.log('📤 PublishStep: Rendering with mode:', mode);
  console.log('📤 PublishStep: Card data:', { 
    title: cardData.title, 
    image_url: cardData.image_url,
    rarity: cardData.rarity 
  });

  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const { collections, isLoading: collectionsLoading } = useCollections();

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    onFieldUpdate('tags', tags);
  };

  const handlePublishingOptionChange = (key: string, value: any) => {
    const updatedOptions = {
      ...cardData.publishing_options,
      [key]: value
    };
    onFieldUpdate('publishing_options', updatedOptions);
  };

  const getVisibilityIcon = () => {
    switch (cardData.visibility) {
      case 'public': return <Globe className="w-4 h-4" />;
      case 'shared': return <Users className="w-4 h-4" />;
      default: return <Lock className="w-4 h-4" />;
    }
  };

  const getRarityBadge = () => {
    const rarityColor = getRarityColor(cardData.rarity);
    return (
      <Badge 
        className="capitalize font-medium transition-all duration-200 hover:scale-105" 
        style={{ 
          backgroundColor: rarityColor + '20',
          borderColor: rarityColor,
          color: rarityColor,
          border: `1px solid ${rarityColor}`
        }}
      >
        {cardData.rarity}
      </Badge>
    );
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    console.error('📤 PublishStep: Failed to load image:', cardData.image_url);
    setImageLoading(false);
    setImageError(true);
  };

  const handleImageStart = () => {
    setImageLoading(true);
    setImageError(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-crd-white mb-2">Publish Your Card</h2>
        <p className="text-crd-lightGray">
          {mode === 'quick' 
            ? 'Final details and publish your card to the community'
            : 'Configure publishing options and make your card available'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Card Summary */}
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Card Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Card Preview with enhanced image handling */}
            <div className="aspect-[2.5/3.5] bg-crd-mediumGray/20 rounded-lg overflow-hidden relative">
              {cardData.image_url ? (
                <>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-crd-mediumGray/40 z-10">
                      <div className="w-8 h-8 border-2 border-crd-green border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img 
                    src={cardData.image_url} 
                    alt="Card preview"
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      imageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    onLoadStart={handleImageStart}
                    style={{ display: imageError ? 'none' : 'block' }}
                  />
                  {imageError && (
                    <div className="w-full h-full flex flex-col items-center justify-center text-crd-lightGray bg-crd-mediumGray/20">
                      <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                      <p className="text-sm font-medium">Image failed to load</p>
                      <p className="text-xs opacity-70 mt-1 text-center px-4">
                        The image URL may be invalid or the image is no longer available
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-crd-lightGray">
                  <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-sm font-medium">No image uploaded</p>
                  <p className="text-xs opacity-70 mt-1">Go back to add an image</p>
                </div>
              )}
            </div>

            {/* Card Info */}
            <div className="space-y-3">
              <div>
                <h4 className="text-crd-white font-medium">{cardData.title}</h4>
                <p className="text-crd-lightGray text-sm">{cardData.description || 'No description'}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getVisibilityIcon()}
                  <span className="text-crd-lightGray capitalize">{cardData.visibility}</span>
                </div>
                {getRarityBadge()}
              </div>

              {cardData.tags && cardData.tags.length > 0 && (
                <div>
                  <h5 className="text-crd-white text-sm font-medium mb-2">Tags</h5>
                  <div className="flex flex-wrap gap-1">
                    {cardData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-crd-mediumGray/30 text-crd-lightGray border-crd-mediumGray/20">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Publishing Options */}
        <div className="space-y-6">
          {/* Final Details */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Final Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-crd-white text-sm font-medium mb-2">
                  Title
                </label>
                <Input
                  value={cardData.title}
                  onChange={(e) => onFieldUpdate('title', e.target.value)}
                  className="bg-crd-mediumGray/20 border-crd-mediumGray/30 text-crd-white"
                  placeholder="Enter card title"
                />
              </div>

              <div>
                <label className="block text-crd-white text-sm font-medium mb-2">
                  Description
                </label>
                <Textarea
                  value={cardData.description}
                  onChange={(e) => onFieldUpdate('description', e.target.value)}
                  className="bg-crd-mediumGray/20 border-crd-mediumGray/30 text-crd-white"
                  placeholder="Describe your card"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-crd-white text-sm font-medium mb-2">
                  Tags (comma separated)
                </label>
                <Input
                  value={cardData.tags?.join(', ') || ''}
                  onChange={handleTagsChange}
                  className="bg-crd-mediumGray/20 border-crd-mediumGray/30 text-crd-white"
                  placeholder="sports, trading, rare"
                />
              </div>
            </CardContent>
          </Card>

          {/* Publishing Settings */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Publishing Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Visibility Toggle */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-crd-white font-medium">Visibility</h5>
                    <p className="text-crd-lightGray text-sm">Control who can see your card</p>
                  </div>
                  <Select 
                    value={cardData.visibility || 'private'} 
                    onValueChange={(value) => {
                      onFieldUpdate('visibility', value);
                      onFieldUpdate('is_public', value === 'public');
                    }}
                  >
                    <SelectTrigger className="w-32 bg-crd-darkest border-crd-mediumGray/30 text-crd-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-crd-darker border-crd-mediumGray/30">
                      <SelectItem value="private" className="text-crd-white">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Private
                        </div>
                      </SelectItem>
                      <SelectItem value="public" className="text-crd-white">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Public
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Collection Selector */}
              <div className="space-y-2">
                <h5 className="text-crd-white font-medium">Add to Collection</h5>
                <p className="text-crd-lightGray text-sm mb-2">Organize your card in a collection</p>
                <Select 
                  value={cardData.collection_id || ''} 
                  onValueChange={(value) => onFieldUpdate('collection_id', value || null)}
                >
                  <SelectTrigger className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white">
                    <SelectValue placeholder="Select collection (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-crd-darker border-crd-mediumGray/30">
                    <SelectItem value="" className="text-crd-white">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        No collection
                      </div>
                    </SelectItem>
                    {!collectionsLoading && collections.map((collection) => (
                      <SelectItem key={collection.id} value={collection.id} className="text-crd-white">
                        <div className="flex items-center gap-2">
                          <FolderOpen className="w-4 h-4" />
                          {collection.title || collection.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-crd-white font-medium">CRD Catalog</h5>
                  <p className="text-crd-lightGray text-sm">Include in public catalog</p>
                </div>
                <Switch
                  checked={cardData.publishing_options?.crd_catalog_inclusion ?? true}
                  onCheckedChange={(checked) => handlePublishingOptionChange('crd_catalog_inclusion', checked)}
                />
              </div>

              {mode !== 'quick' && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-crd-white font-medium">Marketplace Listing</h5>
                      <p className="text-crd-lightGray text-sm">List for trading/selling</p>
                    </div>
                    <Switch
                      checked={cardData.publishing_options?.marketplace_listing ?? false}
                      onCheckedChange={(checked) => handlePublishingOptionChange('marketplace_listing', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-crd-white font-medium">Print Available</h5>
                      <p className="text-crd-lightGray text-sm">Allow physical printing</p>
                    </div>
                    <Switch
                      checked={cardData.publishing_options?.print_available ?? false}
                      onCheckedChange={(checked) => handlePublishingOptionChange('print_available', checked)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gallery Preview */}
      <Card className="bg-crd-darker border-crd-mediumGray/20 mt-8">
        <CardHeader>
          <CardTitle className="text-crd-white flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Gallery Preview
          </CardTitle>
          <p className="text-crd-lightGray text-sm">How your card will appear in the gallery</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-crd-mediumGray/10 rounded-lg">
            {/* Mini card preview */}
            <div className="w-16 h-20 bg-crd-mediumGray/20 rounded overflow-hidden flex-shrink-0">
              {cardData.image_url && !imageError ? (
                <img 
                  src={cardData.image_url} 
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-crd-lightGray" />
                </div>
              )}
            </div>
            
            {/* Card info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-crd-white font-medium truncate">{cardData.title}</h4>
              <p className="text-crd-lightGray text-sm truncate">
                {cardData.description || 'No description'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {getRarityBadge()}
                <Badge variant="outline" className="text-xs border-crd-mediumGray/30 text-crd-lightGray">
                  {cardData.visibility === 'public' ? 'Public' : 'Private'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ready to Publish Notice */}
      <Card className="bg-crd-green/10 border-crd-green/30 mt-8">
        <CardContent className="pt-6">
          <div className="text-center">
            <h4 className="text-crd-green font-medium mb-2">Ready to Publish!</h4>
            <p className="text-crd-lightGray text-sm">
              Your card is ready to be created and shared with the community. 
              Click "Create Card" to complete the process.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
