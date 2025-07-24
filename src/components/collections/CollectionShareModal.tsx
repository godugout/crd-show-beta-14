import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Share2, Code, Globe } from 'lucide-react';
import { toast } from 'sonner';
import type { Collection } from '@/repositories/collection/types';

interface CollectionShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection;
}

export const CollectionShareModal: React.FC<CollectionShareModalProps> = ({
  isOpen,
  onClose,
  collection
}) => {
  const [shareUrl] = useState(`${window.location.origin}/collections/${collection.shareToken || collection.id}`);
  const [embedCode] = useState(`<iframe src="${shareUrl}/embed" width="100%" height="400" frameborder="0"></iframe>`);

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(message);
    });
  };

  const shareToSocial = (platform: string) => {
    const text = `Check out my ${collection.title} collection!`;
    const url = encodeURIComponent(shareUrl);
    const textEncoded = encodeURIComponent(text);
    
    const socialUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${textEncoded}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      reddit: `https://reddit.com/submit?url=${url}&title=${textEncoded}`,
      linkedin: `https://linkedin.com/sharing/share-offsite/?url=${url}`
    };
    
    window.open(socialUrls[platform as keyof typeof socialUrls], '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-crd-dark border-crd-mediumGray">
        <DialogHeader>
          <DialogTitle className="text-crd-white flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share "{collection.title}"
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-crd-mediumGray">
            <TabsTrigger value="link" className="text-crd-white">Share Link</TabsTrigger>
            <TabsTrigger value="embed" className="text-crd-white">Embed Code</TabsTrigger>
            <TabsTrigger value="social" className="text-crd-white">Social Media</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            <div>
              <Label className="text-crd-white">Collection URL</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="bg-crd-mediumGray border-crd-lightGray text-crd-white"
                />
                <Button
                  onClick={() => copyToClipboard(shareUrl, 'Share link copied!')}
                  className="bg-crd-green hover:bg-crd-green/90 text-black"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-crd-lightGray mt-1">
                Anyone with this link can view your collection if it's public
              </p>
            </div>
          </TabsContent>

          <TabsContent value="embed" className="space-y-4">
            <div>
              <Label className="text-crd-white">Embed Code</Label>
              <div className="flex gap-2 mt-2">
                <textarea
                  value={embedCode}
                  readOnly
                  className="flex-1 min-h-[100px] p-3 bg-crd-mediumGray border border-crd-lightGray text-crd-white rounded-md text-sm font-mono resize-none"
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-crd-lightGray">
                  Copy this code to embed the collection on your website
                </p>
                <Button
                  onClick={() => copyToClipboard(embedCode, 'Embed code copied!')}
                  size="sm"
                  className="bg-crd-green hover:bg-crd-green/90 text-black"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => shareToSocial('twitter')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Share on Twitter
              </Button>
              <Button
                onClick={() => shareToSocial('facebook')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Share on Facebook
              </Button>
              <Button
                onClick={() => shareToSocial('reddit')}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Share on Reddit
              </Button>
              <Button
                onClick={() => shareToSocial('linkedin')}
                className="bg-blue-700 hover:bg-blue-800 text-white"
              >
                Share on LinkedIn
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t border-crd-mediumGray">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-crd-lightGray text-crd-white hover:bg-crd-mediumGray"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};