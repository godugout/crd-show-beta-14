
import React from 'react';
import { AlertTriangle, RefreshCw, Edit3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Badge } from '@/components/ui/badge';

interface AnalysisReviewPromptProps {
  confidence: number;
  detectionMethod: string;
  requiresManualReview?: boolean;
  error?: boolean;
  message?: string;
  onRetryAnalysis: () => void;
  onManualEntry: () => void;
  onProceedAnyway?: () => void;
}

export const AnalysisReviewPrompt: React.FC<AnalysisReviewPromptProps> = ({
  confidence,
  detectionMethod,
  requiresManualReview = false,
  error = false,
  message,
  onRetryAnalysis,
  onManualEntry,
  onProceedAnyway
}) => {
  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.7) return 'bg-green-500';
    if (conf >= 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusMessage = () => {
    if (error) return 'Analysis Failed';
    if (requiresManualReview) return 'Review Required';
    if (confidence < 0.3) return 'Low Confidence';
    return 'Analysis Complete';
  };

  return (
    <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
      <CardHeader>
        <CardTitle className="text-crd-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          Image Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-crd-lightGray text-sm">Status:</span>
            <Badge 
              variant={error ? "destructive" : requiresManualReview ? "secondary" : "outline"}
              className="text-xs"
            >
              {getStatusMessage()}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-crd-lightGray text-sm">Confidence:</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-crd-darkGray rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getConfidenceColor(confidence)} transition-all`}
                  style={{ width: `${Math.max(confidence * 100, 5)}%` }}
                />
              </div>
              <span className="text-crd-white text-sm font-medium">
                {Math.round(confidence * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-crd-lightGray">Method:</span>
          <Badge variant="outline" className="text-xs">
            {detectionMethod.replace(/_/g, ' ').toUpperCase()}
          </Badge>
        </div>

        {message && (
          <div className="bg-crd-darkGray/50 rounded-lg p-3">
            <p className="text-crd-lightGray text-sm">{message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          <CRDButton
            variant="outline"
            onClick={onRetryAnalysis}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Analysis
          </CRDButton>
          
          <CRDButton
            onClick={onManualEntry}
            className="flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Manual Entry
          </CRDButton>
        </div>

        {!error && confidence > 0 && onProceedAnyway && (
          <div className="pt-2 border-t border-crd-mediumGray/20">
            <CRDButton
              variant="outline"
              size="sm"
              onClick={onProceedAnyway}
              className="w-full text-crd-lightGray hover:text-crd-white"
            >
              Proceed with Current Results
            </CRDButton>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
