
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  imageUrl?: string;
  source: string;
  relevanceScore: number;
}

interface TempCardData {
  names: string[];
  descriptions: string[];
  contexts: string[];
  sources: string[];
  confidence: number;
}

// Search multiple engines for image-based results
async function performImageSearch(imageUrl: string): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  
  try {
    // Use Bing reverse image search (more reliable than Google for programmatic access)
    const bingResults = await searchBingImages(imageUrl);
    results.push(...bingResults);
    
    // Add TinEye reverse search
    const tineyeResults = await searchTinEye(imageUrl);
    results.push(...tineyeResults);
    
    // Add Yandex reverse search (good for people identification)
    const yandexResults = await searchYandex(imageUrl);
    results.push(...yandexResults);
    
  } catch (error) {
    console.error('Image search failed:', error);
  }
  
  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

async function searchBingImages(imageUrl: string): Promise<SearchResult[]> {
  try {
    // Bing Visual Search API approach
    const searchQuery = `imageUrl:${encodeURIComponent(imageUrl)}`;
    const bingUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(searchQuery)}&form=QBIR`;
    
    const response = await fetch(bingUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) return [];
    
    const html = await response.text();
    return parseImageSearchResults(html, 'bing');
  } catch (error) {
    console.error('Bing search failed:', error);
    return [];
  }
}

async function searchTinEye(imageUrl: string): Promise<SearchResult[]> {
  try {
    const tineyeUrl = `https://tineye.com/search?url=${encodeURIComponent(imageUrl)}`;
    
    const response = await fetch(tineyeUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) return [];
    
    const html = await response.text();
    return parseImageSearchResults(html, 'tineye');
  } catch (error) {
    console.error('TinEye search failed:', error);
    return [];
  }
}

async function searchYandex(imageUrl: string): Promise<SearchResult[]> {
  try {
    const yandexUrl = `https://yandex.com/images/search?url=${encodeURIComponent(imageUrl)}&rpt=imageview`;
    
    const response = await fetch(yandexUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) return [];
    
    const html = await response.text();
    return parseImageSearchResults(html, 'yandex');
  } catch (error) {
    console.error('Yandex search failed:', error);
    return [];
  }
}

function parseImageSearchResults(html: string, source: string): SearchResult[] {
  const results: SearchResult[] = [];
  
  try {
    // Extract titles and snippets using regex (basic HTML parsing)
    const titleRegex = /<title[^>]*>([^<]+)<\/title>/gi;
    const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
    const snippetRegex = /<p[^>]*>([^<]+)<\/p>/gi;
    
    let titleMatch;
    let linkMatch;
    let snippetMatch;
    
    // Extract titles
    const titles = [];
    while ((titleMatch = titleRegex.exec(html)) !== null) {
      titles.push(titleMatch[1].trim());
    }
    
    // Extract links and text
    const links = [];
    while ((linkMatch = linkRegex.exec(html)) !== null) {
      links.push({
        url: linkMatch[1],
        text: linkMatch[2].trim()
      });
    }
    
    // Extract snippets
    const snippets = [];
    while ((snippetMatch = snippetRegex.exec(html)) !== null) {
      snippets.push(snippetMatch[1].trim());
    }
    
    // Combine results
    for (let i = 0; i < Math.min(titles.length, links.length, 10); i++) {
      if (titles[i] && links[i] && titles[i].length > 3) {
        results.push({
          title: titles[i],
          snippet: snippets[i] || '',
          url: links[i].url,
          source: source,
          relevanceScore: calculateRelevanceScore(titles[i], snippets[i] || '')
        });
      }
    }
  } catch (error) {
    console.error(`Failed to parse ${source} results:`, error);
  }
  
  return results;
}

function calculateRelevanceScore(title: string, snippet: string): number {
  let score = 0;
  
  // Higher scores for person names (common patterns)
  const personPatterns = [
    /\b[A-Z][a-z]+ [A-Z][a-z]+\b/, // First Last
    /\b(Mr|Ms|Mrs|Dr|Prof)\. [A-Z][a-z]+/, // Titles
    /\b(actor|actress|singer|musician|athlete|player|character)\b/i,
    /\b(portrait|photo|picture|image) of\b/i
  ];
  
  personPatterns.forEach(pattern => {
    if (pattern.test(title) || pattern.test(snippet)) {
      score += 10;
    }
  });
  
  // Score for card-related terms
  const cardTerms = ['card', 'trading', 'collectible', 'pokemon', 'yugioh', 'magic', 'sports'];
  cardTerms.forEach(term => {
    if (title.toLowerCase().includes(term) || snippet.toLowerCase().includes(term)) {
      score += 5;
    }
  });
  
  // Length bonus (more detailed = better)
  score += Math.min(title.length / 20, 5);
  score += Math.min(snippet.length / 50, 5);
  
  return score;
}

