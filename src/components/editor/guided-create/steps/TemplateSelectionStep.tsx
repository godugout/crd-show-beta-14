import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Star, Crown, Zap } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
  preview: string;
  isPremium: boolean;
  rating: number;
  description: string;
}

// Mock templates
const mockTemplates: Template[] = [
  {
    id: 'sports-modern',
    name: 'Modern Sports',
    category: 'Sports',
    preview: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=300&h=400&fit=crop',
    isPremium: false,
    rating: 4.8,
    description: 'Clean, modern design perfect for sports cards'
  },
  {
    id: 'fantasy-epic',
    name: 'Epic Fantasy',
    category: 'Fantasy',
    preview: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
    isPremium: true,
    rating: 4.9,
    description: 'Mystical design with magical elements'
  },
  {
    id: 'retro-gaming',
    name: 'Retro Gaming',
    category: 'Gaming',
    preview: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=400&fit=crop',
    isPremium: false,
    rating: 4.7,
    description: 'Nostalgic 8-bit inspired design'
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    category: 'Modern',
    preview: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300&h=400&fit=crop',
    isPremium: false,
    rating: 4.6,
    description: 'Simple, clean design that focuses on content'
  },
  {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    category: 'Futuristic',
    preview: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop',
    isPremium: true,
    rating: 4.9,
    description: 'Cyberpunk-inspired with neon accents'
  },
  {
    id: 'vintage-classic',
    name: 'Vintage Classic',
    category: 'Classic',
    preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
    isPremium: false,
    rating: 4.5,
    description: 'Timeless vintage design with ornate details'
  }
];

interface TemplateSelectionStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

export const TemplateSelectionStep: React.FC<TemplateSelectionStepProps> = ({
  data,
  onUpdate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(mockTemplates.map(t => t.category)))];

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template: Template) => {
    onUpdate({ selectedTemplate: template });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                data.selectedTemplate?.id === template.id 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : ''
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="relative">
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
                {template.isPremium && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded text-sm">
                  <Star className="w-3 h-3 fill-current" />
                  {template.rating}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{template.name}</h3>
                  <Badge variant="secondary">{template.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Selected Template Preview */}
      {data.selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-4">
              <img
                src={data.selectedTemplate.preview}
                alt={data.selectedTemplate.name}
                className="w-20 h-28 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2">
                  Selected: {data.selectedTemplate.name}
                </h4>
                <p className="text-muted-foreground mb-3">
                  {data.selectedTemplate.description}
                </p>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">{data.selectedTemplate.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current text-yellow-500" />
                    <span className="text-sm">{data.selectedTemplate.rating}</span>
                  </div>
                  {data.selectedTemplate.isPremium && (
                    <Badge className="bg-yellow-500">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => onUpdate({ selectedTemplate: null })}
              >
                Change
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or category filter
          </p>
        </div>
      )}
    </div>
  );
};