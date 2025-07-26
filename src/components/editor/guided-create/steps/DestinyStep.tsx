import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Gamepad2, Star, Palette, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { WizardData } from '../InteractiveWizard';

interface DestinyStepProps {
  data: WizardData;
  onUpdate: (data: Partial<WizardData>) => void;
  onNext: () => void;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  videoUrl?: string;
  color: string;
  bgGradient: string;
  soundEffect?: string;
  popularity: number;
}

const categories: Category[] = [
  {
    id: 'sports',
    name: 'Sports',
    description: 'Athletes, teams, and legendary moments',
    icon: <Play className="w-12 h-12" />,
    color: '#ef4444',
    bgGradient: 'from-red-500/20 via-orange-500/10 to-yellow-500/20',
    popularity: 95
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Characters, streamers, and epic gameplay',
    icon: <Gamepad2 className="w-12 h-12" />,
    color: '#8b5cf6',
    bgGradient: 'from-purple-500/20 via-blue-500/10 to-cyan-500/20',
    popularity: 88
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Movies, music, and celebrity moments',
    icon: <Star className="w-12 h-12" />,
    color: '#f59e0b',
    bgGradient: 'from-yellow-500/20 via-orange-500/10 to-red-500/20',
    popularity: 82
  },
  {
    id: 'art',
    name: 'Art & Creative',
    description: 'Artwork, designs, and creative expressions',
    icon: <Palette className="w-12 h-12" />,
    color: '#06b6d4',
    bgGradient: 'from-cyan-500/20 via-blue-500/10 to-purple-500/20',
    popularity: 75
  }
];

export const DestinyStep: React.FC<DestinyStepProps> = ({
  data,
  onUpdate,
  onNext
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(data.category || null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'idle' | 'selecting'>('enter');

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationPhase('idle');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setAnimationPhase('selecting');
    setSelectedCategory(categoryId);
    onUpdate({ category: categoryId });
    
    // Play sound effect
    if (soundEnabled) {
      // Simulate sound effect
      console.log(`Playing sound for ${categoryId}`);
    }

    // Auto-advance after selection animation
    setTimeout(() => {
      onNext();
    }, 1000);
  };

  const getStaggerDelay = (index: number) => {
    return animationPhase === 'enter' ? index * 0.15 : 0;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        {hoveredCategory && (
          <motion.div
            key={hoveredCategory}
            className={`absolute inset-0 bg-gradient-to-br ${
              categories.find(c => c.id === hoveredCategory)?.bgGradient
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-12 h-full flex flex-col">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-4">
            Choose Your Destiny
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every legendary card begins with a vision. Select your realm and let the magic unfold.
          </p>
        </motion.div>

        {/* Sound Toggle */}
        <motion.div
          className="absolute top-6 right-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="bg-background/80 backdrop-blur-sm border-white/10"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </motion.div>

        {/* Categories Grid */}
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            {categories.map((category, index) => {
              const isSelected = selectedCategory === category.id;
              const isHovered = hoveredCategory === category.id;

              return (
                <motion.div
                  key={category.id}
                  className="relative"
                  initial={{ 
                    opacity: 0, 
                    y: 100, 
                    rotateX: -30,
                    scale: 0.8
                  }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    rotateX: 0,
                    scale: isSelected ? 1.1 : 1
                  }}
                  transition={{
                    duration: 0.8,
                    delay: getStaggerDelay(index),
                    type: "spring",
                    stiffness: 100
                  }}
                  onHoverStart={() => setHoveredCategory(category.id)}
                  onHoverEnd={() => setHoveredCategory(null)}
                  whileHover={{ scale: 1.05, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className={`relative group cursor-pointer overflow-hidden rounded-2xl border-2 transition-all duration-500 ${
                      isSelected 
                        ? 'border-primary shadow-2xl shadow-primary/25' 
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} transition-opacity duration-500 ${
                      isHovered || isSelected ? 'opacity-100' : 'opacity-50'
                    }`} />

                    {/* Glass Effect */}
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

                    {/* Content */}
                    <div className="relative p-8 h-64 flex flex-col items-center justify-center text-center">
                      {/* Icon */}
                      <motion.div
                        className="mb-6"
                        style={{ color: category.color }}
                        animate={{
                          scale: isHovered ? [1, 1.2, 1] : 1,
                          rotate: isSelected ? [0, 360] : 0
                        }}
                        transition={{
                          scale: { duration: 0.6 },
                          rotate: { duration: 1 }
                        }}
                      >
                        {category.icon}
                      </motion.div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-foreground mb-3">
                        {category.name}
                      </h3>

                      {/* Description */}
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {category.description}
                      </p>

                      {/* Popularity Indicator */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          <span>{category.popularity}% popular</span>
                        </div>
                      </div>

                      {/* Selection Effect */}
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 border-2 border-primary rounded-2xl"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                      )}
                    </div>

                    {/* Hover Ripple Effect */}
                    {isHovered && (
                      <motion.div
                        className="absolute inset-0 bg-white/5"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.2, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};