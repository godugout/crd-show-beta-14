
import React from 'react';
import { Zap, Navigation, Settings, Copy, Upload, Sparkles } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import type { CreationMode } from '../../types';

interface IntentStepProps {
  onModeSelect: (mode: CreationMode) => void;
  onBulkUpload: () => void;
}

const modeOptions = [
  {
    id: 'quick' as CreationMode,
    title: 'Quick Create',
    description: 'Simple form-based card creation',
    icon: Zap,
    features: ['AI assistance', 'Smart defaults', 'One-click publish'],
    recommended: true
  },
  {
    id: 'guided' as CreationMode,
    title: 'Guided Create',
    description: 'Step-by-step wizard with help',
    icon: Navigation,
    features: ['Progressive guidance', 'Templates', 'Live preview']
  },
  {
    id: 'advanced' as CreationMode,
    title: 'Advanced Create',
    description: 'Full editor with all features',
    icon: Settings,
    features: ['Advanced cropping', 'Custom effects', 'Collaboration']
  }
];

export const IntentStep = ({ onModeSelect, onBulkUpload }: IntentStepProps) => {
  const { isEnabled } = useFeatureFlags();
  
  const handleModeSelect = (mode: CreationMode) => {
    console.log('IntentStep: Mode selected:', mode);
    onModeSelect(mode);
  };

  const handleBulkUpload = () => {
    console.log('IntentStep: Bulk upload selected');
    onBulkUpload();
  };


  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-crd-white mb-4">
          How would you like to create your card?
        </h2>
        <p className="text-crd-lightGray text-lg">
          Choose the creation method that best fits your needs and experience level
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {modeOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <div
              key={option.id}
              className="relative bg-crd-darker border border-crd-mediumGray/20 rounded-xl p-6 hover:border-crd-green/30 transition-all cursor-pointer group"
              onClick={() => handleModeSelect(option.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleModeSelect(option.id);
                }
              }}
            >
              {option.recommended && (
                <div className="absolute -top-2 left-4 bg-crd-green text-black text-xs font-bold px-2 py-1 rounded">
                  Recommended
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-crd-green/10 rounded-lg flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-crd-green" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-crd-white">{option.title}</h3>
                  <p className="text-crd-lightGray text-sm">{option.description}</p>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {option.features.map((feature, index) => (
                  <li key={index} className="text-crd-lightGray text-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-crd-green rounded-full flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <CRDButton
                variant="outline"
                className="w-full border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white group-hover:border-crd-green/30"
                onClick={(e) => {
                  e.stopPropagation();
                  handleModeSelect(option.id);
                }}
              >
                Select {option.title}
              </CRDButton>
            </div>
          );
        })}
      </div>


      {/* Bulk Upload Option */}
      <div className="bg-crd-darker border border-crd-mediumGray/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-crd-blue/10 rounded-lg flex items-center justify-center">
              <Copy className="w-6 h-6 text-crd-blue" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-crd-white">Bulk Upload</h3>
              <p className="text-crd-lightGray">Create multiple cards from a collection of images</p>
            </div>
          </div>
          <CRDButton
            variant="outline"
            onClick={handleBulkUpload}
            className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Start Bulk Upload
          </CRDButton>
        </div>
      </div>
    </div>
  );
};
