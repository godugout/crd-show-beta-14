import { browserImageAnalyzer } from '@/services/browserImageAnalyzer';

export interface CardAnalysisResult {
  // Card Identification
  isCard: boolean;
  cardType: 'sports' | 'trading' | 'gaming' | 'custom' | 'unknown';
  sport?: string;
  league?: string;
  
  // Subject Analysis
  subject: {
    name?: string;
    type: 'person' | 'character' | 'object' | 'logo' | 'unknown';
    position?: string;
    team?: string;
    confidence: number;
  };
  
  // OCR Results
  text: {
    playerName?: string;
    teamName?: string;
    stats?: Record<string, string>;
    year?: string;
    cardNumber?: string;
    rarity?: string;
  };
  
  // Design Analysis
  design: {
    primaryColors: string[];
    mood: 'dynamic' | 'classic' | 'modern' | 'vintage' | 'futuristic';
    composition: 'action' | 'portrait' | 'landscape' | 'close-up';
    qualityScore: number;
  };
  
  // Enhancement Suggestions
  suggestions: {
    cropRect?: { x: number; y: number; width: number; height: number };
    backgroundRemoval?: boolean;
    colorCorrection?: boolean;
    sharpening?: boolean;
    frameStyle: string;
    effects: string[];
  };
  
  // Metadata
  metadata?: {
    realCardData?: {
      setName?: string;
      manufacturer?: string;
      estimatedValue?: string;
      rarity?: string;
    };
    confidence: number;
  };
}

class CardAnalysisService {
  async analyzeCardImage(imageUrl: string, file?: File): Promise<CardAnalysisResult> {
    console.log('🔍 Starting AI card analysis for:', imageUrl);
    
    try {
      // Get basic analysis from browser analyzer
      const basicAnalysis = await browserImageAnalyzer.analyzeImage(imageUrl);
      
      // Enhanced analysis with card-specific features
      const enhancedAnalysis = await this.performEnhancedAnalysis(imageUrl, file);
      
      const result: CardAnalysisResult = {
        isCard: this.detectIfCard(basicAnalysis.objects),
        cardType: this.determineCardType(basicAnalysis.objects, enhancedAnalysis.text),
        subject: {
          type: this.determineSubjectType(basicAnalysis.objects),
          confidence: basicAnalysis.confidence,
          name: enhancedAnalysis.text.playerName,
          team: enhancedAnalysis.text.teamName,
          position: enhancedAnalysis.extractedPosition
        },
        text: enhancedAnalysis.text,
        design: {
          primaryColors: await this.extractPrimaryColors(imageUrl),
          mood: this.analyzeMood(basicAnalysis.objects, basicAnalysis.tags),
          composition: this.analyzeComposition(basicAnalysis.objects),
          qualityScore: this.calculateQualityScore(basicAnalysis.confidence)
        },
        suggestions: {
          frameStyle: this.suggestFrameStyle(basicAnalysis.tags, enhancedAnalysis.text),
          effects: this.suggestEffects(basicAnalysis.rarity, enhancedAnalysis.extractedSport),
          backgroundRemoval: this.shouldRemoveBackground(basicAnalysis.objects),
          colorCorrection: this.needsColorCorrection(basicAnalysis.confidence),
          sharpening: this.needsSharpening(basicAnalysis.confidence)
        }
      };
      
      console.log('✅ Card analysis complete:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Card analysis failed:', error);
      return this.getFallbackAnalysis();
    }
  }
  
