import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const presetColors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
    '#ffc0cb', '#a52a2a', '#808080', '#008000', '#000080'
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full h-8 p-1 ${className}`}
        >
          <div className="flex items-center gap-2 w-full">
            <div 
              className="w-6 h-6 rounded border border-border"
              style={{ backgroundColor: value }}
            />
            <span className="text-xs font-mono">{value}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-3">
          <div>
            <Input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-8"
            />
          </div>
          
          <div>
            <Input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className="w-full h-8 font-mono text-xs"
            />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-2">Presets</p>
            <div className="grid grid-cols-5 gap-1">
              {presetColors.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    onChange(color);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};