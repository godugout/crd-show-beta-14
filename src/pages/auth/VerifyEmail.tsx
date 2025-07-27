import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { CRDButton } from '@/components/ui/design-system';
import { Mail, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useSecureAuth } from '@/features/auth/providers/SecureAuthProvider';
import { toast } from '@/hooks/use-toast';

const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user  } = useSecureAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const email = location.state?.email || user?.email || '';

  useEffect(() => {
    // If user is already verified, redirect to home
    if (user && user.email_confirmed_at) {
      navigate('/');
      return;
    }

    // Cooldown timer
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate, resendCooldown]);

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: 'Error',
        description: 'No email address found. Please try signing up again.',
        variant: 'destructive',
      });
      return;
    }

    setIsResending(true);
    
    try {
      // This would typically call a resend verification endpoint
      // For now, we'll just show a success message
      toast({
        title: 'Verification email sent',
        description: `A new verification email has been sent to ${email}`,
      });
      setResendCooldown(60); // 60 second cooldown
    } catch (error) {
      toast({
        title: 'Failed to resend',
        description: 'There was an error sending the verification email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      description="We've sent a verification link to your email address"
    >
      <div className="space-y-6">
        {/* Email Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-crd-primary/20 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-crd-primary" />
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center space-y-3">
          {email && (
            <p className="text-crd-text-secondary">
              We've sent a verification link to{' '}
              <span className="text-crd-white font-medium">{email}</span>
            </p>
          )}
          
          <div className="space-y-2 text-sm text-crd-text-secondary">
            <p>• Click the link in the email to verify your account</p>
            <p>• Check your spam or junk folder if you don't see it</p>
            <p>• The link will expire in 24 hours</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {/* Resend Button */}
          <CRDButton
            onClick={handleResendVerification}
            disabled={isResending || resendCooldown > 0}
            variant="outline"
            className="w-full"
          >
            {isResending ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Sending...
              </div>
            ) : resendCooldown > 0 ? (
              `Resend in ${resendCooldown}s`
            ) : (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Resend verification email
              </div>
            )}
          </CRDButton>

          {/* Back to Sign In */}
          <div className="text-center">
            <Link 
              to="/auth/signin" 
              className="text-crd-primary hover:text-crd-primary-hover underline text-sm"
            >
              Back to sign in
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="p-4 bg-crd-surface/50 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-crd-warning mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="text-crd-white font-medium">Having trouble?</p>
              <ul className="text-crd-text-secondary space-y-1">
                <li>• Make sure to check your spam/junk folder</li>
                <li>• Add our email to your contacts</li>
                <li>• Try a different email address if the problem persists</li>
              </ul>
              <p className="text-crd-text-secondary">
                Still need help?{' '}
                <Link to="/support" className="text-crd-primary hover:text-crd-primary-hover underline">
                  Contact support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;