import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MousePointer2, 
  Type, 
  Square, 
  Circle, 
  Triangle,
  Image,
  Brush,
  Eraser,
  Pipette,
  Move,
  RotateCw
} from 'lucide-react';

interface ProDesignToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  onAddText: () => void;
  onAddShape: (shapeType: string) => void;
}

export const ProDesignToolbar: React.FC<ProDesignToolbarProps> = ({
  selectedTool,
  onToolSelect,
  onAddText,
  onAddShape
}) => {
  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'move', icon: Move, label: 'Move' },
    { id: 'rotate', icon: RotateCw, label: 'Rotate' },
  ];

  const createTools = [
    { id: 'text', icon: Type, label: 'Add Text', action: onAddText },
    { id: 'image', icon: Image, label: 'Add Image' },
    { id: 'rectangle', icon: Square, label: 'Rectangle', action: () => onAddShape('rectangle') },
    { id: 'circle', icon: Circle, label: 'Circle', action: () => onAddShape('circle') },
    { id: 'triangle', icon: Triangle, label: 'Triangle', action: () => onAddShape('triangle') },
  ];

  const drawingTools = [
    { id: 'brush', icon: Brush, label: 'Brush' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'eyedropper', icon: Pipette, label: 'Color Picker' },
  ];

  return (
    <div className="p-4 border-b border-border">
      <h3 className="text-sm font-medium mb-3">Design Tools</h3>
      
      {/* Selection Tools */}
      <div className="space-y-2 mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Selection</p>
        <div className="grid grid-cols-3 gap-1">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onToolSelect(tool.id)}
              className="p-2 h-8"
              title={tool.label}
            >
              <tool.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Creation Tools */}
      <div className="space-y-2 mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Create</p>
        <div className="grid grid-cols-2 gap-1">
          {createTools.map((tool) => (
            <Button
              key={tool.id}
              variant="ghost"
              size="sm"
              onClick={tool.action || (() => onToolSelect(tool.id))}
              className="p-2 h-8 flex flex-col items-center justify-center"
              title={tool.label}
            >
              <tool.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Drawing Tools */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Drawing</p>
        <div className="grid grid-cols-3 gap-1">
          {drawingTools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onToolSelect(tool.id)}
              className="p-2 h-8"
              title={tool.label}
            >
              <tool.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};