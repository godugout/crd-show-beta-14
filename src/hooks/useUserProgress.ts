import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { toast } from 'sonner';

export interface UserProgress {
  cards_created_count: number;
  unique_templates_used: number;
  effects_applied_count: number;
  days_active_streak: number;
  experience_points: number;
  level: number;
  progress_milestones: string[];
}

export interface ProgressMilestone {
  id: string;
  title: string;
  description: string;
  requirement: number;
  type: 'cards_created' | 'templates_used' | 'effects_applied' | 'streak';
  unlocks?: {
    type: 'template' | 'case_style' | 'achievement';
    name: string;
    preview?: string;
  };
}

const PROGRESS_MILESTONES: ProgressMilestone[] = [
  {
    id: 'first_card',
    title: 'Creator Debut',
    description: 'Create your first card',
    requirement: 1,
    type: 'cards_created',
    unlocks: { type: 'achievement', name: 'First Card Created' }
  },
  {
    id: 'card_creator',
    title: 'Card Creator',
    description: 'Create 5 cards',
    requirement: 5,
    type: 'cards_created',
    unlocks: { type: 'case_style', name: 'Toploader Case' }
  },
  {
    id: 'template_explorer',
    title: 'Template Explorer',
    description: 'Use 3 different templates',
    requirement: 3,
    type: 'templates_used',
    unlocks: { type: 'template', name: 'Premium Template Pack' }
  },
  {
    id: 'effects_master',
    title: 'Effects Master',
    description: 'Apply effects to 10 cards',
    requirement: 10,
    type: 'effects_applied',
    unlocks: { type: 'case_style', name: 'Magnetic Case' }
  },
  {
    id: 'dedicated_creator',
    title: 'Dedicated Creator',
    description: 'Maintain a 7-day active streak',
    requirement: 7,
    type: 'streak',
    unlocks: { type: 'case_style', name: 'Graded Slab' }
  },
  {
    id: 'prolific_creator',
    title: 'Prolific Creator',
    description: 'Create 25 cards',
    requirement: 25,
    type: 'cards_created',
    unlocks: { type: 'achievement', name: 'Master Creator Badge' }
  }
];

export const useUserProgress = () => {
  const { user } = useAuth();
  const [lastNotifiedMilestones, setLastNotifiedMilestones] = useState<string[]>([]);

  const {
    data: progress,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user-progress', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          cards_created_count,
          unique_templates_used,
          effects_applied_count,
          days_active_streak,
          experience_points,
          level,
          progress_milestones
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;

      return {
        ...data,
        progress_milestones: data.progress_milestones || []
      } as UserProgress;
    },
    enabled: !!user?.id,
    refetchInterval: 30000 // Refetch every 30 seconds to check for progress updates
  });

  // Check for new milestone achievements
  useEffect(() => {
    if (!progress) return;

    const newlyAchievedMilestones = PROGRESS_MILESTONES.filter(milestone => {
      const isAchieved = checkMilestoneAchieved(milestone, progress);
      const wasNotified = lastNotifiedMilestones.includes(milestone.id);
      const wasAlreadyAchieved = progress.progress_milestones.includes(milestone.id);

      return isAchieved && !wasNotified && !wasAlreadyAchieved;
    });

    newlyAchievedMilestones.forEach(milestone => {
      showMilestoneNotification(milestone);
      updateMilestoneInDatabase(milestone.id);
    });

    if (newlyAchievedMilestones.length > 0) {
      setLastNotifiedMilestones(prev => [
        ...prev,
        ...newlyAchievedMilestones.map(m => m.id)
      ]);
    }
  }, [progress, lastNotifiedMilestones]);

  const checkMilestoneAchieved = (milestone: ProgressMilestone, progress: UserProgress): boolean => {
    switch (milestone.type) {
      case 'cards_created':
        return progress.cards_created_count >= milestone.requirement;
      case 'templates_used':
        return progress.unique_templates_used >= milestone.requirement;
      case 'effects_applied':
        return progress.effects_applied_count >= milestone.requirement;
      case 'streak':
        return progress.days_active_streak >= milestone.requirement;
      default:
        return false;
    }
  };

  const showMilestoneNotification = (milestone: ProgressMilestone) => {
    const unlockMessage = milestone.unlocks 
      ? `🎉 ${milestone.unlocks.name} Unlocked!`
      : '🏆 Achievement Unlocked!';

    toast.success(unlockMessage, {
      description: `${milestone.title}: ${milestone.description}`,
      duration: 5000,
    });
  };

  const updateMilestoneInDatabase = async (milestoneId: string) => {
    if (!user?.id || !progress) return;

    const updatedMilestones = [...progress.progress_milestones, milestoneId];

    await supabase
      .from('user_profiles')
      .update({ 
        progress_milestones: updatedMilestones,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
  };

  const getNextMilestone = (type: ProgressMilestone['type']) => {
    if (!progress) return null;

    const relevantMilestones = PROGRESS_MILESTONES
      .filter(m => m.type === type)
      .filter(m => !progress.progress_milestones.includes(m.id))
      .sort((a, b) => a.requirement - b.requirement);

    return relevantMilestones[0] || null;
  };

  const getMilestoneProgress = (milestone: ProgressMilestone) => {
    if (!progress) return 0;

    const currentValue = progress[milestone.type === 'streak' ? 'days_active_streak' : 
                                 milestone.type === 'cards_created' ? 'cards_created_count' :
                                 milestone.type === 'templates_used' ? 'unique_templates_used' :
                                 'effects_applied_count'];

    return Math.min((currentValue / milestone.requirement) * 100, 100);
  };

  return {
    progress,
    isLoading,
    error,
    refetch,
    milestones: PROGRESS_MILESTONES,
    getNextMilestone,
    getMilestoneProgress,
    checkMilestoneAchieved: (milestone: ProgressMilestone) => 
      progress ? checkMilestoneAchieved(milestone, progress) : false
  };
};