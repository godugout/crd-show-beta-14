import React from 'react';

export const CreateFooter: React.FC = () => {
  return (
    <footer className="bg-surface-deep border-t border-surface-medium py-6 px-6 mt-auto z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-text-secondary text-sm">
            © 2024 Cardshow. Creating the future of digital collectibles.
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <a href="/terms" className="text-text-muted hover:text-crd-primary transition-colors">
              Terms
            </a>
            <a href="/privacy" className="text-text-muted hover:text-crd-primary transition-colors">
              Privacy
            </a>
            <a href="/support" className="text-text-muted hover:text-crd-primary transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};