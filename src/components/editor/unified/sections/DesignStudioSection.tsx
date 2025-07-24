
import React, { useState } from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ArrowRight, 
  Palette, 
  Sparkles, 
  Type, 
  Layers,
  RotateCcw,
  Wand2,
  Chrome,
  Gem,
  Zap,
  Eye
} from 'lucide-react';

interface DesignStudioSectionProps {
  cardEditor: ReturnType<typeof import('@/hooks/useCardEditor').useCardEditor>;
  onNext: () => void;
  onPrevious: () => void;
}

export const DesignStudioSection: React.FC<DesignStudioSectionProps> = ({
  cardEditor,
  onNext,
  onPrevious
}) => {
  const [selectedEffect, setSelectedEffect] = useState('holographic');
  const [effectIntensity, setEffectIntensity] = useState([75]);
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');

  const effects = [
    { 
      id: 'holographic', 
      name: 'Holographic Foil', 
      icon: Sparkles, 
      description: 'Rainbow shimmer effect',
      color: 'from-purple-400 to-pink-400' 
    },
    { 
      id: 'chrome', 
      name: 'Chrome Finish', 
      icon: Chrome, 
      description: 'Metallic chrome surface',
      color: 'from-gray-300 to-gray-500' 
    },
    { 
      id: 'crystal', 
      name: 'Crystal Prizm', 
      icon: Gem, 
      description: 'Crystal refraction effects',
      color: 'from-blue-400 to-cyan-400' 
    },
    { 
      id: 'vintage', 
      name: 'Vintage Gold', 
      icon: Sparkles, 
      description: 'Classic gold foil finish',
      color: 'from-yellow-400 to-orange-400' 
    },
    { 
      id: 'lightning', 
      name: 'Lightning', 
      icon: Zap, 
      description: 'Electric energy effects',
      color: 'from-blue-300 to-purple-400' 
    }
  ];

  const rarityStyles = [
    { id: 'common', name: 'Common', color: '#94A3B8', border: 'border-gray-400' },
    { id: 'uncommon', name: 'Uncommon', color: '#10B981', border: 'border-green-400' },
    { id: 'rare', name: 'Rare', color: '#3B82F6', border: 'border-blue-400' },
    { id: 'ultra-rare', name: 'Ultra Rare', color: '#8B5CF6', border: 'border-purple-400' },
    { id: 'legendary', name: 'Legendary', color: '#F59E0B', border: 'border-orange-400' }
  ];

  const handleEffectChange = (effectId: string) => {
    setSelectedEffect(effectId);
    cardEditor.updateDesignMetadata('effects', {
      ...cardEditor.cardData.design_metadata.effects,
      [effectId]: { intensity: effectIntensity[0] }
    });
  };

  const handleIntensityChange = (value: number[]) => {
    setEffectIntensity(value);
    cardEditor.updateDesignMetadata('effects', {
      ...cardEditor.cardData.design_metadata.effects,
      [selectedEffect]: { intensity: value[0] }
    });
  };

  const handleRarityChange = (rarity: string) => {
    cardEditor.updateCardField('rarity', rarity as any);
  };

  const handleTitleChange = (title: string) => {
    cardEditor.updateCardField('title', title);
  };

  const handleDescriptionChange = (description: string) => {
    cardEditor.updateCardField('description', description);
  };

  const handleTagAdd = (tag: string) => {
    if (tag.trim() && !cardEditor.cardData.tags.includes(tag.trim())) {
      cardEditor.addTag(tag.trim());
    }
  };

  const resetEffects = () => {
    cardEditor.updateDesignMetadata('effects', {});
    setEffectIntensity([75]);
    setSelectedEffect('holographic');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-crd-white">Design Your Card</h3>
        <p className="text-crd-lightGray">Customize effects, colors, and card details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Controls */}
        <div className="space-y-6">
          <Tabs defaultValue="effects" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-crd-mediumGray/20">
              <TabsTrigger value="effects">Effects</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
            </TabsList>
            
            <TabsContent value="effects" className="space-y-6">
              {/* Effect Selection */}
              <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-crd-white flex items-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Visual Effects
                    </h4>
                    <CRDButton variant="outline" size="sm" onClick={resetEffects}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </CRDButton>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {effects.map((effect) => {
                      const Icon = effect.icon;
                      const isSelected = selectedEffect === effect.id;
                      
                      return (
                        <button
                          key={effect.id}
                          onClick={() => handleEffectChange(effect.id)}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            isSelected 
                              ? 'border-crd-green bg-crd-green/10' 
                              : 'border-crd-mediumGray/30 hover:border-crd-green/50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${effect.color} flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h5 className="font-medium text-crd-white">{effect.name}</h5>
                              <p className="text-sm text-crd-lightGray">{effect.description}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Intensity Slider */}
                  <div className="mt-6">
                    <Label className="text-crd-white mb-3 block">
                      Effect Intensity: {effectIntensity[0]}%
                    </Label>
                    <Slider
                      value={effectIntensity}
                      onValueChange={handleIntensityChange}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-6">
              {/* Card Details */}
              <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
                <CardContent className="p-6 space-y-4">
                  <h4 className="font-semibold text-crd-white flex items-center">
                    <Type className="w-5 h-5 mr-2" />
                    Card Information
                  </h4>
                  
                  <div>
                    <Label htmlFor="title" className="text-crd-white">Title</Label>
                    <Input
                      id="title"
                      value={cardEditor.cardData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="bg-crd-darkGray border-crd-mediumGray/30 text-crd-white"
                      placeholder="Enter card title..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description" className="text-crd-white">Description</Label>
                    <textarea
                      id="description"
                      value={cardEditor.cardData.description || ''}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-crd-darkGray border border-crd-mediumGray/30 rounded-md text-crd-white placeholder-crd-mediumGray"
                      placeholder="Describe your card..."
                    />
                  </div>
                  
                  <div>
                    <Label className="text-crd-white">Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {cardEditor.cardData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-crd-green/20 text-crd-green">
                          {tag}
                          <button
                            onClick={() => cardEditor.removeTag(tag)}
                            className="ml-2 text-crd-green/60 hover:text-crd-green"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="Add tags (press Enter)..."
                      className="bg-crd-darkGray border-crd-mediumGray/30 text-crd-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleTagAdd(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="style" className="space-y-6">
              {/* Rarity Selection */}
              <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-crd-white mb-4 flex items-center">
                    <Gem className="w-5 h-5 mr-2" />
                    Card Rarity
                  </h4>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {rarityStyles.map((rarity) => (
                      <button
                        key={rarity.id}
                        onClick={() => handleRarityChange(rarity.id)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          cardEditor.cardData.rarity === rarity.id
                            ? `border-[${rarity.color}] bg-[${rarity.color}]/10`
                            : 'border-crd-mediumGray/30 hover:border-crd-mediumGray/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div 
                            className={`w-4 h-4 rounded-full`}
                            style={{ backgroundColor: rarity.color }}
                          />
                          <span className="font-medium text-crd-white">{rarity.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Side - Live Preview */}
        <div className="space-y-6">
          <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
            <CardContent className="p-6">
              <h4 className="font-semibold text-crd-white mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Live Preview
              </h4>
              
              {/* Card Preview */}
              <div className="aspect-[5/7] rounded-lg overflow-hidden bg-crd-darkGray border border-crd-mediumGray/30 relative">
                {cardEditor.cardData.image_url ? (
                  <>
                    <img 
                      src={cardEditor.cardData.image_url} 
                      alt="Card preview" 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Effect Overlay */}
                    <div 
                      className="absolute inset-0 opacity-30 mix-blend-overlay"
                      style={{
                        background: selectedEffect === 'holographic' 
                          ? 'linear-gradient(45deg, #ff0080, #00ff80, #8000ff, #ff8000)'
                          : selectedEffect === 'chrome'
                          ? 'linear-gradient(45deg, #c0c0c0, #f0f0f0, #c0c0c0)'
                          : selectedEffect === 'crystal'
                          ? 'linear-gradient(45deg, #00bfff, #87ceeb, #00bfff)'
                          : selectedEffect === 'vintage'
                          ? 'linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)'
                          : 'linear-gradient(45deg, #00ffff, #ff00ff, #00ffff)',
                        opacity: effectIntensity[0] / 100
                      }}
                    />
                    
                    {/* Card Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h5 className="text-white font-bold text-lg">{cardEditor.cardData.title}</h5>
                      {cardEditor.cardData.description && (
                        <p className="text-white/80 text-sm mt-1 line-clamp-2">
                          {cardEditor.cardData.description}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Layers className="w-12 h-12 text-crd-mediumGray mx-auto mb-2" />
                      <p className="text-crd-mediumGray text-sm">Upload an image to see preview</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Preview Controls */}
              <div className="mt-4 text-center">
                <CRDButton variant="outline" size="sm">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Quick Preview
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
          Step 3 of 5 - Customize your card design
        </div>
        
        <CRDButton onClick={onNext} className="min-w-[120px]">
          Next Step
          <ArrowRight className="w-4 h-4 ml-2" />
        </CRDButton>
      </div>
    </div>
  );
};
