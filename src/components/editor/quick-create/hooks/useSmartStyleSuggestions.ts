import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface SmartStyleSuggestion {
  styleId: 'epic' | 'classic' | 'futuristic';
  confidence: number;
  reasoning: string;
  alternatives: Array<{
    styleId: 'epic' | 'classic' | 'futuristic';
    confidence: number;
    reasoning: string;
  }>;
  features: ContentAnalysis;
}

export interface ContentAnalysis {
  colorPalette: {
    dominant: string[];
    temperature: 'warm' | 'cool' | 'neutral';
    saturation: 'high' | 'medium' | 'low';
  };
  subject: {
    category: 'sports' | 'gaming' | 'art' | 'portrait' | 'landscape' | 'abstract' | 'other';
    confidence: number;
  };
  era: {
    period: 'vintage' | 'retro' | 'modern' | 'futuristic';
    confidence: number;
  };
  mood: {
    primary: 'energetic' | 'calm' | 'dramatic' | 'mysterious' | 'elegant';
    intensity: number;
  };
  quality: {
    resolution: 'low' | 'medium' | 'high';
    clarity: number;
    composition: number;
  };
}

interface StyleMatchingRule {
  conditions: Array<{
    feature: keyof ContentAnalysis;
    values: string[];
    weight: number;
  }>;
}

const STYLE_MATCHING_RULES: Record<string, StyleMatchingRule> = {
  epic: {
    conditions: [
      { feature: 'mood', values: ['energetic', 'dramatic'], weight: 0.35 },
      { feature: 'subject', values: ['sports', 'gaming'], weight: 0.4 },
      { feature: 'colorPalette', values: ['warm'], weight: 0.25 }
    ]
  },
  classic: {
    conditions: [
      { feature: 'era', values: ['vintage', 'retro'], weight: 0.4 },
      { feature: 'mood', values: ['calm', 'elegant'], weight: 0.3 },
      { feature: 'quality', values: ['high'], weight: 0.3 }
    ]
  },
  futuristic: {
    conditions: [
      { feature: 'subject', values: ['gaming', 'abstract'], weight: 0.4 },
      { feature: 'era', values: ['modern', 'futuristic'], weight: 0.35 },
      { feature: 'colorPalette', values: ['cool'], weight: 0.25 }
    ]
  }
};

