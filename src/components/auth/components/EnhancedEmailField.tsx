import React, { useState, useEffect } from 'react';
import { CRDInput } from '@/components/ui/design-system';
import { Label } from '@/components/ui/label';
import { Mail, AlertTriangle, CheckCircle } from 'lucide-react';
import { validateEmail, getDomainSuggestions } from '@/utils/email-validation';

interface EnhancedEmailFieldProps {
  email: string;
  onEmailChange: (value: string) => void;
  required?: boolean;
}

export const EnhancedEmailField: React.FC<EnhancedEmailFieldProps> = ({
  email,
  onEmailChange,
  required = true
}) => {
  const [emailTouched, setEmailTouched] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const emailValidation = validateEmail(email);
  const showError = emailTouched && email && !emailValidation.isValid;
  const showSuccess = emailTouched && email && emailValidation.isValid;

  useEffect(() => {
    if (email && !emailValidation.isValid) {
      const domainSuggestions = getDomainSuggestions(email);
      setSuggestions(domainSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [email, emailValidation.isValid]);

  const handleSuggestionClick = (suggestion: string) => {
    onEmailChange(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="email" className="text-crd-white">
        Email {required && <span className="text-crd-warning">*</span>}
      </Label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray h-4 w-4" />
        <CRDInput
          id="email"
          type="email"
          variant="crd"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => {
            onEmailChange(e.target.value);
            if (!emailTouched) setEmailTouched(true);
          }}
          onBlur={() => setEmailTouched(true)}
          className={`pl-10 pr-10 ${
            showError ? 'border-crd-warning' : 
            showSuccess ? 'border-crd-success' : ''
          }`}
          required={required}
          autoComplete="email"
        />
        {showSuccess && (
          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-crd-success h-4 w-4" />
        )}
      </div>

      {/* Email Validation Error */}
      {showError && emailValidation.error && (
        <div className="flex items-center gap-2 text-sm text-crd-warning">
          <AlertTriangle className="h-3 w-3" />
          <span>{emailValidation.error}</span>
        </div>
      )}

      {/* Email Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-1">
          <span className="text-xs text-crd-text-secondary">Did you mean:</span>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="block text-sm text-crd-primary hover:text-crd-primary-hover underline"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Email Format Help */}
      {emailTouched && email && email.includes('@') && !email.includes('.') && (
        <div className="text-xs text-crd-text-secondary">
          💡 Make sure your email includes a domain (e.g., .com, .org)
        </div>
      )}
    </div>
  );
};