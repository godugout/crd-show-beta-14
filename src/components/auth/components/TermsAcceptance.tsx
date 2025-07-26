import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

interface TermsAcceptanceProps {
  accepted: boolean;
  onAcceptedChange: (accepted: boolean) => void;
  required?: boolean;
}

export const TermsAcceptance: React.FC<TermsAcceptanceProps> = ({
  accepted,
  onAcceptedChange,
  required = true
}) => {
  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id="terms"
        checked={accepted}
        onCheckedChange={onAcceptedChange}
        required={required}
        className="mt-1"
      />
      <Label 
        htmlFor="terms" 
        className="text-sm text-crd-text-secondary leading-relaxed cursor-pointer"
      >
        I agree to the{' '}
        <Link 
          to="/terms" 
          className="text-crd-primary hover:text-crd-primary-hover underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms of Service
        </Link>
        {' '}and{' '}
        <Link 
          to="/privacy" 
          className="text-crd-primary hover:text-crd-primary-hover underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </Link>
        {required && <span className="text-crd-warning"> *</span>}
      </Label>
    </div>
  );
};