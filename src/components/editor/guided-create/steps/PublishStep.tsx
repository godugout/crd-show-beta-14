import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Globe, Lock, Users, DollarSign, Share2, Download, Eye } from 'lucide-react';

interface PublishStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

export const PublishStep: React.FC<PublishStepProps> = ({
  data,
  onUpdate
}) => {
  const updatePublishing = (key: string, value: any) => {
    onUpdate({
      ...data,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Visibility Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Visibility & Access</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-primary" />
              <div>
                <Label htmlFor="public">Public</Label>
                <p className="text-sm text-muted-foreground">Anyone can view this card</p>
              </div>
            </div>
            <Switch
              id="public"
              checked={data.visibility === 'public'}
              onCheckedChange={(checked) => updatePublishing('visibility', checked ? 'public' : 'private')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <Label htmlFor="discoverable">Discoverable</Label>
                <p className="text-sm text-muted-foreground">Include in public galleries and search</p>
              </div>
            </div>
            <Switch
              id="discoverable"
              checked={data.discoverable || false}
              onCheckedChange={(checked) => updatePublishing('discoverable', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Share2 className="w-5 h-5 text-primary" />
              <div>
                <Label htmlFor="allowSharing">Allow Sharing</Label>
                <p className="text-sm text-muted-foreground">Others can share your card</p>
              </div>
            </div>
            <Switch
              id="allowSharing"
              checked={data.allowSharing !== false}
              onCheckedChange={(checked) => updatePublishing('allowSharing', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Marketplace Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Marketplace Options</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <Label htmlFor="marketplace">List on Marketplace</Label>
                <p className="text-sm text-muted-foreground">Make your card available for purchase</p>
              </div>
            </div>
            <Switch
              id="marketplace"
              checked={data.listOnMarketplace || false}
              onCheckedChange={(checked) => updatePublishing('listOnMarketplace', checked)}
            />
          </div>

          {data.listOnMarketplace && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4 pt-4 border-t"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={data.price || ''}
                    onChange={(e) => updatePublishing('price', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="royalty">Royalty %</Label>
                  <Input
                    id="royalty"
                    type="number"
                    placeholder="5.0"
                    value={data.royaltyPercentage || 5}
                    onChange={(e) => updatePublishing('royaltyPercentage', parseFloat(e.target.value) || 5)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="license">License Type</Label>
                <Select 
                  value={data.licenseType || 'standard'} 
                  onValueChange={(value) => updatePublishing('licenseType', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select license" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard License</SelectItem>
                    <SelectItem value="commercial">Commercial Use</SelectItem>
                    <SelectItem value="exclusive">Exclusive Rights</SelectItem>
                    <SelectItem value="creative-commons">Creative Commons</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </div>
      </Card>

      {/* Collection Assignment */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Collection & Organization</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="collection">Add to Collection</Label>
            <Select 
              value={data.collectionId || ''} 
              onValueChange={(value) => updatePublishing('collectionId', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select collection or create new" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Collection</SelectItem>
                <SelectItem value="new">+ Create New Collection</SelectItem>
                <SelectItem value="my-sports-cards">My Sports Cards</SelectItem>
                <SelectItem value="fantasy-collection">Fantasy Collection</SelectItem>
                <SelectItem value="gaming-cards">Gaming Cards</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {data.collectionId === 'new' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4 pt-4 border-t"
            >
              <div>
                <Label htmlFor="newCollectionName">Collection Name</Label>
                <Input
                  id="newCollectionName"
                  placeholder="Enter collection name"
                  value={data.newCollectionName || ''}
                  onChange={(e) => updatePublishing('newCollectionName', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="newCollectionDescription">Description</Label>
                <Textarea
                  id="newCollectionDescription"
                  placeholder="Describe your collection..."
                  value={data.newCollectionDescription || ''}
                  onChange={(e) => updatePublishing('newCollectionDescription', e.target.value)}
                  className="mt-1"
                />
              </div>
            </motion.div>
          )}
        </div>
      </Card>

      {/* Publishing Preview */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <h3 className="text-lg font-semibold mb-4 text-primary">Publishing Summary</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Visibility</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                {data.visibility === 'public' ? (
                  <Globe className="w-4 h-4 text-green-500" />
                ) : (
                  <Lock className="w-4 h-4 text-orange-500" />
                )}
                <span>{data.visibility === 'public' ? 'Public' : 'Private'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{data.discoverable ? 'Discoverable' : 'Not discoverable'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                <span>{data.allowSharing !== false ? 'Sharing allowed' : 'Sharing disabled'}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Marketplace</h4>
            <div className="space-y-2 text-sm">
              {data.listOnMarketplace ? (
                <>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span>Listed at ${data.price || 0}</span>
                  </div>
                  <div className="text-muted-foreground">
                    Royalty: {data.royaltyPercentage || 5}%
                  </div>
                  <div className="text-muted-foreground">
                    License: {data.licenseType || 'Standard'}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-orange-500" />
                  <span>Not for sale</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Save as Draft
          </Button>
          <Button className="flex-1" disabled={!data.visibility}>
            <Share2 className="w-4 h-4 mr-2" />
            Publish Card
          </Button>
        </div>
      </Card>

      {/* Terms and Conditions */}
      <Card className="p-6">
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">By publishing this card, you agree to our:</p>
          <ul className="space-y-1">
            <li>• <span className="text-primary hover:underline cursor-pointer">Terms of Service</span></li>
            <li>• <span className="text-primary hover:underline cursor-pointer">Content Policy</span></li>
            <li>• <span className="text-primary hover:underline cursor-pointer">Marketplace Guidelines</span></li>
          </ul>
        </div>
      </Card>
    </div>
  );
};