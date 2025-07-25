import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Palette, Wand2 } from 'lucide-react';

interface ProModeToggleProps {
  isProMode: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
}

export const ProModeToggle: React.FC<ProModeToggleProps> = ({
  isProMode,
  onToggle,
  className = ""
}) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <Wand2 className="w-4 h-4 text-muted-foreground" />
        <Label htmlFor="pro-mode" className="text-sm font-medium">
          Standard Mode
        </Label>
      </div>
      
      <Switch
        id="pro-mode"
        checked={isProMode}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-primary"
      />
      
      <div className="flex items-center space-x-2">
        <Label htmlFor="pro-mode" className="text-sm font-medium">
          Pro Design Mode
        </Label>
        <Palette className="w-4 h-4 text-primary" />
      </div>
    </div>
  );
};