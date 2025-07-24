import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CRDButton, Typography } from '@/components/ui/design-system';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, ArrowLeft, X, Sparkles, Settings, BookOpen } from 'lucide-react';
import { FeaturePreviewModal } from './FeaturePreviewModal';
import animationStudioMockup from '@/assets/animation-studio-mockup.jpg';
import interactiveBuilderMockup from '@/assets/interactive-builder-mockup.jpg';
import storyFlowMockup from '@/assets/story-flow-mockup.jpg';

interface SurveyData {
  storyType: string[];
  importantFeatures: string[];
  usageType: string;
  feedback: string;
  selectedFeature?: string;
}

interface STRYFeedbackSurveyProps {
  isOpen: boolean;
  onClose: () => void;
}

const storyTypes = [
  'Gaming Adventures',
  'Sports Cards',
  'Art & Design',
  'Educational Content',
  'Personal Stories',
  'Other'
];

const featureOptions = [
  'Animations & Effects',
  'Interactive Elements',
  'Sound Integration', 
  'Branching Narratives',
  'Real-time Collaboration',
  'Mobile Optimization'
];

const usageTypes = [
  { value: 'personal', label: 'Personal projects' },
  { value: 'professional', label: 'Professional work' },
  { value: 'educational', label: 'Educational content' },
  { value: 'social', label: 'Social sharing' },
  { value: 'commercial', label: 'Commercial use' }
];

const visualFeatures = [
  {
    id: 'animation',
    title: 'Animation Studio',
    description: 'Advanced particle systems and timeline controls',
    icon: Sparkles,
    mockup: animationStudioMockup,
    color: 'blue'
  },
  {
    id: 'interactive',
    title: 'Interactive Builder',
    description: 'Visual programming and trigger systems',
    icon: Settings,
    mockup: interactiveBuilderMockup,
    color: 'green'
  },
  {
    id: 'story',
    title: 'Story Flow Editor',
    description: 'Branching narratives and dialogue trees',
    icon: BookOpen,
    mockup: storyFlowMockup,
    color: 'purple'
  }
];

