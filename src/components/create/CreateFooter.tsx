import React from 'react';

export const CreateFooter: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full bg-surface-deep/60 backdrop-blur-sm border-t border-surface-medium py-6 px-6 z-[100] 
                     translate-y-full opacity-0 transition-all duration-300 ease-in-out
                     group-hover:translate-y-0 group-hover:opacity-100
                     hover:translate-y-0 hover:opacity-100">
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