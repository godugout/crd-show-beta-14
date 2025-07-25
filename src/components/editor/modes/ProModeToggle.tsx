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
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1">
        <Wand2 className="w-3 h-3 text-muted-foreground" />
        <Label htmlFor="pro-mode" className="text-xs font-medium">
          Standard
        </Label>
      </div>
      
      <Switch
        id="pro-mode"
        checked={isProMode}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-primary scale-75"
      />
      
      <div className="flex items-center space-x-1">
        <Label htmlFor="pro-mode" className="text-xs font-medium">
          Pro
        </Label>
        <Palette className="w-3 h-3 text-primary" />
      </div>
    </div>
  );
};