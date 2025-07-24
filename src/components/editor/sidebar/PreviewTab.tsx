import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Eye, Maximize, Download, Share2, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import AdvancedCardRenderer from '@/components/renderer/AdvancedCardRenderer';
import type { CardData } from '@/types/card';

interface PreviewTabProps {
  selectedTemplate: string;
  cardData?: CardData;
  onContinueToEffects: () => void;
}

export const PreviewTab = ({ selectedTemplate, cardData, onContinueToEffects }: PreviewTabProps) => {
  const [previewMode, setPreviewMode] = useState<'simple' | 'scene' | '3d'>('simple');

  const handleExport = () => {
    toast.success('Exporting high-resolution card...');
  };

  const handleShare = () => {
    toast.success('Generating share link...');
  };

  return (
    <ScrollArea className="h-full px-4">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-white font-medium text-lg mb-2">Card Preview</h3>
          <p className="text-crd-lightGray text-sm">
            Review your card design with advanced visual effects
          </p>
        </div>

        {/* Advanced Card Preview */}
        <div className="space-y-4">
          <h4 className="text-white font-medium text-sm uppercase tracking-wide">Advanced Preview</h4>
          <div className="flex justify-center">
            {cardData ? (
              <AdvancedCardRenderer
                card={cardData}
                width={240}
                height={336}
                interactive={true}
                showEffectControls={false}
              />
            ) : (
              <div className="aspect-[3/4] w-60 bg-editor-dark rounded-xl border border-editor-border relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-crd-green to-crd-orange rounded-xl mb-4 mx-auto flex items-center justify-center">
                      <span className="text-black font-bold text-lg">CARD</span>
                    </div>
                    <p className="text-crd-lightGray text-sm">Advanced Preview</p>
                    <p className="text-crd-lightGray text-xs mt-1">Template: {selectedTemplate}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full border-editor-border text-white hover:bg-editor-border" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export High Resolution
          </Button>
          
          <Button variant="outline" className="w-full border-editor-border text-white hover:bg-editor-border" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Preview
          </Button>
        </div>

        {/* Continue Button */}
        <div className="pt-4 border-t border-editor-border">
          <Button className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-medium" onClick={onContinueToEffects}>
            Continue to Effects
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};
