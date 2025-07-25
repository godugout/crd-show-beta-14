import { supabase } from '@/integrations/supabase/client';

export interface AIAnalysisResult {
  title: string;
  description: string;
  tags: string[];
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  estimatedValue: number;
  confidence: number;
  playerName?: string;
  teamName?: string;
  year?: string;
  manufacturer?: string;
  condition?: 'mint' | 'excellent' | 'good' | 'fair' | 'poor';
  specialFeatures: string[];
  cardType: 'sports' | 'gaming' | 'collectible' | 'custom';
  sources: {
    ai: boolean;
    visual: boolean;
    ocr: boolean;
    webSearch: boolean;
    database: boolean;
  };
  suggestions: {
    title: string;
    description: string;
    improvementTips: string[];
  };
  timestamp: string;
  processingTimeMs?: number;
  error?: string;
}

export interface CardAnalysisOptions {
  imageUrl: string;
  existingData?: Record<string, any>;
  enableOCR?: boolean;
  enableWebSearch?: boolean;
  confidence?: number;
}

class EnhancedCardAnalysisService {
  private cache = new Map<string, AIAnalysisResult>();
  private analysisInProgress = new Map<string, Promise<AIAnalysisResult>>();

  async analyzeCard(options: CardAnalysisOptions): Promise<AIAnalysisResult> {
    const { imageUrl, existingData = {}, enableOCR = false, enableWebSearch = false } = options;
    
    // Create cache key
    const cacheKey = `${imageUrl}_${JSON.stringify(existingData)}_${enableOCR}_${enableWebSearch}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      console.log('🔄 Returning cached AI analysis');
      return this.cache.get(cacheKey)!;
    }

    // Check if analysis is already in progress
    if (this.analysisInProgress.has(cacheKey)) {
      console.log('⏳ Analysis in progress, waiting...');
      return this.analysisInProgress.get(cacheKey)!;
    }

    // Start new analysis
    const analysisPromise = this.performAnalysis(options);
    this.analysisInProgress.set(cacheKey, analysisPromise);

    try {
      const result = await analysisPromise;
      
      // Cache successful result
      this.cache.set(cacheKey, result);
      
      // Clean up
      this.analysisInProgress.delete(cacheKey);
      
      return result;
    } catch (error) {
      // Clean up on error
      this.analysisInProgress.delete(cacheKey);
      throw error;
    }
  }

  private async performAnalysis(options: CardAnalysisOptions): Promise<AIAnalysisResult> {
    console.log('🚀 Starting enhanced card analysis...');
    
    try {
      // Call the edge function for AI analysis
      const { data, error } = await supabase.functions.invoke('analyze-card-ai', {
        body: {
          imageUrl: options.imageUrl,
          existingData: options.existingData,
          enableOCR: options.enableOCR,
          enableWebSearch: options.enableWebSearch
        }
      });

      if (error) {
        console.error('❌ Edge function error:', error);
        throw new Error(`Analysis failed: ${error.message}`);
      }

      if (!data) {
        throw new Error('No analysis data returned');
      }

      console.log('✅ AI analysis completed successfully:', {
        confidence: data.confidence,
        cardType: data.cardType,
        title: data.title
      });

      return data as AIAnalysisResult;
    } catch (error) {
      console.error('❌ Analysis error:', error);
      
      // Return fallback analysis with error info
      return this.getFallbackAnalysis(options, error as Error);
    }
  }

  private getFallbackAnalysis(options: CardAnalysisOptions, error: Error): AIAnalysisResult {
    const { existingData = {} } = options;
    
    return {
      title: existingData.title || "Trading Card",
      description: existingData.description || "A unique collectible trading card with distinctive design elements.",
      tags: existingData.tags || ["collectible", "trading card"],
      rarity: existingData.rarity || "common",
      estimatedValue: 2.50,
      confidence: 0.30,
      cardType: "collectible",
      specialFeatures: [],
      sources: {
        ai: false,
        visual: false,
        ocr: false,
        webSearch: false,
        database: false
      },
      suggestions: {
        title: "Enhanced Trading Card",
        description: "Consider adding more details about the card's theme and artwork.",
        improvementTips: [
          "Upload a higher quality image",
          "Ensure good lighting and focus",
          "Add manual details if AI analysis fails"
        ]
      },
      timestamp: new Date().toISOString(),
      error: error.message
    };
  }

  // Get smart suggestions based on existing data
  getSmartSuggestions(existingData: Record<string, any>): AIAnalysisResult['suggestions'] {
    const suggestions: AIAnalysisResult['suggestions'] = {
      title: "",
      description: "",
      improvementTips: []
    };

    // Title suggestions
    if (!existingData.title || existingData.title.length < 3) {
      suggestions.title = "Legendary Trading Card";
      suggestions.improvementTips.push("Add a descriptive title");
    } else {
      suggestions.title = `Enhanced ${existingData.title}`;
    }

    // Description suggestions
    if (!existingData.description || existingData.description.length < 20) {
      suggestions.description = "A premium collectible featuring unique artwork and special characteristics that make it stand out in any collection.";
      suggestions.improvementTips.push("Add a detailed description");
    } else {
      suggestions.description = `${existingData.description} This collectible features premium design elements and quality craftsmanship.`;
    }

    // General improvement tips
    if (!existingData.tags || existingData.tags.length < 3) {
      suggestions.improvementTips.push("Add relevant tags for better discoverability");
    }

    if (!existingData.rarity || existingData.rarity === 'common') {
      suggestions.improvementTips.push("Consider the card's rarity based on its features");
    }

    return suggestions;
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
    console.log('🧹 Analysis cache cleared');
  }

  // Get cache stats
  getCacheStats() {
    return {
      cachedAnalyses: this.cache.size,
      inProgress: this.analysisInProgress.size
    };
  }
}

// Export singleton instance
export const enhancedCardAnalysisService = new EnhancedCardAnalysisService();