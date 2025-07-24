
export interface TemplateCreator {
  id: string;
  name: string;
  avatar_url?: string;
  verified: boolean;
}

export interface ColorVariation {
  id: string;
  name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'sports' | 'entertainment' | 'business' | 'gaming' | 'custom';
  tags: string[];
  thumbnail_url: string;
  preview_url: string;
  creator_info: TemplateCreator;
  popularity_score: number;
  download_count: number;
  is_premium: boolean;
  price?: number;
  is_trending: boolean;
  is_new: boolean;
  compatibility_tags: ('portrait' | 'landscape' | 'action' | 'closeup' | 'group')[];
  color_variations: ColorVariation[];
  created_at: string;
  updated_at: string;
}

export interface TemplateFilters {
  category: string;
  search: string;
  colorScheme: string;
  style: string;
  sortBy: 'popular' | 'newest' | 'best_match' | 'price';
  showOnlyFree: boolean;
  showOnlyPremium: boolean;
}

export interface AIRecommendation {
  template_id: string;
  confidence_score: number;
  reason: string;
  match_type: 'photo_analysis' | 'user_history' | 'popularity' | 'category_preference';
}
