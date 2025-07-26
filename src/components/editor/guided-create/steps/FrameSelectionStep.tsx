import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Star, Filter, Sparkles, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { WizardData } from '../InteractiveWizard';

interface FrameSelectionStepProps {
  data: WizardData;
  onUpdate: (data: Partial<WizardData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

interface Frame {
  id: string;
  name: string;
  preview: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  style: 'modern' | 'vintage' | 'futuristic' | 'artistic';
  popularity: number;
  isNew?: boolean;
  isPremium?: boolean;
  description: string;
  tags: string[];
}

const mockFrames: Frame[] = [
  {
    id: 'sports-pro',
    name: 'Sports Pro',
    preview: '/api/placeholder/300/400',
    rarity: 'epic',
    style: 'modern',
    popularity: 95,
    description: 'Professional sports card design with dynamic energy',
    tags: ['sports', 'professional', 'dynamic']
  },
  {
    id: 'retro-classic',
    name: 'Retro Classic',
    preview: '/api/placeholder/300/400',
    rarity: 'rare',
    style: 'vintage',
    popularity: 88,
    description: 'Vintage-inspired design with classic appeal',
    tags: ['vintage', 'classic', 'nostalgic']
  },
  {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    preview: '/api/placeholder/300/400',
    rarity: 'legendary',
    style: 'futuristic',
    popularity: 92,
    isNew: true,
    description: 'Futuristic cyberpunk aesthetic with neon effects',
    tags: ['futuristic', 'neon', 'cyberpunk']
  },
  {
    id: 'artistic-splash',
    name: 'Artistic Splash',
    preview: '/api/placeholder/300/400',
    rarity: 'epic',
    style: 'artistic',
    popularity: 85,
    isPremium: true,
    description: 'Creative artistic design with paint splash effects',
    tags: ['artistic', 'creative', 'colorful']
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    preview: '/api/placeholder/300/400',
    rarity: 'common',
    style: 'modern',
    popularity: 78,
    description: 'Clean, minimalist design for focus on content',
    tags: ['minimal', 'clean', 'simple']
  },
  {
    id: 'gold-luxury',
    name: 'Gold Luxury',
    preview: '/api/placeholder/300/400',
    rarity: 'legendary',
    style: 'modern',
    popularity: 90,
    isPremium: true,
    description: 'Luxurious gold-trimmed design for premium cards',
    tags: ['luxury', 'gold', 'premium']
  }
];

export const FrameSelectionStep: React.FC<FrameSelectionStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious
}) => {
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(data.frame || null);
  const [hoveredFrame, setHoveredFrame] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'recommended' | 'new' | 'popular'>('recommended');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse position for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        mouseX.set((e.clientX - centerX) / 20);
        mouseY.set((e.clientY - centerY) / 20);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const getFilteredFrames = () => {
    let filtered = mockFrames;

    // Apply rarity filter
    if (rarityFilter !== 'all') {
      filtered = filtered.filter(frame => frame.rarity === rarityFilter);
    }

    // Apply main filter
    switch (filter) {
      case 'recommended':
        // Based on user's category selection
        if (data.category === 'sports') {
          filtered = filtered.filter(frame => 
            frame.tags.includes('sports') || 
            frame.tags.includes('professional') ||
            frame.popularity > 85
          );
        }
        break;
      case 'new':
        filtered = filtered.filter(frame => frame.isNew);
        break;
      case 'popular':
        filtered = filtered.sort((a, b) => b.popularity - a.popularity);
        break;
    }

    return filtered;
  };

  const filteredFrames = getFilteredFrames();

  const handleFrameSelect = (frame: Frame) => {
    setSelectedFrame(frame);
    onUpdate({ frame });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-500 border-gray-500';
      case 'rare': return 'text-blue-500 border-blue-500';
      case 'epic': return 'text-purple-500 border-purple-500';
      case 'legendary': return 'text-yellow-500 border-yellow-500';
      default: return 'text-gray-500 border-gray-500';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'rare': return 'shadow-blue-500/25';
      case 'epic': return 'shadow-purple-500/25';
      case 'legendary': return 'shadow-yellow-500/25';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden">
      <div ref={containerRef} className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-4">
            Choose Your Frame
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect frame that matches your vision. Each frame brings its own personality to your card.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter:</span>
          </div>
          
          {/* Main Filters */}
          <div className="flex gap-2">
            {[
              { id: 'recommended', label: 'Recommended', icon: <Sparkles className="w-3 h-3" /> },
              { id: 'popular', label: 'Popular', icon: <Star className="w-3 h-3" /> },
              { id: 'new', label: 'New', icon: <Zap className="w-3 h-3" /> },
              { id: 'all', label: 'All' }
            ].map(filterOption => (
              <Button
                key={filterOption.id}
                variant={filter === filterOption.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(filterOption.id as any)}
                className="text-xs"
              >
                {filterOption.icon}
                {filterOption.label}
              </Button>
            ))}
          </div>

          {/* Rarity Filter */}
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Rarities' },
              { id: 'common', label: 'Common' },
              { id: 'rare', label: 'Rare' },
              { id: 'epic', label: 'Epic' },
              { id: 'legendary', label: 'Legendary' }
            ].map(rarity => (
              <Button
                key={rarity.id}
                variant={rarityFilter === rarity.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRarityFilter(rarity.id)}
                className={`text-xs ${rarityFilter === rarity.id ? '' : getRarityColor(rarity.id)}`}
              >
                {rarity.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Frames Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredFrames.map((frame, index) => {
            const isSelected = selectedFrame?.id === frame.id;
            const isHovered = hoveredFrame === frame.id;

            return (
              <motion.div
                key={frame.id}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  rotateY: 0,
                  scale: isSelected ? 1.05 : 1
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                style={{
                  x: springX,
                  y: springY,
                  transformStyle: 'preserve-3d'
                }}
                onHoverStart={() => setHoveredFrame(frame.id)}
                onHoverEnd={() => setHoveredFrame(null)}
                onClick={() => handleFrameSelect(frame)}
                whileHover={{ 
                  scale: 1.1, 
                  rotateY: 5,
                  z: 50
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`relative overflow-hidden rounded-xl border-2 transition-all duration-500 ${
                  isSelected 
                    ? `border-primary shadow-2xl ${getRarityGlow(frame.rarity)}` 
                    : 'border-white/10 hover:border-white/20'
                }`}>
                  {/* Frame Preview */}
                  <div className="aspect-[3/4] bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                    <div className="absolute inset-4 bg-background/80 rounded-lg border border-white/10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">Frame Preview</p>
                      </div>
                    </div>

                    {/* Rarity Glow Effect */}
                    {frame.rarity !== 'common' && (
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-t ${
                          frame.rarity === 'rare' ? 'from-blue-500/20' :
                          frame.rarity === 'epic' ? 'from-purple-500/20' :
                          'from-yellow-500/20'
                        } to-transparent`}
                        animate={{
                          opacity: isHovered ? 0.6 : 0.3
                        }}
                      />
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {frame.isNew && (
                        <Badge className="bg-green-500 text-white text-xs">NEW</Badge>
                      )}
                      {frame.isPremium && (
                        <Badge className="bg-yellow-500 text-black text-xs">PREMIUM</Badge>
                      )}
                    </div>

                    <div className="absolute top-2 right-2">
                      <Badge className={`text-xs ${getRarityColor(frame.rarity)}`}>
                        {frame.rarity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Frame Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{frame.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {frame.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm">{frame.popularity}%</span>
                      </div>
                      
                      <div className="flex gap-1">
                        {frame.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <motion.div
                      className="absolute inset-0 border-2 border-primary rounded-xl bg-primary/5"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            ✓
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation */}
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            variant="outline"
            onClick={onPrevious}
            className="bg-background/80 backdrop-blur-sm border-white/10"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {selectedFrame ? `Selected: ${selectedFrame.name}` : 'Choose a frame to continue'}
            </p>
          </div>

          <Button
            onClick={onNext}
            disabled={!selectedFrame}
            className="bg-primary hover:bg-primary/90"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};