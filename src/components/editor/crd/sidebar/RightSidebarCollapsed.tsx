import React from 'react';
import { Sparkles, FileText, Printer } from 'lucide-react';

export const RightSidebarCollapsedContent: React.FC = () => {
  const actions = [
    { id: 'ai', label: 'AI Assistant', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'properties', label: 'Properties', icon: <FileText className="w-4 h-4" /> },
    { id: 'print', label: 'Print Settings', icon: <Printer className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-2">
      {actions.map((action) => (
        <div 
          key={action.id}
          className="w-8 h-8 flex items-center justify-center rounded text-crd-lightGray hover:text-crd-white hover:bg-crd-mediumGray/20 transition-colors cursor-pointer"
          title={action.label}
        >
          {action.icon}
        </div>
      ))}
    </div>
  );
};