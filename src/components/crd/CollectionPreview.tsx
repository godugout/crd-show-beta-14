import React, { useMemo } from 'react';
import { CRDEntry } from '@/lib/cardshowDNA';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Users, Target, Award, CheckCircle, Clock, Lock } from 'lucide-react';

interface CollectionPreviewProps {
  selectedDNA: CRDEntry[];
}

interface CollectionSet {
  id: string;
  name: string;
  description: string;
  requiredGroups: string[];
  completionBonus: string;
  powerBonus: number;
  isComplete: boolean;
  progress: number;
  requiredCount: number;
}

interface TeamCompletion {
  group: string;
  totalSegments: number;
  ownedSegments: number;
  completionPercentage: number;
  missingRarities: string[];
  teamBonus: string;
}

const COLLECTION_SETS: CollectionSet[] = [
  {
    id: 'classic_trilogy',
    name: 'Classic Trilogy',
    description: 'Complete the foundational era of card design',
    requiredGroups: ['1970s Baseball', '1980s Baseball', '1990s Baseball'],
    completionBonus: '+25% Power to all Classic cards',
    powerBonus: 25,
    isComplete: false,
    progress: 0,
    requiredCount: 3
  },
  {
    id: 'modern_masters',
    name: 'Modern Masters',
    description: 'Master the contemporary design landscape',
    requiredGroups: ['2000s Baseball', '2010s Baseball', '2020s Baseball'],
    completionBonus: '+20% Collectibility to Modern cards',
    powerBonus: 20,
    isComplete: false,
    progress: 0,
    requiredCount: 3
  },
  {
    id: 'style_virtuoso',
    name: 'Style Virtuoso',
    description: 'Collect across all major style categories',
    requiredGroups: ['Classic', 'Modern', 'Retro', 'Futuristic'],
    completionBonus: '+30% Blend Success Rate',
    powerBonus: 30,
    isComplete: false,
    progress: 0,
    requiredCount: 4
  },
  {
    id: 'rarity_collector',
    name: 'Rarity Collector',
    description: 'Own segments from every rarity tier',
    requiredGroups: ['Legendary', 'Epic', 'Rare', 'Uncommon'],
    completionBonus: '+15% Drop Rate Boost',
    powerBonus: 15,
    isComplete: false,
    progress: 0,
    requiredCount: 4
  }
];