  private async performEnhancedAnalysis(imageUrl: string, file?: File) {
    // Simulate OCR and enhanced detection
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      text: {
        playerName: this.extractPlayerName(),
        teamName: this.extractTeamName(),
        stats: this.extractStats(),
        year: this.extractYear(),
        cardNumber: this.extractCardNumber(),
        rarity: this.extractRarity()
      },
      extractedSport: this.detectSport(),
      extractedPosition: this.detectPosition()
    };
  }
  
  private detectIfCard(objects: string[]): boolean {
    const cardKeywords = ['card', 'trading', 'player', 'athlete', 'sport', 'game'];
    return objects.some(obj => 
      cardKeywords.some(keyword => obj.toLowerCase().includes(keyword))
    );
  }
  
  private determineCardType(objects: string[], text: any): CardAnalysisResult['cardType'] {
    if (text.playerName || objects.includes('athlete')) return 'sports';
    if (objects.includes('character') || objects.includes('anime')) return 'gaming';
    if (objects.includes('card')) return 'trading';
    return 'custom';
  }
  
  private determineSubjectType(objects: string[]): CardAnalysisResult['subject']['type'] {
    if (objects.includes('person') || objects.includes('face')) return 'person';
    if (objects.includes('character')) return 'character';
    if (objects.includes('logo')) return 'logo';
    return 'unknown';
  }
  
  private async extractPrimaryColors(imageUrl: string): Promise<string[]> {
    // Simulate color extraction
    const colors = [
      '#1e40af', '#dc2626', '#059669', '#7c2d12', '#4c1d95'
    ];
    return colors.slice(0, Math.floor(Math.random() * 3) + 2);
  }
  
  private analyzeMood(objects: string[], tags: string[]): CardAnalysisResult['design']['mood'] {
    if (tags.includes('action') || objects.includes('sport')) return 'dynamic';
    if (tags.includes('vintage') || tags.includes('retro')) return 'vintage';
    if (tags.includes('modern') || tags.includes('clean')) return 'modern';
    if (tags.includes('futuristic') || tags.includes('sci-fi')) return 'futuristic';
    return 'classic';
  }
  
  private analyzeComposition(objects: string[]): CardAnalysisResult['design']['composition'] {
    if (objects.includes('action') || objects.includes('running')) return 'action';
    if (objects.includes('face') || objects.includes('portrait')) return 'portrait';
    if (objects.includes('landscape') || objects.includes('stadium')) return 'landscape';
    return 'close-up';
  }
  
  private calculateQualityScore(confidence: number): number {
    return Math.min(100, Math.max(0, confidence * 100));
  }
  
  private suggestFrameStyle(tags: string[], text: any): string {
    if (text.rarity === 'legendary' || tags.includes('rare')) return 'holographic';
    if (tags.includes('vintage')) return 'classic-wood';
    if (tags.includes('modern')) return 'sleek-metal';
    if (tags.includes('sport')) return 'sports-premium';
    return 'modern-clean';
  }
  
  private suggestEffects(rarity: string, sport?: string): string[] {
    const effects = [];
    
    if (rarity === 'legendary') effects.push('holographic', 'particle-burst');
    if (rarity === 'rare') effects.push('metallic-shine');
    if (sport === 'basketball') effects.push('flame-border');
    if (sport === 'football') effects.push('lightning-effects');
    
    effects.push('subtle-glow'); // Always add subtle glow
    return effects;
  }
  
  private shouldRemoveBackground(objects: string[]): boolean {
    return objects.includes('person') && !objects.includes('stadium');
  }
  
  private needsColorCorrection(confidence: number): boolean {
    return confidence < 0.7;
  }
  
  private needsSharpening(confidence: number): boolean {
    return confidence < 0.6;
  }
  
  // Mock extraction methods
  private extractPlayerName(): string | undefined {
    const names = ['Michael Jordan', 'LeBron James', 'Tom Brady', 'Connor McDavid', null];
    return names[Math.floor(Math.random() * names.length)] || undefined;
  }
  
  private extractTeamName(): string | undefined {
    const teams = ['Lakers', 'Bulls', 'Patriots', 'Rangers', null];
    return teams[Math.floor(Math.random() * teams.length)] || undefined;
  }
  
  private extractStats(): Record<string, string> {
    return {
      'PPG': '28.5',
      'RPG': '8.2',
      'APG': '6.1'
    };
  }
  
  private extractYear(): string | undefined {
    const years = ['1991', '2003', '2015', '2023', null];
    return years[Math.floor(Math.random() * years.length)] || undefined;
  }
  
  private extractCardNumber(): string | undefined {
    return Math.random() > 0.5 ? `#${Math.floor(Math.random() * 999) + 1}` : undefined;
  }
  
  private extractRarity(): string | undefined {
    const rarities = ['Common', 'Uncommon', 'Rare', 'Ultra Rare', 'Legendary'];
    return rarities[Math.floor(Math.random() * rarities.length)];
  }
  
  private detectSport(): string | undefined {
    const sports = ['basketball', 'football', 'baseball', 'hockey', 'soccer'];
    return sports[Math.floor(Math.random() * sports.length)];
  }
  
  private detectPosition(): string | undefined {
    const positions = ['Point Guard', 'Quarterback', 'Pitcher', 'Center', 'Forward'];
    return positions[Math.floor(Math.random() * positions.length)];
  }
  
  private getFallbackAnalysis(): CardAnalysisResult {
    return {
      isCard: true,
      cardType: 'custom',
      subject: {
        type: 'unknown',
        confidence: 0.5
      },
      text: {},
      design: {
        primaryColors: ['#1e40af', '#dc2626'],
        mood: 'modern',
        composition: 'portrait',
        qualityScore: 50
      },
      suggestions: {
        frameStyle: 'modern-clean',
        effects: ['subtle-glow'],
        backgroundRemoval: false,
        colorCorrection: true,
        sharpening: false
      }
    };
  }
}

export const cardAnalysisService = new CardAnalysisService();