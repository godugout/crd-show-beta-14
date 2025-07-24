import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Settings,
  Move3d,
  Palette,
  Lightbulb,
  Zap,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Copy,
  Clipboard
} from 'lucide-react';

interface PropertiesPanelProps {
  card: any;
  workspaceMode: string;
  deviceType: string;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  card,
  workspaceMode,
  deviceType
}) => {
  const [activeTab, setActiveTab] = useState('transform');
  const [sections, setSections] = useState({
    transform: true,
    material: true,
    lighting: false,
    physics: false
  });

  // Transform properties
  const [position, setPosition] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const [scale, setScale] = useState([1]);

  // Material properties
  const [metalness, setMetalness] = useState([0.5]);
  const [roughness, setRoughness] = useState([0.3]);
  const [emission, setEmission] = useState([0]);

  // Lighting properties
  const [intensity, setIntensity] = useState([1]);
  const [temperature, setTemperature] = useState([5500]);

  const isCompact = deviceType === 'mobile' || workspaceMode === 'beginner';
  const showAdvanced = workspaceMode === 'director';

  const toggleSection = (section: string) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const PropertySection = ({ 
    title, 
    icon: Icon, 
    isOpen, 
    onToggle, 
    children, 
    badge 
  }: {
    title: string;
    icon: any;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    badge?: string;
  }) => (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{title}</span>
          {badge && <Badge variant="outline" className="text-xs">{badge}</Badge>}
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="px-2 pb-2">
        <div className="space-y-3 pt-2">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Properties</span>
        </div>
        
        {showAdvanced && (
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="w-6 h-6 p-0" title="Copy">
              <Copy className="w-3 h-3" />
            </Button>
            <Button variant="outline" size="sm" className="w-6 h-6 p-0" title="Paste">
              <Clipboard className="w-3 h-3" />
            </Button>
            <Button variant="outline" size="sm" className="w-6 h-6 p-0" title="Reset">
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className={cn(
          "grid m-3 mb-0",
          isCompact ? "grid-cols-2" : "grid-cols-4"
        )}>
          <TabsTrigger value="transform" className="text-xs">
            <Move3d className="w-3 h-3 mr-1" />
            {!isCompact && 'Transform'}
          </TabsTrigger>
          <TabsTrigger value="material" className="text-xs">
            <Palette className="w-3 h-3 mr-1" />
            {!isCompact && 'Material'}
          </TabsTrigger>
          {!isCompact && (
            <>
              <TabsTrigger value="lighting" className="text-xs">
                <Lightbulb className="w-3 h-3 mr-1" />
                Lighting
              </TabsTrigger>
              <TabsTrigger value="physics" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Physics
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="transform" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-3 space-y-2">
                <PropertySection
                  title="Position"
                  icon={Move3d}
                  isOpen={sections.transform}
                  onToggle={() => toggleSection('transform')}
                >
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">X</Label>
                      <Input
                        type="number"
                        value={position[0]}
                        onChange={(e) => setPosition([Number(e.target.value), position[1], position[2]])}
                        className="h-7 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Y</Label>
                      <Input
                        type="number"
                        value={position[1]}
                        onChange={(e) => setPosition([position[0], Number(e.target.value), position[2]])}
                        className="h-7 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Z</Label>
                      <Input
                        type="number"
                        value={position[2]}
                        onChange={(e) => setPosition([position[0], position[1], Number(e.target.value)])}
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Rotation X</Label>
                    <Slider
                      value={[rotation[0]]}
                      onValueChange={(value) => setRotation([value[0], rotation[1], rotation[2]])}
                      min={-180}
                      max={180}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Rotation Y</Label>
                    <Slider
                      value={[rotation[1]]}
                      onValueChange={(value) => setRotation([rotation[0], value[0], rotation[2]])}
                      min={-180}
                      max={180}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Scale</Label>
                    <Slider
                      value={scale}
                      onValueChange={setScale}
                      min={0.1}
                      max={3}
                      step={0.1}
                    />
                  </div>
                </PropertySection>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="material" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-3 space-y-2">
                <PropertySection
                  title="Surface"
                  icon={Palette}
                  isOpen={sections.material}
                  onToggle={() => toggleSection('material')}
                >
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Metalness</Label>
                        <span className="text-xs font-mono">{metalness[0].toFixed(2)}</span>
                      </div>
                      <Slider
                        value={metalness}
                        onValueChange={setMetalness}
                        min={0}
                        max={1}
                        step={0.01}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Roughness</Label>
                        <span className="text-xs font-mono">{roughness[0].toFixed(2)}</span>
                      </div>
                      <Slider
                        value={roughness}
                        onValueChange={setRoughness}
                        min={0}
                        max={1}
                        step={0.01}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Emission</Label>
                        <span className="text-xs font-mono">{emission[0].toFixed(2)}</span>
                      </div>
                      <Slider
                        value={emission}
                        onValueChange={setEmission}
                        min={0}
                        max={2}
                        step={0.01}
                      />
                    </div>

                    {showAdvanced && (
                      <div className="space-y-2 pt-2 border-t border-border">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-muted-foreground">Holographic</Label>
                          <Switch />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-muted-foreground">Subsurface</Label>
                          <Switch />
                        </div>
                      </div>
                    )}
                  </div>
                </PropertySection>
              </div>
            </ScrollArea>
          </TabsContent>

          {!isCompact && (
            <>
              <TabsContent value="lighting" className="h-full m-0">
                <ScrollArea className="h-full">
                  <div className="p-3 space-y-2">
                    <PropertySection
                      title="Environment"
                      icon={Lightbulb}
                      isOpen={sections.lighting}
                      onToggle={() => toggleSection('lighting')}
                    >
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs text-muted-foreground">Intensity</Label>
                            <span className="text-xs font-mono">{intensity[0].toFixed(1)}</span>
                          </div>
                          <Slider
                            value={intensity}
                            onValueChange={setIntensity}
                            min={0}
                            max={5}
                            step={0.1}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs text-muted-foreground">Temperature</Label>
                            <span className="text-xs font-mono">{temperature[0]}K</span>
                          </div>
                          <Slider
                            value={temperature}
                            onValueChange={setTemperature}
                            min={2000}
                            max={10000}
                            step={100}
                          />
                        </div>
                      </div>
                    </PropertySection>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="physics" className="h-full m-0">
                <ScrollArea className="h-full">
                  <div className="p-3 space-y-2">
                    <PropertySection
                      title="Dynamics"
                      icon={Zap}
                      isOpen={sections.physics}
                      onToggle={() => toggleSection('physics')}
                      badge="Pro"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-muted-foreground">Auto-rotate</Label>
                          <Switch />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-muted-foreground">Float effect</Label>
                          <Switch />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-muted-foreground">Particle trail</Label>
                          <Switch />
                        </div>
                      </div>
                    </PropertySection>
                  </div>
                </ScrollArea>
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
};