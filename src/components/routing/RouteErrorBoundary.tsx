import React from 'react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface RouteErrorFallbackProps {
  error: Error;
  retry: () => void;
}

const RouteErrorFallback: React.FC<RouteErrorFallbackProps> = ({ error, retry }) => {
  return (
    <div className="min-h-screen bg-crd-darkest flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-crd-dark border border-crd-border rounded-lg p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-crd-danger mx-auto mb-4" />
        <h2 className="text-xl font-bold text-crd-lightText mb-2">
          Page Error
        </h2>
        <p className="text-crd-mutedText mb-4">
          Something went wrong while loading this page.
        </p>
        <div className="space-y-3">
          <Button onClick={retry} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-crd-mutedText text-sm">
              Error Details (Development)
            </summary>
            <pre className="mt-2 text-xs text-crd-danger overflow-auto bg-crd-darkest p-2 rounded">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
}

export const RouteErrorBoundary: React.FC<RouteErrorBoundaryProps> = ({ children }) => {
  return (
    <ErrorBoundary fallbackComponent={RouteErrorFallback}>
      {children}
    </ErrorBoundary>
  );
};