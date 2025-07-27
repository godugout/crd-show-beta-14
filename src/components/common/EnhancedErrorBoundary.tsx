import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertTriangle, ArrowLeft, Home, RefreshCw } from 'lucide-react';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface EnhancedErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  className?: string;
}

interface EnhancedErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

export class EnhancedErrorBoundary extends Component<EnhancedErrorBoundaryProps, EnhancedErrorBoundaryState> {
  constructor(props: EnhancedErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<EnhancedErrorBoundaryState> {
    const errorId = Math.random().toString(36).substr(2, 9);
    
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('EnhancedErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      errorInfo,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // This would integrate with your error tracking service
      console.error('Error ID:', this.state.errorId);
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} retry={this.handleRetry} />;
      }

      return (
        <div className={cn('min-h-screen bg-crd-darkest flex items-center justify-center p-4', this.props.className)}>
          <Card className="max-w-md w-full bg-crd-darker border-crd-border">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-red-500" />
              </div>
              <CardTitle className="text-xl text-crd-white">
                Something went wrong
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-crd-lightGray text-center">
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={this.handleRetry} 
                  className="w-full bg-crd-green hover:bg-crd-green/90 text-crd-black"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={this.handleGoBack} 
                    variant="outline" 
                    className="flex-1 border-crd-border text-crd-lightGray hover:text-crd-white"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                  </Button>
                  
                  <Button 
                    onClick={this.handleGoHome} 
                    variant="outline" 
                    className="flex-1 border-crd-border text-crd-lightGray hover:text-crd-white"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                </div>
              </div>
              
              {this.props.showDetails && this.state.error && (
                <details className="text-left">
                  <summary className="text-sm text-crd-lightGray cursor-pointer hover:text-crd-white mb-2">
                    Error Details
                  </summary>
                  <div className="bg-crd-darkest p-3 rounded text-xs font-mono text-crd-lightGray overflow-auto max-h-32">
                    <p><strong>Error ID:</strong> {this.state.errorId}</p>
                    <p><strong>Message:</strong> {this.state.error.message}</p>
                    {this.state.errorInfo && (
                      <>
                        <p><strong>Component Stack:</strong></p>
                        <pre className="whitespace-pre-wrap text-xs">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </>
                    )}
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components
export const useErrorBoundary = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error) => {
    console.error('Error caught by useErrorBoundary:', error);
    setError(error);
  }, []);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    resetError,
    hasError: !!error,
  };
};

// Higher-order component for error boundaries
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    showDetails?: boolean;
  }
) => {
  const WrappedComponent = (props: P) => (
    <EnhancedErrorBoundary
      fallback={options?.fallback}
      onError={options?.onError}
      showDetails={options?.showDetails}
    >
      <Component {...props} />
    </EnhancedErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

// Specific error boundaries for different contexts
export const RouteErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <EnhancedErrorBoundary
    fallback={({ error, retry }) => (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-crd-darker border-crd-border">
          <CardContent className="text-center p-6">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-crd-white mb-2">
              Page Error
            </h2>
            <p className="text-crd-lightGray mb-4">
              This page encountered an error. Please try again.
            </p>
            <Button onClick={retry} className="bg-crd-green hover:bg-crd-green/90 text-crd-black">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload Page
            </Button>
          </CardContent>
        </Card>
      </div>
    )}
  >
    {children}
  </EnhancedErrorBoundary>
);

export const ComponentErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <EnhancedErrorBoundary
    fallback={({ error, retry }) => (
      <div className="p-4 bg-crd-darker border border-crd-border rounded-lg">
        <div className="flex items-center space-x-3 text-red-400">
          <AlertTriangle className="h-5 w-5" />
          <span>Component Error</span>
          <Button onClick={retry} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )}
  >
    {children}
  </EnhancedErrorBoundary>
); 