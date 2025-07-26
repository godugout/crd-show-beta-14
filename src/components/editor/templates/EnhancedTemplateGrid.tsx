import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CRDButton } from '@/components/ui/design-system/Button';
import { 
  Star, 
  Crown, 
  Zap, 
  Sparkles, 
  Trophy, 
  Shield,
  Eye,
  Download,
  Heart,
  Lock
} from 'lucide-react';

interface TemplateCard {
  id: string;
  name: string;
  category: 'sports' | 'fantasy' | 'modern' | 'vintage' | 'premium';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  preview: string;
  description: string;
  tags: string[];
  downloads: number;
  likes: number;
  isPremium: boolean;
  features: string[];
}

const ENHANCED_TEMPLATES: TemplateCard[] = [
  {
    id: 'modern-athlete',
    name: 'Modern Athlete',
    category: 'sports',
    rarity: 'common',
    preview: '/api/placeholder/300/400',
    description: 'Clean, modern design perfect for contemporary sports cards',
    tags: ['sports', 'clean', 'modern'],
    downloads: 1250,
    likes: 89,
    isPremium: false,
    features: ['High-res exports', 'Multiple layouts', 'Custom colors']
  },
  {
    id: 'legendary-hero',
    name: 'Legendary Hero',
    category: 'fantasy',
    rarity: 'legendary',
    preview: '/api/placeholder/300/400',
    description: 'Epic fantasy design with magical effects and ornate borders',
    tags: ['fantasy', 'epic', 'ornate'],
    downloads: 2100,
    likes: 156,
    isPremium: true,
    features: ['Animated effects', 'Foil simulation', 'Custom particles']
  },
  {
    id: 'cyber-warrior',
    name: 'Cyber Warrior',
    category: 'modern',
    rarity: 'epic',
    preview: '/api/placeholder/300/400',
    description: 'Futuristic cyberpunk aesthetic with neon accents',
    tags: ['cyberpunk', 'neon', 'futuristic'],
    downloads: 890,
    likes: 134,
    isPremium: true,
    features: ['Neon effects', 'Glitch animations', 'Holo patterns']
  },
  {
    id: 'vintage-classic',
    name: 'Vintage Classic',
    category: 'vintage',
    rarity: 'uncommon',
    preview: '/api/placeholder/300/400',
    description: 'Nostalgic design inspired by classic trading cards',
    tags: ['vintage', 'classic', 'retro'],
    downloads: 756,
    likes: 92,
    isPremium: false,
    features: ['Vintage filters', 'Classic fonts', 'Aged effects']
  },
  {
    id: 'holographic-elite',
    name: 'Holographic Elite',
    category: 'premium',
    rarity: 'legendary',
    preview: '/api/placeholder/300/400',
    description: 'Premium holographic effects with rainbow patterns',
    tags: ['premium', 'holographic', 'rainbow'],
    downloads: 3200,
    likes: 267,
    isPremium: true,
    features: ['Holographic effects', 'Rainbow gradients', 'Premium borders']
  },
  {
    id: 'minimalist-pro',
    name: 'Minimalist Pro',
    category: 'modern',
    rarity: 'rare',
    preview: '/api/placeholder/300/400',
    description: 'Clean minimalist design for professional presentations',
    tags: ['minimalist', 'professional', 'clean'],
    downloads: 1450,
    likes: 108,
    isPremium: false,
    features: ['Minimal design', 'Professional layouts', 'Clean typography']
  }
];

const getRarityIcon = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return <Crown className="w-4 h-4 text-yellow-400" />;
    case 'epic': return <Sparkles className="w-4 h-4 text-purple-400" />;
    case 'rare': return <Star className="w-4 h-4 text-blue-400" />;
    case 'uncommon': return <Shield className="w-4 h-4 text-green-400" />;
    default: return <Trophy className="w-4 h-4 text-gray-400" />;
  }
};

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/40';
    case 'epic': return 'from-purple-500/20 to-pink-500/20 border-purple-500/40';
    case 'rare': return 'from-blue-500/20 to-cyan-500/20 border-blue-500/40';
    case 'uncommon': return 'from-green-500/20 to-emerald-500/20 border-green-500/40';
    default: return 'from-gray-500/20 to-slate-500/20 border-gray-500/40';
  }
};

