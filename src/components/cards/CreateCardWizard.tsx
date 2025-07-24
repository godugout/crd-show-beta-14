
import React, { useState } from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { CRDCard } from '@/components/ui/design-system/Card';
import { ArrowRight, Upload, Check } from 'lucide-react';

interface CreateCardWizardProps {
  className?: string;
}

export const CreateCardWizard: React.FC<CreateCardWizardProps> = ({ className = '' }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const steps = [
    { number: 1, title: 'Upload Photo', description: 'Choose the image that will be featured on your card' },
    { number: 2, title: 'Details', description: 'Add card information and metadata' },
    { number: 3, title: 'Design', description: 'Customize effects and styling' },
    { number: 4, title: 'Publish', description: 'Review and publish your card' }
  ];

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
  };

  const handleAdvancedCrop = () => {
    console.log('Advanced crop clicked');
  };

  const handleSkipToDetails = () => {
    setCurrentStep(2);
  };

  return (
    <div className={`min-h-screen bg-crd-darkest ${className}`}>
      {/* Header */}
      <div className="bg-crd-darker border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-crd-white">Create New Card</h1>
          <div className="text-crd-lightGray text-sm">
            Upload your image and let AI suggest the perfect details ✨ AI analysis complete!
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-crd-darker border-b border-crd-mediumGray/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step.number === currentStep 
                      ? 'bg-crd-green text-black' 
                      : step.number < currentStep 
                        ? 'bg-crd-green text-black'
                        : 'bg-crd-mediumGray text-crd-lightGray'
                  }`}>
                    {step.number < currentStep ? <Check className="w-5 h-5" /> : step.number}
                  </div>
                  <div className="text-crd-white text-sm mt-2 text-center">
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    step.number < currentStep ? 'bg-crd-green' : 'bg-crd-mediumGray'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <span className="text-crd-lightGray text-sm">
              Step {currentStep} of {steps.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentStep === 1 && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-crd-white mb-4">Upload Your Photo</h2>
            <p className="text-crd-lightGray mb-8">
              Choose the image that will be featured on your card
            </p>

            {/* Card Preview Area */}
            <CRDCard className="bg-crd-darkGray border-crd-mediumGray/30 p-8 mb-8 max-w-md mx-auto">
              <div className="bg-crd-mediumGray rounded-lg p-8 border-2 border-dashed border-crd-lightGray/30">
                {uploadedImage ? (
                  <div className="space-y-4">
                    <img 
                      src={URL.createObjectURL(uploadedImage)} 
                      alt="Card preview" 
                      className="w-full max-w-xs mx-auto rounded-lg"
                    />
                    <div className="text-crd-green text-sm">
                      Photo optimized for card format!
                    </div>
                    <div className="text-crd-lightGray text-xs space-y-1">
                      <div>Original: 896x976</div>
                      <div>Size: 0.11 MB</div>
                      <div>Ratio: 0.92:1</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-16 h-16 text-crd-lightGray mx-auto mb-4" />
                    <p className="text-crd-white text-lg mb-2">Drop your image here</p>
                    <p className="text-crd-lightGray text-sm">or click to browse</p>
                  </div>
                )}
              </div>
            </CRDCard>

            {/* Upload Actions */}
            <div className="flex justify-center gap-4 mb-8">
              <CRDButton 
                variant="outline"
                className="bg-transparent border-crd-lightGray text-crd-lightGray hover:bg-crd-lightGray hover:text-black"
              >
                Choose File
              </CRDButton>
              {uploadedImage && (
                <CRDButton 
                  onClick={handleAdvancedCrop}
                  variant="primary"
                >
                  Advanced Crop
                </CRDButton>
              )}
            </div>

            {/* Ready Section */}
            {uploadedImage && (
              <CRDCard className="bg-crd-darkGray border-crd-mediumGray/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Check className="w-5 h-5 text-crd-green" />
                  <h3 className="text-crd-white font-semibold">Ready for Card Creation</h3>
                </div>
                <p className="text-crd-lightGray text-sm mb-6">
                  Your image has been processed and optimized for the standard trading card format. 
                  Use "Advanced Crop" to extract multiple elements (frame, logos, etc.) or proceed with the simple workflow.
                </p>
                
                {/* Features */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-crd-white font-medium mb-2">Supported Formats & Features</h4>
                    <div className="text-crd-lightGray text-sm space-y-1">
                      <div>File Types:</div>
                      <div>JPG, PNG, WebP, GIF</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-crd-white font-medium mb-2">Advanced Features:</h4>
                    <div className="text-crd-lightGray text-sm space-y-1">
                      <div>Multi-element cropping, Frame extraction</div>
                    </div>
                  </div>
                </div>

                {/* Next Step Button */}
                <CRDButton 
                  onClick={handleSkipToDetails}
                  variant="primary"
                  className="w-full"
                >
                  Skip to Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </CRDButton>
              </CRDCard>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
