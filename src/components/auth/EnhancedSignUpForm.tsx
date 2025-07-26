import React from 'react';
import { Link } from 'react-router-dom';
import { CRDButton, CRDInput } from '@/components/ui/design-system';
import { Label } from '@/components/ui/label';
import { User, CheckCircle, Mail } from 'lucide-react';
import { useEnhancedSignUpForm } from './hooks/useEnhancedSignUpForm';
import { AuthFormContainer } from './components/AuthFormContainer';
import { EnhancedPasswordFields } from './components/EnhancedPasswordFields';
import { EnhancedEmailField } from './components/EnhancedEmailField';
import { TermsAcceptance } from './components/TermsAcceptance';

export const EnhancedSignUpForm: React.FC = () => {
  const {
    formData,
    handleInputChange,
    handleSubmit,
    isLoading,
    isFormValid,
    emailVerificationSent,
  } = useEnhancedSignUpForm();

  if (emailVerificationSent) {
    return (
      <AuthFormContainer showOAuth={false} showSeparator={false}>
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-crd-success/20 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-crd-success" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-crd-white">Check your email</h2>
            <p className="text-crd-text-secondary">
              We've sent a verification link to{' '}
              <span className="text-crd-white font-medium">{formData.email}</span>
            </p>
          </div>

          <div className="space-y-3 text-sm text-crd-text-secondary">
            <p>Click the link in the email to verify your account.</p>
            <p>Don't see the email? Check your spam folder.</p>
          </div>

          <div className="pt-4">
            <Link 
              to="/auth/signin" 
              className="text-crd-primary hover:text-crd-primary-hover underline"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </AuthFormContainer>
    );
  }

  return (
    <AuthFormContainer>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-crd-white">
              Full Name <span className="text-crd-warning">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray h-4 w-4" />
              <CRDInput
                id="fullName"
                variant="crd"
                placeholder="Your full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="pl-10"
                required
                autoComplete="name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-crd-white">
              Username <span className="text-crd-warning">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray h-4 w-4" />
              <CRDInput
                id="username"
                variant="crd"
                placeholder="Choose a username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="pl-10"
                required
                autoComplete="username"
              />
            </div>
            {formData.username && formData.username.length < 3 && (
              <p className="text-xs text-crd-text-secondary">
                Username must be at least 3 characters
              </p>
            )}
          </div>
        </div>

        {/* Email Field */}
        <EnhancedEmailField
          email={formData.email}
          onEmailChange={(value) => handleInputChange('email', value)}
        />

        {/* Password Fields */}
        <EnhancedPasswordFields
          password={formData.password}
          confirmPassword={formData.confirmPassword}
          onPasswordChange={(value) => handleInputChange('password', value)}
          onConfirmPasswordChange={(value) => handleInputChange('confirmPassword', value)}
        />

        {/* Terms Acceptance */}
        <TermsAcceptance
          accepted={formData.acceptTerms}
          onAcceptedChange={(accepted) => handleInputChange('acceptTerms', accepted)}
        />

        {/* Submit Button */}
        <CRDButton
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Creating account...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Create Account
            </div>
          )}
        </CRDButton>

        {/* Sign In Link */}
        <div className="text-center">
          <span className="text-crd-lightGray">Already have an account? </span>
          <Link to="/auth/signin" className="text-crd-blue hover:text-crd-blue/80">
            Sign in
          </Link>
        </div>
      </form>
    </AuthFormContainer>
  );
};