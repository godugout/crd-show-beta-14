import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Share, Download, Sparkles, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { WizardData } from '../InteractiveWizard';

interface FinalTouchesStepProps {
  data: WizardData;
  onUpdate: (data: Partial<WizardData>) => void;
  onComplete: () => void;
  onPrevious: () => void;
}

export const FinalTouchesStep: React.FC<FinalTouchesStepProps> = ({
  data,
  onUpdate,
  onComplete,
  onPrevious
}) => {
  const [rotation, setRotation] = useState(0);
  const [rarity, setRarity] = useState<'common' | 'rare' | 'epic' | 'legendary'>('common');

  const handleComplete = () => {
    onUpdate({ finalSettings: { rotation, rarity } });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-4">
            Final Touches
          </h1>
          <p className="text-xl text-muted-foreground">
            Perfect your masterpiece with final effects and sharing options
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 3D Preview */}
          <Card className="p-6 bg-background/50 backdrop-blur-sm border-white/10">
            <h3 className="text-xl font-bold mb-4">360° Preview</h3>
            <div className="aspect-[3/4] bg-muted rounded-lg relative overflow-hidden">
              <motion.div
                className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center"
                animate={{ rotateY: rotation }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <div className="text-center">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <p className="text-lg font-semibold">Your Amazing Card</p>
                </div>
              </motion.div>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setRotation(prev => prev + 90)}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Rotate View
              </Button>
            </div>
          </Card>

          {/* Effects & Sharing */}
          <div className="space-y-6">
            <Card className="p-6 bg-background/50 backdrop-blur-sm border-white/10">
              <h3 className="text-xl font-bold mb-4">Rarity Effects</h3>
              <div className="grid grid-cols-2 gap-3">
                {(['common', 'rare', 'epic', 'legendary'] as const).map((rarityOption) => (
                  <Button
                    key={rarityOption}
                    variant={rarity === rarityOption ? 'default' : 'outline'}
                    onClick={() => setRarity(rarityOption)}
                    className={`capitalize ${
                      rarityOption === 'legendary' ? 'text-yellow-500' :
                      rarityOption === 'epic' ? 'text-purple-500' :
                      rarityOption === 'rare' ? 'text-blue-500' : ''
                    }`}
                  >
                    {rarityOption}
                  </Button>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-background/50 backdrop-blur-sm border-white/10">
              <h3 className="text-xl font-bold mb-4">Share Your Creation</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Share className="w-4 h-4 mr-2" />
                  Share on Social
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download HD
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onPrevious}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button onClick={handleComplete} className="bg-primary hover:bg-primary/90">
            <Sparkles className="w-4 h-4 mr-2" />
            Create Card
          </Button>
        </div>
      </div>
    </div>
  );
};