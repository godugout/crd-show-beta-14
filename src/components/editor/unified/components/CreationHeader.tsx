import React from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { ArrowLeft, X, Zap, Layers, Sparkles } from 'lucide-react';
import type { CreationMode, CreationStep } from '../types';
import type { ModeConfig } from '../types';

interface CreationHeaderProps {
  currentStep: CreationStep;
  mode: CreationMode;
  modeConfigs: ModeConfig[];
  onModeChange: (mode: CreationMode) => void;
  canGoBack: boolean;
  onBack: () => void;
  onCancel: () => void;
}

const stepNames: Record<CreationStep, string> = {
  intent: 'Choose Your Path',
  create: 'Design Your Card',
  templates: 'Enhanced Templates',
  studio: 'Studio Preview',
  publish: 'Publish Settings',
  complete: 'Complete'
};

const modeIcons: Record<CreationMode, React.ComponentType<any>> = {
  quick: Zap,
  guided: Layers,
  advanced: Sparkles,
  bulk: Layers
};

export const CreationHeader: React.FC<CreationHeaderProps> = ({
  currentStep,
  mode,
  modeConfigs,
  onModeChange,
  canGoBack,
  onBack,
  onCancel
}) => {
  const getCurrentModeConfig = () => {
    return modeConfigs.find(config => config.id === mode);
  };

  const currentModeConfig = getCurrentModeConfig();
  const ModeIcon = modeIcons[mode];

  return (
    <div className="h-16 bg-crd-darker/90 border-b border-crd-mediumGray/20 backdrop-blur-sm">
      <div className="h-full flex items-center justify-between px-6">
        {/* Left: Back button */}
        <div className="flex items-center gap-3">
          {canGoBack && (
            <CRDButton
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-crd-lightGray hover:text-crd-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </CRDButton>
          )}
        </div>

        {/* Center: Current step and mode */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <h1 className="text-lg font-semibold text-crd-white">
              {stepNames[currentStep]}
            </h1>
            {currentModeConfig && (
              <div className="flex items-center justify-center gap-2 text-sm text-crd-lightGray">
                <ModeIcon className="w-4 h-4" />
                <span>{currentModeConfig.title} Mode</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Mode switcher and cancel */}
        <div className="flex items-center gap-3">
          {/* Mode switcher */}
          <div className="flex bg-crd-darkest/50 rounded-lg p-1">
            {modeConfigs.map((config) => {
              const Icon = modeIcons[config.id as CreationMode];
              return (
                <button
                  key={config.id}
                  onClick={() => onModeChange(config.id as CreationMode)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                    mode === config.id
                      ? 'bg-crd-green text-black'
                      : 'text-crd-lightGray hover:text-crd-white'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {config.title}
                </button>
              );
            })}
          </div>

          <CRDButton
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-crd-lightGray hover:text-crd-white"
          >
            <X className="w-4 h-4" />
          </CRDButton>
        </div>
      </div>
    </div>
  );
};