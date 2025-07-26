import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/providers/AuthProvider';

interface StyleUsageStats {
  count: number;
  lastUsed: Date;
  averageTime: number;
  publishRate: number;
  completionRate: number;
}

interface UserPreferences {
  favoriteStyle: string;
  timeOfDay: Record<string, string>;
  contentType: Record<string, string>;
  deviceType: Record<string, string>;
}

interface StyleAnalytics {
  userId: string;
  styleUsage: Record<string, StyleUsageStats>;
  preferences: UserPreferences;
  totalCreations: number;
  averageSessionTime: number;
}

interface CreationContext {
  contentType: string;
  timeOfDay: string;
  deviceType: string;
  imageAnalysis?: any;
}

const STORAGE_KEY = 'crdmkr_style_analytics';

export const useStyleLearning = () => {
  const { user } = useAuth();
  const [userPreferences, setUserPreferences] = useState<StyleAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user preferences from localStorage
  useEffect(() => {
    if (!user?.id) return;
    
    loadUserPreferences();
  }, [user?.id]);

  const loadUserPreferences = () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${user.id}`);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        Object.values(parsed.styleUsage).forEach((stats: any) => {
          stats.lastUsed = new Date(stats.lastUsed);
        });
        setUserPreferences(parsed);
      } else {
        // Initialize default preferences
        const defaultPreferences: StyleAnalytics = {
          userId: user.id,
          styleUsage: {},
          preferences: {
            favoriteStyle: 'classic',
            timeOfDay: {},
            contentType: {},
            deviceType: {}
          },
          totalCreations: 0,
          averageSessionTime: 0
        };
        setUserPreferences(defaultPreferences);
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeOfDay = (): string => {
    const hour = new Date().getHours();
    if (hour < 6) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const getDeviceType = (): string => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const isTablet = /iPad|Tablet/i.test(navigator.userAgent);
    return isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
  };

  const detectContentType = (imageAnalysis?: any): string => {
    if (imageAnalysis?.subject?.category) {
      return imageAnalysis.subject.category;
    }
    return 'general';
  };

  const trackStyleUsage = useCallback((
    styleId: string, 
    duration: number, 
    published: boolean,
    context?: Partial<CreationContext>
  ) => {
    if (!user?.id || !userPreferences) return;

    const timeOfDay = getTimeOfDay();
    const deviceType = getDeviceType();
    const contentType = context?.contentType || detectContentType(context?.imageAnalysis);

    // Update local preferences
    const updatedPreferences = { ...userPreferences };
    
    // Update style usage stats
    if (!updatedPreferences.styleUsage[styleId]) {
      updatedPreferences.styleUsage[styleId] = {
        count: 0,
        lastUsed: new Date(),
        averageTime: 0,
        publishRate: 0,
        completionRate: 0
      };
    }

    const stats = updatedPreferences.styleUsage[styleId];
    const newCount = stats.count + 1;
    
    // Update averages
    stats.averageTime = (stats.averageTime * stats.count + duration) / newCount;
    stats.publishRate = published 
      ? (stats.publishRate * stats.count + 1) / newCount
      : (stats.publishRate * stats.count) / newCount;
    
    stats.count = newCount;
    stats.lastUsed = new Date();

    // Update contextual preferences
    if (published) {
      updatedPreferences.preferences.timeOfDay[timeOfDay] = styleId;
      updatedPreferences.preferences.contentType[contentType] = styleId;
      updatedPreferences.preferences.deviceType[deviceType] = styleId;
    }

    // Update favorite style based on overall usage
    const mostUsedStyle = Object.entries(updatedPreferences.styleUsage)
      .sort(([,a], [,b]) => b.count - a.count)[0];
    
    if (mostUsedStyle) {
      updatedPreferences.preferences.favoriteStyle = mostUsedStyle[0];
    }

    updatedPreferences.totalCreations += 1;

    setUserPreferences(updatedPreferences);

    // Save to localStorage
    saveUserPreferences(updatedPreferences);
  }, [user?.id, userPreferences]);

  const saveUserPreferences = (preferences: StyleAnalytics) => {
    if (!user?.id) return;

    try {
      localStorage.setItem(`${STORAGE_KEY}_${user.id}`, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  };

  const predictOptimalStyle = useCallback((context: CreationContext): string => {
    if (!userPreferences || Object.keys(userPreferences.styleUsage).length === 0) {
      return 'classic'; // Default for new users
    }

    const currentTime = getTimeOfDay();
    const factors: Array<{ styleId: string; weight: number }> = [];

    // Time-based preference
    const timePreference = userPreferences.preferences.timeOfDay[currentTime];
    if (timePreference) {
      factors.push({ styleId: timePreference, weight: 0.3 });
    }

    // Content-based preference
    const contentPreference = userPreferences.preferences.contentType[context.contentType];
    if (contentPreference) {
      factors.push({ styleId: contentPreference, weight: 0.4 });
    }

    // Device-based preference
    const devicePreference = userPreferences.preferences.deviceType[context.deviceType];
    if (devicePreference) {
      factors.push({ styleId: devicePreference, weight: 0.2 });
    }

    // Recent usage pattern
    const recentStyles = Object.entries(userPreferences.styleUsage)
      .sort(([,a], [,b]) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
      .slice(0, 3);
    
    recentStyles.forEach(([styleId], index) => {
      factors.push({ 
        styleId, 
        weight: 0.1 * (1 - index * 0.3) // Decreasing weight for older styles
      });
    });

    // Calculate weighted scores
    const styleScores: Record<string, number> = {};
    factors.forEach(({ styleId, weight }) => {
      styleScores[styleId] = (styleScores[styleId] || 0) + weight;
    });

    // Return style with highest score, fallback to favorite
    const predictedStyle = Object.entries(styleScores)
      .sort(([,a], [,b]) => b - a)[0];

    return predictedStyle ? predictedStyle[0] : userPreferences.preferences.favoriteStyle;
  }, [userPreferences]);

  const getStyleInsights = useCallback(() => {
    if (!userPreferences) return null;

    const totalUsage = Object.values(userPreferences.styleUsage)
      .reduce((sum, stats) => sum + stats.count, 0);

    const insights = {
      mostUsedStyle: userPreferences.preferences.favoriteStyle,
      totalCreations: totalUsage,
      averageCreationTime: Object.values(userPreferences.styleUsage)
        .reduce((sum, stats, _, arr) => sum + stats.averageTime / arr.length, 0),
      publishRate: Object.values(userPreferences.styleUsage)
        .reduce((sum, stats, _, arr) => sum + stats.publishRate / arr.length, 0),
      timePatterns: userPreferences.preferences.timeOfDay,
      contentPatterns: userPreferences.preferences.contentType,
      styleDistribution: Object.entries(userPreferences.styleUsage)
        .map(([styleId, stats]) => ({ styleId, count: stats.count, percentage: stats.count / totalUsage * 100 }))
        .sort((a, b) => b.count - a.count)
    };

    return insights;
  }, [userPreferences]);

  return {
    userPreferences,
    isLoading,
    trackStyleUsage,
    predictOptimalStyle,
    getStyleInsights,
    loadUserPreferences
  };
};