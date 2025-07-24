
import { User, Session } from '@supabase/supabase-js';

export class DevAuthService {
  private readonly DEV_USER_KEY = 'dev_auth_user';
  private readonly DEV_SESSION_KEY = 'dev_auth_session';

  isDevMode(): boolean {
    const isDevEnv = process.env.NODE_ENV === 'development';
    const hostname = window.location.hostname;
    const isLocalhost = ['localhost', '127.0.0.1', '0.0.0.0'].includes(hostname) || hostname.startsWith('localhost');
    const isLovablePreview = hostname.includes('.lovableproject.com');
    
    console.log('🔧 Dev mode check:', { 
      nodeEnv: process.env.NODE_ENV, 
      hostname, 
      isDevEnv, 
      isLocalhost,
      isLovablePreview,
      result: isDevEnv && (isLocalhost || isLovablePreview)
    });
    
    return isDevEnv && (isLocalhost || isLovablePreview);
  }

  getDiagnosticInfo(): string {
    const hostname = window.location.hostname;
    const nodeEnv = process.env.NODE_ENV;
    const isDevModeActive = this.isDevMode();
    
    return `Environment: ${nodeEnv}, Hostname: ${hostname}, Dev Mode: ${isDevModeActive}`;
  }

  forceCreateDevSession() {
    console.log('🔧 Force creating dev session...');
    return this.createDevUserSession();
  }

  createDevUserSession() {
    // Allow dev session creation in development environment
    if (process.env.NODE_ENV !== 'development') {
      return { user: null, session: null, error: new Error('Not in development environment') };
    }

    const devUser: User = {
      id: '196b5883-8d80-4f7a-9c5f-5f83f964f9ce',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'admin@cardshow.com',
      email_confirmed_at: new Date().toISOString(),
      phone: '',
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {
        provider: 'email',
        providers: ['email']
      },
      user_metadata: {
        full_name: 'Dev User',
        username: 'devuser',
        avatar_url: ''
      },
      identities: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const devSession: Session = {
      access_token: 'dev-access-token',
      refresh_token: 'dev-refresh-token',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      user: devUser
    };

    // Store in localStorage for persistence
    localStorage.setItem(this.DEV_USER_KEY, JSON.stringify(devUser));
    localStorage.setItem(this.DEV_SESSION_KEY, JSON.stringify(devSession));

    console.log('🔧 Created dev user session');
    return { user: devUser, session: devSession, error: null };
  }

  getStoredDevSession() {
    // Allow retrieving dev session in development environment
    if (process.env.NODE_ENV !== 'development') {
      return { user: null, session: null };
    }

    try {
      const storedUser = localStorage.getItem(this.DEV_USER_KEY);
      const storedSession = localStorage.getItem(this.DEV_SESSION_KEY);

      if (storedUser && storedSession) {
        return {
          user: JSON.parse(storedUser) as User,
          session: JSON.parse(storedSession) as Session
        };
      }
    } catch (error) {
      console.error('🔧 Error loading dev session:', error);
    }

    return { user: null, session: null };
  }

  clearDevSession() {
    localStorage.removeItem(this.DEV_USER_KEY);
    localStorage.removeItem(this.DEV_SESSION_KEY);
    console.log('🔧 Cleared dev session');
  }
}

export const devAuthService = new DevAuthService();
