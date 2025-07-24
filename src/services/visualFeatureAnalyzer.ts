
import { pipeline } from '@huggingface/transformers';

export interface VisualFeatures {
  dominantColors: string[];
  figureType: 'humanoid' | 'quadruped' | 'object' | 'unknown';
  texturePatterns: string[];
  sizeCategory: 'small' | 'medium' | 'large' | 'unknown';
  postureType: 'standing' | 'sitting' | 'lying' | 'action' | 'unknown';
  facialFeatures: string[];
  bodyProportions: {
    isHumanoid: boolean;
    isTall: boolean;
    isBroad: boolean;
  };
}

export interface EnhancedDetectionResult {
  primaryObjects: string[];
  visualFeatures: VisualFeatures;
  characterArchetype: string | null;
  confidence: number;
  reasoningPath: string[];
}

class VisualFeatureAnalyzer {
  private colorAnalyzer: any = null;

  async initialize() {
    try {
      console.log('Initializing visual feature analysis...');
      
      // Use a simpler, more reliable model
      this.colorAnalyzer = await pipeline(
        'image-classification',
        'microsoft/resnet-50'
      );
      
      console.log('Visual feature analyzer ready!');
    } catch (error) {
      console.warn('Visual feature analyzer initialization failed:', error);
    }
  }

  async analyzeImage(imageUrl: string): Promise<EnhancedDetectionResult> {
    await this.initialize();
    
    try {
      // Run basic object detection
      const objectResults = await this.detectObjects(imageUrl);
      console.log('Object detection results:', objectResults);
      
      // Enhanced pattern analysis
      const visualFeatures = this.extractVisualFeatures(objectResults);
      const characterArchetype = this.identifyCharacterArchetype(objectResults, visualFeatures);
      
      const result = {
        primaryObjects: objectResults.map(r => r.label),
        visualFeatures,
        characterArchetype,
        confidence: this.calculateConfidence(objectResults, visualFeatures, characterArchetype),
        reasoningPath: this.buildReasoningPath(objectResults, visualFeatures, characterArchetype)
      };
      
      console.log('Enhanced analysis result:', result);
      return result;
    } catch (error) {
      console.warn('Enhanced analysis failed, using fallback:', error);
      return this.createFallbackResult();
    }
  }

  private async detectObjects(imageUrl: string) {
    if (!this.colorAnalyzer) {
      return [{ label: 'unknown', score: 0.5 }];
    }
    
    try {
      const results = await this.colorAnalyzer(imageUrl);
      console.log('Raw object detection:', results);
      return results.filter((r: any) => r.score > 0.05).slice(0, 15);
    } catch (error) {
      console.warn('Object detection failed:', error);
      return [{ label: 'unknown', score: 0.5 }];
    }
  }

  private extractVisualFeatures(objectResults: any[]): VisualFeatures {
    const labels = objectResults.map(r => r.label.toLowerCase());
    console.log('Analyzing labels for visual features:', labels);
    
    return {
      dominantColors: this.identifyColors(labels),
      figureType: this.determineFigureType(labels),
      texturePatterns: this.identifyTextures(labels),
      sizeCategory: this.determineSizeCategory(labels),
      postureType: this.determinePosture(labels),
      facialFeatures: this.identifyFacialFeatures(labels),
      bodyProportions: {
        isHumanoid: this.isHumanoidFigure(labels),
        isTall: this.isTallFigure(labels),
        isBroad: this.isBroadFigure(labels)
      }
    };
  }

  private identifyColors(labels: string[]): string[] {
    const colorMap: { [key: string]: string[] } = {
      'brown': ['brown', 'chestnut', 'tan', 'sepia', 'chocolate', 'coffee', 'russet'],
      'black': ['black', 'dark', 'ebony', 'coal', 'onyx'],
      'white': ['white', 'cream', 'ivory', 'pearl', 'snow'],
      'gray': ['gray', 'grey', 'silver', 'ash', 'steel'],
      'golden': ['golden', 'yellow', 'amber', 'honey', 'blonde']
    };
    
    const colors: string[] = [];
    Object.entries(colorMap).forEach(([color, keywords]) => {
      if (labels.some(label => keywords.some(kw => label.includes(kw)))) {
        colors.push(color);
      }
    });
    
    return colors.length > 0 ? colors : ['mixed'];
  }