interface EnhancedTemplateGridProps {
  onTemplateSelect: (template: TemplateCard) => void;
  selectedTemplate?: string;
  category?: string;
  searchQuery?: string;
}

export const EnhancedTemplateGrid: React.FC<EnhancedTemplateGridProps> = ({
  onTemplateSelect,
  selectedTemplate,
  category = 'all',
  searchQuery = ''
}) => {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [likedTemplates, setLikedTemplates] = useState<Set<string>>(new Set());

  const filteredTemplates = ENHANCED_TEMPLATES.filter(template => {
    const matchesCategory = category === 'all' || template.category === category;
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const handleLike = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedTemplates(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(templateId)) {
        newLiked.delete(templateId);
      } else {
        newLiked.add(templateId);
      }
      return newLiked;
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTemplates.map((template) => (
        <Card
          key={template.id}
          className={`group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1
            bg-gradient-to-br ${getRarityColor(template.rarity)} backdrop-blur-sm
            ${selectedTemplate === template.id ? 'ring-2 ring-crd-green shadow-lg shadow-crd-green/20' : ''}
            hover:shadow-xl hover:shadow-black/20`}
          onMouseEnter={() => setHoveredTemplate(template.id)}
          onMouseLeave={() => setHoveredTemplate(null)}
          onClick={() => onTemplateSelect(template)}
        >
          <CardContent className="p-0">
            {/* Preview Image */}
            <div className="relative aspect-[3/4] bg-gradient-to-br from-crd-darker to-crd-darkest rounded-t-lg overflow-hidden">
              <img
                src={template.preview}
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              {/* Premium Badge */}
              {template.isPremium && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                </div>
              )}

              {/* Rarity Badge */}
              <div className="absolute top-3 right-3">
                <Badge className="bg-black/60 text-white backdrop-blur-sm">
                  {getRarityIcon(template.rarity)}
                  <span className="ml-1 capitalize">{template.rarity}</span>
                </Badge>
              </div>

              {/* Hover Actions */}
              {hoveredTemplate === template.id && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 animate-fade-in">
                  <CRDButton
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle preview
                    }}
                    className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                  >
                    <Eye className="w-4 h-4" />
                  </CRDButton>
                  <CRDButton
                    variant="primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTemplateSelect(template);
                    }}
                  >
                    Use Template
                  </CRDButton>
                </div>
              )}
            </div>

            {/* Template Info */}
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-crd-white group-hover:text-crd-green transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-crd-lightGray line-clamp-2">
                    {template.description}
                  </p>
                </div>
              </div>

              {/* Stats and Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-crd-mediumGray/20">
                <div className="flex items-center gap-4 text-sm text-crd-lightGray">
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {template.downloads.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className={`w-3 h-3 ${likedTemplates.has(template.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    {template.likes + (likedTemplates.has(template.id) ? 1 : 0)}
                  </span>
                </div>

                <button
                  onClick={(e) => handleLike(template.id, e)}
                  className={`p-1 rounded-full transition-colors ${
                    likedTemplates.has(template.id) 
                      ? 'text-red-500 hover:text-red-400' 
                      : 'text-crd-lightGray hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedTemplates.has(template.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-1">
                {template.features.slice(0, 2).map((feature, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="text-xs text-crd-lightGray border-crd-mediumGray/40"
                  >
                    {feature}
                  </Badge>
                ))}
                {template.features.length > 2 && (
                  <Badge 
                    variant="outline" 
                    className="text-xs text-crd-lightGray border-crd-mediumGray/40"
                  >
                    +{template.features.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};