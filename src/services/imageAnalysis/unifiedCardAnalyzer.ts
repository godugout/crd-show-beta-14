
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UnifiedAnalysisResult {
  title: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  estimatedValue: number;
  confidence: number;
  category: string; // Added for compatibility
  type: string; // Added for compatibility
  playerName?: string;
  teamName?: string;
  year?: string;
  cardNumber?: string;
  manufacturer?: string;
  series?: string;
  condition?: 'poor' | 'fair' | 'good' | 'excellent' | 'mint';
  specialFeatures: string[];
  tags: string[];
  sources: {
    ocr: boolean;
    visual: boolean;
    webSearch: boolean;
    database: boolean;
  };
}

interface OCRResult {
  text: string;
  playerName?: string;
  teamName?: string;
  year?: string;
  cardNumber?: string;
  stats?: Record<string, string>;
}

interface VisualAnalysis {
  condition: 'poor' | 'fair' | 'good' | 'excellent' | 'mint';
  manufacturer?: string;
  specialFeatures: string[];
  colors: string[];
  layout: string;
}

interface ValueData {
  estimatedValue: number;
  priceRange: { min: number; max: number };
  marketTrend: 'rising' | 'stable' | 'declining';
  lastSaleDate?: string;
}

export class UnifiedCardAnalyzer {
  private async performOCR(imageUrl: string): Promise<OCRResult> {
    try {
      console.log('🔍 Starting OCR analysis...');
      
      const { data, error } = await supabase.functions.invoke('analyze-card-image', {
        body: { 
          imageData: imageUrl,
          analysisType: 'ocr'
        }
      });

      if (error) throw error;

      return {
        text: data.extractedText?.join(' ') || '',
        playerName: data.playerName,
        teamName: data.team,
        year: data.year,
        cardNumber: data.cardNumber,
        stats: data.stats || {}
      };
    } catch (error) {
      console.error('OCR analysis failed:', error);
      return { text: '' };
    }
  }

  private async performVisualAnalysis(imageUrl: string): Promise<VisualAnalysis> {
    try {
      console.log('👁️ Starting visual analysis...');
      
      const { data, error } = await supabase.functions.invoke('analyze-card-image', {
        body: { 
          imageData: imageUrl,
          analysisType: 'visual'
        }
      });

      if (error) throw error;

      const specialFeatures = [];
      if (data.visualAnalysis?.hasHologram) specialFeatures.push('hologram');
      if (data.visualAnalysis?.hasAutograph) specialFeatures.push('autograph');
      if (data.visualAnalysis?.hasRelic) specialFeatures.push('relic');
      if (data.visualAnalysis?.isVintage) specialFeatures.push('vintage');

      return {
        condition: this.assessCondition(data.visualAnalysis),
        manufacturer: data.visualAnalysis?.manufacturer,
        specialFeatures,
        colors: data.visualAnalysis?.dominantColors || [],
        layout: data.visualAnalysis?.layout || 'standard'
      };
    } catch (error) {
      console.error('Visual analysis failed:', error);
      return {
        condition: 'good',
        specialFeatures: [],
        colors: [],
        layout: 'standard'
      };
    }
  }

  private async performWebSearch(searchQuery: string): Promise<ValueData> {
    try {
      console.log('🌐 Starting web search for:', searchQuery);
      
      const { data, error } = await supabase.functions.invoke('web-scrape-card-analysis', {
        body: { 
          imageData: '',
          searchQuery: searchQuery
        }
      });

      if (error) throw error;

      return {
        estimatedValue: data.estimatedValue || 0,
        priceRange: data.priceRange || { min: 0, max: 0 },
        marketTrend: data.marketTrend || 'stable',
        lastSaleDate: data.lastSaleDate
      };
    } catch (error) {
      console.error('Web search failed:', error);
      return {
        estimatedValue: 0,
        priceRange: { min: 0, max: 0 },
        marketTrend: 'stable'
      };
    }
  }

