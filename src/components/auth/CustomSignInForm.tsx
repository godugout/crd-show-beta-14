
import { CRDButton } from '@/components/ui/design-system';
import { useSecureAuth } from '@/features/auth/providers/SecureAuthProvider';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthFormContainer } from './components/AuthFormContainer';
import { PasscodeField } from './components/PasscodeField';
import { UsernameField } from './components/UsernameField';

export const CustomSignInForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useSecureAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !passcode) {
      return;
    }

    setIsLoading(true);
    
    const { error } = await signIn(username, passcode);
    
    if (!error) {
      navigate('/');
    }
    
    setIsLoading(false);
  };

  return (
    <AuthFormContainer showOAuth={false} showSeparator={false}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <UsernameField
          username={username}
          onUsernameChange={setUsername}
        />

        <PasscodeField
          passcode={passcode}
          onPasscodeChange={setPasscode}
        />

        <CRDButton
          type="submit"
          variant="outline"
          size="lg"
          className="w-full"
          disabled={isLoading || !username || !passcode || passcode.length < 4}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </CRDButton>
      </form>

      <div className="text-center">
        <span className="text-crd-lightGray">Don't have an account? </span>
        <Link to="/auth/signup" className="text-crd-lightGray hover:text-crd-white underline">
          Sign up
        </Link>
      </div>
    </AuthFormContainer>
  );
};
