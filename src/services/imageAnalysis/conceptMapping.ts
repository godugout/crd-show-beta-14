export interface CardConcept {
  title: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary';
  tags: string[];
}

export const mapObjectsToCardConcept = (
  objects: string[], 
  visualFeatures?: any, 
  characterArchetype?: string | null
): CardConcept => {
  
  console.log('🎯 Mapping objects to card concept:', { objects, characterArchetype, visualFeatures });
  
  // PRIORITY: Direct character archetype matching
  if (characterArchetype === 'wookiee') {
    console.log('✨ WOOKIEE ARCHETYPE DETECTED - Creating legendary card!');
    return {
      title: 'Galactic Guardian Wookiee',
      description: 'A legendary warrior from the forest moon of Kashyyyk, this mighty Wookiee stands tall with unwavering loyalty and incredible strength. Known throughout the galaxy for their courage in battle and fierce devotion to their allies.',
      rarity: 'legendary',
      tags: ['wookiee', 'star-wars', 'warrior', 'loyal', 'strength', 'galactic', 'legendary', 'kashyyyk', 'guardian']
    };
  }
  
  if (characterArchetype === 'bear-creature') {
    return {
      title: 'Primal Forest Guardian',
      description: 'A powerful bear-like creature with ancient wisdom and protective instincts. This majestic being commands respect from all who encounter its mighty presence in the wild.',
      rarity: 'rare',
      tags: ['bear', 'forest', 'guardian', 'primal', 'wisdom', 'powerful', 'nature']
    };
  }
  
  if (characterArchetype === 'humanoid-warrior') {
    return {
      title: 'Elite Warrior',
      description: 'A skilled combatant with years of training and battle experience. This warrior stands ready to face any challenge with honor and determination.',
      rarity: 'rare',
      tags: ['warrior', 'combat', 'skilled', 'honor', 'battle', 'elite']
    };
  }

  const mainObject = objects[0]?.toLowerCase() || 'unknown';
  
  // Enhanced concept database with hundreds of possibilities
  const concepts: { [key: string]: CardConcept } = {
    // Star Wars Characters & Creatures - ENHANCED WOOKIE DETECTION
    'wookiee': {
      title: 'Legendary Wookiee Warrior',
      rarity: 'legendary',
      description: 'A mighty warrior from Kashyyyk, towering above others with incredible strength and unwavering loyalty to their companions.',
      tags: ['star-wars', 'wookiee', 'warrior', 'loyal', 'strength', 'galactic', 'legendary', 'kashyyyk']
    },
    'wookie': {
      title: 'Legendary Wookiee Warrior', 
      rarity: 'legendary',
      description: 'A mighty warrior from Kashyyyk, towering above others with incredible strength and unwavering loyalty to their companions.',
      tags: ['star-wars', 'wookiee', 'warrior', 'loyal', 'strength', 'galactic', 'legendary', 'kashyyyk']
    },
    'chewbacca': {
      title: 'Rebel Alliance Hero',
      rarity: 'legendary',
      description: 'The most famous Wookiee warrior, co-pilot of the Millennium Falcon and hero of the Rebellion.',
      tags: ['star-wars', 'rebel', 'pilot', 'hero', 'millennium-falcon', 'legendary', 'wookiee']
    },
    // Additional fuzzy matches for Wookie-like terms
    'hairy': {
      title: 'Furry Forest Guardian',
      rarity: 'rare',
      description: 'A towering, hair-covered guardian with incredible strength and protective instincts.',
      tags: ['furry', 'guardian', 'forest', 'strength', 'protective']
    },
    'furry': {
      title: 'Primal Beast Warrior',
      rarity: 'rare', 
      description: 'A fur-covered warrior with primal strength and ancient wisdom.',
      tags: ['furry', 'warrior', 'primal', 'strength', 'ancient']
    },
    'ape': {
      title: 'Mighty Primate Guardian',
      rarity: 'rare',
      description: 'A powerful primate-like being with incredible strength and intelligence.',
      tags: ['primate', 'guardian', 'strength', 'intelligent', 'mighty']
    },
    'gorilla': {
      title: 'Mountain Silverback',
      rarity: 'rare',
      description: 'A massive, intelligent primate with incredible strength and leadership abilities.',
      tags: ['primate', 'silverback', 'mountain', 'strength', 'leader']
    },
    'primate': {
      title: 'Ancient Primate Sage',
      rarity: 'rare',
      description: 'An evolved primate with ancient wisdom and remarkable intelligence.',
      tags: ['primate', 'sage', 'ancient', 'wisdom', 'intelligent']
    },
    
    'ewok': {
      title: 'Forest Moon Protector',
      rarity: 'rare',
      description: 'Small but brave inhabitants of Endor, fierce defenders of their forest home.',
      tags: ['star-wars', 'endor', 'forest', 'protector', 'brave', 'tribal']
    },
    'jawa': {
      title: 'Desert Scavenger',
      rarity: 'uncommon',
      description: 'Hooded traders from Tatooine, masters of salvage and technology.',
      tags: ['star-wars', 'tatooine', 'desert', 'trader', 'scavenger', 'technology']
    },
    'tusken': {
      title: 'Sand People Raider',
      rarity: 'rare',
      description: 'Mysterious nomads of the desert, fierce warriors of the dunes.',
      tags: ['star-wars', 'tatooine', 'desert', 'raider', 'nomad', 'warrior']
    },
    'gamorrean': {
      title: 'Palace Guard',
      rarity: 'uncommon',
      description: 'Brutish pig-like guards known for their strength and loyalty.',
      tags: ['star-wars', 'guard', 'strong', 'loyal', 'palace', 'brutish']
    },
    'rodian': {
      title: 'Bounty Hunter',
      rarity: 'rare',
      description: 'Green-skinned humanoids known for their hunting skills.',
      tags: ['star-wars', 'bounty-hunter', 'hunter', 'skilled', 'tracking']
    },
    'twi\'lek': {
      title: 'Galactic Diplomat',
      rarity: 'rare',
      description: 'Elegant humanoids with distinctive head-tails, known for diplomacy.',
      tags: ['star-wars', 'diplomat', 'elegant', 'charismatic', 'galactic']
    },

    // Fantasy Creatures
    'dragon': {
      title: 'Ancient Wyrm',
      rarity: 'legendary',
      description: 'A legendary dragon of immense power and ancient wisdom.',
      tags: ['fantasy', 'dragon', 'ancient', 'powerful', 'magical', 'legendary']
    },
    'elf': {
      title: 'Woodland Ranger',
      rarity: 'rare',
      description: 'An elegant forest dweller with keen senses and magical abilities.',
      tags: ['fantasy', 'elf', 'ranger', 'magical', 'forest', 'elegant']
    },
    'dwarf': {
      title: 'Mountain Warrior',
      rarity: 'uncommon',
      description: 'A stout mountain dweller known for craftsmanship and combat prowess.',
      tags: ['fantasy', 'dwarf', 'warrior', 'mountain', 'craftsman', 'strong']
    },
    'orc': {
      title: 'Savage Raider',
      rarity: 'common',
      description: 'A fierce warrior from the wastelands, known for brutal combat.',
      tags: ['fantasy', 'orc', 'raider', 'savage', 'warrior', 'brutal']
    },
    'goblin': {
      title: 'Cave Lurker',
      rarity: 'common',
      description: 'A small but cunning creature that dwells in dark places.',
      tags: ['fantasy', 'goblin', 'cunning', 'cave', 'sneaky', 'small']
    },
    'troll': {
      title: 'Bridge Guardian',
      rarity: 'rare',
      description: 'A massive creature of stone and sinew, guardian of ancient places.',
      tags: ['fantasy', 'troll', 'guardian', 'massive', 'ancient', 'stone']
    },
    'centaur': {
      title: 'Forest Sage',
      rarity: 'rare',
      description: 'Half-human, half-horse beings known for wisdom and archery.',
      tags: ['fantasy', 'centaur', 'sage', 'wisdom', 'archery', 'nature']
    },
    'phoenix': {
      title: 'Eternal Flame',
      rarity: 'legendary',
      description: 'A magnificent bird of fire that rises from its own ashes.',
      tags: ['fantasy', 'phoenix', 'fire', 'eternal', 'rebirth', 'magnificent']
    },
    'unicorn': {
      title: 'Pure Spirit',
      rarity: 'legendary',
      description: 'A mystical horse with a spiraled horn, symbol of purity and magic.',
      tags: ['fantasy', 'unicorn', 'pure', 'mystical', 'magic', 'noble']
    },
    'griffin': {
      title: 'Sky Sovereign',
      rarity: 'rare',
      description: 'A majestic creature with the body of a lion and wings of an eagle.',
      tags: ['fantasy', 'griffin', 'majestic', 'sky', 'sovereign', 'noble']
    },

    // Animals & Creatures
    'wolf': {
      title: 'Pack Leader',
      rarity: 'uncommon',
      description: 'A fierce wolf with keen intelligence and natural leadership.',
      tags: ['animal', 'wolf', 'leader', 'pack', 'fierce', 'intelligent']
    },
    'bear': {
      title: 'Forest Titan',
      rarity: 'rare',
      description: 'A powerful bear with immense strength and protective instincts.',
      tags: ['animal', 'bear', 'titan', 'powerful', 'protector', 'forest']
    },
    'lion': {
      title: 'Savanna King',
      rarity: 'rare',
      description: 'The king of beasts, a majestic predator with regal bearing.',
      tags: ['animal', 'lion', 'king', 'majestic', 'predator', 'regal']
    },
    'tiger': {
      title: 'Striped Hunter',
      rarity: 'rare',
      description: 'A solitary hunter with distinctive stripes and deadly grace.',
      tags: ['animal', 'tiger', 'hunter', 'solitary', 'graceful', 'deadly']
    },
    'eagle': {
      title: 'Sky Hunter',
      rarity: 'uncommon',
      description: 'A majestic bird of prey with keen eyesight and powerful wings.',
      tags: ['animal', 'eagle', 'hunter', 'majestic', 'keen', 'powerful']
    },
    'shark': {
      title: 'Ocean Predator',
      rarity: 'rare',
      description: 'An apex predator of the deep, perfectly evolved for hunting.',
      tags: ['animal', 'shark', 'predator', 'ocean', 'apex', 'evolved']
    },
    'elephant': {
      title: 'Gentle Giant',
      rarity: 'rare',
      description: 'A massive creature known for intelligence, memory, and gentle nature.',
      tags: ['animal', 'elephant', 'giant', 'intelligent', 'gentle', 'memory']
    },
    'whale': {
      title: 'Ocean Leviathan',
      rarity: 'legendary',
      description: 'The largest creature of the seas, a gentle giant of the deep.',
      tags: ['animal', 'whale', 'leviathan', 'massive', 'gentle', 'ocean']
    },

    // Sci-Fi Characters
    'robot': {
      title: 'Mechanical Guardian',
      rarity: 'uncommon',
      description: 'An artificial being designed to serve and protect.',
      tags: ['sci-fi', 'robot', 'mechanical', 'guardian', 'artificial', 'protector']
    },
    'android': {
      title: 'Synthetic Human',
      rarity: 'rare',
      description: 'An artificial being designed to mimic human appearance and behavior.',
      tags: ['sci-fi', 'android', 'synthetic', 'human', 'artificial', 'advanced']
    },
    'cyborg': {
      title: 'Enhanced Being',
      rarity: 'rare',
      description: 'A being augmented with cybernetic enhancements and technology.',
      tags: ['sci-fi', 'cyborg', 'enhanced', 'augmented', 'technology', 'hybrid']
    },
    'alien': {
      title: 'Extraterrestrial Visitor',
      rarity: 'rare',
      description: 'A being from another world with unknown powers and intentions.',
      tags: ['sci-fi', 'alien', 'extraterrestrial', 'visitor', 'unknown', 'otherworldly']
    },

    // Mythological Beings
    'angel': {
      title: 'Divine Messenger',
      rarity: 'legendary',
      description: 'A celestial being of pure light and divine purpose.',
      tags: ['mythological', 'angel', 'divine', 'celestial', 'pure', 'messenger']
    },
    'demon': {
      title: 'Infernal Entity',
      rarity: 'rare',
      description: 'A dark being from the underworld with sinister powers.',
      tags: ['mythological', 'demon', 'infernal', 'dark', 'sinister', 'underworld']
    },
    'vampire': {
      title: 'Blood Lord',
      rarity: 'rare',
      description: 'An undead being with supernatural powers and an eternal thirst.',
      tags: ['mythological', 'vampire', 'undead', 'supernatural', 'eternal', 'aristocratic']
    },
    'werewolf': {
      title: 'Moon Cursed',
      rarity: 'rare',
      description: 'A human cursed to transform under the full moon.',
      tags: ['mythological', 'werewolf', 'cursed', 'transformation', 'moon', 'beast']
    },
    'sphinx': {
      title: 'Riddle Keeper',
      rarity: 'legendary',
      description: 'An ancient guardian who speaks in riddles and guards sacred knowledge.',
      tags: ['mythological', 'sphinx', 'guardian', 'ancient', 'riddles', 'knowledge']
    },

    // Common Animals
    'cat': {
      title: 'Feline Mystic',
      rarity: 'rare',
      description: 'A mysterious cat with ancient wisdom and magical abilities.',
      tags: ['feline', 'mystic', 'magical', 'wisdom', 'guardian']
    },
    'dog': {
      title: 'Loyal Guardian',
      rarity: 'uncommon',
      description: 'A faithful companion with unwavering loyalty.',
      tags: ['canine', 'guardian', 'loyal', 'protector', 'companion']
    },
    'horse': {
      title: 'Noble Steed',
      rarity: 'uncommon',
      description: 'A majestic horse with speed, grace, and noble bearing.',
      tags: ['equine', 'noble', 'majestic', 'speed', 'grace']
    },
    'rabbit': {
      title: 'Swift Runner',
      rarity: 'common',
      description: 'A quick and agile creature known for speed and cunning.',
      tags: ['animal', 'rabbit', 'swift', 'agile', 'cunning']
    },

    // Generic but Enhanced Fallbacks
    'person': {
      title: 'Human Champion',
      rarity: 'uncommon',
      description: 'A skilled individual with unique talents and determination.',
      tags: ['human', 'champion', 'skilled', 'determined', 'talented']
    },
    'warrior': {
      title: 'Battle Master',
      rarity: 'rare',
      description: 'A seasoned fighter with exceptional combat skills.',
      tags: ['warrior', 'battle', 'master', 'combat', 'skilled']
    },
    'mage': {
      title: 'Arcane Scholar',
      rarity: 'rare',
      description: 'A wielder of magical forces and ancient knowledge.',
      tags: ['mage', 'arcane', 'scholar', 'magical', 'knowledge']
    }
  };

  // Enhanced pattern matching with fuzzy logic and visual features
  const allText = objects.join(' ').toLowerCase() + ' ' + JSON.stringify(visualFeatures || {}).toLowerCase();
  
  const patterns = [
    // ENHANCED WOOKIE DETECTION PATTERNS
    { keywords: ['wookiee', 'wookie', 'chewbacca'], match: 'wookiee', weight: 1.0 },
    { keywords: ['fur', 'tall', 'brown', 'humanoid'], match: 'wookiee', weight: 0.9 },
    { keywords: ['hairy', 'standing', 'large', 'primate'], match: 'wookiee', weight: 0.9 },
    { keywords: ['bear', 'upright', 'bipedal', 'human'], match: 'wookiee', weight: 0.8 },
    { keywords: ['furry', 'giant', 'warrior', 'brown'], match: 'wookiee', weight: 0.9 },
    { keywords: ['ape', 'humanoid', 'furry'], match: 'wookiee', weight: 0.8 },
    { keywords: ['gorilla', 'standing', 'tall'], match: 'wookiee', weight: 0.8 },
    { keywords: ['primate', 'bipedal', 'large'], match: 'wookiee', weight: 0.8 },
    
    // Star Wars creatures
    { keywords: ['small', 'hood', 'desert'], match: 'jawa', weight: 0.8 },
    { keywords: ['green', 'hunter', 'reptilian'], match: 'rodian', weight: 0.7 },
    { keywords: ['pig', 'guard', 'axe'], match: 'gamorrean', weight: 0.8 },
    
    // Fantasy patterns
    { keywords: ['wings', 'fire', 'large'], match: 'dragon', weight: 0.9 },
    { keywords: ['pointed', 'ears', 'bow'], match: 'elf', weight: 0.8 },
    { keywords: ['short', 'beard', 'axe'], match: 'dwarf', weight: 0.8 },
    { keywords: ['horn', 'horse', 'white'], match: 'unicorn', weight: 0.9 },
    
    // Animal patterns
    { keywords: ['mane', 'roar', 'golden'], match: 'lion', weight: 0.8 },
    { keywords: ['stripes', 'orange', 'predator'], match: 'tiger', weight: 0.8 },
    { keywords: ['pack', 'howl', 'gray'], match: 'wolf', weight: 0.7 },
    { keywords: ['trunk', 'large', 'gray'], match: 'elephant', weight: 0.9 }
  ];

  const patternMatches = patterns
    .map(pattern => {
      const matchScore = pattern.keywords.reduce((score, keyword) => {
        const textMatch = allText.includes(keyword) ? 1 : 0;
        return score + textMatch;
      }, 0);
      
      const normalizedScore = (matchScore / pattern.keywords.length) * pattern.weight;
      return { pattern, score: normalizedScore };
    })
    .sort((a, b) => b.score - a.score);

  console.log('🔍 Pattern matching results:', patternMatches.slice(0, 5));

  // Use best pattern match if score is high enough
  if (patternMatches[0]?.score > 0.3) {
    const bestMatch = patternMatches[0].pattern.match;
    console.log(`🎯 Best pattern match: ${bestMatch} (score: ${patternMatches[0].score})`);
    if (concepts[bestMatch]) {
      return concepts[bestMatch];
    }
  }

  // Direct object matching with fuzzy search
  const bestDirectMatch = Object.keys(concepts).find(key => 
    mainObject.includes(key) || key.includes(mainObject) ||
    objects.some(obj => obj.toLowerCase().includes(key) || key.includes(obj.toLowerCase()))
  );

  if (bestDirectMatch) {
    console.log(`📋 Direct match found: ${bestDirectMatch}`);
    return concepts[bestDirectMatch];
  }

  // Enhanced fallback with visual feature consideration
  return createEnhancedFallback(objects, visualFeatures);
};

