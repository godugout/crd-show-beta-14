
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface StyleSettingsProps {
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
  resetToDefaults: () => void;
}

export const StyleSettings: React.FC<StyleSettingsProps> = ({
  opacity,
  setOpacity,
  speed,
  setSpeed,
  scale,
  setScale,
  blur,
  setBlur,
  mouseInteraction,
  setMouseInteraction,
  autoRotate,
  setAutoRotate,
  resetToDefaults
}) => {
  return (
    <>
      <div className="space-y-4">
        <div>
          <Label className="text-sm text-crd-lightGray mb-2 block">
            Opacity: {opacity[0]}%
          </Label>
          <Slider
            value={opacity}
            onValueChange={setOpacity}
            max={100}
            min={5}
            step={5}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-sm text-crd-lightGray mb-2 block">
            Animation Speed: {speed[0]}x
          </Label>
          <Slider
            value={speed}
            onValueChange={setSpeed}
            max={3}
            min={0.1}
            step={0.1}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-sm text-crd-lightGray mb-2 block">
            Scale: {scale[0]}%
          </Label>
          <Slider
            value={scale}
            onValueChange={setScale}
            max={200}
            min={50}
            step={10}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-sm text-crd-lightGray mb-2 block">
            Blur: {blur[0]}px
          </Label>
          <Slider
            value={blur}
            onValueChange={setBlur}
            max={20}
            min={0}
            step={1}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm text-crd-lightGray">Mouse Interaction</Label>
          <Switch
            checked={mouseInteraction}
            onCheckedChange={setMouseInteraction}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm text-crd-lightGray">Auto Rotate</Label>
          <Switch
            checked={autoRotate}
            onCheckedChange={setAutoRotate}
          />
        </div>
      </div>

      <div className="border-t border-crd-mediumGray/20 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={resetToDefaults}
          className="w-full border-crd-mediumGray/30 hover:border-crd-green/50"
        >
          Reset to Defaults
        </Button>
      </div>
    </>
  );
};
