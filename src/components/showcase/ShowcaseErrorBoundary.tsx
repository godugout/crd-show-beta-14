
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShowcaseErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ShowcaseErrorBoundaryProps {
  children: React.ReactNode;
}

export class ShowcaseErrorBoundary extends React.Component<ShowcaseErrorBoundaryProps, ShowcaseErrorBoundaryState> {
  constructor(props: ShowcaseErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ShowcaseErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Showcase ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-crd-dark rounded-lg">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-crd-white mb-2">3D Showcase Error</h2>
          <p className="text-crd-lightGray mb-4">
            {this.state.error?.message || 'Failed to load 3D showcase'}
          </p>
          <Button onClick={this.resetError} className="bg-crd-green hover:bg-crd-green/90">
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