const createEnhancedFallback = (objects: string[], visualFeatures?: any): CardConcept => {
  const creativeAdjectives = ['Mysterious', 'Ancient', 'Legendary', 'Mystical', 'Ethereal', 'Cosmic', 'Radiant', 'Shadow'];
  const creativeNouns = ['Guardian', 'Sentinel', 'Champion', 'Wanderer', 'Keeper', 'Oracle', 'Essence', 'Spirit'];
  
  const randomAdjective = creativeAdjectives[Math.floor(Math.random() * creativeAdjectives.length)];
  const randomNoun = creativeNouns[Math.floor(Math.random() * creativeNouns.length)];

  let enhancedTitle = `${randomAdjective} ${randomNoun}`;
  let enhancedDescription = `A unique entity with distinctive characteristics featuring ${objects.join(' and ')}.`;
  
  if (visualFeatures) {
    if (visualFeatures.texturePatterns?.includes('furry')) {
      enhancedTitle = `Furry ${randomNoun}`;
      enhancedDescription = `A fur-covered being with ${visualFeatures.dominantColors?.join(' and ') || 'natural'} coloring. ${enhancedDescription}`;
    }
    
    if (visualFeatures.figureType === 'humanoid') {
      enhancedDescription = `A humanoid figure with ${enhancedDescription.toLowerCase()}`;
    }
  }

  return {
    title: enhancedTitle,
    description: `${enhancedDescription} This extraordinary being possesses hidden powers and untold stories waiting to be discovered.`,
    rarity: 'uncommon',
    tags: [...objects.slice(0, 3), 'unique', 'mysterious', 'discovery']
  };
};
