
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Sparkles, RotateCcw, Save, Trash2, Palette } from 'lucide-react';
import { useCustomStyleManager, type CustomStyleControls } from '../hooks/useCustomStyleManager';

interface CustomStyleEditorProps {
  onApplyCustom: (effects: any) => void;
  isApplying?: boolean;
}

const CONTROL_CONFIGS: Array<{
  key: keyof CustomStyleControls;
  label: string;
  description: string;
  icon: string;
  color: string;
}> = [
  {
    key: 'shimmer',
    label: 'Shimmer',
    description: 'Overall metallic shine and holographic intensity',
    icon: '✨',
    color: 'text-yellow-400'
  },
  {
    key: 'depth',
    label: 'Depth',
    description: 'Surface dimension and layered complexity',
    icon: '🔻',
    color: 'text-blue-400'
  },
  {
    key: 'color',
    label: 'Color',
    description: 'Rainbow vibrancy and color shifting',
    icon: '🌈',
    color: 'text-purple-400'
  },
  {
    key: 'texture',
    label: 'Texture',
    description: 'Surface pattern and grain complexity',
    icon: '🔷',
    color: 'text-gray-400'
  },
  {
    key: 'glow',
    label: 'Glow',
    description: 'Edge highlights and luminous effects',
    icon: '💡',
    color: 'text-orange-400'
  },
  {
    key: 'movement',
    label: 'Movement',
    description: 'Animation speed and dynamic flow',
    icon: '🌊',
    color: 'text-cyan-400'
  }
];

export const CustomStyleEditor: React.FC<CustomStyleEditorProps> = ({
  onApplyCustom,
  isApplying = false
}) => {
  const {
    customControls,
    savedStyles,
    updateControl,
    resetControls,
    saveCustomStyle,
    loadCustomStyle,
    deleteCustomStyle,
    getEffectValues
  } = useCustomStyleManager();

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [styleName, setStyleName] = useState('');

  const handleApply = () => {
    const effects = getEffectValues();
    onApplyCustom(effects);
  };

  const handleSave = () => {
    if (styleName.trim()) {
      saveCustomStyle(styleName.trim());
      setStyleName('');
      setSaveDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Palette className="w-4 h-4 text-crd-green" />
          <span className="text-white font-medium">Custom Style</span>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={resetControls}
            variant="outline"
            size="sm"
            className="bg-transparent border-white/20 text-white hover:border-white/40"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
          <Button
            onClick={() => setSaveDialogOpen(true)}
            variant="outline"
            size="sm"
            className="bg-transparent border-white/20 text-white hover:border-white/40"
          >
            <Save className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {CONTROL_CONFIGS.map(({ key, label, description, icon, color }) => (
          <div key={key} className="p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-base" role="img">{icon}</span>
                <div>
                  <div className="text-white text-sm font-medium">{label}</div>
                  <div className="text-xs text-gray-400">{description}</div>
                </div>
              </div>
              <span className="text-crd-green text-sm font-medium min-w-[3rem] text-right">
                {customControls[key]}%
              </span>
            </div>
            <Slider
              value={[customControls[key]]}
              onValueChange={([value]) => updateControl(key, value)}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        ))}
      </div>

      {/* Apply Button */}
      <Button
        onClick={handleApply}
        disabled={isApplying}
        className="w-full bg-crd-green text-black hover:bg-crd-green/90 disabled:opacity-50"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        {isApplying ? 'Applying...' : 'Apply Custom Style'}
      </Button>

      {/* Saved Styles */}
      {savedStyles.length > 0 && (
        <div className="space-y-2">
          <div className="text-white text-sm font-medium">Saved Styles</div>
          <div className="space-y-1">
            {savedStyles.map((style) => (
              <div
                key={style.id}
                className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10"
              >
                <button
                  onClick={() => loadCustomStyle(style.id)}
                  className="flex-1 text-left text-white text-sm hover:text-crd-green transition-colors"
                >
                  {style.name}
                </button>
                <Button
                  onClick={() => deleteCustomStyle(style.id)}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Dialog */}
      {saveDialogOpen && (
        <div className="p-3 rounded-lg bg-white/10 border border-white/20 space-y-3">
          <div className="text-white text-sm font-medium">Save Custom Style</div>
          <Input
            value={styleName}
            onChange={(e) => setStyleName(e.target.value)}
            placeholder="Enter style name..."
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <div className="flex space-x-2">
            <Button
              onClick={handleSave}
              disabled={!styleName.trim()}
              size="sm"
              className="bg-crd-green text-black hover:bg-crd-green/90"
            >
              Save
            </Button>
            <Button
              onClick={() => setSaveDialogOpen(false)}
              variant="outline"
              size="sm"
              className="bg-transparent border-white/20 text-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
