export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  feedback: string[];
  suggestions: string[];
  isValid: boolean;
}

export interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSpecialChar: boolean;
  notCommon: boolean;
}

// Common passwords to avoid
const COMMON_PASSWORDS = [
  'password', '123456', '123456789', '12345678', '12345', '1234567',
  'password123', 'admin', 'qwerty', 'abc123', 'letmein', 'monkey',
  'welcome', 'login', 'princess', 'solo', 'dragon', 'passw0rd',
  'password1', 'master', 'hello', 'freedom', 'whatever', 'iloveyou'
];

export const checkPasswordRequirements = (password: string): PasswordRequirements => {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    notCommon: !COMMON_PASSWORDS.includes(password.toLowerCase())
  };
};

export const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return {
      score: 0,
      feedback: [],
      suggestions: ['Enter a password'],
      isValid: false
    };
  }

  const requirements = checkPasswordRequirements(password);
  const feedback: string[] = [];
  const suggestions: string[] = [];
  
  // Check requirements and provide feedback
  if (!requirements.minLength) {
    feedback.push('Password must be at least 8 characters');
    suggestions.push('Use at least 8 characters');
  }
  
  if (!requirements.hasUppercase) {
    feedback.push('Missing uppercase letter');
    suggestions.push('Add an uppercase letter (A-Z)');
  }
  
  if (!requirements.hasLowercase) {
    feedback.push('Missing lowercase letter');
    suggestions.push('Add a lowercase letter (a-z)');
  }
  
  if (!requirements.hasNumbers) {
    feedback.push('Missing number');
    suggestions.push('Add a number (0-9)');
  }
  
  if (!requirements.hasSpecialChar) {
    feedback.push('Missing special character');
    suggestions.push('Add a special character (!@#$%^&*)');
  }
  
  if (!requirements.notCommon) {
    feedback.push('Password is too common');
    suggestions.push('Choose a more unique password');
  }

  // Calculate score based on requirements met
  const requirementsMet = Object.values(requirements).filter(Boolean).length;
  let score: 0 | 1 | 2 | 3 | 4 = 0;
  
  if (requirementsMet >= 6) score = 4; // All requirements + length
  else if (requirementsMet >= 5) score = 3;
  else if (requirementsMet >= 3) score = 2;
  else if (requirementsMet >= 1) score = 1;
  
  // Additional checks for stronger passwords
  if (password.length >= 12) score = Math.min(4, score + 1) as 0 | 1 | 2 | 3 | 4;
  if (/(.)\1{2,}/.test(password)) score = Math.max(0, score - 1) as 0 | 1 | 2 | 3 | 4; // Repeated characters

  const isValid = Object.values(requirements).every(Boolean);

  return {
    score,
    feedback,
    suggestions,
    isValid
  };
};

export const getPasswordStrengthLabel = (score: 0 | 1 | 2 | 3 | 4): string => {
  switch (score) {
    case 0: return 'Very Weak';
    case 1: return 'Weak';
    case 2: return 'Fair';
    case 3: return 'Good';
    case 4: return 'Strong';
    default: return 'Very Weak';
  }
};

export const getPasswordStrengthColor = (score: 0 | 1 | 2 | 3 | 4): string => {
  switch (score) {
    case 0: return 'hsl(var(--destructive))';
    case 1: return 'hsl(var(--destructive))';
    case 2: return 'hsl(var(--warning))';
    case 3: return 'hsl(var(--primary))';
    case 4: return 'hsl(var(--success))';
    default: return 'hsl(var(--destructive))';
  }
};