
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function searchDuckDuckGo(query: string) {
  try {
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query + ' character creature')}&format=json&no_html=1&skip_disambig=1`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    return {
      abstract: data.Abstract || '',
      abstractText: data.AbstractText || '',
      infobox: data.Infobox || {},
      relatedTopics: data.RelatedTopics || []
    };
  } catch (error) {
    console.error('DuckDuckGo search error:', error);
    return null;
  }
}

async function generateEnhancedCardInfo(extractedData: any, searchResults: any) {
  // If no OpenAI key, return minimal valid response
  if (!openAIApiKey) {
    console.log('No OpenAI key - using basic generation');
    return JSON.stringify({
      title: extractedData.creativeTitle || extractedData.subjects?.[0] || 'Unknown Subject',
      description: extractedData.creativeDescription || 'A unique collectible card.',
      rarity: extractedData.rarity || 'common',
      tags: extractedData.subjects || ['collectible'],
      type: extractedData.analysisType === 'person' ? 'Character' : 'Entity',
      series: 'Custom Collection',
      confidence: extractedData.confidence || 0.5
    });
  }

  const isVisualAnalysis = extractedData.analysisType === 'visual' || extractedData.analysisType === 'fallback';
  
  let prompt;
  if (isVisualAnalysis) {
    const subjects = extractedData.visualAnalysis?.subjects || extractedData.extractedText || ['unknown'];
    const mainSubject = subjects[0] || 'mysterious being';
    
    prompt = `Create an epic trading card from this visual analysis:

Main Subject: ${mainSubject}
All Detected Elements: ${subjects.join(', ')}
Suggested Title: ${extractedData.creativeTitle || 'Unknown Entity'}

Generate a JSON response with epic, engaging card details focusing on creating an engaging, collectible card experience.`;
  } else {
    prompt = `Based on the following data, generate detailed trading card information:

Extracted Data: ${JSON.stringify(extractedData)}
Search Results: ${JSON.stringify(searchResults)}

Generate a JSON response with comprehensive card details.`;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert trading card designer. Create engaging card information based on the provided analysis. Return only valid JSON with fields: title, description, rarity, tags, type, series, confidence.'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 800,
        temperature: isVisualAnalysis ? 0.8 : 0.4
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content;
  } catch (error) {
    console.error('OpenAI generation failed:', error);
    // Return basic valid response as fallback
    return JSON.stringify({
      title: extractedData.creativeTitle || extractedData.subjects?.[0] || 'Unknown Subject',
      description: extractedData.creativeDescription || 'A unique collectible card.',
      rarity: extractedData.rarity || 'common',
      tags: extractedData.subjects || ['collectible'],
      type: extractedData.analysisType === 'person' ? 'Character' : 'Entity',
      series: 'Custom Collection',
      confidence: extractedData.confidence || 0.5
    });
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, extractedData } = await req.json();

    console.log('Enhanced search-card-info processing:', { query, extractedData });

    let searchResults = null;
    if (extractedData.analysisType === 'traditional' && query) {
      searchResults = await searchDuckDuckGo(query);
    }
    
    const cardInfoResponse = await generateEnhancedCardInfo(extractedData, searchResults);
    
    let cardInfo;
    try {
      cardInfo = JSON.parse(cardInfoResponse);
    } catch (parseError) {
      console.log('JSON parse failed, using fallback:', parseError);
      cardInfo = {
        title: extractedData.creativeTitle || extractedData.subjects?.[0] || 'Unknown Subject',
        description: extractedData.creativeDescription || 'A unique collectible card.',
        rarity: extractedData.rarity || 'common',
        tags: extractedData.subjects || ['collectible'],
        type: extractedData.analysisType === 'person' ? 'Character' : 'Entity',
        series: 'Custom Collection',
        confidence: extractedData.confidence || 0.5
      };
    }

    // Boost confidence for visual analysis if reasonable
    if (extractedData.analysisType === 'visual' && cardInfo.confidence < 0.6) {
      cardInfo.confidence = 0.7;
    }

    console.log('Enhanced card info generated:', cardInfo);

    return new Response(JSON.stringify({
      success: true,
      cardInfo,
      analysisType: extractedData.analysisType,
      searchResults: searchResults ? {
        hasResults: true,
        abstract: searchResults.abstract,
        relatedTopics: searchResults.relatedTopics.slice(0, 3)
      } : { hasResults: false }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in enhanced search-card-info function:', error);
    
    return new Response(JSON.stringify({
      success: true,
      cardInfo: {
        title: 'Unknown Subject',
        description: 'A unique collectible card that requires manual details.',
        rarity: 'common',
        tags: ['collectible'],
        type: 'Entity',
        series: 'Custom Collection',
        confidence: 0.3
      },
      analysisType: 'enhanced_fallback',
      searchResults: { hasResults: false },
      note: 'Manual entry recommended for better results'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
