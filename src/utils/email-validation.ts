// Disposable email domains to block
const DISPOSABLE_EMAIL_DOMAINS = [
  '10minutemail.com',
  'tempmail.org',
  'guerrillamail.com',
  'mailinator.com',
  'yopmail.com',
  'throwaway.email',
  'temp-mail.org',
  'getairmail.com',
  'maildrop.cc',
  'sharklasers.com',
  'guerrillamailblock.com',
  'pokemail.net',
  'spam4.me',
  'bccto.me',
  'chacuo.net',
  'dispostable.com',
  'trashmail.net',
  'tempail.com',
  'tempemail.net'
];

export interface EmailValidation {
  isValid: boolean;
  error?: string;
}

export const validateEmail = (email: string): EmailValidation => {
  if (!email) {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }

  // Check for disposable email domains
  const domain = email.split('@')[1]?.toLowerCase();
  if (domain && DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
    return {
      isValid: false,
      error: 'Disposable email addresses are not allowed'
    };
  }

  // Additional email quality checks
  if (email.length > 254) {
    return {
      isValid: false,
      error: 'Email address is too long'
    };
  }

  const localPart = email.split('@')[0];
  if (localPart.length > 64) {
    return {
      isValid: false,
      error: 'Email address is too long'
    };
  }

  // Check for consecutive dots
  if (email.includes('..')) {
    return {
      isValid: false,
      error: 'Email address format is invalid'
    };
  }

  return { isValid: true };
};

export const isEducationalEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain?.endsWith('.edu') || domain?.endsWith('.ac.uk') || domain?.endsWith('.edu.au') || false;
};

export const getDomainSuggestions = (email: string): string[] => {
  const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  
  if (!domain) return [];
  
  // Simple typo detection for common domains
  const suggestions: string[] = [];
  
  if (domain.includes('gmail') && domain !== 'gmail.com') {
    suggestions.push(email.replace(domain, 'gmail.com'));
  }
  
  if (domain.includes('yahoo') && domain !== 'yahoo.com') {
    suggestions.push(email.replace(domain, 'yahoo.com'));
  }
  
  if (domain.includes('hotmail') && domain !== 'hotmail.com') {
    suggestions.push(email.replace(domain, 'hotmail.com'));
  }
  
  return suggestions;
};