import { supabase } from '@/integrations/supabase/client';
import { browserImageAnalyzer } from '../browserImageAnalyzer';
import { CardAnalysisResult } from './cardAnalysisService';

// Sport keywords and their associated stats
const SPORT_KEYWORDS = {
  basketball: {
    keywords: [
      'dunk',
      'slam',
      'hoop',
      'basketball',
      'nba',
      'court',
      'layup',
      'three-pointer',
      'rebound',
    ],
    stats: ['Points', 'Rebounds', 'Assists', 'Steals', 'Blocks', 'FG%'],
  },
  football: {
    keywords: [
      'touchdown',
      'tackle',
      'football',
      'nfl',
      'field',
      'pass',
      'rush',
      'catch',
    ],
    stats: [
      'Passing Yards',
      'Touchdowns',
      'Completions',
      'Rushing Yards',
      'Receptions',
    ],
  },
  soccer: {
    keywords: [
      'goal',
      'kick',
      'soccer',
      'football',
      'pitch',
      'header',
      'penalty',
    ],
    stats: ['Goals', 'Assists', 'Shots', 'Passes', 'Tackles', 'Clean Sheets'],
  },
  baseball: {
    keywords: [
      'home run',
      'pitch',
      'baseball',
      'mlb',
      'diamond',
      'swing',
      'catch',
    ],
    stats: ['Batting Average', 'Home Runs', 'RBI', 'ERA', 'Strikeouts', 'Wins'],
  },
};

// Era style mappings
const ERA_STYLES = {
  '50s': {
    filter: 'sepia',
    typography: 'vintage',
    effects: ['grainy', 'faded'],
  },
  '60s': {
    filter: 'warm',
    typography: 'bold',
    effects: ['psychedelic', 'colorful'],
  },
  '70s': { filter: 'retro', typography: 'groovy', effects: ['disco', 'neon'] },
  '80s': {
    filter: 'vibrant',
    typography: 'digital',
    effects: ['synthwave', 'chrome'],
  },
  '90s': {
    filter: 'saturated',
    typography: 'extreme',
    effects: ['holographic', 'metallic'],
  },
  '2000s': {
    filter: 'glossy',
    typography: 'modern',
    effects: ['gradient', 'shine'],
  },
};

// Emotion to effect mapping
const EMOTION_EFFECTS = {
  excitement: ['fire', 'lightning', 'explosion'],
  power: ['shatter', 'impact', 'force'],
  speed: ['blur', 'streak', 'trail'],
  elegance: ['sparkle', 'glow', 'smooth'],
  victory: ['confetti', 'crown', 'gold'],
  intensity: ['rage', 'storm', 'energy'],
};

export interface EnhancedAnalysisResult extends CardAnalysisResult {
  sport?: {
    detected: string;
    confidence: number;
    suggestedStats: string[];
    action: string;
  };
  era?: {
    decade: string;
    style: (typeof ERA_STYLES)[keyof typeof ERA_STYLES];
    confidence: number;
  };
  emotion?: {
    primary: string;
    secondary: string[];
    suggestedEffects: string[];
  };
  composition?: {
    ruleOfThirds: boolean;
    subjectPosition: { x: number; y: number };
    textSafeAreas: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
    }>;
    backgroundExtensionNeeded: boolean;
    suggestedCrop?: { x: number; y: number; width: number; height: number };
  };
  voiceInterpretation?: {
    intent: string;
    extractedStats: Record<string, number>;
    suggestedEffects: string[];
    confidence: number;
  };
}

export class EnhancedCardAnalysisService {
  async analyzeWithContext(
    imageUrl: string,
    file?: File,
    voiceTranscript?: string
  ): Promise<EnhancedAnalysisResult> {
    console.log('🧠 Starting enhanced AI analysis with context...');

    try {
      // Get base analysis
      const basicAnalysis = await browserImageAnalyzer.analyzeImage(imageUrl);

      // Perform all enhanced analyses in parallel
      const [
        sportAnalysis,
        eraAnalysis,
        emotionAnalysis,
        compositionAnalysis,
        voiceAnalysis,
      ] = await Promise.all([
        this.detectSport(basicAnalysis, voiceTranscript),
        this.detectEra(basicAnalysis, imageUrl),
        this.analyzeEmotion(basicAnalysis),
        this.analyzeComposition(imageUrl),
        voiceTranscript
          ? this.interpretVoiceCommand(voiceTranscript, basicAnalysis)
          : null,
      ]);

      // Call edge function for advanced AI analysis
      const { data: aiData } = await supabase.functions.invoke(
        'analyze-card-ai',
        {
          body: {
            imageUrl,
            transcript: voiceTranscript,
            contextualData: {
              sport: sportAnalysis,
              era: eraAnalysis,
              emotion: emotionAnalysis,
            },
          },
        }
      );

      const result: EnhancedAnalysisResult = {
        ...this.buildBaseAnalysis(basicAnalysis, aiData),
        sport: sportAnalysis,
        era: eraAnalysis,
        emotion: emotionAnalysis,
        composition: compositionAnalysis,
        voiceInterpretation: voiceAnalysis,
      };

      console.log('✅ Enhanced analysis complete:', result);
      return result;
    } catch (error) {
      console.error('❌ Enhanced analysis failed:', error);
      throw error;
    }
  }

