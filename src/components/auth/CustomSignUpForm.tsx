
import { CRDButton } from '@/components/ui/design-system';
import { useSecureAuth } from '@/features/auth/providers/SecureAuthProvider';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CustomSignUpForm: React.FC = () => {
  const { signUp } = useSecureAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: ''
  });

  const isFormValid = username.length >= 3 && 
    passcode.length >= 4 && 
    passcode.length <= 8 && 
    passcode === confirmPasscode;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      return;
    }

    setIsLoading(true);
    
    const { error } = await signUp(username, passcode);
    
    if (!error) {
      if (onComplete) {
        onComplete();
      }
    }
    
    setIsLoading(false);
  };

  return (
    <AuthFormContainer showOAuth={false} showSeparator={false}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <UsernameField
          username={username}
          onUsernameChange={setUsername}
          placeholder="Choose a username (3-20 characters)"
          label="Username"
        />

        <PasscodeField
          passcode={passcode}
          onPasscodeChange={setPasscode}
          placeholder="Create a 4-8 digit passcode"
          label="Create Passcode"
        />

        <PasscodeField
          passcode={confirmPasscode}
          onPasscodeChange={setConfirmPasscode}
          placeholder="Confirm your passcode"
          label="Confirm Passcode"
        />

        {passcode !== confirmPasscode && confirmPasscode.length > 0 && (
          <p className="text-sm text-red-500">Passcodes do not match</p>
        )}

        <div className="text-xs text-crd-lightGray space-y-1">
          <p>• Username: 3-20 characters, letters and numbers only</p>
          <p>• Passcode: 4-8 digits only</p>
        </div>

        <CRDButton
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </CRDButton>
      </form>

      {!onComplete && (
        <div className="text-center">
          <span className="text-crd-lightGray">Already have an account? </span>
          <Link to="/auth/signin" className="text-crd-blue hover:text-crd-blue/80">
            Sign in
          </Link>
        </div>
      )}
    </AuthFormContainer>
  );
};
