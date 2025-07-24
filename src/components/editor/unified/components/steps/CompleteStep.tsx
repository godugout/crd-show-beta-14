
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { CheckCircle, Share2, Eye, RotateCcw, Home } from 'lucide-react';
import { toast } from 'sonner';
import type { CreationMode } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';

interface CompleteStepProps {
  mode: CreationMode;
  cardData: CardData;
  onGoToGallery: () => void;
  onStartOver: () => void;
}

export const CompleteStep = ({ mode, cardData, onGoToGallery, onStartOver }: CompleteStepProps) => {
  console.log('✅ CompleteStep: Rendering with card:', cardData.title);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: cardData.title,
          text: `Check out my new trading card: ${cardData.title}`,
          url: window.location.origin + `/cards/${cardData.id}`
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(
          `Check out my new trading card: ${cardData.title}\n${window.location.origin}/cards/${cardData.id}`
        );
        toast.success('Card link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share card');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-crd-green rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-black" />
        </div>
        <h2 className="text-3xl font-bold text-crd-white mb-2">Card Created Successfully!</h2>
        <p className="text-crd-lightGray text-lg">
          Your {mode} card has been created and is ready to share with the world.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Card Display */}
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white">Your New Card</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[2.5/3.5] bg-crd-mediumGray/20 rounded-lg overflow-hidden mb-4">
              {cardData.image_url ? (
                <img 
                  src={cardData.image_url} 
                  alt={cardData.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-crd-lightGray">
                  Card Image
                </div>
              )}
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-bold text-crd-white mb-2">{cardData.title}</h3>
              {cardData.description && (
                <p className="text-crd-lightGray text-sm mb-4">{cardData.description}</p>
              )}
              
              <div className="flex items-center justify-center gap-4 text-sm text-crd-lightGray">
                <span className="capitalize">{cardData.rarity}</span>
                <span>•</span>
                <span className="capitalize">{cardData.visibility}</span>
                {cardData.tags && cardData.tags.length > 0 && (
                  <>
                    <span>•</span>
                    <span>{cardData.tags.length} tag{cardData.tags.length !== 1 ? 's' : ''}</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Actions */}
        <div className="space-y-6">
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white">What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CRDButton
                onClick={handleShare}
                className="w-full bg-crd-green hover:bg-crd-green/80 text-black"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Your Card
              </CRDButton>

              <CRDButton
                onClick={onGoToGallery}
                variant="outline"
                className="w-full border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                View in Gallery
              </CRDButton>

              <CRDButton
                onClick={onStartOver}
                variant="outline"
                className="w-full border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Create Another Card
              </CRDButton>
            </CardContent>
          </Card>

          {/* Success Stats */}
          <Card className="bg-crd-green/10 border-crd-green/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <h4 className="text-crd-green font-medium mb-3">Creation Complete!</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-crd-white font-bold text-lg">1</div>
                    <div className="text-crd-lightGray">Card Created</div>
                  </div>
                  <div>
                    <div className="text-crd-white font-bold text-lg">
                      {cardData.is_public ? 'Public' : 'Private'}
                    </div>
                    <div className="text-crd-lightGray">Visibility</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white text-sm">Pro Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-crd-lightGray text-sm space-y-2">
                <li>• Share your card to get feedback from the community</li>
                <li>• Create collections by grouping related cards</li>
                <li>• Use tags to make your cards discoverable</li>
                <li>• Try different creation modes for various styles</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation Helper */}
      <div className="text-center mt-8">
        <CRDButton
          onClick={onGoToGallery}
          variant="ghost"
          className="text-crd-lightGray hover:text-crd-white"
        >
          <Home className="w-4 h-4 mr-2" />
          Return to Gallery
        </CRDButton>
      </div>
    </div>
  );
};
