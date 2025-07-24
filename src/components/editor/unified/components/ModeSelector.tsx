
import React from 'react';
import { Zap, Navigation, Settings, Copy } from 'lucide-react';
import { CRDCard } from '@/components/ui/design-system/Card';
import { CRDButton } from '@/components/ui/design-system/Button';
import type { ModeConfig, CreationMode } from '../types';

interface ModeSelectorProps {
  configs: ModeConfig[];
  selectedMode?: CreationMode;
  onModeSelect: (mode: CreationMode) => void;
}

const iconMap = {
  Zap,
  Navigation,
  Settings,
  Copy
};

export const ModeSelector = ({ configs, selectedMode, onModeSelect }: ModeSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-crd-white mb-4">
          How would you like to create your card?
        </h2>
        <p className="text-crd-lightGray text-lg">
          Choose the creation mode that best fits your needs and experience level
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {configs.map((config) => {
          const IconComponent = iconMap[config.icon as keyof typeof iconMap];
          const isSelected = selectedMode === config.id;
          
          return (
            <CRDCard
              key={config.id}
              className={`p-6 cursor-pointer transition-all border-2 ${
                isSelected
                  ? 'border-crd-green bg-crd-green/10'
                  : 'border-crd-mediumGray/30 hover:border-crd-green/50'
              }`}
              onClick={() => onModeSelect(config.id)}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 rounded-full ${
                  isSelected ? 'bg-crd-green text-black' : 'bg-crd-mediumGray text-crd-white'
                }`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-crd-white mb-2">
                    {config.title}
                  </h3>
                  <p className="text-crd-lightGray mb-4">
                    {config.description}
                  </p>
                </div>

                <div className="space-y-2 w-full">
                  <h4 className="text-sm font-medium text-crd-white">Features:</h4>
                  <ul className="text-sm text-crd-lightGray space-y-1">
                    {config.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-crd-green rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {isSelected && (
                  <CRDButton variant="primary" className="w-full mt-4">
                    Continue with {config.title}
                  </CRDButton>
                )}
              </div>
            </CRDCard>
          );
        })}
      </div>
    </div>
  );
};
