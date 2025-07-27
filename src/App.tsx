import { DevLoginFloatingButton } from '@/components/auth/DevLoginFloatingButton';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingState } from '@/components/common/LoadingState';
import { NotificationProvider } from '@/components/common/NotificationCenter';
import { BetaStabilityMonitor } from '@/components/core/BetaStabilityMonitor';
import { SupabaseDebug } from '@/components/debug/SupabaseDebug';
import { GlobalSecretMenu } from '@/components/global/GlobalSecretMenu';
import { Navbar } from '@/components/layout/Navbar';
import { ProductionOptimizer } from '@/components/production/ProductionOptimizer';
import { RouteErrorBoundary } from '@/components/routing/RouteErrorBoundary';
import { FlightAnimationProvider } from '@/contexts/FlightAnimationContext';
import { GlobalSecretEffectsProvider } from '@/contexts/GlobalSecretEffectsContext';
import { SecureAuthProvider } from '@/features/auth/providers/SecureAuthProvider';
import '@/styles/studio.css';
import { Suspense, lazy } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';

// Critical pages loaded immediately for better UX
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

// Authentication pages - keep immediately loaded for better auth flow UX
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import SignIn from '@/pages/auth/SignIn';
import SignUp from '@/pages/auth/SignUp';
import VerifyEmail from '@/pages/auth/VerifyEmail';

