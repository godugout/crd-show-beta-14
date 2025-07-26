import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { 
  getPasswordStrength, 
  getPasswordStrengthLabel, 
  getPasswordStrengthColor,
  checkPasswordRequirements,
  type PasswordStrength 
} from '@/utils/password-validation';

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showRequirements = true
}) => {
  const strength = getPasswordStrength(password);
  const requirements = checkPasswordRequirements(password);
  
  if (!password) return null;

  const progressValue = (strength.score / 4) * 100;
  const strengthColor = getPasswordStrengthColor(strength.score);
  const strengthLabel = getPasswordStrengthLabel(strength.score);

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-crd-text-secondary">Password strength</span>
          <span 
            className="font-medium"
            style={{ color: strengthColor }}
          >
            {strengthLabel}
          </span>
        </div>
        <Progress 
          value={progressValue} 
          className="h-2"
          style={{
            '--progress-background': strengthColor
          } as React.CSSProperties}
        />
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className="space-y-1.5">
          <RequirementItem 
            met={requirements.minLength}
            text="At least 8 characters"
          />
          <RequirementItem 
            met={requirements.hasUppercase}
            text="One uppercase letter"
          />
          <RequirementItem 
            met={requirements.hasLowercase}
            text="One lowercase letter"
          />
          <RequirementItem 
            met={requirements.hasNumbers}
            text="One number"
          />
          <RequirementItem 
            met={requirements.hasSpecialChar}
            text="One special character"
          />
          <RequirementItem 
            met={requirements.notCommon}
            text="Not a common password"
          />
        </div>
      )}

      {/* Feedback */}
      {strength.feedback.length > 0 && (
        <div className="space-y-1">
          {strength.feedback.map((feedback, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-crd-warning">
              <AlertCircle className="h-3 w-3" />
              <span>{feedback}</span>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {strength.suggestions.length > 0 && (
        <div className="space-y-1">
          {strength.suggestions.map((suggestion, index) => (
            <div key={index} className="text-xs text-crd-text-secondary">
              💡 {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface RequirementItemProps {
  met: boolean;
  text: string;
}

const RequirementItem: React.FC<RequirementItemProps> = ({ met, text }) => (
  <div className="flex items-center gap-2 text-sm">
    {met ? (
      <CheckCircle className="h-3 w-3 text-crd-success" />
    ) : (
      <XCircle className="h-3 w-3 text-crd-text-dim" />
    )}
    <span className={met ? 'text-crd-text-primary' : 'text-crd-text-secondary'}>
      {text}
    </span>
  </div>
);