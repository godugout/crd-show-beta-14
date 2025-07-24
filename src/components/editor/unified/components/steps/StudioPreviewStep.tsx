import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize, 
  Lightbulb,
  Palette,
  Sparkles,
  Globe,
  Mountain,
  Sun,
  Moon
} from 'lucide-react';
import { EnhancedCardViewer } from '@/components/viewer/EnhancedCardViewer';
import type { CreationMode } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';

interface StudioPreviewStepProps {
  mode: CreationMode;
  cardData: CardData;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
}

export const StudioPreviewStep = ({ mode, cardData, onFieldUpdate }: StudioPreviewStepProps) => {
  const [isRotating, setIsRotating] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState('studio');
  const [selectedEffect, setSelectedEffect] = useState('holographic');
  const [selectedLighting, setSelectedLighting] = useState('professional');

  const environments = [
    { id: 'studio', name: 'Studio', icon: Lightbulb, description: 'Clean photography studio' },
    { id: 'outdoor', name: 'Outdoor', icon: Sun, description: 'Natural outdoor lighting' },
    { id: 'dramatic', name: 'Dramatic', icon: Moon, description: 'High contrast lighting' },
    { id: 'museum', name: 'Museum', icon: Globe, description: 'Gallery display case' },
    { id: 'nature', name: 'Nature', icon: Mountain, description: 'Natural environment' },
  ];

  const effects = [
    { id: 'holographic', name: 'Holographic', color: 'bg-purple-500' },
    { id: 'foil', name: 'Foil Shine', color: 'bg-yellow-500' },
    { id: 'chrome', name: 'Chrome', color: 'bg-gray-500' },
    { id: 'rainbow', name: 'Rainbow', color: 'bg-gradient-to-r from-red-500 to-blue-500' },
    { id: 'gold', name: 'Gold Leaf', color: 'bg-yellow-600' },
    { id: 'crystal', name: 'Crystal', color: 'bg-cyan-500' },
  ];

  const lightingPresets = [
    { id: 'professional', name: 'Professional' },
    { id: 'soft', name: 'Soft & Warm' },
    { id: 'dramatic', name: 'Dramatic' },
    { id: 'natural', name: 'Natural' },
    { id: 'neon', name: 'Neon Glow' },
  ];

  const handleEnvironmentChange = (envId: string) => {
    setSelectedEnvironment(envId);
    // Store environment in description field for now
    onFieldUpdate('description', `${cardData.description || ''} [env:${envId}]`.trim());
  };

  const handleEffectChange = (effectId: string) => {
    setSelectedEffect(effectId);
    // Store effect in tags field for now  
    const currentTags = cardData.tags || [];
    const newTags = [...currentTags.filter(tag => !tag.startsWith('effect:')), `effect:${effectId}`];
    onFieldUpdate('tags', newTags);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-crd-white mb-2">Studio Preview</h2>
        <p className="text-crd-lightGray">
          Experience your card in 3D with immersive environments and effects
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 3D Viewer */}
        <div className="lg:col-span-2">
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-crd-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  3D Card Preview
                </CardTitle>
                <div className="flex items-center gap-2">
                  <CRDButton
                    variant="outline"
                    size="sm"
                    onClick={() => setIsRotating(!isRotating)}
                  >
                    {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isRotating ? 'Pause' : 'Auto-Rotate'}
                  </CRDButton>
                  <CRDButton variant="outline" size="sm">
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </CRDButton>
                  <CRDButton variant="outline" size="sm">
                    <Maximize className="w-4 h-4" />
                    Fullscreen
                  </CRDButton>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-video bg-crd-darkest rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-crd-mediumGray rounded-lg mb-4 flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-crd-lightGray" />
                    </div>
                    <p className="text-crd-white font-medium">3D Preview</p>
                    <p className="text-crd-lightGray text-sm">Interactive card viewer coming soon</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <Badge variant="outline" className="text-crd-lightGray">
              Drag to rotate • Scroll to zoom • Double-click to reset
            </Badge>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="space-y-6 min-h-[800px]">
          {/* Environment Selection */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <Globe className="w-5 h-5" />
                360° Environment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {environments.map((env) => {
                const Icon = env.icon;
                return (
                  <button
                    key={env.id}
                    onClick={() => handleEnvironmentChange(env.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                      selectedEnvironment === env.id
                        ? 'bg-crd-green text-black'
                        : 'bg-crd-darkest text-crd-white hover:bg-crd-mediumGray/20'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{env.name}</div>
                      <div className={`text-xs ${
                        selectedEnvironment === env.id ? 'text-black/70' : 'text-crd-lightGray'
                      }`}>
                        {env.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Visual Effects */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Visual Effects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {effects.map((effect) => (
                  <button
                    key={effect.id}
                    onClick={() => handleEffectChange(effect.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedEffect === effect.id
                        ? 'border-crd-green bg-crd-green/10'
                        : 'border-crd-mediumGray/30 hover:border-crd-lightGray/50'
                    }`}
                  >
                    <div className={`w-full h-4 rounded mb-2 ${effect.color}`} />
                    <div className="text-crd-white text-sm font-medium">{effect.name}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lighting */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Lighting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {lightingPresets.map((lighting) => (
                <button
                  key={lighting.id}
                  onClick={() => setSelectedLighting(lighting.id)}
                  className={`w-full text-left p-2 rounded-md transition-colors ${
                    selectedLighting === lighting.id
                      ? 'bg-crd-green text-black'
                      : 'text-crd-white hover:bg-crd-mediumGray/20'
                  }`}
                >
                  {lighting.name}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Preview Settings */}
          <div className="text-center">
            <p className="text-crd-lightGray text-sm mb-3">
              Perfect your card's presentation before publishing
            </p>
            <CRDButton 
              variant="outline" 
              className="w-full"
              onClick={() => {
                // Save current preview settings in description
                const settingsText = `Environment: ${selectedEnvironment}, Effect: ${selectedEffect}, Lighting: ${selectedLighting}`;
                onFieldUpdate('description', `${cardData.description || ''} [preview:${settingsText}]`.trim());
              }}
            >
              Save Preview Settings
            </CRDButton>
          </div>
        </div>
      </div>
    </div>
  );
};