
import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Wand2, Brain, Zap, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { enhancedCardAnalysisService, type AIAnalysisResult } from '@/services/enhancedCardAnalysis';
import type { CardData } from '@/types/card';

interface AIAnalysisSummaryProps {
  cardData: Partial<CardData>;
  onFieldUpdate?: <K extends keyof CardData>(field: K, value: any) => void;
}

export const AIAnalysisSummary = ({ cardData, onFieldUpdate }: AIAnalysisSummaryProps) => {
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<Set<string>>(new Set());
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSmartSuggestions, setShowSmartSuggestions] = useState(true);

  // Get smart suggestions based on current data
  const smartSuggestions = enhancedCardAnalysisService.getSmartSuggestions(cardData);

  // Trigger AI analysis if image is available
  useEffect(() => {
    if (cardData.image_url && !aiAnalysis && !isAnalyzing) {
      analyzeCard();
    }
  }, [cardData.image_url]);

  const analyzeCard = async () => {
    if (!cardData.image_url) {
      toast.error('No image available for analysis');
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log('🧠 Starting AI analysis...');
      const result = await enhancedCardAnalysisService.analyzeCard({
        imageUrl: cardData.image_url,
        existingData: cardData,
        enableOCR: true,
        enableWebSearch: false
      });

      setAiAnalysis(result);
      
      if (result.error) {
        toast.warning('AI analysis completed with limited data', {
          description: 'Using fallback suggestions'
        });
      } else {
        toast.success(`AI analysis complete (${Math.round(result.confidence * 100)}% confidence)`);
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      toast.error('AI analysis failed', {
        description: 'Using smart suggestions instead'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAcceptSuggestion = (field: keyof CardData, value: any, source: 'ai' | 'smart' = 'smart') => {
    if (onFieldUpdate) {
      onFieldUpdate(field, value);
      setAcceptedSuggestions(prev => new Set(prev).add(field as string));
      
      toast.success(`Applied ${source === 'ai' ? 'AI' : 'smart'} suggestion for ${field}`, {
        duration: 2000
      });
    }
  };

  const handleAcceptAllAISuggestions = () => {
    if (!aiAnalysis || !onFieldUpdate) return;

    const fieldsToUpdate: Array<{ field: keyof CardData; value: any }> = [
      { field: 'title', value: aiAnalysis.title },
      { field: 'description', value: aiAnalysis.description },
      { field: 'tags', value: aiAnalysis.tags },
      { field: 'rarity', value: aiAnalysis.rarity }
    ];

    fieldsToUpdate.forEach(({ field, value }) => {
      onFieldUpdate(field, value);
      setAcceptedSuggestions(prev => new Set(prev).add(field as string));
    });

    toast.success('Applied all AI suggestions');
  };

  const isAccepted = (field: string) => acceptedSuggestions.has(field);

  const getSuggestionSource = () => aiAnalysis && !aiAnalysis.error ? 'ai' : 'smart';
  const currentSuggestions = aiAnalysis && !aiAnalysis.error ? aiAnalysis : {
    title: smartSuggestions.title,
    description: smartSuggestions.description,
    tags: ['enhanced', 'collectible', 'premium'],
    rarity: 'rare' as const
  };

  return (
    <div className="bg-crd-darkGray p-4 rounded-lg border border-crd-green/30">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-medium text-sm flex items-center gap-2">
          {getSuggestionSource() === 'ai' ? (
            <Brain className="w-4 h-4 text-crd-green" />
          ) : (
            <Sparkles className="w-4 h-4 text-crd-green" />
          )}
          {getSuggestionSource() === 'ai' ? 'AI Analysis' : 'Smart Suggestions'}
        </h4>
        
        <div className="flex items-center gap-2">
          {aiAnalysis && !aiAnalysis.error && (
            <Badge variant="outline" className="text-crd-green border-crd-green/30 text-xs">
              {Math.round(aiAnalysis.confidence * 100)}% confidence
            </Badge>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            onClick={analyzeCard}
            disabled={isAnalyzing || !cardData.image_url}
            className="h-7 px-2 text-xs text-crd-lightGray hover:text-white"
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
          </Button>
        </div>
      </div>

      {/* Analysis Status */}
      {isAnalyzing && (
        <div className="bg-crd-darker p-3 rounded border border-crd-mediumGray/30 mb-4">
          <div className="flex items-center gap-2 text-crd-green text-sm">
            <Zap className="w-4 h-4 animate-pulse" />
            <span>AI analyzing card image...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {aiAnalysis?.error && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded mb-4">
          <div className="text-yellow-400 text-sm mb-1">AI Analysis Limited</div>
          <div className="text-yellow-300 text-xs">{aiAnalysis.error}</div>
          <div className="text-yellow-300 text-xs mt-1">Using smart suggestions instead</div>
        </div>
      )}
      
      <div className="space-y-4">
        {/* Suggestions Section */}
        <div className="bg-crd-darker p-3 rounded border border-crd-mediumGray/30">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-crd-green text-xs font-medium flex items-center gap-1">
              <Wand2 className="w-3 h-3" />
              {getSuggestionSource() === 'ai' ? 'AI Suggestions' : 'Smart Suggestions'}
            </h5>
            
            {aiAnalysis && !aiAnalysis.error && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleAcceptAllAISuggestions}
                className="h-6 px-2 text-xs"
              >
                Accept All
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            {/* Title Suggestion */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-crd-lightGray text-xs mb-1">Suggested Title:</div>
                <div className="text-white text-sm font-medium">{currentSuggestions.title}</div>
              </div>
              <Button
                size="sm"
                variant={isAccepted('title') ? "default" : "outline"}
                onClick={() => handleAcceptSuggestion('title', currentSuggestions.title, getSuggestionSource())}
                disabled={isAccepted('title')}
                className="shrink-0 h-7 px-2 text-xs"
              >
                {isAccepted('title') ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Applied
                  </>
                ) : (
                  'Accept'
                )}
              </Button>
            </div>

            {/* Description Suggestion */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-crd-lightGray text-xs mb-1">Suggested Description:</div>
                <div className="text-white text-sm line-clamp-2">{currentSuggestions.description}</div>
              </div>
              <Button
                size="sm"
                variant={isAccepted('description') ? "default" : "outline"}
                onClick={() => handleAcceptSuggestion('description', currentSuggestions.description, getSuggestionSource())}
                disabled={isAccepted('description')}
                className="shrink-0 h-7 px-2 text-xs"
              >
                {isAccepted('description') ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Applied
                  </>
                ) : (
                  'Accept'
                )}
              </Button>
            </div>

            {/* Tags Suggestion */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-crd-lightGray text-xs mb-1">Suggested Tags:</div>
                <div className="flex flex-wrap gap-1">
                  {currentSuggestions.tags.map((tag, index) => (
                    <span key={index} className="bg-crd-mediumGray/30 text-white text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Button
                size="sm"
                variant={isAccepted('tags') ? "default" : "outline"}
                onClick={() => handleAcceptSuggestion('tags', currentSuggestions.tags, getSuggestionSource())}
                disabled={isAccepted('tags')}
                className="shrink-0 h-7 px-2 text-xs"
              >
                {isAccepted('tags') ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Applied
                  </>
                ) : (
                  'Accept'
                )}
              </Button>
            </div>

            {/* Rarity Suggestion (AI only) */}
            {getSuggestionSource() === 'ai' && aiAnalysis && (
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-crd-lightGray text-xs mb-1">Suggested Rarity:</div>
                  <Badge className="text-xs" variant="secondary">
                    {aiAnalysis.rarity.toUpperCase()}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant={isAccepted('rarity') ? "default" : "outline"}
                  onClick={() => handleAcceptSuggestion('rarity', aiAnalysis.rarity, 'ai')}
                  disabled={isAccepted('rarity')}
                  className="shrink-0 h-7 px-2 text-xs"
                >
                  {isAccepted('rarity') ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Applied
                    </>
                  ) : (
                    'Accept'
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Improvement Tips */}
        {(aiAnalysis?.suggestions.improvementTips || smartSuggestions.improvementTips).length > 0 && (
          <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded">
            <h6 className="text-blue-400 text-xs font-medium mb-2">💡 Improvement Tips</h6>
            <ul className="space-y-1">
              {(aiAnalysis?.suggestions.improvementTips || smartSuggestions.improvementTips).map((tip, index) => (
                <li key={index} className="text-blue-300 text-xs flex items-start gap-1">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Current Analysis Data */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-crd-lightGray">Type:</span>
            <span className="text-white ml-2">{cardData.title || 'N/A'}</span>
          </div>
          <div>
            <span className="text-crd-lightGray">Series:</span>
            <span className="text-white ml-2">{cardData.series || 'N/A'}</span>
          </div>
          <div>
            <span className="text-crd-lightGray">Tags:</span>
            <span className="text-white ml-2">{cardData.tags?.length || 0} applied</span>
          </div>
          <div>
            <span className="text-crd-lightGray">Rarity:</span>
            <span className="text-white ml-2">{cardData.rarity || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
