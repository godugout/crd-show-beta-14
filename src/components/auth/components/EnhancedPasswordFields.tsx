import React, { useState } from 'react';
import { CRDInput } from '@/components/ui/design-system';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { getPasswordStrength } from '@/utils/password-validation';

interface EnhancedPasswordFieldsProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  showStrengthIndicator?: boolean;
  showRequirements?: boolean;
}

export const EnhancedPasswordFields: React.FC<EnhancedPasswordFieldsProps> = ({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  showStrengthIndicator = true,
  showRequirements = true
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = password === confirmPassword;
  const showMismatchError = confirmPasswordTouched && confirmPassword && !passwordsMatch;

  return (
    <div className="space-y-4">
      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-crd-white">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray h-4 w-4" />
          <CRDInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            variant="crd"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => {
              onPasswordChange(e.target.value);
              if (!passwordTouched) setPasswordTouched(true);
            }}
            onBlur={() => setPasswordTouched(true)}
            className={`pl-10 pr-10 ${
              passwordTouched && password && !passwordStrength.isValid 
                ? 'border-crd-warning' 
                : ''
            }`}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray hover:text-crd-white"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {showStrengthIndicator && passwordTouched && password && (
          <PasswordStrengthIndicator 
            password={password} 
            showRequirements={showRequirements}
          />
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-crd-white">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray h-4 w-4" />
          <CRDInput
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            variant="crd"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => {
              onConfirmPasswordChange(e.target.value);
              if (!confirmPasswordTouched) setConfirmPasswordTouched(true);
            }}
            onBlur={() => setConfirmPasswordTouched(true)}
            className={`pl-10 pr-10 ${
              showMismatchError ? 'border-crd-warning' : ''
            }`}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray hover:text-crd-white"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Password Mismatch Error */}
        {showMismatchError && (
          <div className="flex items-center gap-2 text-sm text-crd-warning">
            <AlertTriangle className="h-3 w-3" />
            <span>Passwords do not match</span>
          </div>
        )}
      </div>
    </div>
  );
};