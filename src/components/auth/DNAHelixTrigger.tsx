import React from 'react';
import { Dna } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { devAuthService } from '@/features/auth/services/devAuthService';
import { toast } from 'sonner';

export const DNAHelixTrigger: React.FC = () => {
  const navigate = useNavigate();

  const handleHelixClick = async () => {
    try {
      // Auto login to get admin access
      const result = devAuthService.forceCreateDevSession();
      if (result.error) {
        toast.error('Failed to create session: ' + result.error.message);
        return;
      }
      
      // Show success message and navigate to DNA lab
      toast.success('🧬 DNA Lab access granted!');
      
      // Navigate to DNA lab dashboard
      setTimeout(() => {
        navigate('/dna/lab/dashboard');
      }, 500);
    } catch (error) {
      toast.error('DNA Lab access failed: ' + (error as Error).message);
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="relative group">
      {/* Hidden helix icon that appears on hover */}
      <button
        onClick={handleHelixClick}
        className="
          opacity-0 group-hover:opacity-100
          transition-all duration-300 ease-in-out
          transform scale-75 group-hover:scale-100
          p-2 rounded-full
          bg-gradient-to-r from-blue-500/20 to-purple-500/20
          hover:from-blue-500/40 hover:to-purple-500/40
          border border-transparent
          hover:border-blue-400/30
          backdrop-blur-sm
          cursor-pointer
          min-h-[44px] min-w-[44px]
          flex items-center justify-center
        "
        title="🧬 Access DNA Lab"
        aria-label="Access DNA Lab"
      >
        <Dna className="w-5 h-5 text-blue-400 animate-pulse" />
      </button>
    </div>
  );
};