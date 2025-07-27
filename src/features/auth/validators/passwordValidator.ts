export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  score: number; // 0-100
}

export class PasswordValidator {
  private static readonly MIN_LENGTH = 8;
  private static readonly MAX_LENGTH = 128;
  
  private static readonly PATTERNS = {
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    numbers: /\d/,
    special: /[!@#$%^&*(),.?":{}|<>]/,
    commonPasswords: /^(password|123456|qwerty|admin|letmein)$/i
  };

  static validate(password: string): PasswordValidationResult {
    const errors: string[] = [];
    let score = 0;

    // Basic length checks
    if (password.length < this.MIN_LENGTH) {
      errors.push(`Password must be at least ${this.MIN_LENGTH} characters long`);
    } else {
      score += 10;
    }

    if (password.length > this.MAX_LENGTH) {
      errors.push(`Password must be no more than ${this.MAX_LENGTH} characters long`);
    }

    // Character type checks
    if (!this.PATTERNS.lowercase.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else {
      score += 10;
    }

    if (!this.PATTERNS.uppercase.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else {
      score += 10;
    }

    if (!this.PATTERNS.numbers.test(password)) {
      errors.push('Password must contain at least one number');
    } else {
      score += 10;
    }

    if (!this.PATTERNS.special.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
    } else {
      score += 15;
    }

    // Security checks
    if (this.PATTERNS.commonPasswords.test(password)) {
      errors.push('Password cannot be a common password');
    } else {
      score += 10;
    }

    // Entropy and complexity scoring
    const uniqueChars = new Set(password).size;
    if (uniqueChars < 8) {
      errors.push('Password must contain at least 8 unique characters');
    } else {
      score += Math.min(15, uniqueChars * 2);
    }

    // Length bonus
    if (password.length >= 12) {
      score += 10;
    } else if (password.length >= 10) {
      score += 5;
    }

    // Consecutive character penalty
    let consecutiveCount = 0;
    for (let i = 1; i < password.length; i++) {
      if (password[i] === password[i - 1]) {
        consecutiveCount++;
      }
    }
    if (consecutiveCount > 2) {
      score -= Math.min(10, consecutiveCount * 2);
    }

    // Determine strength
    let strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    if (score < 40) {
      strength = 'weak';
    } else if (score < 60) {
      strength = 'medium';
    } else if (score < 80) {
      strength = 'strong';
    } else {
      strength = 'very-strong';
    }

    return {
      valid: errors.length === 0,
      errors,
      strength,
      score: Math.max(0, Math.min(100, score))
    };
  }

  static getStrengthColor(strength: string): string {
    switch (strength) {
      case 'weak': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'strong': return 'text-green-500';
      case 'very-strong': return 'text-emerald-500';
      default: return 'text-gray-500';
    }
  }

  static getStrengthMessage(strength: string): string {
    switch (strength) {
      case 'weak': return 'Very weak password';
      case 'medium': return 'Weak password';
      case 'strong': return 'Good password';
      case 'very-strong': return 'Excellent password';
      default: return 'Password strength unknown';
    }
  }

  static getStrengthIcon(strength: string): string {
    switch (strength) {
      case 'weak': return '🔴';
      case 'medium': return '🟡';
      case 'strong': return '🟢';
      case 'very-strong': return '💪';
      default: return '⚪';
    }
  }
} 