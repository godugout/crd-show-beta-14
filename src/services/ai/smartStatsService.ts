import { VisionAnalysisResult } from './visionAnalysisService';

interface PlayerStats {
  overall: number;
  offense: number;
  defense: number;
  speed: number;
  skill: number;
  [key: string]: number;
}

interface SportSpecificStats {
  basketball: {
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    fieldGoalPercent: number;
    threePointPercent: number;
    freeThrowPercent: number;
  };
  football: {
    passingYards: number;
    touchdowns: number;
    completions: number;
    attempts: number;
    interceptions: number;
    qbRating: number;
  };
  baseball: {
    battingAverage: number;
    homeRuns: number;
    rbi: number;
    era: number;
    strikeouts: number;
    saves: number;
  };
  soccer: {
    goals: number;
    assists: number;
    saves: number;
    cleanSheets: number;
    yellowCards: number;
    redCards: number;
  };
}

interface PlayerDescription {
  nickname: string;
  position: string;
  team: string;
  biography: string;
  achievements: string[];
  playingStyle: string;
  strengths: string[];
  signature_moves: string[];
}

interface StatsGenerationResult {
  playerName: string;
  stats: PlayerStats;
  sportStats: Partial<SportSpecificStats>;
  description: PlayerDescription;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  confidence: number;
}

class SmartStatsService {
  private sportsAPICache = new Map<string, any>();
  private playerDatabase = new Map<string, any>();

  constructor() {
    this.initializePlayerDatabase();
  }

  private initializePlayerDatabase() {
    // Simulated player database - in production this would be from APIs
    const mockPlayers = [
      {
        name: 'LeBron James',
        sport: 'basketball',
        team: 'Lakers',
        position: 'Forward',
        stats: { overall: 97, offense: 95, defense: 88, speed: 85, skill: 98 },
        achievements: ['4x NBA Champion', '4x Finals MVP', '18x All-Star'],
        signature: 'The Chase Down Block'
      },
      {
        name: 'Tom Brady',
        sport: 'football', 
        team: 'Buccaneers',
        position: 'Quarterback',
        stats: { overall: 95, offense: 99, defense: 60, speed: 65, skill: 99 },
        achievements: ['7x Super Bowl Champion', '5x Super Bowl MVP'],
        signature: 'The Comeback'
      },
      {
        name: 'Lionel Messi',
        sport: 'soccer',
        team: 'Inter Miami',
        position: 'Forward',
        stats: { overall: 96, offense: 99, defense: 75, speed: 88, skill: 99 },
        achievements: ['8x Ballon d\'Or', 'World Cup Winner'],
        signature: 'Left-Footed Magic'
      }
    ];

    mockPlayers.forEach(player => {
      this.playerDatabase.set(player.name.toLowerCase(), player);
    });
  }

  async generateSmartStats(
    playerName?: string,
    visionData?: VisionAnalysisResult,
    isCustomCard: boolean = false
  ): Promise<StatsGenerationResult> {
    console.log('📊 Generating smart stats...');

    try {
      if (!isCustomCard && playerName) {
        // Try to get real stats from APIs
        const realStats = await this.fetchRealPlayerStats(playerName, visionData?.subject?.sport);
        if (realStats) {
          return realStats;
        }
      }

      // Generate fictional stats based on vision analysis
      return this.generateFictionalStats(playerName, visionData);
    } catch (error) {
      console.error('Stats generation failed:', error);
      return this.getFallbackStats(playerName);
    }
  }

  private async fetchRealPlayerStats(playerName: string, sport?: string): Promise<StatsGenerationResult | null> {
    const cacheKey = `${playerName}-${sport}`;
    
    // Check cache first
    if (this.sportsAPICache.has(cacheKey)) {
      return this.sportsAPICache.get(cacheKey);
    }

    // Check our mock database
    const player = this.playerDatabase.get(playerName.toLowerCase());
    if (player) {
      const result = this.formatPlayerData(player);
      this.sportsAPICache.set(cacheKey, result);
      return result;
    }

    // In production, call real APIs here:
    // - ESPN API for current stats
    // - Sports Reference for historical data  
    // - Team APIs for detailed info
    
    console.log(`⚡ Would fetch real stats for ${playerName} from sports APIs`);
    return null;
  }

