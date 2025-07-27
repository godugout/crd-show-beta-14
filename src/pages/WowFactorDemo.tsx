import { AIDesignAssistant } from '@/components/editor/unified/components/AIDesignAssistant';
import { InteractiveCardEffects } from '@/components/effects/InteractiveCardEffects';
import { NavbarSafeLayout } from '@/components/layout/NavbarSafeLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedCardViewer3D } from '@/components/viewer/EnhancedCardViewer3D';
import type { CardData } from '@/types/card';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Camera,
    Eye,
    Pause,
    Play,
    Sparkles,
    Star,
    Wand2,
    Zap
} from 'lucide-react';
import React, { useState } from 'react';

// Sample card data for demo
const sampleCard: CardData = {
  id: 'demo-card-1',
  title: 'Legendary Dragon Knight',
  description: 'A powerful warrior with mystical abilities and ancient dragon heritage. This rare card features holographic effects and dynamic animations.',
  image_url: '/public/lovable-uploads/356f5580-958c-4da6-9c36-b9931367a794.png',
  thumbnail_url: '/public/lovable-uploads/356f5580-958c-4da6-9c36-b9931367a794.png',
  creator_id: 'demo-user',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_public: true,
  visibility: 'public',
  rarity: 'legendary',
  tags: ['fantasy', 'dragon', 'knight', 'legendary'],
  design_metadata: {
    effects: {
      holographic: true,
      chrome: true,
      gradient: true
    },
    style: 'fantasy'
  },
  creator_attribution: {
    creator_id: 'demo-user',
    collaboration_type: 'solo'
  },
  publishing_options: {
    marketplace_listing: true,
    crd_catalog_inclusion: true,
    print_available: true
  }
};

export const WowFactorDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ai-assistant');
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAISuggestionApply = (suggestion: any) => {
    console.log('AI Suggestion applied:', suggestion);
  };

  return (
    <NavbarSafeLayout className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="bg-crd-darker border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-crd-white mb-2">
                🚀 Wow Factor Demo
              </h1>
              <p className="text-crd-lightGray">
                Experience the next generation of card creation and viewing
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-crd-green/30 text-crd-green">
                <Sparkles className="w-3 h-3 mr-1" />
                Beta Features
              </Badge>
              <Button
                variant="outline"
                onClick={() => setIsPlaying(!isPlaying)}
                className="border-crd-mediumGray/30 text-crd-lightGray hover:text-crd-white"
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? 'Pause' : 'Play'} Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-crd-darker/50">
            <TabsTrigger value="ai-assistant" className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="3d-viewer" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              3D Viewer
            </TabsTrigger>
            <TabsTrigger value="interactive-effects" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Interactive Effects
            </TabsTrigger>
          </TabsList>

          {/* AI Design Assistant Tab */}
          <TabsContent value="ai-assistant" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-crd-darker/90 border-crd-mediumGray/40 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-crd-white text-xl flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-crd-green" />
                    AI-Powered Design Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-crd-white font-semibold text-lg">Intelligent Design Suggestions</h3>
                      <p className="text-crd-lightGray">
                        Our AI analyzes your card content and provides intelligent suggestions for colors, 
                        effects, layouts, and styles that will make your card stand out.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-crd-green" />
                          <span className="text-crd-white text-sm">Real-time content analysis</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-crd-green" />
                          <span className="text-crd-white text-sm">Confidence-based recommendations</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-crd-green" />
                          <span className="text-crd-white text-sm">One-click application</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-96">
                      <AIDesignAssistant
                        cardTitle={sampleCard.title}
                        cardDescription={sampleCard.description}
                        cardImage={sampleCard.image_url}
                        onSuggestionApply={handleAISuggestionApply}
                        className="h-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Enhanced 3D Viewer Tab */}
          <TabsContent value="3d-viewer" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-crd-darker/90 border-crd-mediumGray/40 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-crd-white text-xl flex items-center gap-3">
                    <Eye className="w-6 h-6 text-crd-green" />
                    Enhanced 3D Card Viewer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-crd-white font-semibold text-lg">Immersive 3D Experience</h3>
                      <p className="text-crd-lightGray">
                        Explore your cards in stunning 3D with multiple viewing modes, particle effects, 
                        and interactive controls for the ultimate viewing experience.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-crd-green" />
                          <span className="text-crd-white text-sm">Multiple viewing modes (Normal, Cinematic, Showcase)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-crd-green" />
                          <span className="text-crd-white text-sm">Dynamic particle systems</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-crd-green" />
                          <span className="text-crd-white text-sm">Fullscreen immersive mode</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-96">
                      <EnhancedCardViewer3D
                        card={sampleCard}
                        showControls={true}
                        autoRotate={isPlaying}
                        enableParticles={true}
                        className="h-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Interactive Effects Tab */}
          <TabsContent value="interactive-effects" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-crd-darker/90 border-crd-mediumGray/40 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-crd-white text-xl flex items-center gap-3">
                    <Zap className="w-6 h-6 text-crd-green" />
                    Interactive Card Effects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-crd-white font-semibold text-lg">Dynamic Visual Effects</h3>
                      <p className="text-crd-lightGray">
                        Add stunning particle effects to your cards with real-time controls. 
                        Choose from sparkles, fire, water, and more with customizable parameters.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-crd-green" />
                          <span className="text-crd-white text-sm">8 different effect types</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-crd-green" />
                          <span className="text-crd-white text-sm">Real-time parameter controls</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-crd-green" />
                          <span className="text-crd-white text-sm">Interactive hover animations</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-96">
                      <InteractiveCardEffects
                        card={sampleCard}
                        showControls={true}
                        className="h-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <Card className="bg-crd-darker/90 border-crd-mediumGray/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-crd-white text-xl">Feature Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-crd-green/20 rounded-full flex items-center justify-center mx-auto">
                    <Wand2 className="w-8 h-8 text-crd-green" />
                  </div>
                  <h3 className="text-crd-white font-semibold">AI Assistant</h3>
                  <p className="text-crd-lightGray text-sm">
                    Intelligent design suggestions based on card content analysis
                  </p>
                  <Badge variant="outline" className="border-crd-green/30 text-crd-green">
                    92% Accuracy
                  </Badge>
                </div>
                
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-crd-green/20 rounded-full flex items-center justify-center mx-auto">
                    <Camera className="w-8 h-8 text-crd-green" />
                  </div>
                  <h3 className="text-crd-white font-semibold">3D Viewer</h3>
                  <p className="text-crd-lightGray text-sm">
                    Immersive 3D viewing with multiple modes and particle effects
                  </p>
                  <Badge variant="outline" className="border-crd-green/30 text-crd-green">
                    3 View Modes
                  </Badge>
                </div>
                
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-crd-green/20 rounded-full flex items-center justify-center mx-auto">
                    <Zap className="w-8 h-8 text-crd-green" />
                  </div>
                  <h3 className="text-crd-white font-semibold">Interactive Effects</h3>
                  <p className="text-crd-lightGray text-sm">
                    Dynamic particle systems with real-time parameter controls
                  </p>
                  <Badge variant="outline" className="border-crd-green/30 text-crd-green">
                    8 Effect Types
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8"
        >
          <Button size="lg" className="bg-crd-green hover:bg-crd-green/80 text-black font-semibold">
            <Sparkles className="w-5 h-5 mr-2" />
            Try These Features Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </NavbarSafeLayout>
  );
};

export default WowFactorDemo; 