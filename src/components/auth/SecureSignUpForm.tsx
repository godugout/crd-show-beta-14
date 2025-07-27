import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSecureAuth } from '@/features/auth/providers/SecureAuthProvider';
import { PasswordValidator } from '@/features/auth/validators/passwordValidator';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Eye, EyeOff, XCircle } from 'lucide-react';
import React, { useState } from 'react';

export const SecureSignUpForm: React.FC = () => {
  const { signUp, rateLimitInfo } = useSecureAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    username: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<ReturnType<typeof PasswordValidator.validate> | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);

    if (field === 'password') {
      setPasswordValidation(PasswordValidator.validate(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form
    if (!formData.email || !formData.password || !formData.fullName) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (passwordValidation && !passwordValidation.valid) {
      setError('Please fix password validation errors.');
      setLoading(false);
      return;
    }

    try {
      const result = await signUp(
        formData.email,
        formData.password,
        formData.fullName,
        formData.username || undefined
      );

      if (result.success) {
        setSuccess(true);
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          fullName: '',
          username: ''
        });
        setPasswordValidation(null);
      } else {
        setError(result.error || 'Sign up failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'strong': return 'text-green-500';
      case 'very-strong': return 'text-emerald-500';
      default: return 'text-gray-500';
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-green-800">Account Created Successfully!</CardTitle>
            <CardDescription className="text-green-600">
              Please check your email to verify your account before signing in.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={() => setSuccess(false)}
              variant="outline"
              className="w-full"
            >
              Create Another Account
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Join CRD Show and start creating amazing cards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username (Optional)</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Choose a username"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a strong password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

              {/* Password Strength Indicator */}
              {passwordValidation && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getPasswordStrengthColor(passwordValidation.strength)}`}>
                      {PasswordValidator.getStrengthIcon(passwordValidation.strength)} {PasswordValidator.getStrengthMessage(passwordValidation.strength)}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordValidation.strength === 'weak' ? 'bg-red-500 w-1/4' :
                          passwordValidation.strength === 'medium' ? 'bg-yellow-500 w-1/2' :
                          passwordValidation.strength === 'strong' ? 'bg-green-500 w-3/4' :
                          'bg-emerald-500 w-full'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="text-xs space-y-1">
                    {passwordValidation.errors.map((err, index) => (
                      <div key={index} className="flex items-center space-x-1 text-red-500">
                        <XCircle className="h-3 w-3" />
                        <span>{err}</span>
                      </div>
                    ))}
                    {passwordValidation.errors.length === 0 && (
                      <div className="flex items-center space-x-1 text-green-500">
                        <CheckCircle className="h-3 w-3" />
                        <span>Password meets all requirements</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <div className="flex items-center space-x-1 text-red-500 text-xs">
                  <XCircle className="h-3 w-3" />
                  <span>Passwords do not match</span>
                </div>
              )}
            </div>

            {/* Rate Limit Warning */}
            {rateLimitInfo && rateLimitInfo.lockoutTime && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  Too many signup attempts. Please try again in {Math.ceil(rateLimitInfo.lockoutTime / 1000 / 60)} minutes.
                </AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading || (rateLimitInfo?.lockoutTime ? true : false)}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 