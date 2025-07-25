
import React, { useState } from 'react';
import { Sparkles, Check, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CardData } from '@/types/card';

interface AIAnalysisSummaryProps {
  cardData: Partial<CardData>;
  onFieldUpdate?: <K extends keyof CardData>(field: K, value: any) => void;
}

interface AISuggestion {
  title: string;
  description: string;
  tags: string[];
}

export const AIAnalysisSummary = ({ cardData, onFieldUpdate }: AIAnalysisSummaryProps) => {
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<Set<string>>(new Set());

  // Mock AI suggestions - in real implementation, this would come from AI analysis
  const aiSuggestions: AISuggestion = {
    title: "Legendary Trading Card",
    description: "A rare and powerful card featuring mystical artwork and enhanced abilities. This premium collectible showcases intricate design elements.",
    tags: ["rare", "collectible", "mystical", "premium"]
  };

  const handleAcceptSuggestion = (field: keyof CardData, value: any) => {
    if (onFieldUpdate) {
      onFieldUpdate(field, value);
      setAcceptedSuggestions(prev => new Set(prev).add(field as string));
    }
  };

  const isAccepted = (field: string) => acceptedSuggestions.has(field);

  return (
    <div className="bg-crd-darkGray p-4 rounded-lg border border-crd-green/30">
      <h4 className="text-white font-medium text-sm mb-4 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-crd-green" />
        AI Analysis Summary
      </h4>
      
      <div className="space-y-4">
        {/* AI Suggestions Section */}
        <div className="bg-crd-darker p-3 rounded border border-crd-mediumGray/30">
          <h5 className="text-crd-green text-xs font-medium mb-3 flex items-center gap-1">
            <Wand2 className="w-3 h-3" />
            AI Suggestions
          </h5>
          
          <div className="space-y-3">
            {/* Title Suggestion */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-crd-lightGray text-xs mb-1">Suggested Title:</div>
                <div className="text-white text-sm font-medium truncate">{aiSuggestions.title}</div>
              </div>
              <Button
                size="sm"
                variant={isAccepted('title') ? "default" : "outline"}
                onClick={() => handleAcceptSuggestion('title', aiSuggestions.title)}
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
                <div className="text-white text-sm line-clamp-2">{aiSuggestions.description}</div>
              </div>
              <Button
                size="sm"
                variant={isAccepted('description') ? "default" : "outline"}
                onClick={() => handleAcceptSuggestion('description', aiSuggestions.description)}
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
                  {aiSuggestions.tags.map((tag, index) => (
                    <span key={index} className="bg-crd-mediumGray/30 text-white text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Button
                size="sm"
                variant={isAccepted('tags') ? "default" : "outline"}
                onClick={() => handleAcceptSuggestion('tags', aiSuggestions.tags)}
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
          </div>
        </div>

        {/* Current Analysis Data */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-crd-lightGray">Type:</span>
            <span className="text-white ml-2">{cardData.type || 'N/A'}</span>
          </div>
          <div>
            <span className="text-crd-lightGray">Series:</span>
            <span className="text-white ml-2">{cardData.series || 'N/A'}</span>
          </div>
          <div>
            <span className="text-crd-lightGray">Tags:</span>
            <span className="text-white ml-2">{cardData.tags?.length || 0} generated</span>
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