export const STRYFeedbackSurvey: React.FC<STRYFeedbackSurveyProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    storyType: [],
    importantFeatures: [],
    usageType: '',
    feedback: '',
    selectedFeature: undefined
  });
  const [showFeaturePreview, setShowFeaturePreview] = useState(false);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('');

  const handleStoryTypeToggle = (type: string) => {
    setSurveyData(prev => ({
      ...prev,
      storyType: prev.storyType.includes(type)
        ? prev.storyType.filter(t => t !== type)
        : [...prev.storyType, type]
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setSurveyData(prev => ({
      ...prev,
      importantFeatures: prev.importantFeatures.includes(feature)
        ? prev.importantFeatures.filter(f => f !== feature)
        : [...prev.importantFeatures, feature]
    }));
  };

  const handleVisualFeatureClick = (featureId: string) => {
    setSelectedFeatureId(featureId);
    setSurveyData(prev => ({ ...prev, selectedFeature: featureId }));
    setShowFeaturePreview(true);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Survey submitted:', surveyData);
    // Here you would typically send data to backend
    onClose();
    setCurrentStep(1);
    setSurveyData({
      storyType: [],
      importantFeatures: [],
      usageType: '',
      feedback: '',
      selectedFeature: undefined
    });
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "What type of stories do you want to tell?";
      case 2: return "Which features would be most important?";
      case 3: return "How do you plan to use STRY Capsules?";
      case 4: return "Which feature excites you most?";
      default: return "";
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1: return surveyData.storyType.length > 0;
      case 2: return surveyData.importantFeatures.length > 0;
      case 3: return surveyData.usageType !== '';
      case 4: return true; // Optional step
      default: return false;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl bg-crd-dark border border-crd-mediumGray/30">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-crd-white text-xl font-bold">
                What's your story?
              </DialogTitle>
              <button
                onClick={onClose}
                className="text-crd-mediumGray hover:text-crd-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Progress indicator */}
            <div className="flex gap-2 mt-4">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex-1 h-1 rounded-full transition-colors ${
                    step <= currentStep ? 'bg-crd-blue' : 'bg-crd-mediumGray/30'
                  }`}
                />
              ))}
            </div>
          </DialogHeader>

          <div className="py-6">
            <Typography variant="h3" className="text-crd-white text-lg font-semibold mb-6">
              {getStepTitle()}
            </Typography>

            {/* Step 1: Story Types */}
            {currentStep === 1 && (
              <div className="space-y-3">
                {storyTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleStoryTypeToggle(type)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      surveyData.storyType.includes(type)
                        ? 'border-crd-blue bg-crd-blue/10 text-crd-white'
                        : 'border-crd-mediumGray/30 hover:border-crd-mediumGray/50 text-crd-lightGray hover:text-crd-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Important Features */}
            {currentStep === 2 && (
              <div className="space-y-3">
                {featureOptions.map((feature) => (
                  <button
                    key={feature}
                    onClick={() => handleFeatureToggle(feature)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      surveyData.importantFeatures.includes(feature)
                        ? 'border-crd-blue bg-crd-blue/10 text-crd-white'
                        : 'border-crd-mediumGray/30 hover:border-crd-mediumGray/50 text-crd-lightGray hover:text-crd-white'
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            )}

            {/* Step 3: Usage Type */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <RadioGroup
                  value={surveyData.usageType}
                  onValueChange={(value) => setSurveyData(prev => ({ ...prev, usageType: value }))}
                  className="space-y-3"
                >
                  {usageTypes.map((type) => (
                    <div key={type.value} className="flex items-center space-x-3">
                      <RadioGroupItem
                        value={type.value}
                        id={type.value}
                        className="border-crd-mediumGray text-crd-blue"
                      />
                      <label
                        htmlFor={type.value}
                        className="text-crd-lightGray cursor-pointer hover:text-crd-white transition-colors"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="mt-6">
                  <Typography variant="body" className="text-crd-lightGray mb-2">
                    Any additional feedback or feature requests? (Optional)
                  </Typography>
                  <Textarea
                    placeholder="Tell us what would make STRY Capsules perfect for your needs..."
                    value={surveyData.feedback}
                    onChange={(e) => setSurveyData(prev => ({ ...prev, feedback: e.target.value }))}
                    className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white placeholder:text-crd-mediumGray"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Visual Features */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <Typography variant="body" className="text-crd-lightGray mb-4">
                  Click on any feature to see a preview mockup:
                </Typography>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {visualFeatures.map((feature) => {
                    const IconComponent = feature.icon;
                    const colorClasses = {
                      blue: 'border-crd-blue hover:bg-crd-blue/10',
                      green: 'border-green-500 hover:bg-green-500/10',
                      purple: 'border-purple-500 hover:bg-purple-500/10'
                    };

                    return (
                      <button
                        key={feature.id}
                        onClick={() => handleVisualFeatureClick(feature.id)}
                        className={`p-4 rounded-lg border transition-all text-left ${
                          colorClasses[feature.color as keyof typeof colorClasses]
                        } ${surveyData.selectedFeature === feature.id ? 'bg-opacity-20' : ''}`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <IconComponent className="w-5 h-5 text-current" />
                          <Typography variant="h4" className="text-crd-white font-semibold">
                            {feature.title}
                          </Typography>
                        </div>
                        <Typography variant="body" className="text-crd-lightGray text-sm">
                          {feature.description}
                        </Typography>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t border-crd-mediumGray/30">
            <CRDButton
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="border-crd-mediumGray/30 text-crd-lightGray hover:text-crd-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </CRDButton>

            {currentStep < 4 ? (
              <CRDButton
                variant="primary"
                onClick={handleNext}
                disabled={!isStepComplete()}
                className="bg-crd-blue hover:bg-crd-blue/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </CRDButton>
            ) : (
              <CRDButton
                variant="primary"
                onClick={handleSubmit}
                className="bg-crd-blue hover:bg-crd-blue/80"
              >
                Submit Feedback
              </CRDButton>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <FeaturePreviewModal
        isOpen={showFeaturePreview}
        onClose={() => setShowFeaturePreview(false)}
        features={visualFeatures}
        selectedFeatureId={selectedFeatureId}
        onFeatureSelect={setSelectedFeatureId}
      />
    </>
  );
};