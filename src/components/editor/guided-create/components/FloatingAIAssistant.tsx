import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, MessageCircle, Lightbulb, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { WizardStep, WizardData } from '../InteractiveWizard';

interface FloatingAIAssistantProps {
  currentStep: WizardStep;
  visible: boolean;
  onToggle: () => void;
  wizardData: WizardData;
}

interface AITip {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: string;
}

export const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = ({
  currentStep,
  visible,
  onToggle,
  wizardData
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getContextualTips = (): AITip[] => {
    switch (currentStep.id) {
      case 'destiny':
        return [
          {
            id: 'category-tip',
            icon: <Lightbulb className="w-4 h-4" />,
            title: 'Choose Wisely',
            description: 'Sports cards are trending this month! Consider starting there.',
            action: 'Suggest Sports'
          },
          {
            id: 'inspiration-tip',
            icon: <Zap className="w-4 h-4" />,
            title: 'Need Inspiration?',
            description: 'Browse popular categories to spark creativity.',
            action: 'Show Examples'
          }
        ];
      case 'frame':
        return [
          {
            id: 'frame-match',
            icon: <Lightbulb className="w-4 h-4" />,
            title: 'Perfect Match',
            description: 'Based on your category, these frames work best.',
            action: 'Show Recommendations'
          }
        ];
      case 'image':
        return [
          {
            id: 'enhancement-tip',
            icon: <Zap className="w-4 h-4" />,
            title: 'Enhance Quality',
            description: 'Try the AI enhancement for sharper, more vibrant images.',
            action: 'Auto Enhance'
          }
        ];
      case 'customize':
        return [
          {
            id: 'layout-tip',
            icon: <Lightbulb className="w-4 h-4" />,
            title: 'Pro Layout Tip',
            description: 'Align elements using the magnetic guides for a professional look.',
            action: 'Show Guides'
          }
        ];
      case 'final':
        return [
          {
            id: 'final-check',
            icon: <Zap className="w-4 h-4" />,
            title: 'Final Check',
            description: 'Your card looks amazing! Consider adding rarity effects.',
            action: 'Add Effects'
          }
        ];
      default:
        return [];
    }
  };

  const tips = getContextualTips();

  return (
    <>
      {/* Floating Assistant Button */}
      <motion.div
        className="fixed bottom-20 right-6 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={onToggle}
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 relative overflow-hidden group"
        >
          <motion.div
            animate={{ rotate: visible ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {visible ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
          </motion.div>

          {/* Pulsing Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary"
            animate={{
              scale: [1, 1.3],
              opacity: [0.7, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />

          {/* Notification Dot */}
          {tips.length > 0 && !visible && (
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <span className="text-xs text-white font-bold">{tips.length}</span>
            </motion.div>
          )}
        </Button>
      </motion.div>

      {/* Assistant Panel */}
      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed bottom-36 right-6 z-50"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="w-80 bg-background/95 backdrop-blur-xl border-white/10 shadow-2xl">
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">AI Assistant</h3>
                    <p className="text-xs text-muted-foreground">
                      Step {currentStep.title} • {tips.length} tips
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="ml-auto"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {tips.map((tip, index) => (
                  <motion.div
                    key={tip.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer group"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      {tip.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground mb-1">
                        {tip.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {tip.description}
                      </p>
                      {tip.action && (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto text-xs text-primary hover:text-primary/80 mt-2"
                        >
                          {tip.action}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Progress Indicator */}
                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Wizard Progress</span>
                    <span>{Object.keys(wizardData).length}/5 steps</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-primary/80"
                      initial={{ width: 0 }}
                      animate={{ width: `${(Object.keys(wizardData).length / 5) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>

              {/* Expanded Chat Interface */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/10 p-4"
                  >
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      <div className="text-xs text-muted-foreground bg-muted/30 rounded p-2">
                        💡 Ask me anything about creating your card!
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        placeholder="Ask AI..."
                        className="flex-1 text-xs bg-background border border-white/10 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <Button size="sm" className="text-xs">
                        Send
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};