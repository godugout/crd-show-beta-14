export interface RateLimitConfig {
  maxAttempts: number;
  lockoutDuration: number; // milliseconds
  windowSize: number; // milliseconds
}

export class RateLimiter {
  private attempts = new Map<string, { count: number; firstAttempt: number }>();
  private lockouts = new Map<string, number>();

  constructor(private config: RateLimitConfig = {
    maxAttempts: parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS || '5'),
    lockoutDuration: parseInt(import.meta.env.VITE_ACCOUNT_LOCKOUT_DURATION || '900') * 1000, // 15 minutes
    windowSize: 15 * 60 * 1000 // 15 minutes
  }) {}

  async checkRateLimit(identifier: string): Promise<{ allowed: boolean; remainingAttempts: number; lockoutTime?: number }> {
    const now = Date.now();
    
    // Check if account is locked
    const lockoutTime = this.lockouts.get(identifier);
    if (lockoutTime && now < lockoutTime) {
      return {
        allowed: false,
        remainingAttempts: 0,
        lockoutTime: lockoutTime - now
      };
    }

    // Clear expired lockout
    if (lockoutTime && now >= lockoutTime) {
      this.lockouts.delete(identifier);
    }

    // Get current attempts
    const attemptData = this.attempts.get(identifier);
    
    if (!attemptData) {
      return { allowed: true, remainingAttempts: this.config.maxAttempts };
    }

    // Check if window has expired
    if (now - attemptData.firstAttempt > this.config.windowSize) {
      this.attempts.delete(identifier);
      return { allowed: true, remainingAttempts: this.config.maxAttempts };
    }

    const remainingAttempts = Math.max(0, this.config.maxAttempts - attemptData.count);
    
    if (attemptData.count >= this.config.maxAttempts) {
      // Lock account
      const lockoutEnd = now + this.config.lockoutDuration;
      this.lockouts.set(identifier, lockoutEnd);
      this.attempts.delete(identifier);
      
      return {
        allowed: false,
        remainingAttempts: 0,
        lockoutTime: this.config.lockoutDuration
      };
    }

    return {
      allowed: true,
      remainingAttempts
    };
  }

  recordAttempt(identifier: string, success: boolean): void {
    const now = Date.now();
    
    if (success) {
      // Clear attempts on successful login
      this.attempts.delete(identifier);
      this.lockouts.delete(identifier);
      return;
    }

    // Record failed attempt
    const attemptData = this.attempts.get(identifier);
    
    if (!attemptData) {
      this.attempts.set(identifier, {
        count: 1,
        firstAttempt: now
      });
    } else {
      attemptData.count++;
    }
  }

  getAttempts(identifier: string): number {
    return this.attempts.get(identifier)?.count || 0;
  }

  isLocked(identifier: string): boolean {
    const lockoutTime = this.lockouts.get(identifier);
    return lockoutTime ? Date.now() < lockoutTime : false;
  }

  getLockoutTime(identifier: string): number | null {
    const lockoutTime = this.lockouts.get(identifier);
    if (!lockoutTime) return null;
    
    const remaining = lockoutTime - Date.now();
    return remaining > 0 ? remaining : null;
  }

  // Clear all data (useful for testing)
  clear(): void {
    this.attempts.clear();
    this.lockouts.clear();
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter(); 