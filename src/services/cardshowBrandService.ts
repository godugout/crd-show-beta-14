
import { supabase } from '@/integrations/supabase/client';

// Temporary type definitions until Supabase types are regenerated
interface CardshowBrandRow {
  id: string;
  dna_code: string;
  file_name: string;
  display_name: string;
  product_name?: string;
  image_url: string;
  thumbnail_url?: string;
  file_size?: number;
  image_dimensions?: any;
  category: string;
  group_type?: string;
  font_style: string;
  design_elements: string[];
  style_tags: string[];
  color_palette: string[];
  primary_color: string;
  secondary_color: string;
  tertiary_color?: string;
  quaternary_color?: string;
  logo_theme: any;
  theme_usage: any;
  team_code?: string;
  team_name?: string;
  team_city?: string;
  league?: string;
  mascot?: string;
  founded_year?: number;
  decade?: string;
  rarity: string;
  power_level: number;
  unlock_method: string;
  collectibility_score: number;
  is_blendable: boolean;
  is_remixable: boolean;
  total_supply?: number;
  current_supply: number;
  drop_rate: number;
  description?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  is_active: boolean;
  sort_order: number;
}

interface BrandUsageStatsRow {
  id: string;
  brand_id: string;
  user_id?: string;
  usage_count: number;
  last_used_at: string;
  usage_context?: string;
  created_at: string;
  updated_at: string;
}

export type { CardshowBrandRow as CardshowBrand, BrandUsageStatsRow as BrandUsageStats };

export type CreateBrandRequest = Omit<CardshowBrandRow, 'id' | 'created_at' | 'updated_at' | 'current_supply' | 'is_active' | 'sort_order'>;

export type BrandMintingRules = {
  id: string;
  brand_id: string;
  requires_achievement?: string;
  seasonal_only: boolean;
  requires_purchase: boolean;
  pack_exclusive: boolean;
  special_requirements: any;
  created_at: string;
};

export class CardshowBrandService {
  // Fetch all active brands
  static async getAllBrands(): Promise<CardshowBrandRow[]> {
    try {
      const { data, error } = await supabase
        .from('cardshow_brands')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching brands:', error);
        return [];
      }

      return (data || []) as CardshowBrandRow[];
    } catch (error) {
      console.error('Error in getAllBrands:', error);
      return [];
    }
  }

  // Fetch brand by DNA code
  static async getBrandByDnaCode(dnaCode: string): Promise<CardshowBrandRow | null> {
    try {
      const { data, error } = await supabase
        .from('cardshow_brands')
        .select('*')
        .eq('dna_code', dnaCode)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching brand by DNA code:', error);
        return null;
      }

      return data as CardshowBrandRow;
    } catch (error) {
      console.error('Error in getBrandByDnaCode:', error);
      return null;
    }
  }

  // Search brands by category, team, or tags
  static async searchBrands(params: {
    category?: string;
    group_type?: string;
    team_code?: string;
    rarity?: string;
    search_term?: string;
  }): Promise<CardshowBrandRow[]> {
    try {
      let query = supabase
        .from('cardshow_brands')
        .select('*')
        .eq('is_active', true);

      if (params.category) {
        query = query.eq('category', params.category);
      }

      if (params.group_type) {
        query = query.eq('group_type', params.group_type);
      }

      if (params.team_code) {
        query = query.eq('team_code', params.team_code);
      }

      if (params.rarity) {
        query = query.eq('rarity', params.rarity);
      }

      if (params.search_term) {
        query = query.or(`display_name.ilike.%${params.search_term}%,team_name.ilike.%${params.search_term}%,dna_code.ilike.%${params.search_term}%`);
      }

      const { data, error } = await query.order('sort_order', { ascending: true });

      if (error) {
        console.error('Error searching brands:', error);
        return [];
      }

      return (data || []) as CardshowBrandRow[];
    } catch (error) {
      console.error('Error in searchBrands:', error);
      return [];
    }
  }

  // Create a new brand (admin only)
  static async createBrand(brandData: CreateBrandRequest): Promise<CardshowBrandRow | null> {
    try {
      const insertData = {
        ...brandData,
        font_style: brandData.font_style || 'Unknown',
        design_elements: brandData.design_elements || [],
        style_tags: brandData.style_tags || [],
        power_level: brandData.power_level || 50,
        unlock_method: brandData.unlock_method || 'starter',
        collectibility_score: brandData.collectibility_score || 50,
        is_blendable: brandData.is_blendable !== undefined ? brandData.is_blendable : true,
        is_remixable: brandData.is_remixable !== undefined ? brandData.is_remixable : true,
        current_supply: 0,
        drop_rate: brandData.drop_rate || 0.5,
        is_active: true,
        sort_order: 0
      };

      const { data, error } = await supabase
        .from('cardshow_brands')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Error creating brand:', error);
        return null;
      }

      return data as CardshowBrandRow;
    } catch (error) {
      console.error('Error in createBrand:', error);
      return null;
    }
  }

  // Update brand usage statistics
  static async trackBrandUsage(brandId: string, userId: string, context: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('brand_usage_stats')
        .upsert({
          brand_id: brandId,
          user_id: userId,
          usage_context: context,
          usage_count: 1,
          last_used_at: new Date().toISOString()
        }, {
          onConflict: 'brand_id,user_id,usage_context'
        });

      if (error) {
        console.error('Error tracking brand usage:', error);
      }
    } catch (error) {
      console.error('Error in trackBrandUsage:', error);
      // Don't throw - usage tracking is non-critical
    }
  }

  // Get brand usage statistics
  static async getBrandUsageStats(brandId: string): Promise<BrandUsageStatsRow[]> {
    try {
      const { data, error } = await supabase
        .from('brand_usage_stats')
        .select('*')
        .eq('brand_id', brandId);

      if (error) {
        console.error('Error fetching brand usage stats:', error);
        return [];
      }

      return (data || []) as BrandUsageStatsRow[];
    } catch (error) {
      console.error('Error in getBrandUsageStats:', error);
      return [];
    }
  }

  // Get brands by rarity for gaming mechanics
  static async getBrandsByRarity(rarity: string): Promise<CardshowBrandRow[]> {
    try {
      const { data, error } = await supabase
        .from('cardshow_brands')
        .select('*')
        .eq('rarity', rarity)
        .eq('is_active', true)
        .order('collectibility_score', { ascending: false });

      if (error) {
        console.error('Error fetching brands by rarity:', error);
        return [];
      }

      return (data || []) as CardshowBrandRow[];
    } catch (error) {
      console.error('Error in getBrandsByRarity:', error);
      return [];
    }
  }

  // Get collectible brands (limited supply)
  static async getCollectibleBrands(): Promise<CardshowBrandRow[]> {
    try {
      const { data, error } = await supabase
        .from('cardshow_brands')
        .select('*')
        .not('total_supply', 'is', null)
        .eq('is_active', true)
        .order('rarity', { ascending: false });

      if (error) {
        console.error('Error fetching collectible brands:', error);
        return [];
      }

      return (data || []) as CardshowBrandRow[];
    } catch (error) {
      console.error('Error in getCollectibleBrands:', error);
      return [];
    }
  }
}
