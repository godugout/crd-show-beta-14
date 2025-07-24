
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Gem, Droplets, Chrome, Shield } from 'lucide-react';
import type { MaterialSettings } from '../types';

interface MaterialComboSectionProps {
  materialSettings: MaterialSettings;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
}

export const MaterialComboSection: React.FC<MaterialComboSectionProps> = ({
  materialSettings,
  onMaterialSettingsChange
}) => {
  const materials = [
    { 
      key: 'metalness', 
      label: 'Metalness', 
      description: 'How metallic the surface appears',
      icon: Chrome,
      color: 'text-gray-400',
      dotColor: 'bg-gray-500'
    },
    { 
      key: 'roughness', 
      label: 'Roughness', 
      description: 'Surface roughness affects reflections',
      icon: Droplets,
      color: 'text-blue-400',
      dotColor: 'bg-blue-500'
    },
    { 
      key: 'reflectivity', 
      label: 'Reflectivity', 
      description: 'How much light reflects off surface',
      icon: Gem,
      color: 'text-purple-400',
      dotColor: 'bg-purple-500'
    },
    { 
      key: 'clearcoat', 
      label: 'Clearcoat', 
      description: 'Clear protective coating effect',
      icon: Shield,
      color: 'text-orange-400',
      dotColor: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-3">
      {materials.map(({ key, label, description, icon: Icon, color, dotColor }) => {
        const value = materialSettings[key as keyof MaterialSettings];
        
        return (
          <div key={key} className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <div>
                  <div className="text-white text-sm font-medium">{label}</div>
                  <div className="text-xs text-gray-400">{description}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
                <span className="text-green-400 text-sm font-medium min-w-[3rem] text-right">
                  {Math.round(value * 100)}%
                </span>
              </div>
            </div>
            <div className="relative">
              <Slider
                value={[value]}
                onValueChange={([newValue]) => 
                  onMaterialSettingsChange({ 
                    ...materialSettings, 
                    [key]: newValue 
                  })
                }
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
