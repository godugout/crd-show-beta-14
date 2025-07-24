
import type { Template } from '../types/templateTypes';

export const mockTemplates: Template[] = [
  {
    id: 'sports-athlete-pro',
    name: 'Athlete Pro',
    description: 'Professional sports card template with dynamic stats layout',
    category: 'sports',
    tags: ['professional', 'stats', 'athletic', 'modern'],
    thumbnail_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&h=420&fit=crop',
    preview_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=800&fit=crop',
    creator_info: {
      id: 'creator-1',
      name: 'SportsDesign Pro',
      verified: true
    },
    popularity_score: 95,
    download_count: 12847,
    is_premium: true,
    price: 4.99,
    is_trending: true,
    is_new: false,
    compatibility_tags: ['portrait', 'action'],
    color_variations: [
      {
        id: 'var-1',
        name: 'Championship Gold',
        primary_color: '#FFD700',
        secondary_color: '#1a1a2e',
        accent_color: '#FF6B35',
        background_color: '#0f0f23'
      },
      {
        id: 'var-2',
        name: 'Victory Blue',
        primary_color: '#4A90E2',
        secondary_color: '#2C3E50',
        accent_color: '#E74C3C',
        background_color: '#1A252F'
      }
    ],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-06-20T14:30:00Z'
  },
  {
    id: 'entertainment-celebrity',
    name: 'Celebrity Spotlight',
    description: 'Glamorous template perfect for entertainment personalities',
    category: 'entertainment',
    tags: ['glamour', 'celebrity', 'spotlight', 'premium'],
    thumbnail_url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=420&fit=crop',
    preview_url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=800&fit=crop',
    creator_info: {
      id: 'creator-2',
      name: 'Hollywood Studios',
      verified: true
    },
    popularity_score: 88,
    download_count: 8934,
    is_premium: true,
    price: 6.99,
    is_trending: false,
    is_new: true,
    compatibility_tags: ['portrait', 'closeup'],
    color_variations: [
      {
        id: 'var-3',
        name: 'Red Carpet',
        primary_color: '#DC143C',
        secondary_color: '#000000',
        accent_color: '#FFD700',
        background_color: '#1a1a1a'
      }
    ],
    created_at: '2024-06-01T09:00:00Z',
    updated_at: '2024-06-25T16:45:00Z'
  },
  {
    id: 'business-executive',
    name: 'Executive Profile',
    description: 'Professional business card template for corporate leaders',
    category: 'business',
    tags: ['professional', 'corporate', 'executive', 'clean'],
    thumbnail_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=420&fit=crop',
    preview_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
    creator_info: {
      id: 'creator-3',
      name: 'CorpDesign',
      verified: false
    },
    popularity_score: 72,
    download_count: 4567,
    is_premium: false,
    is_trending: false,
    is_new: false,
    compatibility_tags: ['portrait', 'closeup'],
    color_variations: [
      {
        id: 'var-4',
        name: 'Corporate Blue',
        primary_color: '#2E4BC6',
        secondary_color: '#FFFFFF',
        accent_color: '#6C7B7F',
        background_color: '#F8F9FA'
      }
    ],
    created_at: '2023-11-20T11:30:00Z',
    updated_at: '2024-03-15T13:20:00Z'
  },
  {
    id: 'gaming-esports',
    name: 'eSports Champion',
    description: 'Dynamic gaming template with neon effects and futuristic design',
    category: 'gaming',
    tags: ['esports', 'gaming', 'neon', 'futuristic', 'competitive'],
    thumbnail_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=420&fit=crop',
    preview_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=800&fit=crop',
    creator_info: {
      id: 'creator-4',
      name: 'GameDesign Elite',
      verified: true
    },
    popularity_score: 91,
    download_count: 15632,
    is_premium: true,
    price: 7.99,
    is_trending: true,
    is_new: false,
    compatibility_tags: ['portrait', 'action'],
    color_variations: [
      {
        id: 'var-5',
        name: 'Cyber Neon',
        primary_color: '#00FF41',
        secondary_color: '#0D1117',
        accent_color: '#FF0080',
        background_color: '#000000'
      }
    ],
    created_at: '2024-02-10T14:00:00Z',
    updated_at: '2024-06-18T10:15:00Z'
  },
  {
    id: 'custom-vintage',
    name: 'Vintage Classic',
    description: 'Timeless vintage design with classic typography and borders',
    category: 'custom',
    tags: ['vintage', 'classic', 'retro', 'timeless'],
    thumbnail_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=420&fit=crop',
    preview_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=800&fit=crop',
    creator_info: {
      id: 'creator-5',
      name: 'RetroStudio',
      verified: false
    },
    popularity_score: 76,
    download_count: 6891,
    is_premium: false,
    is_trending: false,
    is_new: false,
    compatibility_tags: ['portrait', 'landscape'],
    color_variations: [
      {
        id: 'var-6',
        name: 'Sepia Tone',
        primary_color: '#8B4513',
        secondary_color: '#F5DEB3',
        accent_color: '#D2691E',
        background_color: '#FFF8DC'
      }
    ],
    created_at: '2023-08-05T16:45:00Z',
    updated_at: '2024-01-10T09:00:00Z'
  },
  // Add more templates...
  {
    id: 'sports-team-spirit',
    name: 'Team Spirit',
    description: 'Show your team pride with this dynamic sports template',
    category: 'sports',
    tags: ['team', 'spirit', 'dynamic', 'colorful'],
    thumbnail_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=420&fit=crop',
    preview_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=800&fit=crop',
    creator_info: { id: 'creator-6', name: 'TeamDesign', verified: false },
    popularity_score: 83,
    download_count: 7234,
    is_premium: false,
    is_trending: false,
    is_new: true,
    compatibility_tags: ['action', 'group'],
    color_variations: [
      {
        id: 'var-7',
        name: 'Team Colors',
        primary_color: '#FF4500',
        secondary_color: '#0066CC',
        accent_color: '#FFFFFF',
        background_color: '#1a1a2e'
      }
    ],
    created_at: '2024-05-20T08:30:00Z',
    updated_at: '2024-06-20T12:00:00Z'
  }
  // Continue with more templates for each category...
];

export const getTemplatesByCategory = (category: string) => {
  if (category === 'all') return mockTemplates;
  return mockTemplates.filter(template => template.category === category);
};

export const searchTemplates = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return mockTemplates.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getAIRecommendations = () => {
  // Mock AI recommendations based on popularity and trending status
  return mockTemplates
    .filter(template => template.is_trending || template.popularity_score > 85)
    .slice(0, 3)
    .map(template => ({
      template_id: template.id,
      confidence_score: Math.random() * 0.3 + 0.7, // 70-100%
      reason: template.is_trending ? 'Trending in your category' : 'Highly rated by users',
      match_type: 'popularity' as const
    }));
};
