
import { analysisOrchestrator } from './imageAnalysis/analysisOrchestrator';

export interface ImageAnalysisResult {
  objects: string[];
  confidence: number;
  analysisType: 'browser' | 'fallback';
  detectionMethod?: string;
  matchedKeywords?: string[];
  title: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary';
  tags: string[];
}

class BrowserImageAnalyzer {
  async analyzeImage(imageUrl: string): Promise<ImageAnalysisResult> {
    console.log('🔍 Browser analyzer using simplified Step 1 approach');
    const result = await analysisOrchestrator.analyzeImage(imageUrl);
    
    return {
      objects: result.objects,
      confidence: result.confidence,
      analysisType: 'browser' as const,
      detectionMethod: result.detectionMethod,
      matchedKeywords: result.matchedKeywords,
      title: result.title,
      description: result.description,
      rarity: result.rarity,
      tags: result.tags
    };
  }
}

export const browserImageAnalyzer = new BrowserImageAnalyzer();