  private determineFigureType(labels: string[]): VisualFeatures['figureType'] {
    const humanoidKeywords = ['person', 'human', 'man', 'woman', 'humanoid', 'figure', 'character', 'people', 'individual', 'being', 'primate'];
    const quadrupedKeywords = ['dog', 'cat', 'horse', 'bear', 'animal', 'mammal', 'creature', 'beast'];
    
    if (labels.some(label => humanoidKeywords.some(kw => label.includes(kw)))) {
      return 'humanoid';
    }
    if (labels.some(label => quadrupedKeywords.some(kw => label.includes(kw)))) {
      return 'quadruped';
    }
    return 'unknown';
  }

  private identifyTextures(labels: string[]): string[] {
    const textureMap: { [key: string]: string[] } = {
      'furry': ['fur', 'hairy', 'fuzzy', 'fluffy', 'woolly', 'shaggy', 'bushy', 'hirsute'],
      'smooth': ['smooth', 'sleek', 'polished', 'glossy'],
      'rough': ['rough', 'coarse', 'textured', 'rugged'],
      'scaly': ['scale', 'reptile', 'scaly', 'lizard']
    };
    
    const textures: string[] = [];
    Object.entries(textureMap).forEach(([texture, keywords]) => {
      if (labels.some(label => keywords.some(kw => label.includes(kw)))) {
        textures.push(texture);
      }
    });
    
    return textures;
  }

  private determineSizeCategory(labels: string[]): VisualFeatures['sizeCategory'] {
    const sizeKeywords = {
      large: ['large', 'big', 'huge', 'giant', 'massive', 'tall', 'enormous', 'immense'],
      small: ['small', 'tiny', 'little', 'miniature', 'petite'],
      medium: ['medium', 'average', 'normal', 'regular']
    };
    
    for (const [size, keywords] of Object.entries(sizeKeywords)) {
      if (labels.some(label => keywords.some(kw => label.includes(kw)))) {
        return size as VisualFeatures['sizeCategory'];
      }
    }
    return 'unknown';
  }

  private determinePosture(labels: string[]): VisualFeatures['postureType'] {
    const postureKeywords = {
      standing: ['standing', 'upright', 'erect', 'vertical'],
      sitting: ['sitting', 'seated', 'crouching', 'squatting'],
      lying: ['lying', 'prone', 'resting', 'horizontal'],
      action: ['running', 'jumping', 'moving', 'walking', 'dancing']
    };
    
    for (const [posture, keywords] of Object.entries(postureKeywords)) {
      if (labels.some(label => keywords.some(kw => label.includes(kw)))) {
        return posture as VisualFeatures['postureType'];
      }
    }
    
    return 'standing'; // Default assumption
  }

  private identifyFacialFeatures(labels: string[]): string[] {
    const facialFeatures: string[] = [];
    const featureKeywords = {
      'bearded': ['beard', 'facial hair', 'whiskers'],
      'long-haired': ['long hair', 'mane', 'flowing'],
      'expressive': ['eyes', 'face', 'expression', 'smile', 'frown']
    };
    
    Object.entries(featureKeywords).forEach(([feature, keywords]) => {
      if (labels.some(label => keywords.some(kw => label.includes(kw)))) {
        facialFeatures.push(feature);
      }
    });
    
    return facialFeatures;
  }

  private isHumanoidFigure(labels: string[]): boolean {
    const humanoidKeywords = ['person', 'human', 'humanoid', 'figure', 'character', 'people', 'individual', 'being', 'primate', 'anthropomorphic'];
    return labels.some(label => humanoidKeywords.some(kw => label.includes(kw)));
  }

  private isTallFigure(labels: string[]): boolean {
    const tallKeywords = ['tall', 'large', 'big', 'giant', 'towering', 'massive', 'huge', 'enormous'];
    return labels.some(label => tallKeywords.some(kw => label.includes(kw)));
  }

  private isBroadFigure(labels: string[]): boolean {
    const broadKeywords = ['broad', 'wide', 'muscular', 'stocky', 'bulky', 'robust', 'hefty'];
    return labels.some(label => broadKeywords.some(kw => label.includes(kw)));
  }

