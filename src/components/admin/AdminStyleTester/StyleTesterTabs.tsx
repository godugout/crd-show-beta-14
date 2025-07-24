
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StyleVariantSelector } from './StyleVariantSelector';
import { StyleSettings } from './StyleSettings';
import type { Animated3DVariant } from '@/components/hero/Animated3DBackground';

interface StyleTesterTabsProps {
  activeVariant: Animated3DVariant;
  setActiveVariant: (variant: Animated3DVariant) => void;
  opacity: number[];
  setOpacity: (value: number[]) => void;
  speed: number[];
  setSpeed: (value: number[]) => void;
  scale: number[];
  setScale: (value: number[]) => void;
  blur: number[];
  setBlur: (value: number[]) => void;
  mouseInteraction: boolean;
  setMouseInteraction: (value: boolean) => void;
  autoRotate: boolean;
  setAutoRotate: (value: boolean) => void;
  applyPreset: (preset: string) => void;
  resetToDefaults: () => void;
}

export const StyleTesterTabs: React.FC<StyleTesterTabsProps> = (props) => {
  return (
    <div className="w-80 flex-shrink-0 overflow-y-auto">
      <Tabs defaultValue="variants" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-crd-mediumGray/20">
          <TabsTrigger value="variants" className="text-xs">Variants</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="variants" className="space-y-4 mt-4">
          <StyleVariantSelector 
            activeVariant={props.activeVariant}
            setActiveVariant={props.setActiveVariant}
            applyPreset={props.applyPreset}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-4">
          <StyleSettings {...props} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
