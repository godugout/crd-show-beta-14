import { supabaseConfig } from '@/integrations/supabase/client';
import React from 'react';

export const SupabaseDebug: React.FC = () => {
  const isDevelopment = import.meta.env.DEV;
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isDevelopment ? 'bg-green-400' : 'bg-blue-400'}`}></div>
        <span>{isDevelopment ? 'DEV' : 'PROD'}</span>
        <span className="text-gray-400">|</span>
        <span className="text-gray-300">{supabaseConfig.url.split('.')[0].split('//')[1]}</span>
      </div>
    </div>
  );
}; 