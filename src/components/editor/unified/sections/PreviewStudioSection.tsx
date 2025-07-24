
import React, { useState } from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  RotateCcw, 
  Download,
  Share2,
  Maximize2,
  Sun,
  Sparkles,
  Palette,
  Settings
} from 'lucide-react';

interface PreviewStudioSectionProps {
  cardEditor: ReturnType<typeof import('@/hooks/useCardEditor').useCardEditor>;
  onNext: () => void;
  onPrevious: () => void;
}

export const PreviewStudioSection: React.FC<PreviewStudioSectionProps> = ({
  cardEditor,
  onNext,
  onPrevious
}) => {
  const [selectedEnvironment, setSelectedEnvironment] = useState('cosmic');
  const [lightingIntensity, setLightingIntensity] = useState([75]);
  const [effectIntensity, setEffectIntensity] = useState([80]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const environments = [
    { id: 'cosmic', name: 'Cosmic Void', gradient: 'from-purple-900 via-black to-blue-900' },
    { id: 'golden', name: 'Golden Hour', gradient: 'from-orange-400 via-red-400 to-pink-400' },
    { id: 'arctic', name: 'Arctic Ice', gradient: 'from-blue-200 via-cyan-300 to-blue-400' },
    { id: 'forest', name: 'Mystic Forest', gradient: 'from-green-800 via-green-600 to-emerald-400' },
    { id: 'volcanic', name: 'Volcanic', gradient: 'from-red-900 via-orange-600 to-yellow-400' }
  ];

  const lightingPresets = [
    { id: 'dramatic', name: 'Dramatic', description: 'High contrast lighting' },
    { id: 'soft', name: 'Soft Studio', description: 'Even, gentle lighting' },
    { id: 'spotlight', name: 'Spotlight', description: 'Focused center lighting' },
    { id: 'ambient', name: 'Ambient', description: 'Subtle environmental lighting' }
  ];

  const handleEnvironmentChange = (envId: string) => {
    setSelectedEnvironment(envId);
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting card...');
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Sharing card...');
  };

  // Mock 3D card viewer component until EnhancedCardViewer is available
  const MockCardViewer = () => (
    <div className="w-full h-full bg-gradient-to-br from-purple-900 via-black to-blue-900 rounded-lg flex items-center justify-center relative overflow-hidden">
      {cardEditor.cardData.image_url ? (
        <div className="relative w-48 h-64 transform rotate-y-12 hover:rotate-y-0 transition-transform duration-500">
          <div className="w-full h-full rounded-lg overflow-hidden shadow-2xl border border-crd-green/30">
            <img 
              src={cardEditor.cardData.image_url} 
              alt="3D Card Preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white font-bold text-sm mb-1">{cardEditor.cardData.title}</h3>
              <p className="text-white/80 text-xs">{cardEditor.cardData.rarity}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-16 h-16 bg-crd-mediumGray/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <Eye className="w-8 h-8 text-crd-mediumGray" />
          </div>
          <p className="text-crd-lightGray">Upload an image to see 3D preview</p>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse" />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-crd-white">3D Preview Studio</h3>
        <p className="text-crd-lightGray">Fine-tune your card's appearance with advanced 3D rendering</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side - 3D Viewer */}
        <div className="lg:col-span-2">
          <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-semibold text-crd-white flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  3D Card Viewer
                </h4>
                
                <div className="flex items-center space-x-2">
                  <CRDButton variant="outline" size="sm" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </CRDButton>
                  <CRDButton variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </CRDButton>
                  <CRDButton variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                    <Maximize2 className="w-4 h-4" />
                  </CRDButton>
                </div>
              </div>
              
              {/* 3D Card Viewer */}
              <div className="aspect-video rounded-lg overflow-hidden bg-crd-darkest">
                <MockCardViewer />
              </div>
              
              {/* Quick Controls */}
              <div className="flex items-center justify-center space-x-4 mt-4">
                <Badge variant="secondary" className="bg-crd-green/20 text-crd-green">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Real-time 3D
                </Badge>
                <Badge variant="secondary" className="bg-crd-blue/20 text-crd-blue">
                  <Settings className="w-3 h-3 mr-1" />
                  Interactive
                </Badge>
                <Badge variant="secondary" className="bg-crd-orange/20 text-crd-orange">
                  60 FPS
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Controls */}
        <div className="space-y-6">
          {/* Environment Settings */}
          <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
            <CardContent className="p-6">
              <h5 className="font-semibold text-crd-white mb-4 flex items-center">
                <Palette className="w-4 h-4 mr-2" />
                Environment
              </h5>
              
              <div className="grid grid-cols-1 gap-3">
                {environments.map((env) => (
                  <button
                    key={env.id}
                    onClick={() => handleEnvironmentChange(env.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedEnvironment === env.id
                        ? 'border-crd-green bg-crd-green/10'
                        : 'border-crd-mediumGray/30 hover:border-crd-green/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${env.gradient}`} />
                      <span className="text-crd-white font-medium">{env.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lighting Controls */}
          <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
            <CardContent className="p-6">
              <h5 className="font-semibold text-crd-white mb-4 flex items-center">
                <Sun className="w-4 h-4 mr-2" />
                Lighting
              </h5>
              
              <div className="space-y-4">
                {lightingPresets.map((preset) => (
                  <button
                    key={preset.id}
                    className="w-full p-3 rounded-lg bg-crd-darkGray/50 hover:bg-crd-darkGray text-left transition-colors"
                  >
                    <div className="font-medium text-crd-white">{preset.name}</div>
                    <div className="text-sm text-crd-lightGray">{preset.description}</div>
                  </button>
                ))}
                
                <div className="mt-6">
                  <label className="text-crd-white text-sm mb-2 block">
                    Lighting Intensity: {lightingIntensity[0]}%
                  </label>
                  <Slider
                    value={lightingIntensity}
                    onValueChange={setLightingIntensity}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Effect Controls */}
          <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
            <CardContent className="p-6">
              <h5 className="font-semibold text-crd-white mb-4 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Effects
              </h5>
              
              <div className="space-y-4">
                <div>
                  <label className="text-crd-white text-sm mb-2 block">
                    Effect Intensity: {effectIntensity[0]}%
                  </label>
                  <Slider
                    value={effectIntensity}
                    onValueChange={setEffectIntensity}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <CRDButton variant="outline" size="sm">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </CRDButton>
                  <CRDButton variant="outline" size="sm">
                    Random
                  </CRDButton>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
            <CardContent className="p-6">
              <h5 className="font-semibold text-crd-white mb-4">Export Options</h5>
              
              <div className="space-y-3">
                <CRDButton variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export as PNG (4K)
                </CRDButton>
                <CRDButton variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export as GIF (Animated)
                </CRDButton>
                <CRDButton variant="outline" className="w-full justify-start">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share to Gallery
                </CRDButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-crd-mediumGray/20">
        <CRDButton variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </CRDButton>
        
        <div className="text-sm text-crd-lightGray">
          Step 4 of 5 - Perfect your card in 3D
        </div>
        
        <CRDButton onClick={onNext} className="min-w-[120px]">
          Publish Card
          <ArrowRight className="w-4 h-4 ml-2" />
        </CRDButton>
      </div>
    </div>
  );
};