async function buildTempDatabase(searchResults: SearchResult[]): Promise<TempCardData> {
  const tempData: TempCardData = {
    names: [],
    descriptions: [],
    contexts: [],
    sources: [],
    confidence: 0
  };
  
  // Store in temporary table for processing
  const { error } = await supabase
    .from('temp_card_analysis')
    .insert(
      searchResults.map(result => ({
        title: result.title,
        snippet: result.snippet,
        url: result.url,
        source: result.source,
        relevance_score: result.relevanceScore,
        session_id: crypto.randomUUID()
      }))
    );
  
  if (error) {
    console.warn('Failed to store temp data:', error);
  }
  
  // Extract names and descriptions
  searchResults.forEach(result => {
    // Extract potential names
    const nameMatches = result.title.match(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g);
    if (nameMatches) {
      tempData.names.push(...nameMatches);
    }
    
    // Store descriptions
    if (result.snippet) {
      tempData.descriptions.push(result.snippet);
    }
    
    // Store context
    tempData.contexts.push(`${result.source}: ${result.title}`);
    tempData.sources.push(result.url);
  });
  
  // Calculate confidence based on result quality
  const highQualityResults = searchResults.filter(r => r.relevanceScore > 15);
  tempData.confidence = Math.min(highQualityResults.length / 3, 1.0);
  
  return tempData;
}

async function generateCardInfo(tempData: TempCardData): Promise<any> {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  // Find most common name
  const nameCounts = tempData.names.reduce((acc, name) => {
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostCommonName = Object.entries(nameCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0];
  
  // Combine best descriptions
  const bestDescriptions = tempData.descriptions
    .filter(desc => desc.length > 20)
    .slice(0, 3)
    .join(' ');
  
  if (!OPENAI_API_KEY) {
    // Fallback without AI
    return {
      title: mostCommonName || 'Identified Person',
      description: bestDescriptions || 'Person identified through web search',
      rarity: tempData.confidence > 0.7 ? 'rare' : 'common',
      tags: [...new Set(tempData.names.slice(0, 3))],
      type: 'Character',
      series: 'Web Search Collection',
      confidence: tempData.confidence
    };
  }
  
  // Use AI to enhance the data
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a trading card expert. Create engaging card information based on web search results.'
          },
          {
            role: 'user',
            content: `Based on these web search results, create a trading card:

Most likely name: ${mostCommonName || 'Unknown'}
Descriptions found: ${bestDescriptions}
Context: ${tempData.contexts.slice(0, 3).join('; ')}

Create a JSON response with: title, description, rarity, tags, type, series, confidence`
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      })
    });
    
    const result = await response.json();
    const aiContent = result.choices?.[0]?.message?.content;
    
    if (aiContent) {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const aiData = JSON.parse(jsonMatch[0]);
        return {
          ...aiData,
          confidence: Math.max(tempData.confidence, aiData.confidence || 0)
        };
      }
    }
  } catch (error) {
    console.error('AI enhancement failed:', error);
  }
  
  // Fallback response
  return {
    title: mostCommonName || 'Web Search Discovery',
    description: bestDescriptions || 'Person discovered through image search',
    rarity: tempData.confidence > 0.7 ? 'rare' : 'common',
    tags: [...new Set(tempData.names.slice(0, 3))],
    type: 'Character',
    series: 'Discovery Collection',
    confidence: tempData.confidence
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    
    if (!imageData) {
      throw new Error('No image data provided');
    }
    
    console.log('🔍 Starting web scrape analysis...');
    
    // Step 1: Perform image searches
    const searchResults = await performImageSearch(imageData);
    console.log(`Found ${searchResults.length} search results`);
    
    // Step 2: Build temporary database
    const tempData = await buildTempDatabase(searchResults);
    console.log(`Processed data - Names: ${tempData.names.length}, Confidence: ${tempData.confidence}`);
    
    // Step 3: Generate card info
    const cardInfo = await generateCardInfo(tempData);
    console.log('Generated card info:', cardInfo);
    
    return new Response(JSON.stringify({
      extractedText: [cardInfo.title],
      subjects: [cardInfo.title],
      playerName: cardInfo.title,
      team: null,
      year: new Date().getFullYear().toString(),
      sport: null,
      cardNumber: '',
      confidence: cardInfo.confidence,
      analysisType: 'web-scrape',
      analysisMethod: 'image-search-scrape',
      visualAnalysis: {
        subjects: [cardInfo.title],
        colors: ['Unknown'],
        mood: 'Discovered',
        style: 'Web Search',
        theme: 'Character',
        setting: 'Unknown'
      },
      creativeTitle: cardInfo.title,
      creativeDescription: cardInfo.description,
      rarity: cardInfo.rarity,
      requiresManualReview: cardInfo.confidence < 0.6,
      error: false,
      searchResults: searchResults.slice(0, 5),
      tempData: {
        namesFound: tempData.names.length,
        sourcesChecked: tempData.sources.length,
        confidence: tempData.confidence
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('❌ Web scrape analysis error:', error);
    
    return new Response(JSON.stringify({
      extractedText: ['unknown'],
      subjects: ['unknown'],
      playerName: null,
      team: null,
      year: new Date().getFullYear().toString(),
      sport: null,
      cardNumber: '',
      confidence: 0,
      analysisType: 'error',
      analysisMethod: 'web-scrape-failed',
      visualAnalysis: {
        subjects: ['Error'],
        colors: ['Unknown'],
        mood: 'Error',
        style: 'Unknown',
        theme: 'Error',
        setting: 'Unknown'
      },
      creativeTitle: null,
      creativeDescription: null,
      rarity: null,
      requiresManualReview: true,
      error: true,
      message: 'Web scrape analysis failed. Please try again or enter details manually.'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
