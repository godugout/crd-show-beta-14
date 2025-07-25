
import React, { ReactNode, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useTeamTheme } from '@/hooks/useTeamTheme';

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export const SidebarSection = ({ title, children, defaultOpen = true }: SidebarSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { currentPalette } = useTeamTheme();

  return (
    <div className="border-b border-editor-border">
      <button
        className="flex items-center justify-between w-full p-4 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-white font-semibold">{title}</span>
        {isOpen ? 
          <ChevronDown className="w-4 h-4" style={{ color: currentPalette?.colors.primary || '#fbbf24' }} /> : 
          <ChevronRight className="w-4 h-4" style={{ color: currentPalette?.colors.primary || '#fbbf24' }} />
        }
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
};
