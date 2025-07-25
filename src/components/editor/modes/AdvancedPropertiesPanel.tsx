import React from 'react';
import { useTeamTheme } from '@/hooks/useTeamTheme';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Bold,
  Italic,
  Underline
} from 'lucide-react';
import type { CardData } from '@/hooks/useCardEditor';

interface AdvancedPropertiesPanelProps {
  selectedElement: string | null;
  cardData: CardData;
  onPropertyChange: (elementId: string, property: string, value: any) => void;
}

export const AdvancedPropertiesPanel: React.FC<AdvancedPropertiesPanelProps> = ({
  selectedElement,
  cardData,
  onPropertyChange
}) => {
  const { currentPalette } = useTeamTheme();
  if (!selectedElement) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>Select an element to edit properties</p>
      </div>
    );
  }

  // Mock element data - in real implementation, this would come from cardData
  const elementData = {
    type: 'text',
    content: 'Sample Text',
    fontSize: 24,
    fontFamily: 'Inter',
    color: '#000000',
    opacity: 100,
    x: 50,
    y: 100,
    width: 200,
    height: 50,
    rotation: 0
  };

  const handlePropertyChange = (property: string, value: any) => {
    onPropertyChange(selectedElement, property, value);
  };

  return (
    <ScrollArea 
      className="h-full border-l-2" 
      style={{ 
        background: `linear-gradient(135deg, ${currentPalette?.colors.primary}10, ${currentPalette?.colors.secondary}10)`,
        borderLeftColor: currentPalette?.colors.primary || '#fbbf24'
      }}
    >
      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Element Properties</h3>
          <p className="text-xs text-muted-foreground">
            {elementData.type} element
          </p>
        </div>

        <Separator />

        {/* Transform Properties */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Transform</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="x-position" className="text-xs">X Position</Label>
              <Input
                id="x-position"
                type="number"
                value={elementData.x}
                onChange={(e) => handlePropertyChange('x', parseInt(e.target.value))}
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="y-position" className="text-xs">Y Position</Label>
              <Input
                id="y-position"
                type="number"
                value={elementData.y}
                onChange={(e) => handlePropertyChange('y', parseInt(e.target.value))}
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="width" className="text-xs">Width</Label>
              <Input
                id="width"
                type="number"
                value={elementData.width}
                onChange={(e) => handlePropertyChange('width', parseInt(e.target.value))}
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-xs">Height</Label>
              <Input
                id="height"
                type="number"
                value={elementData.height}
                onChange={(e) => handlePropertyChange('height', parseInt(e.target.value))}
                className="h-8"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs mb-2 block">Rotation</Label>
            <Slider
              value={[elementData.rotation]}
              onValueChange={([value]) => handlePropertyChange('rotation', value)}
              max={360}
              min={-360}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground mt-1">
              {elementData.rotation}°
            </div>
          </div>

          <div>
            <Label className="text-xs mb-2 block">Opacity</Label>
            <Slider
              value={[elementData.opacity]}
              onValueChange={([value]) => handlePropertyChange('opacity', value)}
              max={100}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground mt-1">
              {elementData.opacity}%
            </div>
          </div>
        </div>

        {elementData.type === 'text' && (
          <>
            <Separator />
            
            {/* Text Properties */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Text</h4>
              
              <div>
                <Label htmlFor="text-content" className="text-xs">Content</Label>
                <Input
                  id="text-content"
                  value={elementData.content}
                  onChange={(e) => handlePropertyChange('content', e.target.value)}
                  className="h-8"
                />
              </div>

              <div>
                <Label className="text-xs">Font Family</Label>
                <Select 
                  value={elementData.fontFamily}
                  onValueChange={(value) => handlePropertyChange('fontFamily', value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    <SelectItem value="Helvetica">Helvetica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs mb-2 block">Font Size</Label>
                <Slider
                  value={[elementData.fontSize]}
                  onValueChange={([value]) => handlePropertyChange('fontSize', value)}
                  max={72}
                  min={8}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {elementData.fontSize}px
                </div>
              </div>

              <div>
                <Label className="text-xs mb-2 block">Text Color</Label>
                <ColorPicker
                  value={elementData.color}
                  onChange={(color) => handlePropertyChange('color', color)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Text Style</Label>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="p-2">
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="p-2">
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="p-2">
                    <Underline className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Text Alignment</Label>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="p-2">
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="p-2">
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="p-2">
                    <AlignRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
};