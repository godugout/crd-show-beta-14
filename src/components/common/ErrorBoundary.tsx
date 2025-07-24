
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/utils/logger';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackComponent?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): State {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('React Error Boundary caught an error', error, {
      component: 'ErrorBoundary',
      errorId: this.state.errorId,
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Report to error tracking service in production
    if (import.meta.env.PROD) {
      // Example: reportError(error, errorInfo);
    }
  }

  retry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: ''
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback component if provided
      if (this.props.fallbackComponent) {
        const FallbackComponent = this.props.fallbackComponent;
        return <FallbackComponent error={this.state.error!} retry={this.retry} />;
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md mx-auto">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-crd-danger" />
            </div>
            
            <h2 className="text-xl font-semibold text-crd-lightText mb-2">
              Something went wrong
            </h2>
            
            <p className="text-crd-mutedText mb-6">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>
            
            <div className="space-y-3">
              <Button onClick={this.retry} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <details className="text-left">
                <summary className="text-sm text-crd-mutedText cursor-pointer hover:text-crd-lightText">
                  Error Details
                </summary>
                <div className="mt-2 p-3 bg-crd-darkest rounded text-xs font-mono text-crd-mutedText overflow-auto">
                  <p><strong>Error ID:</strong> {this.state.errorId}</p>
                  <p><strong>Message:</strong> {this.state.error?.message}</p>
                  <p><strong>Stack:</strong></p>
                  <pre>{this.state.error?.stack}</pre>
                </div>
              </details>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallbackComponent?: React.ComponentType<{ error: Error; retry: () => void }>
) => {
  return (props: P) => (
    <ErrorBoundary fallbackComponent={fallbackComponent}>
      <Component {...props} />
    </ErrorBoundary>
  );
};
