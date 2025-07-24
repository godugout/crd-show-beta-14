
import React, { useState } from 'react';
import { Search, Sparkles, Globe, Image, Loader, CheckCircle, AlertCircle, Eye, Palette, Cpu, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCardWebSearch, type CardSearchResult } from '../hooks/useCardWebSearch';

interface CRDIdSystemProps {
  imageUrl?: string;
  onCardInfoFound: (result: CardSearchResult) => void;
}

export const CRDIdSystem: React.FC<CRDIdSystemProps> = ({ imageUrl, onCardInfoFound }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CardSearchResult[]>([]);
  const [lastAnalysis, setLastAnalysis] = useState<CardSearchResult | null>(null);
  const [analysisType, setAnalysisType] = useState<'traditional' | 'visual' | 'fallback' | null>(null);
  const { searchCardInfo, searchByText, isSearching } = useCardWebSearch();

  const handleImageSearch = async () => {
    if (!imageUrl) return;
    
    const result = await searchCardInfo(imageUrl);
    if (result) {
      setLastAnalysis(result);
      // Determine analysis type based on confidence and content
      if (result.confidence > 0.8) {
        setAnalysisType('traditional');
      } else if (result.confidence > 0.5) {
        setAnalysisType('visual');
      } else {
        setAnalysisType('fallback');
      }
      onCardInfoFound(result);
    }
  };

  const handleTextSearch = async () => {
    if (!searchQuery.trim()) return;
    
    const results = await searchByText(searchQuery);
    setSearchResults(results);
    
    if (results.length > 0) {
      setLastAnalysis(results[0]);
      setAnalysisType('traditional');
      onCardInfoFound(results[0]);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-500';
    if (confidence >= 0.6) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.7) return CheckCircle;
    return AlertCircle;
  };

  const getAnalysisTypeInfo = (type: 'traditional' | 'visual' | 'fallback' | null) => {
    switch (type) {
      case 'traditional':
        return { icon: Search, label: 'Traditional Analysis', color: 'text-blue-500' };
      case 'visual':
        return { icon: Eye, label: 'Enhanced AI Visual Analysis', color: 'text-purple-500' };
      case 'fallback':
        return { icon: Palette, label: 'Creative Generation', color: 'text-orange-500' };
      default:
        return { icon: Zap, label: 'Enhanced Browser AI', color: 'text-crd-green' };
    }
  };

  return (
    <div className="bg-crd-darkGray/50 border border-crd-mediumGray/30 rounded-xl p-6 space-y-4">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-crd-green">
          <Zap className="w-5 h-5" />
          <h3 className="text-white font-semibold text-lg">Enhanced CRD ID System</h3>
        </div>
        <p className="text-crd-lightGray text-sm">
          Advanced AI image analysis with Star Wars & fantasy character recognition - completely free!
        </p>
      </div>

      <div className="space-y-4">
        {/* Enhanced Image Search */}
        {imageUrl && (
          <div className="space-y-2">
            <label className="text-white text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Enhanced AI Analysis (Free)
            </label>
            <Button
              onClick={handleImageSearch}
              disabled={isSearching}
              className="w-full bg-gradient-to-r from-crd-green to-green-400 hover:from-crd-green/90 hover:to-green-400/90 text-black font-medium"
            >
              {isSearching ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing with Enhanced AI...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Identify & Create Epic Card
                </>
              )}
            </Button>
            <p className="text-xs text-crd-lightGray">
              ✨ Now recognizes Star Wars characters, fantasy creatures, and hundreds more subjects
            </p>
          </div>
        )}

        {/* Text Search */}
        <div className="space-y-2">
          <label className="text-white text-sm font-medium flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search by Name/Description
          </label>
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter character, creature, or object name..."
              className="bg-crd-darkGray border-crd-mediumGray text-white flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
            />
            <Button
              onClick={handleTextSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="bg-crd-mediumGray hover:bg-crd-mediumGray/80 text-white"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Enhanced Analysis Result */}
        {lastAnalysis && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-white text-sm font-medium">Latest Analysis</label>
              {analysisType && (
                <div className="flex items-center gap-2">
                  {React.createElement(getAnalysisTypeInfo(analysisType).icon, {
                    className: `w-4 h-4 ${getAnalysisTypeInfo(analysisType).color}`
                  })}
                  <span className={`text-xs ${getAnalysisTypeInfo(analysisType).color}`}>
                    {getAnalysisTypeInfo(analysisType).label}
                  </span>
                </div>
              )}
            </div>
            <div className="bg-gradient-to-r from-crd-mediumGray/20 to-crd-mediumGray/10 rounded-lg p-4 space-y-3 border border-crd-mediumGray/20">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-semibold text-base">{lastAnalysis.title}</h4>
                <div className="flex items-center gap-1">
                  {React.createElement(getConfidenceIcon(lastAnalysis.confidence), {
                    className: `w-4 h-4 ${getConfidenceColor(lastAnalysis.confidence)}`
                  })}
                  <span className={`text-sm font-medium ${getConfidenceColor(lastAnalysis.confidence)}`}>
                    {Math.round(lastAnalysis.confidence * 100)}%
                  </span>
                </div>
              </div>
              <p className="text-crd-lightGray text-sm leading-relaxed">{lastAnalysis.description}</p>
              <div className="grid grid-cols-3 gap-4 text-xs text-crd-lightGray">
                <div>
                  <span className="text-white font-medium">Series:</span>
                  <br />{lastAnalysis.series}
                </div>
                <div>
                  <span className="text-white font-medium">Type:</span>
                  <br />{lastAnalysis.type}
                </div>
                <div>
                  <span className="text-white font-medium">Rarity:</span>
                  <br />
                  <span className={`capitalize ${
                    lastAnalysis.rarity === 'legendary' ? 'text-yellow-400' :
                    lastAnalysis.rarity === 'rare' ? 'text-purple-400' :
                    lastAnalysis.rarity === 'uncommon' ? 'text-blue-400' :
                    'text-gray-400'
                  }`}>
                    {lastAnalysis.rarity}
                  </span>
                </div>
              </div>
              {lastAnalysis.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {lastAnalysis.tags.slice(0, 8).map((tag, index) => (
                    <span key={index} className="bg-crd-green/20 text-crd-green px-2 py-1 rounded text-xs border border-crd-green/30">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Enhanced Analysis Type Indicator */}
              {analysisType && (
                <div className="mt-3 p-3 bg-crd-darkGray/50 rounded border-l-4 border-crd-green text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3 h-3 text-crd-green" />
                    <span className="text-white font-medium">Analysis Details</span>
                  </div>
                  <span className="text-crd-lightGray">
                    {analysisType === 'traditional' && 'Identified as traditional trading card with comprehensive text and image analysis'}
                    {analysisType === 'visual' && 'Created using advanced visual AI analysis with enhanced Star Wars and fantasy character recognition'}
                    {analysisType === 'fallback' && 'Generated using creative interpretation with intelligent pattern matching and thematic analysis'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2">
            <label className="text-white text-sm font-medium">Additional Results</label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {searchResults.slice(1).map((result, index) => (
                <button
                  key={index}
                  onClick={() => onCardInfoFound(result)}
                  className="w-full text-left p-3 bg-crd-mediumGray/20 rounded-lg hover:bg-crd-mediumGray/30 transition-colors border border-crd-mediumGray/20"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-medium text-sm">{result.title}</h4>
                      <p className="text-crd-lightGray text-xs">{result.series}</p>
                    </div>
                    <span className={`text-xs ${getConfidenceColor(result.confidence)}`}>
                      {Math.round(result.confidence * 100)}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Feature Showcase */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-600/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-200">
            <p className="font-medium mb-2">Enhanced Recognition Features:</p>
            <ul className="space-y-1 text-blue-300 text-xs">
              <li>• ⭐ <strong>Star Wars Characters:</strong> Wookiees, Droids, Aliens</li>
              <li>• 🧙 <strong>Fantasy Creatures:</strong> Dragons, Wizards, Mythical Beings</li>
              <li>• 🤖 <strong>Sci-Fi Elements:</strong> Robots, Spaceships, Technology</li>
              <li>• 🏰 <strong>Epic Themes:</strong> Warriors, Guardians, Legends</li>
              <li>• 🎨 <strong>Creative Generation:</strong> Unique lore and compelling descriptions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
