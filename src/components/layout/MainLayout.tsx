
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Loader } from 'lucide-react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { NotificationProvider } from '@/components/common/NotificationCenter';

// Simple fallback component for when things go wrong
const AppFallback: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => (
  <div className="min-h-screen bg-[#141416] flex items-center justify-center p-4">
    <div className="text-center max-w-md">
      <h1 className="text-2xl font-bold text-white mb-4">Loading Issue</h1>
      <p className="text-gray-400 mb-4">
        There was a problem loading the application. This might be a temporary database connection issue.
      </p>
      {error && (
        <details className="text-left bg-gray-800 p-4 rounded mb-4">
          <summary className="text-white cursor-pointer mb-2">Error Details</summary>
          <pre className="text-red-400 text-sm overflow-auto">
            {error.message}
          </pre>
        </details>
      )}
      <button 
        onClick={retry} 
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Reload App
      </button>
    </div>
  </div>
);

const PageFallback: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => (
  <div className="min-h-screen bg-[#141416] flex items-center justify-center">
    <div className="text-center text-white">
      <h2 className="text-xl mb-4">Page Loading Error</h2>
      <p className="text-gray-400 mb-4">This page encountered an issue.</p>
      <button 
        onClick={retry}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Go Home
      </button>
    </div>
  </div>
);

export const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<Error | null>(null);
  
  console.log('MainLayout rendering, path:', location.pathname, 'isHomePage:', isHomePage);

  useEffect(() => {
    console.log('MainLayout mounted, starting initialization...');
    
    const initializeApp = async () => {
      try {
        // Quick initialization - just enough to get the app running
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('MainLayout initialization completed successfully');
        setIsLoading(false);
      } catch (error) {
        console.error('MainLayout initialization failed:', error);
        setInitError(error as Error);
        setIsLoading(false);
      }
    };

    initializeApp();
    
    return () => {
      console.log('MainLayout unmounted');
    };
  }, []);

  // Show initialization error
  if (initError) {
    return <AppFallback error={initError} retry={() => window.location.reload()} />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#141416]">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-white mb-4 mx-auto" />
          <p className="text-white">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <ErrorBoundary fallbackComponent={AppFallback}>
        <Navbar />
        <ErrorBoundary fallbackComponent={PageFallback}>
          <div className="outlet-container">
            <Outlet />
          </div>
        </ErrorBoundary>
      </ErrorBoundary>
    </NotificationProvider>
  );
};