export const CollectionPreview: React.FC<CollectionPreviewProps> = ({ selectedDNA }) => {
  // Calculate collection progress and team completions
  const collectionData = useMemo(() => {
    if (selectedDNA.length === 0) return null;

    // Group analysis
    const groupCounts = selectedDNA.reduce((acc, dna) => {
      acc[dna.group] = (acc[dna.group] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const rarityTypes = new Set(selectedDNA.map(dna => dna.rarity));

    // Calculate collection set progress
    const sets = COLLECTION_SETS.map(set => {
      let progress = 0;
      let matchedGroups = 0;

      if (set.id === 'rarity_collector') {
        // Special handling for rarity collection
        matchedGroups = set.requiredGroups.filter(rarity => rarityTypes.has(rarity as any)).length;
      } else {
        // Group-based collections
        matchedGroups = set.requiredGroups.filter(group => groupCounts[group] > 0).length;
      }

      progress = (matchedGroups / set.requiredCount) * 100;
      const isComplete = progress >= 100;

      return {
        ...set,
        progress,
        isComplete
      };
    });

    // Team completions (assuming 5-10 segments per team for demo)
    const teamCompletions: TeamCompletion[] = Object.entries(groupCounts).map(([group, count]) => {
      const estimatedTotal = Math.floor(Math.random() * 6) + 5; // 5-10 segments per team
      const completionPercentage = Math.min(100, (count / estimatedTotal) * 100);
      
      // Find missing rarities for this group
      const groupDNA = selectedDNA.filter(dna => dna.group === group);
      const groupRarities = new Set(groupDNA.map(dna => dna.rarity));
      const allRarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
      const missingRarities = allRarities.filter(rarity => !groupRarities.has(rarity as any));

      return {
        group,
        totalSegments: estimatedTotal,
        ownedSegments: count,
        completionPercentage,
        missingRarities,
        teamBonus: completionPercentage >= 100 ? '+10% Power for ' + group + ' cards' : 'Complete for bonus'
      };
    });

    // Collection stats
    const totalSets = sets.length;
    const completedSets = sets.filter(set => set.isComplete).length;
    const totalPowerBonus = sets.filter(set => set.isComplete).reduce((sum, set) => sum + set.powerBonus, 0);
    const averageTeamCompletion = teamCompletions.reduce((sum, team) => sum + team.completionPercentage, 0) / teamCompletions.length;

    return {
      sets,
      teamCompletions,
      totalSets,
      completedSets,
      totalPowerBonus,
      averageTeamCompletion: isNaN(averageTeamCompletion) ? 0 : averageTeamCompletion
    };
  }, [selectedDNA]);

  if (!collectionData) {
    return (
      <Card className="bg-[#1A1D24] border-[#353945] rounded-2xl hover:bg-[#23262F] transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-[#FCFCFD] flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Collection Preview
          </CardTitle>
          <CardDescription className="text-[#E6E8EC]">
            Track your collection progress, set completions, and team bonuses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Award className="h-12 w-12 text-[#777E90] mx-auto mb-4" />
            <p className="text-[#E6E8EC]">Select DNA segments to preview your collection progress</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Collection Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-crd-base border-crd-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-crd-light">Sets Complete</span>
            </div>
            <div className="text-2xl font-bold text-crd-bright">
              {collectionData.completedSets}/{collectionData.totalSets}
            </div>
            <Progress 
              value={(collectionData.completedSets / collectionData.totalSets) * 100} 
              className="h-1 mt-2" 
            />
          </CardContent>
        </Card>

        <Card className="bg-crd-base border-crd-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-crd-light">Power Bonus</span>
            </div>
            <div className="text-2xl font-bold text-crd-bright">+{collectionData.totalPowerBonus}%</div>
            <div className="text-xs text-crd-light mt-1">from completed sets</div>
          </CardContent>
        </Card>

        <Card className="bg-crd-base border-crd-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-crd-light">Avg Team %</span>
            </div>
            <div className="text-2xl font-bold text-crd-bright">
              {Math.round(collectionData.averageTeamCompletion)}%
            </div>
            <Progress value={collectionData.averageTeamCompletion} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-crd-base border-crd-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-400" />
              <span className="text-sm text-crd-light">DNA Segments</span>
            </div>
            <div className="text-2xl font-bold text-crd-bright">{selectedDNA.length}</div>
            <div className="text-xs text-crd-light mt-1">in collection</div>
          </CardContent>
        </Card>
      </div>

      {/* Collection Sets Progress */}
      <Card className="bg-crd-base border-crd-border">
        <CardHeader>
          <CardTitle className="text-crd-bright">Collection Sets</CardTitle>
          <CardDescription className="text-crd-light">
            Complete themed sets to unlock powerful bonuses and achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {collectionData.sets.map((set) => (
              <div 
                key={set.id}
                className={`bg-crd-darkest border rounded-lg p-4 ${
                  set.isComplete ? 'border-green-500/30' : 'border-crd-border'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {set.isComplete ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-400" />
                    )}
                    <div>
                      <h3 className="font-semibold text-crd-bright">{set.name}</h3>
                      <p className="text-sm text-crd-light">{set.description}</p>
                    </div>
                  </div>
                  <Badge className={`${
                    set.isComplete ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {set.isComplete ? 'Complete' : `${Math.round(set.progress)}%`}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <Progress value={set.progress} className="h-2" />
                  
                  <div className="flex flex-wrap gap-2">
                    {set.requiredGroups.map((group) => {
                      const isOwned = set.id === 'rarity_collector' 
                        ? selectedDNA.some(dna => dna.rarity === group)
                        : selectedDNA.some(dna => dna.group === group);
                      
                      return (
                        <Badge 
                          key={group}
                          variant={isOwned ? "default" : "outline"}
                          className={`text-xs ${
                            isOwned ? 'bg-green-500/20 text-green-300' : 'text-crd-mediumGray'
                          }`}
                        >
                          {isOwned ? <CheckCircle className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                          {group}
                        </Badge>
                      );
                    })}
                  </div>

                  <div className="bg-crd-base rounded p-3 text-sm">
                    <span className="text-crd-light">Completion Bonus: </span>
                    <span className="text-crd-primary font-medium">{set.completionBonus}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Completions */}
      <Card className="bg-crd-base border-crd-border">
        <CardHeader>
          <CardTitle className="text-crd-bright">Team Collection Progress</CardTitle>
          <CardDescription className="text-crd-light">
            Track completion progress for each team/group in your collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collectionData.teamCompletions.map((team) => (
              <div key={team.group} className="bg-crd-darkest border border-crd-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-crd-bright">{team.group}</h3>
                  <Badge className={`${
                    team.completionPercentage >= 100 ? 'bg-green-500/20 text-green-300' :
                    team.completionPercentage >= 70 ? 'bg-blue-500/20 text-blue-300' :
                    team.completionPercentage >= 40 ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {Math.round(team.completionPercentage)}%
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-crd-light">Segments Owned</span>
                      <span className="text-crd-bright">
                        {team.ownedSegments}/{team.totalSegments}
                      </span>
                    </div>
                    <Progress value={team.completionPercentage} className="h-2" />
                  </div>

                  {team.missingRarities.length > 0 && (
                    <div>
                      <div className="text-xs text-crd-light mb-1">Missing Rarities:</div>
                      <div className="flex flex-wrap gap-1">
                        {team.missingRarities.map((rarity) => (
                          <Badge key={rarity} variant="outline" className="text-xs capitalize">
                            {rarity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-crd-base rounded p-2 text-xs">
                    <span className="text-crd-light">Team Bonus: </span>
                    <span className={`font-medium ${
                      team.completionPercentage >= 100 ? 'text-green-400' : 'text-crd-mediumGray'
                    }`}>
                      {team.teamBonus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Collection Actions */}
      <Card className="bg-crd-base border-crd-border">
        <CardHeader>
          <CardTitle className="text-crd-bright">Collection Actions</CardTitle>
          <CardDescription className="text-crd-light">
            Manage and optimize your DNA collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-4 w-4" />
                <span className="font-medium">Export Collection</span>
              </div>
              <span className="text-xs text-crd-light text-left">
                Save your collection data for backup or sharing
              </span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4" />
                <span className="font-medium">Optimize Strategy</span>
              </div>
              <span className="text-xs text-crd-light text-left">
                Get recommendations for completing sets
              </span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4" />
                <span className="font-medium">View Achievements</span>
              </div>
              <span className="text-xs text-crd-light text-left">
                See all available collection milestones
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};