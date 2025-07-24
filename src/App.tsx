
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import '@/styles/studio.css';
import { AuthProvider } from '@/features/auth/providers/AuthProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ProductionOptimizer } from '@/components/production/ProductionOptimizer';
import { DevLoginFloatingButton } from '@/components/auth/DevLoginFloatingButton';
import { Navbar } from '@/components/layout/Navbar';
import { FlightAnimationProvider } from '@/contexts/FlightAnimationContext';
import { RouteErrorBoundary } from '@/components/routing/RouteErrorBoundary';
import { LoadingState } from '@/components/common/LoadingState';
import { GlobalSecretEffectsProvider } from '@/contexts/GlobalSecretEffectsContext';
import { GlobalSecretMenu } from '@/components/global/GlobalSecretMenu';

// Critical pages loaded immediately for better UX
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

// Authentication pages - keep immediately loaded for better auth flow UX
import SignIn from '@/pages/auth/SignIn';
import SignUp from '@/pages/auth/SignUp';

// Lazy load all other pages to reduce initial bundle size
const CreateEnhanced = lazy(() => import('@/pages/CreateEnhanced'));
const CreateStory = lazy(() => import('@/pages/CreateStory'));
const CreateCRD = lazy(() => import('@/pages/CreateCRD'));
const Gallery = lazy(() => import('@/pages/Gallery'));
const Studio = lazy(() => import('@/pages/Studio'));
const Collections = lazy(() => import('@/pages/Collections'));
const CollectionsCatalog = lazy(() => import('@/pages/CollectionsCatalog'));

// Development/testing pages - low priority for lazy loading
const UploadTestPage = lazy(() => import('@/pages/UploadTestPage'));
const DNATestPage = lazy(() => import('@/pages/DNATestPage'));


// DNA/Admin pages - perfect candidates for lazy loading
const DNAManager = lazy(() => import('@/pages/DNAManager'));
const DNALabLanding = lazy(() => import('@/pages/DNALabLanding'));
const DNALabDashboard = lazy(() => import('@/pages/DNALabDashboard'));
const DNALabUsers = lazy(() => import('@/pages/DNALabUsers'));
const DNALabModeration = lazy(() => import('@/pages/DNALabModeration'));

// Specific loading states for different page types
const RouteLoading = () => (
  <LoadingState 
    fullPage 
    message="Loading page..." 
    size="lg"
    className="bg-crd-darkest"
  />
);

const AdminLoading = () => (
  <LoadingState 
    fullPage 
    message="Loading admin panel..." 
    size="lg"
    className="bg-crd-darkest"
  />
);

const StudioLoading = () => (
  <LoadingState 
    fullPage 
    message="Loading studio..." 
    size="lg"
    className="bg-crd-darkest"
  />
);

const App = () => {
  // Main App Error Boundary wrapper
  return (
    <ErrorBoundary>
      <ProductionOptimizer />
      <AuthProvider>
        <GlobalSecretEffectsProvider>
          <FlightAnimationProvider>
            <Router>
              <div className="min-h-screen bg-crd-darkest flex flex-col">
                <Navbar />
              <main className="flex-1 transition-all duration-300 ease-in-out">
                <Routes>
                  {/* Core pages - no lazy loading */}
                  <Route 
                    path="/" 
                    element={
                      <RouteErrorBoundary>
                        <Index />
                      </RouteErrorBoundary>
                    } 
                  />
                  
                  {/* Lazy-loaded pages with error boundaries and loading states */}
                  <Route 
                    path="/create" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <CreateEnhanced />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/create/story" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <CreateStory />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/create/crd" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <CreateCRD />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/collections" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <Collections />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/collections/gallery" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <Gallery />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/collections/catalog" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <CollectionsCatalog />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/studio/demo" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<StudioLoading />}>
                          <Studio />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/studio/demo/:cardId" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<StudioLoading />}>
                          <Studio />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/upload-test" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <UploadTestPage />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/dna-test" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <DNATestPage />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/dna" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<RouteLoading />}>
                          <DNAManager />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/dna/lab" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<AdminLoading />}>
                          <DNALabLanding />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/dna/lab/dashboard" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<AdminLoading />}>
                          <DNALabDashboard />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/dna/lab/users" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<AdminLoading />}>
                          <DNALabUsers />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/dna/lab/moderation" 
                    element={
                      <RouteErrorBoundary>
                        <Suspense fallback={<AdminLoading />}>
                          <DNALabModeration />
                        </Suspense>
                      </RouteErrorBoundary>
                    } 
                  />
                  {/* Auth pages - immediately loaded for better UX */}
                  <Route 
                    path="/auth/signin" 
                    element={
                      <RouteErrorBoundary>
                        <SignIn />
                      </RouteErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/auth/signup" 
                    element={
                      <RouteErrorBoundary>
                        <SignUp />
                      </RouteErrorBoundary>
                    } 
                  />
                  
                  {/* 404 catch-all route */}
                  <Route 
                    path="*" 
                    element={
                      <RouteErrorBoundary>
                        <NotFound />
                      </RouteErrorBoundary>
                    } 
                  />
                </Routes>
              </main>
              <Toaster 
                position="top-right"
                theme="dark"
                toastOptions={{
                  style: {
                    background: '#1A1A1A',
                    color: '#FCFCFD',
                    border: '1px solid #353945'
                  }
                }}
              />
              <DevLoginFloatingButton />
              <GlobalSecretMenu />
              </div>
            </Router>
          </FlightAnimationProvider>
        </GlobalSecretEffectsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
