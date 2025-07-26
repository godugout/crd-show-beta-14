import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Type, Sparkles, Frame } from 'lucide-react';

interface CustomizationStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

const colorPresets = [
  { name: 'Default', colors: ['#3B82F6', '#1E40AF'] },
  { name: 'Sunset', colors: ['#F59E0B', '#DC2626'] },
  { name: 'Ocean', colors: ['#06B6D4', '#0284C7'] },
  { name: 'Forest', colors: ['#10B981', '#059669'] },
  { name: 'Purple', colors: ['#8B5CF6', '#7C3AED'] },
  { name: 'Rose', colors: ['#F43F5E', '#E11D48'] },
];

const effectPresets = [
  { name: 'None', value: 'none' },
  { name: 'Glow', value: 'glow' },
  { name: 'Shadow', value: 'shadow' },
  { name: 'Holographic', value: 'holographic' },
  { name: 'Vintage', value: 'vintage' },
  { name: 'Neon', value: 'neon' },
];

export const CustomizationStep: React.FC<CustomizationStepProps> = ({
  data,
  onUpdate
}) => {
  const updateCustomization = (key: string, value: any) => {
    onUpdate({
      ...data,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            Text
          </TabsTrigger>
          <TabsTrigger value="effects" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Effects
          </TabsTrigger>
          <TabsTrigger value="frame" className="flex items-center gap-2">
            <Frame className="w-4 h-4" />
            Frame
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Color Scheme</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {colorPresets.map((preset, index) => (
                <motion.div
                  key={preset.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`cursor-pointer rounded-lg p-4 border-2 transition-all ${
                    data.colorScheme === preset.name 
                      ? 'border-primary shadow-lg' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => updateCustomization('colorScheme', preset.name)}
                >
                  <div className="flex gap-2 mb-2">
                    {preset.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-medium">{preset.name}</p>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Brightness</h3>
            <div className="space-y-4">
              <Label>Brightness: {data.brightness || 50}%</Label>
              <Slider
                value={[data.brightness || 50]}
                onValueChange={([value]) => updateCustomization('brightness', value)}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Font Settings</h3>
            <div className="space-y-6">
              <div>
                <Label className="mb-2 block">Font Family</Label>
                <div className="grid grid-cols-2 gap-4">
                  {['Inter', 'Roboto', 'Montserrat', 'Playfair Display'].map(font => (
                    <Button
                      key={font}
                      variant={data.fontFamily === font ? 'default' : 'outline'}
                      onClick={() => updateCustomization('fontFamily', font)}
                      className="h-12"
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Font Size: {data.fontSize || 16}px</Label>
                <Slider
                  value={[data.fontSize || 16]}
                  onValueChange={([value]) => updateCustomization('fontSize', value)}
                  min={12}
                  max={24}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="mb-2 block">Font Weight</Label>
                <div className="grid grid-cols-4 gap-2">
                  {['300', '400', '600', '700'].map(weight => (
                    <Button
                      key={weight}
                      variant={data.fontWeight === weight ? 'default' : 'outline'}
                      onClick={() => updateCustomization('fontWeight', weight)}
                      size="sm"
                    >
                      {weight}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="effects" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Visual Effects</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {effectPresets.map(effect => (
                <motion.div
                  key={effect.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`cursor-pointer rounded-lg p-4 border-2 text-center transition-all ${
                    data.effect === effect.value 
                      ? 'border-primary shadow-lg bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => updateCustomization('effect', effect.value)}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg mx-auto mb-2" />
                  <p className="text-sm font-medium">{effect.name}</p>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Effect Intensity</h3>
            <div className="space-y-4">
              <Label>Intensity: {data.effectIntensity || 50}%</Label>
              <Slider
                value={[data.effectIntensity || 50]}
                onValueChange={([value]) => updateCustomization('effectIntensity', value)}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="frame" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Frame Style</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['None', 'Classic', 'Modern', 'Ornate', 'Minimal', 'Bold'].map(frame => (
                <motion.div
                  key={frame}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`cursor-pointer rounded-lg p-4 border-2 text-center transition-all ${
                    data.frameStyle === frame 
                      ? 'border-primary shadow-lg bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => updateCustomization('frameStyle', frame)}
                >
                  <div className="w-12 h-16 border-2 border-current rounded mx-auto mb-2" />
                  <p className="text-sm font-medium">{frame}</p>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Border Settings</h3>
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Border Width: {data.borderWidth || 2}px</Label>
                <Slider
                  value={[data.borderWidth || 2]}
                  onValueChange={([value]) => updateCustomization('borderWidth', value)}
                  min={0}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="mb-2 block">Corner Radius: {data.cornerRadius || 8}px</Label>
                <Slider
                  value={[data.cornerRadius || 8]}
                  onValueChange={([value]) => updateCustomization('cornerRadius', value)}
                  min={0}
                  max={20}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Live Preview */}
      <Card className="p-6 bg-muted/30">
        <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
        <div className="flex justify-center">
          <div 
            className="w-48 h-64 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg border-2 border-primary/20 flex items-center justify-center"
            style={{
              borderWidth: `${data.borderWidth || 2}px`,
              borderRadius: `${data.cornerRadius || 8}px`,
              fontFamily: data.fontFamily || 'Inter',
              fontSize: `${data.fontSize || 16}px`,
              fontWeight: data.fontWeight || '400',
              filter: `brightness(${(data.brightness || 50) + 50}%)`
            }}
          >
            <div className="text-center p-4">
              <div className="text-lg font-bold mb-2">Preview</div>
              <div className="text-sm opacity-75">Customization</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};