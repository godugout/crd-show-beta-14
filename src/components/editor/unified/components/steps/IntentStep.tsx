import { CRDButton } from '@/components/ui/design-system/Button';
import { useSecureAuth } from '@/features/auth/providers/SecureAuthProvider';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { Copy, Navigation, Settings, Upload, Zap } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataIntegratedAdvancedCreate } from '../../advanced-create/DataIntegratedAdvancedCreate';
import { SocialGuidedCreate } from '../../guided-create/SocialGuidedCreate';
import { RevolutionaryQuickCreate } from '../../quick-create/RevolutionaryQuickCreate';
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
    recommended: true,
  },
  {
    id: 'guided' as CreationMode,
    title: 'Guided Create',
    description: 'Step-by-step wizard with help',
    icon: Navigation,
    features: ['Progressive guidance', 'Templates', 'Live preview'],
  },
  {
    id: 'advanced' as CreationMode,
    title: 'Advanced Create',
    description: 'Full editor with all features',
    icon: Settings,
    features: ['Advanced cropping', 'Custom effects', 'Collaboration'],
  },
];

export const IntentStep = ({ onModeSelect, onBulkUpload }: IntentStepProps) => {
  const { user } = useSecureAuth();
  const { isEnabled } = useFeatureFlags();
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [showSocialGuided, setShowSocialGuided] = useState(false);
  const [showDataAdvanced, setShowDataAdvanced] = useState(false);

  const handleModeSelect = async (mode: CreationMode) => {
    console.log('IntentStep: Mode selected:', mode);

    // Check if user is authenticated for quick mode
    if (mode === 'quick') {
      if (!user) {
        toast.error('Please sign in to create cards');
        return;
      }

      setShowQuickCreate(true);
      return;
    }

    // Use enhanced guided mode with social features
    if (mode === 'guided') {
      setShowSocialGuided(true);
      return;
    }

    // Use enhanced advanced mode with data integration
    if (mode === 'advanced') {
      setShowDataAdvanced(true);
      return;
    }

    onModeSelect(mode);
  };

  const handleBulkUpload = () => {
    console.log('IntentStep: Bulk upload selected');
    onBulkUpload();
  };

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='text-center mb-12'>
        <h2 className='text-3xl font-bold text-crd-white mb-4'>
          How would you like to create your card?
        </h2>
        <p className='text-crd-lightGray text-lg'>
          Choose the creation method that best fits your needs and experience
          level
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        {modeOptions.map(option => {
          const IconComponent = option.icon;
          return (
            <div
              key={option.id}
              className='relative bg-crd-darker border border-crd-mediumGray/20 rounded-xl p-6 hover:border-crd-green/30 transition-all cursor-pointer group z-10'
            >
              {option.recommended && (
                <div className='absolute -top-2 left-4 bg-crd-green text-black text-xs font-bold px-2 py-1 rounded z-20'>
                  Recommended
                </div>
              )}

              <div className='flex items-center gap-3 mb-4'>
                <div className='w-12 h-12 bg-crd-green/10 rounded-lg flex items-center justify-center'>
                  <IconComponent className='w-6 h-6 text-crd-green' />
                </div>
                <div>
                  <h3 className='text-xl font-semibold text-crd-white'>
                    {option.title}
                  </h3>
                  <p className='text-crd-lightGray text-sm'>
                    {option.description}
                  </p>
                </div>
              </div>

              <ul className='space-y-2 mb-6'>
                {option.features.map((feature, index) => (
                  <li
                    key={index}
                    className='text-crd-lightGray text-sm flex items-center gap-2'
                  >
                    <div className='w-1.5 h-1.5 bg-crd-green rounded-full flex-shrink-0' />
                    {feature}
                  </li>
                ))}
              </ul>

              <CRDButton
                variant='outline'
                className='w-full border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white group-hover:border-crd-green/30 relative z-30 pointer-events-auto'
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Button clicked for mode:', option.id);
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
      <div className='bg-crd-darker border border-crd-mediumGray/20 rounded-xl p-6 relative z-10'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-crd-blue/10 rounded-lg flex items-center justify-center'>
              <Copy className='w-6 h-6 text-crd-blue' />
            </div>
            <div>
              <h3 className='text-xl font-semibold text-crd-white'>
                Bulk Upload
              </h3>
              <p className='text-crd-lightGray'>
                Create multiple cards from a collection of images
              </p>
            </div>
          </div>
          <CRDButton
            variant='outline'
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Bulk upload button clicked');
              handleBulkUpload();
            }}
            className='border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white relative z-30 pointer-events-auto'
          >
            <Upload className='w-4 h-4 mr-2' />
            Start Bulk Upload
          </CRDButton>
        </div>
      </div>

      {/* Revolutionary Quick Create */}
      {/* Show enhanced Quick Create */}
      {showQuickCreate && (
        <RevolutionaryQuickCreate
          isOpen={true}
          onClose={() => setShowQuickCreate(false)}
          onComplete={cardData => {
            console.log('Quick create completed:', cardData);
            // Handle completion
          }}
        />
      )}

      {/* Show enhanced Guided Create with social features */}
      {showSocialGuided && (
        <SocialGuidedCreate
          onComplete={cardData => {
            console.log('Social guided create completed:', cardData);
            // Handle completion
          }}
          onCancel={() => setShowSocialGuided(false)}
        />
      )}

      {/* Show enhanced Advanced Create with data integration */}
      {showDataAdvanced && (
        <DataIntegratedAdvancedCreate
          onComplete={cards => {
            console.log('Data integrated create completed:', cards);
            // Handle completion
          }}
          onCancel={() => setShowDataAdvanced(false)}
        />
      )}
    </div>
  );
};
