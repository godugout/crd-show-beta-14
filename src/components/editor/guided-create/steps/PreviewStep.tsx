import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, Heart, Share2, Download, Edit } from 'lucide-react';

interface PreviewStepProps {
  data: any;
  onUpdate: (data: any) => void;
  cardData?: any;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({
  data,
  onUpdate,
  cardData
}) => {
  // Compile all data for preview
  const previewData = {
    title: data.details?.title || cardData?.title || 'Untitled Card',
    description: data.details?.description || cardData?.description || '',
    imageUrl: data.upload?.imageUrl || cardData?.image_url,
    template: data.template?.selectedTemplate,
    rarity: data.details?.rarity || cardData?.rarity || 'common',
    series: data.details?.series || cardData?.series || '',
    tags: data.details?.tags || cardData?.tags || [],
    power: data.details?.power || cardData?.power,
    toughness: data.details?.toughness || cardData?.toughness,
    customization: data.customize || {}
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-500',
      uncommon: 'bg-green-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-yellow-500',
      mythic: 'bg-red-500'
    };
    return colors[rarity as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Final Card Preview */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* 3D Card Preview */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Card Preview</h3>
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-sm mx-auto"
              style={{
                perspective: '1000px'
              }}
            >
              <div 
                className="relative bg-white rounded-xl shadow-2xl overflow-hidden"
                style={{
                  aspectRatio: '2.5/3.5',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Card Background */}
                {previewData.imageUrl && (
                  <img
                    src={previewData.imageUrl}
                    alt={previewData.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                
                {/* Template Overlay */}
                {previewData.template && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                )}

                {/* Card Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-3 h-3 rounded-full ${getRarityColor(previewData.rarity)}`} />
                    {(previewData.power || previewData.toughness) && (
                      <div className="bg-black/50 px-2 py-1 rounded text-sm">
                        {previewData.power || 0}/{previewData.toughness || 0}
                      </div>
                    )}
                  </div>
                  <h4 className="font-bold text-lg mb-1">{previewData.title}</h4>
                  {previewData.description && (
                    <p className="text-sm opacity-90 line-clamp-2">{previewData.description}</p>
                  )}
                </div>

                {/* Holographic Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-purple/10 pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </Card>

        {/* Card Details */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Card Details</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-xl">{previewData.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-3 h-3 rounded-full ${getRarityColor(previewData.rarity)}`} />
                <span className="text-sm text-muted-foreground capitalize">{previewData.rarity}</span>
                {previewData.series && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{previewData.series}</span>
                  </>
                )}
              </div>
            </div>

            {previewData.description && (
              <div>
                <h5 className="font-medium mb-2">Description</h5>
                <p className="text-muted-foreground">{previewData.description}</p>
              </div>
            )}

            {(previewData.power || previewData.toughness) && (
              <div>
                <h5 className="font-medium mb-2">Stats</h5>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{previewData.power || 0}</div>
                    <div className="text-sm text-muted-foreground">Power</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{previewData.toughness || 0}</div>
                    <div className="text-sm text-muted-foreground">Toughness</div>
                  </div>
                </div>
              </div>
            )}

            {previewData.tags.length > 0 && (
              <div>
                <h5 className="font-medium mb-2">Tags</h5>
                <div className="flex flex-wrap gap-2">
                  {previewData.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {previewData.template && (
              <div>
                <h5 className="font-medium mb-2">Template</h5>
                <div className="flex items-center gap-3">
                  <img
                    src={previewData.template.preview}
                    alt={previewData.template.name}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div>
                    <div className="font-medium">{previewData.template.name}</div>
                    <div className="text-sm text-muted-foreground">{previewData.template.category}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Final Review</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="flex-1">
            <Edit className="w-4 h-4 mr-2" />
            Edit Details
          </Button>
          <Button variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button variant="outline" className="flex-1">
            <Share2 className="w-4 h-4 mr-2" />
            Share Preview
          </Button>
        </div>
      </Card>

      {/* Publishing Preview */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <h3 className="text-lg font-semibold mb-4 text-primary">Ready to Publish!</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Publishing Options</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>✓ High-resolution download</li>
              <li>✓ Social media sharing</li>
              <li>✓ Collection management</li>
              <li>✓ Marketplace listing (optional)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Next Steps</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Set visibility preferences</li>
              <li>• Choose sharing options</li>
              <li>• Add to collection</li>
              <li>• Publish to marketplace</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};