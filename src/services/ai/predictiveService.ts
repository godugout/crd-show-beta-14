interface UserPreference {
  sports: string[];
  styles: string[];
  rarities: string[];
  teams: string[];
  colors: string[];
  effectsUsed: string[];
  creationPatterns: {
    timeOfDay: string[];
    frequency: number;
    avgSessionLength: number;
  };
  lastActions: Array<{
    action: string;
    timestamp: number;
    context: any;
  }>;
}

interface PredictiveRecommendation {
  type: 'style' | 'effect' | 'template' | 'collection' | 'card_suggestion';
  confidence: number;
  reason: string;
  data: any;
  priority: 'high' | 'medium' | 'low';
}

interface CollectionSuggestion {
  name: string;
  theme: string;
  suggestedCards: Array<{
    sport: string;
    style: string;
    description: string;
  }>;
  completionBonus: string;
}

class PredictiveService {
  private userPreferences: UserPreference;
  private actionHistory: Array<any> = [];
  private preloadQueue: Map<string, Promise<any>> = new Map();
  private learningModel: any = null;

  constructor() {
    this.userPreferences = this.loadUserPreferences();
    this.initializeLearningModel();
  }

  private loadUserPreferences(): UserPreference {
    const stored = localStorage.getItem('crdmkr-user-preferences');
    if (stored) {
      return JSON.parse(stored);
    }

    return {
      sports: [],
      styles: [],
      rarities: [],
      teams: [],
      colors: [],
      effectsUsed: [],
      creationPatterns: {
        timeOfDay: [],
        frequency: 0,
        avgSessionLength: 0
      },
      lastActions: []
    };
  }

  private saveUserPreferences() {
    localStorage.setItem('crdmkr-user-preferences', JSON.stringify(this.userPreferences));
  }

  private initializeLearningModel() {
    // Simplified ML model for pattern recognition
    this.learningModel = {
      weights: new Map(),
      features: new Map(),
      
      train: (features: any[], label: string) => {
        features.forEach(feature => {
          const key = `${feature.type}:${feature.value}`;
          if (!this.learningModel.weights.has(key)) {
            this.learningModel.weights.set(key, new Map());
          }
          const labelWeights = this.learningModel.weights.get(key);
          labelWeights.set(label, (labelWeights.get(label) || 0) + 1);
        });
      },
      
      predict: (features: any[]) => {
        const scores = new Map();
        features.forEach(feature => {
          const key = `${feature.type}:${feature.value}`;
          const weights = this.learningModel.weights.get(key);
          if (weights) {
            weights.forEach((weight, label) => {
              scores.set(label, (scores.get(label) || 0) + weight);
            });
          }
        });
        return Array.from(scores.entries())
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5);
      }
    };

