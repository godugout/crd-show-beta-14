import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, Users, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SmartStyleSuggestion } from './hooks/useSmartStyleSuggestions';

interface SmartSuggestionCardProps {
  suggestion: SmartStyleSuggestion;
  onApply: (styleId: 'epic' | 'classic' | 'futuristic') => void;
  isVisible: boolean;
}

export const SmartSuggestionCard: React.FC<SmartSuggestionCardProps> = ({
  suggestion,
  onApply,
  isVisible
}) => {
  const getStyleGradient = (styleId: string) => {
    switch (styleId) {
      case 'epic':
        return 'from-orange-500 to-red-500';
      case 'classic':
        return 'from-blue-500 to-indigo-500';
      case 'futuristic':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStyleIcon = (styleId: string) => {
    switch (styleId) {
      case 'epic':
        return '⚡';
      case 'classic':
        return '🎨';
      case 'futuristic':
        return '✨';
      default:
        return '🎯';
    }
  };

  const formatConfidence = (confidence: number) => {
    return Math.round(confidence * 100);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-xl p-4 shadow-lg"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">AI Recommendation</h3>
              <p className="text-xs text-muted-foreground">Based on image analysis</p>
            </div>
          </div>

          {/* Primary Suggestion */}
          <div className="space-y-3">
            <motion.div
              className={cn(
                "relative overflow-hidden rounded-lg p-3 border-2 transition-all duration-200",
                "bg-gradient-to-r", getStyleGradient(suggestion.styleId)
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getStyleIcon(suggestion.styleId)}</span>
                    <span className="text-white font-semibold capitalize">
                      {suggestion.styleId}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
                    <TrendingUp className="w-3 h-3 text-white" />
                    <span className="text-xs text-white font-medium">
                      {formatConfidence(suggestion.confidence)}%
                    </span>
                  </div>
                </div>
                
                <p className="text-white/90 text-xs mb-3">{suggestion.reasoning}</p>
                
                <motion.button
                  onClick={() => onApply(suggestion.styleId)}
                  className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Apply {suggestion.styleId.charAt(0).toUpperCase() + suggestion.styleId.slice(1)}
                </motion.button>
              </div>
            </motion.div>

            {/* Alternative Suggestions */}
            {suggestion.alternatives.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium">
                    Other options
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {suggestion.alternatives.map((alt, index) => (
                    <motion.button
                      key={alt.styleId}
                      onClick={() => onApply(alt.styleId)}
                      className={cn(
                        "p-2 rounded-lg border border-border/50 bg-card/50 hover:bg-card/80",
                        "transition-all duration-200 text-left"
                      )}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{getStyleIcon(alt.styleId)}</span>
                        <span className="text-xs font-medium capitalize text-foreground">
                          {alt.styleId}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {formatConfidence(alt.confidence)}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {alt.reasoning}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Analysis Insights */}
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Analysis insights</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {suggestion.features.subject.category}
              </span>
              <span className="text-xs bg-secondary/10 text-secondary-foreground px-2 py-1 rounded-full">
                {suggestion.features.mood.primary}
              </span>
              <span className="text-xs bg-accent/10 text-accent-foreground px-2 py-1 rounded-full">
                {suggestion.features.colorPalette.temperature}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};