import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Zap, Palette, Wand2 } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { EnergyParticles } from '@/components/effects/ParticleSystem';
import type { CardAnalysisResult } from '@/services/ai/cardAnalysisService';

interface QuickCreateEnhanceProps {
  imageUrl: string;
  analysis: CardAnalysisResult;
  onComplete: (enhancedImageUrl: string, cardData: any) => void;
  onBack: () => void;
}

export const QuickCreateEnhance: React.FC<QuickCreateEnhanceProps> = ({
  imageUrl,
  analysis,
  onComplete,
  onBack
}) => {
  const [selectedVariation, setSelectedVariation] = useState<string>('auto');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  // Auto-apply best frame and effects on mount
  useEffect(() => {
    setIsEnhancing(true);
    
    // Simulate AI enhancement
    setTimeout(() => {
      setIsEnhancing(false);
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 2000);
    }, 2000);
  }, []);

  const variations = [
    {
      id: 'auto',
      name: 'AI Magic',
      description: 'Perfect auto-enhancement',
      icon: Sparkles,
      applied: true
    },
    {
      id: 'epic',
      name: 'More Epic',
      description: 'Dramatic effects & lighting',
      icon: Zap,
      applied: false
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Timeless traditional style',
      icon: Palette,
      applied: false
    },
    {
      id: 'futuristic',
      name: 'Futuristic',
      description: 'Sci-fi holographic effects',
      icon: Wand2,
      applied: false
    }
  ];

  const handleVariationSelect = (variationId: string) => {
    if (variationId === selectedVariation) return;
    
    setSelectedVariation(variationId);
    setIsEnhancing(true);
    
    // Simulate re-processing with new style
    setTimeout(() => {
      setIsEnhancing(false);
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 1000);
    }, 1500);
  };

  const handleComplete = () => {
    const cardData = {
      title: analysis.text.playerName || analysis.subject.name || 'Custom Card',
      description: `${analysis.design.mood} ${analysis.cardType} card`,
      image_url: imageUrl,
      rarity: analysis.text.rarity?.toLowerCase() || 'common',
      design_metadata: {
        frameStyle: analysis.suggestions.frameStyle,
        effects: analysis.suggestions.effects,
        primaryColors: analysis.design.primaryColors,
        mood: analysis.design.mood,
        variation: selectedVariation
      },
      ai_analysis: analysis
    };

    onComplete(imageUrl, cardData);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Energy particles for enhancement effects */}
      <EnergyParticles
        active={showParticles}
        trigger="burst"
        intensity={2}
      />

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border/50">
        <div className="flex items-center">
          <CRDButton
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </CRDButton>
          <div>
            <h2 className="text-2xl font-bold">AI Enhancement</h2>
            <p className="text-muted-foreground">Your card is looking amazing! Choose a style variation.</p>
          </div>
        </div>
        <CRDButton
          onClick={handleComplete}
          variant="primary"
          size="lg"
          disabled={isEnhancing}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Continue
        </CRDButton>
      </div>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Preview area */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-background to-muted/20">
          <motion.div
            className="relative"
            animate={{
              rotateY: isEnhancing ? [0, 180, 360] : 0,
              scale: isEnhancing ? [1, 1.05, 1] : 1
            }}
            transition={{
              duration: isEnhancing ? 2 : 0.5,
              ease: "easeInOut"
            }}
          >
            {/* Card preview with 3D rotation effect */}
            <div className="relative w-80 h-96 rounded-2xl overflow-hidden shadow-2xl">
              {isEnhancing && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-glow/20 z-10 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-12 h-12 text-primary" />
                  </motion.div>
                </div>
              )}
              
              <img
                src={imageUrl}
                alt="Enhanced card preview"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with AI detected info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                <h3 className="font-bold text-lg">
                  {analysis.text.playerName || analysis.subject.name || 'Custom Card'}
                </h3>
                {analysis.text.teamName && (
                  <p className="text-sm opacity-90">{analysis.text.teamName}</p>
                )}
                {analysis.subject.position && (
                  <p className="text-xs opacity-70">{analysis.subject.position}</p>
                )}
              </div>
              
              {/* Frame preview */}
              <div className="absolute inset-0 border-4 border-gradient-to-br from-primary/50 to-primary-glow/50 rounded-2xl pointer-events-none" />
            </div>

            {/* Quality score indicator */}
            <motion.div
              className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              {Math.round(analysis.design.qualityScore)}% Match
            </motion.div>
          </motion.div>
        </div>

        {/* Variation controls */}
        <div className="w-80 p-6 bg-card/50 backdrop-blur-sm border-l border-border/50">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Palette className="w-5 h-5 mr-2 text-primary" />
            Style Variations
          </h3>

          <div className="space-y-3">
            {variations.map((variation) => {
              const Icon = variation.icon;
              const isSelected = selectedVariation === variation.id;
              
              return (
                <motion.button
                  key={variation.id}
                  onClick={() => handleVariationSelect(variation.id)}
                  className={`
                    w-full p-4 rounded-xl border text-left transition-all
                    ${isSelected 
                      ? 'border-primary bg-primary/10 scale-105' 
                      : 'border-border hover:border-primary/50 hover:bg-primary/5'
                    }
                    ${isEnhancing ? 'pointer-events-none opacity-50' : ''}
                  `}
                  whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start">
                    <Icon className={`w-5 h-5 mr-3 mt-1 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div className="flex-1">
                      <h4 className="font-medium">{variation.name}</h4>
                      <p className="text-sm text-muted-foreground">{variation.description}</p>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-primary mt-1 font-medium"
                        >
                          ✓ Applied
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* AI analysis summary */}
          <div className="mt-6 p-4 bg-background/50 rounded-xl border border-border/50">
            <h4 className="font-medium mb-3 text-sm">AI Analysis</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Card Type:</span>
                <span className="capitalize">{analysis.cardType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mood:</span>
                <span className="capitalize">{analysis.design.mood}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Composition:</span>
                <span className="capitalize">{analysis.design.composition}</span>
              </div>
              {analysis.text.rarity && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rarity:</span>
                  <span className="capitalize">{analysis.text.rarity}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};