  private async detectSport(
    basicAnalysis: any,
    transcript?: string
  ): Promise<EnhancedAnalysisResult['sport']> {
    const allText = [
      ...(basicAnalysis.objects || []),
      ...(basicAnalysis.tags || []),
      transcript?.toLowerCase() || '',
    ]
      .join(' ')
      .toLowerCase();

    for (const [sport, config] of Object.entries(SPORT_KEYWORDS)) {
      const matches = config.keywords.filter(keyword =>
        allText.includes(keyword)
      );

      if (matches.length > 0) {
        // Detect specific action
        const action = matches[0];

        return {
          detected: sport,
          confidence: Math.min(matches.length * 0.3, 1),
          suggestedStats: config.stats,
          action,
        };
      }
    }

    return undefined;
  }

  private async detectEra(
    basicAnalysis: any,
    imageUrl: string
  ): Promise<EnhancedAnalysisResult['era']> {
    // Simple era detection based on visual style
    const tags = basicAnalysis.tags || [];

    for (const [decade, style] of Object.entries(ERA_STYLES)) {
      const eraKeywords = [
        decade,
        decade.slice(0, 2),
        'vintage',
        'retro',
        'classic',
      ];
      const matches = tags.filter((tag: string) =>
        eraKeywords.some(keyword => tag.toLowerCase().includes(keyword))
      );

      if (matches.length > 0) {
        return {
          decade,
          style,
          confidence: 0.7,
        };
      }
    }

    return undefined;
  }

  private async analyzeEmotion(
    basicAnalysis: any
  ): Promise<EnhancedAnalysisResult['emotion']> {
    const emotionKeywords = {
      excitement: ['dynamic', 'action', 'explosive', 'energetic'],
      power: ['strong', 'powerful', 'dominant', 'force'],
      speed: ['fast', 'quick', 'rapid', 'swift'],
      elegance: ['graceful', 'smooth', 'elegant', 'refined'],
      victory: ['winning', 'champion', 'victory', 'triumph'],
      intensity: ['intense', 'fierce', 'aggressive', 'passionate'],
    };

    const allTags = [
      ...(basicAnalysis.tags || []),
      ...(basicAnalysis.objects || []),
    ];
    const detectedEmotions: Array<[string, number]> = [];

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const matches = keywords.filter(keyword =>
        allTags.some((tag: string) => tag.toLowerCase().includes(keyword))
      );

      if (matches.length > 0) {
        detectedEmotions.push([emotion, matches.length]);
      }
    }

    if (detectedEmotions.length === 0) {
      return {
        primary: 'excitement',
        secondary: [],
        suggestedEffects: EMOTION_EFFECTS.excitement,
      };
    }

    // Sort by match count
    detectedEmotions.sort((a, b) => b[1] - a[1]);
    const primary = detectedEmotions[0][0];

