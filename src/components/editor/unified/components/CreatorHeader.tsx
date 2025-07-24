
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system/Button';

interface CreatorHeaderProps {
  title: string;
}

export const CreatorHeader = ({ title }: CreatorHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-crd-darker border-b border-crd-mediumGray/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-crd-white">
          {title}
        </h1>
        <CRDButton
          variant="outline"
          onClick={() => navigate('/gallery')}
          className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
        >
          Cancel
        </CRDButton>
      </div>
    </div>
  );
};
