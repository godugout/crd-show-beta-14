import React from 'react';
import { Film } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TemplateControlsButtonProps {
  onClick: () => void;
  hasTemplate?: boolean;
  disabled?: boolean;
}

export const TemplateControlsButton: React.FC<TemplateControlsButtonProps> = ({
  onClick,
  hasTemplate = false,
  disabled = false
}) => {
  if (!hasTemplate) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="fixed bottom-4 left-20 z-30 border-white/20 text-white hover:bg-white/10 bg-black/50 backdrop-blur-sm"
    >
      <Film className="w-4 h-4 mr-2" />
      Frame
    </Button>
  );
};