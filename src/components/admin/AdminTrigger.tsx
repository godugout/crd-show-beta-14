
import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { useAdminAuth } from '@/features/admin/hooks/useAdminAuth';
import { AdminStyleTester } from './AdminStyleTester';

export const AdminTrigger: React.FC = () => {
  const { isAdmin } = useAdminAuth();
  const [showTester, setShowTester] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!isAdmin) return null;

  return (
    <>
      <button
        onClick={() => setShowTester(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-6 h-6 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-red-500/20 group"
        title="Admin Style Tester"
      >
        <Lock 
          className={`w-4 h-4 transition-all duration-200 ${
            isHovered ? 'text-red-500' : 'text-transparent'
          }`} 
        />
      </button>

      <AdminStyleTester 
        isOpen={showTester} 
        onClose={() => setShowTester(false)} 
      />
    </>
  );
};