  private identifyCharacterArchetype(objectResults: any[], visualFeatures: VisualFeatures): string | null {
    const { dominantColors, figureType, texturePatterns, bodyProportions } = visualFeatures;
    const labels = objectResults.map(r => r.label.toLowerCase());
    
    console.log('Character archetype analysis:', {
      labels,
      figureType,
      texturePatterns,
      dominantColors,
      bodyProportions
    });
    
    // Enhanced Wookie detection with multiple patterns
    const wookiePatterns = [
      // Direct matches
      labels.some(l => l.includes('wookiee') || l.includes('chewbacca')),
      
      // Pattern 1: Furry humanoid with brown colors
      figureType === 'humanoid' && 
      texturePatterns.includes('furry') &&
      dominantColors.some(color => ['brown', 'golden'].includes(color)),
      
      // Pattern 2: Large hairy primate-like being
      (labels.some(l => ['primate', 'ape', 'gorilla', 'orangutan'].some(kw => l.includes(kw))) ||
       bodyProportions.isHumanoid) &&
      texturePatterns.includes('furry') &&
      bodyProportions.isTall,
      
      // Pattern 3: Bear-like humanoid
      labels.some(l => l.includes('bear')) && 
      figureType === 'humanoid',
      
      // Pattern 4: Any furry tall humanoid with brown coloring
      figureType === 'humanoid' &&
      texturePatterns.includes('furry') &&
      bodyProportions.isTall &&
      dominantColors.includes('brown'),
      
      // Pattern 5: Generic "creature" or "being" with right characteristics
      labels.some(l => ['creature', 'being', 'monster', 'beast'].some(kw => l.includes(kw))) &&
      texturePatterns.includes('furry') &&
      bodyProportions.isHumanoid
    ];
    
    if (wookiePatterns.some(pattern => pattern)) {
      console.log('🎯 WOOKIE DETECTED! Matching patterns:', wookiePatterns.map((p, i) => p ? i+1 : null).filter(Boolean));
      return 'wookiee';
    }
    
    // Bear-like creature detection
    if (texturePatterns.includes('furry') && 
        (dominantColors.includes('brown') || labels.some(l => l.includes('bear'))) &&
        bodyProportions.isBroad) {
      return 'bear-creature';
    }
    
    // Humanoid warrior detection
    if (figureType === 'humanoid' && 
        bodyProportions.isTall &&
        !texturePatterns.includes('furry')) {
      return 'humanoid-warrior';
    }
    
    return null;
  }

  private calculateConfidence(objectResults: any[], visualFeatures: VisualFeatures, characterArchetype: string | null): number {
    let confidence = 0.3; // Lower base confidence
    
    // Major boost for character archetype matches
    if (characterArchetype === 'wookiee') {
      confidence += 0.5; // Big boost for Wookie detection
    } else if (characterArchetype) {
      confidence += 0.3;
    }
    
    // Boost for clear visual patterns
    if (visualFeatures.texturePatterns.length > 0) {
      confidence += 0.1;
    }
    
    if (visualFeatures.figureType !== 'unknown') {
      confidence += 0.1;
    }
    
    // Consider object detection quality
    const avgObjectConfidence = objectResults.length > 0 ? 
      objectResults.reduce((sum, r) => sum + r.score, 0) / objectResults.length : 0.3;
    confidence = (confidence + avgObjectConfidence) / 2;
    
    return Math.min(confidence, 0.95); // Cap at 95%
  }

  private buildReasoningPath(objectResults: any[], visualFeatures: VisualFeatures, characterArchetype: string | null): string[] {
    const reasoning: string[] = [];
    
    reasoning.push(`Detected objects: ${objectResults.map(r => `${r.label} (${(r.score * 100).toFixed(1)}%)`).join(', ')}`);
    reasoning.push(`Figure type: ${visualFeatures.figureType}`);
    reasoning.push(`Dominant colors: ${visualFeatures.dominantColors.join(', ')}`);
    reasoning.push(`Texture patterns: ${visualFeatures.texturePatterns.join(', ') || 'none detected'}`);
    reasoning.push(`Body proportions: humanoid=${visualFeatures.bodyProportions.isHumanoid}, tall=${visualFeatures.bodyProportions.isTall}, broad=${visualFeatures.bodyProportions.isBroad}`);
    
    if (characterArchetype) {
      reasoning.push(`🎯 Character archetype identified: ${characterArchetype}`);
    } else {
      reasoning.push('No specific character archetype identified');
    }
    
    return reasoning;
  }

  private createFallbackResult(): EnhancedDetectionResult {
    return {
      primaryObjects: ['unknown entity'],
      visualFeatures: {
        dominantColors: ['mixed'],
        figureType: 'unknown',
        texturePatterns: [],
        sizeCategory: 'unknown',
        postureType: 'unknown',
        facialFeatures: [],
        bodyProportions: {
          isHumanoid: false,
          isTall: false,
          isBroad: false
        }
      },
      characterArchetype: null,
      confidence: 0.3,
      reasoningPath: ['Fallback analysis due to detection failure']
    };
  }
}

export const visualFeatureAnalyzer = new VisualFeatureAnalyzer();