  private formatPlayerData(playerData: any): StatsGenerationResult {
    const sportStats = this.generateSportSpecificStats(playerData.sport, playerData.stats.overall);
    
    return {
      playerName: playerData.name,
      stats: playerData.stats,
      sportStats,
      description: {
        nickname: this.generateNickname(playerData.name, playerData.sport),
        position: playerData.position,
        team: playerData.team,
        biography: this.generateBiography(playerData),
        achievements: playerData.achievements,
        playingStyle: this.generatePlayingStyle(playerData.sport, playerData.stats),
        strengths: this.generateStrengths(playerData.stats),
        signature_moves: [playerData.signature]
      },
      rarity: this.calculateRarity(playerData.stats.overall),
      confidence: 0.95
    };
  }

  private generateFictionalStats(playerName?: string, visionData?: VisionAnalysisResult): StatsGenerationResult {
    console.log('🎲 Generating fictional stats based on AI analysis');

    const sport = visionData?.subject?.sport || 'basketball';
    const isActionMoment = visionData?.subject?.actionMoment || false;
    const teamColors = visionData?.teamColors?.palette || [];

    // Base stats influenced by vision analysis
    let baseOverall = 75 + Math.random() * 20; // 75-95 range
    
    // Boost for action moments (suggests skill)
    if (isActionMoment) {
      baseOverall += 5;
    }

    // Boost for good image quality
    if (visionData?.composition?.qualityScore && visionData.composition.qualityScore > 0.8) {
      baseOverall += 3;
    }

    const stats: PlayerStats = {
      overall: Math.round(baseOverall),
      offense: Math.round(baseOverall + (Math.random() - 0.5) * 15),
      defense: Math.round(baseOverall + (Math.random() - 0.5) * 15), 
      speed: Math.round(baseOverall + (Math.random() - 0.5) * 20),
      skill: Math.round(baseOverall + (Math.random() - 0.5) * 10)
    };

    // Ensure stats are within bounds
    Object.keys(stats).forEach(key => {
      stats[key] = Math.max(40, Math.min(99, stats[key]));
    });

    const generatedName = playerName || this.generatePlayerName(sport);
    const sportStats = this.generateSportSpecificStats(sport, stats.overall);
    
    return {
      playerName: generatedName,
      stats,
      sportStats,
      description: this.generateDescription(generatedName, sport, stats, visionData),
      rarity: this.calculateRarity(stats.overall),
      confidence: 0.82
    };
  }

  private generateSportSpecificStats(sport: string, overall: number): Partial<SportSpecificStats> {
    const statRange = (base: number, variance: number = 10) => 
      Math.max(0, base + (Math.random() - 0.5) * variance);

    switch (sport) {
      case 'basketball':
        return {
          basketball: {
            points: statRange(overall * 0.35, 8),
            rebounds: statRange(overall * 0.15, 4),
            assists: statRange(overall * 0.12, 3),
            steals: statRange(overall * 0.03, 1),
            blocks: statRange(overall * 0.02, 1),
            fieldGoalPercent: statRange(overall * 0.5, 10),
            threePointPercent: statRange(overall * 0.4, 8),
            freeThrowPercent: statRange(overall * 0.8, 5)
          }
        };

      case 'football':
        return {
          football: {
            passingYards: statRange(overall * 45, 500),
            touchdowns: statRange(overall * 0.4, 8),
            completions: statRange(overall * 2.2, 20),
            attempts: statRange(overall * 3.5, 30),
            interceptions: statRange(overall * 0.1, 3),
            qbRating: statRange(overall * 1.1, 15)
          }
        };

      case 'baseball':
        return {
          baseball: {
            battingAverage: statRange(overall * 0.003, 0.05),
            homeRuns: statRange(overall * 0.4, 10),
            rbi: statRange(overall * 0.9, 15),
            era: statRange(4.5 - (overall * 0.03), 1),
            strikeouts: statRange(overall * 2.2, 30),
            saves: statRange(overall * 0.4, 8)
          }
        };

      case 'soccer':
        return {
          soccer: {
            goals: statRange(overall * 0.3, 5),
            assists: statRange(overall * 0.2, 4),
            saves: statRange(overall * 0.8, 10),
            cleanSheets: statRange(overall * 0.2, 5),
            yellowCards: statRange(overall * 0.05, 2),
            redCards: statRange(overall * 0.01, 1)
          }
        };

      default:
        return {};
    }
  }

