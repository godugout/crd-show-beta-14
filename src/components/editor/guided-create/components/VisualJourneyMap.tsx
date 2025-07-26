import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { WizardStep } from '../InteractiveWizard';

interface VisualJourneyMapProps {
  steps: WizardStep[];
  currentStepIndex: number;
  onStepClick: (stepIndex: number) => void;
}

export const VisualJourneyMap: React.FC<VisualJourneyMapProps> = ({
  steps,
  currentStepIndex,
  onStepClick
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Flowing Path */}
        <div className="relative">
          {/* Background Path */}
          <svg
            className="absolute inset-0 w-full h-20"
            viewBox="0 0 1000 80"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M0,40 Q200,10 400,40 T800,40 Q900,50 1000,40"
              stroke="url(#pathGradient)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: currentStepIndex / (steps.length - 1) }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>

          {/* Step Nodes */}
          <div className="relative flex justify-between items-center h-20">
            {steps.map((step, index) => {
              const isCompleted = step.completed;
              const isCurrent = step.current;
              const isClickable = index <= currentStepIndex || isCompleted;

              return (
                <motion.div
                  key={step.id}
                  className={`relative z-10 cursor-pointer ${
                    isClickable ? 'hover:scale-110' : 'cursor-not-allowed'
                  }`}
                  onClick={() => isClickable && onStepClick(index)}
                  whileHover={isClickable ? { scale: 1.1 } : {}}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                >
                  {/* Step Circle */}
                  <motion.div
                    className={`w-16 h-16 rounded-full flex items-center justify-center relative ${
                      isCurrent
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/50'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-muted border-2 border-muted-foreground/20 text-muted-foreground'
                    }`}
                    animate={{
                      scale: isCurrent ? [1, 1.1, 1] : 1,
                      boxShadow: isCurrent 
                        ? ['0 0 0 0 rgba(var(--primary-rgb), 0.4)', '0 0 0 20px rgba(var(--primary-rgb), 0)', '0 0 0 0 rgba(var(--primary-rgb), 0.4)']
                        : 'none'
                    }}
                    transition={{
                      scale: { duration: 2, repeat: Infinity },
                      boxShadow: { duration: 2, repeat: Infinity }
                    }}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <div className="text-lg">{step.icon}</div>
                    )}

                    {/* Pulsing Ring for Current Step */}
                    {isCurrent && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary"
                        animate={{
                          scale: [1, 1.5],
                          opacity: [1, 0]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Step Label */}
                  <motion.div
                    className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center min-w-max"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`text-sm font-medium ${
                      isCurrent ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </div>
                  </motion.div>

                  {/* Mini Preview for Completed Steps */}
                  {isCompleted && !isCurrent && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="w-3 h-3 bg-white rounded-sm opacity-80" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: '50%'
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};