import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { useAdminAuth } from '@/features/admin/hooks/useAdminAuth';
import { toast } from 'sonner';

const DNA_HELIX_SVG = (
  <svg viewBox="0 0 200 400" className="w-32 h-64 mx-auto mb-8">
    <defs>
      <linearGradient id="helixGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#00d2ff', stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: '#3a7bd5', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    
    {/* DNA Helix Structure */}
    <g className="animate-spin-slow">
      {Array.from({ length: 20 }, (_, i) => {
        const y = i * 20;
        const rotation = i * 18;
        const x1 = 100 + 30 * Math.sin((rotation * Math.PI) / 180);
        const x2 = 100 - 30 * Math.sin((rotation * Math.PI) / 180);
        
        return (
          <g key={i}>
            {/* Backbone */}
            <circle cx={x1} cy={y} r="3" fill="url(#helixGradient)" opacity="0.8" />
            <circle cx={x2} cy={y} r="3" fill="url(#helixGradient)" opacity="0.8" />
            
            {/* Base pairs */}
            {i % 2 === 0 && (
              <line 
                x1={x1} 
                y1={y} 
                x2={x2} 
                y2={y} 
                stroke="url(#helixGradient)" 
                strokeWidth="2" 
                opacity="0.6"
              />
            )}
          </g>
        );
      })}
    </g>
  </svg>
);

export default function DNALabLanding() {
  const [secretCode, setSecretCode] = useState('HELIX2024'); // Pre-filled for dev access
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, isLoading } = useAdminAuth();

  // Auto-redirect if already authenticated admin
  React.useEffect(() => {
    if (!isLoading && isAdmin) {
      navigate('/dna/lab/dashboard');
    }
  }, [isAdmin, isLoading, navigate]);

  const handleSecretSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in first');
      return;
    }

    setIsVerifying(true);
    
    // Check secret code (this would normally be environment variable)
    const validCode = 'HELIX2024'; // In production, store in env
    
    if (secretCode !== validCode) {
      toast.error('Invalid access code');
      setIsVerifying(false);
      return;
    }

    // Check admin status
    if (!isAdmin && !isLoading) {
      toast.error('Access denied: Admin privileges required');
      setIsVerifying(false);
      return;
    }

    // Success - navigate to dashboard
    toast.success('Access granted. Welcome to DNA Lab.');
    navigate('/dna/lab/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-purple-900/20 to-blue-900/20 flex items-center justify-center">
        <div className="text-center">
          {DNA_HELIX_SVG}
          <div className="text-crd-lightGray animate-pulse">Scanning genetic markers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-purple-900/20 to-blue-900/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          {DNA_HELIX_SVG}
          
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
            DNA LAB
          </h1>
          
          <p className="text-crd-lightGray mb-2">Genetic Engineering Division</p>
          <p className="text-sm text-crd-mutedText">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleSecretSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-crd-lightGray">Access Code</label>
            <Input
              type="password"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              placeholder="Enter genetic sequence..."
              className="bg-crd-dark border-crd-blue/30 focus:border-crd-blue text-center tracking-wider font-mono"
              disabled={isVerifying}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3"
            disabled={isVerifying || !secretCode.trim()}
          >
            {isVerifying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Verifying DNA...
              </>
            ) : (
              'Initiate Sequence'
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <div className="text-xs text-crd-mutedText space-y-1">
            <p>⚠️ Unauthorized access is prohibited</p>
            <p>🧬 All activities are monitored</p>
            <p>🔬 For research purposes only</p>
          </div>
        </div>

        {/* Animated background particles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}