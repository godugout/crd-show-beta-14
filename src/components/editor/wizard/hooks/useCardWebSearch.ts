
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface CardSearchResult {
  title: string;
  description: string;
  type: string;
  series: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary';
  tags: string[];
  confidence: number;
}

export const useCardWebSearch = () => {
  const [isSearching, setIsSearching] = useState(false);

  const searchCardInfo = async (imageUrl: string): Promise<CardSearchResult | null> => {
    setIsSearching(true);
    
    try {
      console.log('Starting web scrape analysis...');
      
      // Use the new web scraping approach
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('web-scrape-card-analysis', {
        body: { imageData: imageUrl }
      });

      if (analysisError) {
        console.error('Web scrape analysis error:', analysisError);
        toast.error('Web search analysis failed');
        return null;
      }

      const imageAnalysis = analysisData || {
        extractedText: [],
        playerName: 'Unknown Discovery',
        confidence: 0.3,
        analysisType: 'fallback',
        creativeTitle: 'Web Search Result',
        creativeDescription: 'Discovered through image search'
      };

      console.log('Web scrape analysis result:', imageAnalysis);

      // Generate enhanced card information using the search results
      const { data: searchData, error: searchError } = await supabase.functions.invoke('search-card-info', {
        body: { 
          query: imageAnalysis.creativeTitle || 'Web Discovery',
          extractedData: imageAnalysis
        }
      });

      if (searchError && !searchData) {
        console.error('Card info generation error:', searchError);
        toast.info('Generated card from web search results');
      }

      const result = searchData || { success: true, cardInfo: null };
      const cardInfo = result.cardInfo;

      if (!cardInfo) {
        toast.info('Generated basic card from web search');
        return {
          title: imageAnalysis.creativeTitle || 'Web Discovery',
          description: imageAnalysis.creativeDescription || 'A unique card discovered through web search.',
          type: 'Discovery',
          series: 'Web Search Collection',
          rarity: 'uncommon',
          tags: ['web-search', 'discovery', 'unique'],
          confidence: imageAnalysis.confidence || 0.3
        };
      }

      const confidencePercentage = Math.round(cardInfo.confidence * 100);
      
      if (imageAnalysis.searchResults && imageAnalysis.searchResults.length > 0) {
        toast.success(`Found ${imageAnalysis.searchResults.length} web results with ${confidencePercentage}% confidence!`);
      } else {
        toast.success(`Card generated with ${confidencePercentage}% confidence!`);
      }
      
      return {
        title: cardInfo.title,
        description: cardInfo.description,
        type: cardInfo.type,
        series: cardInfo.series,
        rarity: cardInfo.rarity,
        tags: cardInfo.tags,
        confidence: cardInfo.confidence
      };
      
    } catch (error) {
      console.error('Card search error:', error);
      toast.info('Generated fallback card from analysis');
      
      return {
        title: 'Web Search Discovery',
        description: 'A distinctive card discovered through web image search with potential for unique identification.',
        type: 'Discovery',
        series: 'Search Collection',
        rarity: 'uncommon',
        tags: ['web-search', 'discovery', 'unique', 'mystery'],
        confidence: 0.4
      };
    } finally {
      setIsSearching(false);
    }
  };

  const searchByText = async (query: string): Promise<CardSearchResult[]> => {
    setIsSearching(true);
    
    try {
      console.log('Searching by text query:', query);
      
      const { data: searchData, error: searchError } = await supabase.functions.invoke('search-card-info', {
        body: { 
          query,
          extractedData: { 
            extractedText: [query], 
            confidence: 0.8,
            analysisType: 'traditional',
            playerName: query,
            team: '',
            year: '',
            sport: 'General',
            cardNumber: ''
          }
        }
      });

      if (searchError && !searchData) {
        console.error('Text search error:', searchError);
        toast.info('Generated creative card concept from search terms');
      }

      const result = searchData || { success: true, cardInfo: null };
      const cardInfo = result.cardInfo;

      if (!cardInfo) {
        return [{
          title: `${query} Card`,
          description: `A unique trading card featuring ${query} with distinctive characteristics and collectible appeal.`,
          type: 'General',
          series: 'Search Collection',
          rarity: 'common',
          tags: query.toLowerCase().split(' ').filter(tag => tag.length > 2),
          confidence: 0.6
        }];
      }

      return [{
        title: cardInfo.title,
        description: cardInfo.description,
        type: cardInfo.type,
        series: cardInfo.series,
        rarity: cardInfo.rarity,
        tags: cardInfo.tags,
        confidence: cardInfo.confidence
      }];
      
    } catch (error) {
      console.error('Text search error:', error);
      toast.info('Generated creative card from search terms');
      
      return [{
        title: `${query} Creation`,
        description: `An imaginative card concept inspired by "${query}" with unique design elements and web-based discovery.`,
        type: 'Creative',
        series: 'Concept Collection',
        rarity: 'uncommon',
        tags: [...query.toLowerCase().split(' ').filter(tag => tag.length > 2), 'creative', 'concept'],
        confidence: 0.5
      }];
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchCardInfo,
    searchByText,
    isSearching
  };
};
