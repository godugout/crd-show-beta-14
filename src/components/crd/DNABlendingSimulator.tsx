import React, { useState, useMemo } from 'react';
import { CRDEntry, checkBlendCompatibility, generateBlendResult } from '@/lib/cardshowDNA';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Shuffle, AlertTriangle, CheckCircle, Zap, Sparkles } from 'lucide-react';

interface DNABlendingSimulatorProps {
  selectedDNA: CRDEntry[];
}

interface BlendResult {
  id: string;
  name: string;
  parentDNA: CRDEntry[];
  powerLevel: number;
  rarity: string;
  collectibility: number;
  successRate: number;
  bonusEffects: string[];
  timestamp: number;
}

export const DNABlendingSimulator: React.FC<DNABlendingSimulatorProps> = ({ selectedDNA }) => {
  const [blendResults, setBlendResults] = useState<BlendResult[]>([]);
  const [isBlending, setIsBlending] = useState(false);

  // Filter blendable DNA from selection
  const blendableDNA = useMemo(() => {
    return selectedDNA.filter(dna => dna.isBlendable);
  }, [selectedDNA]);

  // Check compatibility between selected DNA
  const compatibilityAnalysis = useMemo(() => {
    if (blendableDNA.length < 2) return null;
    
    const analysis = {
      compatible: 0,
      incompatible: 0,
      warnings: [] as string[],
      bonuses: [] as string[]
    };

    // Check all pairs for compatibility
    for (let i = 0; i < blendableDNA.length; i++) {
      for (let j = i + 1; j < blendableDNA.length; j++) {
        const dna1 = blendableDNA[i];
        const dna2 = blendableDNA[j];
        const isCompatible = checkBlendCompatibility(dna1, dna2);
        
        if (isCompatible) {
          analysis.compatible++;
          
          // Check for special bonuses
          if (dna1.group === dna2.group) {
            analysis.bonuses.push(`${dna1.group} group synergy bonus`);
          }
          if (dna1.style === dna2.style) {
            analysis.bonuses.push(`${dna1.style} style harmony bonus`);
          }
        } else {
          analysis.incompatible++;
          analysis.warnings.push(`${dna1.displayName} + ${dna2.displayName}: Style conflict`);
        }
      }
    }

    return analysis;
  }, [blendableDNA]);

  const simulateBlend = async () => {
    if (blendableDNA.length < 2) return;
    
    setIsBlending(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const blendResult = generateBlendResult(blendableDNA);
    
    // Calculate success rate based on compatibility
    const totalPowerLevel = blendableDNA.reduce((sum, dna) => sum + dna.powerLevel, 0);
    const avgCollectibility = blendableDNA.reduce((sum, dna) => sum + dna.collectibility, 0) / blendableDNA.length;
    const successRate = Math.min(95, Math.max(15, avgCollectibility + (compatibilityAnalysis?.compatible || 0) * 10));
    
    // Generate bonus effects
    const bonusEffects = [];
    if (compatibilityAnalysis?.bonuses.length) {
      bonusEffects.push(...compatibilityAnalysis.bonuses);
    }
    if (blendableDNA.some(dna => dna.rarity === 'Legendary')) {
      bonusEffects.push('Legendary essence infusion');
    }
    if (blendableDNA.length >= 4) {
      bonusEffects.push('Multi-blend complexity bonus');
    }

    const newBlendResult: BlendResult = {
      id: `blend_${Date.now()}`,
      name: blendResult.name,
      parentDNA: [...blendableDNA],
      powerLevel: Math.floor(totalPowerLevel / blendableDNA.length * 1.2), // Blend bonus
      rarity: blendResult.rarity,
      collectibility: Math.floor(avgCollectibility * 1.1),
      successRate,
      bonusEffects,
      timestamp: Date.now()
    };

    setBlendResults(prev => [newBlendResult, ...prev]);
    setIsBlending(false);
  };

  const clearResults = () => {
    setBlendResults([]);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#1A1D24] border-[#353945] rounded-2xl hover:bg-[#23262F] transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-[#FCFCFD] flex items-center gap-2">
            <Shuffle className="h-5 w-5" />
            DNA Blending Simulator
          </CardTitle>
          <CardDescription className="text-[#E6E8EC]">
            Experiment with combining DNA segments to create new hybrid characteristics.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selected DNA for Blending */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[#FCFCFD] font-medium">Blendable DNA Segments</h3>
              <Badge variant="outline" className="text-xs border-[#353945] text-[#777E90]">
                {blendableDNA.length} of {selectedDNA.length} selected
              </Badge>
            </div>
            
            {blendableDNA.length === 0 ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No blendable DNA segments selected. Choose segments with blending enabled from the DNA Browser.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {blendableDNA.map((dna) => (
                  <div
                    key={dna.id}
                    className="bg-crd-darkest border border-crd-border rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-crd-bright text-sm">{dna.displayName}</span>
                      <Badge className={`text-xs ${
                        dna.rarity === 'Legendary' ? 'bg-yellow-500/20 text-yellow-300' :
                        dna.rarity === 'Epic' ? 'bg-purple-500/20 text-purple-300' :
                        dna.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {dna.rarity}
                      </Badge>
                    </div>
                    <div className="text-xs text-crd-light space-y-1">
                      <div>Group: {dna.group} • Style: {dna.style}</div>
                      <div>Power: {dna.powerLevel} • Collectibility: {dna.collectibility}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Compatibility Analysis */}
          {compatibilityAnalysis && (
            <div className="space-y-3">
              <h3 className="text-crd-bright font-medium">Compatibility Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 font-medium">Compatible</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    {compatibilityAnalysis.compatible}
                  </div>
                  <div className="text-xs text-green-300">Blend pairs</div>
                </div>
                
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <span className="text-red-400 font-medium">Conflicts</span>
                  </div>
                  <div className="text-2xl font-bold text-red-400">
                    {compatibilityAnalysis.incompatible}
                  </div>
                  <div className="text-xs text-red-300">Style clashes</div>
                </div>
                
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    <span className="text-purple-400 font-medium">Bonuses</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">
                    {compatibilityAnalysis.bonuses.length}
                  </div>
                  <div className="text-xs text-purple-300">Special effects</div>
                </div>
              </div>

              {/* Warnings and Bonuses */}
              {compatibilityAnalysis.warnings.length > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-1">Compatibility Warnings:</div>
                    <ul className="text-xs space-y-1">
                      {compatibilityAnalysis.warnings.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {compatibilityAnalysis.bonuses.length > 0 && (
                <Alert className="border-green-500/20 bg-green-500/5">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription>
                    <div className="font-medium mb-1 text-green-400">Synergy Bonuses:</div>
                    <ul className="text-xs space-y-1 text-green-300">
                      {compatibilityAnalysis.bonuses.map((bonus, index) => (
                        <li key={index}>• {bonus}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Blend Button */}
          <Button
            onClick={simulateBlend}
            disabled={blendableDNA.length < 2 || isBlending}
            className="w-full"
            size="lg"
          >
            {isBlending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Blending DNA...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Simulate DNA Blend
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Blend Results */}
      {blendResults.length > 0 && (
        <Card className="bg-crd-base border-crd-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-crd-bright">Blend Results ({blendResults.length})</CardTitle>
              <CardDescription className="text-crd-light">
                Your DNA blending experiments
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={clearResults}>
              Clear Results
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {blendResults.map((result) => (
                <div
                  key={result.id}
                  className="bg-crd-darkest border border-crd-border rounded-lg p-4 space-y-4"
                >
                  {/* Result Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-crd-bright">{result.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${
                        result.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300' :
                        result.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
                        result.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {result.rarity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {result.parentDNA.length} DNA sources
                      </Badge>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <div className="text-xs text-crd-light">Power Level</div>
                      <div className="text-lg font-bold text-crd-bright">{result.powerLevel}</div>
                      <Progress value={result.powerLevel} className="h-1" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-crd-light">Collectibility</div>
                      <div className="text-lg font-bold text-crd-primary">{result.collectibility}</div>
                      <Progress value={result.collectibility} className="h-1" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-crd-light">Success Rate</div>
                      <div className={`text-lg font-bold ${
                        result.successRate >= 70 ? 'text-green-400' :
                        result.successRate >= 40 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {result.successRate}%
                      </div>
                      <Progress value={result.successRate} className="h-1" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-crd-light">Bonus Effects</div>
                      <div className="text-lg font-bold text-purple-400">
                        {result.bonusEffects.length}
                      </div>
                    </div>
                  </div>

                  {/* Parent DNA */}
                  <div className="space-y-2">
                    <div className="text-sm text-crd-light">Source DNA:</div>
                    <div className="flex flex-wrap gap-2">
                      {result.parentDNA.map((dna) => (
                        <Badge key={dna.id} variant="secondary" className="text-xs">
                          {dna.displayName}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Bonus Effects */}
                  {result.bonusEffects.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm text-crd-light">Bonus Effects:</div>
                      <div className="flex flex-wrap gap-2">
                        {result.bonusEffects.map((effect, index) => (
                          <Badge key={index} className="text-xs bg-purple-500/20 text-purple-300">
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};