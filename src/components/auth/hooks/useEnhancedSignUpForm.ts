import { toast } from '@/hooks/use-toast';
import { validateEmail } from '@/utils/email-validation';
import { getPasswordStrength } from '@/utils/password-validation';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface EnhancedSignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  fullName: string;
  acceptTerms: boolean;
}

export const useEnhancedSignUpForm = () => {
  const [formData, setFormData] = useState<EnhancedSignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: '',
    acceptTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  
  const { signUp } = useSecureAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: keyof EnhancedSignUpFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Validation checks
  const emailValidation = validateEmail(formData.email);
  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword;
  
  const isFormValid = 
    emailValidation.isValid &&
    passwordStrength.isValid &&
    passwordsMatch &&
    formData.password &&
    formData.confirmPassword &&
    formData.username.trim().length >= 3 &&
    formData.fullName.trim().length >= 2 &&
    formData.acceptTerms;

  const getFormErrors = () => {
    const errors: string[] = [];
    
    if (formData.email && !emailValidation.isValid) {
      errors.push(emailValidation.error || 'Invalid email');
    }
    
    if (formData.password && !passwordStrength.isValid) {
      errors.push('Password does not meet security requirements');
    }
    
    if (formData.password && formData.confirmPassword && !passwordsMatch) {
      errors.push('Passwords do not match');
    }
    
    if (formData.username && formData.username.trim().length < 3) {
      errors.push('Username must be at least 3 characters');
    }
    
    if (formData.fullName && formData.fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters');
    }
    
    if (!formData.acceptTerms) {
      errors.push('You must accept the terms and conditions');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = getFormErrors();
    if (errors.length > 0) {
      toast({
        title: 'Please fix the following errors:',
        description: errors.join(', '),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/auth/verify-email`;
      
      const { error } = await signUp(formData.email, formData.password, {
        username: formData.username,
        full_name: formData.fullName,
        emailRedirectTo: redirectUrl
      });
      
      if (error) {
        toast({
          title: 'Sign Up Failed',
          description: error.message || 'Failed to create account',
          variant: 'destructive',
        });
      } else {
        setEmailVerificationSent(true);
        toast({
          title: 'Account Created!',
          description: 'Please check your email to verify your account.',
        });
        
        // Redirect to verification page after a short delay
        setTimeout(() => {
          navigate('/auth/verify-email', { 
            state: { email: formData.email }
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: 'Sign Up Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    handleInputChange,
    handleSubmit,
    isLoading,
    isFormValid,
    emailVerificationSent,
    validation: {
      email: emailValidation,
      password: passwordStrength,
      passwordsMatch,
    },
    errors: getFormErrors(),
  };
};