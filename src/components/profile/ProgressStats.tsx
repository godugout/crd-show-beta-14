import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Sparkles, Calendar, Target } from 'lucide-react';
import { useUserProgress } from '@/hooks/useUserProgress';
import { ProgressNotificationTest } from './ProgressNotificationTest';

export const ProgressStats = () => {
  const { progress, isLoading, milestones, getNextMilestone, getMilestoneProgress } = useUserProgress();

  if (isLoading || !progress) {
    return (
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-crd-white">Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-crd-mediumGray rounded"></div>
            <div className="h-4 bg-crd-mediumGray rounded w-3/4"></div>
            <div className="h-4 bg-crd-mediumGray rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const nextCardMilestone = getNextMilestone('cards_created');
  const nextTemplateMilestone = getNextMilestone('templates_used');
  const nextEffectsMilestone = getNextMilestone('effects_applied');
  const nextStreakMilestone = getNextMilestone('streak');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Current Stats */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-crd-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-crd-blue" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-crd-darker rounded-lg">
              <div className="text-2xl font-bold text-crd-white">{progress.cards_created_count}</div>
              <div className="text-sm text-crd-lightGray">Cards Created</div>
            </div>
            <div className="text-center p-3 bg-crd-darker rounded-lg">
              <div className="text-2xl font-bold text-crd-white">{progress.unique_templates_used}</div>
              <div className="text-sm text-crd-lightGray">Templates Used</div>
            </div>
            <div className="text-center p-3 bg-crd-darker rounded-lg">
              <div className="text-2xl font-bold text-crd-white">{progress.effects_applied_count}</div>
              <div className="text-sm text-crd-lightGray">Effects Applied</div>
            </div>
            <div className="text-center p-3 bg-crd-darker rounded-lg">
              <div className="text-2xl font-bold text-crd-blue">{progress.days_active_streak}</div>
              <div className="text-sm text-crd-lightGray">Day Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Milestones */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-crd-white flex items-center gap-2">
            <Target className="h-5 w-5 text-crd-green" />
            Next Milestones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {nextCardMilestone && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-crd-white">{nextCardMilestone.title}</span>
                <span className="text-xs text-crd-lightGray">
                  {progress.cards_created_count}/{nextCardMilestone.requirement}
                </span>
              </div>
              <Progress 
                value={getMilestoneProgress(nextCardMilestone)} 
                className="h-2"
              />
              {nextCardMilestone.unlocks && (
                <Badge variant="secondary" className="text-xs">
                  Unlocks: {nextCardMilestone.unlocks.name}
                </Badge>
              )}
            </div>
          )}

          {nextTemplateMilestone && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-crd-white">{nextTemplateMilestone.title}</span>
                <span className="text-xs text-crd-lightGray">
                  {progress.unique_templates_used}/{nextTemplateMilestone.requirement}
                </span>
              </div>
              <Progress 
                value={getMilestoneProgress(nextTemplateMilestone)} 
                className="h-2"
              />
              {nextTemplateMilestone.unlocks && (
                <Badge variant="secondary" className="text-xs">
                  Unlocks: {nextTemplateMilestone.unlocks.name}
                </Badge>
              )}
            </div>
          )}

          {nextEffectsMilestone && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-crd-white">{nextEffectsMilestone.title}</span>
                <span className="text-xs text-crd-lightGray">
                  {progress.effects_applied_count}/{nextEffectsMilestone.requirement}
                </span>
              </div>
              <Progress 
                value={getMilestoneProgress(nextEffectsMilestone)} 
                className="h-2"
              />
              {nextEffectsMilestone.unlocks && (
                <Badge variant="secondary" className="text-xs">
                  Unlocks: {nextEffectsMilestone.unlocks.name}
                </Badge>
              )}
            </div>
          )}

          {nextStreakMilestone && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-crd-white">{nextStreakMilestone.title}</span>
                <span className="text-xs text-crd-lightGray">
                  {progress.days_active_streak}/{nextStreakMilestone.requirement}
                </span>
              </div>
              <Progress 
                value={getMilestoneProgress(nextStreakMilestone)} 
                className="h-2"
              />
              {nextStreakMilestone.unlocks && (
                <Badge variant="secondary" className="text-xs">
                  Unlocks: {nextStreakMilestone.unlocks.name}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="bg-crd-dark border-crd-mediumGray md:col-span-2">
        <CardHeader>
          <CardTitle className="text-crd-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-crd-yellow" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {milestones.map((milestone) => {
              const isAchieved = progress.progress_milestones.includes(milestone.id);
              const progressValue = getMilestoneProgress(milestone);
              
              return (
                <div
                  key={milestone.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isAchieved
                      ? 'bg-crd-green/10 border-crd-green'
                      : 'bg-crd-darker border-crd-mediumGray'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={`font-medium ${isAchieved ? 'text-crd-green' : 'text-crd-white'}`}>
                      {milestone.title}
                    </h4>
                    {isAchieved && <Trophy className="h-4 w-4 text-crd-yellow" />}
                  </div>
                  <p className="text-sm text-crd-lightGray mb-2">
                    {milestone.description}
                  </p>
                  {!isAchieved && (
                    <div className="space-y-1">
                      <Progress value={progressValue} className="h-1" />
                      <div className="text-xs text-crd-lightGray">
                        {Math.round(progressValue)}% Complete
                      </div>
                    </div>
                  )}
                  {milestone.unlocks && (
                    <Badge 
                      variant={isAchieved ? "default" : "outline"} 
                      className="text-xs mt-2"
                    >
                      {milestone.unlocks.name}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Development Tools */}
      <ProgressNotificationTest />
    </div>
  );
};