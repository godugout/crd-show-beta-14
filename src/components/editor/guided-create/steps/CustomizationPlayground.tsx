import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Type, Image, Square, Circle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { WizardData } from '../InteractiveWizard';

interface CustomizationPlaygroundProps {
  data: WizardData;
  onUpdate: (data: Partial<WizardData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const CustomizationPlayground: React.FC<CustomizationPlaygroundProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious
}) => {
  const [customizations, setCustomizations] = useState(data.customizations || {});

  const updateCustomizations = (updates: Record<string, any>) => {
    const newCustomizations = { ...customizations, ...updates };
    setCustomizations(newCustomizations);
    onUpdate({ customizations: newCustomizations });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-4">
            Customization Playground
          </h1>
          <p className="text-xl text-muted-foreground">
            Design your card elements with drag-and-drop magic
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Elements Palette */}
          <Card className="p-6 bg-background/50 backdrop-blur-sm border-white/10">
            <h3 className="text-xl font-bold mb-4">Elements</h3>
            <div className="space-y-3">
              {[
                { icon: <Type className="w-5 h-5" />, name: 'Text', type: 'text' },
                { icon: <Image className="w-5 h-5" />, name: 'Logo', type: 'logo' },
                { icon: <Square className="w-5 h-5" />, name: 'Shape', type: 'shape' },
                { icon: <Circle className="w-5 h-5" />, name: 'Badge', type: 'badge' }
              ].map((element) => (
                <motion.div
                  key={element.type}
                  className="p-3 border border-white/10 rounded-lg cursor-pointer hover:bg-primary/10"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateCustomizations({ [element.type]: true })}
                >
                  <div className="flex items-center gap-3">
                    {element.icon}
                    <span>{element.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Canvas */}
          <Card className="p-6 bg-background/50 backdrop-blur-sm border-white/10">
            <h3 className="text-xl font-bold mb-4">Canvas</h3>
            <div className="aspect-[3/4] bg-muted rounded-lg relative border-2 border-dashed border-primary/30">
              <div className="absolute inset-4 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Square className="w-12 h-12 mx-auto mb-2" />
                  <p>Drag elements here</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Properties */}
          <Card className="p-6 bg-background/50 backdrop-blur-sm border-white/10">
            <h3 className="text-xl font-bold mb-4">Properties</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Size</label>
                <div className="flex gap-2 mt-1">
                  <Button variant="outline" size="sm">Small</Button>
                  <Button variant="outline" size="sm">Medium</Button>
                  <Button variant="outline" size="sm">Large</Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Position</label>
                <div className="grid grid-cols-3 gap-1 mt-1">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <Button key={i} variant="outline" size="sm" className="aspect-square p-0">
                      <div className="w-2 h-2 bg-current rounded-full" />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onPrevious}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button onClick={onNext}>
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};