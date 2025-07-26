import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, 
  Zap, 
  Star, 
  TrendingUp, 
  Palette, 
  Type, 
  Image,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Brain,
  Sparkles
} from 'lucide-react';

interface AnalysisResult {
  overall_score: number;
  visual_appeal: number;
  text_readability: number;
  color_harmony: number;
  composition_balance: number;
  marketability: number;
  suggestions: string[];
  strengths: string[];
  improvements: string[];
  estimated_rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  market_potential: 'low' | 'medium' | 'high' | 'exceptional';
}

interface SmartCardAnalyzerProps {
  cardData?: any;
  onAnalysisComplete?: (analysis: AnalysisResult) => void;
  className?: string;
}

export const SmartCardAnalyzer: React.FC<SmartCardAnalyzerProps> = ({
  cardData,
  onAnalysisComplete,
  className = ''
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate analysis progress
    const steps = [
      { name: 'Analyzing visual composition...', duration: 800 },
      { name: 'Evaluating color harmony...', duration: 600 },
      { name: 'Checking text readability...', duration: 500 },
      { name: 'Assessing market potential...', duration: 700 },
      { name: 'Generating suggestions...', duration: 400 }
    ];

    let currentProgress = 0;
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, step.duration));
      currentProgress += 20;
      setAnalysisProgress(currentProgress);
    }

    // Mock analysis result - in real implementation, this would call an AI service
    const mockAnalysis: AnalysisResult = {
      overall_score: 87,
      visual_appeal: 92,
      text_readability: 85,
      color_harmony: 89,
      composition_balance: 84,
      marketability: 78,
      estimated_rarity: 'epic',
      market_potential: 'high',
      strengths: [
        'Excellent use of contrasting colors',
        'Strong visual hierarchy',
        'Professional typography choices',
        'Balanced composition'
      ],
      suggestions: [
        'Consider adding a subtle drop shadow for depth',
        'The main text could be slightly larger for better readability',
        'Try experimenting with metallic accents',
        'Add more visual interest to the background'
      ],
      improvements: [
        'Background could use more detail',
        'Some text elements are too small',
        'Color palette could be more cohesive'
      ]
    };

    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
    setAnalysisProgress(100);

    if (onAnalysisComplete) {
      onAnalysisComplete(mockAnalysis);
    }
  }, [cardData, onAnalysisComplete]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-400/20 border-green-400/40';
    if (score >= 75) return 'bg-yellow-400/20 border-yellow-400/40';
    if (score >= 60) return 'bg-orange-400/20 border-orange-400/40';
    return 'bg-red-400/20 border-red-400/40';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/40';
      case 'epic': return 'text-purple-400 bg-purple-400/20 border-purple-400/40';
      case 'rare': return 'text-blue-400 bg-blue-400/20 border-blue-400/40';
      case 'uncommon': return 'text-green-400 bg-green-400/20 border-green-400/40';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/40';
    }
  };

  const getMarketPotentialColor = (potential: string) => {
    switch (potential) {
      case 'exceptional': return 'text-green-400 bg-green-400/20 border-green-400/40';
      case 'high': return 'text-blue-400 bg-blue-400/20 border-blue-400/40';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/40';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/40';
    }
  };

  return (
    <Card className={`bg-crd-darker/90 border-crd-mediumGray/40 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-crd-white flex items-center gap-3 text-lg">
          <Brain className="w-5 h-5 text-crd-green" />
          Smart Card Analyzer
          <Badge className="bg-crd-green/20 text-crd-green border-crd-green/40">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {!isAnalyzing && !analysis && (
          <div className="text-center py-8">
            <Eye className="w-16 h-16 mx-auto mb-4 text-crd-green/60" />
            <h3 className="text-lg font-semibold text-crd-white mb-2">
              Analyze Your Card Design
            </h3>
            <p className="text-crd-lightGray mb-6 max-w-md mx-auto">
              Get AI-powered insights on visual appeal, marketability, and suggestions for improvement.
            </p>
            <CRDButton
              onClick={runAnalysis}
              className="bg-crd-green text-black hover:bg-crd-green/80"
            >
              <Zap className="w-4 h-4 mr-2" />
              Run Analysis
            </CRDButton>
          </div>
        )}

        {isAnalyzing && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="w-16 h-16 border-4 border-crd-green/20 border-t-crd-green rounded-full animate-spin"></div>
                <Brain className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-crd-green" />
              </div>
              <h3 className="text-lg font-semibold text-crd-white mb-2">
                Analyzing Your Design...
              </h3>
              <p className="text-crd-lightGray mb-4">
                AI is examining your card for visual appeal and marketability
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-crd-lightGray">Analysis Progress</span>
                <span className="text-crd-white">{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
            </div>
          </div>
        )}

        {analysis && (
          <div className="space-y-6 animate-fade-in">
            {/* Overall Score */}
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full border-4 ${getScoreBg(analysis.overall_score)} mb-4`}>
                <span className={`text-2xl font-bold ${getScoreColor(analysis.overall_score)}`}>
                  {analysis.overall_score}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-crd-white mb-2">
                Overall Design Score
              </h3>
              <div className="flex items-center justify-center gap-4">
                <Badge className={getRarityColor(analysis.estimated_rarity)}>
                  <Star className="w-3 h-3 mr-1" />
                  {analysis.estimated_rarity} Quality
                </Badge>
                <Badge className={getMarketPotentialColor(analysis.market_potential)}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {analysis.market_potential} Market Appeal
                </Badge>
              </div>
            </div>

            {/* Detailed Scores */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Visual Appeal', score: analysis.visual_appeal, icon: Eye },
                { name: 'Readability', score: analysis.text_readability, icon: Type },
                { name: 'Color Harmony', score: analysis.color_harmony, icon: Palette },
                { name: 'Composition', score: analysis.composition_balance, icon: Image },
                { name: 'Marketability', score: analysis.marketability, icon: Target }
              ].map(({ name, score, icon: Icon }) => (
                <div key={name} className="bg-crd-darkest/50 p-4 rounded-lg border border-crd-mediumGray/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-crd-lightGray" />
                    <span className="text-sm text-crd-lightGray">{name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-crd-mediumGray/20 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          score >= 90 ? 'bg-green-400' :
                          score >= 75 ? 'bg-yellow-400' :
                          score >= 60 ? 'bg-orange-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className={`text-sm font-semibold ${getScoreColor(score)}`}>
                      {score}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Strengths */}
            {analysis.strengths.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-crd-white flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Strengths
                </h4>
                <div className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-crd-lightGray">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-crd-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-crd-green" />
                  AI Suggestions
                </h4>
                <div className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-crd-green/5 border border-crd-green/20 rounded-lg">
                      <Sparkles className="w-4 h-4 text-crd-green mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-crd-lightGray">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Improvements */}
            {analysis.improvements.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-crd-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  Areas for Improvement
                </h4>
                <div className="space-y-2">
                  {analysis.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-crd-lightGray">{improvement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-crd-mediumGray/20">
              <CRDButton
                onClick={runAnalysis}
                variant="outline"
                className="flex-1"
              >
                <Zap className="w-4 h-4 mr-2" />
                Re-analyze
              </CRDButton>
              <CRDButton
                variant="primary"
                className="flex-1"
                onClick={() => {
                  // Apply suggestions automatically
                }}
              >
                <Award className="w-4 h-4 mr-2" />
                Apply Suggestions
              </CRDButton>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};