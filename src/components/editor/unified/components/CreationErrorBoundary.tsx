
import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';

interface CreationErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface CreationErrorBoundaryProps {
  children: React.ReactNode;
  onReset?: () => void;
}

export class CreationErrorBoundary extends React.Component<CreationErrorBoundaryProps, CreationErrorBoundaryState> {
  constructor(props: CreationErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): CreationErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('CreationErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-crd-darkest flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-crd-white mb-2">Something went wrong</h2>
            <p className="text-crd-lightGray mb-6">
              There was an error loading the card creator. Let's try again.
            </p>
            <div className="space-y-3">
              <CRDButton
                onClick={this.resetError}
                variant="primary"
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </CRDButton>
              <CRDButton
                onClick={() => window.location.href = '/gallery'}
                variant="outline"
                className="w-full border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
              >
                Go to Gallery
              </CRDButton>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
