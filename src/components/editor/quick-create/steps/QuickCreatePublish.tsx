import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Zap, Share2, Download, Eye } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { CelebrationParticles } from '@/components/effects/ParticleSystem';
import { unifiedDataService } from '@/services/unifiedDataService';
import { toast } from 'sonner';
import type { CardAnalysisResult } from '@/services/ai/cardAnalysisService';

interface QuickCreatePublishProps {
  cardData: any;
  enhancedImageUrl: string;
  analysis: CardAnalysisResult;
  onComplete: (finalCardData: any) => void;
  onBack: () => void;
}

export const QuickCreatePublish: React.FC<QuickCreatePublishProps> = ({
  cardData,
  enhancedImageUrl,
  analysis,
  onComplete,
  onBack
}) => {
  const [isMinting, setIsMinting] = useState(false);
  const [mintComplete, setMintComplete] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showCelebration, setShowCelebration] = useState(false);

  // Auto-generate name and stats from AI analysis
  const [cardName, setCardName] = useState(
    analysis.text.playerName || 
    analysis.subject.name || 
    `${analysis.design.mood} ${analysis.cardType}`.replace(/^\w/, c => c.toUpperCase())
  );

  const [autoStats] = useState(() => {
    const stats: Record<string, number> = {};
    
    // Generate stats based on card type and analysis
    if (analysis.cardType === 'sports') {
      stats['Power'] = Math.floor(analysis.design.qualityScore * 0.9) + 10;
      stats['Speed'] = Math.floor(Math.random() * 30) + 70;
      stats['Skill'] = Math.floor(analysis.design.qualityScore * 0.8) + 15;
    } else if (analysis.cardType === 'gaming') {
      stats['Attack'] = Math.floor(analysis.design.qualityScore * 0.95) + 5;
      stats['Defense'] = Math.floor(Math.random() * 40) + 60;
      stats['Magic'] = Math.floor(analysis.design.qualityScore * 0.7) + 20;
    } else {
      stats['Rarity'] = Math.floor(analysis.design.qualityScore);
      stats['Appeal'] = Math.floor(Math.random() * 25) + 75;
      stats['Quality'] = Math.floor(analysis.design.qualityScore * 0.9) + 10;
    }
    
    return stats;
  });

  useEffect(() => {
    // Start countdown after component mounts
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoMint();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAutoMint = async () => {
    setIsMinting(true);
    
    try {
      // Create final card data
      const finalCardData = {
        id: `quick-${Date.now()}`,
        title: cardName,
        description: `AI-enhanced ${analysis.cardType} card with ${analysis.design.mood} styling`,
        image_url: enhancedImageUrl,
        thumbnail_url: enhancedImageUrl,
        rarity: (analysis.text.rarity?.toLowerCase() || 'common') as 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary',
        tags: [
          analysis.cardType,
          analysis.design.mood,
          analysis.design.composition,
          ...(analysis.suggestions.effects || [])
        ],
        design_metadata: {
          ...cardData.design_metadata,
          stats: autoStats,
          ai_enhanced: true,
          quick_create: true
        },
        visibility: 'private' as 'private',
        is_public: false,
        creator_attribution: {
          collaboration_type: 'solo' as const
        },
        publishing_options: {
          marketplace_listing: false,
          crd_catalog_inclusion: false,
          print_available: false
        }
      };

      // Save to database
      await unifiedDataService.saveCard(finalCardData);
      
      // Animation sequence
      setTimeout(() => {
        setIsMinting(false);
        setMintComplete(true);
        setShowCelebration(true);
        
        toast.success('🎉 Card created successfully!');
        
        // Auto-complete after celebration
        setTimeout(() => {
          onComplete(finalCardData);
        }, 3000);
      }, 2000);
      
    } catch (error) {
      console.error('Failed to create card:', error);
      setIsMinting(false);
      toast.error('Failed to create card. Please try again.');
    }
  };

  const handleManualMint = () => {
    setCountdown(0);
    handleAutoMint();
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Celebration particles */}
      <CelebrationParticles
        active={showCelebration}
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
            disabled={isMinting || mintComplete}
          >
            <ArrowLeft className="w-4 h-4" />
          </CRDButton>
          <div>
            <h2 className="text-2xl font-bold">Final Touches</h2>
            <p className="text-muted-foreground">
              {mintComplete 
                ? 'Your card has been created!' 
                : 'Your masterpiece is ready to mint'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Card preview */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-background to-muted/20">
          <motion.div
            className="relative"
            animate={{
              scale: mintComplete ? [1, 1.1, 1] : 1,
              rotateY: isMinting ? [0, 15, -15, 0] : 0
            }}
            transition={{
              duration: mintComplete ? 1 : (isMinting ? 2 : 0.5),
              ease: "easeInOut",
              repeat: mintComplete ? 0 : (isMinting ? Infinity : 0)
            }}
          >
            {/* Enhanced card with effects */}
            <div className="relative w-80 h-96 rounded-2xl overflow-hidden shadow-2xl">
              {/* Minting overlay */}
              {isMinting && !mintComplete && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary-glow/30 z-10 flex items-center justify-center"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <div className="text-center text-white">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-16 h-16 mb-4 mx-auto" />
                    </motion.div>
                    <h3 className="text-xl font-bold">Minting Card...</h3>
                  </div>
                </motion.div>
              )}

              {/* Success overlay */}
              {mintComplete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 z-10 flex items-center justify-center"
                >
                  <div className="text-center text-white">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.3, 1] }}
                      transition={{ duration: 0.6, times: [0, 0.8, 1] }}
                    >
                      <Zap className="w-16 h-16 mb-4 mx-auto text-green-400" />
                    </motion.div>
                    <h3 className="text-xl font-bold">Card Minted!</h3>
                  </div>
                </motion.div>
              )}
              
              <img
                src={enhancedImageUrl}
                alt="Final card"
                className="w-full h-full object-cover"
              />
              
              {/* Card info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 text-white">
                <h3 className="font-bold text-lg">{cardName}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm opacity-90 capitalize">
                    {analysis.text.rarity || 'Custom'} • {analysis.cardType}
                  </span>
                  <div className="flex space-x-1">
                    {analysis.design.primaryColors.slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded-full border border-white/30"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Holographic frame effect */}
              <div className="absolute inset-0 border-4 border-gradient-to-br from-primary via-primary-glow to-primary rounded-2xl pointer-events-none opacity-70" />
            </div>

            {/* Floating stats */}
            <motion.div
              className="absolute -right-8 top-8 bg-card/90 backdrop-blur-sm border border-border/50 rounded-xl p-3 shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h4 className="text-sm font-medium mb-2">Auto Stats</h4>
              <div className="space-y-1">
                {Object.entries(autoStats).map(([stat, value]) => (
                  <div key={stat} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{stat}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Action panel */}
        <div className="w-80 p-6 bg-card/50 backdrop-blur-sm border-l border-border/50 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Ready to Mint</h3>

          {/* Countdown or mint button */}
          {!mintComplete && (
            <div className="mb-6">
              {countdown > 0 ? (
                <motion.div
                  className="text-center p-6 bg-primary/10 rounded-xl border border-primary/20"
                  key={countdown}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-4xl font-bold text-primary mb-2">{countdown}</div>
                  <p className="text-sm text-muted-foreground">Auto-minting in...</p>
                  <CRDButton
                    onClick={handleManualMint}
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    disabled={isMinting}
                  >
                    Mint Now
                  </CRDButton>
                </motion.div>
              ) : (
                <div className="text-center p-6">
                  {isMinting ? (
                    <div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                      </motion.div>
                      <p className="text-muted-foreground">Creating your masterpiece...</p>
                    </div>
                  ) : (
                    <CRDButton
                      onClick={handleManualMint}
                      variant="primary"
                      size="lg"
                      className="w-full"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Mint Now
                    </CRDButton>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Card details */}
          <div className="space-y-4 flex-1">
            <div>
              <label className="text-sm font-medium mb-2 block">Card Name</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full p-3 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isMinting || mintComplete}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">AI Analysis</label>
              <div className="p-3 bg-background/50 rounded-lg border border-border/50 text-sm">
                <div className="space-y-1">
                  <div>Type: <span className="font-medium capitalize">{analysis.cardType}</span></div>
                  <div>Mood: <span className="font-medium capitalize">{analysis.design.mood}</span></div>
                  <div>Quality: <span className="font-medium">{Math.round(analysis.design.qualityScore)}%</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          {mintComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <CRDButton variant="outline" size="lg" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                View in Collection
              </CRDButton>
              <CRDButton variant="outline" size="lg" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share Card
              </CRDButton>
              <CRDButton variant="outline" size="lg" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download
              </CRDButton>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};