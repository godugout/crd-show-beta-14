
import React from 'react';
import { Button } from '@/components/ui/button';

interface StyleTesterFooterProps {
  onClose: () => void;
}

export const StyleTesterFooter: React.FC<StyleTesterFooterProps> = ({ onClose }) => {
  return (
    <div className="border-t border-crd-mediumGray/20 pt-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-crd-mediumGray">
          Admin Style Tester - Test different 3D background concepts
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button size="sm" className="bg-crd-green hover:bg-crd-green/90 text-black">
            Apply to Production
          </Button>
        </div>
      </div>
    </div>
  );
};
