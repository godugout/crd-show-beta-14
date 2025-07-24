import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CRDButton, Typography } from '@/components/ui/design-system';
import { ArrowLeft, ArrowRight, X, Sparkles, Settings, BookOpen } from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  mockup: string;
  color: string;
}

interface FeaturePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  features: Feature[];
  selectedFeatureId: string;
  onFeatureSelect: (featureId: string) => void;
}

export const FeaturePreviewModal: React.FC<FeaturePreviewModalProps> = ({
  isOpen,
  onClose,
  features,
  selectedFeatureId,
  onFeatureSelect
}) => {
  const currentFeature = features.find(f => f.id === selectedFeatureId);
  const currentIndex = features.findIndex(f => f.id === selectedFeatureId);

  const handlePrevious = () => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : features.length - 1;
    onFeatureSelect(features[prevIndex].id);
  };

  const handleNext = () => {
    const nextIndex = currentIndex < features.length - 1 ? currentIndex + 1 : 0;
    onFeatureSelect(features[nextIndex].id);
  };

  if (!currentFeature) return null;

  const IconComponent = currentFeature.icon;
  const colorClasses = {
    blue: 'text-crd-blue',
    green: 'text-green-500',
    purple: 'text-purple-500'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] bg-crd-darkest border border-crd-mediumGray/30 p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-crd-mediumGray/30">
          <div className="flex items-center gap-3">
            <IconComponent className={`w-6 h-6 ${colorClasses[currentFeature.color as keyof typeof colorClasses]}`} />
            <div>
              <Typography variant="h2" className="text-crd-white text-xl font-bold">
                {currentFeature.title}
              </Typography>
              <Typography variant="body" className="text-crd-lightGray text-sm">
                {currentFeature.description}
              </Typography>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Feature Navigation */}
            <div className="flex items-center gap-2">
              <CRDButton
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                className="border-crd-mediumGray/30 text-crd-lightGray hover:text-crd-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </CRDButton>
              
              <span className="text-crd-lightGray text-sm">
                {currentIndex + 1} of {features.length}
              </span>
              
              <CRDButton
                variant="outline"
                size="sm"
                onClick={handleNext}
                className="border-crd-mediumGray/30 text-crd-lightGray hover:text-crd-white"
              >
                <ArrowRight className="w-4 h-4" />
              </CRDButton>
            </div>

            <button
              onClick={onClose}
              className="text-crd-mediumGray hover:text-crd-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Image */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full h-full bg-crd-dark rounded-lg border border-crd-mediumGray/20 overflow-hidden">
            <img
              src={currentFeature.mockup}
              alt={`${currentFeature.title} preview`}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="p-6 border-t border-crd-mediumGray/30">
          <div className="flex justify-center gap-3">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              const isSelected = feature.id === selectedFeatureId;
              
              return (
                <button
                  key={feature.id}
                  onClick={() => onFeatureSelect(feature.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isSelected
                      ? 'bg-crd-blue/20 border border-crd-blue text-crd-white'
                      : 'border border-crd-mediumGray/30 text-crd-lightGray hover:text-crd-white hover:border-crd-mediumGray/50'
                  }`}
                >
                  <FeatureIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{feature.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};