  private generateDescription(
    name: string,
    sport: string,
    stats: PlayerStats,
    visionData?: VisionAnalysisResult
  ): PlayerDescription {
    const mood = visionData?.mood || 'classic';
    const teamName = visionData?.subject?.team || this.generateTeamName(sport);
    
    return {
      nickname: this.generateNickname(name, sport),
      position: this.generatePosition(sport, stats),
      team: teamName,
      biography: this.generateBiography({ name, sport, team: teamName, stats }),
      achievements: this.generateAchievements(sport, stats.overall),
      playingStyle: this.generatePlayingStyle(sport, stats),
      strengths: this.generateStrengths(stats),
      signature_moves: this.generateSignatureMoves(sport, stats, mood)
    };
  }

  private generatePlayerName(sport: string): string {
    const firstNames = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Avery', 'Cameron'];
    const lastNames = {
      basketball: ['Johnson', 'Williams', 'Davis', 'Miller', 'Thompson', 'Garcia'],
      football: ['Smith', 'Jones', 'Brown', 'Wilson', 'Moore', 'Taylor'],
      baseball: ['Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin'],
      soccer: ['Rodriguez', 'Martinez', 'Gonzalez', 'Lopez', 'Hernandez', 'Perez']
    };

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const sportLastNames = lastNames[sport as keyof typeof lastNames] || lastNames.basketball;
    const lastName = sportLastNames[Math.floor(Math.random() * sportLastNames.length)];

    return `${firstName} ${lastName}`;
  }

  private generateNickname(name: string, sport: string): string {
    const nicknamePrefixes = ['The', 'Big', 'Flash', 'Steel', 'Iron', 'Golden'];
    const nicknameSuffixes = {
      basketball: ['Shooter', 'Dunker', 'King', 'Machine', 'Lightning'],
      football: ['Cannon', 'Rocket', 'Tank', 'Bullet', 'Thunder'],
      baseball: ['Slugger', 'Ace', 'Hammer', 'Rocket', 'Diamond'],
      soccer: ['Maestro', 'Wizard', 'Bullet', 'Flash', 'Magician']
    };

    const prefix = nicknamePrefixes[Math.floor(Math.random() * nicknamePrefixes.length)];
    const sportSuffixes = nicknameSuffixes[sport as keyof typeof nicknameSuffixes] || nicknameSuffixes.basketball;
    const suffix = sportSuffixes[Math.floor(Math.random() * sportSuffixes.length)];

    return `${prefix} ${suffix}`;
  }

  private generatePosition(sport: string, stats: PlayerStats): string {
    const positions = {
      basketball: stats.speed > stats.skill ? 'Guard' : stats.offense > stats.defense ? 'Forward' : 'Center',
      football: stats.offense > 90 ? 'Quarterback' : stats.speed > 85 ? 'Wide Receiver' : 'Running Back',
      baseball: stats.skill > 85 ? 'Pitcher' : stats.speed > 80 ? 'Outfielder' : 'Infielder',
      soccer: stats.offense > stats.defense ? 'Forward' : stats.defense > 85 ? 'Defender' : 'Midfielder'
    };

    return positions[sport as keyof typeof positions] || 'Player';
  }

  private generateTeamName(sport: string): string {
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Boston', 'Dallas'];
    const mascots = {
      basketball: ['Hawks', 'Eagles', 'Lions', 'Tigers', 'Storm', 'Fire'],
      football: ['Patriots', 'Cowboys', 'Giants', 'Raiders', 'Panthers', 'Falcons'],
      baseball: ['Yankees', 'Dodgers', 'Cubs', 'Angels', 'Cardinals', 'Brewers'],
      soccer: ['United', 'City', 'FC', 'Athletic', 'Real', 'Club']
    };

    const city = cities[Math.floor(Math.random() * cities.length)];
    const sportMascots = mascots[sport as keyof typeof mascots] || mascots.basketball;
    const mascot = sportMascots[Math.floor(Math.random() * sportMascots.length)];

    return `${city} ${mascot}`;
  }