export const useSmartStyleSuggestions = (imageUrl: string | null, cardData?: any) => {
  const [suggestion, setSuggestion] = useState<SmartStyleSuggestion | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const analyzeCardContent = useCallback(async (imageUrl: string): Promise<ContentAnalysis> => {
    try {
      const response = await fetch('/api/analyze-card-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl, cardData }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error('Failed to analyze card content:', error);
      throw error;
    }
  }, [cardData]);

  const calculateStyleScore = useCallback((analysis: ContentAnalysis, styleId: string): number => {
    const rules = STYLE_MATCHING_RULES[styleId];
    if (!rules) return 0;

    let totalScore = 0;
    let totalWeight = 0;

    rules.conditions.forEach(condition => {
      let matchScore = 0;

      // Calculate match score based on feature type
      if (condition.feature === 'colorPalette') {
        const palette = analysis.colorPalette;
        matchScore = condition.values.includes(palette.temperature) ? 1 : 0;
      } else if (condition.feature === 'subject') {
        const subject = analysis.subject;
        matchScore = condition.values.includes(subject.category) ? subject.confidence : 0;
      } else if (condition.feature === 'era') {
        const era = analysis.era;
        matchScore = condition.values.includes(era.period) ? era.confidence : 0;
      } else if (condition.feature === 'mood') {
        const mood = analysis.mood;
        matchScore = condition.values.includes(mood.primary) ? mood.intensity : 0;
      } else if (condition.feature === 'quality') {
        const quality = analysis.quality;
        matchScore = condition.values.includes(quality.resolution) ? quality.clarity : 0;
      }

      totalScore += matchScore * condition.weight;
      totalWeight += condition.weight;
    });

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }, []);

  const determineOptimalStyle = useCallback((analysis: ContentAnalysis): SmartStyleSuggestion => {
    const styles: Array<{ styleId: 'epic' | 'classic' | 'futuristic'; score: number }> = [
      { styleId: 'epic', score: calculateStyleScore(analysis, 'epic') },
      { styleId: 'classic', score: calculateStyleScore(analysis, 'classic') },
      { styleId: 'futuristic', score: calculateStyleScore(analysis, 'futuristic') }
    ];

    // Sort by score descending
    styles.sort((a, b) => b.score - a.score);

    const primary = styles[0];
    const alternatives = styles.slice(1).map(style => ({
      styleId: style.styleId,
      confidence: Math.round(style.score * 100) / 100,
      reasoning: generateReasoning(analysis, style.styleId)
    }));

    return {
      styleId: primary.styleId,
      confidence: Math.round(primary.score * 100) / 100,
      reasoning: generateReasoning(analysis, primary.styleId),
      alternatives,
      features: analysis
    };
  }, [calculateStyleScore]);

  const generateReasoning = useCallback((analysis: ContentAnalysis, styleId: string): string => {
    const reasons: string[] = [];

    switch (styleId) {
      case 'epic':
        if (analysis.mood.primary === 'energetic') {
          reasons.push('energetic mood');
        }
        if (analysis.subject.category === 'sports') {
          reasons.push('sports content');
        }
        if (analysis.colorPalette.temperature === 'warm') {
          reasons.push('warm color palette');
        }
        break;
      
      case 'classic':
        if (analysis.era.period === 'vintage' || analysis.era.period === 'retro') {
          reasons.push(`${analysis.era.period} aesthetic`);
        }
        if (analysis.mood.primary === 'elegant') {
          reasons.push('elegant composition');
        }
        if (analysis.quality.resolution === 'high') {
          reasons.push('high quality imagery');
        }
        break;
      
      case 'futuristic':
        if (analysis.subject.category === 'gaming') {
          reasons.push('gaming theme');
        }
        if (analysis.era.period === 'modern' || analysis.era.period === 'futuristic') {
          reasons.push(`${analysis.era.period} style`);
        }
        if (analysis.colorPalette.temperature === 'cool') {
          reasons.push('cool color scheme');
        }
        break;
    }

    return reasons.length > 0 
      ? `Best for ${reasons.join(', ')}`
      : `Matches ${styleId} style characteristics`;
  }, []);

  const runAnalysis = useCallback(async () => {
    if (!imageUrl) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const analysis = await analyzeCardContent(imageUrl);
      const suggestion = determineOptimalStyle(analysis);
      setSuggestion(suggestion);

      // Show auto-suggestion for high confidence
      if (suggestion.confidence > 0.8) {
        toast.success(
          `🎯 Recommended: ${suggestion.styleId.charAt(0).toUpperCase() + suggestion.styleId.slice(1)}`,
          {
            description: suggestion.reasoning,
            duration: 5000,
          }
        );
      }

      // Track analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'smart_suggestion_generated', {
          recommended_style: suggestion.styleId,
          confidence: suggestion.confidence,
          timestamp: Date.now()
        });
      }

    } catch (error) {
      console.error('Smart style suggestion failed:', error);
      setAnalysisError(error instanceof Error ? error.message : 'Analysis failed');
      toast.error('Unable to analyze image for style suggestions');
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageUrl, analyzeCardContent, determineOptimalStyle]);

  useEffect(() => {
    if (imageUrl) {
      // Debounce analysis to avoid too many requests
      const timer = setTimeout(runAnalysis, 1000);
      return () => clearTimeout(timer);
    } else {
      setSuggestion(null);
      setAnalysisError(null);
    }
  }, [imageUrl, runAnalysis]);

  const applySuggestion = useCallback((styleId: 'epic' | 'classic' | 'futuristic') => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'smart_suggestion_applied', {
        suggested_style: styleId,
        confidence: suggestion?.confidence || 0,
        timestamp: Date.now()
      });
    }
  }, [suggestion]);

  return {
    suggestion,
    isAnalyzing,
    analysisError,
    applySuggestion,
    runAnalysis
  };
};