  private async searchCardDatabase(playerName: string, year?: string, manufacturer?: string): Promise<any> {
    try {
      console.log('📚 Searching card database...');
      
      const { data, error } = await supabase.functions.invoke('search-card-info', {
        body: { 
          query: `${playerName} ${year || ''} ${manufacturer || ''}`.trim(),
          extractedData: { playerName, year, manufacturer }
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Database search failed:', error);
      return null;
    }
  }

  private assessCondition(visualData: any): 'poor' | 'fair' | 'good' | 'excellent' | 'mint' {
    const score = (visualData?.conditionScore || 70) / 100;
    
    if (score >= 0.9) return 'mint';
    if (score >= 0.8) return 'excellent';
    if (score >= 0.6) return 'good';
    if (score >= 0.4) return 'fair';
    return 'poor';
  }

  private determineRarityFromValue(value: number): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' {
    if (value >= 500) return 'legendary';
    if (value >= 100) return 'epic';
    if (value >= 20) return 'rare';
    if (value >= 5) return 'uncommon';
    return 'common';
  }

  private generateDescription(ocrResult: OCRResult, visualAnalysis: VisualAnalysis, valueData: ValueData, databaseInfo: any): string {
    const parts = [];
    
    if (ocrResult.playerName && ocrResult.teamName) {
      parts.push(`${ocrResult.playerName} baseball card featuring the ${ocrResult.teamName} player`);
    } else {
      parts.push('Baseball trading card');
    }

    if (ocrResult.year) {
      parts.push(`from ${ocrResult.year}`);
    }

    if (visualAnalysis.manufacturer) {
      parts.push(`by ${visualAnalysis.manufacturer}`);
    }

    if (visualAnalysis.condition !== 'good') {
      parts.push(`in ${visualAnalysis.condition} condition`);
    }

    if (visualAnalysis.specialFeatures.length > 0) {
      parts.push(`featuring ${visualAnalysis.specialFeatures.join(', ')}`);
    }

    if (valueData.estimatedValue > 0) {
      parts.push(`with an estimated value of $${valueData.estimatedValue.toFixed(2)}`);
    }

    return parts.join(' ') + '.';
  }

  async analyzeCard(imageUrl: string): Promise<UnifiedAnalysisResult> {
    console.log('🚀 Starting unified card analysis...');
    toast.info('Analyzing card with multiple methods...', { duration: 3000 });

    try {
      // Run all analyses in parallel
      const [ocrResult, visualAnalysis] = await Promise.all([
        this.performOCR(imageUrl),
        this.performVisualAnalysis(imageUrl)
      ]);

      // Create search query from OCR results
      const searchQuery = [ocrResult.playerName, ocrResult.teamName, ocrResult.year, 'baseball card']
        .filter(Boolean)
        .join(' ');

      // Run dependent analyses
      const [valueData, databaseInfo] = await Promise.all([
        this.performWebSearch(searchQuery),
        ocrResult.playerName ? this.searchCardDatabase(ocrResult.playerName, ocrResult.year, visualAnalysis.manufacturer) : Promise.resolve(null)
      ]);

      // Determine rarity based on estimated value
      const rarity = this.determineRarityFromValue(valueData.estimatedValue);

      // Calculate confidence score
      const confidence = this.calculateConfidence(ocrResult, visualAnalysis, valueData, databaseInfo);

      // Generate tags
      const tags = this.generateTags(ocrResult, visualAnalysis, valueData);

      const result: UnifiedAnalysisResult = {
        title: ocrResult.playerName 
          ? `${ocrResult.playerName}${ocrResult.year ? ` ${ocrResult.year}` : ''} Baseball Card`
          : 'Baseball Trading Card',
        description: this.generateDescription(ocrResult, visualAnalysis, valueData, databaseInfo),
        rarity,
        estimatedValue: valueData.estimatedValue,
        confidence,
        category: 'Baseball Card', // Added for compatibility
        type: 'Sports Card', // Added for compatibility
        playerName: ocrResult.playerName,
        teamName: ocrResult.teamName,
        year: ocrResult.year,
        cardNumber: ocrResult.cardNumber,
        manufacturer: visualAnalysis.manufacturer,
        series: databaseInfo?.cardInfo?.series || 'Unknown Series',
        condition: visualAnalysis.condition,
        specialFeatures: visualAnalysis.specialFeatures,
        tags,
        sources: {
          ocr: !!ocrResult.text,
          visual: true,
          webSearch: valueData.estimatedValue > 0,
          database: !!databaseInfo
        }
      };

      console.log('✅ Unified analysis complete:', result);
      toast.success('Card analysis complete! All details have been populated.');
      
      return result;

    } catch (error) {
      console.error('Unified analysis failed:', error);
      toast.error('Analysis failed, but you can still fill details manually.');
      
      return {
        title: 'Baseball Trading Card',
        description: 'A baseball trading card with unique characteristics.',
        rarity: 'common',
        estimatedValue: 0,
        confidence: 0.1,
        category: 'Baseball Card', // Added for compatibility
        type: 'Sports Card', // Added for compatibility
        specialFeatures: [],
        tags: ['baseball', 'trading-card'],
        sources: {
          ocr: false,
          visual: false,
          webSearch: false,
          database: false
        }
      };
    }
  }

  private calculateConfidence(ocr: OCRResult, visual: VisualAnalysis, value: ValueData, database: any): number {
    let score = 0;
    let maxScore = 0;

    // OCR confidence
    maxScore += 30;
    if (ocr.playerName) score += 15;
    if (ocr.teamName) score += 10;
    if (ocr.year) score += 5;

    // Visual analysis confidence
    maxScore += 25;
    if (visual.manufacturer) score += 10;
    if (visual.specialFeatures.length > 0) score += 10;
    if (visual.condition !== 'good') score += 5;

    // Value data confidence
    maxScore += 25;
    if (value.estimatedValue > 0) score += 20;
    if (value.priceRange.max > value.priceRange.min) score += 5;

    // Database match confidence
    maxScore += 20;
    if (database?.cardInfo) score += 20;

    return Math.min(1, score / maxScore);
  }

  private generateTags(ocr: OCRResult, visual: VisualAnalysis, value: ValueData): string[] {
    const tags = new Set<string>();
    
    tags.add('baseball');
    tags.add('trading-card');
    
    if (ocr.teamName) tags.add(ocr.teamName.toLowerCase());
    if (ocr.year) {
      tags.add(ocr.year);
      const decade = Math.floor(parseInt(ocr.year) / 10) * 10;
      tags.add(`${decade}s`);
    }
    
    if (visual.manufacturer) tags.add(visual.manufacturer.toLowerCase());
    visual.specialFeatures.forEach(feature => tags.add(feature));
    
    if (visual.condition === 'mint' || visual.condition === 'excellent') {
      tags.add('high-grade');
    }
    
    if (value.estimatedValue > 100) tags.add('valuable');
    if (value.estimatedValue > 500) tags.add('investment-grade');
    
    return Array.from(tags).slice(0, 8);
  }
}

export const unifiedCardAnalyzer = new UnifiedCardAnalyzer();
