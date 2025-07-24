
import React from 'react';
import { Sparkles, DollarSign, Star, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CRDIdSystem } from './components/CRDIdSystem';
import { CardInfoFields } from './components/CardInfoFields';
import { CreatorAttributionFields } from './components/CreatorAttributionFields';
import { AIAnalysisSummary } from './components/AIAnalysisSummary';
import type { CreationMode } from '../unified/types';
import type { CardData, CreatorAttribution } from '@/types/card';
import type { DesignTemplate } from '@/types/card';
import type { CardSearchResult } from './hooks/useCardWebSearch';
import type { UnifiedAnalysisResult } from '@/services/imageAnalysis/unifiedCardAnalyzer';

interface CardDetailsStepProps {
  cardData: Partial<CardData>;
  onFieldUpdate: <K extends keyof CardData>(field: K, value: any) => void;
  onCreatorAttributionUpdate: (key: keyof CreatorAttribution, value: any) => void;
  aiAnalysisResult?: UnifiedAnalysisResult;
  aiAnalysisComplete?: boolean;
}

export const CardDetailsStep = ({ 
  cardData, 
  onFieldUpdate, 
  onCreatorAttributionUpdate,
  aiAnalysisResult,
  aiAnalysisComplete = false 
}: CardDetailsStepProps) => {
  
  const handleCardInfoFound = (result: CardSearchResult) => {
    onFieldUpdate('title', result.title);
    onFieldUpdate('description', result.description);
    onFieldUpdate('rarity', result.rarity);
    onFieldUpdate('tags', result.tags);
    onFieldUpdate('type', result.type);
    onFieldUpdate('series', result.series);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'epic': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'rare': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'uncommon': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'mint': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'excellent': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'good': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'fair': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'poor': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Card Details</h2>
        <p className="text-crd-lightGray">
          {aiAnalysisComplete 
            ? 'Review the AI-analyzed details below and make any adjustments'
            : 'Add information about your card or use CRD ID System to auto-fill'
          }
        </p>
        {aiAnalysisComplete && (
          <div className="flex items-center justify-center gap-2 mt-4 text-crd-green text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Enhanced analysis complete with {Math.round((aiAnalysisResult?.confidence || 0) * 100)}% confidence</span>
          </div>
        )}
      </div>

      {/* Enhanced Analysis Results */}
      {aiAnalysisResult && (
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-crd-green" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Value & Rarity */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-crd-green" />
                  <span className="text-crd-white text-sm font-medium">Estimated Value</span>
                </div>
                <div className="text-2xl font-bold text-crd-green">
                  ${aiAnalysisResult.estimatedValue.toFixed(2)}
                </div>
                <Badge className={getRarityColor(aiAnalysisResult.rarity)}>
                  {aiAnalysisResult.rarity.toUpperCase()}
                </Badge>
              </div>

              {/* Condition */}
              {aiAnalysisResult.condition && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-crd-green" />
                    <span className="text-crd-white text-sm font-medium">Condition</span>
                  </div>
                  <Badge className={getConditionColor(aiAnalysisResult.condition)}>
                    {aiAnalysisResult.condition.toUpperCase()}
                  </Badge>
                </div>
              )}

              {/* Confidence */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-crd-green" />
                  <span className="text-crd-white text-sm font-medium">Confidence</span>
                </div>
                <div className="text-lg font-semibold text-crd-white">
                  {Math.round(aiAnalysisResult.confidence * 100)}%
                </div>
              </div>
            </div>

            {/* Player & Card Info */}
            {(aiAnalysisResult.playerName || aiAnalysisResult.teamName || aiAnalysisResult.year) && (
              <div className="border-t border-crd-mediumGray/20 pt-4">
                <h4 className="text-crd-white font-medium mb-2">Detected Information</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  {aiAnalysisResult.playerName && (
                    <div>
                      <span className="text-crd-lightGray">Player:</span>
                      <div className="text-crd-white font-medium">{aiAnalysisResult.playerName}</div>
                    </div>
                  )}
                  {aiAnalysisResult.teamName && (
                    <div>
                      <span className="text-crd-lightGray">Team:</span>
                      <div className="text-crd-white font-medium">{aiAnalysisResult.teamName}</div>
                    </div>
                  )}
                  {aiAnalysisResult.year && (
                    <div>
                      <span className="text-crd-lightGray">Year:</span>
                      <div className="text-crd-white font-medium">{aiAnalysisResult.year}</div>
                    </div>
                  )}
                  {aiAnalysisResult.manufacturer && (
                    <div>
                      <span className="text-crd-lightGray">Manufacturer:</span>
                      <div className="text-crd-white font-medium">{aiAnalysisResult.manufacturer}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Special Features */}
            {aiAnalysisResult.specialFeatures.length > 0 && (
              <div className="border-t border-crd-mediumGray/20 pt-4">
                <h4 className="text-crd-white font-medium mb-2">Special Features</h4>
                <div className="flex flex-wrap gap-2">
                  {aiAnalysisResult.specialFeatures.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-crd-lightGray border-crd-mediumGray/30">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Analysis Sources */}
            <div className="border-t border-crd-mediumGray/20 pt-4">
              <h4 className="text-crd-white font-medium mb-2">Analysis Sources</h4>
              <div className="flex flex-wrap gap-2">
                {aiAnalysisResult.sources.ocr && (
                  <Badge variant="outline" className="text-crd-green border-crd-green/30">OCR ✓</Badge>
                )}
                {aiAnalysisResult.sources.visual && (
                  <Badge variant="outline" className="text-crd-green border-crd-green/30">Visual ✓</Badge>
                )}
                {aiAnalysisResult.sources.webSearch && (
                  <Badge variant="outline" className="text-crd-green border-crd-green/30">Web Search ✓</Badge>
                )}
                {aiAnalysisResult.sources.database && (
                  <Badge variant="outline" className="text-crd-green border-crd-green/30">Database ✓</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CRD ID System */}
      <CRDIdSystem 
        imageUrl={cardData.image_url}
        onCardInfoFound={handleCardInfoFound}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardInfoFields
          cardData={cardData}
          onFieldUpdate={onFieldUpdate}
          aiAnalysisComplete={aiAnalysisComplete}
        />

        <CreatorAttributionFields
          cardData={cardData}
          onFieldUpdate={onFieldUpdate}
          onCreatorAttributionUpdate={onCreatorAttributionUpdate}
        />
      </div>

      {aiAnalysisComplete && (
        <AIAnalysisSummary cardData={cardData} />
      )}
    </div>
  );
};