// Lazy load all other pages to reduce initial bundle size
const CreateEnhanced = lazy(() => import('@/pages/CreateEnhanced'));
const CreateStory = lazy(() => import('@/pages/CreateStory'));
const CreateCRD = lazy(() => import('@/pages/CreateCRD'));
const Gallery = lazy(() => import('@/pages/Gallery'));
const Studio = lazy(() => import('@/pages/Studio'));
const Collections = lazy(() => import('@/pages/Collections'));
const CollectionsCatalog = lazy(() => import('@/pages/CollectionsCatalog'));
const Marketplace = lazy(() => import('@/pages/Marketplace'));
const ListingDetail = lazy(() => import('@/pages/ListingDetail'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const TransactionsDashboard = lazy(
  () => import('@/pages/TransactionsDashboard')
);
const CreatorDashboard = lazy(() => import('@/pages/CreatorDashboard'));
const UserGallery = lazy(() => import('@/pages/UserGallery'));
const SimpleCardCreate = lazy(() => import('@/pages/SimpleCardCreate'));
const CRDMKRPSDReviewPage = lazy(() => import('@/pages/CRDMKRPSDReviewPage'));
const CRDMaker = lazy(() => import('@/pages/CRDMaker'));
const WowFactorDemo = lazy(() => import('@/pages/WowFactorDemo'));
const ClaudeDashboard = lazy(() => import('@/components/admin/ClaudeIntegrationDashboard').then(module => ({ default: module.ClaudeIntegrationDashboard })));
const NavbarSpacingTest = lazy(() => import('@/components/layout/NavbarSpacingTest').then(module => ({ default: module.NavbarSpacingTest })));
const SecureAuthTest = lazy(() => import('@/pages/SecureAuthTest').then(module => ({ default: module.SecureAuthTest })));

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
    message='Loading page...'
    size='lg'
    className='bg-crd-darkest'
  />
);

const AdminLoading = () => (
  <LoadingState
    fullPage
    message='Loading admin panel...'
    size='lg'
    className='bg-crd-darkest'
  />
);

const StudioLoading = () => (
  <LoadingState
    fullPage
    message='Loading studio...'
    size='lg'
    className='bg-crd-darkest'
  />
);

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ProductionOptimizer />
      <SecureAuthProvider>
        <NotificationProvider>
          <GlobalSecretEffectsProvider>
            <FlightAnimationProvider>
              <Router>
                <div className='min-h-screen bg-crd-darkest flex flex-col page-container'>
                  <Navbar />
                  <main className='flex-1 transition-all duration-300 ease-in-out'>
                    <Routes>
                      {/* Core pages - no lazy loading */}
                      <Route
                        path='/'
                        element={
                          <RouteErrorBoundary>
                            <Index />
                          </RouteErrorBoundary>
                        }
                      />

                      {/* Lazy-loaded pages with error boundaries and loading states */}
                      <Route
                        path='/create'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<RouteLoading />}>
                              <CreateEnhanced />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/create/story'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<RouteLoading />}>
                              <CreateStory />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/create/crd'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<RouteLoading />}>
                              <CreateCRD />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/collections'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<RouteLoading />}>
                              <Collections />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/collections/gallery'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<RouteLoading />}>
                              <Gallery />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/collections/catalog'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<RouteLoading />}>
                              <CollectionsCatalog />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/studio/demo'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<StudioLoading />}>
                              <Studio />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/studio/demo/:cardId'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<StudioLoading />}>
                              <Studio />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/upload-test'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<RouteLoading />}>
                              <UploadTestPage />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/dna-test'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<RouteLoading />}>
                              <DNATestPage />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/dna'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<RouteLoading />}>
                              <DNAManager />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/dna/lab'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<AdminLoading />}>
                              <DNALabDashboard />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/dna/lab/dashboard'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<AdminLoading />}>
                              <DNALabDashboard />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/dna/lab/users'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<AdminLoading />}>
                              <DNALabUsers />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/dna/lab/moderation'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<AdminLoading />}>
                              <DNALabModeration />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />

                      {/* Marketplace and Payment routes */}
                      <Route
                        path='/marketplace'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<RouteLoading />}>
                              <Marketplace />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/marketplace/:id'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<RouteLoading />}>
                              <ListingDetail />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/pricing'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<RouteLoading />}>
                              <Pricing />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/dashboard/transactions'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<RouteLoading />}>
                              <TransactionsDashboard />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/dashboard/creator'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<RouteLoading />}>
                              <CreatorDashboard />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/user/gallery'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<RouteLoading />}>
                              <UserGallery />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/cards/create'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<RouteLoading />}>
                              <SimpleCardCreate />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/crdmkr'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<RouteLoading />}>
                              <CRDMaker />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/crdmkr/psd-review'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<RouteLoading />}>
                              <CRDMKRPSDReviewPage />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/wow-factor-demo'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<RouteLoading />}>
                              <WowFactorDemo />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/admin/claude-dashboard'
                        element={
                          <RouteErrorBoundary>
                            <Suspense fallback={<RouteLoading />}>
                              <ClaudeDashboard />
                            </Suspense>
                          </RouteErrorBoundary>
                        }
                      />
                                  <Route
              path='/test/navbar-spacing'
              element={
                <RouteErrorBoundary>
                  <Suspense fallback={<RouteLoading />}>
                    <NavbarSpacingTest />
                  </Suspense>
                </RouteErrorBoundary>
              }
            />
            <Route
              path='/test/secure-auth'
              element={
                <RouteErrorBoundary>
                  <Suspense fallback={<RouteLoading />}>
                    <SecureAuthTest />
                  </Suspense>
                </RouteErrorBoundary>
              }
            />

                      {/* Auth pages - immediately loaded for better UX */}
                      <Route
                        path='/auth'
                        element={
                          <RouteErrorBoundary>
                            <SignIn />
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/auth/signin'
                        element={
                          <RouteErrorBoundary>
                            <SignIn />
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/auth/signup'
                        element={
                          <RouteErrorBoundary>
                            <SignUp />
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/auth/verify-email'
                        element={
                          <RouteErrorBoundary>
                            <VerifyEmail />
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/auth/forgot-password'
                        element={
                          <RouteErrorBoundary>
                            <ForgotPassword />
                          </RouteErrorBoundary>
                        }
                      />
                      <Route
                        path='/auth/reset-password'
                        element={
                          <RouteErrorBoundary>
                            <ResetPassword />
                          </RouteErrorBoundary>
                        }
                      />

                      {/* 404 catch-all route */}
                      <Route
                        path='*'
                        element={
                          <RouteErrorBoundary>
                            <NotFound />
                          </RouteErrorBoundary>
                        }
                      />
                    </Routes>
                  </main>
                  <Toaster
                    position='top-right'
                    theme='dark'
                    toastOptions={{
                      style: {
                        background: '#1A1A1A',
                        color: '#FCFCFD',
                        border: '1px solid #353945',
                      },
                    }}
                  />
                  {/* Dev tools for development only */}
                  {process.env.NODE_ENV === 'development' && (
                    <>
                      <DevLoginFloatingButton />
                      <BetaStabilityMonitor />
                      <SupabaseDebug />
                    </>
                  )}
                  <GlobalSecretMenu />
                </div>
              </Router>
            </FlightAnimationProvider>
          </GlobalSecretEffectsProvider>
        </NotificationProvider>
      </SecureAuthProvider>
    </ErrorBoundary>
  );
};

export default App;
path='/auth/forgot-password'
                          element={
                            <RouteErrorBoundary>
                              <ForgotPassword />
                            </RouteErrorBoundary>
                          }
                        />
                        <Route
                          path='/auth/reset-password'
                          element={
                            <RouteErrorBoundary>
                              <ResetPassword />
                            </RouteErrorBoundary>
                          }
                        />

                        {/* 404 catch-all route */}
                        <Route
                          path='*'
                          element={
                            <RouteErrorBoundary>
                              <NotFound />
                            </RouteErrorBoundary>
                          }
                        />
                      </Routes>
                    </main>
                    <Toaster
                      position='top-right'
                      theme='dark'
                      toastOptions={{
                        style: {
                          background: '#1A1A1A',
                          color: '#FCFCFD',
                          border: '1px solid #353945',
                        },
                      }}
                    />
                    {/* Dev tools for development only */}
                    {process.env.NODE_ENV === 'development' && (
                      <>
                        <DevLoginFloatingButton />
                        <BetaStabilityMonitor />
                        <SupabaseDebug />
                        <AuthTestComponent />
                        <ThemeTester />
                      </>
                    )}
                    <GlobalSecretMenu />
                    <BetaTestingFeatures />
                  </div>
                </UniversalCreatorFeatures>
              </Router>
            </FlightAnimationProvider>
          </GlobalSecretEffectsProvider>
        </NotificationProvider>
      </SecureAuthProvider>
    </ErrorBoundary>
  );
};

export default App;
