import React, { useState } from 'react';
import { Settings } from 'lucide-react';

interface AdminFloatingButtonProps {
  onOpenAdminPanel: () => void;
}

export const AdminFloatingButton: React.FC<AdminFloatingButtonProps> = ({
  onOpenAdminPanel
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="fixed bottom-20 right-6 z-50 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={onOpenAdminPanel}
        className={`transition-all duration-300 text-white/40 hover:text-[#3772FF] p-2 rounded-full shadow-lg hover:scale-105 flex items-center justify-center border ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.12) 100%)',
          borderColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(12px) saturate(180%)'
        }}
        title="Admin Panel (Ctrl/Cmd+Shift+L)"
      >
        <Settings className="w-4 h-4 transition-transform group-hover:scale-110" />
      </button>
      
      {/* Invisible hover trigger area */}
      <div className="absolute -inset-4" />
    </div>
  );
};