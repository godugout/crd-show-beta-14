import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Upload, Image, Palette, Sparkles, Zap, Chrome, Stars, Eye, Frame, FolderOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UniversalUploadComponent } from '@/components/media/UniversalUploadComponent';
import { SVGTemplateRenderer } from '@/components/editor/templates/SVGTemplateRenderer';
import { BASEBALL_CARD_TEMPLATES } from '@/components/editor/templates/BaseballCardTemplates';
import { TeamColorSelector } from '@/components/editor/templates/TeamColorSelector';
import { useColorThemes } from '@/hooks/useColorThemes';
import { convertColorThemeToScheme, type TeamColorScheme } from '@/components/editor/templates/TeamColors';
import type { CreationMode } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';
import type { DesignTemplate } from '@/types/card';

interface CreateStepProps {
  mode: CreationMode;
  cardData: CardData;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
}

export const CreateStep = ({ mode, cardData, onFieldUpdate }: CreateStepProps) => {
  const [selectedFrame, setSelectedFrame] = useState<DesignTemplate>(BASEBALL_CARD_TEMPLATES[0]);
  const [selectedColorScheme, setSelectedColorScheme] = useState<TeamColorScheme | null>(null);
  const [playerName, setPlayerName] = useState(cardData?.title || 'PLAYER NAME');
  const [teamName, setTeamName] = useState('TEAM');
  
  // Effect states
  const [chromeEffect, setChromeEffect] = useState(false);
  const [holographicEffect, setHolographicEffect] = useState(false);
  const [foilEffect, setFoilEffect] = useState(false);
  const [chromeIntensity, setChromeIntensity] = useState([50]);
  const [holographicIntensity, setHolographicIntensity] = useState([50]);
  const [foilIntensity, setFoilIntensity] = useState([50]);
  
  const { colorThemes, loading: themesLoading } = useColorThemes();

  // Set default color scheme when themes load
  useEffect(() => {
    if (!selectedColorScheme && colorThemes.length > 0 && !themesLoading) {
      const defaultTheme = convertColorThemeToScheme(colorThemes[0]);
      setSelectedColorScheme(defaultTheme);
    }
  }, [colorThemes, themesLoading, selectedColorScheme]);

  const handleFileUpload = (file: File) => {
    console.log('📁 CreateStep: File selected:', file.name, file.type, file.size);
    const url = URL.createObjectURL(file);
    console.log('🔗 CreateStep: Generated URL:', url);
    console.log('🔄 CreateStep: Calling onFieldUpdate with:', 'image_url', url);
    onFieldUpdate('image_url', url);
    console.log('✅ CreateStep: File upload completed');
  };

  const quickFrames = BASEBALL_CARD_TEMPLATES.slice(0, 6);

  return (
    <div className="h-screen flex flex-col bg-crd-darkest">
      {/* Header with Title and Progress */}
      <div className="flex-shrink-0 px-8 py-6 border-b border-crd-mediumGray/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-crd-white mb-2">Create Your Card</h1>
            <p className="text-crd-lightGray text-base">
              Upload your photo, add details, and choose your initial design
            </p>
          </div>
          <div className="flex items-center gap-3 text-base text-crd-lightGray">
            <span className="bg-crd-green text-black px-3 py-2 rounded-lg text-sm font-medium">Step 1</span>
            <span>of 3</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 p-6 min-h-0">
        {/* Left Panel - Card Information & Team Colors */}
        <div className="col-span-3 flex flex-col space-y-6">
          {/* Card Details */}
          <Card className="bg-crd-darker/90 border-crd-mediumGray/40 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-crd-white text-lg flex items-center gap-3">
                <Image className="w-5 h-5" />
                Card Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-crd-lightGray text-sm font-medium">Card Title *</Label>
                <Input
                  id="title"
                  value={cardData.title || ''}
                  onChange={(e) => onFieldUpdate('title', e.target.value)}
                  placeholder="Enter player name"
                  className="bg-crd-darkest/80 border-crd-mediumGray/40 text-crd-white h-11 text-base focus:border-crd-green/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-crd-lightGray text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={cardData.description || ''}
                  onChange={(e) => onFieldUpdate('description', e.target.value)}
                  placeholder="Describe your card..."
                  rows={4}
                  className="bg-crd-darkest/80 border-crd-mediumGray/40 text-crd-white resize-none text-base focus:border-crd-green/50"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-crd-lightGray text-sm font-medium">Card Rarity</Label>
                <Select value={cardData.rarity || 'common'} onValueChange={(value) => onFieldUpdate('rarity', value)}>
                  <SelectTrigger className="bg-crd-darkest/80 border-crd-mediumGray/40 text-crd-white h-11 text-base focus:border-crd-green/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-crd-darker border-crd-mediumGray/40 backdrop-blur-sm">
                    <SelectItem value="common" className="text-crd-white hover:bg-crd-mediumGray/50 text-base">Common</SelectItem>
                    <SelectItem value="uncommon" className="text-crd-white hover:bg-crd-mediumGray/50 text-base">Uncommon</SelectItem>
                    <SelectItem value="rare" className="text-crd-white hover:bg-crd-mediumGray/50 text-base">Rare</SelectItem>
                    <SelectItem value="legendary" className="text-crd-white hover:bg-crd-mediumGray/50 text-base">Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Team Colors */}
          <Card className="bg-crd-darker/90 border-crd-mediumGray/40 backdrop-blur-sm flex-1">
            <CardHeader className="pb-4">
              <CardTitle className="text-crd-white flex items-center gap-3 text-lg">
                <Palette className="w-5 h-5" />
                Team Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="h-full min-h-[350px] overflow-hidden">
                <TeamColorSelector
                  selectedColorScheme={selectedColorScheme}
                  onColorSchemeSelect={(scheme) => {
                    setSelectedColorScheme(scheme);
                  }}
                  className="h-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Panel - Live Preview */}
        <div className="col-span-6 flex flex-col">
          <Card className="bg-crd-darker/90 border-crd-mediumGray/40 backdrop-blur-sm flex-1 flex flex-col">
            <CardHeader className="pb-4 flex-shrink-0">
              <CardTitle className="text-crd-white flex items-center gap-3 text-lg">
                <Eye className="w-5 h-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center items-center p-8">
              {/* Preview Canvas - Centered */}
              <div className="flex justify-center items-center mb-6">
                <div className="aspect-[5/7] w-full max-w-md bg-crd-mediumGray/10 rounded-2xl border-2 border-crd-mediumGray/40 overflow-hidden relative shadow-2xl"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}>
                  {cardData.image_url ? (
                    <div className="w-full h-full relative">
                      <SVGTemplateRenderer
                        template={selectedFrame}
                        imageUrl={cardData.image_url}
                        playerName={cardData.title || 'PLAYER NAME'}
                        teamName={teamName}
                        customColors={selectedColorScheme}
                        className="w-full h-full"
                      />
                      {/* Effect Overlays */}
                      {chromeEffect && (
                        <div 
                          className="absolute inset-0 bg-gradient-to-br from-crd-lightGray/20 to-crd-mediumGray/20 mix-blend-overlay pointer-events-none"
                          style={{ opacity: chromeIntensity[0] / 100 }}
                        />
                      )}
                      {holographicEffect && (
                        <div 
                          className="absolute inset-0 bg-gradient-to-br from-crd-blue/20 via-crd-purple/20 to-crd-green/20 mix-blend-screen pointer-events-none animate-pulse"
                          style={{ opacity: holographicIntensity[0] / 100 }}
                        />
                      )}
                      {foilEffect && (
                        <div 
                          className="absolute inset-0 bg-gradient-to-br from-crd-orange/20 to-crd-green/20 mix-blend-overlay pointer-events-none"
                          style={{ opacity: foilIntensity[0] / 100 }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-center text-crd-lightGray relative">
                      <div className="absolute inset-4 border-2 border-dashed border-crd-mediumGray/40 rounded-xl flex items-center justify-center">
                        <div>
                          <Upload className="w-12 h-12 mx-auto mb-3 text-crd-lightGray" />
                          <p className="text-lg font-medium text-crd-white mb-2">Add Your Photo</p>
                          <p className="text-sm text-crd-lightGray mb-4">Drag & drop or click to upload</p>
                          <UniversalUploadComponent
                            onFilesSelected={(files) => {
                              if (files.length > 0) {
                                handleFileUpload(files[0]);
                              }
                            }}
                            onError={(error) => {
                              console.error('Upload error:', error);
                            }}
                            accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] }}
                            maxSize={10 * 1024 * 1024} // 10MB
                            maxFiles={1}
                            multiple={false}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Frame Info */}
              <div className="text-center">
                <h4 className="text-crd-white font-semibold text-base mb-1">{selectedFrame.name}</h4>
                <p className="text-crd-lightGray text-sm">{selectedFrame.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Tabbed Interface */}
        <div className="col-span-3 flex flex-col">
          <Card className="bg-crd-darker/90 border-crd-mediumGray/40 backdrop-blur-sm flex-1 flex flex-col">
            <Tabs defaultValue="frames" className="flex flex-col h-full">
              <TabsList className="grid w-full grid-cols-3 bg-crd-darkest/50 border-crd-mediumGray/40 mx-4 mt-4">
                <TabsTrigger value="frames" className="text-crd-lightGray data-[state=active]:text-crd-white data-[state=active]:bg-crd-green data-[state=active]:text-black">
                  <Frame className="w-4 h-4 mr-2" />
                  Frames
                </TabsTrigger>
                <TabsTrigger value="media" className="text-crd-lightGray data-[state=active]:text-crd-white data-[state=active]:bg-crd-green data-[state=active]:text-black">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Media
                </TabsTrigger>
                <TabsTrigger value="effects" className="text-crd-lightGray data-[state=active]:text-crd-white data-[state=active]:bg-crd-green data-[state=active]:text-black">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Effects
                </TabsTrigger>
              </TabsList>

              <TabsContent value="frames" className="flex-1 mt-4 mx-4 mb-4">
                <div className="space-y-4 h-full">
                  <h3 className="text-crd-white font-semibold text-base">Choose Frame</h3>
                  <div className="grid grid-cols-2 gap-3 overflow-auto">
                    {quickFrames.map((frame) => (
                      <div
                        key={frame.id}
                        onClick={() => setSelectedFrame(frame)}
                        className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
                          selectedFrame.id === frame.id
                            ? 'ring-2 ring-crd-green scale-105 shadow-lg shadow-crd-green/20'
                            : 'hover:scale-102 hover:ring-2 hover:ring-crd-lightGray/50 hover:shadow-md'
                        }`}
                      >
                        <SVGTemplateRenderer
                          template={frame}
                          playerName="PLAYER"
                          teamName="TEAM"
                          customColors={selectedColorScheme}
                          className="w-full h-full"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                          <p className="text-crd-white text-xs text-center truncate font-medium">{frame.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="flex-1 mt-4 mx-4 mb-4">
                <div className="space-y-4 h-full">
                  <h3 className="text-crd-white font-semibold text-base">Upload Media</h3>
                  <div className="h-full overflow-auto">
                    <UniversalUploadComponent
                      onFilesSelected={(files) => {
                        if (files.length > 0) {
                          handleFileUpload(files[0]);
                        }
                      }}
                      onError={(error) => {
                        console.error('Upload error:', error);
                      }}
                      accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] }}
                      maxSize={10 * 1024 * 1024} // 10MB
                      maxFiles={1}
                      multiple={false}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="effects" className="flex-1 mt-4 mx-4 mb-4">
                <div className="space-y-4 h-full overflow-auto">
                  <h3 className="text-crd-white font-semibold text-base">Card Effects</h3>
                  
                  {/* Chrome Effect */}
                  <div className="space-y-3 p-4 rounded-xl bg-crd-darkest/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Chrome className="w-4 h-4 text-crd-lightGray" />
                        <Label className="text-crd-white text-sm font-medium">Chrome</Label>
                      </div>
                      <Switch
                        checked={chromeEffect}
                        onCheckedChange={setChromeEffect}
                      />
                    </div>
                    {chromeEffect && (
                      <div className="space-y-3">
                        <Slider
                          value={chromeIntensity}
                          onValueChange={setChromeIntensity}
                          max={100}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-xs text-crd-lightGray text-center">{chromeIntensity[0]}% Intensity</div>
                      </div>
                    )}
                  </div>

                  {/* Holographic Effect */}
                  <div className="space-y-3 p-4 rounded-xl bg-crd-darkest/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-crd-lightGray" />
                        <Label className="text-crd-white text-sm font-medium">Holographic</Label>
                      </div>
                      <Switch
                        checked={holographicEffect}
                        onCheckedChange={setHolographicEffect}
                      />
                    </div>
                    {holographicEffect && (
                      <div className="space-y-3">
                        <Slider
                          value={holographicIntensity}
                          onValueChange={setHolographicIntensity}
                          max={100}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-xs text-crd-lightGray text-center">{holographicIntensity[0]}% Intensity</div>
                      </div>
                    )}
                  </div>

                  {/* Foil Effect */}
                  <div className="space-y-3 p-4 rounded-xl bg-crd-darkest/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Stars className="w-4 h-4 text-crd-lightGray" />
                        <Label className="text-crd-white text-sm font-medium">Foil</Label>
                      </div>
                      <Switch
                        checked={foilEffect}
                        onCheckedChange={setFoilEffect}
                      />
                    </div>
                    {foilEffect && (
                      <div className="space-y-3">
                        <Slider
                          value={foilIntensity}
                          onValueChange={setFoilIntensity}
                          max={100}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-xs text-crd-lightGray text-center">{foilIntensity[0]}% Intensity</div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* CRD Details Section */}
      <div className="flex-shrink-0 border-t border-crd-mediumGray/20 bg-crd-darker/50 backdrop-blur-sm">
        <div className="px-8 py-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <h3 className="text-crd-white font-semibold text-lg mb-3">CRD Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray text-sm">Serial Number:</span>
                  <span className="text-crd-white text-sm font-mono">#CRD-{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray text-sm">Edition:</span>
                  <span className="text-crd-white text-sm">First Edition</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray text-sm">Print Quality:</span>
                  <span className="text-crd-green text-sm font-medium">Premium</span>
                </div>
              </div>
            </div>
            <div className="col-span-6 flex justify-center items-center">
              <div className="text-center">
                <p className="text-crd-lightGray text-sm mb-2">Authentication</p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-crd-green rounded-full animate-pulse"></div>
                  <span className="text-crd-green text-sm font-medium">Blockchain Verified</span>
                </div>
              </div>
            </div>
            <div className="col-span-3 text-right">
              <h4 className="text-crd-white font-semibold text-sm mb-2">Estimated Value</h4>
              <div className="text-2xl font-bold text-crd-green">$4.99</div>
              <p className="text-crd-lightGray text-xs">Based on rarity & effects</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};