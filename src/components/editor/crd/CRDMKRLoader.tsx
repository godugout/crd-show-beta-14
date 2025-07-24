import React from 'react';

interface CRDMKRLoaderProps {
  message?: string;
  className?: string;
}

export const CRDMKRLoader: React.FC<CRDMKRLoaderProps> = ({
  message = 'Loading CRDMKR',
  className = ''
}) => {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-crd-darkest ${className}`}>
      <div className="text-center space-y-6">
        {/* Custom Loader with CRD Brand Gradients */}
        <div className="relative w-[65px] aspect-square mx-auto">
          <span className="absolute rounded-[50px] crd-loader-spin shadow-[inset_0_0_0_3px] shadow-crd-green" />
          <span className="absolute rounded-[50px] crd-loader-spin crd-loader-delay shadow-[inset_0_0_0_3px] shadow-crd-orange" />
          
          <style>{`
            @keyframes crdLoaderAnim {
              0% { inset: 0 35px 35px 0; }
              12.5% { inset: 0 35px 0 0; }
              25% { inset: 35px 35px 0 0; }
              37.5% { inset: 35px 0 0 0; }
              50% { inset: 35px 0 0 35px; }
              62.5% { inset: 0 0 0 35px; }
              75% { inset: 0 0 35px 35px; }
              87.5% { inset: 0 0 35px 0; }
              100% { inset: 0 35px 35px 0; }
            }
            .crd-loader-spin {
              animation: crdLoaderAnim 2.5s infinite;
            }
            .crd-loader-delay {
              animation-delay: -1.25s;
            }
          `}</style>
        </div>
        
        {/* Loading Text */}
        <p className="text-xl font-semibold text-crd-white">
          {message}
        </p>
      </div>
    </div>
  );
};