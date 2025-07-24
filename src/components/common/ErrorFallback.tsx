import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  message?: string;
  showHomeButton?: boolean;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  title = "Something went wrong",
  message,
  showHomeButton = true
}) => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const displayMessage = message || error?.message || 'An unexpected error occurred. Please try again.';

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-crd-darker rounded-lg border border-crd-mediumGray/20 min-h-[400px]">
      <AlertTriangle className="w-16 h-16 text-amber-500 mb-6" />
      
      <h2 className="text-2xl font-bold text-crd-white mb-3">
        {title}
      </h2>
      
      <p className="text-crd-lightGray mb-6 max-w-md text-sm leading-relaxed">
        {displayMessage}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        {resetError && (
          <CRDButton
            onClick={resetError}
            variant="primary"
            className="bg-crd-green hover:bg-crd-green/80 text-black"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </CRDButton>
        )}
        
        {showHomeButton && (
          <CRDButton
            onClick={handleGoHome}
            variant="outline"
            className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </CRDButton>
        )}
      </div>

      {process.env.NODE_ENV === 'development' && error && (
        <details className="mt-6 text-left w-full max-w-md">
          <summary className="cursor-pointer text-crd-lightGray text-sm mb-2">
            Error Details (Development Only)
          </summary>
          <pre className="text-xs text-red-400 overflow-auto bg-crd-darkest p-3 rounded border border-crd-mediumGray/20">
            {error.toString()}
            {error.stack && `\n${error.stack}`}
          </pre>
        </details>
      )}
    </div>
  );
};