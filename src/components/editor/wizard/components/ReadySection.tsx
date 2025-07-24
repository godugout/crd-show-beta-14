
import React from 'react';
import { CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';

interface ReadySectionProps {
  selectedPhoto: string;
  isAnalyzing: boolean;
  analysisComplete?: boolean;
  analysisSuccessful?: boolean;
}

export const ReadySection: React.FC<ReadySectionProps> = ({ 
  selectedPhoto, 
  isAnalyzing,
  analysisComplete = false,
  analysisSuccessful = false
}) => {
  const getStatusIcon = () => {
    if (isAnalyzing) {
      return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
    }
    if (!selectedPhoto) {
      return <XCircle className="w-5 h-5 text-gray-500" />;
    }
    if (analysisComplete && analysisSuccessful) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (analysisComplete && !analysisSuccessful) {
      return <AlertCircle className="w-5 h-5 text-orange-500" />;
    }
    if (selectedPhoto && !analysisComplete && !isAnalyzing) {
      return <CheckCircle className="w-5 h-5 text-blue-500" />;
    }
    return <XCircle className="w-5 h-5 text-gray-500" />;
  };

  const getStatusText = () => {
    if (isAnalyzing) {
      return 'Analyzing image with AI...';
    }
    if (!selectedPhoto) {
      return 'Please select an image to continue';
    }
    if (analysisComplete && analysisSuccessful) {
      return 'Image analyzed successfully - ready to proceed';
    }
    if (analysisComplete && !analysisSuccessful) {
      return 'Analysis needs review - you can proceed or retry';
    }
    if (selectedPhoto && !analysisComplete && !isAnalyzing) {
      return 'Image selected - ready for next step';
    }
    return 'Please select an image to continue';
  };

  const getStatusColor = () => {
    if (isAnalyzing) return 'text-yellow-500';
    if (!selectedPhoto) return 'text-gray-500';
    if (analysisComplete && analysisSuccessful) return 'text-green-500';
    if (analysisComplete && !analysisSuccessful) return 'text-orange-500';
    if (selectedPhoto) return 'text-blue-500';
    return 'text-gray-500';
  };

  return (
    <div className="bg-crd-mediumGray/10 rounded-lg p-4">
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <div>
          <h3 className="text-crd-white font-medium">Status</h3>
          <p className={`text-sm ${getStatusColor()}`}>
            {getStatusText()}
          </p>
        </div>
      </div>
    </div>
  );
};
