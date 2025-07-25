import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface AccessCodeAuthProps {
  children: React.ReactNode;
  accessCode?: string;
}

const DEFAULT_ACCESS_CODE = "DNA2024LAB";

export const AccessCodeAuth: React.FC<AccessCodeAuthProps> = ({ 
  children, 
  accessCode = DEFAULT_ACCESS_CODE 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredCode, setEnteredCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState('');

  // Check if user is already authenticated (store in localStorage)
  useEffect(() => {
    const storedAuth = localStorage.getItem('dna-lab-access');
    if (storedAuth === accessCode) {
      setIsAuthenticated(true);
    }
  }, [accessCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (enteredCode === accessCode) {
      setIsAuthenticated(true);
      localStorage.setItem('dna-lab-access', accessCode);
      setError('');
    } else {
      setError('Invalid access code. Please try again.');
      setEnteredCode('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('dna-lab-access');
  };

  if (isAuthenticated) {
    return (
      <div>
        {/* Optional logout button in top corner */}
        <div className="fixed top-4 right-4 z-50">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="border-crd-border/30 bg-crd-surface/80 backdrop-blur-sm"
          >
            <Lock className="w-4 h-4 mr-2" />
            Lock Access
          </Button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-purple-900/10 to-blue-900/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-gradient-to-br from-crd-dark to-crd-darker border-crd-blue/20">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            🧬 DNA Lab Access
          </h1>
          <p className="text-crd-text-dim mt-2">
            Enter the access code to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showCode ? "text" : "password"}
              placeholder="Enter access code"
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value)}
              className="pr-10 bg-crd-surface border-crd-border text-crd-text"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-crd-text-dim hover:text-crd-text"
            >
              {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-400/10 p-2 rounded border border-red-400/20">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full btn-primary"
            disabled={!enteredCode.trim()}
          >
            Access DNA Lab
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-crd-text-dim">
            Contact your administrator if you don't have the access code
          </p>
        </div>
      </Card>
    </div>
  );
};