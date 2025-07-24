
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { StyleTesterTabs } from './StyleTesterTabs';
import { StyleTesterPreview } from './StyleTesterPreview';
import { StyleTesterFooter } from './StyleTesterFooter';
import { useStyleTesterState } from './useStyleTesterState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import type { Animated3DVariant } from '@/components/hero/Animated3DBackground';

interface AdminStyleTesterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminStyleTester: React.FC<AdminStyleTesterProps> = ({ isOpen, onClose }) => {
  const {
    activeVariant,
    setActiveVariant,
    opacity,
    setOpacity,
    speed,
    setSpeed,
    scale,
    setScale,
    blur,
    setBlur,
    mouseInteraction,
    setMouseInteraction,
    autoRotate,
    setAutoRotate,
    applyPreset,
    resetToDefaults
  } = useStyleTesterState();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden bg-crd-darkest border-crd-mediumGray/20">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-crd-mediumGray/20">
          <DialogTitle className="text-2xl font-bold text-crd-white flex items-center gap-2">
            🎨 3D Effects Style Tester
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-crd-lightGray hover:text-crd-white">
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>

        <div className="flex gap-6 h-[70vh]">
          <ErrorBoundary>
            <StyleTesterTabs
              activeVariant={activeVariant}
              setActiveVariant={setActiveVariant}
              opacity={opacity}
              setOpacity={setOpacity}
              speed={speed}
              setSpeed={setSpeed}
              scale={scale}
              setScale={setScale}
              blur={blur}
              setBlur={setBlur}
              mouseInteraction={mouseInteraction}
              setMouseInteraction={setMouseInteraction}
              autoRotate={autoRotate}
              setAutoRotate={setAutoRotate}
              applyPreset={applyPreset}
              resetToDefaults={resetToDefaults}
            />
          </ErrorBoundary>

          <ErrorBoundary>
            <StyleTesterPreview
              activeVariant={activeVariant}
              opacity={opacity[0]}
              speed={speed[0]}
              scale={scale[0]}
              blur={blur[0]}
            />
          </ErrorBoundary>
        </div>

        <StyleTesterFooter onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};
