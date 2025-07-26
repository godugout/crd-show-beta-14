import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Type, Sparkles, Zap, X } from 'lucide-react';
import { MagicParticles, SuccessParticles } from '@/components/effects/ParticleSystem';
import { QuickCreateCapture } from './steps/QuickCreateCapture';
import { QuickCreateEnhance } from './steps/QuickCreateEnhance';
import { QuickCreatePublish } from './steps/QuickCreatePublish';
import { cardAnalysisService } from '@/services/ai/cardAnalysisService';
import type { CardAnalysisResult } from '@/services/ai/cardAnalysisService';

interface QuickCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (cardData: any) => void;
}

type QuickCreateStep = 'capture' | 'enhance' | 'publish';

interface QuickCreateState {
  step: QuickCreateStep;
  uploadedFile: File | null;
  imageUrl: string | null;
  analysis: CardAnalysisResult | null;
  isAnalyzing: boolean;
  enhancedImageUrl: string | null;
  cardData: any | null;
}

export const QuickCreateModal: React.FC<QuickCreateModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [state, setState] = useState<QuickCreateState>({
    step: 'capture',
    uploadedFile: null,
    imageUrl: null,
    analysis: null,
    isAnalyzing: false,
    enhancedImageUrl: null,
    cardData: null
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
    }
  }, []);

  const handleImageCapture = async (file: File, imageUrl: string) => {
    setState(prev => ({
      ...prev,
      uploadedFile: file,
      imageUrl,
      isAnalyzing: true
    }));

    try {
      console.log('🚀 Starting AI analysis...');
      const analysis = await cardAnalysisService.analyzeCardImage(imageUrl, file);
      
      setState(prev => ({
        ...prev,
        analysis,
        isAnalyzing: false,
        step: 'enhance'
      }));
    } catch (error) {
      console.error('Analysis failed:', error);
      setState(prev => ({
        ...prev,
        isAnalyzing: false
      }));
    }
  };

  const handleEnhanceComplete = (enhancedImageUrl: string, cardData: any) => {
    setState(prev => ({
      ...prev,
      enhancedImageUrl,
      cardData,
      step: 'publish'
    }));
  };

  const handlePublishComplete = (finalCardData: any) => {
    onComplete(finalCardData);
    onClose();
    
    // Reset state for next use
    setState({
      step: 'capture',
      uploadedFile: null,
      imageUrl: null,
      analysis: null,
      isAnalyzing: false,
      enhancedImageUrl: null,
      cardData: null
    });
  };

  const handleBack = () => {
    if (state.step === 'enhance') {
      setState(prev => ({ ...prev, step: 'capture' }));
    } else if (state.step === 'publish') {
      setState(prev => ({ ...prev, step: 'enhance' }));
    }
  };

  const stepProgress = {
    capture: 0,
    enhance: 50,
    publish: 100
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background overlay with gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-primary/20 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Particle effects */}
          <MagicParticles
            active={isOpen && state.step === 'capture'}
            mousePosition={mousePosition}
            intensity={0.5}
            trigger="continuous"
          />
          <SuccessParticles
            active={state.step === 'publish'}
            trigger="burst"
            intensity={1.5}
          />

          {/* Modal content */}
          <motion.div
            ref={modalRef}
            className="relative w-full h-full max-w-6xl max-h-[90vh] bg-background/80 backdrop-blur-sm border border-border/50 shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onMouseMove={handleMouseMove}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Progress indicator */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-muted/20">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary-glow"
                initial={{ width: 0 }}
                animate={{ width: `${stepProgress[state.step]}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            {/* Step content */}
            <div className="relative h-full">
              <AnimatePresence mode="wait">
                {state.step === 'capture' && (
                  <motion.div
                    key="capture"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <QuickCreateCapture
                      onImageCapture={handleImageCapture}
                      isAnalyzing={state.isAnalyzing}
                    />
                  </motion.div>
                )}

                {state.step === 'enhance' && state.analysis && (
                  <motion.div
                    key="enhance"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <QuickCreateEnhance
                      imageUrl={state.imageUrl!}
                      analysis={state.analysis}
                      onComplete={handleEnhanceComplete}
                      onBack={handleBack}
                    />
                  </motion.div>
                )}

                {state.step === 'publish' && state.cardData && (
                  <motion.div
                    key="publish"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <QuickCreatePublish
                      cardData={state.cardData}
                      enhancedImageUrl={state.enhancedImageUrl!}
                      analysis={state.analysis!}
                      onComplete={handlePublishComplete}
                      onBack={handleBack}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};