    console.log('🧠 Predictive learning model initialized');
  }

  // Learn from user actions
  recordUserAction(action: string, context: any) {
    const timestamp = Date.now();
    const actionData = { action, timestamp, context };
    
    this.actionHistory.push(actionData);
    this.userPreferences.lastActions.unshift(actionData);
    this.userPreferences.lastActions = this.userPreferences.lastActions.slice(0, 50);

    // Update preferences based on action
    this.updatePreferencesFromAction(action, context);
    
    // Train the model
    const features = this.extractFeatures(context);
    this.learningModel.train(features, action);

    this.saveUserPreferences();
    
    console.log('📈 Learned from user action:', action, context);
  }

  private updatePreferencesFromAction(action: string, context: any) {
    if (context.sport && !this.userPreferences.sports.includes(context.sport)) {
      this.userPreferences.sports.push(context.sport);
    }
    
    if (context.style && !this.userPreferences.styles.includes(context.style)) {
      this.userPreferences.styles.push(context.style);
    }
    
    if (context.rarity && !this.userPreferences.rarities.includes(context.rarity)) {
      this.userPreferences.rarities.push(context.rarity);
    }
    
    if (context.team && !this.userPreferences.teams.includes(context.team)) {
      this.userPreferences.teams.push(context.team);
    }
    
    if (context.effects) {
      context.effects.forEach((effect: string) => {
        if (!this.userPreferences.effectsUsed.includes(effect)) {
          this.userPreferences.effectsUsed.push(effect);
        }
      });
    }

    // Update time patterns
    const hour = new Date().getHours();
    const timeSlot = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    if (!this.userPreferences.creationPatterns.timeOfDay.includes(timeSlot)) {
      this.userPreferences.creationPatterns.timeOfDay.push(timeSlot);
    }
  }

  private extractFeatures(context: any): Array<{ type: string; value: any }> {
    const features = [];
    
    if (context.sport) features.push({ type: 'sport', value: context.sport });
    if (context.style) features.push({ type: 'style', value: context.style });
    if (context.rarity) features.push({ type: 'rarity', value: context.rarity });
    if (context.team) features.push({ type: 'team', value: context.team });
    if (context.mood) features.push({ type: 'mood', value: context.mood });
    
    const hour = new Date().getHours();
    features.push({ type: 'hour', value: Math.floor(hour / 4) }); // 6 time slots
    
    const dayOfWeek = new Date().getDay();
    features.push({ type: 'day', value: dayOfWeek < 5 ? 'weekday' : 'weekend' });
    
    return features;
  }

  // Generate predictions for next actions
  async getPredictiveRecommendations(currentContext: any): Promise<PredictiveRecommendation[]> {
    console.log('🔮 Generating predictive recommendations...');
    
    const features = this.extractFeatures(currentContext);
    const predictions = this.learningModel.predict(features);
    const recommendations: PredictiveRecommendation[] = [];

    // Style predictions
    const stylePrefs = this.userPreferences.styles;
    if (stylePrefs.length > 0) {
      const nextStyle = this.predictNextStyle(currentContext);
      recommendations.push({
        type: 'style',
        confidence: 0.85,
        reason: `Based on your preference for ${stylePrefs.join(', ')} styles`,
        data: { suggestedStyle: nextStyle },
        priority: 'high'
      });
    }

    // Effect recommendations
    const effectPrefs = this.userPreferences.effectsUsed;
    if (effectPrefs.length > 0) {
      recommendations.push({
        type: 'effect',
        confidence: 0.78,
        reason: 'Effects you often use together',
        data: { suggestedEffects: this.predictComplementaryEffects(currentContext) },
        priority: 'medium'
      });
    }

    // Collection suggestions
    if (this.actionHistory.length > 5) {
      const collectionSuggestion = this.suggestCollection();
      recommendations.push({
        type: 'collection',
        confidence: 0.82,
        reason: 'Perfect for organizing your recent cards',
        data: collectionSuggestion,
        priority: 'high'
      });
    }

    // Card suggestions for sets
    const complementaryCards = this.suggestComplementaryCards(currentContext);
    if (complementaryCards.length > 0) {
      recommendations.push({
        type: 'card_suggestion',
        confidence: 0.73,
        reason: 'Complete your collection theme',
        data: { suggestedCards: complementaryCards },
        priority: 'medium'
      });
    }

    return recommendations.sort((a, b) => {
      const priorityScore = { high: 3, medium: 2, low: 1 };
      return (priorityScore[b.priority] - priorityScore[a.priority]) || (b.confidence - a.confidence);
    });
  }

  private predictNextStyle(context: any): string {
    const recentStyles = this.userPreferences.lastActions
      .filter(action => action.context?.style)
      .map(action => action.context.style)
      .slice(0, 10);

    // Pattern detection: alternating styles, progression patterns
    if (recentStyles.length >= 2) {
      const lastStyle = recentStyles[0];
      const styleProgression = {
        'classic': ['vintage', 'epic'],
        'epic': ['holographic', 'cyberpunk'],
        'vintage': ['classic', 'anime'],
        'holographic': ['cyberpunk', 'epic'],
        'anime': ['holographic', 'vintage'],
        'cyberpunk': ['anime', 'epic']
      };
      
      const suggestions = styleProgression[lastStyle as keyof typeof styleProgression] || ['epic'];
      return suggestions[Math.floor(Math.random() * suggestions.length)];
    }

    return this.userPreferences.styles[0] || 'epic';
  }

  private predictComplementaryEffects(context: any): string[] {
    // Common effect combinations based on style
    const effectCombinations = {
      'holographic': ['rainbow-glow', 'chromatic-aberration', 'metallic-sheen'],
      'vintage': ['sepia-tone', 'paper-texture', 'edge-wear'],
      'epic': ['dynamic-glow', 'motion-blur', 'particle-effects'],
      'anime': ['cel-shading', 'outline-enhance', 'color-pop'],
      'cyberpunk': ['neon-glow', 'scan-lines', 'digital-noise']
    };

    const style = context.style || this.userPreferences.styles[0];
    return effectCombinations[style as keyof typeof effectCombinations] || ['glow', 'contrast'];
  }

  private suggestCollection(): CollectionSuggestion {
    const recentSports = this.actionHistory
      .filter(action => action.context?.sport)
      .map(action => action.context.sport)
      .slice(0, 10);

    const sportCounts = recentSports.reduce((acc, sport) => {
      acc[sport] = (acc[sport] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topSport = Object.entries(sportCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'basketball';

    const collections = {
      basketball: {
        name: 'NBA Legends Collection',
        theme: 'Iconic basketball moments and players',
        suggestedCards: [
          { sport: 'basketball', style: 'epic', description: 'Game-winning shot moment' },
          { sport: 'basketball', style: 'vintage', description: 'Classic jersey throwback' },
          { sport: 'basketball', style: 'holographic', description: 'Championship celebration' }
        ],
        completionBonus: 'Exclusive animated border effect'
      },
      football: {
        name: 'Gridiron Heroes',
        theme: 'Football legends and memorable plays',
        suggestedCards: [
          { sport: 'football', style: 'epic', description: 'Touchdown celebration' },
          { sport: 'football', style: 'cyberpunk', description: 'Futuristic uniform design' },
          { sport: 'football', style: 'classic', description: 'Historic stadium moment' }
        ],
        completionBonus: 'Team color customization unlock'
      },
      soccer: {
        name: 'World Cup Dreams',
        theme: 'Soccer skills and international flair',
        suggestedCards: [
          { sport: 'soccer', style: 'dynamic', description: 'Bicycle kick goal' },
          { sport: 'soccer', style: 'vintage', description: 'Classic world cup moment' },
          { sport: 'soccer', style: 'anime', description: 'Stylized action sequence' }
        ],
        completionBonus: 'Globe hologram effect'
      }
    };

    return collections[topSport as keyof typeof collections] || collections.basketball;
  }

  private suggestComplementaryCards(context: any): Array<{ type: string; description: string; reason: string }> {
    const suggestions = [];
    
    if (context.sport === 'basketball' && context.player) {
      suggestions.push({
        type: 'teammate',
        description: `Create a card for ${context.player}'s teammate`,
        reason: 'Build a team collection'
      });
      
      suggestions.push({
        type: 'rival',
        description: `Add their biggest rival to the collection`,
        reason: 'Classic matchup theme'
      });
    }

    if (context.style === 'vintage' && !context.hasModernVariant) {
      suggestions.push({
        type: 'modern_variant',
        description: 'Create a modern version of this vintage card',
        reason: 'Then vs. Now comparison set'
      });
    }

    return suggestions;
  }

  // Preload likely next actions for performance
  async preloadLikelyActions(context: any) {
    console.log('⚡ Preloading likely next actions...');
    
    const recommendations = await this.getPredictiveRecommendations(context);
    
    for (const rec of recommendations.slice(0, 3)) { // Top 3 most likely
      const preloadKey = `${rec.type}-${JSON.stringify(rec.data)}`;
      
      if (!this.preloadQueue.has(preloadKey)) {
        const preloadPromise = this.preloadResource(rec);
        this.preloadQueue.set(preloadKey, preloadPromise);
        
        // Clean up old preloads
        setTimeout(() => {
          this.preloadQueue.delete(preloadKey);
        }, 60000); // 1 minute cache
      }
    }
  }

  private async preloadResource(recommendation: PredictiveRecommendation): Promise<any> {
    switch (recommendation.type) {
      case 'style':
        // Preload style transfer models
        return this.preloadStyleModel(recommendation.data.suggestedStyle);
      
      case 'effect':
        // Preload effect shaders
        return this.preloadEffectShaders(recommendation.data.suggestedEffects);
      
      case 'template':
        // Preload template assets
        return this.preloadTemplate(recommendation.data);
      
      default:
        return null;
    }
  }

  private async preloadStyleModel(style: string): Promise<any> {
    console.log(`📦 Preloading ${style} style model...`);
    // In production, this would preload AI models, textures, shaders
    return new Promise(resolve => setTimeout(resolve, 100));
  }

  private async preloadEffectShaders(effects: string[]): Promise<any> {
    console.log('🎮 Preloading effect shaders...', effects);
    // Preload WebGL shaders
    return new Promise(resolve => setTimeout(resolve, 100));
  }

  private async preloadTemplate(templateData: any): Promise<any> {
    console.log('🎨 Preloading template assets...');
    // Preload template images, fonts, layouts
    return new Promise(resolve => setTimeout(resolve, 100));
  }

  // Auto-organize cards into collections
  async autoOrganizeCards(userCards: any[]): Promise<{ collections: any[]; suggestions: string[] }> {
    console.log('📁 Auto-organizing cards into collections...');
    
    const collections: any[] = [];
    const suggestions: string[] = [];

    // Group by sport
    const sportGroups = userCards.reduce((acc, card) => {
      const sport = card.metadata?.sport || 'misc';
      if (!acc[sport]) acc[sport] = [];
      acc[sport].push(card);
      return acc;
    }, {});

    Object.entries(sportGroups).forEach(([sport, cards]: [string, any]) => {
      if (cards.length >= 3) {
        collections.push({
          name: `${sport.charAt(0).toUpperCase() + sport.slice(1)} Collection`,
          cards,
          type: 'sport',
          completeness: Math.min(cards.length / 10, 1) // Target 10 cards per sport
        });
      }
    });

    // Group by style
    const styleGroups = userCards.reduce((acc, card) => {
      const style = card.design_metadata?.variation || 'classic';
      if (!acc[style]) acc[style] = [];
      acc[style].push(card);
      return acc;
    }, {});

    Object.entries(styleGroups).forEach(([style, cards]: [string, any]) => {
      if (cards.length >= 2) {
        collections.push({
          name: `${style.charAt(0).toUpperCase() + style.slice(1)} Style Collection`,
          cards,
          type: 'style',
          completeness: Math.min(cards.length / 5, 1) // Target 5 cards per style
        });
      }
    });

    // Generate completion suggestions
    collections.forEach(collection => {
      if (collection.completeness < 1) {
        const needed = collection.type === 'sport' ? 10 - collection.cards.length : 5 - collection.cards.length;
        suggestions.push(`Add ${needed} more ${collection.type === 'sport' ? collection.name.split(' ')[0] : collection.type} cards to complete "${collection.name}"`);
      }
    });

    return { collections, suggestions };
  }

  // Get user analytics for improvement suggestions
  getUserAnalytics(): {
    totalCards: number;
    favoriteStyle: string;
    favoriteSport: string;
    creationStreak: number;
    efficiency: number;
    suggestions: string[];
  } {
    const totalCreations = this.actionHistory.filter(a => a.action === 'card_created').length;
    const favoriteStyle = this.getMostFrequent(this.userPreferences.styles) || 'classic';
    const favoriteSport = this.getMostFrequent(this.userPreferences.sports) || 'basketball';
    
    // Calculate creation streak
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    let streak = 0;
    
    const sortedActions = this.actionHistory
      .filter(a => a.action === 'card_created')
      .sort((a, b) => b.timestamp - a.timestamp);
    
    for (let i = 0; i < sortedActions.length; i++) {
      const daysDiff = Math.floor((now - Number(sortedActions[i].timestamp)) / oneDayMs);
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    // Calculate efficiency (successful completions vs starts)
    const starts = this.actionHistory.filter(a => a.action === 'creation_started').length;
    const completions = this.actionHistory.filter(a => a.action === 'card_created').length;
    const efficiency = starts > 0 ? completions / starts : 1;

    const suggestions = [];
    if (efficiency < 0.7) {
      suggestions.push('Try using the AI assistance features to streamline your workflow');
    }
    if (streak === 0) {
      suggestions.push('Create a card today to start a new streak!');
    }
    if (this.userPreferences.styles.length === 1) {
      suggestions.push('Experiment with different visual styles to diversify your collection');
    }

    return {
      totalCards: totalCreations,
      favoriteStyle,
      favoriteSport,
      creationStreak: streak,
      efficiency: Math.round(efficiency * 100) / 100,
      suggestions
    };
  }

  private getMostFrequent(array: string[]): string | null {
    if (array.length === 0) return null;
    
    const frequency = array.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)[0][0];
  }

  // Clear learning data (for privacy)
  clearLearningData() {
    this.userPreferences = {
      sports: [],
      styles: [],
      rarities: [],
      teams: [],
      colors: [],
      effectsUsed: [],
      creationPatterns: {
        timeOfDay: [],
        frequency: 0,
        avgSessionLength: 0
      },
      lastActions: []
    };
    
    this.actionHistory = [];
    this.learningModel.weights.clear();
    this.preloadQueue.clear();
    
    localStorage.removeItem('crdmkr-user-preferences');
    console.log('🧹 Learning data cleared');
  }
}

export const predictiveService = new PredictiveService();