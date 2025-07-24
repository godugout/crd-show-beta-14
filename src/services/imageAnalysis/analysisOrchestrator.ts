
import { supabase } from '@/integrations/supabase/client';

export interface AnalysisResult {
  title: string | null;
  description: string | null;
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary' | null;
  tags: string[];
  confidence: number;
  objects: string[];
  detectionMethod?: string;
  matchedKeywords?: string[];
  category?: string;
  requiresManualReview?: boolean;
  error?: boolean;
  message?: string;
}

export class AnalysisOrchestrator {
  async analyzeImage(imageUrl: string): Promise<AnalysisResult> {
    try {
      console.log('🚀 Starting robust image analysis for:', imageUrl);
      
      // Call the enhanced Supabase edge function for robust image analysis
      const { data, error } = await supabase.functions.invoke('analyze-card-image', {
        body: { imageData: imageUrl }
      });

      if (error) {
        console.error('❌ Edge function error:', error);
        return this.getErrorResult('Edge function failed');
      }

      console.log('📊 Robust analysis response:', data);

      // Handle failed analysis or low confidence results
      if (data.error || data.requiresManualReview) {
        console.log('⚠️ Analysis requires manual review or failed');
        return {
          title: data.creativeTitle,
          description: data.creativeDescription,
          rarity: this.mapRarityFromResponse(data.rarity),
          tags: this.generateTagsFromAnalysis(data, data.extractedText || []),
          confidence: data.confidence || 0,
          objects: data.extractedText || ['unknown'],
          detectionMethod: data.analysisMethod || 'failed',
          category: data.visualAnalysis?.theme?.toLowerCase() || 'unknown',
          requiresManualReview: true,
          error: data.error || false,
          message: data.message || 'Analysis was inconclusive'
        };
      }

      // Handle successful analysis
      const detectedObjects = data.extractedText || data.subjects || [];
      const rarity = this.mapRarityFromResponse(data.rarity);
      const category = data.visualAnalysis?.theme?.toLowerCase() || 'general';
      
      console.log('✅ Robust analysis complete:', {
        method: data.analysisMethod,
        detected: detectedObjects,
        title: data.creativeTitle || data.playerName,
        confidence: data.confidence,
        category: category,
        requiresManualReview: data.requiresManualReview || false
      });
      
      return {
        title: data.creativeTitle || data.playerName || null,
        description: data.creativeDescription || null,
        rarity: rarity,
        tags: this.generateTagsFromAnalysis(data, detectedObjects),
        confidence: data.confidence || 0,
        objects: detectedObjects,
        detectionMethod: data.analysisMethod || 'unknown',
        category: category,
        requiresManualReview: data.requiresManualReview || false,
        error: false
      };
      
    } catch (error) {
      console.error('❌ Analysis orchestrator failed:', error);
      return this.getErrorResult('Analysis system error');
    }
  }
  
  private mapRarityFromResponse(rarity: string | null): 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary' | null {
    if (!rarity) return null;
    
    const rarityMap: { [key: string]: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary' } = {
      'common': 'common',
      'uncommon': 'uncommon', 
      'rare': 'rare',
      'epic': 'ultra-rare',
      'legendary': 'legendary',
      'mythic': 'legendary'
    };
    
    return rarityMap[rarity.toLowerCase()] || null;
  }
  
  private generateTagsFromAnalysis(data: any, objects: string[]): string[] {
    const tags = new Set<string>();
    
    // Only add meaningful tags if analysis was successful
    if (!data.requiresManualReview && !data.error) {
      // Add category-based tags
      if (data.sport && data.sport !== 'Fantasy' && data.sport !== null) {
        tags.add(data.sport.toLowerCase());
      }
      
      // Add theme-based tags
      if (data.visualAnalysis?.theme && data.visualAnalysis.theme !== 'Unknown') {
        tags.add(data.visualAnalysis.theme.toLowerCase());
      }
      
      // Add detected objects as tags (filter out generic ones)
      objects.forEach(obj => {
        if (obj && 
            obj !== 'unknown' && 
            obj !== 'error' && 
            obj !== 'mysterious_entity' && 
            obj !== 'unique_creation' &&
            obj.length > 2) {
          tags.add(obj.toLowerCase().replace(/_/g, ' '));
        }
      });
      
      // Add mood and style tags
      if (data.visualAnalysis?.mood && data.visualAnalysis.mood !== 'Unknown') {
        tags.add(data.visualAnalysis.mood.toLowerCase());
      }
    }
    
    // If no meaningful tags were generated, add generic ones
    if (tags.size === 0) {
      tags.add('unidentified');
      tags.add('requires-review');
    }
    
    return Array.from(tags).slice(0, 6); // Limit to 6 tags
  }
  
  private getErrorResult(message: string): AnalysisResult {
    return {
      title: null,
      description: null,
      rarity: null,
      tags: ['error', 'requires-review'],
      confidence: 0,
      objects: ['error'],
      detectionMethod: 'failed',
      category: 'error',
      requiresManualReview: true,
      error: true,
      message: message
    };
  }
}

export const analysisOrchestrator = new AnalysisOrchestrator();