    return {
      primary,
      secondary: detectedEmotions.slice(1).map(e => e[0]),
      suggestedEffects:
        EMOTION_EFFECTS[primary as keyof typeof EMOTION_EFFECTS] || [],
    };
  }

  private async analyzeComposition(
    imageUrl: string
  ): Promise<EnhancedAnalysisResult['composition']> {
    // Create image element for analysis
    const img = new Image();
    img.crossOrigin = 'anonymous';

    return new Promise(resolve => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Simple rule of thirds detection
        const thirds = {
          vertical: [canvas.width / 3, (canvas.width * 2) / 3],
          horizontal: [canvas.height / 3, (canvas.height * 2) / 3],
        };

        // Detect if image needs extension (not 3:4 ratio)
        const aspectRatio = canvas.width / canvas.height;
        const targetRatio = 3 / 4;
        const needsExtension = Math.abs(aspectRatio - targetRatio) > 0.1;

        // Calculate text safe areas (avoiding center and edges)
        const padding = Math.min(canvas.width, canvas.height) * 0.1;
        const textSafeAreas = [
          {
            x: padding,
            y: padding,
            width: canvas.width * 0.3,
            height: canvas.height * 0.2,
          },
          {
            x: canvas.width - padding - canvas.width * 0.3,
            y: padding,
            width: canvas.width * 0.3,
            height: canvas.height * 0.2,
          },
          {
            x: padding,
            y: canvas.height - padding - canvas.height * 0.15,
            width: canvas.width - padding * 2,
            height: canvas.height * 0.15,
          },
        ];

        resolve({
          ruleOfThirds: true, // Simplified for now
          subjectPosition: { x: canvas.width / 2, y: canvas.height / 2 },
          textSafeAreas,
          backgroundExtensionNeeded: needsExtension,
          suggestedCrop: needsExtension
            ? {
                x: 0,
                y: 0,
                width: canvas.width,
                height: canvas.width / targetRatio,
              }
            : undefined,
        });
      };

      img.onerror = () => {
        resolve({
          ruleOfThirds: false,
          subjectPosition: { x: 0.5, y: 0.5 },
          textSafeAreas: [],
          backgroundExtensionNeeded: false,
        });
      };

      img.src = imageUrl;
    });
  }

  private async interpretVoiceCommand(
    transcript: string,
    basicAnalysis: any
  ): Promise<EnhancedAnalysisResult['voiceInterpretation']> {
    const lower = transcript.toLowerCase();

    // Extract stats from natural language
    const statPatterns = [
      { pattern: /(\d+)\s*points?/i, stat: 'points' },
      { pattern: /(\d+)\s*rebounds?/i, stat: 'rebounds' },
      { pattern: /(\d+)\s*assists?/i, stat: 'assists' },
      { pattern: /(\d+)\s*goals?/i, stat: 'goals' },
      { pattern: /(\d+)\s*touchdowns?/i, stat: 'touchdowns' },
      { pattern: /(\d+)\s*home\s*runs?/i, stat: 'homeRuns' },
    ];

    const extractedStats: Record<string, number> = {};

    for (const { pattern, stat } of statPatterns) {
      const match = transcript.match(pattern);
      if (match) {
        extractedStats[stat] = parseInt(match[1]);
      }
    }

    // Extract effect requests
    const effectKeywords = [
      'holographic',
      'fire',
      'lightning',
      'gold',
      'chrome',
      'rainbow',
      'epic',
    ];
    const suggestedEffects = effectKeywords.filter(effect =>
      lower.includes(effect)
    );

    // Determine intent
    let intent = 'create';
    if (lower.includes('make it more')) intent = 'enhance';
    if (lower.includes('add')) intent = 'add_feature';
    if (lower.includes('change')) intent = 'modify';

    return {
      intent,
      extractedStats,
      suggestedEffects,
      confidence:
        Object.keys(extractedStats).length > 0 || suggestedEffects.length > 0
          ? 0.8
          : 0.5,
    };
  }

  private buildBaseAnalysis(
    basicAnalysis: any,
    aiData: any
  ): CardAnalysisResult {
    return {
      isCard: true,
      cardType: aiData?.cardType || 'sports',
      subject: {
        type: aiData?.subjectType || 'player',
        confidence: aiData?.confidence || 0.8,
        name: aiData?.playerName || basicAnalysis.title,
        team: aiData?.teamName,
        position: aiData?.position,
      },
      text: {
        playerName: aiData?.playerName,
        teamName: aiData?.teamName,
        year: aiData?.year,
        manufacturer: aiData?.manufacturer,
        series: aiData?.series,
        rarity: aiData?.rarity || 'common',
      },
      design: {
        primaryColors: aiData?.colors || [],
        mood: aiData?.mood || 'dynamic',
        composition: aiData?.composition || 'centered',
        qualityScore: aiData?.qualityScore || 0.85,
      },
      suggestions: {
        frameStyle: aiData?.frameStyle || 'modern',
        effects: aiData?.effects || [],
        backgroundRemoval: aiData?.backgroundRemoval || false,
        colorCorrection: aiData?.colorCorrection || false,
        sharpening: aiData?.sharpening || false,
      },
    };
  }

  // Smart color scheme generation
  async generateComplementaryColors(imageUrl: string): Promise<string[]> {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      return new Promise(resolve => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          canvas.width = 50; // Small size for color sampling
          canvas.height = 50;
          ctx.drawImage(img, 0, 0, 50, 50);

          const imageData = ctx.getImageData(0, 0, 50, 50);
          const pixels = imageData.data;

          // Simple color extraction
          const colorCounts: Record<string, number> = {};

          for (let i = 0; i < pixels.length; i += 4) {
            const r = Math.round(pixels[i] / 51) * 51;
            const g = Math.round(pixels[i + 1] / 51) * 51;
            const b = Math.round(pixels[i + 2] / 51) * 51;
            const color = `rgb(${r},${g},${b})`;
            colorCounts[color] = (colorCounts[color] || 0) + 1;
          }

          // Get dominant colors
          const sortedColors = Object.entries(colorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([color]) => color);

          resolve(sortedColors);
        };

        img.onerror = () => {
          resolve(['#1a1a1a', '#ffffff', '#0ea5e9', '#8b5cf6']);
        };

        img.src = imageUrl;
      });
    } catch (error) {
      console.error('Color extraction failed:', error);
      return ['#1a1a1a', '#ffffff', '#0ea5e9', '#8b5cf6'];
    }
  }
}

export const enhancedCardAnalysisService = new EnhancedCardAnalysisService();
