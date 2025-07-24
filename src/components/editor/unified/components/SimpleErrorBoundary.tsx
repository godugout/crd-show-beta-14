
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';

interface SimpleErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface SimpleErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: string;
  onReset?: () => void;
}

export class SimpleErrorBoundary extends React.Component<SimpleErrorBoundaryProps, SimpleErrorBoundaryState> {
  constructor(props: SimpleErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): SimpleErrorBoundaryState {
    console.error('🚨 SimpleErrorBoundary: Error caught:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 SimpleErrorBoundary: Full error info:', error, errorInfo);
  }

  resetError = () => {
    console.log('🔄 SimpleErrorBoundary: Resetting error state');
    this.setState({ hasError: false, error: undefined });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-crd-darker rounded-lg border border-crd-mediumGray/20">
          <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-semibold text-crd-white mb-2">
            {this.props.fallback || 'Something went wrong'}
          </h3>
          <p className="text-crd-lightGray mb-4 text-sm">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <CRDButton
            onClick={this.resetError}
            variant="outline"
            size="sm"
            className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </CRDButton>
        </div>
      );
    }

    return this.props.children;
  }
}
