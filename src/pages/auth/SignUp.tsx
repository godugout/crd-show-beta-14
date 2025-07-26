
import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { EnhancedSignUpForm } from '@/components/auth/EnhancedSignUpForm';

const SignUp = () => {
  return (
    <AuthLayout
      title="Create your account"
      description="Join Cardshow and start creating amazing digital trading cards"
    >
      <EnhancedSignUpForm />
    </AuthLayout>
  );
};

export default SignUp;
