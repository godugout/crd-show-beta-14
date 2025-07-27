import { useSecureAuth } from '@/features/auth/providers/SecureAuthProvider';
import React from 'react';

export const AuthTestComponent: React.FC = () => {
  const { user, profile, loading, signIn, signUp, signOut } = useSecureAuth();

  const handleTestSignIn = async () => {
    const result = await signIn('test@example.com', 'password123');
    console.log('Test sign in result:', result);
  };

  const handleTestSignUp = async () => {
    const result = await signUp('test@example.com', 'password123', 'Test User');
    console.log('Test sign up result:', result);
  };

  const handleTestSignOut = async () => {
    const result = await signOut();
    console.log('Test sign out result:', result);
  };

  return (
    <div className="fixed top-4 left-4 bg-black/80 text-white p-4 rounded-lg text-sm font-mono z-50 max-w-md">
      <h3 className="font-bold mb-2">Auth Test Component</h3>
      <div className="space-y-2 text-xs">
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        <div>User: {user ? user.email : 'None'}</div>
        <div>Profile: {profile ? 'Exists' : 'None'}</div>
        <div className="flex gap-2 mt-3">
          <button 
            onClick={handleTestSignIn}
            className="px-2 py-1 bg-blue-500 rounded text-xs"
          >
            Test Sign In
          </button>
          <button 
            onClick={handleTestSignUp}
            className="px-2 py-1 bg-green-500 rounded text-xs"
          >
            Test Sign Up
          </button>
          <button 
            onClick={handleTestSignOut}
            className="px-2 py-1 bg-red-500 rounded text-xs"
          >
            Test Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}; 