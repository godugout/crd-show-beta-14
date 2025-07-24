import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Upload, Image, Frame, AlertCircle, Crop, Palette, Maximize } from 'lucide-react';
import { SVGTemplateRenderer } from '@/components/editor/templates/SVGTemplateRenderer';
import { BaseballCardCropper } from '@/components/editor/cropping/BaseballCardCropper';
import { BASEBALL_CARD_TEMPLATES } from '@/components/editor/templates/BaseballCardTemplates';
import { TeamColorSelector } from '@/components/editor/templates/TeamColorSelector';
import { useColorThemes } from '@/hooks/useColorThemes';
import { convertColorThemeToScheme, type TeamColorScheme } from '@/components/editor/templates/TeamColors';
import type { CreationMode } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';
import type { DesignTemplate } from '@/types/card';

interface PhotoStepProps {
  mode: CreationMode;
  selectedPhoto?: string;
  onPhotoSelect: (photo: string) => void;
  cardData?: CardData;
  selectedFrame?: DesignTemplate;
  onFrameSelect?: (frame: DesignTemplate) => void;
}

export const PhotoStep = ({ 
  mode, 
  selectedPhoto, 
  onPhotoSelect, 
  cardData,
  selectedFrame,
  onFrameSelect 
}: PhotoStepProps) => {
  console.log('📸 PhotoStep: Rendering with photo:', !!selectedPhoto, 'frame:', selectedFrame?.name);
  
  const [currentFrame, setCurrentFrame] = useState<DesignTemplate>(
    selectedFrame || BASEBALL_CARD_TEMPLATES[0] // No Frame is now first
  );
  const [showCropper, setShowCropper] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [playerName, setPlayerName] = useState(cardData?.title || 'PLAYER NAME');
  const [teamName, setTeamName] = useState('TEAM');
  const [selectedColorScheme, setSelectedColorScheme] = useState<TeamColorScheme | null>(null);
  
  const { colorThemes, loading: themesLoading } = useColorThemes();

  // Set default color scheme when themes load
  useEffect(() => {
    if (!selectedColorScheme && colorThemes.length > 0 && !themesLoading) {
      const defaultTheme = convertColorThemeToScheme(colorThemes[0]);
      setSelectedColorScheme(defaultTheme);
    }
  }, [colorThemes, themesLoading, selectedColorScheme]);

  useEffect(() => {
    return () => {
      imageUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imageUrls]);

  useEffect(() => {
    if (selectedFrame && selectedFrame.id !== currentFrame.id) {
      console.log('📸 PhotoStep: Updating frame to:', selectedFrame.name);
      setCurrentFrame(selectedFrame);
    }
  }, [selectedFrame?.id, currentFrame.id]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📸 PhotoStep: File selected:', file.name);
    
    try {
      const url = URL.createObjectURL(file);
      setImageUrls(prev => [...prev, url]);
      onPhotoSelect(url);
    } catch (error) {
      console.error('📸 PhotoStep: Error creating object URL:', error);
    }
  }, [onPhotoSelect]);

  const handleFrameSelection = useCallback((template: DesignTemplate) => {
    console.log('📸 PhotoStep: Frame selected:', template.name);
    setCurrentFrame(template);
    onFrameSelect?.(template);
  }, [onFrameSelect]);

  const handleCropComplete = (croppedImageUrl: string) => {
    onPhotoSelect(croppedImageUrl);
    setShowCropper(false);
  };

  const handleColorSchemeSelect = useCallback((colorScheme: TeamColorScheme) => {
    setSelectedColorScheme(colorScheme);
  }, []);

  // Show cropper if active
  if (showCropper && selectedPhoto) {
    return (
      <div className="max-w-4xl mx-auto">
        <BaseballCardCropper
          imageUrl={selectedPhoto}
          template={currentFrame}
          onCropComplete={handleCropComplete}
          onCancel={() => setShowCropper(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-crd-white mb-2">Create Your Baseball Card</h2>
        <p className="text-crd-lightGray">
          Upload your photo and choose from professional baseball card templates
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Photo Upload */}
        <div className="space-y-6">
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Photo Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedPhoto ? (
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <img 
                      src={selectedPhoto} 
                      alt="Original upload"
                      className="max-w-full h-48 object-contain rounded-lg border border-crd-mediumGray/30"
                      onError={(e) => {
                        console.error('📸 PhotoStep: Image load error:', e);
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-crd-green text-black px-2 py-1 rounded-full text-xs font-medium">
                      Uploaded
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-center">
                    <CRDButton
                      onClick={() => setShowCropper(true)}
                      variant="primary"
                      className="bg-crd-green hover:bg-crd-green/80 text-black"
                    >
                      <Crop className="w-4 h-4 mr-2" />
                      Crop & Edit
                    </CRDButton>
                    
                    <CRDButton
                      onClick={() => document.getElementById('photo-input')?.click()}
                      variant="outline"
                      className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
                    >
                      Change Photo
                    </CRDButton>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-crd-mediumGray/30 rounded-lg p-8 text-center">
                  <Image className="w-12 h-12 mx-auto mb-4 text-crd-mediumGray" />
                  <p className="text-crd-lightGray mb-4">No image selected</p>
                  <CRDButton
                    onClick={() => document.getElementById('photo-input')?.click()}
                    variant="outline"
                    className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Photo
                  </CRDButton>
                </div>
              )}
              
              <input
                id="photo-input"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Player Info */}
              <div className="space-y-3">
                <div>
                  <label className="block text-crd-white text-sm font-medium mb-1">
                    Player Name
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full bg-crd-mediumGray/20 border border-crd-mediumGray/30 rounded px-3 py-2 text-crd-white"
                    placeholder="Enter player name"
                  />
                </div>
                <div>
                  <label className="block text-crd-white text-sm font-medium mb-1">
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full bg-crd-mediumGray/20 border border-crd-mediumGray/30 rounded px-3 py-2 text-crd-white"
                    placeholder="Enter team name"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Color Selector */}
          <TeamColorSelector
            selectedColorScheme={selectedColorScheme || undefined}
            onColorSchemeSelect={handleColorSchemeSelect}
          />
        </div>

        {/* Right Side - Template Preview */}
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white flex items-center gap-2">
              <Frame className="w-5 h-5" />
              Card Preview
              {currentFrame.id === 'no-frame' && (
                <div className="flex items-center gap-1 text-crd-green text-xs">
                  <Maximize className="w-3 h-3" />
                  Full Bleed
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[5/7] bg-white rounded-lg border border-crd-mediumGray/30 overflow-hidden">
              <SVGTemplateRenderer
                template={currentFrame}
                imageUrl={selectedPhoto}
                playerName={playerName}
                teamName={teamName}
                customColors={selectedColorScheme || undefined}
                className="w-full h-full"
              />
            </div>
            
            <div className="text-center mt-4">
              <h4 className="text-crd-white font-medium mb-2">
                {currentFrame.name}
              </h4>
              <p className="text-crd-lightGray text-sm">
                {currentFrame.description}
              </p>
              {currentFrame.id === 'no-frame' && (
                <div className="mt-2 p-2 bg-crd-green/10 border border-crd-green/30 rounded text-xs text-crd-green">
                  Perfect for complete card artwork and full-image designs
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Template Selection */}
      <Card className="bg-crd-darker border-crd-mediumGray/20 mt-8">
        <CardHeader>
          <CardTitle className="text-crd-white flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Baseball Card Templates
          </CardTitle>
          <p className="text-crd-lightGray text-sm">
            Choose from professional baseball card designs. No Frame option for complete artwork.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {BASEBALL_CARD_TEMPLATES.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={currentFrame.id === template.id}
                onSelect={handleFrameSelection}
                playerName={playerName}
                teamName={teamName}
                colorScheme={selectedColorScheme}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Template selection card component
const TemplateCard = ({ 
  template, 
  isSelected, 
  onSelect,
  playerName,
  teamName,
  colorScheme
}: { 
  template: DesignTemplate; 
  isSelected: boolean; 
  onSelect: (template: DesignTemplate) => void;
  playerName: string;
  teamName: string;
  colorScheme: TeamColorScheme | null;
}) => (
  <div
    onClick={() => onSelect(template)}
    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
      isSelected
        ? 'border-crd-green bg-crd-green/10'
        : 'border-crd-mediumGray/30 hover:border-crd-green/50'
    }`}
  >
    <div className="aspect-[5/7] bg-white rounded mb-3 overflow-hidden">
      <SVGTemplateRenderer
        template={template}
        playerName={playerName}
        teamName={teamName}
        customColors={colorScheme || undefined}
        className="w-full h-full"
      />
    </div>
    
    <div className="text-center">
      <h4 className="text-crd-white font-medium text-sm mb-1 flex items-center justify-center gap-1">
        {template.name}
        {template.id === 'no-frame' && <Maximize className="w-3 h-3 text-crd-green" />}
      </h4>
      <div className="flex items-center justify-between">
        <span className="text-crd-lightGray text-xs">
          {template.category}
        </span>
        {template.is_premium && (
          <span className="text-crd-green text-xs font-medium">PRO</span>
        )}
      </div>
    </div>
  </div>
);