  private generateBiography(player: any): string {
    const templates = [
      `${player.name} is a dynamic ${player.sport} player known for exceptional court vision and leadership.`,
      `A versatile athlete, ${player.name} brings intensity and skill to every game with the ${player.team}.`,
      `${player.name} has quickly become a fan favorite with outstanding performance and team-first attitude.`,
      `Rising star ${player.name} combines natural talent with relentless work ethic to dominate the game.`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  private generateAchievements(sport: string, overall: number): string[] {
    const achievements = [];
    
    if (overall > 90) {
      achievements.push('All-Star Selection', 'League MVP Candidate');
    }
    if (overall > 85) {
      achievements.push('Rookie of the Year', 'Team Captain');
    }
    if (overall > 80) {
      achievements.push('Rising Star Award', 'Player of the Month');
    }

    achievements.push('Team Leading Scorer', 'Community Champion');
    
    return achievements.slice(0, 3);
  }

  private generatePlayingStyle(sport: string, stats: PlayerStats): string {
    if (stats.offense > stats.defense + 10) return 'Aggressive Offensive Player';
    if (stats.defense > stats.offense + 10) return 'Defensive Specialist';
    if (stats.speed > 85) return 'Fast-Paced Dynamic Player';
    if (stats.skill > 90) return 'Technical Specialist';
    return 'Well-Rounded Two-Way Player';
  }

  private generateStrengths(stats: PlayerStats): string[] {
    const strengths = [];
    
    if (stats.offense > 85) strengths.push('Scoring Ability');
    if (stats.defense > 85) strengths.push('Defensive Prowess');
    if (stats.speed > 85) strengths.push('Speed & Agility');
    if (stats.skill > 85) strengths.push('Technical Skills');
    
    if (strengths.length === 0) {
      strengths.push('Versatility', 'Team Leadership');
    }

    return strengths.slice(0, 3);
  }

  private generateSignatureMoves(sport: string, stats: PlayerStats, mood: string): string[] {
    const moves = {
      basketball: ['Fadeaway Jumper', 'Crossover Dribble', 'Slam Dunk', 'Three-Point Shot'],
      football: ['Touchdown Pass', 'Game-Winning Drive', 'Defensive Tackle', 'Field Goal'],
      baseball: ['Home Run Swing', 'Curveball', 'Stolen Base', 'Double Play'],
      soccer: ['Bicycle Kick', 'Free Kick Goal', 'Defensive Save', 'Through Pass']
    };

    const sportMoves = moves[sport as keyof typeof moves] || moves.basketball;
    return [sportMoves[Math.floor(Math.random() * sportMoves.length)]];
  }

  private calculateRarity(overall: number): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' {
    if (overall >= 95) return 'legendary';
    if (overall >= 88) return 'epic';
    if (overall >= 82) return 'rare';
    if (overall >= 75) return 'uncommon';
    return 'common';
  }

  private getFallbackStats(playerName?: string): StatsGenerationResult {
    return {
      playerName: playerName || 'Mystery Player',
      stats: { overall: 75, offense: 75, defense: 75, speed: 75, skill: 75 },
      sportStats: {},
      description: {
        nickname: 'The Unknown',
        position: 'Player',
        team: 'Independent',
        biography: 'A talented athlete with unlimited potential.',
        achievements: ['Rising Star'],
        playingStyle: 'Versatile Player',
        strengths: ['Determination'],
        signature_moves: ['Signature Move']
      },
      rarity: 'common',
      confidence: 0.5
    };
  }

  // Generate dynamic stat bars that animate
  generateAnimatedStatBars(stats: PlayerStats): Array<{
    label: string;
    value: number;
    maxValue: number;
    color: string;
    animationDelay: number;
  }> {
    return [
      {
        label: 'Overall',
        value: stats.overall,
        maxValue: 99,
        color: '#6366f1',
        animationDelay: 0
      },
      {
        label: 'Offense',
        value: stats.offense,
        maxValue: 99,
        color: '#ef4444',
        animationDelay: 0.1
      },
      {
        label: 'Defense',
        value: stats.defense,
        maxValue: 99,
        color: '#10b981',
        animationDelay: 0.2
      },
      {
        label: 'Speed',
        value: stats.speed,
        maxValue: 99,
        color: '#f59e0b',
        animationDelay: 0.3
      },
      {
        label: 'Skill',
        value: stats.skill,
        maxValue: 99,
        color: '#8b5cf6',
        animationDelay: 0.4
      }
    ];
  }
}

export const smartStatsService = new SmartStatsService();