import React from 'react';
import { NavbarSafeLayout } from './NavbarSafeLayout';

export const NavbarSpacingTest: React.FC = () => {
  return (
    <NavbarSafeLayout className="bg-crd-darkest min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-crd-darker border border-crd-mediumGray/20 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-crd-white mb-4">
            🧪 Navbar Spacing Test
          </h1>
          
          <div className="space-y-4 text-crd-lightGray">
            <p>
              <strong className="text-crd-white">✅ Test Results:</strong>
            </p>
            
            <div className="bg-crd-surface rounded p-4 space-y-2">
              <p>• Content should be visible below the navbar</p>
              <p>• No overlap with the fixed navbar</p>
              <p>• Proper spacing on mobile devices</p>
              <p>• Responsive padding adjustments</p>
            </div>
            
            <div className="bg-crd-green/10 border border-crd-green/20 rounded p-4">
              <p className="text-crd-green font-semibold">
                🎉 If you can see this content clearly below the navbar, the spacing is working correctly!
              </p>
            </div>
            
            <div className="bg-crd-orange/10 border border-crd-orange/20 rounded p-4">
              <p className="text-crd-orange font-semibold">
                📱 Test on mobile: The spacing should adjust automatically
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-crd-mediumGray/20">
            <h2 className="text-lg font-semibold text-crd-white mb-2">CSS Variables Used:</h2>
            <div className="text-sm text-crd-lightGray space-y-1">
              <p>• --navbar-height: 4rem (64px)</p>
              <p>• --navbar-height-mobile: 3.5rem (56px)</p>
              <p>• --content-top-padding: calc(var(--navbar-height) + 1rem)</p>
              <p>• --content-top-padding-mobile: calc(var(--navbar-height-mobile) + 0.75rem)</p>
            </div>
          </div>
        </div>
      </div>
    </NavbarSafeLayout>
  );
}; 