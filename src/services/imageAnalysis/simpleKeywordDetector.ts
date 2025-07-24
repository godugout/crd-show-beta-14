
export interface SimpleDetectionResult {
  title: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary';
  tags: string[];
  confidence: number;
  detectionMethod: string;
  matchedKeywords: string[];
}

export class SimpleKeywordDetector {
  private cardPatterns = {
    // Star Wars & Sci-Fi
    wookiee: {
      keywords: ['wookiee', 'wookie', 'chewbacca', 'chewie', 'furry humanoid', 'hairy humanoid', 'tall furry', 'brown fur', 'bear humanoid', 'ape humanoid', 'kashyyyk'],
      card: {
        title: 'Galactic Guardian Wookiee',
        description: 'A legendary warrior from the forest moon of Kashyyyk, this mighty Wookiee stands tall with unwavering loyalty and incredible strength.',
        rarity: 'legendary' as const,
        tags: ['wookiee', 'star-wars', 'warrior', 'loyal', 'strength', 'galactic', 'legendary'],
        confidence: 0.95
      }
    },
    
    // Animals
    cat: {
      keywords: ['cat', 'kitten', 'feline', 'tabby', 'persian', 'siamese'],
      card: {
        title: 'Mystical Feline Guardian',
        description: 'A mysterious cat with ancient wisdom and magical abilities, known to bring good fortune to those who earn its trust.',
        rarity: 'rare' as const,
        tags: ['cat', 'feline', 'mystical', 'guardian', 'magical'],
        confidence: 0.8
      }
    },
    
    dog: {
      keywords: ['dog', 'puppy', 'canine', 'retriever', 'shepherd', 'bulldog', 'poodle'],
      card: {
        title: 'Loyal Companion',
        description: 'A faithful canine companion with unwavering loyalty and protective instincts, always ready to defend those it loves.',
        rarity: 'uncommon' as const,
        tags: ['dog', 'canine', 'loyal', 'companion', 'protective'],
        confidence: 0.85
      }
    },
    
    bear: {
      keywords: ['bear', 'grizzly', 'polar', 'black bear', 'brown bear'],
      card: {
        title: 'Forest Titan',
        description: 'A powerful bear with immense strength and protective instincts, ruler of the wilderness and guardian of nature.',
        rarity: 'rare' as const,
        tags: ['bear', 'forest', 'titan', 'powerful', 'nature'],
        confidence: 0.9
      }
    },
    
    // Birds
    bird: {
      keywords: ['bird', 'eagle', 'hawk', 'owl', 'parrot', 'robin', 'sparrow'],
      card: {
        title: 'Sky Soarer',
        description: 'A majestic bird with keen eyesight and graceful flight, master of the skies and symbol of freedom.',
        rarity: 'uncommon' as const,
        tags: ['bird', 'flying', 'sky', 'freedom', 'graceful'],
        confidence: 0.8
      }
    },
    
    // Vehicles
    car: {
      keywords: ['car', 'automobile', 'vehicle', 'sedan', 'coupe', 'convertible'],
      card: {
        title: 'Speed Machine',
        description: 'A powerful vehicle built for speed and performance, engineered to dominate the road with style and precision.',
        rarity: 'uncommon' as const,
        tags: ['car', 'vehicle', 'speed', 'machine', 'transportation'],
        confidence: 0.7
      }
    },
    
    // Objects
    flower: {
      keywords: ['flower', 'rose', 'tulip', 'daisy', 'sunflower', 'orchid'],
      card: {
        title: 'Enchanted Bloom',
        description: 'A beautiful flower radiating natural magic and ethereal beauty, said to bring peace and healing to those nearby.',
        rarity: 'common' as const,
        tags: ['flower', 'nature', 'beauty', 'enchanted', 'peaceful'],
        confidence: 0.75
      }
    },
    
    // People
    person: {
      keywords: ['person', 'human', 'man', 'woman', 'people', 'individual'],
      card: {
        title: 'Heroic Champion',
        description: 'A skilled individual with unique talents and unwavering determination, ready to face any challenge with courage.',
        rarity: 'uncommon' as const,
        tags: ['human', 'hero', 'champion', 'skilled', 'courageous'],
        confidence: 0.7
      }
    }
  };

  detectFromKeywords(inputText: string): SimpleDetectionResult {
    const lowerInput = inputText.toLowerCase();
    console.log('🔍 Enhanced keyword detection on:', lowerInput);
    
    let bestMatch: { pattern: string; matchCount: number; card: any } | null = null;
    
    // Check each pattern for matches
    for (const [patternName, pattern] of Object.entries(this.cardPatterns)) {
      const matchedKeywords: string[] = [];
      
      for (const keyword of pattern.keywords) {
        if (lowerInput.includes(keyword)) {
          matchedKeywords.push(keyword);
        }
      }
      
      if (matchedKeywords.length > 0) {
        const matchScore = matchedKeywords.length / pattern.keywords.length;
        
        if (!bestMatch || matchedKeywords.length > bestMatch.matchCount) {
          bestMatch = {
            pattern: patternName,
            matchCount: matchedKeywords.length,
            card: { ...pattern.card, matchedKeywords }
          };
        }
        
        console.log(`📊 Pattern "${patternName}": ${matchedKeywords.length} matches [${matchedKeywords.join(', ')}]`);
      }
    }
    
    if (bestMatch) {
      console.log(`🎯 Best match: ${bestMatch.pattern} with ${bestMatch.matchCount} keyword matches`);
      return {
        title: bestMatch.card.title,
        description: bestMatch.card.description,
        rarity: bestMatch.card.rarity,
        tags: bestMatch.card.tags,
        confidence: bestMatch.card.confidence,
        detectionMethod: 'enhanced_keywords',
        matchedKeywords: bestMatch.card.matchedKeywords
      };
    }
    
    // Creative fallback for unrecognized content
    console.log('🎨 No specific pattern matched, creating creative card...');
    const words = lowerInput.split(' ').filter(word => word.length > 2);
    const mainSubject = words[0] || 'mysterious';
    
    return {
      title: `${this.capitalize(mainSubject)} Discovery`,
      description: `A unique discovery featuring ${inputText}. This extraordinary find holds secrets waiting to be unlocked by those brave enough to explore its mysteries.`,
      rarity: 'common',
      tags: [...words.slice(0, 3), 'discovery', 'unique', 'mysterious'],
      confidence: 0.5,
      detectionMethod: 'creative_fallback',
      matchedKeywords: words.slice(0, 3)
    };
  }
  
  private capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  
  // Test method for verification
  testKeywordDetection() {
    console.log('🧪 Testing enhanced keyword detection...');
    
    const testCases = [
      'cat sitting on windowsill',
      'dog running in park', 
      'bear in forest',
      'red car on highway',
      'beautiful flower garden',
      'wookiee warrior with lightsaber',
      'person walking down street',
      'unknown mysterious object'
    ];
    
    testCases.forEach(testCase => {
      const result = this.detectFromKeywords(testCase);
      console.log(`Test: "${testCase}" -> "${result.title}" (${result.rarity}, ${result.confidence})`);
    });
  }
}

export const simpleKeywordDetector = new SimpleKeywordDetector();
