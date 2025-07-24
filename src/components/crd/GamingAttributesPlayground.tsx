import React, { useMemo } from 'react';
import { CRDEntry } from '@/lib/cardshowDNA';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, Zap, Target, Star, TrendingUp, Users } from 'lucide-react';

interface GamingAttributesPlaygroundProps {
  selectedDNA: CRDEntry[];
}

const RARITY_COLORS = {
  common: '#9CA3AF',
  uncommon: '#10B981',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#F59E0B',
  mythic: '#EC4899'
};

export const GamingAttributesPlayground: React.FC<GamingAttributesPlaygroundProps> = ({ selectedDNA }) => {
  // Calculate comprehensive stats from selected DNA
  const stats = useMemo(() => {
    if (selectedDNA.length === 0) return null;

    // Power Level Distribution
    const powerLevels = selectedDNA.map(dna => ({
      name: dna.displayName.substring(0, 15) + (dna.displayName.length > 15 ? '...' : ''),
      power: dna.powerLevel,
      collectibility: dna.collectibility,
      group: dna.group
    }));

    // Rarity Distribution
    const rarityCount = selectedDNA.reduce((acc, dna) => {
      acc[dna.rarity] = (acc[dna.rarity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const rarityData = Object.entries(rarityCount).map(([rarity, count]) => ({
      name: rarity,
      value: count,
      color: RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] || '#9CA3AF'
    }));

    // Group Distribution
    const groupCount = selectedDNA.reduce((acc, dna) => {
      acc[dna.group] = (acc[dna.group] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const groupData = Object.entries(groupCount).map(([group, count]) => ({
      name: group,
      count,
      avgPower: selectedDNA.filter(dna => dna.group === group)
        .reduce((sum, dna) => sum + dna.powerLevel, 0) / count
    }));

    // Supply & Demand Analysis
    const supplyAnalysis = selectedDNA.map(dna => ({
      name: dna.displayName.substring(0, 12) + '...',
      total: dna.totalSupply,
      current: dna.currentSupply,
      scarcity: ((dna.totalSupply - dna.currentSupply) / dna.totalSupply) * 100,
      dropRate: dna.dropRate
    }));

    // Unlock Method Distribution
    const unlockCount = selectedDNA.reduce((acc, dna) => {
      acc[dna.unlockMethod] = (acc[dna.unlockMethod] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Gaming Capability Analysis
    const blendableCount = selectedDNA.filter(dna => dna.isBlendable).length;
    const remixableCount = selectedDNA.filter(dna => dna.isRemixable).length;

    // Overall Scores
    const avgPowerLevel = selectedDNA.reduce((sum, dna) => sum + dna.powerLevel, 0) / selectedDNA.length;
    const avgCollectibility = selectedDNA.reduce((sum, dna) => sum + dna.collectibility, 0) / selectedDNA.length;
    const totalSupply = selectedDNA.reduce((sum, dna) => sum + dna.totalSupply, 0);
    const avgDropRate = selectedDNA.reduce((sum, dna) => sum + dna.dropRate, 0) / selectedDNA.length;

    return {
      powerLevels,
      rarityData,
      groupData,
      supplyAnalysis,
      unlockCount,
      blendableCount,
      remixableCount,
      avgPowerLevel,
      avgCollectibility,
      totalSupply,
      avgDropRate
    };
  }, [selectedDNA]);

  if (!stats) {
    return (
      <Card className="bg-[#1A1D24] border-[#353945] rounded-2xl hover:bg-[#23262F] transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-[#FCFCFD] flex items-center gap-2">
            <Target className="h-5 w-5" />
            Gaming Attributes Playground
          </CardTitle>
          <CardDescription className="text-[#E6E8EC]">
            Analyze gaming properties, rarity distributions, and collectibility metrics of your DNA selection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-[#777E90] mx-auto mb-4" />
            <p className="text-[#E6E8EC]">Select DNA segments to analyze their gaming attributes</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[#1A1D24] border-[#353945] rounded-xl hover:bg-[#23262F] transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-[#F97316]" />
              <span className="text-sm text-[#E6E8EC]">Avg Power</span>
            </div>
            <div className="text-2xl font-bold text-[#FCFCFD]">{Math.round(stats.avgPowerLevel)}</div>
            <Progress value={stats.avgPowerLevel} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-crd-base border-crd-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-crd-light">Collectibility</span>
            </div>
            <div className="text-2xl font-bold text-crd-bright">{Math.round(stats.avgCollectibility)}</div>
            <Progress value={stats.avgCollectibility} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-crd-base border-crd-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-crd-light">Total Supply</span>
            </div>
            <div className="text-2xl font-bold text-crd-bright">{stats.totalSupply.toLocaleString()}</div>
            <div className="text-xs text-crd-light mt-1">units available</div>
          </CardContent>
        </Card>

        <Card className="bg-crd-base border-crd-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-sm text-crd-light">Avg Drop Rate</span>
            </div>
            <div className="text-2xl font-bold text-crd-bright">{stats.avgDropRate.toFixed(1)}%</div>
            <div className="text-xs text-crd-light mt-1">chance per pack</div>
          </CardContent>
        </Card>
      </div>

      {/* Power Level Analysis */}
      <Card className="bg-crd-base border-crd-border">
        <CardHeader>
          <CardTitle className="text-crd-bright">Power Level Distribution</CardTitle>
          <CardDescription className="text-crd-light">
            Compare power levels across your selected DNA segments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.powerLevels}>
                <CartesianGrid strokeDasharray="3 3" stroke="#353945" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1A1A', 
                    border: '1px solid #353945',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="power" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rarity Distribution */}
        <Card className="bg-crd-base border-crd-border">
          <CardHeader>
            <CardTitle className="text-crd-bright">Rarity Distribution</CardTitle>
            <CardDescription className="text-crd-light">
              Breakdown of DNA segments by rarity level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.rarityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {stats.rarityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1A1A1A', 
                      border: '1px solid #353945',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {stats.rarityData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-crd-light capitalize">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gaming Capabilities */}
        <Card className="bg-crd-base border-crd-border">
          <CardHeader>
            <CardTitle className="text-crd-bright">Gaming Capabilities</CardTitle>
            <CardDescription className="text-crd-light">
              Blending and remixing availability in your selection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-crd-darkest rounded-lg">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {stats.blendableCount}
                </div>
                <div className="text-sm text-crd-light">Blendable</div>
                <div className="text-xs text-crd-mediumGray mt-1">
                  {((stats.blendableCount / selectedDNA.length) * 100).toFixed(0)}% of selection
                </div>
              </div>
              
              <div className="text-center p-4 bg-crd-darkest rounded-lg">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {stats.remixableCount}
                </div>
                <div className="text-sm text-crd-light">Remixable</div>
                <div className="text-xs text-crd-mediumGray mt-1">
                  {((stats.remixableCount / selectedDNA.length) * 100).toFixed(0)}% of selection
                </div>
              </div>
            </div>

            {/* Unlock Methods */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-crd-bright">Unlock Methods</h4>
              <div className="space-y-2">
                {Object.entries(stats.unlockCount).map(([method, count]) => (
                  <div key={method} className="flex items-center justify-between">
                    <Badge variant="outline" className="capitalize">
                      {method}
                    </Badge>
                    <span className="text-sm text-crd-light">{count} segments</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Group Analysis */}
      <Card className="bg-crd-base border-crd-border">
        <CardHeader>
          <CardTitle className="text-crd-bright">Group Performance Analysis</CardTitle>
          <CardDescription className="text-crd-light">
            Average power levels and distribution across DNA groups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.groupData.map((group) => (
              <div key={group.name} className="bg-crd-darkest rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-crd-bright">{group.name}</span>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{group.count} segments</Badge>
                    <span className="text-sm text-crd-light">
                      Avg Power: {Math.round(group.avgPower)}
                    </span>
                  </div>
                </div>
                <Progress value={group.avgPower} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supply & Scarcity Analysis */}
      <Card className="bg-crd-base border-crd-border">
        <CardHeader>
          <CardTitle className="text-crd-bright">Supply & Scarcity Analysis</CardTitle>
          <CardDescription className="text-crd-light">
            Track supply levels and rarity economics of your DNA collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.supplyAnalysis.slice(0, 10).map((item, index) => (
              <div key={index} className="bg-crd-darkest rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-crd-bright">{item.name}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-crd-light">
                      {item.current.toLocaleString()}/{item.total.toLocaleString()}
                    </span>
                    <Badge className={`${
                      item.scarcity > 80 ? 'bg-red-500/20 text-red-300' :
                      item.scarcity > 50 ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {item.scarcity.toFixed(1)}% scarce
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-crd-light mb-1">Supply Used</div>
                    <Progress value={((item.total - item.current) / item.total) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="text-xs text-crd-light mb-1">Drop Rate: {item.dropRate}%</div>
                    <Progress value={item.dropRate * 10} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};