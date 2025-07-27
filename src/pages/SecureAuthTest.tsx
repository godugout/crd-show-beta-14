import { SecureSignUpForm } from '@/components/auth/SecureSignUpForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSecureAuth } from '@/features/auth/providers/SecureAuthProvider';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Shield, User } from 'lucide-react';
import React, { useState } from 'react';

export const SecureAuthTest: React.FC = () => {
  const { user, profile, signIn, signOut, rateLimitInfo } = useSecureAuth();
  const [email, setEmail] = useState('jaybhai784@hotmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await signIn(email, password);
      if (!result.success) {
        setError(result.error || 'Sign in failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-crd-darkest flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-crd-white mb-4">
            🔐 Secure Authentication Test
          </h1>
          <p className="text-crd-lightGray text-lg">
            Testing enterprise-grade security features
          </p>
        </motion.div>

        <Tabs defaultValue="status" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Authentication Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user ? (
                  <div className="space-y-4">
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        ✅ Successfully authenticated as {user.email}
                      </AlertDescription>
                    </Alert>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">User Info</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <p><strong>ID:</strong> {user.id}</p>
                          <p><strong>Email:</strong> {user.email}</p>
                          <p><strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Profile Info</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          {profile ? (
                            <>
                              <p><strong>Username:</strong> {profile.username || 'Not set'}</p>
                              <p><strong>Full Name:</strong> {profile.full_name || 'Not set'}</p>
                              <p><strong>Verified:</strong> {profile.creator_verified ? 'Yes' : 'No'}</p>
                            </>
                          ) : (
                            <p className="text-orange-600">Profile not found</p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Button onClick={handleSignOut} variant="destructive" className="w-full">
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      Not authenticated. Please sign in or create an account.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <SecureSignUpForm />
          </TabsContent>

          <TabsContent value="signin" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sign In Test</CardTitle>
                <CardDescription>
                  Test the secure sign-in with rate limiting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded bg-crd-surface text-crd-white"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded bg-crd-surface text-crd-white"
                    placeholder="Enter your password"
                  />
                </div>

                {rateLimitInfo && rateLimitInfo.lockoutTime && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      Account locked. Try again in {Math.ceil(rateLimitInfo.lockoutTime / 1000 / 60)} minutes.
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleSignIn}
                  disabled={loading || (rateLimitInfo?.lockoutTime ? true : false)}
                  className="w-full"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-green-800 text-sm">✅ Rate Limiting</CardTitle>
                    </CardHeader>
                    <CardContent className="text-green-700 text-sm">
                      <p>• 5 failed attempts = 15 minute lockout</p>
                      <p>• Separate limits for signup, signin, reset</p>
                      <p>• Automatic unlock after timeout</p>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-blue-800 text-sm">🔒 Password Security</CardTitle>
                    </CardHeader>
                    <CardContent className="text-blue-700 text-sm">
                      <p>• Minimum 8 characters</p>
                      <p>• Uppercase, lowercase, numbers</p>
                      <p>• Special characters required</p>
                      <p>• Common password blocking</p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200 bg-purple-50">
                    <CardHeader>
                      <CardTitle className="text-purple-800 text-sm">🔐 Environment Security</CardTitle>
                    </CardHeader>
                    <CardContent className="text-purple-700 text-sm">
                      <p>• No hardcoded API keys</p>
                      <p>• Environment variable validation</p>
                      <p>• Secure configuration management</p>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200 bg-orange-50">
                    <CardHeader>
                      <CardTitle className="text-orange-800 text-sm">🛡️ User Management</CardTitle>
                    </CardHeader>
                    <CardContent className="text-orange-700 text-sm">
                      <p>• Automatic profile creation</p>
                      <p>• Session management</p>
                      <p>• Profile data validation</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}; 