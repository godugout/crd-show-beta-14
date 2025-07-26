interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category: 'creation' | 'exploration' | 'social' | 'mastery';
}

interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streakDays: number;
  lastActiveDate: string;
  achievements: Achievement[];
  unlockedFeatures: string[];
  dailyChallengeCompleted: boolean;
  weeklyGoalProgress: number;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'create' | 'experiment' | 'social';
  requirements: Record<string, any>;
  reward: {
    xp: number;
    unlocks?: string[];
  };
  expiresAt: string;
  completed: boolean;
}

export class GamificationService {
  private userProgress: UserProgress;
  private achievements: Achievement[] = [];

  constructor() {
    this.userProgress = this.loadUserProgress();
    this.initializeAchievements();
    this.checkDailyStreak();
  }

  private loadUserProgress(): UserProgress {
    const stored = localStorage.getItem('cardshow_user_progress');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to parse user progress from storage');
      }
    }

    return {
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      streakDays: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      achievements: [],
      unlockedFeatures: ['basic-frames', 'basic-effects'],
      dailyChallengeCompleted: false,
      weeklyGoalProgress: 0
    };
  }

  private saveUserProgress() {
    localStorage.setItem('cardshow_user_progress', JSON.stringify(this.userProgress));
  }

  private initializeAchievements() {
    this.achievements = [
      {
        id: 'first_card',
        name: 'Card Creator',
        description: 'Create your first card',
        icon: '🎨',
        points: 10,
        unlocked: false,
        progress: 0,
        maxProgress: 1,
        category: 'creation'
      },
      {
        id: 'template_explorer',
        name: 'Template Explorer',
        description: 'Try 5 different templates',
        icon: '🔍',
        points: 25,
        unlocked: false,
        progress: 0,
        maxProgress: 5,
        category: 'exploration'
      },
      {
        id: 'effect_master',
        name: 'Effect Master',
        description: 'Use 10 different effects',
        icon: '✨',
        points: 50,
        unlocked: false,
        progress: 0,
        maxProgress: 10,
        category: 'mastery'
      },
      {
        id: 'streak_warrior',
        name: 'Streak Warrior',
        description: 'Create cards for 7 consecutive days',
        icon: '🔥',
        points: 100,
        unlocked: false,
        progress: 0,
        maxProgress: 7,
        category: 'creation'
      },
      {
        id: 'social_butterfly',
        name: 'Social Butterfly',
        description: 'Share 5 cards on social media',
        icon: '🦋',
        points: 30,
        unlocked: false,
        progress: 0,
        maxProgress: 5,
        category: 'social'
      },
      {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Spend more than 10 minutes perfecting a single card',
        icon: '💎',
        points: 20,
        unlocked: false,
        progress: 0,
        maxProgress: 1,
        category: 'mastery'
      }
    ];

    // Merge with user's achievement progress
    const userAchievements = this.userProgress.achievements;
    this.achievements = this.achievements.map(achievement => {
      const userAchievement = userAchievements.find(ua => ua.id === achievement.id);
      return userAchievement ? { ...achievement, ...userAchievement } : achievement;
    });
  }

  private checkDailyStreak() {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = this.userProgress.lastActiveDate;
    
    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastActive === yesterdayStr) {
        // Continue streak
        this.userProgress.streakDays++;
        this.updateAchievementProgress('streak_warrior', this.userProgress.streakDays);
      } else if (lastActive !== today) {
        // Break streak
        this.userProgress.streakDays = 1;
      }
      
      this.userProgress.lastActiveDate = today;
      this.userProgress.dailyChallengeCompleted = false;
      this.saveUserProgress();
    }
  }

  public awardXP(action: string, amount: number = 0): number {
    const xpAmounts: Record<string, number> = {
      'card_created': 20,
      'template_used': 5,
      'effect_applied': 3,
      'card_shared': 15,
      'daily_challenge_completed': 50,
      'achievement_unlocked': 25,
      'feature_explored': 10,
      'tutorial_completed': 30
    };

    const xpToAward = amount || xpAmounts[action] || 5;
    this.userProgress.xp += xpToAward;

    // Check for level up
    while (this.userProgress.xp >= this.userProgress.xpToNextLevel) {
      this.levelUp();
    }

    // Track specific actions for achievements
    this.trackActionForAchievements(action);
    
    this.saveUserProgress();
    return xpToAward;
  }

  private levelUp() {
    this.userProgress.xp -= this.userProgress.xpToNextLevel;
    this.userProgress.level++;
    this.userProgress.xpToNextLevel = Math.floor(this.userProgress.xpToNextLevel * 1.2);

    // Unlock features based on level
    this.unlockLevelFeatures();
    
    // Show level up celebration (would trigger UI notification)
    this.triggerLevelUpCelebration();
  }

  private unlockLevelFeatures() {
    const levelUnlocks: Record<number, string[]> = {
      2: ['advanced-filters'],
      3: ['custom-fonts'],
      5: ['premium-effects'],
      7: ['collaboration-mode'],
      10: ['ai-style-transfer'],
      15: ['nft-export'],
      20: ['custom-templates']
    };

    const unlocks = levelUnlocks[this.userProgress.level];
    if (unlocks) {
      this.userProgress.unlockedFeatures.push(...unlocks);
      // Trigger unlock notification
      this.triggerFeatureUnlock(unlocks);
    }
  }

  private triggerLevelUpCelebration() {
    // This would trigger UI animations/sounds
    console.log(`🎉 Level up! Now level ${this.userProgress.level}`);
  }

  private triggerFeatureUnlock(features: string[]) {
    // This would trigger UI notifications
    console.log(`🔓 Unlocked: ${features.join(', ')}`);
  }

  private trackActionForAchievements(action: string) {
    switch (action) {
      case 'card_created':
        this.updateAchievementProgress('first_card', 1);
        break;
      case 'template_used':
        this.updateAchievementProgress('template_explorer', 1);
        break;
      case 'effect_applied':
        this.updateAchievementProgress('effect_master', 1);
        break;
      case 'card_shared':
        this.updateAchievementProgress('social_butterfly', 1);
        break;
    }
  }

  private updateAchievementProgress(achievementId: string, increment: number = 1) {
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlocked) return;

    achievement.progress = Math.min(achievement.progress + increment, achievement.maxProgress);
    
    if (achievement.progress >= achievement.maxProgress) {
      this.unlockAchievement(achievement);
    }

    // Update user progress
    const userAchievementIndex = this.userProgress.achievements.findIndex(a => a.id === achievementId);
    if (userAchievementIndex > -1) {
      this.userProgress.achievements[userAchievementIndex] = achievement;
    } else {
      this.userProgress.achievements.push(achievement);
    }
  }

  private unlockAchievement(achievement: Achievement) {
    achievement.unlocked = true;
    this.awardXP('achievement_unlocked', achievement.points);
    
    // Trigger achievement unlock celebration
    this.triggerAchievementUnlock(achievement);
  }

  private triggerAchievementUnlock(achievement: Achievement) {
    // This would trigger UI animations/sounds
    console.log(`🏆 Achievement unlocked: ${achievement.name}!`);
  }

  public getDailyChallenge(): DailyChallenge {
    const challenges = [
      {
        id: 'create_sports_card',
        title: 'Sports Fan',
        description: 'Create a sports-themed card',
        type: 'create' as const,
        requirements: { category: 'sports' },
        reward: { xp: 30, unlocks: ['sports-frames'] }
      },
      {
        id: 'try_three_effects',
        title: 'Effect Explorer',
        description: 'Try 3 different effects on a single card',
        type: 'experiment' as const,
        requirements: { effects: 3 },
        reward: { xp: 25 }
      },
      {
        id: 'share_creation',
        title: 'Show Off',
        description: 'Share your creation on social media',
        type: 'social' as const,
        requirements: { share: true },
        reward: { xp: 40 }
      }
    ];

    const today = new Date().toISOString().split('T')[0];
    const challengeIndex = new Date().getDay(); // Use day of week for variety
    const challenge = challenges[challengeIndex % challenges.length];

    return {
      ...challenge,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      completed: this.userProgress.dailyChallengeCompleted
    };
  }

  public completeDailyChallenge() {
    if (!this.userProgress.dailyChallengeCompleted) {
      this.userProgress.dailyChallengeCompleted = true;
      this.awardXP('daily_challenge_completed');
      this.saveUserProgress();
    }
  }

  public getProgress(): UserProgress {
    return { ...this.userProgress };
  }

  public getAvailableAchievements(): Achievement[] {
    return [...this.achievements];
  }

  public isFeatureUnlocked(feature: string): boolean {
    return this.userProgress.unlockedFeatures.includes(feature);
  }

  public getStreakReward(): { days: number; bonus: number } | null {
    const milestones = [3, 7, 14, 30];
    const bonuses = [10, 25, 50, 100];
    
    const milestoneIndex = milestones.findIndex(m => m === this.userProgress.streakDays);
    if (milestoneIndex > -1) {
      return {
        days: this.userProgress.streakDays,
        bonus: bonuses[milestoneIndex]
      };
    }
    
    return null;
  }
}

export const gamificationService = new GamificationService();